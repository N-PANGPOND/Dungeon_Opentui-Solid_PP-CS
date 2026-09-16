import { Player } from "../Character/character";
import type { position, gameScreen,Direction } from "../Type-Enum/type";
import { DungeonMap } from"../DungeonMap/DungeonMap"
import { CombatSystem } from "../System/CombatSystem"
import { AttackingType, DefensiveType } from "../Type-Enum/enum";

//import { Event }


export class GameState {
  public player: Player;
  public gameScreen: gameScreen;
  public currentMap: DungeonMap;
  public exploredTiles: Set<position>; // Set of explored tile positions in the format "x,y"

  private isGetWife: boolean;
  private isPause: boolean;
  private combatSystem: CombatSystem;
 // private eventSystem: GameEvent;

  constructor(currentMap: DungeonMap) {
    this.gameScreen = "DUNGEON";
    this.currentMap = currentMap;
    this.player = new Player({maxHp:160,hp:160,atk:30,def:5,luc:10,agi:25,coin:50},currentMap.getStartPos());;
    this.exploredTiles = new Set<position>();
    this.isGetWife = false;
    this.isPause = false;
    this.combatSystem = new CombatSystem(this.player,this.currentMap);
   //this.eventSystem = new GameEvent();
  }

  private Pause(): void {
    this.isPause = !this.isPause;
  }

  public movePlayer(direction: Direction): boolean {
    if (this.isPause) return false;

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
      return false;
    }

    this.player.Position = nextPos;
    this.exploredTiles.add(nextPos);

    this.checkTileEvent();

    return true;
  }

  public checkTileEvent(): void {
    const chance = Math.random();
    if (chance >= 0.50) {
      this.gameScreen = "COMBAT";
      
    }
  }

  public combatActionForKey(key: string): AttackingType | DefensiveType | undefined {
    if (this.combatSystem.isPlayerTurn()) {
      const actions: Record<string, AttackingType> = {
        "1": AttackingType.Attack,
        "2": AttackingType.Strike,
        "3": AttackingType.UseItem,
        "4": AttackingType.Run,
      };
      return actions[key];
    }

    const actions: Record<string, DefensiveType> = {
      "1": DefensiveType.Defend,
      "2": DefensiveType.Counter,
      "3": DefensiveType.UseItem,
      "4": DefensiveType.Run,
    };
    return actions[key];
  }

  public handleCombatAction(action: AttackingType | DefensiveType): void {
    if (this.gameScreen !== "COMBAT") return;

    this.combatSystem.startbattle(action);

    if (this.player.isDead()) {
      this.gameScreen = "GAMEOVER";
    } else if (this.combatSystem.isBattleOver()) {
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