import type { GameState } from "../GameState/GameState";
import type { ConsoleIO } from "../ConsoleIO/ConsoleIO";

export class GameLoop {
    private isRunning: boolean;
    private gameState: GameState;
    private consoleIO: ConsoleIO;

    constructor(gameState: GameState, consoleIO: ConsoleIO) {
        this.isRunning = false;
        this.gameState = gameState;
        this.consoleIO = consoleIO;
    }

    public start(): void {
        this.isRunning = true;
        this.consoleIO.Clear();
       // this.consoleIO.renderMap(this.gameState.currentMap, this.gameState.Player.getPosition());
    }

    /*public handleInput(key: string): void {
        if (!this.isRunning) {
            return;
        }

        switch (key) {
            case "up":
            case "w":
                this.gameState.movePlayer("up");
                break;
            case "down":
            case "s":
                this.gameState.movePlayer("down");
                break;
            case "left":
            case "a":
                this.gameState.movePlayer("left");
                break;
            case "right":
            case "d":
                this.gameState.movePlayer("right");
                break;
        }

        this.gameState.checkTileEvent();

        if (this.gameState.isGameOver()) {
            this.consoleIO.ShowMessage("GAMEOVER", "คุณแพ้แล้ว...");
            this.end();
            return;
        }

        if (this.gameState.isVictory()) {
            this.consoleIO.ShowMessage("VICTORY", "คุณชนะแล้ว!");
            this.end();
            return;
        }

        this.consoleIO.Clear();
        this.consoleIO.renderMap(this.gameState.currentMap, this.gameState.Player.getPosition());
    }*/

    public end(): void {
        this.isRunning = false;
        this.consoleIO.Clear();
        this.consoleIO.ShowMessage("SYSTEM", "จบเกม ขอบคุณที่เล่น");
    }
}