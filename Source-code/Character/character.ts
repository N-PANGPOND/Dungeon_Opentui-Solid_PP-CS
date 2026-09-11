import { AttackingType,DefensiveType } from "../Type-Enum/enum";
import type { MonsterType } from "../Type-Enum/type";

export class Character {
    private maxHp: number;
    private hp: number;
    private atk: number;
    private def: number;
    private luc: number;
    private agi: number;
    private coin: number;

    constructor(maxHp: number, atk: number, def: number, luc: number, agi: number, coin: number) {
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.atk = atk;
        this.def = def;
        this.luc = luc;
        this.agi = agi;
        this.coin = coin;
    }

    takeDamage(amount: number): void {
        this.hp = Math.max(this.hp - amount);
    }
    isDead(): boolean {
        return this.hp <= 0;
    }   
    
    getMaxHp(): number {
        return this.maxHp;
    }
    getHp(): number {
        return this.hp;
    }
    getAtk(): number {
        return this.atk;
    }
    getDef(): number {
        return this.def;
    }
    getLuc(): number {
        return this.luc;
    }
    getAgi(): number {
        return this.agi;
    }
    getCoin(): number {
        return this.coin;
    }
}

class Monster extends Character {
    private MonsterType : MonsterType;

    constructor(maxHp: number, atk: number, def: number, luc: number, agi: number, coin: number, monsterType: MonsterType) {
        super(maxHp, atk, def, luc, agi, coin);
        this.MonsterType = monsterType;
    }
    coinDrop():number {
        return this.getCoin();
    }
    decideAttackingAction(): AttackingType {
        let AttackPercentage: number = 0
        let StrikePercentage: number = 0
        let RunPercentage: number = 0

        switch (this.MonsterType) {
            case 'NORMAL MONS':
                AttackPercentage = 0.6
                StrikePercentage = 0.3
                RunPercentage = 0.1
                break;
            case 'ELITE MONS':
                AttackPercentage = 0.5
                StrikePercentage = 0.4
                RunPercentage = 0.1
                break;
            case 'BOSS':
                AttackPercentage = 0.4
                StrikePercentage = 0.4
                RunPercentage = 0.2
                break;
            default:
                throw new Error("Invalid Monster Type");}
        let Sum = AttackPercentage + StrikePercentage + RunPercentage;
        let randomValue = Math.random() * Sum;
        if (randomValue < AttackPercentage) {
            return AttackingType.Attack;
        } else if (randomValue < AttackPercentage + StrikePercentage) {
            return AttackingType.Strike;
        } else {
            return AttackingType.Run;
        }
    }
    decideDefensiveAction(): DefensiveType {
        let DefendPercentage: number = 0
        let CounterPercentage: number = 0
        let RunPercentage: number = 0
        switch (this.MonsterType) {
            case 'NORMAL MONS':
                DefendPercentage = 0.5
                CounterPercentage = 0.3
                RunPercentage = 0.2
                break;
            case 'ELITE MONS':
                DefendPercentage = 0.4
                CounterPercentage = 0.4
                RunPercentage = 0.2
                break;
            case 'BOSS':
                DefendPercentage = 0.3
                CounterPercentage = 0.4
                RunPercentage = 0.3
                break;
            default:
                throw new Error("Invalid Monster Type");
        }
        let Sum = DefendPercentage + CounterPercentage + RunPercentage;
        let randomValue = Math.random() * Sum;
        if (randomValue < DefendPercentage) {
            return DefensiveType.Defend;
        } else if (randomValue < DefendPercentage + CounterPercentage) {
            return DefensiveType.Counter;
        } else {
            return DefensiveType.Run;
        }
    }
}