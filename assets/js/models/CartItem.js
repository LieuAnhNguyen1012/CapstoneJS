export class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }
}