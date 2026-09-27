import { describe, expect, it, mock } from "bun:test";
import { Inventory } from "../Source-code/Item-Inventory/Inventory";
import { Item } from "../Source-code/Item-Inventory/Item";
import { Character } from "../Source-code/Character/character";

const makeCharacter = () => new Character({
    maxHp: 100, hp: 100, atk: 10, def: 5, luc: 5, agi: 5, coin: 0,
});

const makeItem = (name: string) => new Item({
    name,
    description: "Test item",
    price: 10,
});

describe("Inventory System", () => {
    it("ควรเพิ่มไอเทมเข้า Inventory ได้ถูกต้อง", () => {
        const inv = new Inventory();
        const item = makeItem("Potion");
        expect(inv.addItem(item)).toBe(true);
        expect(inv.getItems()).toHaveLength(1);
        expect(inv.getItems()[0]?.item.name).toBe("Potion");
    });

    it("ครบ 8 ช่องแล้ว isFull เป็น true และช่องที่ 9 เพิ่มไม่ได้", () => {
        const inv = new Inventory();

        for (let i = 0; i < 8; i++) {
            expect(inv.addItem(makeItem(`Item ${i + 1}`))).toBe(true);
        }

        expect(inv.isFull()).toBe(true);
        expect(inv.addItem(makeItem("Item 9"))).toBe(false);
        expect(inv.getItems()).toHaveLength(8);
    });

    it("ไอเทมชื่อเดียวกันไม่ stack และใช้คนละ slot", () => {
        const inv = new Inventory();
        const item1 = makeItem("Potion");
        const item2 = makeItem("Potion");

        inv.addItem(item1);
        inv.addItem(item2);

        expect(inv.getItems()).toHaveLength(2);
        expect(inv.getItems()[0]).toBe(item1);
        expect(inv.getItems()[1]).toBe(item2);
    });

    it("ควรลบไอเทมตาม slotIndex", () => {
        const inv = new Inventory();
        const item1 = makeItem("Item 1");
        const item2 = makeItem("Item 2");

        inv.addItem(item1);
        inv.addItem(item2);
        inv.removeItem(0);

        expect(inv.getItems()).toHaveLength(1);
        expect(inv.getItems()[0]).toBe(item2);
    });

    it("useItem ควรเรียก effect ด้วย target และลบไอเทมออก", () => {
        const inv = new Inventory();
        const target = makeCharacter();
        const effect = mock((_target: Character) => {});
        const item = new Item({
            name: "Mock Potion",
            description: "Test item",
            price: 10,
        }, effect);

        inv.addItem(item);
        inv.useItem(0, target);

        expect(effect).toHaveBeenCalledTimes(1);
        expect(effect).toHaveBeenCalledWith(target);
        expect(inv.getItems()).toHaveLength(0);
    });

    it("removeItem ด้วย index ติดลบไม่ควรลบ item โดยไม่ตั้งใจ", () => {
        const inv = new Inventory();
        const item1 = makeItem("Item 1");
        const item2 = makeItem("Item 2");
        inv.addItem(item1);
        inv.addItem(item2);

        inv.removeItem(-1);

        // Bug detector: Array.splice(-1, 1) ของ implementation ปัจจุบันจะลบ item ตัวสุดท้าย
        expect(inv.getItems()).toEqual([item1, item2]);
    });

    it("useItem ด้วย index ที่ไม่มีอยู่จริงไม่ควร error และไม่ลบ item", () => {
        const inv = new Inventory();
        const item = makeItem("Item 1");
        inv.addItem(item);

        expect(() => inv.useItem(99, makeCharacter())).not.toThrow();
        expect(inv.getItems()).toHaveLength(1);
        expect(inv.getItems()[0]).toBe(item);
    });

    it("ลบ item slot สุดท้ายแล้วสามารถเติม item ใหม่กลับมาให้ครบ 8 ช่องได้", () => {
        const inv = new Inventory();

        for (let i = 0; i < 8; i++) {
            inv.addItem(makeItem(`Item ${i + 1}`));
        }

        inv.removeItem(7);

        expect(inv.isFull()).toBe(false);
        expect(inv.addItem(makeItem("Item 9"))).toBe(true);
        expect(inv.getItems()).toHaveLength(8);
        expect(inv.getItems()[7]?.item.name).toBe("Item 9");
    });

    it("removeItem ด้วย index ที่เกินจำนวน item ไม่ควรเปลี่ยน inventory", () => {
        const inv = new Inventory();
        const item = makeItem("Item 1");
        inv.addItem(item);

        inv.removeItem(99);

        expect(inv.getItems()).toEqual([item]);
    });

    it("useItem ที่ slot สุดท้ายควรใช้ effect และลบ item ออก", () => {
        const inv = new Inventory();
        const target = makeCharacter();
        const effect = mock((_target: Character) => {});

        inv.addItem(makeItem("Item 1"));
        inv.addItem(makeItem("Item 2"));
        inv.addItem(new Item({ name: "Item 3", description: "Test item", price: 10 }, effect));

        inv.useItem(2, target);

        expect(effect).toHaveBeenCalledWith(target);
        expect(inv.getItems().map((x) => x.item.name)).toEqual(["Item 1", "Item 2"]);
    });

    it("useItem ด้วย index ติดลบไม่ควร error และไม่ลบ item", () => {
        const inv = new Inventory();
        const item = makeItem("Item 1");
        inv.addItem(item);

        expect(() => inv.useItem(-1, makeCharacter())).not.toThrow();
        expect(inv.getItems()).toEqual([item]);
    });

    it("useItem ที่ slot กลางควรลบเฉพาะ slot นั้น", () => {
        const inv = new Inventory();
        const target = makeCharacter();
        const item1 = makeItem("Item 1");
        const effect = mock((_target: Character) => {});
        const item2 = new Item({
            name: "Item 2",
            description: "Test item",
            price: 10,
        }, effect);
        const item3 = makeItem("Item 3");

        inv.addItem(item1);
        inv.addItem(item2);
        inv.addItem(item3);

        inv.useItem(1, target);

        expect(inv.getItems()).toHaveLength(2);
        expect(inv.getItems()[0]).toBe(item1);
        expect(inv.getItems()[1]).toBe(item3);
    });
});