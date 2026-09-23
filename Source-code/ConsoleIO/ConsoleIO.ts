import { AttackingType, DefensiveType } from "../Type-Enum/enum";
import type { Direction,logType, gameScreen } from "../Type-Enum/type";
import { render, useKeyboard, useRenderer } from "@opentui/solid"
import { GameState } from "../Game/State";


export type GameInputIntent =
    | { type: "MOVE"; direction: Direction }
    | { type: "COMBAT_ACTION"; action: AttackingType | DefensiveType }
    | { type: "OPEN_INVENTORY" }
    | { type: "PAUSE" }
    | { type: "QUIT" }
    | { type: "UNKNOWN" }
    | { type: "SELECT_SLOT"; index: number }
    | { type: "USE_ITEM" }
    | { type: "DISCARD_ITEM" }; 
    

export function parseKeyIntent(key: string, screen: gameScreen): GameInputIntent {
    const normalizedKey = key.toLowerCase().replace(/^arrow[-_]?/, "");

    if (screen === "INVENTORY") {
        if (/^[1-8]$/.test(normalizedKey)) {
            return { type: "SELECT_SLOT", index: Number(normalizedKey) - 1 };
        }
        if (normalizedKey === "u") {
            return { type: "USE_ITEM" };
        }
        if (normalizedKey === "x") {
            return { type: "DISCARD_ITEM" };
        }
    }   
    switch (normalizedKey) {
        case "up":
        case "w":
            return { type: "MOVE", direction: "up" };
        case "down":
        case "s":
            return { type: "MOVE", direction: "down" };
        case "left":
        case "a":
            return { type: "MOVE", direction: "left" };
        case "right":
        case "d":
            return { type: "MOVE", direction: "right" };
        case "1":
            return { type: "COMBAT_ACTION", action: AttackingType.Attack };
        case "2":
            return { type: "COMBAT_ACTION", action: AttackingType.Strike };
        case "3":
            return { type: "COMBAT_ACTION", action: AttackingType.UseItem };
        case "4":
            return { type: "COMBAT_ACTION", action: AttackingType.Run };
        case "5":
            return { type: "COMBAT_ACTION", action: DefensiveType.Defend };
        case "6":
            return { type: "COMBAT_ACTION", action: DefensiveType.Counter };
        case "7":
            return { type: "COMBAT_ACTION", action: DefensiveType.UseItem };
        case "8":
            return { type: "COMBAT_ACTION", action: DefensiveType.Run };
        case "i":
            return { type: "OPEN_INVENTORY" };
        case "p":
            return { type: "PAUSE" };
        case "q":
        case "escape":
            return { type: "QUIT" };
        default:
            return { type: "UNKNOWN" };
    }
}


export class ConsoleIO {

    constructor(
        private setMessage:(value: string) => void,
        private setStatus: (value: string) => void,
        private setInventory: (value: string) => void,
        private addLog: (log: logType) => void = () => {},
    ){}

    public ShowMessage(log:logType): void {
        this.addLog(log);
        this.setMessage(`[${log.type}] ${log.text}`);
    }

    public Clear(): void {
        this.setMessage("");
    }
    
    public ShowStatus(status: string): void {
        this.setStatus(status);
    }

    //renderMap(map: DungeonMap, playerPos: Position): void {
        // ทำทีหลัง
    //}

   public ShowInventory(items: string[]): void {
    this.setInventory(items.length > 0 ? items.join(", ") : "Inventory is empty.");
   }

}