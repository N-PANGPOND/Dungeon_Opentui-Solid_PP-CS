import { Monster, Player,MonsterFactory, Character} from "../Character/character";
import { calculateDamage,EvadeCheck } from "../pure-function"
import type { MonsterType,stats, Weights,position } from "../Type-Enum/type";
class DungeonMap {
    private exitPos : position;
    constructor() {
        this.exitPos = { x: 59, y: 59 };
    }
    getExitPos(): position {
        return this.exitPos;
    }
}








export class CombatSystem {
    private player: Player;
    private monster: Monster;
    private isPlayerAttacker: boolean;
    constructor(player: Player,DungeonMap:DungeonMap) { 
        this.player = player;
        let distToExit:number = ((DungeonMap.getExitPos().x - this.player.getPosition().x) + (DungeonMap.getExitPos().y - this.player.getPosition().y));
        this.monster = MonsterFactory.createMonster(distToExit);
        this.isPlayerAttacker = true;
    }
    startbattle(): void {
        // รอ implement เพิ่มเติม
        while (!this.player.isDead() && !this.monster.isDead()) {
            if (this.isPlayerAttacker) {
                this.processTurn(this.player, this.monster);
            } else {
                this.processTurn(this.monster, this.player);
            }
        }
    }

    calculateDamage(attacker: Character, defender: Character): number {
        // return calculateDamage(attacker, defender, this.isPlayerAttacker ? attacker.decideAttackingAction() : defender.decideDefensiveAction(), this.isPlayerAttacker ? defender.decideDefensiveAction() : attacker.decideAttackingAction());
        // รอ 
        return 0;
    }

    processTurn(Attacker:Character,defensive:Character):void{
        // ตันแล้วพี่น้อง
    }

    checkEvasion(character: Character): boolean {
        const randomValue = Math.random();
        return EvadeCheck(character, randomValue);
    }
}