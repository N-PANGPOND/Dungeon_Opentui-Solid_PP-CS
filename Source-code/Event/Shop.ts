import { Item, Itemfactory } from "../Item-Inventory/Item";
import { Inventory } from "../Item-Inventory/Inventory";

export class Shop {
    public items: Item[];
    constructor() {
        this.items = [
            Itemfactory.CreatePOTION(),
            Itemfactory.CreateHIGH_POTION(),
            Itemfactory.CreatePOTION_ATK(),
            Itemfactory.CreatePOTION_DEF(),
            Itemfactory.CreateSMOKE_BOMB()
        ];
    }

   public buy(itemName: string): Item | undefined {
        const item = this.items.find(
            (item) => item.item.name === itemName
        );

        if (!item) {
            return undefined;
        }

        switch (itemName) {
            case "POTION":
                return Itemfactory.CreatePOTION();

            case "HIGH_POTION":
                return Itemfactory.CreateHIGH_POTION();

            case "POTION_ATK":
                return Itemfactory.CreatePOTION_ATK();

            case "POTION_DEF":
                return Itemfactory.CreatePOTION_DEF();

            case "SMOKE_BOMB":
                return Itemfactory.CreateSMOKE_BOMB();

            default:
                return undefined;
        }
    }

    public sell(item: Item, inventory: Inventory): number {
    const items = inventory.getItems();
    const index = items.indexOf(item);

    if (index === -1) {
        return 0;
    }

    inventory.removeItem(index);
    this.items.push(item);

    return item.getPrice() * 0.8;
}

    public Leave(): void {
        console.log("You have left the shop.");
    }

}