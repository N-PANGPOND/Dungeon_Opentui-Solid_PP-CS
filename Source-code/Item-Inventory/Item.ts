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
        return new Item('POTION', 'Restores 50 HP', 10,() => {
            
          effect: () => {
            const healAmount = 20;
           

          }
        });
    }
    public static CreateHIGH_POTION(): Item {
        return new Item('HIGH POTION', 'Restores 100 HP', 20,() => {
            effect: () => {
                const healAmount = 50;
                // Implement the effect of the high potion here
            }
          
        });
    }
    public static CreatePOTION_ATK(): Item {
        return new Item('POTION ATK', 'Increases attack by 10 for 5 turns', 15,() => {
            // Implement the effect of the attack potion here
            effect: () => {
                const attackIncrease = 10;
                const duration = 5; // Number of turns the effect lasts
                // Apply the attack increase to the character for the specified duration
            }
          
        });
    }
    public static CreatePOTION_DEF(): Item {
        return new Item('POTION DEF', 'Increases defense by 10 for 5 turns', 15,() => {
            // Implement the effect of the defense potion here
            effect: () => {
                const defenseIncrease = 10;
                const duration = 5; // Number of turns the effect lasts
                // Apply the defense increase to the character for the specified duration
            }
        });
    }
    public static CreateSMOKE_BOMB(): Item {
        return new Item('SMOKE BOMB', 'Escapes from combat', 30,() => {
            // Implement the effect of the smoke bomb here
            effect: () => {
                // Implement the smoke bomb effect here
            }
        });
    }

}