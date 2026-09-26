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
    public getPrice(): number {
        return this.item.price;
    }
    public getName(): string {
        return this.item.name;
    }
    public getDesciption(): string {
        return this.item.description;
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
        {name: "POTION_ATK", description: "Increase ATK by 3", price: 90},
        (target: Character) => {
            const attackAmount = 3;
            target.IncreaseATK(attackAmount);
        }
    );
 }
    public static CreatePOTION_DEF(): Item {
    return new Item(
        {name: "POTION_DEF", description: "Increase DEF by 2", price: 100},
        (target: Character) => {
            const defenseAmount = 2;
            target.IncreaseDEF(defenseAmount);
        }
    );
 }

    public static CreateSMOKE_BOMB(): Item {
    return new Item(
        { name: "SMOKE_BOMB", description: "80% chance to escape from battle", price: 100 }
        // ไม่ต้องใส่ Addeffects — effect จริงถูกจัดการที่ CombatSystem.usePlayerItem() แทน
        );
    }
}
