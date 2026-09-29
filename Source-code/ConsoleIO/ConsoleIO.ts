import { AttackingType, DefensiveType } from "../Type-Enum/enum";
import type { Direction,logType, gameScreen } from "../Type-Enum/type";
import { GameState } from "../Game/State";
import { getCombat } from "../Tui/gameBridge";
import type { EnemyUIProps, InventoryUIProps, PlayerUIProps } from "../Tui/uiTypes";


export type GameInputIntent =
    | { type: "MOVE"; direction: Direction }
    | { type: "COMBAT_ACTION"; action: AttackingType | DefensiveType }
    | { type: "OPEN_INVENTORY" }
    | { type: "QUIT" }
    | { type: "UNKNOWN" }
    | { type: "SELECT_SLOT"; index: number }
    | { type: "USE_ITEM" }
    | { type: "DISCARD_ITEM" }; 
    
const THAI_KEDMANEE_TO_QWERTY: Record<string, string> = {
  "ๅ": "1", "/": "2", "-": "3", "ภ": "4", "ถ": "5", "ุ": "6", "ึ": "7", "ค": "8",
  "ๆ": "q", "ไ": "w", "ำ": "e", "พ": "r", "ะ": "t", "ั": "y", "ี": "u", "ร": "i", "น": "o", "ย": "p",
  "ฟ": "a", "ห": "s", "ก": "d", "ด": "f", "เ": "g", "้": "h", "่": "j", "า": "k", "ส": "l",
  "ผ": "z", "ป": "x", "แ": "c", "อ": "v", "ิ": "b", "ื": "n", "ท": "m",
};

const NUMPAD_TO_DIGIT: Record<string, string> = {
  kp0: "0", kp1: "1", kp2: "2", kp3: "3", kp4: "4",
  kp5: "5", kp6: "6", kp7: "7", kp8: "8", kp9: "9",
};

export function normalizeKeyName(name: string): string {
  if (name in NUMPAD_TO_DIGIT) return NUMPAD_TO_DIGIT[name]!;
  return THAI_KEDMANEE_TO_QWERTY[name] ?? name;
}

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
}