import React from 'react'
import Customer from './dto/Customer'
import CustomerStore from './store/CustomerStore'
import Action from './action/Action'

export default React.createClass({

  getInitialState() {
     return { customer: new Customer() };
  },

  componentDidMount: function() {
    this.unsubscribe = CustomerStore.listen(this.onStatusChange);
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  onStatusChange: function() {
    console.log("yepp");
  },

  handleAddressChange(field, e) {
    this.state.customer.address[field] = e.target.value;

    Action.on();

    this.setState(this.state);
  },

  handleCreate() {
    Action.create_customer(this.state.customer)
  },

  render() {
    return <div>
            <div>
              <form>

                <div className="form-group">
                  <label>Vorname</label>
                  <input type="text" className="form-control" value={this.state.customer.address.first_name} onChange={this.handleAddressChange.bind(this, 'first_name')} />
                </div>

                <div className="form-group">
                  <label>Nachname</label>
                  <input type="text" className="form-control" value={this.state.customer.address.last_name} onChange={this.handleAddressChange.bind(this, 'last_name')} />
                </div>

                <div className="form-group">
                  <label>Firma</label>
                  <input type="text" className="form-control" value={this.state.customer.address.company_name} onChange={this.handleAddressChange.bind(this, 'company_name')} />
                </div>

                <div className="form-group">
                  <label>Straße</label>
                  <input type="text" className="form-control" value={this.state.customer.address.street} onChange={this.handleAddressChange.bind(this, 'street')}/>
                </div>

                <div className="form-group">
                  <label>Hausnummer</label>
                  <input type="text" className="form-control" value={this.state.customer.address.street_number} onChange={this.handleAddressChange.bind(this, 'street_number')} />
                </div>

                <div className="form-group">
                  <label>Plz</label>
                  <input type="text" className="form-control" value={this.state.customer.address.zip} onChange={this.handleAddressChange.bind(this, 'zip')} />
                </div>

                <div className="form-group">
                  <label>Land</label>
                  <input type="text" className="form-control" value={this.state.customer.address.country} onChange={this.handleAddressChange.bind(this, 'country')} />
                </div>

              </form>

              {(() => {
                if (this.state.customer.uuid) {
                  return <input type="submit" value="Speichern" onClick={this.handleSave} />
                } else {
                  return <input type="submit" value="Anlegen" onClick={this.handleCreate} />
                }
              })()}

            </div>
          </div>
  }
})
