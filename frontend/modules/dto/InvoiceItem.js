import Address from './Address'

export default class {

  constructor(quantity, text, cost) {
    this.quantity = quantity;
    this.text = text;
    this.cost = cost;
    this.key = Math.random();
  }

  getQuantity() {
    return this.quantity;
  }

  getText() {
    return this.text;
  }

  getCost() {
    return this.cost;
  }

}
