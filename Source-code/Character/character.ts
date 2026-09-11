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
                return AttackingType.Attack;
            case 'ELITE MONS':
                return AttackingType.Strike;
            case 'BOSS':
                return AttackingType.UseItem;
            default:
                return AttackingType.Attack;
        }
    }
}