export type gameScreen = "DUNGEON" | "EXPLORE" | "COMBAT" | "EVENT" | "Merchant " | "INVENTORY" | "VICTORY" | "GAMEOVER";

export type MonsterType = 'NORMAL MONS' | 'ELITE MONS' | 'BOSS'
export type Direction = "up" | "down" | "left" | "right" | "w" | "a" | "s" | "d";

export type position = {
  x: number;
  y: number;
};

export type logType = {
    type : "System",
    text : string 
}

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
