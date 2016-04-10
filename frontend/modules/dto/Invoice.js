import Address from './Address'
import InvoiceItem from './InvoiceItem'

export default class {

  constructor() {
    this.address = new Address();
    this.number = null;
    this.date = null;
    this.items = [
      new InvoiceItem(),
      new InvoiceItem(),
      new InvoiceItem()
    ];
  }

  getItems() {
    return this.items;
  }

  getAddress() {
    return this.getAddress;
  }

}
