import { Player } from "../Character/character";
import type { position, gameScreen,Direction,logType } from "../Type-Enum/type";
import { DungeonMap } from"../DungeonMap/DungeonMap"
import { CombatSystem } from "../System/CombatSystem"
import { Event } from "../Event/Event"
import { AttackingType, DefensiveType } from "../Type-Enum/enum";
import { ConsoleIO } from "../ConsoleIO/ConsoleIO";
import path from "path";

import { Item } from "../Item-Inventory/Item";

// ─── Pending Event Type ──────────────────────────────────────────────────────

export type PendingEvent = {
  name: string;      // ชื่อ event ที่แสดงบน splash screen
  grid: number[][];  // pixel grid 27×46 จาก event.json
  color: string;     // สีหลักของ event นั้น
  isChoice?: boolean; // เป็น event ที่ต้องให้ผู้เล่นกดเลือกหรือไม่
  potionItem?: Item | null; // ไอเทมโพชั่นที่พบ (ถ้ามี)
};

// โหลด event.json ครั้งเดียวตอน module load
const eventDataPath = path.join(import.meta.dir, "../assets/Event/event.json");
const eventJsonRaw = await Bun.file(eventDataPath).json() as {
  "event@": {
    Combat: {
      normal: { screen: number[][] };
      elite:  { screen: number[][] };
      boss:   { screen: number[][] };
    };
    Trap:     { screen: number[][] };
    Potion:   { screen: number[][] };
    Shop:     { screen: number[][] };
    Treasure: { screen: number[][] };
  };
};
const eventScreens = eventJsonRaw["event@"];

export class GameState {
  public player: Player;
  public gameScreen: gameScreen;
  public currentMap: DungeonMap;
  public exploredTiles: Set<position>; // Set of explored tile positions in the format "x,y"

  private ConsoleIO : ConsoleIO
  private isGetWife: boolean;
  private isPause: boolean;
  private combatSystem: CombatSystem;
  private pendingEvent: PendingEvent | null = null;
 // private eventSystem: GameEvent;

  constructor(currentMap: DungeonMap,addLog: (log: logType) => void = () => {}) {
    this.gameScreen = "DUNGEON";
    this.currentMap = currentMap;
    this.player = new Player({maxHp:160,hp:160,atk:30,def:5,luc:10,agi:25,coin:50},currentMap.getStartPos());;
    this.exploredTiles = new Set<position>();
    this.isGetWife = false;
    this.isPause = false;
    this.ConsoleIO = new ConsoleIO(()=>{},()=>{},()=>{}, addLog)
    this.combatSystem = new CombatSystem(this.player,this.currentMap, (log) => this.ConsoleIO.ShowMessage(log));
   //this.eventSystem = new GameEvent();
  }

  // ─── Pending Event Getter / Clear ─────────────────────────────────────────

  public getPendingEvent(): PendingEvent | null {
    return this.pendingEvent;
  }

  public clearPendingEvent(): void {
    this.pendingEvent = null;
  }

  private Pause(): void {
    this.isPause = !this.isPause;
  }

  public movePlayer(direction: Direction): boolean {
    if (this.isPause || this.gameScreen !== "DUNGEON") return false;

    const nextPos: position = {
      x: this.player.Position.x,
      y: this.player.Position.y,
    };

    switch (direction) {
      case "up":
        nextPos.y -= 1;
        break;
      case "down":
        nextPos.y += 1;
        break;
      case "left":
        nextPos.x -= 1;
        break;
      case "right":
        nextPos.x += 1;
        break;
    }

    if (!this.currentMap.isWalkable(nextPos)) {
      this.ConsoleIO.ShowMessage({type:"System",text:"is Not Walkable"})
      return false;
    }

    this.player.Position = nextPos;
    this.exploredTiles.add(nextPos);

    this.checkTileEvent();

    return true;
  }

  public checkTileEvent(): void {
    const tileEvents : {
      name:string,
      weight:number,
      action:() => void 
    }[] = [
      {name : "monster",weight : 0.25,action : () => this.eventCombat()},
      {name : "Trap",weight : 0.07,action : () => this.eventTrap()},
      {name : "Treasure",weight : 0.10,action : () => this.eventTreasure()},
      {name : "Potion",weight : 0.04,action : () => this.eventPotion()},
      {name : "shop",weight : 0.09,action : () => this.eventShop()},
      {name : "Nothing",weight : 0.50,action : () => this.eventNothing()}
    ]
    const totalWeight = tileEvents.reduce((sum, event) => sum + event.weight, 0)
    let chance = Math.random()*totalWeight;

    for (const event of tileEvents) {
      if (chance < event.weight) {
        event.action();
        return;
      }
      chance -= event.weight;
    }
  }

  public eventTrap():void{
    // เซ็ต splash screen ก่อน execute logic
    this.pendingEvent = {
      name: "⚠ TRAP!",
      grid: eventScreens.Trap.screen,
      color: "#ef4444",
    };
    const damage = Event.prototype.Trap(this.player);
    this.ConsoleIO.ShowMessage({ type: "System", text: `Trap triggered! Lost ${damage} HP!` });
  }

  public eventTreasure(): void {
    this.pendingEvent = {
      name: "★ TREASURE!",
      grid: eventScreens.Treasure.screen,
      color: "#fbbf24",
    };
    const coin = Event.prototype.Treasure(this.player);
    this.ConsoleIO.ShowMessage({ type: "System", text: `Found Treasure! Gained ${coin} Coins!` });
  }
  
  private currentFoundPotion: Item | null = null;

  public eventPotion(): void {
    const potion = Event.prototype.Potion();
    this.currentFoundPotion = potion;
    this.pendingEvent = {
      name: `⊕ FOUND: ${potion.getName()}`,
      grid: eventScreens.Potion.screen,
      color: "#22c55e",
      isChoice: true,
      potionItem: potion,
    };
    this.ConsoleIO.ShowMessage({ type: "System", text: `Found Potion: ${potion.getName()}! [1] Take  [2] Leave` });
  }

  public takePotion(): boolean {
    if (!this.currentFoundPotion) return false;
    const added = this.player.getInventory().addItem(this.currentFoundPotion);
    if (added) {
      this.ConsoleIO.ShowMessage({ type: "System", text: `Added ${this.currentFoundPotion.getName()} to inventory!` });
    } else {
      this.ConsoleIO.ShowMessage({ type: "System", text: `Inventory is full! Could not take ${this.currentFoundPotion.getName()}.` });
    }
    this.currentFoundPotion = null;
    this.clearPendingEvent();
    return added;
  }

  public leavePotion(): void {
    if (this.currentFoundPotion) {
      this.ConsoleIO.ShowMessage({ type: "System", text: `Left ${this.currentFoundPotion.getName()} behind.` });
    }
    this.currentFoundPotion = null;
    this.clearPendingEvent();
  }

  public eventShop(): void {
    this.pendingEvent = {
      name: "● SHOP",
      grid: eventScreens.Shop.screen,
      color: "#06b6d4",
    };
    const Potion = Event.prototype.Shop();
    this.ConsoleIO.ShowMessage({ type: "System", text: `Found a Shop (Coming soon)!` });
  }

  public eventNothing(): void {
    this.ConsoleIO.ShowMessage({ type: "System", text: `Nothing happened here.` });
  }

  public eventCombat():void{
    this.ConsoleIO.ShowMessage({ type: "System", text: "คุณเจอมอนสเตอร์!!" });
    this.combatSystem = new CombatSystem(this.player,this.currentMap, (log) => this.ConsoleIO.ShowMessage(log));

    const monster = this.combatSystem.getMonsterStats();
    this.ConsoleIO.ShowMessage({
      type: "System",
      text: `Monster stats: HP ${monster.hp}/${monster.maxHp}, ATK ${monster.atk}, DEF ${monster.def}, LUC ${monster.luc}, AGI ${monster.agi}, Coin ${monster.coin}`,
    });
    this.gameScreen = "COMBAT";
  }

  public handleCombatAction(action: AttackingType | DefensiveType): void {
    if (this.gameScreen !== "COMBAT") return;

    this.combatSystem.startbattle(action);

    if (this.player.isDead()) {
      this.gameScreen = "GAMEOVER";
    } else if (this.combatSystem.isBattleOver()) {
      this.ConsoleIO.ShowMessage({type:"System",text:"Monster isDead"})
      this.gameScreen = "DUNGEON";
    }
  }

  public isGameOver(): boolean {
    return this.player.getHp() <= 0;
  }

  public isVictory(): boolean {
     return this.currentMap.getDistanceToExit(this.player.Position) === 0;
  }
}