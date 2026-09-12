import { AttackingType, DefensiveType } from "../Type-Enum/enum";

export class ConsoleIO {

    ShowMessage(type: string, text: string): void {
        console.log(`[${type}] ${text}`);
    }

    Clear(): void {
        console.clear();
    }

    //renderMap(map: DungeonMap, playerPos: Position): void {
        // ทำทีหลัง
    //}

    showAttackingMenu(): AttackingType {

        console.log("===== ATTACK MENU =====");
        console.log("1. Attack");
        console.log("2. Strike");
        console.log("3. Use Item");
        console.log("4. Run");

        const choice = Number(prompt("Choose: "));

        switch (choice) {
            case 1:
                return AttackingType.Attack;

            case 2:
                return AttackingType.Strike;

            case 3:
                return AttackingType.UseItem;

            case 4:
                return AttackingType.Run;

            default:
                console.log("Invalid choice!");
                return this.showAttackingMenu();
        }
    }

    showDefensiveMenu(): DefensiveType {

        console.log("===== DEFENSIVE MENU =====");
        console.log("1. Defend");
        console.log("2. Counter");
        console.log("3. Use Item");
        console.log("4. Run");

        const choice = Number(prompt("Choose: "));

        switch (choice) {
            case 1:
                return DefensiveType.Defend;

            case 2:
                return DefensiveType.Counter;

            case 3:
                return DefensiveType.UseItem;

            case 4:
                return DefensiveType.Run;

            default:
                console.log("Invalid choice!");
                return this.showDefensiveMenu();
        }
    }
}