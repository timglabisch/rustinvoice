import React from 'react'
import Customer from './dto/Customer'
import CustomerStore from './store/CustomerStore'
import Action from './action/Action'

export default React.createClass({

  getInitialState() {
     return {
       txid : Math.random(),
       customer: new Customer(),
       is_saving: false,
       has_error: false,
       is_created: false
     };
  },

  componentDidMount: function() {
    this.unsubscribe = CustomerStore.listen(this.onStatusChange);
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  onStatusChange: function() {
    var state = CustomerStore.getCustomerState(this.state.txid);

    this.setState({
      is_saving: state.is_saving,
      has_error: state.has_error,
      is_created: state.is_created
    })
  },

  handleAddressChange(field, e) {
    this.state.customer.address[field] = e.target.value;
    this.setState(this.state);
  },

  handleCreate() {
    Action.create_customer(
      this.state.txid,
      this.state.customer
    )
  },

  render() {
    return <div>

            { this.state.is_created && <div className="alert alert-success" role="alert">Kunde wurde gespeichert</div> }
            { this.state.has_error && <div className="alert alert-danger" role="alert">Es ist leider ein Fehler aufgetreten.</div> }
            { this.state.is_saving && <div className="alert alert-info" role="alert">Kunde wird gespeichert</div> }

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
