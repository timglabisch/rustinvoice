import React from 'react'
import Customer from './dto/Customer'
import CustomerStore from './store/CustomerStore'

export default React.createClass({

  componentDidMount: function() {
    CustomerStore.load_all();
    this.unsubscribe = CustomerStore.listen(this.onStatusChange);
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  onStatusChange: function(customers) {
    console.log(customers);
  },

  render() {
    return <div>
        Customers!
      </div>
  }
})
