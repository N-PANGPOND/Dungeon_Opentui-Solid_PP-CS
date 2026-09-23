import { describe, expect, test } from "bun:test";
import { DungeonMap, type MapConfig } from "../Source-code/DungeonMap/DungeonMap";
import { MapObject } from "../Source-code/Type-Enum/enum";

const makeConfig = (overrides: Partial<MapConfig> = {}): MapConfig => ({
    spawnPos: { x: 0, y: 0 },
    wifePos: [{ x: 1, y: 0 }],
    exitPos: { x: 2, y: 1 },
    layout: [
        [0, 0, 1],
        [0, 0, 0],
    ],
    ...overrides,
});

describe("DungeonMap", () => {
    test("สร้าง map ได้และคืนขนาดถูกต้อง", () => {
        const map = new DungeonMap(makeConfig());

        expect(map.getWidth()).toBe(3);
        expect(map.getHeight()).toBe(2);
        expect(map.getStartPos()).toEqual({ x: 0, y: 0 });
        expect(map.getExitPos()).toEqual({ x: 2, y: 1 });
        expect(map.getWifePos()).toEqual({ x: 1, y: 0 });
    });

    test("cell 0 ควรเป็น Floor และ cell 1 ควรเป็น Wall", () => {
        const map = new DungeonMap(makeConfig());

        expect(map.getTile({ x: 0, y: 0 })).toBe(MapObject.Floor);
        expect(map.getTile({ x: 2, y: 0 })).toBe(MapObject.Wall);
    });

    test("ตำแหน่ง Exit ควรคืน Exit และเดินได้", () => {
        const map = new DungeonMap(makeConfig());

        expect(map.getTile({ x: 2, y: 1 })).toBe(MapObject.Exit);
        expect(map.isWalkable({ x: 2, y: 1 })).toBe(true);
    });

    test("ตำแหน่งนอก map ควรเป็น Wall และเดินไม่ได้", () => {
        const map = new DungeonMap(makeConfig());

        expect(map.getTile({ x: -1, y: 0 })).toBe(MapObject.Wall);
        expect(map.getTile({ x: 3, y: 0 })).toBe(MapObject.Wall);
        expect(map.isWalkable({ x: 3, y: 0 })).toBe(false);
    });

    test("getDistanceToExit ควรคำนวณ Manhattan distance", () => {
        const map = new DungeonMap(makeConfig());

        expect(map.getDistanceToExit({ x: 0, y: 0 })).toBe(3);
        expect(map.getDistanceToExit({ x: 2, y: 1 })).toBe(0);
    });

    test("layout ว่างควร throw Error", () => {
        expect(() => new DungeonMap(makeConfig({ layout: [] }))).toThrow(
            "DungeonMap: layout ห้ามว่างเปล่า",
        );
    });

    test("layout ที่มีแถวความยาวไม่เท่ากันควร throw Error", () => {
        expect(() => new DungeonMap(makeConfig({ layout: [[0, 0], [0]] }))).toThrow(
            "DungeonMap: ทุกแถวใน layout ต้องมีความยาวเท่ากัน",
        );
    });

    test("wifePos ว่างควร throw Error", () => {
        expect(() => new DungeonMap(makeConfig({ wifePos: [] }))).toThrow(
            "DungeonMap: ต้องมีจุดที่เป็นไปได้ของ wifePos อย่างน้อย 1 จุด",
        );
    });

    test("wifePos ที่อยู่บน Wall ควร throw Error", () => {
        expect(() => new DungeonMap(makeConfig({ wifePos: [{ x: 2, y: 0 }] }))).toThrow(
            "DungeonMap: wifePos ที่สุ่มได้ตกอยู่บนกำแพงหรือนอกแมพ",
        );
    });

    test("wifePos ที่อยู่นอก map ควร throw Error", () => {
        expect(() => new DungeonMap(makeConfig({ wifePos: [{ x: 99, y: 99 }] }))).toThrow(
            "DungeonMap: wifePos ที่สุ่มได้ตกอยู่บนกำแพงหรือนอกแมพ",
        );
    });
});
