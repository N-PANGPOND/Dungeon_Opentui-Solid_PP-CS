import { mapSystem } from "../System/mapSystem";
import { ConsoleIO } from "../ConsoleIO/ConsoleIO";
import { GameState } from "./State";
import type { logType } from "../Type-Enum/type";

export class GameLoop {
    private isRunning: boolean;
    private gameState: GameState;
    private consoleIO: ConsoleIO;

    constructor(addLog: (log: logType) => void = () => {}) {
        this.isRunning = false;
        this.gameState = new GameState(mapSystem.prototype.randomMaps());
        this.consoleIO = new ConsoleIO(()=>{},()=>{},()=>{}, addLog);
    }

    public start(): void {
        this.isRunning = true;
        this.consoleIO.Clear();

        // this.consoleIO.renderMap(this.gameState.currentMap, this.gameState.Player.getPosition());
    }

    public handleInput(key: string): void {
        if (!this.isRunning) {
            return;
        }

        if (this.gameState.gameScreen === "COMBAT") {
            const action = this.gameState.combatActionForKey(key);
            if (action !== undefined) {
                this.gameState.handleCombatAction(action);
            }
            return;
        }

        switch (key) {
            case "up":
            case "w":
                console.log("Im in W")
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

        if (this.gameState.isGameOver()) {
            this.consoleIO.ShowMessage({ type: "System", text: "คุณแพ้แล้ว..." });
            this.end();
            return;
        }

        if (this.gameState.isVictory()) {
            this.consoleIO.ShowMessage({ type: "System", text: "คุณชนะแล้ว!" });
            this.end();
            return;
        }

        this.consoleIO.Clear();
        // this.consoleIO.renderMap(this.gameState.currentMap, this.gameState.Player.getPosition());
    }

    public end(): void {
        this.isRunning = false;
        this.consoleIO.Clear();
        this.consoleIO.ShowMessage({ type: "System", text: "จบเกม ขอบคุณที่เล่น" });
    }

    public getConsoleIo():ConsoleIO {
        return this.consoleIO
    }

    public getGameState():GameState{
        return this.gameState
    }
}