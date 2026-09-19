import { Player } from "../Character/character";
import { Item , Itemfactory } from "../Item-Inventory/Item";
import { Shop } from "../Event/Shop";

export class Event {

    public Trap(Player: Player): number {
        const damage = Math.floor(Math.random() * 20) + 1;
        Player.takeDamage(damage);
        return damage;
    }

    public Treasure(Player: Player): number {
        const coin = Math.floor(Math.random() * 100) + 1;
        Player.adjustCoin(coin);
        return coin;
    }

    public Potion(): Item {
        const potions = [
        Itemfactory.CreatePOTION(),
        Itemfactory.CreateHIGH_POTION(),
        Itemfactory.CreatePOTION_ATK(),
        Itemfactory.CreatePOTION_DEF()
    ];

    const index = Math.floor(Math.random() * potions.length);

    return potions[index]!;
    }

    public Shop(): Shop {
        return new Shop();
    }

}