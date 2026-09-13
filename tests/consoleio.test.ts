import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test";
import { ConsoleIO } from "../Source-code/ConsoleIO/ConsoleIO";
import { AttackingType, DefensiveType } from "../Source-code/Type-Enum/enum";

describe("ConsoleIO", () => {
    let io: ConsoleIO;

    beforeEach(() => {
        io = new ConsoleIO();
    });

    afterEach(() => {
        mock.restore();
    });

    describe("ShowMessage", () => {
        it("ควรแสดงข้อความในรูปแบบ [type] text", () => {
            const logSpy = mock(() => {});
            const originalLog = console.log;
            console.log = logSpy as unknown as typeof console.log;

            try {
                io.ShowMessage("SYSTEM", "Test message");

                expect(logSpy).toHaveBeenCalledTimes(1);
                expect(logSpy).toHaveBeenCalledWith("[SYSTEM] Test message");
            } finally {
                console.log = originalLog;
            }
        });
    });

    describe("Clear", () => {
        it("ควรเรียก console.clear()", () => {
            const clearSpy = mock(() => {});
            const originalClear = console.clear;
            console.clear = clearSpy as unknown as typeof console.clear;

            try {
                io.Clear();

                expect(clearSpy).toHaveBeenCalledTimes(1);
            } finally {
                console.clear = originalClear;
            }
        });
    });

    describe("showAttackingMenu", () => {
        it("input 1 ควรได้ Attack", () => {
            globalThis.prompt = mock(() => "1");

            expect(io.showAttackingMenu()).toBe(AttackingType.Attack);
        });

        it("input 2 ควรได้ Strike", () => {
            globalThis.prompt = mock(() => "2");

            expect(io.showAttackingMenu()).toBe(AttackingType.Strike);
        });

        it("input 3 ควรได้ UseItem", () => {
            globalThis.prompt = mock(() => "3");

            expect(io.showAttackingMenu()).toBe(AttackingType.UseItem);
        });

        it("input 4 ควรได้ Run", () => {
            globalThis.prompt = mock(() => "4");

            expect(io.showAttackingMenu()).toBe(AttackingType.Run);
        });

        it("input ไม่ถูกต้องควรถามใหม่จนกว่าจะได้ input ที่ถูกต้อง", () => {
            let callCount = 0;
            globalThis.prompt = mock(() => {
                callCount += 1;
                return callCount === 1 ? "99" : "1";
            });

            expect(io.showAttackingMenu()).toBe(AttackingType.Attack);
            expect(globalThis.prompt).toHaveBeenCalledTimes(2);
        });
    });

    describe("showDefensiveMenu", () => {
        it("input 1 ควรได้ Defend", () => {
            globalThis.prompt = mock(() => "1");

            expect(io.showDefensiveMenu()).toBe(DefensiveType.Defend);
        });

        it("input 2 ควรได้ Counter", () => {
            globalThis.prompt = mock(() => "2");

            expect(io.showDefensiveMenu()).toBe(DefensiveType.Counter);
        });

        it("input 3 ควรได้ UseItem", () => {
            globalThis.prompt = mock(() => "3");

            expect(io.showDefensiveMenu()).toBe(DefensiveType.UseItem);
        });

        it("input 4 ควรได้ Run", () => {
            globalThis.prompt = mock(() => "4");

            expect(io.showDefensiveMenu()).toBe(DefensiveType.Run);
        });

        it("input ไม่ถูกต้องควรถามใหม่จนกว่าจะได้ input ที่ถูกต้อง", () => {
            let callCount = 0;
            globalThis.prompt = mock(() => {
                callCount += 1;
                return callCount === 1 ? "99" : "1";
            });

            expect(io.showDefensiveMenu()).toBe(DefensiveType.Defend);
            expect(globalThis.prompt).toHaveBeenCalledTimes(2);
        });
    });
});
