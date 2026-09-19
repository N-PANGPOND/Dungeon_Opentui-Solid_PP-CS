import type { MonsterType, Weights } from "../Type-Enum/type";
import { AttackingType, DefensiveType } from "../Type-Enum/enum";
import { Character } from "../Character/character";

export function getRandomAction(monsterType: MonsterType, randomValue: number, weights: Weights): AttackingType | DefensiveType {
    const monsterWeights = weights[monsterType];
    let sumWeight = 0;
    for (const [action, weight] of Object.entries(monsterWeights)) {
        sumWeight += weight;
        if (randomValue < sumWeight) {
            return AttackingType[action as keyof typeof AttackingType] || DefensiveType[action as keyof typeof DefensiveType];
        }
    }
    throw new Error("Invalid random value or monster type");
}

export function EvadeCheck(character: Character, randomValue: number): boolean {
    const evadeChance = character.getAgi();
    return randomValue < evadeChance;
}

export function calculateDamage(damageSource: Character, damageTarget: Character, multiplier: number, random: number): number {
    if (multiplier <= 0 || random <= 0) {
        throw new Error("multiplier or random Shouldn't less than 0");
    }
    const critical = (damageSource.getLuc() * 0.01) > random ? 2 : 1;
    return (damageSource.getAtk() - damageTarget.getDef()) * multiplier * critical;
}