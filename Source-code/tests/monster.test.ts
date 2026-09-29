import { describe, expect, test } from "bun:test";
import { MonsterFactory } from "../Character/character";
import { AttackingType, DefensiveType } from "../Type-Enum/enum";

const mockRandom = (value: number) => {
    const original = Math.random;
    Math.random = () => value;
    return () => { Math.random = original; };
};

describe("MonsterFactory / Monster", () => {

    test("ระยะน้อยกว่า 4 ควรสร้าง BOSS", () => {
        const monster = MonsterFactory.createMonster(3);
        expect((monster as any).MonsterType).toBe("BOSS");
    });

    test("ระยะเท่ากับ 4 ควรเริ่มเป็น ELITE MONS", () => {
        const monster = MonsterFactory.createMonster(4);
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

    test("Normal / Elite / Boss ควรมี stat ตามระยะที่กำหนด", () => {
        const normal = MonsterFactory.createMonster(100);
        const elite = MonsterFactory.createMonster(10);
        const boss = MonsterFactory.createMonster(0);

        expect(normal.getMaxHp()).toBe(100);
        expect(normal.getAtk()).toBe(10);
        expect(normal.getDef()).toBe(5);
        expect(normal.getCoin()).toBe(35);

        expect(elite.getMaxHp()).toBe(200);
        expect(elite.getAtk()).toBe(30);
        expect(elite.getDef()).toBe(20);
        expect(elite.getCoin()).toBe(110);

        expect(boss.getMaxHp()).toBe(350);
        expect(boss.getAtk()).toBe(50);
        expect(boss.getDef()).toBe(55);
        expect(boss.getCoin()).toBe(9999);
    });

    test("coinDrop ควรคืน coin ของ Monster", () => {
        const monster = MonsterFactory.createMonster(100);
        expect(monster.coinDrop()).toBe(monster.getCoin());
    });

    test("NORMAL MONS ที่ random = 0 ควรเลือก Attack", () => {
    const monster = MonsterFactory.createMonster(100);
    const restore = mockRandom(0);

    try {
        expect(monster.decideAttackingAction()).toBe(AttackingType.Attack);
    } finally {
        restore();
    }
});

    test("NORMAL MONS ที่ random ใกล้ 1 ควรเลือก Run", () => {
        const monster = MonsterFactory.createMonster(100);
        const restore = mockRandom(0.99);

        try {
            expect(monster.decideAttackingAction()).toBe(AttackingType.Run);
        } finally {
            restore();
        }
    });
});

    test("BOSS ที่ random = 0.99 ควรเลือก Strike", () => {
        const monster = MonsterFactory.createMonster(2);
        const restore = mockRandom(0.99);

        try {
            expect(monster.decideAttackingAction()).toBe(AttackingType.Strike);
        } finally {
            restore();
        }
});

    test("NORMAL MONS ที่ random = 0 ควรเลือก Defend", () => {
        const monster = MonsterFactory.createMonster(100);
        const restore = mockRandom(0);

        try {
            expect(monster.decideDefensiveAction()).toBe(DefensiveType.Defend);
        } finally {
            restore();
        }
});

    test("BOSS ที่ random = 0.99 ควรเลือก Run ใน Defensive phase", () => {
        const monster = MonsterFactory.createMonster(2);
        const restore = mockRandom(0.99);

        try {
            expect(monster.decideDefensiveAction()).toBe(DefensiveType.Run);
        } finally {
            restore();
        }
});