import { Inventory } from "../Item-Inventory/Inventory";
import { Item } from "../Item-Inventory/Item";
import { AttackingType,DefensiveType } from "../Type-Enum/enum";
import type { MonsterType,stats, Weights } from "../Type-Enum/type";
import { getRandomAction } from "../pure-function";

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
    heal(amount: number): void {
        if (amount <= 0 || this.isDead()) {
            throw new Error("Invalid heal amount or character is dead");
        }
        this.hp = Math.min(this.maxHp, this.hp + amount);
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
        const weights : Weights = {
            'NORMAL MONS': { Attack: 0.65, Strike: 0.25, Run: 0.10 },
            'ELITE MONS': { Attack: 0.6, Strike: 0.37, Run: 0.03 },
            'BOSS': { Attack: 0.5, Strike: 0.5, Run: 0 }
        };

        const { Attack: AttackPercentage, Strike: StrikePercentage, Run: RunPercentage } = weights[this.MonsterType];
        let Sumweights = AttackPercentage + StrikePercentage + RunPercentage;
        let randomValue = Math.random() * Sumweights;
        return getRandomAction(this.MonsterType, randomValue, weights) as AttackingType;
    }
    decideDefensiveAction(): DefensiveType {
        const weights : Weights = {
            'NORMAL MONS': { Defend: 0.5, Counter: 0.3, Run: 0.2 },
            'ELITE MONS': { Defend: 0.4, Counter: 0.4, Run: 0.2 },
            'BOSS': { Defend: 0.3, Counter: 0.4, Run: 0.3 }
        };

        const { Defend: DefendPercentage, Counter: CounterPercentage, Run: RunPercentage } = weights[this.MonsterType];
        let Sumweights = DefendPercentage + CounterPercentage + RunPercentage;
        let randomValue = Math.random() * Sumweights;
        return getRandomAction(this.MonsterType, randomValue, weights) as DefensiveType;
    }
}

class Player extends Character {
    public Position: { x: number; y: number };

    private inventory: Inventory = new Inventory();

    constructor(
        stats: any,
        position: { x: number; y: number }
    ) {
        super(stats);
        this.Position = position;
    }

    public adjustCoin(amount: number): void {
        const newCoin = this.getCoin() + amount;
        this.setCoin(newCoin);
    }

    private setCoin(amount: number): void {
        (this as any).coin = amount;
    }

    public getInventory(): Inventory {
        return this.inventory;
    }

    public override getCoin(): number {
        return (this as any).coin;
    }

    public addItem(item: Item): void {
        this.inventory.addItem(item);
    }

   public removeItem(item: Item): void {
    const index = this.inventory.getItems().indexOf(item);

    if (index !== -1) {
        this.inventory.removeItem(index);
    }
}

    public getRunnance(): number {
        // ยังต้องกำหนดว่าค่า Runnance มาจากอะไร
        return 0;
    }

    public getPosition(): { x: number; y: number } {
        return this.Position;
    }
}
