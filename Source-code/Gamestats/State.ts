import { Player } from "../Character/character";
import { GameScreen } from "./GameScreen";
import { DungeonMap } from "./DungeonMap";
import { Position } from "./Position";
import { CombatSystem } from "./CombatSystem";
import { Event } from "./Event";

export type Direction = "up" | "down" | "left" | "right";

export enum EndingType {
  NONE,      // ยังไม่ถึง exit เกมยังไม่จบ
  GOOD_END,  // ถึง exit + ช่วยภรรยาแล้ว
  BAD_END,   // ถึง exit + ไม่ได้ช่วยภรรยา
}

export class GameState {
  // ---- Public fields ----
  public player: Player;
  public gameScreen: GameScreen;
  public currentMap: DungeonMap;
  public exploredTiles: Set<Position>;

  // ---- Private fields ----
  private isGetWife: boolean;
  private combatSystem: CombatSystem;
  private eventSystem: Event;
  private isPause: boolean;

  constructor(player: Player, gameScreen: GameScreen, currentMap: DungeonMap) {
    this.player = player;
    this.gameScreen = gameScreen;
    this.currentMap = currentMap;
    this.exploredTiles = new Set<Position>();

    this.isGetWife = false;
    this.combatSystem = new CombatSystem();
    this.eventSystem = new Event();
    this.isPause = false;
  }

  // ---- Private methods ----
  private Pause(): void {
    this.isPause = !this.isPause;
  }

  // ---- Public methods ----
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
    const pos: Position = this.player.Position;

  }
  public checkEnding(): EndingType {
    const reachedExit =
      this.currentMap.getDistanceToExit(this.player.Position) === 0;
 
    if (!reachedExit) return EndingType.NONE;
 
    return this.isGetWife ? EndingType.GOOD_END : EndingType.BAD_END;
  }

  public isGameOver(): boolean {
    return this.player.getHp() <= 0;
  }

  public isVictory(): boolean {
    return this.checkEnding() === EndingType.GOOD_END;
}
  }
