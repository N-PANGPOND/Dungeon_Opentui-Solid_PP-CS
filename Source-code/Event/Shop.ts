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

    public buy(item : Item): Item | undefined {
        const index = this.items.indexOf(item);
        if (index === -1) {
            return undefined;
        }
        return this.items.splice(index, 1)[0];
    }

    public sell(item: Item, inventory: Inventory): number {
    const items = inventory.getItems();
    const index = items.indexOf(item);

    if (index === -1) {
        return 0;
    }

    inventory.removeItem(index);
    this.items.push(item);

    return item.getPrice();
}

    public Leave(): void {
        console.log("You have left the shop.");
    }

}