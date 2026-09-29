import { describe, expect, test } from "bun:test";
import {
    getEventScreenProps,
    resolveScreen,
    getShopUIProps,
    getSelectedSlot,
    getCombat,
    isPlayerAttackTurn,
    mapInputKey,
} from "../Tui/gameBridge";
import type { CombatSystem } from "../System/CombatSystem";

const makeGameState = (overrides: Record<string, any> = {}) => ({
    gameScreen: "DUNGEON",
    selectedSlot: null,
    player: { getCoin: () => 100 },
    isGameOver: () => false,
    isVictory: () => false,
    getPendingEvent: () => null,
    getShop: () => null,
    ...overrides,
}) as any;

describe("gameBridge", () => {
    describe("getEventScreenProps()", () => {
        test("ควรคืน pending event จาก GameState", () => {
            const event = { name: "TRAP", grid: [[1]], color: "red" };
            const gs = makeGameState({ getPendingEvent: () => event });
            expect(getEventScreenProps(gs)).toBe(event);
        });
    });

    describe("resolveScreen()", () => {
        test("Game Over ควรมี priority สูงสุด", () => {
            const gs = makeGameState({ gameScreen: "SHOP", isGameOver: () => true, isVictory: () => true, getPendingEvent: () => ({}) });
            expect(resolveScreen(gs)).toBe("GAMEOVER");
        });

        test("Victory ควรมาก่อน pending event และ SHOP", () => {
            const gs = makeGameState({ gameScreen: "SHOP", isVictory: () => true, getPendingEvent: () => ({}) });
            expect(resolveScreen(gs)).toBe("VICTORY");
        });

        test("pending event ควรมี priority เหนือ SHOP", () => {
            const gs = makeGameState({ gameScreen: "SHOP", getPendingEvent: () => ({}) });
            expect(resolveScreen(gs)).toBe("EVENT");
        });

        test("SHOP ควรคืน SHOP เมื่อไม่มีสถานะพิเศษ", () => {
            expect(resolveScreen(makeGameState({ gameScreen: "SHOP" }))).toBe("SHOP");
        });

        test("screen ปกติควรถูกคืนตาม gameScreen", () => {
            expect(resolveScreen(makeGameState({ gameScreen: "INVENTORY" }))).toBe("INVENTORY");
        });
    });

    describe("getShopUIProps()", () => {
        test("ไม่มี shop ควรคืน null", () => {
            expect(getShopUIProps(makeGameState())).toBeNull();
        });

        test("มี shop ควร map item และ coin เป็น UI props", () => {
            const item1 = { getName: () => "POTION", getDesciption: () => "Heal", getPrice: () => 25 };
            const item2 = { getName: () => "BOMB", getDesciption: () => "Escape", getPrice: () => 40 };
            const gs = makeGameState({
                player: { getCoin: () => 75 },
                getShop: () => ({ getItems: () => [item1, item2] }),
            });

            expect(getShopUIProps(gs)).toEqual({
                items: [
                    { index: 0, name: "POTION", description: "Heal", price: 25 },
                    { index: 1, name: "BOMB", description: "Escape", price: 40 },
                ],
                playerCoins: 75,
            });
        });
    });

    describe("getSelectedSlot()", () => {
        test("ควรคืน selectedSlot ปัจจุบัน", () => {
            expect(getSelectedSlot(makeGameState({ selectedSlot: 3 }))).toBe(3);
            expect(getSelectedSlot(makeGameState({ selectedSlot: null }))).toBeNull();
        });
    });

    describe("getCombat() / isPlayerAttackTurn()", () => {
        test("นอก COMBAT ควรคืน null และถือเป็น player attack turn", () => {
            const gs = makeGameState({ gameScreen: "DUNGEON", combatSystem: { isPlayerTurn: () => false } });
            expect(getCombat(gs)).toBeNull();
            expect(isPlayerAttackTurn(gs)).toBe(true);
        });
        
        test("ใน COMBAT ควรคืน combat ปัจจุบัน", () => {
            const combat = {
                isPlayerTurn: () => true,
            } as CombatSystem;

            const gs = makeGameState({
                gameScreen: "COMBAT",
                combatSystem: combat,
            });

            expect(getCombat(gs)).toBe(combat);
            expect(isPlayerAttackTurn(gs)).toBe(true);
        });

        test("ใน COMBAT ตา monster ควรคืน false", () => {
            const combat = { isPlayerTurn: () => false };
            const gs = makeGameState({ gameScreen: "COMBAT", combatSystem: combat });
            expect(isPlayerAttackTurn(gs)).toBe(false);
        });
    });

    describe("mapInputKey()", () => {
        test("นอก COMBAT ควรคืน key เดิม", () => {
            expect(mapInputKey("1", "DUNGEON", false)).toBe("1");
            expect(mapInputKey("x", "INVENTORY", false)).toBe("x");
        });

        test("ตา player attack: 1-4 ควรคงเดิม", () => {
            expect(mapInputKey("1", "COMBAT", true)).toBe("1");
            expect(mapInputKey("4", "COMBAT", true)).toBe("4");
        });

        test("ตา monster attack: 1-4 ควรแปลงเป็น 5-8", () => {
            expect(mapInputKey("1", "COMBAT", false)).toBe("5");
            expect(mapInputKey("2", "COMBAT", false)).toBe("6");
            expect(mapInputKey("3", "COMBAT", false)).toBe("7");
            expect(mapInputKey("4", "COMBAT", false)).toBe("8");
        });

        test("5-8 ใน COMBAT ควรคืน null", () => {
            expect(mapInputKey("5", "COMBAT", true)).toBeNull();
            expect(mapInputKey("8", "COMBAT", false)).toBeNull();
        });

        test("key อื่นนอกจาก 1-8 ควรคืนเดิม", () => {
            expect(mapInputKey("q", "COMBAT", true)).toBe("q");
            expect(mapInputKey("Enter", "COMBAT", false)).toBe("Enter");
        });
    });
});
