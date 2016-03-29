import React from 'react'
import Customer from './dto/Customer'
import CustomerStore from './store/CustomerStore'
import Action from './action/Action'

export default React.createClass({

  getInitialState() {
     return {
       txid : Math.random(),
       mounted_since: new Date,
       customer_uuid : this.props.params.uuid ? this.props.params.uuid : null,
       customer: this.props.params.uuid ? CustomerStore.getCustomer(this.props.params.uuid) : new Customer()
     };
  },

  componentWillReceiveProps(nextProps) {
   this.setState({
     customer_uuid : nextProps.params.uuid ? nextProps.params.uuid : null,
     customer: nextProps.params.uuid ? CustomerStore.getCustomer(nextProps.params.uuid) : new Customer()
   })
  },

  componentDidMount: function() {

    this.unsubscribe = CustomerStore.listen(this.onStatusChange);

    if (this.state.customer_uuid) {
      Action.load_customer(this.state.customer_uuid);
    }
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  onStatusChange: function() {

    if (this.state.customer_uuid) {
      this.setState({
        customer: CustomerStore.getCustomer(this.state.customer_uuid)
      })
    }

    this.setState({
      loading: CustomerStore.getLog(this.state.customer_uuid, this.state.mounted_since, 'loading'),
      loading_success: CustomerStore.getLog(this.state.customer_uuid, this.state.mounted_since, 'loading_success'),
      loading_failed: CustomerStore.getLog(this.state.customer_uuid, this.state.mounted_since, 'loading_failed'),
      saving: CustomerStore.getLog(this.state.txid, this.state.mounted_since, 'saving'),
      saving_success: CustomerStore.getLog(this.state.txid, this.state.mounted_since, 'saving_success'),
      saving_failed: CustomerStore.getLog(this.state.txid, this.state.mounted_since, 'saving_failed'),
      updating: CustomerStore.getLog(this.state.customer_uuid, this.state.mounted_since, 'updating'),
      updating_success: CustomerStore.getLog(this.state.customer_uuid, this.state.mounted_since, 'updating_success'),
      updating_failed: CustomerStore.getLog(this.state.customer_uuid, this.state.mounted_since, 'updating_failed')
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

  handleUpdate() {
    Action.update_customer(
      this.state.customer
    )
  },

  render() {

    if (this.state.customer_uuid && !this.state.customer && !this.state.saving_failed) {
      return <div>Kunde wird geladen, einen Moment bitte</div>
    }

    return <div>

            { this.state.saving && <div className="alert alert-info" role="alert">Kunde wurde angelegt</div> }
            { this.state.saving_success && <div className="alert alert-success" role="alert">Kunde wurde angelegt</div> }
            { this.state.saving_failed && <div className="alert alert-danger" role="alert">Beim anlegen des Kunden ist ein Fehler aufgetreten.</div> }

            { this.state.loading && <div className="alert alert-info" role="alert">Kunde wird geladen</div> }
            { this.state.loading_success && false && <div className="alert alert-success" role="alert">Kunde wurde geladen</div> }
            { this.state.loading_failed && <div className="alert alert-danger" role="alert">Beim Laden des Kunden ist ein Fehler aufgetreten.</div> }

            { this.state.updating && <div className="alert alert-info" role="alert">Kunde wird aktualisiert</div> }
            { this.state.updating_success && <div className="alert alert-success" role="alert">Kunde wurde aktualisiert</div> }
            { this.state.updating_failed && <div className="alert alert-danger" role="alert">Beim aktualisieren des Kunden ist ein Fehler aufgetreten.</div> }


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
                if (this.state.customer_uuid) {
                  return <input type="submit" value="Speichern" onClick={this.handleUpdate} />
                } else {
                  return <input type="submit" value="Anlegen" onClick={this.handleCreate} />
                }
              })()}

            </div>
          </div>
  }
})
