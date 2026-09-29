import { describe, expect, test, mock, afterEach } from "bun:test";
import { CombatSystem } from "../System/CombatSystem";
import { Character, Player } from "../Character/character";
import { Itemfactory } from "../Item-Inventory/Item";
import { AttackingType, DefensiveType } from "../Type-Enum/enum";

const mapStub = {
    getExitPos: () => ({ x: 59, y: 59 }),
};

const makeCharacter = (atk = 10, def = 5) =>
    new Character({
        maxHp: 100,
        hp: 100,
        atk,
        def,
        luc: 0,
        agi: 8,
        coin: 50,
    });

const makePlayer = (hp = 100) =>
    new Player(
        {
            maxHp: 100,
            hp,
            atk: 10,
            def: 5,
            luc: 0,
            agi: 8,
            coin: 50,
        },
        { x: 0, y: 0 },
    );

const mockRandom = (...values: number[]) => {
    const original = Math.random;
    Math.random = mock(() => values.shift() ?? 1);

    return () => {
        Math.random = original;
    };
};

describe("CombatSystem", () => {
    afterEach(() => {
        mock.restore();
    });

    describe("calculateDamage()", () => {
        test("ควรคำนวณ damage ผ่าน wrapper และใช้ Math.random", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const restore = mockRandom(0.5);

            try {
                expect(
                    combat.calculateDamage(makeCharacter(20), makeCharacter(5), 1),
                ).toBe(15);
            } finally {
                restore();
            }
        });

        test("เมื่อ Math.random ทำให้เกิด Critical ควรได้ damage x2", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const source = new Character({
                maxHp: 100,
                hp: 100,
                atk: 20,
                def: 5,
                luc: 50,
                agi: 8,
                coin: 50,
            });
            const target = makeCharacter();
            const restore = mockRandom(0.1);

            try {
                expect(combat.calculateDamage(source, target, 1)).toBe(30);
            } finally {
                restore();
            }
        });
    });

    describe("processTurn()", () => {
        const cases = [
            [AttackingType.Attack, DefensiveType.Defend, 2.5],
            [AttackingType.Attack, DefensiveType.Counter, 7.5],
            [AttackingType.Attack, DefensiveType.Run, 10],
            [AttackingType.Attack, DefensiveType.UseItem, 0],

            [AttackingType.Strike, DefensiveType.Defend, 10],
            [AttackingType.Strike, DefensiveType.Counter, 10],
            [AttackingType.Strike, DefensiveType.Run, 12.5],
            [AttackingType.Strike, DefensiveType.UseItem, 0],

            [AttackingType.UseItem, DefensiveType.Defend, 0],
            [AttackingType.UseItem, DefensiveType.Counter, 0],
            [AttackingType.UseItem, DefensiveType.Run, 0],
            [AttackingType.UseItem, DefensiveType.UseItem, 0],

            [AttackingType.Run, DefensiveType.Defend, 0],
            [AttackingType.Run, DefensiveType.Counter, 0],
            [AttackingType.Run, DefensiveType.Run, 0],
            [AttackingType.Run, DefensiveType.UseItem, 0],
        ] as const;

        test.each(cases)(
            "%s + %s ควรใช้ multiplier ตามตาราง",
            (attack, defense, expectedDamage) => {
                const attacker = makeCharacter();
                const defender = makeCharacter();
                const combat = new CombatSystem(makePlayer(), mapStub as any);
                const restore = mockRandom(1);

                try {
                    combat.processTurn(attacker, defender, attack, defense);

                    if (
                        attack === AttackingType.Strike &&
                        defense === DefensiveType.Counter
                    ) {
                        expect(attacker.getHp()).toBe(90);
                        expect(defender.getHp()).toBe(100);
                    } else {
                        expect(defender.getHp()).toBe(100 - expectedDamage);
                        expect(attacker.getHp()).toBe(100);
                    }
                } finally {
                    restore();
                }
            },
        );

        test("processTurn ควรส่ง log ความเสียหายหลังโจมตีสำเร็จ", () => {
            const logs: { type: "System"; text: string }[] = [];
            const attacker = makeCharacter();
            const defender = makeCharacter();
            const combat = new CombatSystem(makePlayer(), mapStub as any, (log) => logs.push(log));
            const restore = mockRandom(1);

            try {
                combat.processTurn(attacker, defender, AttackingType.Attack, DefensiveType.Defend);

                expect(logs).toHaveLength(1);
                expect(logs[0]?.text).toContain("damage");
                expect(logs[0]?.text).toContain("HP เหลือ");
            } finally { restore(); }
        });

        test("Strike + Counter ควรสะท้อน damage กลับไปหา attacker", () => {
            const attacker = makeCharacter();
            const defender = makeCharacter();
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const restore = mockRandom(1);

            try {
                combat.processTurn(
                    attacker,
                    defender,
                    AttackingType.Strike,
                    DefensiveType.Counter,
                );

                expect(attacker.getHp()).toBe(90);
                expect(defender.getHp()).toBe(100);
            } finally {
                restore();
            }
        });

        test("ATK ต่ำกว่า DEF ควรได้ damage ขั้นต่ำ 0.1 ตาม implementation ปัจจุบัน", () => {
            const attacker = makeCharacter(5, 5);
            const defender = makeCharacter(10, 10);
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const restore = mockRandom(1);

            try {
                combat.processTurn(
                    attacker,
                    defender,
                    AttackingType.Attack,
                    DefensiveType.Defend,
                );

                expect(defender.getHp()).toBe(99.9);
            } finally {
                restore();
            }
        });
    });

    describe("Run", () => {
        test("Attack + Run เมื่อ random ต่ำกว่า 0.25 ควรหนีสำเร็จ", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const attacker = makeCharacter();
            const defender = makeCharacter();
            const restore = mockRandom(0.24);

            try {
                expect(combat.processTurn(attacker, defender, AttackingType.Attack, DefensiveType.Run)).toBe(true);
                expect(combat.isBattleOver().Over).toBe(true);
                expect(combat.isBattleOver().Escaped).toBe(true);
            } finally { restore(); }
        });

        test("Attack + Run เมื่อ random = 0.25 ควรหนีไม่สำเร็จ", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const attacker = makeCharacter();
            const defender = makeCharacter();
            const restore = mockRandom(0.25);

            try {
                expect(combat.processTurn(attacker, defender, AttackingType.Attack, DefensiveType.Run)).toBe(false);
                expect(combat.isBattleOver().Over).toBe(false);
                expect(defender.getHp()).toBe(90);
            } finally { restore(); }
        });
        test("Run + Run เมื่อ random ต่ำกว่า 0.5 ควรหนีสำเร็จ", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const attacker = makeCharacter();
            const defender = makeCharacter();
            const restore = mockRandom(0.49);

            try {
                combat.processTurn(
                    attacker,
                    defender,
                    AttackingType.Run,
                    DefensiveType.Run,
                );

                expect(combat.isBattleOver().Over).toBe(true);
                expect(combat.isBattleOver().Escaped).toBe(true);
            } finally {
                restore();
            }
        });
    });

        test("เริ่มต้นการต่อสู้ยังไม่ควรจบ battle", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            expect(combat.isBattleOver().Over).toBe(false);
        });

        test("Monster ตายแล้วควรถือว่า battle จบ", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const monster = (combat as any).monster as Character;
            monster.takeDamage(999);

            expect(combat.isBattleOver().Over).toBe(true);
        });

        test("getMonsterStats ควรคืนค่า stat ปัจจุบันของ Monster", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            expect(combat.getMonsterStats()).toEqual({
                maxHp: 100,
                hp: 100,
                atk: 10,
                def: 5,
                luc: 5,
                agi: 5,
                coin: 35,
            });
        });

        test("getMonsterStats ควรสะท้อน HP ปัจจุบันหลัง Monster ได้รับ damage", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const monster = (combat as any).monster as Character;
            monster.takeDamage(25);

            expect(combat.getMonsterStats().hp).toBe(75);
        });
    });

    describe("startbattle()", () => {
        test("เมื่อใช้ item ที่เลือกควรใช้ไอเท็มและอยู่ในเทิร์นเดิม", () => {
            const player = makePlayer(50);
            player.addItem(Itemfactory.CreatePOTION());
            const combat = new CombatSystem(player, mapStub as any);

            combat.usePlayerItem(0);

            expect(player.getHp()).toBe(75);
            expect(player.getInventory().getItems()).toHaveLength(0);
            expect(combat.isPlayerTurn()).toBe(true);
        });

        test("เมื่อไม่มีไอเท็มจะไม่เปลี่ยนเทิร์น", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);

            combat.usePlayerItem(0);

            expect(combat.isPlayerTurn()).toBe(true);
        });

        test("เมื่อใช้ item ระหว่างเทิร์นมอนสเตอร์ควรกลับมาเป็นเทิร์นผู้เล่น", () => {
            const player = makePlayer(50);
            player.addItem(Itemfactory.CreatePOTION_ATK());
            const combat = new CombatSystem(player, mapStub as any);
            (combat as any).isPlayerAttacker = false;

            combat.usePlayerItem(0);

            expect(combat.isPlayerTurn()).toBe(true);
        });

        test("เมื่อ Player เป็น Attacker และส่ง DefensiveType ควร throw Error", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);

            expect(() =>
                combat.startbattle(DefensiveType.Defend)
            ).toThrow("Player is Attacking But Action Is Not AttackingType");
        });

        test("เมื่อ Player เป็น Attacker และส่ง AttackingType ที่ถูกต้อง ควรเข้าสู่ turn ได้", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const restore = mockRandom(0.99, 1);

            try {
                expect(() =>
                    combat.startbattle(AttackingType.Attack)
                ).not.toThrow();
            } finally {
                restore();
            }
        });

        test("เมื่อ Player เป็น Defender และส่ง AttackingType ควร throw Error", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            (combat as any).isPlayerAttacker = false;

            expect(() =>
                combat.startbattle(AttackingType.Attack)
            ).toThrow("Player is Defensive But Action Is Not DefensiveType");
        });

        test("เมื่อ Player เป็น Defender และส่ง DefensiveType ที่ถูกต้อง ควรเข้าสู่ turn ได้", () => {
            const player = makePlayer();
            const combat = new CombatSystem(player, mapStub as any);
            (combat as any).isPlayerAttacker = false;
            const restore = mockRandom(0.5, 1);

            try {
                expect(() =>
                    combat.startbattle(DefensiveType.Defend)
                ).not.toThrow();

                expect(player.getHp()).toBe(97.5);
            } finally {
                restore();
            }
        });

        test("ถ้า Player ตายแล้ว startbattle ไม่ควรทำงานต่อ", () => {
            const player = makePlayer(0);
            const combat = new CombatSystem(player, mapStub as any);

            expect(() =>
                combat.startbattle(AttackingType.Attack)
            ).not.toThrow();

            expect(player.getHp()).toBe(0);
        });

        test("ถ้า Monster ตายแล้ว startbattle ไม่ควรทำงานต่อ", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const monster = (combat as any).monster as Character;

            monster.takeDamage(999);

            expect(() =>
                combat.startbattle(AttackingType.Attack)
            ).not.toThrow();

            expect(monster.isDead()).toBe(true);
        });
        test("กด Run แล้วควรหนีออกจากการต่อสู้ได้เมื่อสุ่มสำเร็จ", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const monster = (combat as any).monster;

            monster.decideDefensiveAction = mock(() => DefensiveType.Run);

            const restore = mockRandom(0.49);

            try {
                combat.startbattle(AttackingType.Run);

                expect(combat.isBattleOver()).toEqual(
                    expect.objectContaining({
                    Over: true,
                    Escaped: true,
                }),
        );
            } finally {
                restore();
            }
        });
        test("Run สำเร็จแล้วยังจะยังได้รับ damage", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const attacker = makeCharacter();
            const defender = makeCharacter();
            const restore = mockRandom(0.24);

            try {
                expect(
                    combat.processTurn(
                        attacker,
                        defender,
                        AttackingType.Attack,
                        DefensiveType.Run,
                 ),
                ).toBe(true);

                expect(defender.getHp()).toBe(90);
            } finally {
                restore();
            }
        });
    });

    describe("Smoke Bomb", () => {
        test("ใช้ Smoke Bomb กับ BOSS ควรตั้งสถานะ smokeWithBoss", () => {
            const bossMap = { getExitPos: () => ({ x: 0, y: 2 }) };
            const player = makePlayer();
            player.addItem(Itemfactory.CreateSMOKE_BOMB());
            const combat = new CombatSystem(player, bossMap as any);

            expect(combat.usePlayerItem(0)).toBe(true);
            expect(combat.getSmokeWithBoss()).toBe(true);
            expect(player.getInventory().getItems()).toHaveLength(0);
        });

    });

    describe("Smoke Bomb", () => {
        test("ใช้ Smoke Bomb แล้ว random < 0.8 ควรหนีสำเร็จและลบไอเทม", () => {
            const player = makePlayer();
            player.addItem(Itemfactory.CreateSMOKE_BOMB());
            const combat = new CombatSystem(player, mapStub as any);
            const restore = mockRandom(0.79);

            try {
                expect(combat.usePlayerItem(0)).toBe(true);
                expect(player.getInventory().getItems()).toHaveLength(0);
                expect(combat.getHasFled()).toBe(true);
                expect(combat.isBattleOver()).toMatchObject({ Over: true, Escaped: true });
                expect(combat.isPlayerTurn()).toBe(true);
            } finally { restore(); }
        });

        test("ใช้ Smoke Bomb แล้ว random = 0.8 ควรไม่หนีสำเร็จแต่ไอเทมถูกใช้ไป", () => {
            const player = makePlayer();
            player.addItem(Itemfactory.CreateSMOKE_BOMB());
            const combat = new CombatSystem(player, mapStub as any);
            const restore = mockRandom(0.8);

            try {
                expect(combat.usePlayerItem(0)).toBe(true);
                expect(player.getInventory().getItems()).toHaveLength(0);
                expect(combat.getHasFled()).toBe(false);
                expect(combat.isBattleOver().Over).toBe(false);
            } finally { restore(); }
        });

        test("ใช้ slot ที่ไม่มีไอเทมควรคืน false และไม่จบ battle", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            expect(combat.usePlayerItem(0)).toBe(false);
            expect(combat.isBattleOver().Over).toBe(false);
        });
    });

    describe("checkEvasion()", () => {
        test("เมื่อ random เท่ากับ AGI ควรหลบได้", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const character = new Character({ maxHp: 100, hp: 100, atk: 10, def: 5, luc: 0, agi: 80, coin: 0 });
            const restore = mockRandom(0.8);
            try {
                expect(combat.checkEvasion(character)).toBe(true);
            } finally { restore(); }
        });

        test("AGI = 100 และ random ใกล้ 1 ควรหลบได้", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const character = new Character({ maxHp: 100, hp: 100, atk: 10, def: 5, luc: 0, agi: 100, coin: 0 });
            const restore = mockRandom(0.999999);
            try {
                expect(combat.checkEvasion(character)).toBe(true);
            } finally { restore(); }
        });

        test("ควรใช้ Math.random และ EvadeCheck เพื่อตรวจการหลบ", () => {
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const character = new Character({
                maxHp: 100,
                hp: 100,
                atk: 10,
                def: 5,
                luc: 0,
                agi: 80,
                coin: 0,
            });
            const restore = mockRandom(0.5);

            try {
                expect(combat.checkEvasion(character)).toBe(true);
            } finally {
                restore();
            }
        });
    });