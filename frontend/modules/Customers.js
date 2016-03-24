import React from 'react'
import Customer from './dto/Customer'

export default React.createClass({
  render() {
    var customer = new Customer();
    console.log(customer);


    return <div>Customers!</div>
  }
})
