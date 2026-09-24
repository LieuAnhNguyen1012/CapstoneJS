import { CartItem } from "./CartItem.js";

export class Cart {
    constructor() {
        this.items = [];
    }

    findIndexById(id) {
        return this.items.findIndex(
            (item) => String(item.product.id) === String(id)
        );
    }

    addProduct(product) {
        const index = this.findIndexById(product.id);

        if (index === -1) {
            this.items.push(new CartItem(product));
        } else {
            this.items[index].quantity += 1;
        }
    }

    changeQuantity(id, change) {
        const index = this.findIndexById(id);
        if (index === -1) return;

        const nextQuantity = this.items[index].quantity + change;
        if (nextQuantity < 1) return;

        this.items[index].quantity = nextQuantity;
    }

    removeProduct(id) {
        const index = this.findIndexById(id);
        if (index === -1) return;

        this.items.splice(index, 1);
    }

    clear() {
        this.items = [];
    }

}