import { describe, expect, test, beforeEach, afterEach, mock } from "bun:test";
import { GameState } from "../Source-code/Game/State";
import { DungeonMap, type MapConfig } from "../Source-code/DungeonMap/DungeonMap";
import { EndingType, AttackingType } from "../Source-code/Type-Enum/enum";
import { Item } from "../Source-code/Item-Inventory/Item";

describe("GameState - ทดสอบครอบคลุม", () => {
    let game: GameState;
    let logs: { type: "System"; text: string }[];
    let originalRandom: Math["random"];

    const makeMap = (wifePos = { x: 1, y: 0 }): DungeonMap => {
        const config: MapConfig = {
            spawnPos: { x: 0, y: 0 },
            wifePos: [wifePos],
            exitPos: { x: 3, y: 0 },
            layout: [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
            ],
        };
        return new DungeonMap(config);
    };

    beforeEach(() => {
        originalRandom = Math.random;
        Math.random = () => 0.99;
        logs = [];
        game = new GameState(makeMap(), (log) => logs.push(log));
    });

    afterEach(() => {
        Math.random = originalRandom;
    });

    test("constructor ควรกำหนด state เริ่มต้นถูกต้อง", () => {
        expect(game.gameScreen).toBe("DUNGEON");
        expect(game.player.getHp()).toBe(160);
        expect(game.player.getCoin()).toBe(50);
        expect(game.player.getPosition()).toEqual({ x: 0, y: 0 });
        expect(game.exploredTiles.size).toBe(0);
        expect(game.selectedSlot).toBeNull();
        expect(game.getPendingEvent()).toBeNull();
        expect(game.getShop()).toBeNull();
        expect(game.didRescueWife()).toBe(false);
        expect(game.isGameOver()).toBe(false);
    });

    test("getter ของ pending event และ clear ควรทำงานถูกต้อง", () => {
        game.eventTreasure();
        expect(game.getPendingEvent()).not.toBeNull();

        game.clearPendingEvent();
        expect(game.getPendingEvent()).toBeNull();
    });

    describe("movePlayer", () => {
        test.each([
            ["up", { x: 0, y: -1 }],
            ["down", { x: 0, y: 1 }],
            ["left", { x: -1, y: 0 }],
            ["right", { x: 1, y: 0 }],
        ] as const)("ทิศทาง %s ควรขยับผู้เล่นถูกต้อง", (direction: "up" | "down" | "left" | "right", expectedDelta: { x: number; y: number; }) => {
            const map = new DungeonMap({
                spawnPos: { x: 1, y: 1 },
                wifePos: [{ x: 3, y: 1 }],
                exitPos: { x: 4, y: 1 },
                layout: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ],
            });
            game = new GameState(map, (log) => logs.push(log));

            const before = { ...game.player.Position };
            const moved = game.movePlayer(direction);

            expect(moved).toBe(true);
            expect(game.player.Position).toEqual({
                x: before.x + expectedDelta.x,
                y: before.y + expectedDelta.y,
            });
            expect(game.exploredTiles.size).toBe(1);
        });

        test("เป้าหมายเป็นกำแพงควรคืน false และไม่ขยับ", () => {
            const moved = game.movePlayer("down");
            expect(moved).toBe(false);
            expect(game.player.Position).toEqual({ x: 0, y: 0 });
            expect(logs.at(-1)?.text).toBe("is Not Walkable");
        });


        test("จากขอบซ้ายเดินซ้ายควรติดขอบและไม่ขยับ", () => {
            const moved = game.movePlayer("left");

            expect(moved).toBe(false);
            expect(game.player.Position).toEqual({ x: 0, y: 0 });
        });

        test("ตอน pause ควรคืน false และไม่ขยับ", () => {
            (game as any).isPause = true;
            expect(game.movePlayer("right")).toBe(false);
            expect(game.player.Position).toEqual({ x: 0, y: 0 });
        });

        test("นอกหน้า DUNGEON ควรคืน false และไม่ขยับ", () => {
            game.gameScreen = "INVENTORY";
            expect(game.movePlayer("right")).toBe(false);
            expect(game.player.Position).toEqual({ x: 0, y: 0 });
        });
    });

    test("เจอภรรยาควรเปลี่ยน rescue state และ log เพียงครั้งเดียว", () => {
        game.player.Position = { x: 1, y: 0 };
        game.checkTileEvent();

        expect(game.didRescueWife()).toBe(true);
        expect(logs.some((x) => x.text.includes("You found your wife"))).toBe(true);

        const count = logs.length;
        game.checkTileEvent();
        expect(logs.length).toBe(count);
    });

    test("tile ที่เคย trigger แล้วไม่ควรเกิด event ซ้ำ", () => {
        game.player.Position = { x: 2, y: 0 };
        (game as any).eventTriggeredTiles.add("2,0");

        game.checkTileEvent();

        expect(game.getPendingEvent()).toBeNull();
        expect(game.getShop()).toBeNull();
    });

    describe("checkTileEvent() - ขอบเขต probability", () => {
        const prepareEventTile = () => {
            game.player.Position = { x: 2, y: 0 };
            (game as any).eventTriggeredTiles.clear();
            game.clearPendingEvent();
            game.gameScreen = "DUNGEON";
        };

        test("random = 0 ควรเลือก Monster event", () => {
            prepareEventTile();
            Math.random = () => 0;

            game.checkTileEvent();

            expect(game.gameScreen).toBe("COMBAT");
        });

        test("random ที่ตรงขอบ 0.25/1.05 ควรเปลี่ยนจาก Monster เป็น Trap", () => {
            prepareEventTile();
            Math.random = () => 0.25 / 1.05;

            game.checkTileEvent();

            expect(game.getPendingEvent()?.name).toBe("⚠ TRAP!");
        });

        test("random ที่ตรงขอบ 0.32/1.05 ควรเปลี่ยนเป็น Treasure", () => {
            prepareEventTile();
            Math.random = () => 0.32 / 1.05;

            game.checkTileEvent();

            expect(game.getPendingEvent()?.name).toBe("★ TREASURE!");
        });

        test("random ที่ตรงขอบ 0.42/1.05 ควรเปลี่ยนเป็น Potion", () => {
            prepareEventTile();
            Math.random = () => 0.42 / 1.05;

            game.checkTileEvent();

            expect(game.getPendingEvent()?.isChoice).toBe(true);
        });

        test("random ที่ตรงขอบ 0.46/1.05 ควรเปลี่ยนเป็น Shop", () => {
            prepareEventTile();
            Math.random = () => 0.46 / 1.05;

            game.checkTileEvent();

            expect(game.gameScreen).toBe("SHOP");
        });

        test("random ที่ตรงขอบ 0.55/1.05 ควรเปลี่ยนเป็น Nothing", () => {
            prepareEventTile();
            Math.random = () => 0.55 / 1.05;

            game.checkTileEvent();

            expect(logs.at(-1)?.text).toBe("Nothing happened here.");
        });
    });

    test("eventNothing ควรบันทึกข้อความ Nothing", () => {
        game.eventNothing();
        expect(logs.at(-1)?.text).toBe("Nothing happened here.");
    });

    test("eventTrap ควรสร้าง pending event และลด HP ผู้เล่น", () => {
        Math.random = () => 0.5;
        const before = game.player.getHp();

        game.eventTrap();

        expect(game.getPendingEvent()?.name).toBe("⚠ TRAP!");
        expect(game.getPendingEvent()?.isChoice).toBeUndefined();
        expect(game.player.getHp()).toBe(before - 11);
        expect(logs.at(-1)?.text).toContain("Trap triggered! Lost 11 HP!");
    });

    test("eventTreasure ควรสร้าง pending event และเพิ่ม coin", () => {
        Math.random = () => 0.5;
        const before = game.player.getCoin();

        game.eventTreasure();

        expect(game.getPendingEvent()?.name).toBe("★ TREASURE!");
        expect(game.player.getCoin()).toBe(before + 51);
        expect(logs.at(-1)?.text).toContain("Found Treasure! Gained 51 Coins!");
    });

    test("eventPotion ควรสร้าง choice event", () => {
        Math.random = () => 0;
        game.eventPotion();

        const pending = game.getPendingEvent();
        expect(pending?.isChoice).toBe(true);
        expect(pending?.potionItem?.getName()).toBe("POTION");
        expect(pending?.name).toContain("POTION");
    });

    test("takePotion ควรคืน false เมื่อไม่มี potion รอรับ", () => {
        expect(game.takePotion()).toBe(false);
    });

    test("takePotion ควรเพิ่ม potion และล้าง event", () => {
        Math.random = () => 0;
        game.eventPotion();

        expect(game.takePotion()).toBe(true);
        expect(game.player.getInventory().getItems()).toHaveLength(1);
        expect(game.getPendingEvent()).toBeNull();
    });

    test("takePotion ควรคืน false เมื่อ inventory เต็ม", () => {
        const filler = new Item({ name: "FILLER", description: "x", price: 1 });
        for (let i = 0; i < 8; i++) {
            expect(game.player.getInventory().addItem(filler)).toBe(true);
        }

        Math.random = () => 0;
        game.eventPotion();

        expect(game.takePotion()).toBe(false);
        expect(game.player.getInventory().getItems()).toHaveLength(8);
        expect(game.getPendingEvent()).toBeNull();
        expect(logs.at(-1)?.text).toContain("Inventory is full!");
    });

    test("leavePotion ควรล้าง potion ที่รออยู่", () => {
        Math.random = () => 0;
        game.eventPotion();
        game.leavePotion();

        expect(game.getPendingEvent()).toBeNull();
        expect(logs.at(-1)?.text).toContain("Left POTION behind.");
    });

    test("leavePotion ไม่ควร error เมื่อไม่มี potion", () => {
        game.leavePotion();
        expect(game.getPendingEvent()).toBeNull();
    });

    test("eventShop ควรเปิดหน้า SHOP และสร้าง pending event", () => {
        game.eventShop();

        expect(game.gameScreen).toBe("SHOP");
        expect(game.getShop()).not.toBeNull();
        expect(game.getPendingEvent()?.name).toBe("● SHOP");
        expect(logs.at(-1)?.text).toContain("Welcome to the Shop!");
    });

    test("buyFromShop และ sellToShop ควรคืน false เมื่อไม่มี shop", () => {
        expect(game.buyFromShop(0)).toBe(false);
        expect(game.sellToShop(0)).toBe(false);
    });

    test("buyFromShop ควรส่งต่อไปยัง shop ปัจจุบัน", () => {
        game.eventShop();
        const shop = game.getShop()!;
        const buySpy = mock(() => ({ success: true, message: "bought" }));
        (shop as any).buyItem = buySpy;

        expect(game.buyFromShop(0)).toBe(true);
        expect(buySpy).toHaveBeenCalledWith(0, game.player);
        expect(logs.at(-1)?.text).toBe("bought");
    });

    test("sellToShop ควรส่งต่อไปยัง shop ปัจจุบัน", () => {
        game.eventShop();
        const shop = game.getShop()!;
        const sellSpy = mock(() => ({ success: true, message: "sold" }));
        (shop as any).sellItem = sellSpy;

        expect(game.sellToShop(2)).toBe(true);
        expect(sellSpy).toHaveBeenCalledWith(2, game.player);
        expect(logs.at(-1)?.text).toBe("sold");
    });

    test("leaveShop ควรล้าง shop/event และกลับ DUNGEON", () => {
        game.eventShop();
        game.leaveShop();

        expect(game.getShop()).toBeNull();
        expect(game.getPendingEvent()).toBeNull();
        expect(game.gameScreen).toBe("DUNGEON");
        expect(logs.at(-1)?.text).toContain("returned to the dungeon");
    });

    test("leaveShop ไม่ควร error เมื่อไม่มี shop", () => {
        game.leaveShop();
        expect(game.gameScreen).toBe("DUNGEON");
        expect(game.getShop()).toBeNull();
    });

    test("eventCombat ควรเข้าสู่หน้า COMBAT", () => {
        game.eventCombat();

        expect(game.gameScreen).toBe("COMBAT");
        expect(logs.some((x) => x.text.includes("คุณเจอมอนสเตอร์!!"))).toBe(true);
        expect(logs.some((x) => x.text.includes("Monster stats:"))).toBe(true);
    });

    test("handleCombatAction นอก COMBAT ควรไม่ทำงาน", () => {
        game.handleCombatAction(AttackingType.Attack);
        expect(game.gameScreen).toBe("DUNGEON");
    });

    test("handleCombatAction ใน COMBAT ควรส่งต่อ action", () => {
        game.eventCombat();
        const combat = (game as any).combatSystem;
        const spy = mock(() => {});
        combat.startbattle = spy;

        game.handleCombatAction(AttackingType.Attack);
        expect(spy).toHaveBeenCalledWith(AttackingType.Attack);
    });

    test("HP = 0 ควรทำให้ isGameOver เป็น true", () => {
        (game.player as any).hp = 0;
        expect(game.isGameOver()).toBe(true);
    });

    test("ยังไม่ถึง Exit ควรได้ EndingType.NONE", () => {
        expect(game.checkEnding()).toBe(EndingType.NONE);
        expect(game.isVictory()).toBe(false);
    });

    test("ถึง Exit แต่ยังไม่ช่วยภรรยาควรได้ BAD_END", () => {
        game.player.Position = { x: 3, y: 0 };
        expect(game.checkEnding()).toBe(EndingType.BAD_END);
        expect(game.isVictory()).toBe(true);
    });

    test("ถึง Exit หลังช่วยภรรยาควรได้ GOOD_END", () => {
        (game as any).isGetWife = true;
        game.player.Position = { x: 3, y: 0 };

        expect(game.checkEnding()).toBe(EndingType.GOOD_END);
        expect(game.didRescueWife()).toBe(true);
        expect(game.isVictory()).toBe(true);
    });

    test("toggleInventory ควรสลับ DUNGEON <-> INVENTORY", () => {
        game.toggleInventory();
        expect(game.gameScreen).toBe("INVENTORY");

        game.toggleInventory();
        expect(game.gameScreen).toBe("DUNGEON");
    });

    test("toggleInventory นอก DUNGEON/INVENTORY ควรไม่ทำงาน", () => {
        game.gameScreen = "SHOP";
        game.toggleInventory();
        expect(game.gameScreen).toBe("SHOP");
    });

    test("selectSlot นอก INVENTORY ควรถูกละเว้น", () => {
        const item = new Item({ name: "A", description: "A", price: 1 });
        game.player.getInventory().addItem(item);

        game.selectSlot(0);
        expect(game.selectedSlot).toBeNull();
    });

    test("selectSlot index ติดลบหรือเกินช่วงควรถูกละเว้น", () => {
        const item = new Item({ name: "A", description: "A", price: 1 });
        game.player.getInventory().addItem(item);
        game.gameScreen = "INVENTORY";

        game.selectSlot(-1);
        expect(game.selectedSlot).toBeNull();

        game.selectSlot(1);
        expect(game.selectedSlot).toBeNull();
    });

    test("selectSlot index ที่ถูกต้องควรเลือก slot ได้", () => {
        const item = new Item({ name: "A", description: "A", price: 1 });
        game.player.getInventory().addItem(item);
        game.gameScreen = "INVENTORY";

        game.selectSlot(0);
        expect(game.selectedSlot).toBe(0);
    });

    test("useSelectedItem นอก INVENTORY ควรถูกละเว้น", () => {
        game.selectedSlot = 0;
        game.useSelectedItem();
        expect(game.selectedSlot).toBe(0);
    });

    test("useSelectedItem เมื่อยังไม่เลือก slot ควรถูกละเว้น", () => {
        game.gameScreen = "INVENTORY";
        game.useSelectedItem();
        expect(game.selectedSlot).toBeNull();
    });

    test("useSelectedItem ที่ถูกต้องควรใช้ item และล้าง selection", () => {
        const item = new Item(
            { name: "HEAL", description: "heal", price: 1 },
            (target) => target.heal(10),
        );
        game.player.takeDamage(20);
        game.player.getInventory().addItem(item);
        game.gameScreen = "INVENTORY";
        game.selectedSlot = 0;

        game.useSelectedItem();

        expect(game.player.getHp()).toBe(150);
        expect(game.player.getInventory().getItems()).toHaveLength(0);
        expect(game.selectedSlot).toBeNull();
    });

    test("discardSelectedItem นอก INVENTORY ควรถูกละเว้น", () => {
        const item = new Item({ name: "A", description: "A", price: 1 });
        game.player.getInventory().addItem(item);
        game.selectedSlot = 0;

        game.discardSelectedItem();

        expect(game.player.getInventory().getItems()).toHaveLength(1);
        expect(game.selectedSlot).toBe(0);
    });

    test("discardSelectedItem เมื่อยังไม่เลือก slot ควรถูกละเว้น", () => {
        game.gameScreen = "INVENTORY";
        game.discardSelectedItem();
        expect(game.selectedSlot).toBeNull();
    });

    test("discardSelectedItem ควรลบ item ที่เลือกและล้าง selection", () => {
        const a = new Item({ name: "A", description: "A", price: 1 });
        const b = new Item({ name: "B", description: "B", price: 2 });
        game.player.getInventory().addItem(a);
        game.player.getInventory().addItem(b);
        game.gameScreen = "INVENTORY";
        game.selectedSlot = 1;

        game.discardSelectedItem();

        expect(game.player.getInventory().getItems()).toEqual([a]);
        expect(game.selectedSlot).toBeNull();
    });

    test("Pause ควรสลับสถานะ pause ที่ใช้ควบคุมการเดิน", () => {
        const state = game as any;
        expect(state.isPause).toBe(false);

        state.Pause();
        expect(state.isPause).toBe(true);
        expect(game.movePlayer("right")).toBe(false);

        state.Pause();
        expect(state.isPause).toBe(false);
    });
});