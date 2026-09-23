export enum AttackingType {
    Attack="Attack",
    Strike="Strike",
    UseItem="Use Item",
    Run="Run"
};

export enum DefensiveType {
    Defend = "Defend",
    Counter = "Counter",
    UseItem = "Use Item",
    Run = "Run"
}

export enum MapObject {
    Wall = "WALL",
    Floor = "FLOOR",
    Exit = "EXIT",
}

export enum EndingType {
    NONE,      // ยังไม่ถึง exit เกมยังไม่จบ
    GOOD_END,  // ถึง exit + ช่วยเมียแล้ว
    BAD_END,   // ถึง exit + ไม่ได้ช่วยเมีย
}