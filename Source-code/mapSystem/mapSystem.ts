import { DungeonMap, type MapConfig } from "../DungeonMap/DungeonMap";
import mapData from "../map.json" with { type: "json" };

export class mapSystem {

    randomMaps(): DungeonMap[] {
        const configs = Object.values(mapData.map) as MapConfig[];

        if (configs.length === 0) {
            throw new Error("mapSystem: ไม่พบข้อมูลแมพใน map.json");
        }

        const picked = configs[Math.floor(Math.random() * configs.length)]!;
        return [new DungeonMap(picked)];
    }
}