import { describe, it, expect, mock } from "bun:test"
import { Inventory } from "../Source-code/Item-Inventory/inventory";
import { Item } from "../Source-code/Item-Inventory/Item";
import { Character } from "../Source-code/Character/character";

describe("Inventory System", () => {
    // Mock target character เพื่อใช้ทดสอบกับ useItem
    const dummyCharacter = new Character({
        maxHp: 100,
        hp: 100,
        atk: 10,
        def: 5,
        luc: 5,
        agi: 5,
        coin: 0,
    });

    it("ควรเพิ่มไอเทมเข้า Inventory ได้ถูกต้อง", () => {
        const inv = new Inventory();
        const testItem = new Item("Potion", "Heals 20 HP", 10);

        const result = inv.addItem(testItem);

        expect(result).toBe(true);
        expect(inv.getItems().length).toBe(1);
        expect(inv.getItems()[0].name).toBe("Potion");
    });

    it("เมื่อมีไอเทมครบ 8 ชิ้น isFull() ต้องเป็น true และ addItem ชิ้นที่ 9 ต้องล้มเหลว", () => {
        const inv = new Inventory();

        for (let i = 0; i < 8; i++) {
            const added = inv.addItem(new Item(`Item ${i + 1}`, "Desc", 10));
            expect(added).toBe(true);
        }

        expect(inv.isFull()).toBe(true);

        const excessItem = new Item("Excess Item", "Desc", 10);
        const addedExcess = inv.addItem(excessItem);

        expect(addedExcess).toBe(false);
        expect(inv.getItems().length).toBe(8);
    });

    it("ควรลบไอเทมตาม slotIndex ได้ถูกต้อง", () => {
        const inv = new Inventory();
        const item1 = new Item("Item 1", "Desc", 10);
        const item2 = new Item("Item 2", "Desc", 10);

        inv.addItem(item1);
        inv.addItem(item2);

        inv.removeItem(0);

        expect(inv.getItems().length).toBe(1);
        expect(inv.getItems()[0].name).toBe("Item 2");
    });

    it("เมื่อเรียก useItem() ฟังก์ชัน effect ต้องถูก trigger และไอเทมต้องถูกลบออกจากช่อง", () => {
        const inv = new Inventory();
        const effectMock = mock(() => {});
        const usableItem = new Item("Mock Potion", "Desc", 10, effectMock);

        inv.addItem(usableItem);

        // ใช้ไอเทมใน slot 0
        inv.useItem(0, dummyCharacter);

        // ตรวจสอบว่า Addeffects ถูกเรียกด้วย dummyCharacter หรือไม่
        expect(effectMock).toHaveBeenCalledTimes(1);
        expect(effectMock).toHaveBeenCalledWith(dummyCharacter);

        // ช่องกระเป๋าต้องว่างลงหลังใช้งาน
        expect(inv.getItems().length).toBe(0);
    });

    it("ถ้าเรียก useItem() ที่ slot ว่างหรือ index ไม่มีอยู่จริง จะต้องไม่ error และไม่ลบอะไร", () => {
        const inv = new Inventory();
        const item = new Item("Item 1", "Desc", 10);
        inv.addItem(item);

        // ลองใช้ slot 99 ที่ไม่มีอยู่
        inv.useItem(99, dummyCharacter);

        expect(inv.getItems().length).toBe(1);
    });
});