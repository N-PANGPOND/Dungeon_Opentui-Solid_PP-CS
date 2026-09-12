import type { MonsterType, Weights } from "./Type-Enum/type";
import { AttackingType,DefensiveType } from "./Type-Enum/enum";
    
export function getRandomAction(monsterType: MonsterType, randomValue: number,weights: Weights): AttackingType | DefensiveType {
    const monsterWeights = weights[monsterType];
    let Sumweight = 0;
    for (let i = 0; i < Object.keys(monsterWeights).length; i++) {
        let action = Object.keys(monsterWeights)[i];
        let weight = monsterWeights[action as keyof typeof monsterWeights];
        Sumweight += weight;
        if (randomValue < Sumweight) {
            return AttackingType[action as keyof typeof AttackingType] || DefensiveType[action as keyof typeof DefensiveType];
        }
    }
    throw new Error("Invalid random value or monster type");
}

