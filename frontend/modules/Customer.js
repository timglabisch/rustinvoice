import React from 'react'
import Navigation from './layout/Navigation'
import Customer from './dto/Customer'

import Action from './action/Action'

export default React.createClass({

  getInitialState() {
     return { customer: new Customer() };
  },

  handleAddressChange: function(field, e) {
    this.state.customer.address[field] = e.target.value;

    Action.on();

    this.setState(this.state);
  },

  render() {
    return <div>
            <Navigation></Navigation>
            <div>
              Land <input type="text" value={this.state.customer.address.country} onChange={this.handleAddressChange.bind(this, 'country')} />

              Straße <input type="text" value={this.state.customer.address.street} onChange={this.handleAddressChange.bind(this, 'street')}/>

              Hausnummer <input type="text" value={this.state.customer.address.street_number} onChange={this.handleAddressChange.bind(this, 'street_number')} />

              Plz <input type="text" value={this.state.customer.address.zip} onChange={this.handleAddressChange.bind(this, 'zip')} />

              Vorname <input type="text" value={this.state.customer.address.first_name} onChange={this.handleAddressChange.bind(this, 'first_name')} />

              Nachname <input type="text" value={this.state.customer.address.last_name} onChange={this.handleAddressChange.bind(this, 'last_name')} />

              Firma <input type="text" value={this.state.customer.address.company_name} onChange={this.handleAddressChange.bind(this, 'company_name')} />

            </div>
          </div>
  }
})
