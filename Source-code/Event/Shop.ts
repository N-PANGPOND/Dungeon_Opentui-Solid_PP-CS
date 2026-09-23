import { Item, Itemfactory } from "../Item-Inventory/Item";
import { Inventory } from "../Item-Inventory/Inventory";
import type { Player } from "../Character/character";

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

    public getItems(): Item[] {
        return this.items;
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

    public buyItem(itemIndex: number, player: Player): { success: boolean; message: string; item?: Item } {
        if (itemIndex < 0 || itemIndex >= this.items.length) {
            return { success: false, message: "Invalid item selection!" };
        }

        const templateItem = this.items[itemIndex];
        if (!templateItem) {
            return { success: false, message: "Item not found!" };
        }

        const price = templateItem.getPrice();
        if (player.getCoin() < price) {
            return { success: false, message: `Not enough coins! (${player.getCoin()}/${price} Coins)` };
        }

        if (player.getInventory().isFull()) {
            return { success: false, message: "Inventory is full! (Max 8 slots)" };
        }

        const boughtItem = this.buy(templateItem.getName()) ?? templateItem;
        player.adjustCoin(-price);
        player.addItem(boughtItem);

        return {
            success: true,
            message: `Purchased ${boughtItem.getName()} for ${price} Coins!`,
            item: boughtItem
        };
    }

    public sell(item: Item, inventory: Inventory): number {
        const items = inventory.getItems();
        const index = items.indexOf(item);

        if (index === -1) {
            return 0;
        }

        inventory.removeItem(index);
        this.items.push(item);

        return Math.floor(item.getPrice() * 0.8);
    }

    public sellItem(slotIndex: number, player: Player): { success: boolean; message: string; earned: number } {
        const inventory = player.getInventory();
        const items = inventory.getItems();

        if (slotIndex < 0 || slotIndex >= items.length) {
            return { success: false, message: "Invalid item slot to sell!", earned: 0 };
        }

        const itemToSell = items[slotIndex];
        if (!itemToSell) {
            return { success: false, message: "No item found in this slot!", earned: 0 };
        }

        const earned = Math.floor(itemToSell.getPrice() * 0.8);
        inventory.removeItem(slotIndex);
        player.adjustCoin(earned);

        return {
            success: true,
            message: `Sold ${itemToSell.getName()} for ${earned} Coins (80% value)!`,
            earned
        };
    }

    public Leave(): void {
        console.log("You have left the shop.");
    }
}