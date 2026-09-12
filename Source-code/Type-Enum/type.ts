export type gameScreen = "EXPLORE" | "COMBAT" | "SHOP" | "INVENTORY" | "VICTORY" | "GAMEOVER";

export type MonsterType = 'NORMAL MONS' | 'ELITE MONS' | 'BOSS'

export type Position = {
  x: number;
  y: number;
};

export type Weights = {
    [key in MonsterType]: {
        Attack: number;
        Strike: number;
        Run: number;
    } 
} | { [key in MonsterType]: {
        Defend: number;
        Counter: number;
        Run: number;
    } }


export type stats = {
    maxHp: number;
    hp: number;
    atk: number;
    def: number;
    luc: number;
    agi: number;
    coin: number;
};

export type item = {
    name : string
    description: string; 
    price: number;
}
