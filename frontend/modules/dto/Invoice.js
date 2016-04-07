import Address from './Address'
import InvoiceItem from './InvoiceItem'

export default class {

  constructor() {
    this.address = new Address();
    this.number = null;
    this.date = null;
    this.items = [
      new InvoiceItem(1, "foobar", 5.99),
      new InvoiceItem(1, "blubb", 10.00)
    ];
  }

  getItems() {
    return this.items;
  }

  getAddress() {
    return this.getAddress;
  }

}
