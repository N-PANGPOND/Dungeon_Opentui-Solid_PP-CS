import { mapSystem } from "../System/mapSystem";
import { ConsoleIO, parseKeyIntent } from "../ConsoleIO/ConsoleIO";
import type { GameInputIntent } from "../ConsoleIO/ConsoleIO";
import { GameState } from "./State";
import type { logType } from "../Type-Enum/type";

export class GameLoop {
    private isRunning: boolean;
    private gameState: GameState;
    private consoleIO: ConsoleIO;

    constructor(addLog: (log: logType) => void = () => {}) {
        this.isRunning = false;
        this.gameState = new GameState(mapSystem.prototype.randomMaps(),addLog);
        this.consoleIO = new ConsoleIO(addLog);
    }

    public start(): void {
        this.isRunning = true;
    }

    public handleInput(key: string): void {
        if (!this.isRunning) {
            return;
        }
        const intent: GameInputIntent = parseKeyIntent(key);

        switch (intent.type) {
            case "MOVE":
                this.gameState.movePlayer(intent.direction);
                break;
            case "COMBAT_ACTION":
                if (this.gameState.gameScreen === "COMBAT") {
                    this.gameState.handleCombatAction(intent.action);
                }
                break;
            case "QUIT":
                this.end();
                return;
            case "OPEN_INVENTORY":
            case "PAUSE":
            case "UNKNOWN":
                // TODO: Implement this input intent.
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

    }

    public end(): void {
        this.isRunning = false;
        this.consoleIO.ShowMessage({ type: "System", text: "จบเกม ขอบคุณที่เล่น" });
    }

    public getConsoleIo():ConsoleIO {
        return this.consoleIO
    }

    public getGameState():GameState{
        return this.gameState
    }
}