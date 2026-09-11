import { AttackingType,DefensiveType } from "../Type-Enum/enum";
import type { MonsterType,stats } from "../Type-Enum/type";

export class Character {
    private maxHp: number;
    private hp: number;
    private atk: number;
    private def: number;
    private luc: number;
    private agi: number;
    private coin: number;

    constructor(stats: stats) {
        this.maxHp = stats.maxHp;
        this.hp = stats.hp;
        this.atk = stats.atk;
        this.def = stats.def;
        this.luc = stats.luc;
        this.agi = stats.agi;
        this.coin = stats.coin;
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

class MonsterFactory {
    createMonster(distToExit: number): Monster {
        if (distToExit < 3) {
            return new Monster({ maxHp: 100, hp: 100, atk: 10, def: 5, luc: 5, agi: 5, coin: 10 }, 'BOSS');
        }else if (distToExit < 25) { 
            return new Monster({ maxHp: 100, hp: 100, atk: 10, def: 5, luc: 5, agi: 5, coin: 10 }, 'ELITE MONS');
        } else {
            return new Monster({ maxHp: 100, hp: 100, atk: 10, def: 5, luc: 5, agi: 5, coin: 10 }, 'NORMAL MONS');
        }
    }
}

class Monster extends Character {
    private MonsterType : MonsterType;

    constructor(stats: stats, monsterType: MonsterType) {
        super(stats);
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