import { describe, expect, it, mock } from "bun:test";
import { ConsoleIO } from "../Source-code/ConsoleIO/ConsoleIO";
import { AttackingType, DefensiveType } from "../Source-code/Type-Enum/enum";

const makeIO = () => {
    const setMessage = mock((_value: string) => {});
    const setStatus = mock((_value: string) => {});
    const setSelectedIndex = mock((_index: number) => {});
    const io = new ConsoleIO(setMessage, setStatus, setSelectedIndex);
    return { io, setMessage, setStatus, setSelectedIndex };
};

describe("ConsoleIO", () => {
    it("ShowMessage ควรส่ง [type] text ไปที่ setMessage", () => {
        const { io, setMessage } = makeIO();
        io.ShowMessage("SYSTEM", "Test message");
        expect(setMessage).toHaveBeenCalledWith("[SYSTEM] Test message");
    });

    it("Clear ควรส่งข้อความว่างไปที่ setMessage", () => {
        const { io, setMessage } = makeIO();
        io.Clear();
        expect(setMessage).toHaveBeenCalledWith("");
    });

    it("ShowStatus ควรส่ง status ไปที่ setStatus", () => {
        const { io, setStatus } = makeIO();
        io.ShowStatus("HP: 100/100");
        expect(setStatus).toHaveBeenCalledWith("HP: 100/100");
    });

    it("ถ้ายังไม่มี menu handleMenuKey ควรคืน false", () => {
        const { io } = makeIO();
        expect(io.handleMenuKey("down")).toBe(false);
    });

    it("attacking menu เริ่มที่ Attack", async () => {
        const { io, setSelectedIndex, setMessage } = makeIO();
        const p = io.showAttackingMenu();
        expect(setSelectedIndex).toHaveBeenCalledWith(0);
        expect(setMessage).toHaveBeenCalledWith("↑↓ เลือก, Enter ยืนยัน");
        io.handleMenuKey("return");
        await expect(p).resolves.toBe(AttackingType.Attack);
    });

    it("attacking menu down 1/2/3 ครั้งควรได้ Strike/Use Item/Run", async () => {
        const { io } = makeIO();

        let p = io.showAttackingMenu();
        io.handleMenuKey("down"); io.handleMenuKey("return");
        await expect(p).resolves.toBe(AttackingType.Strike);

        p = io.showAttackingMenu();
        io.handleMenuKey("down"); io.handleMenuKey("down"); io.handleMenuKey("return");
        await expect(p).resolves.toBe(AttackingType.UseItem);

        p = io.showAttackingMenu();
        io.handleMenuKey("down"); io.handleMenuKey("down"); io.handleMenuKey("down");
        io.handleMenuKey("return");
        await expect(p).resolves.toBe(AttackingType.Run);
    });

    it("attacking menu up จาก index 0 ต้องวนไป index 3", () => {
        const { io, setSelectedIndex } = makeIO();
        io.showAttackingMenu();
        setSelectedIndex.mockClear();
        expect(io.handleMenuKey("up")).toBe(true);
        expect(setSelectedIndex).toHaveBeenCalledWith(3);
    });

    it("attacking menu down จาก index 3 ต้องวนกลับ index 0", () => {
        const { io, setSelectedIndex } = makeIO();
        io.showAttackingMenu();
        io.handleMenuKey("down"); io.handleMenuKey("down"); io.handleMenuKey("down");
        setSelectedIndex.mockClear();
        expect(io.handleMenuKey("down")).toBe(true);
        expect(setSelectedIndex).toHaveBeenCalledWith(0);
    });

    it("key ที่ไม่เกี่ยวกับ menu ควรคืน false", () => {
        const { io } = makeIO();
        io.showAttackingMenu();
        expect(io.handleMenuKey("x")).toBe(false);
    });

    it("เมื่อกด return แล้ว menu ควรถูกปิด", async () => {
        const { io } = makeIO();
        const p = io.showAttackingMenu();
        io.handleMenuKey("return");
        await expect(p).resolves.toBe(AttackingType.Attack);
        expect(io.handleMenuKey("down")).toBe(false);
    });

    it("defensive menu เริ่มที่ Defend", async () => {
        const { io } = makeIO();
        const p = io.showDefensiveMenu();
        io.handleMenuKey("return");
        await expect(p).resolves.toBe(DefensiveType.Defend);
    });

    it("defensive menu down 1/2/3 ครั้งควรได้ Counter/Use Item/Run", async () => {
        const { io } = makeIO();

        let p = io.showDefensiveMenu();
        io.handleMenuKey("down"); io.handleMenuKey("return");
        await expect(p).resolves.toBe(DefensiveType.Counter);

        p = io.showDefensiveMenu();
        io.handleMenuKey("down"); io.handleMenuKey("down"); io.handleMenuKey("return");
        await expect(p).resolves.toBe(DefensiveType.UseItem);

        p = io.showDefensiveMenu();
        io.handleMenuKey("down"); io.handleMenuKey("down"); io.handleMenuKey("down");
        io.handleMenuKey("return");
        await expect(p).resolves.toBe(DefensiveType.Run);
    });
});
