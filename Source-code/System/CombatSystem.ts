import { Monster, Player,MonsterFactory, Character} from "../Character/character";
import { calculateDamage,EvadeCheck } from "../shared/pure-function"
import type { MonsterType,stats, Weights,position,logType } from "../Type-Enum/type";
import { AttackingType,DefensiveType } from "../Type-Enum/enum";
import { DungeonMap } from "../DungeonMap/DungeonMap";


export class CombatSystem {
    private monster: Monster;
    private isPlayerAttacker: boolean;
    private hasFled: boolean = false;
    constructor(private player: Player,DungeonMap:DungeonMap, private ShowMessage: (log: logType) => void = () => {}) { 
        this.player = player;
        let distToExit: number = Math.abs(DungeonMap.getExitPos().x - this.player.getPosition().x) + Math.abs(DungeonMap.getExitPos().y - this.player.getPosition().y);
        this.monster = MonsterFactory.createMonster(distToExit);
        this.isPlayerAttacker = true;
        
    }
    public fleeWithSmokeBomb(): void {
    this.hasFled = true;
    }

    public getHasFled(): boolean {
    return this.hasFled;
   }
    startbattle(playerAction:AttackingType | DefensiveType): void {
        if (!this.player.isDead() && !this.monster.isDead()) {
            if (this.isPlayerAttacker) {
                if (!Object.values(AttackingType).includes(playerAction as AttackingType)) {
                    throw new Error("Player is Attacking But Action Is Not AttackingType");
                }
                const monsterAction : DefensiveType = this.monster.decideDefensiveAction()
                this.ShowMessage({ type: "System", text: `Monster เลือก action: ${monsterAction}` });
                this.processTurn(this.player, this.monster,playerAction as AttackingType,monsterAction);
            } else {
                if (!Object.values(DefensiveType).includes(playerAction as DefensiveType)) {
                    throw new Error("Player is Defensive But Action Is Not DefensiveType");
                }
                const monsterAction = this.monster.decideAttackingAction();
                this.ShowMessage({ type: "System", text: `Monster เลือก action: ${monsterAction}` });
                this.processTurn(this.monster, this.player,monsterAction,playerAction as DefensiveType);
            }
            this.isPlayerAttacker = !this.isPlayerAttacker;
        }
    }

    isPlayerTurn(): boolean {
        return this.isPlayerAttacker;
    }

    isBattleOver(): boolean {
        return this.player.isDead() || this.monster.isDead() || this.hasFled;
    }

    getMonsterStats(): stats {
        return {
            maxHp: this.monster.getMaxHp(),
            hp: this.monster.getHp(),
            atk: this.monster.getAtk(),
            def: this.monster.getDef(),
            luc: this.monster.getLuc(),
            agi: this.monster.getAgi(),
            coin: this.monster.getCoin(),
        };
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
        const damage = this.calculateDamage(damageSource, damageTarget, multiplier);
        const hpBefore = damageTarget.getHp();

        damageTarget.takeDamage(damage);

        const targetName = damageTarget === this.player ? "Player" : "Monster";
        const sourceName = damageSource === this.player ? "Player" : "Monster";
        this.ShowMessage({
            type: "System",
            text: `${sourceName} โจมตี ${targetName} เข้า ${damage} damage, HP เหลือ ${damageTarget.getHp()}/${damageTarget.getMaxHp()} (จาก ${hpBefore})`,
        });
    }

    // test
    checkEvasion(character: Character): boolean {
        const randomValue = Math.random();
        return EvadeCheck(character, randomValue);
    }
}