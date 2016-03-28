import React from 'react'
import Customer from './dto/Customer'
import CustomersStore from './store/CustomersStore'
import Action from './action/Action'

export default React.createClass({

  componentDidMount: function() {
    this.unsubscribe = CustomersStore.listen(this.onStatusChange);
    Action.load_customers();
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  getInitialState() {
     return {
       loading: CustomersStore.isLoading(),
       customers: CustomersStore.getCustomers()
     };
  },

  onStatusChange: function() {
    console.log("got?");
    this.setState({
      loading: CustomersStore.isLoading(),
      customers: CustomersStore.getCustomers()
    });
  },

  onDelete(customer) {
    if (!confirm("Kunden #" + customer.uuid +  " " + customer.address.first_name + " " + customer.address.last_name + " wirklich löschen?")) {
      return;
    }
    Action.delete_customer(customer);
  },

  render() {
    return <div>
        { this.loading && <div className="alert alert-info" role="alert">Kunden werden momenten aktualisiert</div> }

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
