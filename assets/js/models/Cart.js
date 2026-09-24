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

}