import { describe, expect, test } from "bun:test";
import { Event } from "../Source-code/Event/Event";
import { Shop } from "../Source-code/Event/Shop";
import { Player } from "../Source-code/Character/character";

const makePlayer = (hp = 100, coin = 50) =>
    new Player(
        { maxHp: 100, hp, atk: 10, def: 5, luc: 7, agi: 8, coin },
        { x: 0, y: 0 },
    );

const mockRandom = (...values: number[]) => {
    const original = Math.random;
    Math.random = (() => values.shift() ?? 0) as typeof Math.random;

    return () => {
        Math.random = original;
    };
};

describe("Event", () => {
    describe("Trap()", () => {
        test("ควรลด HP ของ Player ตาม damage ที่สุ่มได้ (1-20)", () => {
            const event = new Event();
            const player = makePlayer(100);
            const restore = mockRandom(0);

            try {
                const damage = event.Trap(player);
                expect(damage).toBe(1);
                expect(player.getHp()).toBe(99);
            } finally {
                restore();
            }
        });

        test("random ใกล้ 1 ควรได้ damage สูงสุด 20", () => {
            const event = new Event();
            const player = makePlayer(100);
            const restore = mockRandom(0.999);

            try {
                const damage = event.Trap(player);
                expect(damage).toBe(20);
                expect(player.getHp()).toBe(80);
            } finally {
                restore();
            }
        });

        test("damage ที่คืนค่าควรตรงกับ HP ที่หายไปจริง", () => {
            const event = new Event();
            const player = makePlayer(100);
            const restore = mockRandom(0.5);

            try {
                const damage = event.Trap(player);
                expect(player.getHp()).toBe(100 - damage);
            } finally {
                restore();
            }
        });
    });

    describe("Treasure()", () => {
        test("ควรเพิ่ม coin ให้ Player ตามค่าที่สุ่มได้ (1-100)", () => {
            const event = new Event();
            const player = makePlayer(100, 0);
            const restore = mockRandom(0);

            try {
                const coin = event.Treasure(player);
                expect(coin).toBe(1);
                expect(player.getCoin()).toBe(1);
            } finally {
                restore();
            }
        });

        test("random ใกล้ 1 ควรได้ coin สูงสุด 100", () => {
            const event = new Event();
            const player = makePlayer(100, 0);
            const restore = mockRandom(0.999);

            try {
                const coin = event.Treasure(player);
                expect(coin).toBe(100);
                expect(player.getCoin()).toBe(100);
            } finally {
                restore();
            }
        });

        test("coin ที่คืนค่าควรบวกเข้ากับ coin เดิมของ Player เสมอ", () => {
            const event = new Event();
            const player = makePlayer(100, 50);
            const restore = mockRandom(0.3);

            try {
                const coin = event.Treasure(player);
                expect(player.getCoin()).toBe(50 + coin);
            } finally {
                restore();
            }
        });
    });

    describe("Potion()", () => {
        test("random = 0.25 พอดีควรได้ HIGH_POTION ตามขอบเขต index", () => {
            const event = new Event();
            const restore = mockRandom(0.25);

            try {
                expect(event.Potion().getName()).toBe("HIGH_POTION");
            } finally {
                restore();
            }
        });

        test("random = 0.75 พอดีควรได้ POTION_DEF ตามขอบเขต index", () => {
            const event = new Event();
            const restore = mockRandom(0.75);

            try {
                expect(event.Potion().getName()).toBe("POTION_DEF");
            } finally {
                restore();
            }
        });

        test("random = 0 ควรได้ POTION (index แรก)", () => {
            const event = new Event();
            const restore = mockRandom(0);

            try {
                expect(event.Potion().getName()).toBe("POTION");
            } finally {
                restore();
            }
        });

        test("random = 0.3 ควรได้ HIGH_POTION (index ที่สอง)", () => {
            const event = new Event();
            const restore = mockRandom(0.3);

            try {
                expect(event.Potion().getName()).toBe("HIGH_POTION");
            } finally {
                restore();
            }
        });

        test("random = 0.5 ควรได้ POTION_ATK (index ที่สาม)", () => {
            const event = new Event();
            const restore = mockRandom(0.5);

            try {
                expect(event.Potion().getName()).toBe("POTION_ATK");
            } finally {
                restore();
            }
        });

        test("random = 0.8 ควรได้ POTION_DEF (index สุดท้าย)", () => {
            const event = new Event();
            const restore = mockRandom(0.8);

            try {
                expect(event.Potion().getName()).toBe("POTION_DEF");
            } finally {
                restore();
            }
        });

        test("แต่ละครั้งที่เรียกควรได้ Item instance ใหม่ (ไม่ใช่ reference เดิม)", () => {
            const event = new Event();
            const restore = mockRandom(0, 0);

            try {
                const first = event.Potion();
                const second = event.Potion();
                expect(first).not.toBe(second);
                expect(first.getName()).toBe(second.getName());
            } finally {
                restore();
            }
        });
    });

    describe("Trap()", () => {
        test("HP เหลือ 1 และโดนความเสียหายขั้นต่ำควรเหลือ 0", () => {
            const event = new Event();
            const player = makePlayer(1);
            const restore = mockRandom(0);

            try {
                expect(event.Trap(player)).toBe(1);
                expect(player.getHp()).toBe(0);
                expect(player.isDead()).toBe(true);
            } finally {
                restore();
            }
        });
    });

    describe("Shop()", () => {
        test("ควรคืนค่า instance ของ Shop ที่มีไอเทมครบ", () => {
            const event = new Event();
            const shop = event.Shop();

            expect(shop).toBeInstanceOf(Shop);
            expect(shop.getItems().length).toBeGreaterThan(0);
        });

        test("เรียก Shop() หลายครั้งควรได้ Shop คนละ instance กัน", () => {
            const event = new Event();
            const shopA = event.Shop();
            const shopB = event.Shop();

            expect(shopA).not.toBe(shopB);
        });
    });
});