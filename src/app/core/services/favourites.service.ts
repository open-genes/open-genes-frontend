export class CartService {
  items = [];

  addToCart(product) {
    this.items.push(product);
  }

  removeFromCart(product) {
    const index = this.items.indexOf(product);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  isInCart(product) {
    return this.items.indexOf(product) > -1;
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }
}
