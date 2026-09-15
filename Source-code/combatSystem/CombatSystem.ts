import { Monster, Player,MonsterFactory, Character} from "../Character/character";
import { calculateDamage,EvadeCheck } from "../pure-function"
import type { MonsterType,stats, Weights,position } from "../Type-Enum/type";
import { AttackingType,DefensiveType } from "../Type-Enum/enum";

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
    startbattle(playerAction:AttackingType | DefensiveType): void {
        if (!this.player.isDead() && !this.monster.isDead()) {
            if (this.isPlayerAttacker) {
                if (!Object.values(AttackingType).includes(playerAction as AttackingType)) {
                    throw new Error("Player is Attacking But Action Is Not AttackingType");
                }
                const monsterAction : DefensiveType = this.monster.decideDefensiveAction()
                this.processTurn(this.player, this.monster,playerAction as AttackingType,monsterAction);
            } else {
                if (!Object.values(DefensiveType).includes(playerAction as DefensiveType)) {
                    throw new Error("Player is Defensive But Action Is Not DefensiveType");
                }
                this.processTurn(this.monster, this.player,this.monster.decideAttackingAction(),playerAction as DefensiveType);
            }
        }
    }

    calculateDamage(damageSource: Character, damageTarget: Character,multiplier:number): number {
        return calculateDamage(damageSource, damageTarget,multiplier,Math.random());
    }

    processTurn(Attacker:Character,defensive:Character,AttackerAct:AttackingType,defensiveAct:DefensiveType):void{
        const multipliers: Partial<Record<AttackingType, Partial<Record<DefensiveType, number>>>> = {
            [AttackingType.Attack]: {
                [DefensiveType.Defend]: 0.5,
                [DefensiveType.Counter]: 1.5,
                [DefensiveType.Run]: 0.25,
            },
            [AttackingType.Strike]: {
                [DefensiveType.Defend]: 2.0,
                [DefensiveType.Counter]: 2.0,
                [DefensiveType.Run]: 0.5,
            },
        };
        const multiplier = multipliers[AttackerAct]?.[defensiveAct] ?? 0;

        if (multiplier === 0) {
            return;
        }

        const isCounter = defensiveAct === DefensiveType.Counter && AttackerAct === AttackingType.Strike;
        const damageTarget = isCounter ? Attacker : defensive;
        const damageSource = isCounter ? defensive : Attacker;
        
        damageTarget.takeDamage(this.calculateDamage(damageSource,damageTarget,multiplier));
    }

    // test
    checkEvasion(character: Character): boolean {
        const randomValue = Math.random();
        return EvadeCheck(character, randomValue);
    }
}