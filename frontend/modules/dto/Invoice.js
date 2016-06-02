import Address from './Address'
import InvoiceItem from './InvoiceItem'

export default class {

  constructor(
    number = "",
    address = new Address(),
    date = "",
    items = [ new InvoiceItem()]
  ) {
    this.number = number;
    this.address = address;
    this.date = date;
    this.items = items;
  }

  getItems() {
    return this.items;
  }

  getAddress() {
    return this.getAddress;
  }

}
