import type { item } from '../Type-Enum/type';
import { Character } from '../Character/character';

export class Item {

    public item: item;
    public Addeffects?:(target: Character)=> void;
    public use(target: Character): void {
        if (this.Addeffects) {
            this.Addeffects(target);
        }
    }

    constructor(item: item, Addeffects?:(target: Character)=> void) {
        this.item = item;
        this.Addeffects = Addeffects;
    } 
}


export class Itemfactory {
    public static CreatePOTION(): Item {
    return new Item(
        {name: "POTION", description: "Restores 25 HP", price: 20},
        (target: Character) => {
            const healAmount = 25;
            target.heal(healAmount);
        }
    );
 }
    public static CreateHIGH_POTION(): Item {
    return new Item(
        {name: "HIGH_POTION", description: "Restores 50 HP", price: 50},
        (target: Character) => {
            const healAmount = 50;
            target.heal(healAmount);
        }
    );
 }
    public static CreatePOTION_ATK(): Item {
    return new Item(
        {name: "POTION_ATK", description: "Increase ATK by 5", price: 75},
        (target: Character) => {
            const attackAmount = 5;
            target.IncreaseATK(attackAmount);
        }
    );
 }
    public static CreatePOTION_DEF(): Item {
    return new Item(
        {name: "POTION_DEF", description: "Increase DEF by 5", price: 70},
        (target: Character) => {
            const defenseAmount = 5;
            target.IncreaseDEF(defenseAmount);
        }
    );
 }

    public static CreateSMOKE_BOMB(): Item {
    return new Item(
        {name: "SMOKE_BOMB", description: "Escape from battle", price: 100},
        (target: Character) => {
            // Implement escape logic here
            console.log(`${target} used SMOKE_BOMB to escape!`);
        }
    );
 }
}
