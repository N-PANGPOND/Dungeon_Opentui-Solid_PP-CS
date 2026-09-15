import { describe, expect, it } from "bun:test";
import { Character } from "../Source-code/Character/character";

describe("Character", () => {
    const createCharacter = () => new Character({
        maxHp: 100, hp: 100, atk: 10, def: 5, luc: 7, agi: 8, coin: 50,
    });

    it("ควรสร้าง Character และ getters ให้ค่าถูกต้อง", () => {
        const c = createCharacter();
        expect(c.getMaxHp()).toBe(100);
        expect(c.getHp()).toBe(100);
        expect(c.getAtk()).toBe(10);
        expect(c.getDef()).toBe(5);
        expect(c.getLuc()).toBe(7);
        expect(c.getAgi()).toBe(8);
        expect(c.getCoin()).toBe(50);
    });

    it("takeDamage ควรลด HP ตาม damage", () => {
        const c = createCharacter();
        c.takeDamage(30);
        expect(c.getHp()).toBe(70);
    });

    it("takeDamage ไม่ควรทำให้ HP ติดลบ", () => {
        const c = createCharacter();
        c.takeDamage(150);
        expect(c.getHp()).toBe(0);
    });

    it("heal ควรเพิ่ม HP", () => {
        const c = createCharacter();
        c.takeDamage(40);
        c.heal(20);
        expect(c.getHp()).toBe(80);
    });

    it("heal ไม่ควรเกิน maxHp", () => {
        const c = createCharacter();
        c.takeDamage(20);
        c.heal(50);
        expect(c.getHp()).toBe(100);
    });

    it("heal ด้วย 0 ควร throw Error", () => {
        expect(() => createCharacter().heal(0)).toThrow(Error);
    });

    it("heal ด้วยค่าติดลบควร throw Error", () => {
        expect(() => createCharacter().heal(-10)).toThrow(Error);
    });

    it("Character ที่ตายแล้วไม่ควร heal ได้", () => {
        const c = createCharacter();
        c.takeDamage(100);
        expect(c.isDead()).toBe(true);
        expect(() => c.heal(20)).toThrow(Error);
    });

    it("IncreaseATK ควรเพิ่ม ATK", () => {
        const c = createCharacter();
        c.IncreaseATK(5);
        expect(c.getAtk()).toBe(15);
    });

    it("IncreaseATK ด้วย 0 หรือติดลบควร throw Error", () => {
        const c = createCharacter();
        expect(() => c.IncreaseATK(0)).toThrow(Error);
        expect(() => c.IncreaseATK(-5)).toThrow(Error);
    });

    it("Character ที่ตายแล้วไม่ควรเพิ่ม ATK ได้", () => {
        const c = createCharacter();
        c.takeDamage(100);
        expect(() => c.IncreaseATK(5)).toThrow(Error);
        expect(c.getAtk()).toBe(10);
    });

    it("IncreaseDEF ควรเพิ่ม DEF", () => {
        const c = createCharacter();
        c.IncreaseDEF(5);
        expect(c.getDef()).toBe(10);
    });

    it("IncreaseDEF ด้วย 0 หรือติดลบควร throw Error", () => {
        const c = createCharacter();
        expect(() => c.IncreaseDEF(0)).toThrow(Error);
        expect(() => c.IncreaseDEF(-5)).toThrow(Error);
    });

    it("Character ที่ตายแล้วไม่ควรเพิ่ม DEF ได้", () => {
        const c = createCharacter();
        c.takeDamage(100);
        expect(() => c.IncreaseDEF(5)).toThrow(Error);
        expect(c.getDef()).toBe(5);
    });

    it("isDead ควรเป็น false เมื่อ HP > 0", () => {
        expect(createCharacter().isDead()).toBe(false);
    });

    it("isDead ควรเป็น true เมื่อ HP = 0", () => {
        const c = createCharacter();
        c.takeDamage(100);
        expect(c.isDead()).toBe(true);
    });
});
