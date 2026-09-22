import { AttackingType, DefensiveType } from "../Type-Enum/enum";
import type { Direction,logType } from "../Type-Enum/type";
import { render, useKeyboard, useRenderer } from "@opentui/solid"
import { GameState } from "../Game/State";
import { getCombat } from "../Tui/gameBridge";
import type { EnemyUIProps, InventoryUIProps, PlayerUIProps } from "../Tui/uiTypes";

export type GameInputIntent =
    | { type: "MOVE"; direction: Direction }
    | { type: "COMBAT_ACTION"; action: AttackingType | DefensiveType }
    | { type: "OPEN_INVENTORY" }
    | { type: "PAUSE" }
    | { type: "QUIT" }
    | { type: "UNKNOWN" };

export function parseKeyIntent(key: string): GameInputIntent {
    const normalizedKey = key.toLowerCase().replace(/^arrow[-_]?/, "");

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

export const INVENTORY_MAX_SLOTS = 8;
export class ConsoleIO {

    constructor(
        private addLog: (log: logType) => void = () => {},
        private addInventory: (items: InventoryUIProps) => void = () => {},
        private addPlayer: (items: PlayerUIProps) => void = () => {},
        private addEnemy: (enemy: EnemyUIProps) => void = () => {},
    ){}

    public ShowMessage(log:logType): void {
        this.addLog(log); // เอาฟังชั่นที่ได้จากการโยนมาใช้
    }
    
    public ShowInventory(gs: GameState): void {
        this.addInventory(this.getInventoryUIProps(gs))
    }
    public ShowPlayer(gs: GameState): void {
        this.addPlayer(this.getPlayerUIProps(gs))
    }
    public ShowEnemy(gs: GameState): void {
        this.addEnemy(this.getEnemyUIProps(gs)!)
    }

    public getPlayerUIProps(gs: GameState): PlayerUIProps {
      const p = gs.player;
      return {
        name: "HERO",
        hp: p.getHp(),
        maxHp: p.getMaxHp(),
        atk: p.getAtk(),
        def: p.getDef(),
        coin: p.getCoin(),
        position: p.getPosition(),
      };
    }

    public getEnemyUIProps(gs: GameState): EnemyUIProps | null {
      const combat = getCombat(gs);
      if (!combat) return null;
    
      const stats = combat.getMonsterStats();
    
      let name = "MONSTER";
      try {
        name = combat["monster"]["MonsterType"] ?? name;
      } catch {
        /* ใช้ชื่อกลางต่อไป */
      }
    
      return { name, hp: stats.hp, maxHp: stats.maxHp, atk: stats.atk, def: stats.def };
    }

    public getInventoryUIProps(gs: GameState): InventoryUIProps {
      const items = gs.player
        .getInventory()
        .getItems()
        .map((item) => ({
          name: item.item.name,
          description: item.item.description,
        }));
      return { items, maxSlots: INVENTORY_MAX_SLOTS };
    }


    // ไม่น่าได้ใช้แล้วพวกนี้ มั้งนะ
    // public Clear(): void {
    //     this.setMessage("");
    // }
    
    // public ShowStatus(status: string): void {
    //     this.setStatus(status);
    // }

    //renderMap(map: DungeonMap, playerPos: Position): void {
        // ทำทีหลัง
    //}


}