import { describe, expect, test } from "bun:test";

import {
    getRandomAction,
    EvadeCheck
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

    // ==========================================
    // Test Data
    // ==========================================

    const attackWeights: Weights = {
        "NORMAL MONS": {
            Attack: 50,
            Strike: 30,
            Run: 20
        },

        "ELITE MONS": {
            Attack: 40,
            Strike: 40,
            Run: 20
        },

        "BOSS": {
            Attack: 60,
            Strike: 30,
            Run: 10
        }
    };


    const defenseWeights: Weights = {
        "NORMAL MONS": {
            Defend: 50,
            Counter: 30,
            Run: 20
        },

        "ELITE MONS": {
            Defend: 40,
            Counter: 40,
            Run: 20
        },

        "BOSS": {
            Defend: 60,
            Counter: 30,
            Run: 10
        }
    };


    // ==========================================
    // getRandomAction()
    // ==========================================

    describe("getRandomAction()", () => {

        test("ควรสุ่ม Attack เมื่อ randomValue อยู่ในช่วง Attack", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                10,
                attackWeights
            );

            expect(result).toBe(AttackingType.Attack);
        });


        test("ควรสุ่ม Strike เมื่อ randomValue อยู่ในช่วง Strike", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                60,
                attackWeights
            );

            expect(result).toBe(AttackingType.Strike);
        });


        test("ควรสุ่ม Run เมื่อ randomValue อยู่ในช่วง Run", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                90,
                attackWeights
            );

            expect(result).toBe(AttackingType.Run);
        });


        test("ควรทำงานกับ ELITE MONS", () => {
            const result = getRandomAction(
                "ELITE MONS",
                50,
                attackWeights
            );

            expect(result).toBe(AttackingType.Strike);
        });


        test("ควรทำงานกับ BOSS", () => {
            const result = getRandomAction(
                "BOSS",
                70,
                attackWeights
            );

            expect(result).toBe(AttackingType.Strike);
        });


        // ==========================================
        // Boundary Tests
        // ==========================================

        test("randomValue = 0 ควรได้ Action แรก", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                0,
                attackWeights
            );

            expect(result).toBe(AttackingType.Attack);
        });


        test("randomValue ใกล้ 50 ควรเปลี่ยนจาก Attack เป็น Strike", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                50,
                attackWeights
            );

            expect(result).toBe(AttackingType.Strike);
        });


        test("randomValue ใกล้ 80 ควรเปลี่ยนจาก Strike เป็น Run", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                80,
                attackWeights
            );

            expect(result).toBe(AttackingType.Run);
        });


        test("randomValue = 99 ควรยังได้ Action สุดท้าย", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                99,
                attackWeights
            );

            expect(result).toBe(AttackingType.Run);
        });


        // ==========================================
        // Defensive Actions
        // ==========================================

        test("ควรสุ่ม Defend ได้", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                10,
                defenseWeights
            );

            expect(result).toBe(DefensiveType.Defend);
        });


        test("ควรสุ่ม Counter ได้", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                60,
                defenseWeights
            );

            expect(result).toBe(DefensiveType.Counter);
        });


        test("ควรสุ่ม Run ใน Defensive Mode ได้", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                90,
                defenseWeights
            );

            expect(result).toBe(DefensiveType.Run);
        });


        // ==========================================
        // Error Tests
        // ==========================================

        test("randomValue มากกว่า 100 ควร throw Error", () => {
            expect(() =>
                getRandomAction(
                    "NORMAL MONS",
                    101,
                    attackWeights
                )
            ).toThrow();
        });


        test("randomValue ต่ำกว่า 0 ควรยังเลือก Action แรก", () => {
            const result = getRandomAction(
                "NORMAL MONS",
                -1,
                attackWeights
            );

            expect(result).toBe(AttackingType.Attack);
        });


        test("weights ไม่ครอบคลุม randomValue ควร throw Error", () => {
            const incompleteWeights: Weights = {
                "NORMAL MONS": {
                    Attack: 20,
                    Strike: 20,
                    Run: 20
                },

                "ELITE MONS": {
                    Attack: 20,
                    Strike: 20,
                    Run: 20
                },

                "BOSS": {
                    Attack: 20,
                    Strike: 20,
                    Run: 20
                }
            };

            expect(() =>
                getRandomAction(
                    "NORMAL MONS",
                    90,
                    incompleteWeights
                )
            ).toThrow("Invalid random value or monster type");
        });

    });


    // ==========================================
    // EvadeCheck()
    // ==========================================

    describe("EvadeCheck()", () => {

        const createCharacter = (agi: number) => {
            return new Character({
                maxHp: 100,
                hp: 100,
                atk: 10,
                def: 5,
                luc: 7,
                agi,
                coin: 50
            });
        };


        test("randomValue ต่ำกว่า AGI ควรหลบสำเร็จ", () => {
            const character = createCharacter(8);

            const result = EvadeCheck(character, 5);

            expect(result).toBe(true);
        });


        test("randomValue มากกว่า AGI ควรหลบไม่สำเร็จ", () => {
            const character = createCharacter(8);

            const result = EvadeCheck(character, 10);

            expect(result).toBe(false);
        });


        test("randomValue เท่ากับ AGI ควรหลบไม่สำเร็จ", () => {
            const character = createCharacter(8);

            const result = EvadeCheck(character, 8);

            expect(result).toBe(false);
        });


        test("AGI = 0 และ randomValue = 0 ควรหลบไม่สำเร็จ", () => {
            const character = createCharacter(0);

            const result = EvadeCheck(character, 0);

            expect(result).toBe(false);
        });


        test("AGI สูงกว่า randomValue มาก ควรหลบสำเร็จ", () => {
            const character = createCharacter(100);

            const result = EvadeCheck(character, 50);

            expect(result).toBe(true);
        });


        test("randomValue = 99 และ AGI = 100 ควรหลบสำเร็จ", () => {
            const character = createCharacter(100);

            const result = EvadeCheck(character, 99);

            expect(result).toBe(true);
        });

    });

});