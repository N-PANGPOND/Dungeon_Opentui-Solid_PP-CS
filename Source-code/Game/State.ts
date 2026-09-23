import { Player } from "../Character/character";
import type { position, gameScreen,Direction,logType } from "../Type-Enum/type";
import { DungeonMap } from"../DungeonMap/DungeonMap"
import { CombatSystem } from "../System/CombatSystem"
import { Event } from "../Event/Event"
import { AttackingType, DefensiveType } from "../Type-Enum/enum";
import { ConsoleIO } from "../ConsoleIO/ConsoleIO";


//import { Event }


export class GameState {
  public player: Player;
  public gameScreen: gameScreen;
  public currentMap: DungeonMap;
  public exploredTiles: Set<position>; // Set of explored tile positions in the format "x,y"
  public selectedSlot: number | null;

  private ConsoleIO : ConsoleIO
  private isGetWife: boolean;
  private isPause: boolean;
  private combatSystem: CombatSystem;
 // private eventSystem: GameEvent;

  constructor(currentMap: DungeonMap,addLog: (log: logType) => void = () => {}) {
    this.gameScreen = "DUNGEON";
    this.currentMap = currentMap;
    this.player = new Player({maxHp:160,hp:160,atk:30,def:5,luc:10,agi:25,coin:50},currentMap.getStartPos());;
    this.exploredTiles = new Set<position>();
    this.isGetWife = false;
    this.isPause = false;
    this.selectedSlot = null;
    this.ConsoleIO = new ConsoleIO(()=>{},()=>{},()=>{}, addLog)
    this.combatSystem = new CombatSystem(this.player,this.currentMap, (log) => this.ConsoleIO.ShowMessage(log));
   //this.eventSystem = new GameEvent();
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
    const damage = Event.prototype.Trap(this.player)
    this.ConsoleIO.ShowMessage({type: "System" , text: `เจอกับดัก เสีย Hp ${damage}!!`})
  }

  public eventTreasure():void{
    const coin = Event.prototype.Treasure(this.player)
    this.ConsoleIO.ShowMessage({type: "System" , text: `เจอสมบัติ ได้ coin ${coin}!!`})
  }
  
  public eventPotion():void{
    const Potion = Event.prototype.Potion()
    if (this.player.getInventory().isFull()) {
        this.ConsoleIO.ShowMessage({ type: "System", text: `เจอ Potion ${Potion.getName()} แต่กระเป๋าเต็ม หยิบไม่ได้!!  ` });
        return;
    }
    this.player.addItem(Potion);    
    this.ConsoleIO.ShowMessage({type: "System" , text: `เจอ Potion ${Potion.getName()}!!`})
  }

  public eventShop():void{
    const Potion = Event.prototype.Shop()
    this.ConsoleIO.ShowMessage({type: "System" , text: `ว้าว เจอ shop แต่กูไม่ให้ซื้อยังทำระบบไม่เสร็จ`})
  }

  public eventNothing():void{
    this.ConsoleIO.ShowMessage({type: "System" , text: `ปกติดีไม่มีอะไรเกิดขึ้น`})
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

  public toggleInventory(): void {
    if (this.gameScreen === "DUNGEON") {
      this.gameScreen = "INVENTORY";
    } else if (this.gameScreen === "INVENTORY") {
      this.gameScreen = "DUNGEON";  
    }
  }

  public selectSlot(index: number): void {
    if (this.gameScreen !== "INVENTORY") return;
      const items = this.player.getInventory().getItems();
      if (index < 0 || index >= items.length) return;
    this.selectedSlot = index;
  }

  public useSelectedItem(): void {
    if (this.gameScreen !== "INVENTORY") return;  
    if (this.selectedSlot === null) return;
    this.player.getInventory().useItem(this.selectedSlot, this.player);
    this.selectedSlot = null;
  }
  public discardSelectedItem(): void {
    if (this.gameScreen !== "INVENTORY") return;
    if (this.selectedSlot === null) return;
    this.player.getInventory().removeItem(this.selectedSlot);
    this.selectedSlot = null;
  }
}
