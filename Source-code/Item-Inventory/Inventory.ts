import { Item } from "./Item";
import { Character } from "../Character/character";

export class Inventory {
    private items: Item[] = [];
    private maxSlots: number = 8;
    
    public addItem(item: Item): boolean {
        if (this.items.length < this.maxSlots) {
            this.items.push(item);
            return true;
        }
        return false;
    }

    public isFull(): boolean {
        return this.items.length >= this.maxSlots;
    }

    public useItem(slotindex: number, target: Character): void {
       const item = this.items[slotindex];

        if (!item) {
            return;
        }

        item.use(target);

        this.removeItem(slotindex);
    }

    public removeItem(slotindex: number): void {
        this.items.splice(slotindex, 1);
    }

    public getItems(): Item[] {
        return this.items;
    }
}
