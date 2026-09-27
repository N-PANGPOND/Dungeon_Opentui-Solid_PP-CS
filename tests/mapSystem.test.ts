import { describe, expect, test, afterEach } from "bun:test";
import { mapSystem } from "../Source-code/System/mapSystem";
import { DungeonMap } from "../Source-code/DungeonMap/DungeonMap";

describe("mapSystem", () => {
    const originalRandom = Math.random;

    afterEach(() => {
        Math.random = originalRandom;
    });

    test("randomMaps ควรคืน DungeonMap จาก map.json", () => {
        const system = new mapSystem();
        const map = system.randomMaps();

        expect(map).toBeInstanceOf(DungeonMap);
        expect(map.getWidth()).toBeGreaterThan(0);
        expect(map.getHeight()).toBeGreaterThan(0);
    });

    test("random = 0 ควรเลือก map แรกและคืน start/exit ที่ถูกต้อง", () => {
        Math.random = () => 0;
        const system = new mapSystem();
        const map = system.randomMaps();

        expect(map.getStartPos()).toEqual({ x: 4, y: 2 });
        expect(map.getExitPos()).toEqual({ x: 43, y: 3 });
    });

    test("random ใกล้ 1 ควรเลือก map สุดท้าย", () => {
        Math.random = () => 0.999999;
        const system = new mapSystem();
        const map = system.randomMaps();

        expect(map.getStartPos()).toEqual({ x: 22, y: 24 });
        expect(map.getExitPos()).toEqual({ x: 22, y: 2 });
    });
});
