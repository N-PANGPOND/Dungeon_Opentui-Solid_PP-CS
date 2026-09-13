import type { item } from '../Type-Enum/type';
import { Character } from '../Character/character';

export class Item {

    public name: string;
    public description: string;
    public price: number;
    public Addeffects?:(target: Character)=> void;
    public use(target: Character): void {
        if (this.Addeffects) {
            this.Addeffects(target);
        }
    }

    constructor(name: string, description: string, price: number, Addeffects?:(target: Character)=> void) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.Addeffects = Addeffects;
    } 


}


export class Itemfactory {
    public static CreatePOTION(): Item {
    return new Item(
        "POTION",
        "Restores 50 HP",
        20,
        (target: Character) => {
            const healAmount = 50;
            target.heal(healAmount);
        }
    );
 }
    public static CreateHIGH_POTION(): Item {
    return new Item(
        "HIGH_POTION",
        "Restores 100 HP",
        50,
        (target: Character) => {
            const healAmount = 100;
            target.heal(healAmount);
        }
    );
 }
    public static CreatePOTION_ATK(): Item {
    return new Item(
        "POTION_ATK",
        "Increase ATK by 10",
        75,
        (target: Character) => {
            const attackAmount = 10;
            target.IncreaseATK(attackAmount);
        }
    );
 }
    public static CreatePOTION_DEF(): Item {
    return new Item(
        "POTION_DEF",
        "Increase DEF by 10",
        75,
        (target: Character) => {
            const defenseAmount = 10;
            target.IncreaseDEF(defenseAmount);
        }
    );

 }
    public static CreateSMOKE_BOMB(): Item {
    return new Item(
        "SMOKE_BOMB",
        "Escape from battle",
        100,
        (target: Character) => {
            // Implement escape logic here
            console.log(`${target} used SMOKE_BOMB to escape!`);
        }
    );
 }
}