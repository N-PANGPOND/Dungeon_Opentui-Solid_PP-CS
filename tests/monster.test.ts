import { describe, expect, test } from "bun:test";
import { MonsterFactory } from "../Source-code/Character/character";

const mockRandom = (value: number) => {
    const original = Math.random;
    Math.random = () => value;
    return () => { Math.random = original; };
};

describe("MonsterFactory / Monster", () => {

    test("ระยะน้อยกว่า 3 ควรสร้าง BOSS", () => {
        const monster = MonsterFactory.createMonster(2);
        expect((monster as any).MonsterType).toBe("BOSS");
    });

    test("ระยะเท่ากับ 3 ควรเริ่มเป็น ELITE MONS", () => {
        const monster = MonsterFactory.createMonster(3);
        expect((monster as any).MonsterType).toBe("ELITE MONS");
    });

    test("ระยะ 14 ยังเป็น ELITE MONS", () => {
        const monster = MonsterFactory.createMonster(14);
        expect((monster as any).MonsterType).toBe("ELITE MONS");
    });

    test("ระยะ 15 ควรเริ่มเป็น NORMAL MONS", () => {
        const monster = MonsterFactory.createMonster(15);
        expect((monster as any).MonsterType).toBe("NORMAL MONS");
    });

    test("coinDrop ควรคืน coin ของ Monster", () => {
        const monster = MonsterFactory.createMonster(100);
        expect(monster.coinDrop()).toBe(monster.getCoin());
    });

    test("NORMAL MONS ที่ random = 0 ควรเลือก Attack", () => {
        const monster = MonsterFactory.createMonster(100);
        const restore = mockRandom(0);
        try {
            expect(monster.decideAttackingAction()).toBe("Attack");
        } finally { restore(); }
    });

    test("NORMAL MONS ที่ random ใกล้ 1 ควรเลือก Run", () => {
        const monster = MonsterFactory.createMonster(100);
        const restore = mockRandom(0.99);
        try {
            expect(monster.decideAttackingAction()).toBe("Run");
        } finally { restore(); }
    });

    test("BOSS ที่ random = 0.99 ไม่ควรเลือก Run เพราะ probability ของ Run เป็น 0", () => {
        const monster = MonsterFactory.createMonster(2);
        const restore = mockRandom(0.99);
        try {
            expect(monster.decideAttackingAction()).toBe("Strike");
        } finally { restore(); }
    });

    test("NORMAL MONS ที่ random = 0 ควรเลือก Defend", () => {
        const monster = MonsterFactory.createMonster(100);
        const restore = mockRandom(0);
        try {
            expect(monster.decideDefensiveAction()).toBe("Defend");
        } finally { restore(); }
    });

    test("BOSS ที่ random = 0.99 ควรเลือก Run ใน Defensive phase", () => {
        const monster = MonsterFactory.createMonster(2);
        const restore = mockRandom(0.99);
        try {
            expect(monster.decideDefensiveAction()).toBe("Run");
        } finally { restore(); }
    });
});
