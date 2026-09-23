import { describe, expect, test, beforeEach, afterEach, mock } from "bun:test";
import { GameLoop } from "../Source-code/Game/gameloop";
import { AttackingType } from "../Source-code/Type-Enum/enum";

describe("GameLoop - ทดสอบครอบคลุม", () => {
    let loop: GameLoop;
    let logs: { type: "System"; text: string }[];

    beforeEach(() => {
        logs = [];
        loop = new GameLoop((log) => logs.push(log));
    });

    test("constructor ควรสร้าง loop ที่ยังไม่เริ่ม พร้อม GameState และ ConsoleIO", () => {
        expect(loop.getGameState()).toBeDefined();
        expect(loop.getConsoleIo()).toBeDefined();
        expect((loop as any).isRunning).toBe(false);
        expect(loop.getGameState().gameScreen).toBe("DUNGEON");
    });

    test("handleInput ก่อน start ไม่ควรทำงาน", () => {
        const state = loop.getGameState();
        const spy = mock(() => true);
        (state as any).movePlayer = spy;

        loop.handleInput("d");

        expect(spy).not.toHaveBeenCalled();
        expect((loop as any).isRunning).toBe(false);
    });

    test("start ควรเปิดให้รับ input", () => {
        loop.start();
        expect((loop as any).isRunning).toBe(true);
    });

    test("MOVE intent ควรส่งต่อให้ GameState.movePlayer", () => {
        loop.start();
        const state = loop.getGameState();
        const spy = mock(() => true);
        (state as any).movePlayer = spy;

        loop.handleInput("d");

        expect(spy).toHaveBeenCalledWith("right");
    });

    test.each([
        ["w", "up"],
        ["s", "down"],
        ["a", "left"],
        ["d", "right"],
    ] as const)("%s ควรแปลงเป็นการเดิน %s", (key, direction) => {
        loop.start();
        const state = loop.getGameState();
        const spy = mock(() => true);
        (state as any).movePlayer = spy;

        loop.handleInput(key);

        expect(spy).toHaveBeenCalledWith(direction);
    });

    test("combat action ควรถูกส่งต่อเฉพาะตอนอยู่หน้า COMBAT", () => {
        loop.start();
        const state = loop.getGameState();
        const spy = mock(() => {});

        (state as any).handleCombatAction = spy;
        state.gameScreen = "COMBAT";

        loop.handleInput("1");

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(AttackingType.Attack);
    });

    test("combat action นอกหน้า COMBAT ควรถูกละเว้น", () => {
        loop.start();
        const state = loop.getGameState();
        const spy = mock(() => {});

        (state as any).handleCombatAction = spy;
        state.gameScreen = "DUNGEON";

        loop.handleInput("1");

        expect(spy).not.toHaveBeenCalled();
    });

    test("การเปิด Inventory ควรเรียก toggleInventory", () => {
        loop.start();
        const state = loop.getGameState();
        const spy = mock(() => {});

        (state as any).toggleInventory = spy;

        loop.handleInput("i");

        expect(spy).toHaveBeenCalledTimes(1);
    });

    test("หน้า INVENTORY key 2 ควรเลือก slot index 1", () => {
        loop.start();
        const state = loop.getGameState();
        const spy = mock(() => {});
        state.gameScreen = "INVENTORY";

        (state as any).selectSlot = spy;

        loop.handleInput("2");

        expect(spy).toHaveBeenCalledWith(1);
    });

    test("หน้า INVENTORY key u ควรเรียก useSelectedItem", () => {
        loop.start();
        const state = loop.getGameState();
        const spy = mock(() => {});
        state.gameScreen = "INVENTORY";

        (state as any).useSelectedItem = spy;

        loop.handleInput("u");

        expect(spy).toHaveBeenCalledTimes(1);
    });

    test("หน้า INVENTORY key x ควรเรียก discardSelectedItem", () => {
        loop.start();
        const state = loop.getGameState();
        const spy = mock(() => {});
        state.gameScreen = "INVENTORY";

        (state as any).discardSelectedItem = spy;

        loop.handleInput("x");

        expect(spy).toHaveBeenCalledTimes(1);
    });

    test("input ที่ไม่รู้จักควรถูกละเว้น", () => {
        loop.start();
        const state = loop.getGameState();
        const moveSpy = mock(() => true);
        const inventorySpy = mock(() => {});

        (state as any).movePlayer = moveSpy;
        (state as any).toggleInventory = inventorySpy;

        loop.handleInput("this-is-not-a-key");

        expect(moveSpy).not.toHaveBeenCalled();
        expect(inventorySpy).not.toHaveBeenCalled();
        expect((loop as any).isRunning).toBe(true);
    });

    test("QUIT ควรจบเกม", () => {
        loop.start();

        loop.handleInput("q");

        expect((loop as any).isRunning).toBe(false);
        expect(logs.at(-1)?.text).toBe("จบเกม ขอบคุณที่เล่น");
    });

    test("escape ควรจบเกมเช่นเดียวกับ QUIT", () => {
        loop.start();

        loop.handleInput("escape");

        expect((loop as any).isRunning).toBe(false);
        expect(logs.at(-1)?.text).toBe("จบเกม ขอบคุณที่เล่น");
    });

    test("end ควรหยุด loop และบันทึก log", () => {
        loop.start();

        loop.end();

        expect((loop as any).isRunning).toBe(false);
        expect(logs.at(-1)?.text).toBe("จบเกม ขอบคุณที่เล่น");
    });

    test("เมื่อ Game Over ควรแสดงข้อความแพ้และจบเกม", () => {
        loop.start();
        const state = loop.getGameState();

        (state as any).isGameOver = mock(() => true);
        (state as any).isVictory = mock(() => false);

        loop.handleInput("unknown");

        expect((loop as any).isRunning).toBe(false);
        expect(logs.some((x) => x.text === "คุณแพ้แล้ว...")).toBe(true);
        expect(logs.at(-1)?.text).toBe("จบเกม ขอบคุณที่เล่น");
    });

    test("เมื่อ Victory ควรแสดงข้อความชนะและจบเกม", () => {
        loop.start();
        const state = loop.getGameState();

        (state as any).isGameOver = mock(() => false);
        (state as any).isVictory = mock(() => true);

        loop.handleInput("unknown");

        expect((loop as any).isRunning).toBe(false);
        expect(logs.some((x) => x.text === "คุณชนะแล้ว!")).toBe(true);
        expect(logs.at(-1)?.text).toBe("จบเกม ขอบคุณที่เล่น");
    });

    test("Game Over ควรมี priority เหนือ Victory", () => {
        loop.start();
        const state = loop.getGameState();

        (state as any).isGameOver = mock(() => true);
        (state as any).isVictory = mock(() => true);

        loop.handleInput("unknown");

        expect(logs.some((x) => x.text === "คุณแพ้แล้ว...")).toBe(true);
        expect(logs.some((x) => x.text === "คุณชนะแล้ว!")).toBe(false);
        expect((loop as any).isRunning).toBe(false);
    });

    test("getGameState ควรคืน GameState instance เดิม", () => {
        expect(loop.getGameState()).toBe(loop.getGameState());
    });

    test("getConsoleIo ควรคืน ConsoleIO instance เดิม", () => {
        expect(loop.getConsoleIo()).toBe(loop.getConsoleIo());
    });
});