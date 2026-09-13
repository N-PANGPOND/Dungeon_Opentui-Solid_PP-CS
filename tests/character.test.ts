import { describe, expect, it } from "bun:test";
import { Character } from "../Source-code/Character/character";

describe("Character", () => {
    const createCharacter = () => new Character({
        maxHp: 100,
        hp: 100,
        atk: 10,
        def: 5,
        luc: 7,
        agi: 8,
        coin: 50,
    });

    describe("constructor and getters", () => {
        it("ควรสร้าง Character ด้วยค่า stat ที่กำหนดได้ถูกต้อง", () => {
            const character = createCharacter();

            expect(character.getMaxHp()).toBe(100);
            expect(character.getHp()).toBe(100);
            expect(character.getAtk()).toBe(10);
            expect(character.getDef()).toBe(5);
            expect(character.getLuc()).toBe(7);
            expect(character.getAgi()).toBe(8);
            expect(character.getCoin()).toBe(50);
        });
    });

    describe("takeDamage", () => {
        it("ควรลด HP ตามจำนวน damage ที่ได้รับ", () => {
            const character = createCharacter();

            character.takeDamage(30);

            expect(character.getHp()).toBe(70);
        });

        it("เมื่อ damage มากกว่า HP ค่า HP ควรไม่ต่ำกว่า 0", () => {
            const character = createCharacter();

            character.takeDamage(150);

            expect(character.getHp()).toBe(0);
        });
    });

    describe("heal", () => {
        it("ควรเพิ่ม HP ตามจำนวนที่ heal", () => {
            const character = createCharacter();
            character.takeDamage(40);

            character.heal(20);

            expect(character.getHp()).toBe(80);
        });

        it("เมื่อ heal เกิน maxHp HP ควรไม่เกิน maxHp", () => {
            const character = createCharacter();
            character.takeDamage(20);

            character.heal(50);

            expect(character.getHp()).toBe(100);
        });

        it("เมื่อ heal ด้วยจำนวน 0 ควร throw Error", () => {
            const character = createCharacter();

            expect(() => character.heal(0)).toThrow(Error);
        });

        it("เมื่อ heal ด้วยค่าติดลบควร throw Error", () => {
            const character = createCharacter();

            expect(() => character.heal(-10)).toThrow(Error);
        });

        it("เมื่อ Character ตายแล้วควรไม่สามารถ heal ได้", () => {
            const character = createCharacter();
            character.takeDamage(100);

            expect(character.isDead()).toBe(true);
            expect(() => character.heal(20)).toThrow(Error);
        });
    });

    describe("isDead", () => {
        it("ควรเป็น false เมื่อ HP มากกว่า 0", () => {
            const character = createCharacter();

            expect(character.isDead()).toBe(false);
        });

        it("ควรเป็น true เมื่อ HP เท่ากับ 0", () => {
            const character = createCharacter();
            character.takeDamage(100);

            expect(character.isDead()).toBe(true);
        });
    });
});
