import { MapObject } from "../Type-Enum/enum";
import type { position } from "../Type-Enum/type";


export type MapConfig = {
    spawnPos: position;
    wifePos: position;
    exitPos: position;
    layout: number[][];
};

export class DungeonMap {
    private grid: MapObject[][];
    private width: number;
    private height: number;

    public readonly startPos: position;
    public readonly wifePos: position;
    public readonly exitPos: position;

    constructor(config: MapConfig) {
        if (config.layout.length === 0 || config.layout[0]?.length === 0) {
            throw new Error("DungeonMap: layout ห้ามว่างเปล่า");
        }

        this.height = config.layout.length;
        this.width = config.layout[0]!.length;
        this.grid = config.layout.map((row) => {
            if (row.length !== this.width) {
                throw new Error("DungeonMap: ทุกแถวใน layout ต้องมีความยาวเท่ากัน");
            }
            return row.map((cell) => (cell === 1 ? MapObject.Wall : MapObject.Floor));
        });

        this.startPos = config.spawnPos;
        this.wifePos = config.wifePos;
        this.exitPos = config.exitPos;
    }

    private isInBounds(pos: position): boolean {
        return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getTile(pos: position): MapObject {
        if (pos.x === this.exitPos.x && pos.y === this.exitPos.y) {
            return MapObject.Exit;
        }

        if (!this.isInBounds(pos)) {
            return MapObject.Wall;
        }

        return this.grid[pos.y]![pos.x]!;
    }

    isWalkable(pos: position): boolean {
        return this.getTile(pos) !== MapObject.Wall;
    }

    getDistanceToExit(pos: position): number {
        return Math.abs(pos.x - this.exitPos.x) + Math.abs(pos.y - this.exitPos.y);
    }
}
