import React from 'react'
import Customer from './dto/Customer'
import CustomersStore from './store/CustomersStore'
import CustomerStore from './store/CustomerStore'
import Action from './action/Action'
import { Link } from 'react-router'

export default React.createClass({

  componentDidMount: function() {
    this.unsubscribeCustomers = CustomersStore.listen(this.onStatusChange);
    this.unsubscribeCustomer = CustomerStore.listen(this.onStatusChange);
    Action.require_customers();
  },

  componentWillUnmount: function() {
    this.unsubscribeCustomers();
    this.unsubscribeCustomer();
  },

  getInitialState() {
     return {
       mounted_since: new Date,
       loading: CustomersStore.isLoading(),
       customers: CustomersStore.getCustomers()
     };
  },

  onStatusChange: function() {
    this.setState({
      deleting_failed: !!CustomerStore.getLogs(this.state.mounted_since, 'deleting_failed').length,
      loading: CustomersStore.isLoading(),
      customers: CustomersStore.getCustomers()
    });
  },

  onDelete(customer) {
    if (!confirm("Kunden #" + customer.uuid +  " " + customer.address.first_name + " " + customer.address.last_name + " wirklich löschen?")) {
      return;
    }

    this.setState(this.state);
    Action.delete_customer(customer);
  },

  render() {
    return <div>
        { this.state.loading && <div className="alert alert-info" role="alert">Kunden werden momenten aktualisiert</div> }
        { this.state.deleting_failed && <div className="alert alert-danger" role="alert">Beim Löschen ist ein Fehler aufgetreten</div> }

        { this.state.customers.map(function(customer) {
            return <div style={{position: 'relative'}} key={customer.uuid}>
              <button onClick={this.onDelete.bind(this, customer)} style={{position: 'absolute', right: 0}} type="button" className="btn btn-danger">
                x
              </button>
              <Link to={'/customer/' + customer.uuid}>
                <div>
                  vorname: { customer.address.first_name }
                </div>
                <div>
                  nachname: { customer.address.last_name }
                </div>
              </Link>
              <hr/>
            </div>
        }.bind(this))}
      </div>
  }
})
