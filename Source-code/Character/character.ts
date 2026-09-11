
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
}