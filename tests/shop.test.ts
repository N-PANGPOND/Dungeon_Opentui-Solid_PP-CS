import { describe, expect, test, mock } from "bun:test";
import { Shop } from "../Source-code/Event/Shop";
import { Item, Itemfactory } from "../Source-code/Item-Inventory/Item";
import { Player } from "../Source-code/Character/character";

const makePlayer = (coin = 100) =>
    new Player(
        { maxHp: 100, hp: 100, atk: 10, def: 5, luc: 7, agi: 8, coin },
        { x: 0, y: 0 },
    );

describe("Shop", () => {
    describe("constructor / getItems()", () => {
        test("ควรมีไอเทมตั้งต้นครบ 5 ชิ้นตามลำดับที่กำหนด", () => {
            const shop = new Shop();
            const names = shop.getItems().map((item) => item.getName());

            expect(names).toEqual([
                "POTION",
                "HIGH_POTION",
                "POTION_ATK",
                "POTION_DEF",
                "SMOKE_BOMB",
            ]);
        });
    });

    describe("buy()", () => {
        test("ชื่อไอเทมที่มีอยู่จริงควรได้ Item instance ใหม่", () => {
            const shop = new Shop();
            const bought = shop.buy("POTION");

            expect(bought).toBeDefined();
            expect(bought?.getName()).toBe("POTION");
            expect(bought).not.toBe(shop.getItems()[0]);
        });

        test("ชื่อไอเทมที่ไม่มีอยู่จริงควรได้ undefined", () => {
            const shop = new Shop();
            expect(shop.buy("NOT_EXIST")).toBeUndefined();
        });

        test("รองรับทุกไอเทมใน catalog", () => {
            const shop = new Shop();
            const names = ["POTION", "HIGH_POTION", "POTION_ATK", "POTION_DEF", "SMOKE_BOMB"];

            for (const name of names) {
                expect(shop.buy(name)?.getName()).toBe(name);
            }
        });
    });

    describe("buyItem()", () => {
        test("index ติดลบควรซื้อไม่ได้", () => {
            const shop = new Shop();
            const player = makePlayer();
            const result = shop.buyItem(-1, player);

            expect(result).toEqual({ success: false, message: "Invalid item selection!" });
        });

        test("index เกินจำนวนไอเทมควรซื้อไม่ได้", () => {
            const shop = new Shop();
            const player = makePlayer();
            const result = shop.buyItem(99, player);

            expect(result).toEqual({ success: false, message: "Invalid item selection!" });
        });

        test("มีเงินเท่าราคาไอเทมพอดีควรซื้อสำเร็จ", () => {
            const shop = new Shop();
            const player = makePlayer(20);
            const result = shop.buyItem(0, player);

            expect(result.success).toBe(true);
            expect(player.getCoin()).toBe(0);
            expect(player.getInventory().getItems()).toHaveLength(1);
        });

        test("มีเงินน้อยกว่าราคาไอเทม 1 coin ควรซื้อไม่ได้", () => {
            const shop = new Shop();
            const player = makePlayer(19);
            const result = shop.buyItem(0, player);

            expect(result.success).toBe(false);
            expect(player.getCoin()).toBe(19);
            expect(player.getInventory().getItems()).toHaveLength(0);
        });

        test("เงินไม่พอควรซื้อไม่ได้และไม่หักเงิน", () => {
            const shop = new Shop();
            const player = makePlayer(5); // POTION ราคา 20
            const result = shop.buyItem(0, player);

            expect(result.success).toBe(false);
            expect(result.message).toBe("Not enough coins! (5/20 Coins)");
            expect(player.getCoin()).toBe(5);
            expect(player.getInventory().getItems()).toHaveLength(0);
        });

        test("Inventory เต็มควรซื้อไม่ได้", () => {
            const shop = new Shop();
            const player = makePlayer(1000);

            for (let i = 0; i < 8; i++) {
                player.addItem(Itemfactory.CreatePOTION());
            }

            const result = shop.buyItem(0, player);

            expect(result).toEqual({ success: false, message: "Inventory is full! (Max 8 slots)" });
            expect(player.getCoin()).toBe(1000);
        });

        test("ซื้อสำเร็จควรหักเงิน เพิ่มไอเทมใน inventory และคืนข้อความ/ไอเทม", () => {
            const shop = new Shop();
            const player = makePlayer(100);
            const result = shop.buyItem(0, player); // POTION ราคา 20

            expect(result.success).toBe(true);
            expect(result.message).toBe("Purchased POTION for 20 Coins!");
            expect(result.item?.getName()).toBe("POTION");
            expect(player.getCoin()).toBe(80);
            expect(player.getInventory().getItems()).toHaveLength(1);
        });

        test("ซื้อไอเทมชิ้นเดิมซ้ำได้หลายครั้งตราบใดที่เงินพอและ inventory ไม่เต็ม", () => {
            const shop = new Shop();
            const player = makePlayer(100);

            shop.buyItem(0, player);
            const secondResult = shop.buyItem(0, player);

            expect(secondResult.success).toBe(true);
            expect(player.getCoin()).toBe(60);
            expect(player.getInventory().getItems()).toHaveLength(2);
        });
    });

    describe("sell()", () => {
        test("ไอเทมที่อยู่ใน inventory ควรขายได้ 80% ของราคา และถูกย้ายไปที่ shop", () => {
            const shop = new Shop();
            const player = makePlayer();
            const item = Itemfactory.CreateHIGH_POTION(); // ราคา 50
            player.addItem(item);

            const shopItemCountBefore = shop.getItems().length;
            const earned = shop.sell(item, player.getInventory());

            expect(earned).toBe(40); // floor(50 * 0.8)
            expect(player.getInventory().getItems()).toHaveLength(0);
            expect(shop.getItems()).toHaveLength(shopItemCountBefore + 1);
            expect(shop.getItems()).toContain(item);
        });

        test("ไอเทมที่ไม่ได้อยู่ใน inventory ควรขายไม่ได้ (คืน 0 และไม่แตะ shop)", () => {
            const shop = new Shop();
            const player = makePlayer();
            const outsideItem = Itemfactory.CreatePOTION();

            const shopItemCountBefore = shop.getItems().length;
            const earned = shop.sell(outsideItem, player.getInventory());

            expect(earned).toBe(0);
            expect(shop.getItems()).toHaveLength(shopItemCountBefore);
        });

        test("ราคาที่คูณ 0.8 แล้วมีเศษควรปัดเศษทิ้ง (Math.floor)", () => {
            const shop = new Shop();
            const player = makePlayer();
            const item = Itemfactory.CreatePOTION_ATK(); // ราคา 75 -> 60 พอดี ใช้ Smoke Bomb แทน
            const smokeBomb = Itemfactory.CreateSMOKE_BOMB(); // ราคา 100 -> 80 พอดี
            player.addItem(item);
            player.addItem(smokeBomb);

            expect(shop.sell(item, player.getInventory())).toBe(60);
            expect(shop.sell(smokeBomb, player.getInventory())).toBe(80);
        });
    });

    describe("sellItem()", () => {
        test("slotIndex ติดลบควรขายไม่ได้", () => {
            const shop = new Shop();
            const player = makePlayer();
            const result = shop.sellItem(-1, player);

            expect(result).toEqual({
                success: false,
                message: "Invalid item slot to sell!",
                earned: 0,
            });
        });

        test("slotIndex เกินจำนวนไอเทมใน inventory ควรขายไม่ได้", () => {
            const shop = new Shop();
            const player = makePlayer();
            const result = shop.sellItem(0, player); // inventory ว่าง

            expect(result).toEqual({
                success: false,
                message: "Invalid item slot to sell!",
                earned: 0,
            });
        });

        test("ขายสำเร็จควรเพิ่มเงินให้ Player ตาม 80% ของราคา และลบไอเทมออกจาก inventory", () => {
            const shop = new Shop();
            const player = makePlayer(0);
            player.addItem(Itemfactory.CreateHIGH_POTION()); // ราคา 50

            const result = shop.sellItem(0, player);

            expect(result.success).toBe(true);
            expect(result.earned).toBe(40);
            expect(result.message).toBe("Sold HIGH_POTION for 40 Coins (80% value)!");
            expect(player.getCoin()).toBe(40);
            expect(player.getInventory().getItems()).toHaveLength(0);
        });

        test("ขายไอเทม slot สุดท้ายควรลบเฉพาะ slot สุดท้าย", () => {
            const shop = new Shop();
            const player = makePlayer(0);
            player.addItem(Itemfactory.CreatePOTION());
            player.addItem(Itemfactory.CreateHIGH_POTION());

            const result = shop.sellItem(1, player);

            expect(result.success).toBe(true);
            expect(player.getInventory().getItems().map((i) => i.getName())).toEqual(["POTION"]);
            expect(player.getCoin()).toBe(40);
        });

        test("ขายไอเทมที่ slot กลางควรลบเฉพาะ slot นั้น", () => {
            const shop = new Shop();
            const player = makePlayer(0);
            player.addItem(Itemfactory.CreatePOTION());
            player.addItem(Itemfactory.CreateHIGH_POTION());
            player.addItem(Itemfactory.CreatePOTION_ATK());

            shop.sellItem(1, player);

            const remaining = player.getInventory().getItems().map((i) => i.getName());
            expect(remaining).toEqual(["POTION", "POTION_ATK"]);
        });
    });

    describe("Leave()", () => {
        test("ควร log ข้อความบอกลาโดยไม่ throw", () => {
            const shop = new Shop();
            const consoleLog = mock(() => {});
            const globalObject = globalThis as any;
            const original = globalObject.console.log;
            globalObject.console.log = consoleLog;

            try {
                expect(() => shop.Leave()).not.toThrow();
                expect(consoleLog).toHaveBeenCalledWith("You have left the shop.");
            } finally {
                globalObject.console.log = original;
            }
        });
    });
});