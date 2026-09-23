import { describe, expect, test, beforeEach, afterEach, mock } from "bun:test";
import { GameState } from "../Source-code/Game/State";
import { DungeonMap, type MapConfig } from "../Source-code/DungeonMap/DungeonMap";
import { EndingType, AttackingType } from "../Source-code/Type-Enum/enum";
import { Item } from "../Source-code/Item-Inventory/Item";

describe("GameState - high coverage", () => {
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

    test("constructor initializes the default state", () => {
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

    test("pending event getter and clear work", () => {
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
        ] as const)("handles direction %s", (direction: "up" | "down" | "left" | "right", expectedDelta: { x: number; y: number; }) => {
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

            // Avoid triggering the wife/event path during this directional test.
            mock.module("../Source-code/Event/Event", () => ({
                Event: class {
                    Trap() { return 1; }
                    Treasure() { return 1; }
                    Potion() { return new Item({ name: "POTION", description: "test", price: 1 }); }
                    Shop() { return {}; }
                }
            }));

            const before = { ...game.player.Position };
            const moved = game.movePlayer(direction);

            expect(moved).toBe(true);
            expect(game.player.Position).toEqual({
                x: before.x + expectedDelta.x,
                y: before.y + expectedDelta.y,
            });
            expect(game.exploredTiles.size).toBe(1);
        });

        test("returns false when target is a wall", () => {
            const moved = game.movePlayer("down");
            expect(moved).toBe(false);
            expect(game.player.Position).toEqual({ x: 0, y: 0 });
            expect(logs.at(-1)?.text).toBe("is Not Walkable");
        });

        test("returns false while paused", () => {
            (game as any).isPause = true;
            expect(game.movePlayer("right")).toBe(false);
            expect(game.player.Position).toEqual({ x: 0, y: 0 });
        });

        test("returns false outside DUNGEON", () => {
            game.gameScreen = "INVENTORY";
            expect(game.movePlayer("right")).toBe(false);
            expect(game.player.Position).toEqual({ x: 0, y: 0 });
        });
    });

    test("finding the wife sets rescue state and logs once", () => {
        game.player.Position = { x: 1, y: 0 };
        game.checkTileEvent();

        expect(game.didRescueWife()).toBe(true);
        expect(logs.some((x) => x.text.includes("You found your wife"))).toBe(true);

        const count = logs.length;
        game.checkTileEvent();
        expect(logs.length).toBe(count);
    });

    test("a previously triggered tile does not trigger another event", () => {
        game.player.Position = { x: 2, y: 0 };
        (game as any).eventTriggeredTiles.add("2,0");

        game.checkTileEvent();

        expect(game.getPendingEvent()).toBeNull();
        expect(game.getShop()).toBeNull();
    });

    test("eventNothing logs the nothing event", () => {
        game.eventNothing();
        expect(logs.at(-1)?.text).toBe("Nothing happened here.");
    });

    test("eventTrap creates pending event and damages player", () => {
        Math.random = () => 0.5;
        const before = game.player.getHp();

        game.eventTrap();

        expect(game.getPendingEvent()?.name).toBe("⚠ TRAP!");
        expect(game.getPendingEvent()?.isChoice).toBeUndefined();
        expect(game.player.getHp()).toBe(before - 11);
        expect(logs.at(-1)?.text).toContain("Trap triggered! Lost 11 HP!");
    });

    test("eventTreasure creates pending event and adds coins", () => {
        Math.random = () => 0.5;
        const before = game.player.getCoin();

        game.eventTreasure();

        expect(game.getPendingEvent()?.name).toBe("★ TREASURE!");
        expect(game.player.getCoin()).toBe(before + 51);
        expect(logs.at(-1)?.text).toContain("Found Treasure! Gained 51 Coins!");
    });

    test("eventPotion creates a choice event", () => {
        Math.random = () => 0;
        game.eventPotion();

        const pending = game.getPendingEvent();
        expect(pending?.isChoice).toBe(true);
        expect(pending?.potionItem?.getName()).toBe("POTION");
        expect(pending?.name).toContain("POTION");
    });

    test("takePotion returns false when no potion is waiting", () => {
        expect(game.takePotion()).toBe(false);
    });

    test("takePotion adds the found potion and clears the event", () => {
        Math.random = () => 0;
        game.eventPotion();

        expect(game.takePotion()).toBe(true);
        expect(game.player.getInventory().getItems()).toHaveLength(1);
        expect(game.getPendingEvent()).toBeNull();
    });

    test("takePotion returns false when inventory is full", () => {
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

    test("leavePotion clears a waiting potion", () => {
        Math.random = () => 0;
        game.eventPotion();
        game.leavePotion();

        expect(game.getPendingEvent()).toBeNull();
        expect(logs.at(-1)?.text).toContain("Left POTION behind.");
    });

    test("leavePotion is safe when there is no potion", () => {
        game.leavePotion();
        expect(game.getPendingEvent()).toBeNull();
    });

    test("eventShop creates a shop screen and pending event", () => {
        game.eventShop();

        expect(game.gameScreen).toBe("SHOP");
        expect(game.getShop()).not.toBeNull();
        expect(game.getPendingEvent()?.name).toBe("● SHOP");
        expect(logs.at(-1)?.text).toContain("Welcome to the Shop!");
    });

    test("buyFromShop and sellToShop return false when no shop exists", () => {
        expect(game.buyFromShop(0)).toBe(false);
        expect(game.sellToShop(0)).toBe(false);
    });

    test("buyFromShop delegates to the current shop", () => {
        game.eventShop();
        const shop = game.getShop()!;
        const buySpy = mock(() => ({ success: true, message: "bought" }));
        (shop as any).buyItem = buySpy;

        expect(game.buyFromShop(0)).toBe(true);
        expect(buySpy).toHaveBeenCalledWith(0, game.player);
        expect(logs.at(-1)?.text).toBe("bought");
    });

    test("sellToShop delegates to the current shop", () => {
        game.eventShop();
        const shop = game.getShop()!;
        const sellSpy = mock(() => ({ success: true, message: "sold" }));
        (shop as any).sellItem = sellSpy;

        expect(game.sellToShop(2)).toBe(true);
        expect(sellSpy).toHaveBeenCalledWith(2, game.player);
        expect(logs.at(-1)?.text).toBe("sold");
    });

    test("leaveShop clears shop, event and returns to dungeon", () => {
        game.eventShop();
        game.leaveShop();

        expect(game.getShop()).toBeNull();
        expect(game.getPendingEvent()).toBeNull();
        expect(game.gameScreen).toBe("DUNGEON");
        expect(logs.at(-1)?.text).toContain("returned to the dungeon");
    });

    test("leaveShop is safe without an active shop", () => {
        game.leaveShop();
        expect(game.gameScreen).toBe("DUNGEON");
        expect(game.getShop()).toBeNull();
    });

    test("eventCombat enters COMBAT", () => {
        game.eventCombat();

        expect(game.gameScreen).toBe("COMBAT");
        expect(logs.some((x) => x.text.includes("คุณเจอมอนสเตอร์!!"))).toBe(true);
        expect(logs.some((x) => x.text.includes("Monster stats:"))).toBe(true);
    });

    test("handleCombatAction does nothing outside COMBAT", () => {
        game.handleCombatAction(AttackingType.Attack);
        expect(game.gameScreen).toBe("DUNGEON");
    });

    test("handleCombatAction delegates while in COMBAT", () => {
        game.eventCombat();
        const combat = (game as any).combatSystem;
        const spy = mock(() => {});
        combat.startbattle = spy;

        game.handleCombatAction(AttackingType.Attack);
        expect(spy).toHaveBeenCalledWith(AttackingType.Attack);
    });

    test("isGameOver becomes true at zero HP", () => {
        (game.player as any).hp = 0;
        expect(game.isGameOver()).toBe(true);
    });

    test("checkEnding returns NONE when not at exit", () => {
        expect(game.checkEnding()).toBe(EndingType.NONE);
        expect(game.isVictory()).toBe(false);
    });

    test("checkEnding returns BAD_END at exit without wife", () => {
        game.player.Position = { x: 3, y: 0 };
        expect(game.checkEnding()).toBe(EndingType.BAD_END);
        expect(game.isVictory()).toBe(true);
    });

    test("checkEnding returns GOOD_END at exit after rescuing wife", () => {
        (game as any).isGetWife = true;
        game.player.Position = { x: 3, y: 0 };

        expect(game.checkEnding()).toBe(EndingType.GOOD_END);
        expect(game.didRescueWife()).toBe(true);
        expect(game.isVictory()).toBe(true);
    });

    test("toggleInventory switches DUNGEON <-> INVENTORY", () => {
        game.toggleInventory();
        expect(game.gameScreen).toBe("INVENTORY");

        game.toggleInventory();
        expect(game.gameScreen).toBe("DUNGEON");
    });

    test("toggleInventory does nothing on another screen", () => {
        game.gameScreen = "SHOP";
        game.toggleInventory();
        expect(game.gameScreen).toBe("SHOP");
    });

    test("selectSlot ignores non-inventory screen", () => {
        const item = new Item({ name: "A", description: "A", price: 1 });
        game.player.getInventory().addItem(item);

        game.selectSlot(0);
        expect(game.selectedSlot).toBeNull();
    });

    test("selectSlot ignores negative and out-of-range indexes", () => {
        const item = new Item({ name: "A", description: "A", price: 1 });
        game.player.getInventory().addItem(item);
        game.gameScreen = "INVENTORY";

        game.selectSlot(-1);
        expect(game.selectedSlot).toBeNull();

        game.selectSlot(1);
        expect(game.selectedSlot).toBeNull();
    });

    test("selectSlot accepts a valid index", () => {
        const item = new Item({ name: "A", description: "A", price: 1 });
        game.player.getInventory().addItem(item);
        game.gameScreen = "INVENTORY";

        game.selectSlot(0);
        expect(game.selectedSlot).toBe(0);
    });

    test("useSelectedItem ignores non-inventory screen", () => {
        game.selectedSlot = 0;
        game.useSelectedItem();
        expect(game.selectedSlot).toBe(0);
    });

    test("useSelectedItem ignores null selection", () => {
        game.gameScreen = "INVENTORY";
        game.useSelectedItem();
        expect(game.selectedSlot).toBeNull();
    });

    test("useSelectedItem uses and clears a valid selected item", () => {
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

    test("discardSelectedItem ignores non-inventory screen", () => {
        const item = new Item({ name: "A", description: "A", price: 1 });
        game.player.getInventory().addItem(item);
        game.selectedSlot = 0;

        game.discardSelectedItem();

        expect(game.player.getInventory().getItems()).toHaveLength(1);
        expect(game.selectedSlot).toBe(0);
    });

    test("discardSelectedItem ignores null selection", () => {
        game.gameScreen = "INVENTORY";
        game.discardSelectedItem();
        expect(game.selectedSlot).toBeNull();
    });

    test("discardSelectedItem removes the selected item and clears selection", () => {
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

    test("private Pause toggles the pause state used by movement", () => {
        const state = game as any;
        expect(state.isPause).toBe(false);

        state.Pause();
        expect(state.isPause).toBe(true);
        expect(game.movePlayer("right")).toBe(false);

        state.Pause();
        expect(state.isPause).toBe(false);
    });
});
