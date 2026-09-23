import { describe, expect, it, mock } from "bun:test";
import {
    ConsoleIO,
    INVENTORY_MAX_SLOTS,
    parseKeyIntent,
} from "../Source-code/ConsoleIO/ConsoleIO";
import { AttackingType, DefensiveType } from "../Source-code/Type-Enum/enum";

describe("parseKeyIntent()", () => {
    it.each([
        ["up", "up"],
        ["w", "up"],
        ["UP", "up"],
        ["ArrowUp", "up"],
        ["arrow-up", "up"],
        ["arrow_up", "up"],
    ])("ควรแปลง %s เป็น MOVE up", (key, direction) => {
        expect(parseKeyIntent(key, "DUNGEON")).toEqual({
            type: "MOVE",
            direction,
        });
    });

    it.each([
        ["down", "down"],
        ["s", "down"],
        ["DOWN", "down"],
        ["ArrowDown", "down"],
        ["arrow-down", "down"],
        ["arrow_down", "down"],
    ])("ควรแปลง %s เป็น MOVE down", (key, direction) => {
        expect(parseKeyIntent(key, "DUNGEON")).toEqual({
            type: "MOVE",
            direction,
        });
    });

    it.each([
        ["left", "left"],
        ["a", "left"],
        ["LEFT", "left"],
        ["ArrowLeft", "left"],
        ["arrow-left", "left"],
        ["arrow_left", "left"],
    ])("ควรแปลง %s เป็น MOVE left", (key, direction) => {
        expect(parseKeyIntent(key, "DUNGEON")).toEqual({
            type: "MOVE",
            direction,
        });
    });

    it.each([
        ["right", "right"],
        ["d", "right"],
        ["RIGHT", "right"],
        ["ArrowRight", "right"],
        ["arrow-right", "right"],
        ["arrow_right", "right"],
    ])("ควรแปลง %s เป็น MOVE right", (key, direction) => {
        expect(parseKeyIntent(key, "DUNGEON")).toEqual({
            type: "MOVE",
            direction,
        });
    });

    it.each([
        ["1", AttackingType.Attack],
        ["2", AttackingType.Strike],
        ["3", AttackingType.UseItem],
        ["4", AttackingType.Run],
        ["5", DefensiveType.Defend],
        ["6", DefensiveType.Counter],
        ["7", DefensiveType.UseItem],
        ["8", DefensiveType.Run],
    ])("ควรแปลง key %s เป็น COMBAT_ACTION", (key, action) => {
        expect(parseKeyIntent(key, "DUNGEON")).toEqual({
            type: "COMBAT_ACTION",
            action,
        });
    });

    it.each([
        ["i", "OPEN_INVENTORY"],
        ["I", "OPEN_INVENTORY"],
        ["p", "PAUSE"],
        ["P", "PAUSE"],
        ["q", "QUIT"],
        ["Q", "QUIT"],
        ["escape", "QUIT"],
        ["ESCAPE", "QUIT"],
    ])("ควรแปลง key %s เป็น %s", (key, type) => {
        expect(parseKeyIntent(key, "DUNGEON")).toEqual({ type });
    });

    it.each(["", "x", "0", "9", "enter", "space", "ArrowX"])(
        "key %s ที่ไม่รู้จักควรเป็น UNKNOWN",
        (key) => {
            expect(parseKeyIntent(key, "DUNGEON")).toEqual({ type: "UNKNOWN" });
        },
    );

    it("ควรตัด arrow prefix ได้เฉพาะรูปแบบที่กำหนด", () => {
        expect(parseKeyIntent("arrow--up", "DUNGEON")).toEqual({ type: "UNKNOWN" });
        expect(parseKeyIntent("arrow_up", "DUNGEON")).toEqual({
            type: "MOVE",
            direction: "up",
        });
    });

    it.each([
        ["1", 0],
        ["8", 7],
    ])("หน้า INVENTORY key %s ควรเลือก slot index %s", (key, index) => {
        expect(parseKeyIntent(key, "INVENTORY")).toEqual({
            type: "SELECT_SLOT",
            index,
        });
    });

    it("หน้า INVENTORY key 9 ซึ่งเกิน 8 ช่องควรเป็น UNKNOWN", () => {
        expect(parseKeyIntent("9", "INVENTORY")).toEqual({ type: "UNKNOWN" });
    });

    it("หน้า INVENTORY key u ควรเป็น USE_ITEM", () => {
        expect(parseKeyIntent("u", "INVENTORY")).toEqual({ type: "USE_ITEM" });
    });

    it("หน้า INVENTORY key x ควรเป็น DISCARD_ITEM", () => {
        expect(parseKeyIntent("x", "INVENTORY")).toEqual({ type: "DISCARD_ITEM" });
    });
});

describe("ConsoleIO", () => {
    const makeIO = () => {
        const addLog = mock((_log: { type: "System"; text: string }) => {});
        const addInventory = mock((_items: any) => {});
        const addPlayer = mock((_player: any) => {});
        const addEnemy = mock((_enemy: any) => {});

        const io = new ConsoleIO(
            addLog,
            addInventory,
            addPlayer,
            addEnemy,
        );

        return {
            io,
            addLog,
            addInventory,
            addPlayer,
            addEnemy,
        };
    };

    const makePlayer = (overrides: Record<string, unknown> = {}) => ({
        getHp: () => 120,
        getMaxHp: () => 160,
        getAtk: () => 30,
        getDef: () => 5,
        getCoin: () => 75,
        getPosition: () => ({ x: 4, y: 2 }),
        getInventory: () => ({
            getItems: () => [],
        }),
        ...overrides,
    });

    const makeGameState = (overrides: Record<string, unknown> = {}) =>
        ({
            player: makePlayer(),
            gameScreen: "DUNGEON",
            ...overrides,
        }) as any;

    describe("constructor", () => {
        it("ควรสร้าง ConsoleIO ได้โดยไม่ส่ง callback", () => {
            expect(() => new ConsoleIO()).not.toThrow();
        });

        it("callback ทุกตัวควรเป็น optional", () => {
            const io = new ConsoleIO();

            expect(() => io.ShowMessage({ type: "System", text: "test" })).not.toThrow();
            expect(() => io.ShowInventory(makeGameState())).not.toThrow();
            expect(() => io.ShowPlayer(makeGameState())).not.toThrow();
            expect(() => io.ShowEnemy(makeGameState())).not.toThrow();
        });
    });

    describe("ShowMessage()", () => {
        it("ควรส่ง log ไปที่ addLog โดยไม่แก้ข้อมูล", () => {
            const { io, addLog } = makeIO();
            const log = { type: "System" as const, text: "Hello Dungeon" };

            io.ShowMessage(log);

            expect(addLog).toHaveBeenCalledTimes(1);
            expect(addLog).toHaveBeenCalledWith(log);
        });
    });

    describe("getPlayerUIProps()", () => {
        it("ควรแปลงข้อมูล Player เป็น PlayerUIProps ครบทุก field", () => {
            const { io } = makeIO();
            const gs = makeGameState({
                player: makePlayer({
                    getHp: () => 90,
                    getMaxHp: () => 160,
                    getAtk: () => 35,
                    getDef: () => 12,
                    getCoin: () => 250,
                    getPosition: () => ({ x: 10, y: 20 }),
                }),
            });

            expect(io.getPlayerUIProps(gs)).toEqual({
                name: "HERO",
                hp: 90,
                maxHp: 160,
                atk: 35,
                def: 12,
                coin: 250,
                position: { x: 10, y: 20 },
            });
        });

        it("ควรอ่านค่าปัจจุบันจาก Player ทุกครั้งที่เรียก", () => {
            const { io } = makeIO();
            let hp = 100;

            const gs = makeGameState({
                player: makePlayer({
                    getHp: () => hp,
                }),
            });

            expect(io.getPlayerUIProps(gs).hp).toBe(100);

            hp = 50;

            expect(io.getPlayerUIProps(gs).hp).toBe(50);
        });
    });

    describe("ShowPlayer()", () => {
        it("ควรส่ง PlayerUIProps ที่สร้างจาก getPlayerUIProps ไปที่ addPlayer", () => {
            const { io, addPlayer } = makeIO();
            const gs = makeGameState();

            io.ShowPlayer(gs);

            expect(addPlayer).toHaveBeenCalledTimes(1);
            expect(addPlayer).toHaveBeenCalledWith({
                name: "HERO",
                hp: 120,
                maxHp: 160,
                atk: 30,
                def: 5,
                coin: 75,
                position: { x: 4, y: 2 },
            });
        });
    });

    describe("getInventoryUIProps()", () => {
        it("Inventory ว่างควรคืน items เป็น array ว่างและ maxSlots = 8", () => {
            const { io } = makeIO();
            const gs = makeGameState();

            expect(io.getInventoryUIProps(gs)).toEqual({
                items: [],
                maxSlots: INVENTORY_MAX_SLOTS,
            });
        });

        it("ควรแปลง Item ทุกชิ้นเป็น name + description", () => {
            const { io } = makeIO();
            const gs = makeGameState({
                player: makePlayer({
                    getInventory: () => ({
                        getItems: () => [
                            {
                                item: {
                                    name: "POTION",
                                    description: "Restores 25 HP",
                                    price: 20,
                                },
                            },
                            {
                                item: {
                                    name: "HIGH_POTION",
                                    description: "Restores 50 HP",
                                    price: 50,
                                },
                            },
                            {
                                item: {
                                    name: "SMOKE_BOMB",
                                    description: "Escape from battle",
                                    price: 100,
                                },
                            },
                        ],
                    }),
                }),
            });

            expect(io.getInventoryUIProps(gs)).toEqual({
                items: [
                    {
                        name: "POTION",
                        description: "Restores 25 HP",
                    },
                    {
                        name: "HIGH_POTION",
                        description: "Restores 50 HP",
                    },
                    {
                        name: "SMOKE_BOMB",
                        description: "Escape from battle",
                    },
                ],
                maxSlots: 8,
            });
        });

        it("ควรรักษาลำดับของ Item ตาม Inventory", () => {
            const { io } = makeIO();
            const names = ["A", "B", "C"];

            const gs = makeGameState({
                player: makePlayer({
                    getInventory: () => ({
                        getItems: () =>
                            names.map((name) => ({
                                item: {
                                    name,
                                    description: `${name} description`,
                                    price: 10,
                                },
                            })),
                    }),
                }),
            });

            expect(io.getInventoryUIProps(gs).items.map((x: any) => x.name)).toEqual(
                names,
            );
        });
    });

    describe("ShowInventory()", () => {
        it("ควรส่ง InventoryUIProps ไปที่ addInventory", () => {
            const { io, addInventory } = makeIO();
            const gs = makeGameState({
                player: makePlayer({
                    getInventory: () => ({
                        getItems: () => [
                            {
                                item: {
                                    name: "POTION",
                                    description: "Restores 25 HP",
                                    price: 20,
                                },
                            },
                        ],
                    }),
                }),
            });

            io.ShowInventory(gs);

            expect(addInventory).toHaveBeenCalledTimes(1);
            expect(addInventory).toHaveBeenCalledWith({
                items: [
                    {
                        name: "POTION",
                        description: "Restores 25 HP",
                    },
                ],
                maxSlots: 8,
            });
        });
    });

    describe("getEnemyUIProps()", () => {
        it("ถ้าไม่ได้อยู่หน้า COMBAT ควรคืน null", () => {
            const { io } = makeIO();
            const gs = makeGameState({
                gameScreen: "DUNGEON",
            });

            expect(io.getEnemyUIProps(gs)).toBeNull();
        });

        it("ถ้าอยู่หน้า COMBAT แต่ไม่มี combatSystem ควรคืน null", () => {
            const { io } = makeIO();
            const gs = makeGameState({
                gameScreen: "COMBAT",
            });

            expect(io.getEnemyUIProps(gs)).toBeNull();
        });

        it("ถ้าอยู่หน้า COMBAT ควรอ่าน monster stats และคืน EnemyUIProps", () => {
            const { io } = makeIO();
            const combat = {
                getMonsterStats: mock(() => ({
                    hp: 80,
                    maxHp: 100,
                    atk: 25,
                    def: 10,
                    luc: 5,
                    agi: 12,
                    coin: 40,
                })),
                monster: {
                    MonsterType: "ELITE MONS",
                },
            };

            const gs = makeGameState({
                gameScreen: "COMBAT",
                combatSystem: combat,
            });

            expect(io.getEnemyUIProps(gs)).toEqual({
                name: "ELITE MONS",
                hp: 80,
                maxHp: 100,
                atk: 25,
                def: 10,
            });

            expect(combat.getMonsterStats).toHaveBeenCalledTimes(1);
        });

        it("ถ้า MonsterType ไม่มีค่า ควรใช้ชื่อ MONSTER", () => {
            const { io } = makeIO();
            const combat = {
                getMonsterStats: () => ({
                    hp: 50,
                    maxHp: 50,
                    atk: 15,
                    def: 3,
                    luc: 0,
                    agi: 5,
                    coin: 10,
                }),
                monster: {},
            };

            const gs = makeGameState({
                gameScreen: "COMBAT",
                combatSystem: combat,
            });

            expect(io.getEnemyUIProps(gs)).toEqual({
                name: "MONSTER",
                hp: 50,
                maxHp: 50,
                atk: 15,
                def: 3,
            });
        });

        it("ถ้าอ่าน MonsterType แล้วเกิด error ควรใช้ชื่อ MONSTER", () => {
            const { io } = makeIO();

            const combat = {
                getMonsterStats: () => ({
                    hp: 30,
                    maxHp: 40,
                    atk: 10,
                    def: 2,
                    luc: 0,
                    agi: 5,
                    coin: 5,
                }),
            };

            Object.defineProperty(combat, "monster", {
                get() {
                    throw new Error("monster unavailable");
                },
            });

            const gs = makeGameState({
                gameScreen: "COMBAT",
                combatSystem: combat,
            });

            expect(io.getEnemyUIProps(gs)).toEqual({
                name: "MONSTER",
                hp: 30,
                maxHp: 40,
                atk: 10,
                def: 2,
            });
        });
    });

    describe("ShowEnemy()", () => {
        it("เมื่ออยู่หน้า COMBAT ควรส่ง EnemyUIProps ไปที่ addEnemy", () => {
            const { io, addEnemy } = makeIO();
            const gs = makeGameState({
                gameScreen: "COMBAT",
                combatSystem: {
                    getMonsterStats: () => ({
                        hp: 70,
                        maxHp: 100,
                        atk: 20,
                        def: 8,
                        luc: 2,
                        agi: 10,
                        coin: 20,
                    }),
                    monster: {
                        MonsterType: "NORMAL MONS",
                    },
                },
            });

            io.ShowEnemy(gs);

            expect(addEnemy).toHaveBeenCalledTimes(1);
            expect(addEnemy).toHaveBeenCalledWith({
                name: "NORMAL MONS",
                hp: 70,
                maxHp: 100,
                atk: 20,
                def: 8,
            });
        });

        it("นอกหน้า COMBAT ควรส่ง null ไปที่ addEnemy ตาม implementation ปัจจุบัน", () => {
            const { io, addEnemy } = makeIO();
            const gs = makeGameState({
                gameScreen: "DUNGEON",
            });

            io.ShowEnemy(gs);

            expect(addEnemy).toHaveBeenCalledTimes(1);
            expect(addEnemy).toHaveBeenCalledWith(null);
        });
    });
});