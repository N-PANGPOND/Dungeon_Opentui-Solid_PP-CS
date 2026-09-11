export type gameScreen = "EXPLORE" | "COMBAT" | "SHOP" | "INVENTORY" | "VICTORY" | "GAMEOVER";

export type MonsterType = 'NORMAL MONS' | 'ELITE MONS' | 'BOSS'

export type Position = {
  x: number;
  y: number;
};

export type item = {
    name : string
    description: string; 
    price: number;
}
