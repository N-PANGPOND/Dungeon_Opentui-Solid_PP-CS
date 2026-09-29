import { describe, expect, test, mock, beforeEach } from "bun:test";
import { Item, Itemfactory } from "../Item-Inventory/Item";
import { Character } from "../Character/character";

describe("Item", () => {
    let character: Character;

    beforeEach(() => {
        character = new Character({
            maxHp: 100,
            hp: 50,
            atk: 10,
            def: 5,
            luc: 7,
            agi: 8,
            coin: 50,
        });
    });

    test("สร้าง Item ได้ถูกต้อง", () => {
        const item = new Item({
            name: "Test Potion",
            description: "ไอเทมทดสอบ",
            price: 100,
        });

        expect(item).toBeDefined();
    });

    test("ใช้ Item ที่มี Effect ได้", () => {
        const effect = mock((target: Character) => {
            target.heal(20);
        });

        const item = new Item(
            {
                name: "Test Potion",
                description: "ไอเทมทดสอบ",
                price: 100,
            },
            effect,
        );

        item.use(character);

        expect(effect).toHaveBeenCalledTimes(1);
        expect(character.getHp()).toBe(70);
    });

    test("ใช้ Item ที่ไม่มี Effect ได้โดยไม่เกิด Error", () => {
        const item = new Item({
            name: "ไม่มี Effect",
            description: "Item สำหรับทดสอบ",
            price: 100,
        });

        expect(() => item.use(character)).not.toThrow();
    });
});

describe("Itemfactory", () => {
    let character: Character;

    beforeEach(() => {
        character = new Character({
            maxHp: 100,
            hp: 50,
            atk: 10,
            def: 5,
            luc: 7,
            agi: 8,
            coin: 50,
        });
    });

    test("สร้าง Potion ได้", () => {
        const item = Itemfactory.CreatePOTION();

        expect(item).toBeDefined();
        expect(item.item.name).toBe("POTION");
    });

    test("Potion เพิ่ม HP 25", () => {
        const item = Itemfactory.CreatePOTION();

        item.use(character);

        expect(character.getHp()).toBe(75);
    });

    test("Potion ไม่ทำให้ HP เกิน Max HP", () => {
        character.heal(45); // HP = 95

        const item = Itemfactory.CreatePOTION();

        item.use(character);

        expect(character.getHp()).toBe(100);
    });

    test("สร้าง High Potion ได้", () => {
        const item = Itemfactory.CreateHIGH_POTION();

        expect(item).toBeDefined();
        expect(item.item.name).toBe("HIGH_POTION");
    });

    test("High Potion เพิ่ม HP 50", () => {
        const item = Itemfactory.CreateHIGH_POTION();

        item.use(character);

        expect(character.getHp()).toBe(100);
    });

    test("High Potion ไม่ทำให้ HP เกิน Max HP", () => {
        character.heal(45); // HP = 95

        const item = Itemfactory.CreateHIGH_POTION();

        item.use(character);

        expect(character.getHp()).toBe(100);
    });

    test("สร้าง Potion ATK ได้", () => {
        const item = Itemfactory.CreatePOTION_ATK();

        expect(item).toBeDefined();
        expect(item.item.name).toBe("POTION_ATK");
    });

    test("Potion ATK เพิ่ม ATK 3", () => {
        const item = Itemfactory.CreatePOTION_ATK();

        item.use(character);

        expect(character.getAtk()).toBe(13);
    });

    test("สร้าง Potion DEF ได้", () => {
        const item = Itemfactory.CreatePOTION_DEF();

        expect(item).toBeDefined();
        expect(item.item.name).toBe("POTION_DEF");
    });

    test("Potion DEF เพิ่ม DEF 2", () => {
        const item = Itemfactory.CreatePOTION_DEF();

        item.use(character);

        expect(character.getDef()).toBe(7);
    });

    test("getName getPrice และ getDesciption ควรคืนข้อมูลของ Item", () => {
        const item = new Item({
            name: "TEST",
            description: "คำอธิบายทดสอบ",
            price: 123,
        });

        expect(item.getName()).toBe("TEST");
        expect(item.getPrice()).toBe(123);
        expect(item.getDesciption()).toBe("คำอธิบายทดสอบ");
    });

    test("สร้าง Smoke Bomb ได้", () => {
        const item = Itemfactory.CreateSMOKE_BOMB();

        expect(item).toBeDefined();
        expect(item.item.name).toBe("SMOKE_BOMB");
    });

    test("Smoke Bomb ไม่มี Effect ทั่วไปและใช้ได้โดยไม่ throw", () => {
        const item = Itemfactory.CreateSMOKE_BOMB();

        expect(() => item.use(character)).not.toThrow();
        expect(character.getHp()).toBe(50);
        expect(character.getAtk()).toBe(10);
        expect(character.getDef()).toBe(5);
    });
});