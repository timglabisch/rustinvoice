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

  getInitialState() {
     return { customers: [] };
  },

  onStatusChange: function(customers) {
    this.setState(customers);
  },

  onDelete(customer) {
    if (!confirm("Kunden #" + customer.uuid +  " " + customer.address.first_name + " " + customer.address.last_name + " wirklich löschen?")) {
      return;
    }

    CustomerStore.delete_customer(customer);
  },

  render() {
    return <div>
        { this.state.customers.map(function(customer) {
            return <div style={{position: 'relative'}} key={customer.uuid}>
              <button onClick={this.onDelete.bind(this, customer)} style={{position: 'absolute', right: 0}} type="button" className="btn btn-danger">
                x
              </button>
              <div>
                vorname: { customer.address.first_name }
              </div>
              <div>
                nachname: { customer.address.last_name }
              </div>
              <hr/>
            </div>
        }.bind(this))}
      </div>
  }
})
