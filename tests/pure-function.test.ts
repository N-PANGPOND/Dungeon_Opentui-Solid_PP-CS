import { describe, expect, test } from "bun:test";
import {
    getRandomAction,
    EvadeCheck,
    calculateDamage
} from "../Source-code/shared/pure-function";

import {
    AttackingType,
    DefensiveType
} from "../Source-code/Type-Enum/enum";

import type {
    MonsterType,
    Weights
} from "../Source-code/Type-Enum/type";

import { Character } from "../Source-code/Character/character";

describe("pure-function.ts", () => {
    const attackWeights: Weights = {
        "NORMAL MONS": { Attack: 50, Strike: 30, Run: 20 },
        "ELITE MONS": { Attack: 40, Strike: 40, Run: 20 },
        "BOSS": { Attack: 60, Strike: 30, Run: 10 },
    };

    const defenseWeights: Weights = {
        "NORMAL MONS": { Defend: 50, Counter: 30, Run: 20 },
        "ELITE MONS": { Defend: 40, Counter: 40, Run: 20 },
        "BOSS": { Defend: 60, Counter: 30, Run: 10 },
    };

    describe("getRandomAction()", () => {
        test("ควรสุ่ม Attack เมื่อ randomValue อยู่ในช่วง Attack", () => {
            expect(getRandomAction("NORMAL MONS", 10, attackWeights))
                .toBe(AttackingType.Attack);
        });

        test("ควรสุ่ม Strike เมื่อ randomValue อยู่ในช่วง Strike", () => {
            expect(getRandomAction("NORMAL MONS", 60, attackWeights))
                .toBe(AttackingType.Strike);
        });

        test("ควรสุ่ม Run เมื่อ randomValue อยู่ในช่วง Run", () => {
            expect(getRandomAction("NORMAL MONS", 90, attackWeights))
                .toBe(AttackingType.Run);
        });

        test("ควรทำงานกับ ELITE MONS", () => {
            expect(getRandomAction("ELITE MONS", 50, attackWeights))
                .toBe(AttackingType.Strike);
        });

        test("ควรทำงานกับ BOSS", () => {
            expect(getRandomAction("BOSS", 70, attackWeights))
                .toBe(AttackingType.Strike);
        });

        test("randomValue = 0 ควรได้ Action แรก", () => {
            expect(getRandomAction("NORMAL MONS", 0, attackWeights))
                .toBe(AttackingType.Attack);
        });

        test("randomValue = 50 ควรเปลี่ยนจาก Attack เป็น Strike", () => {
            expect(getRandomAction("NORMAL MONS", 50, attackWeights))
                .toBe(AttackingType.Strike);
        });

        test("randomValue = 80 ควรเปลี่ยนจาก Strike เป็น Run", () => {
            expect(getRandomAction("NORMAL MONS", 80, attackWeights))
                .toBe(AttackingType.Run);
        });

        test("randomValue = 99 ควรยังได้ Action สุดท้าย", () => {
            expect(getRandomAction("NORMAL MONS", 99, attackWeights))
                .toBe(AttackingType.Run);
        });

        test("ควรสุ่ม Defend ได้", () => {
            expect(getRandomAction("NORMAL MONS", 10, defenseWeights))
                .toBe(DefensiveType.Defend);
        });

        test("ควรสุ่ม Counter ได้", () => {
            expect(getRandomAction("NORMAL MONS", 60, defenseWeights))
                .toBe(DefensiveType.Counter);
        });

        test("ควรสุ่ม Run ใน Defensive Mode ได้", () => {
            expect(getRandomAction("NORMAL MONS", 90, defenseWeights))
                .toBe(DefensiveType.Run);
        });

        test("randomValue ต่ำกว่า 0 ควรยังเลือก Action แรก", () => {
            expect(getRandomAction("NORMAL MONS", -1, attackWeights))
                .toBe(AttackingType.Attack);
        });

        test("weights ไม่ครอบคลุม randomValue ควร throw Error", () => {
            const incompleteWeights: Weights = {
                "NORMAL MONS": { Attack: 20, Strike: 20, Run: 20 },
                "ELITE MONS": { Attack: 20, Strike: 20, Run: 20 },
                "BOSS": { Attack: 20, Strike: 20, Run: 20 },
            };

            expect(() =>
                getRandomAction("NORMAL MONS", 90, incompleteWeights)
            ).toThrow("Invalid random value or monster type");
        });
    });

    describe("EvadeCheck()", () => {
        const createCharacter = (agi: number) => new Character({
            maxHp: 100, hp: 100, atk: 10, def: 5, luc: 7, agi, coin: 50,
        });

        test("randomValue ต่ำกว่า AGI ควรหลบสำเร็จ", () => {
            expect(EvadeCheck(createCharacter(8), 5)).toBe(true);
        });

        test("randomValue มากกว่า AGI ควรหลบไม่สำเร็จ", () => {
            expect(EvadeCheck(createCharacter(8), 10)).toBe(false);
        });

        test("randomValue เท่ากับ AGI ควรหลบไม่สำเร็จ", () => {
            expect(EvadeCheck(createCharacter(8), 8)).toBe(false);
        });

        test("AGI = 0 และ randomValue = 0 ควรหลบไม่สำเร็จ", () => {
            expect(EvadeCheck(createCharacter(0), 0)).toBe(false);
        });

        test("AGI สูงกว่า randomValue มาก ควรหลบสำเร็จ", () => {
            expect(EvadeCheck(createCharacter(100), 50)).toBe(true);
        });

        test("randomValue = 99 และ AGI = 100 ควรหลบสำเร็จ", () => {
            expect(EvadeCheck(createCharacter(100), 99)).toBe(true);
        });
    });

    describe("calculateDamage()", () => {
        const createCharacter = (atk: number, def: number, luc: number) =>
            new Character({
                maxHp: 100,
                hp: 100,
                atk,
                def,
                luc,
                agi: 8,
                coin: 50,
            });

        test("ควรคำนวณ damage ปกติได้ถูกต้อง", () => {
            const source = createCharacter(20, 5, 0);
            const target = createCharacter(10, 5, 0);

            expect(calculateDamage(source, target, 1, 0.5)).toBe(15);
        });

        test("เมื่อเกิด Critical damage ควรคูณ 2", () => {
            const source = createCharacter(20, 5, 50);
            const target = createCharacter(10, 5, 0);

            expect(calculateDamage(source, target, 1, 0.49)).toBe(30);
        });

        test("เมื่อ random เท่ากับ Critical chance ไม่ควรเป็น Critical", () => {
            const source = createCharacter(20, 5, 50);
            const target = createCharacter(10, 5, 0);

            expect(calculateDamage(source, target, 1, 0.5)).toBe(15);
        });

        test("multiplier ควรมีผลต่อ damage", () => {
            const source = createCharacter(20, 5, 0);
            const target = createCharacter(10, 5, 0);

            expect(calculateDamage(source, target, 0.5, 0.5)).toBe(7.5);
            expect(calculateDamage(source, target, 2, 0.5)).toBe(30);
        });

        test("ATK น้อยกว่า DEF ไม่ควรทำให้ damage ติดลบ", () => {
            const source = createCharacter(5, 10, 0);
            const target = createCharacter(10, 10, 0);

            expect(calculateDamage(source, target, 1, 0.5)).toBe(0);
        });

        test("ATK เท่ากับ DEF ควรได้ damage เป็น 0", () => {
            const source = createCharacter(10, 10, 0);
            const target = createCharacter(10, 10, 0);

            expect(calculateDamage(source, target, 1, 0.5)).toBe(0);
        });

        test("multiplier = 0 ควร throw Error ตาม validation ปัจจุบัน", () => {
            const source = createCharacter(20, 5, 0);
            const target = createCharacter(10, 5, 0);

            expect(() => calculateDamage(source, target, 0, 0.5)).toThrow(
                "multiplier or random Shouldn't less than 0"
            );
        });

        test("multiplier ติดลบควร throw Error", () => {
            const source = createCharacter(20, 5, 0);
            const target = createCharacter(10, 5, 0);

            expect(() => calculateDamage(source, target, -1, 0.5)).toThrow(
                "multiplier or random Shouldn't less than 0"
            );
        });

        test("random = 0 ควร throw Error ตาม validation ปัจจุบัน", () => {
            const source = createCharacter(20, 5, 0);
            const target = createCharacter(10, 5, 0);

            expect(() => calculateDamage(source, target, 1, 0)).toThrow(
                "multiplier or random Shouldn't less than 0"
            );
        });

        test("random ติดลบควร throw Error", () => {
            const source = createCharacter(20, 5, 0);
            const target = createCharacter(10, 5, 0);

            expect(() => calculateDamage(source, target, 1, -0.1)).toThrow(
                "multiplier or random Shouldn't less than 0"
            );
        });

        test("LUC = 0 จะไม่เกิด Critical", () => {
            const source = createCharacter(20, 5, 0);
            const target = createCharacter(10, 5, 0);

            expect(calculateDamage(source, target, 1, 0.1)).toBe(15);
        });
    });
});