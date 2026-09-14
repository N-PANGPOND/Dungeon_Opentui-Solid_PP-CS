import { Player } from "../Character/character";
import { Position, GameScreen } from "../Type-Enum/type";
import { DungeonMap } from"../DungeonMap/DungeonMap"
//import { CombatSystem } 
//import { Event }

export type Direction = "up" | "down" | "left" | "right";

export class GameState {
  // Public 
  public player: Player;
  public gameScreen: GameScreen;
  public currentMap: DungeonMap;
  public exploredTiles: Set<Position>;

  //  Private 
  private isGetWife: boolean;
  private combatSystem: CombatSystem;
  private eventSystem: GameEvent;
  private isPause: boolean;

  constructor(player: Player, gameScreen: GameScreen, currentMap: DungeonMap) {
    this.player = player;
    this.gameScreen = gameScreen;
    this.currentMap = currentMap;
    this.exploredTiles = new Set<Position>();
    this.isGetWife = false;
    this.combatSystem = new CombatSystem();
    this.eventSystem = new GameEvent();
    this.isPause = false;
  }

  // Private methods
  private Pause(): void {
    this.isPause = !this.isPause;
  }

  // Public methods
  public movePlayer(direction: Direction): boolean {
    if (this.isPause) return false;

    const nextPos: Position = {
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
    if (chance < 0.40) {
      // 40% ไม่มีอะไรเกิดขึ้น
      return;
    } else if (chance < 0.70) {
      // 30% เกิดการต่อสู้
      this.gameScreen = "COMBAT";
      this.combatSystem.startCombat(this.player, this.currentMap.getRandomMonster());
    }else if (chance < 0.90) {
      // 20% เกิดเหตุการณ์พิเศษ
      this.gameScreen = "EVENT";
      this.eventSystem.triggerEvent(this.player);
    }else {
      // 10% เกิดการซื้อขาย
      this.gameScreen = "SHOP";
    
    }
  }

  public isGameOver(): boolean {
    return this.player.getHp() <= 0;
  }

  public isVictory(): boolean {
     return this.currentMap.getDistanceToExit(this.player.Position) === 0;
  }
}