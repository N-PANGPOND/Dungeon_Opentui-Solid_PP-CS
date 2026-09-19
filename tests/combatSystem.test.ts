import { describe, expect, test, mock, afterEach } from "bun:test";
import { CombatSystem } from "../Source-code/System/CombatSystem";
import { Character, Player } from "../Source-code/Character/character";
import { AttackingType, DefensiveType } from "../Source-code/Type-Enum/enum";

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
            [AttackingType.Attack, DefensiveType.Run, 1.25],
            [AttackingType.Attack, DefensiveType.UseItem, 0],

            [AttackingType.Strike, DefensiveType.Defend, 10],
            [AttackingType.Strike, DefensiveType.Counter, 10],
            [AttackingType.Strike, DefensiveType.Run, 2.5],
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

        test("ATK ต่ำกว่า DEF ไม่ควรทำให้ processTurn ส่ง damage ติดลบ", () => {
            const attacker = makeCharacter(5, 5);
            const defender = makeCharacter(10, 10);
            const combat = new CombatSystem(makePlayer(), mapStub as any);
            const restore = mockRandom(1);

            try {
  
                expect(() =>
                    combat.processTurn(
                        attacker,
                        defender,
                        AttackingType.Attack,
                        DefensiveType.Defend,
                    )
                ).toThrow();

                expect(defender.getHp()).toBe(100);
            } finally {
                restore();
            }
        });
    });

    describe("startbattle()", () => {
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
    });

    describe("checkEvasion()", () => {
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
});
