import { Player } from "../Character/character";
import type { position, gameScreen,Direction,logType } from "../Type-Enum/type";
import { DungeonMap } from"../DungeonMap/DungeonMap"
import { CombatSystem } from "../System/CombatSystem"
import { AttackingType, DefensiveType } from "../Type-Enum/enum";
import { ConsoleIO } from "../ConsoleIO/ConsoleIO";


//import { Event }


export class GameState {
  public player: Player;
  public gameScreen: gameScreen;
  public currentMap: DungeonMap;
  public exploredTiles: Set<position>; // Set of explored tile positions in the format "x,y"

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
    const chance = Math.random();
    if (chance <= 0.28) {
      this.ConsoleIO.ShowMessage({ type: "System", text: "คุณเจอมอนสเตอร์!!" });
      this.combatSystem = new CombatSystem(this.player,this.currentMap, (log) => this.ConsoleIO.ShowMessage(log));
      const monster = this.combatSystem.getMonsterStats();
      this.ConsoleIO.ShowMessage({
        type: "System",
        text: `Monster stats: HP ${monster.hp}/${monster.maxHp}, ATK ${monster.atk}, DEF ${monster.def}, LUC ${monster.luc}, AGI ${monster.agi}, Coin ${monster.coin}`,
      });
      this.gameScreen = "COMBAT";

    }
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