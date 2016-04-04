import React from 'react'
import Invoice from './dto/Invoice'
import InvoiceStore from './store/InvoiceStore'
import Action from './action/Action'

export default React.createClass({

  getInitialState() {
     return {
       txid : Math.random(),
       mounted_since: new Date,
       invoice_uuid : this.props.params.uuid ? this.props.params.uuid : null,
       invoice: this.props.params.uuid ? InvoiceStore.getInvoice(this.props.params.uuid) : new Invoice()
     };
  },

  componentWillReceiveProps(nextProps) {
   this.setState({
     txid : Math.random(),
     mounted_since: new Date,
     invoice_uuid : nextProps.params.uuid ? nextProps.params.uuid : null,
     invoice: nextProps.params.uuid ? InvoiceStore.getInvoice(nextProps.params.uuid) : new Invoice()
   })
  },

  componentDidMount: function() {

    this.unsubscribe = InvoiceStore.listen(this.onStatusChange);

    if (this.state.invoice_uuid) {
      Action.load_invoice(this.state.invoice_uuid);
    }
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  onStatusChange: function() {

    if (this.state.invoice_uuid) {
      this.setState({
        invoice: InvoiceStore.getInvoice(this.state.invoice_uuid)
      })
    }

    this.setState({
      loading: InvoiceStore.getLog(this.state.invoice_uuid, this.state.mounted_since, 'loading'),
      loading_success: InvoiceStore.getLog(this.state.invoice_uuid, this.state.mounted_since, 'loading_success'),
      loading_failed: InvoiceStore.getLog(this.state.invoice_uuid, this.state.mounted_since, 'loading_failed'),
      saving: InvoiceStore.getLog(this.state.txid, this.state.mounted_since, 'saving'),
      saving_success: InvoiceStore.getLog(this.state.txid, this.state.mounted_since, 'saving_success'),
      saving_failed: InvoiceStore.getLog(this.state.txid, this.state.mounted_since, 'saving_failed'),
      updating: InvoiceStore.getLog(this.state.invoice_uuid, this.state.mounted_since, 'updating'),
      updating_success: InvoiceStore.getLog(this.state.invoice_uuid, this.state.mounted_since, 'updating_success'),
      updating_failed: InvoiceStore.getLog(this.state.invoice_uuid, this.state.mounted_since, 'updating_failed')
    })
  },

  handleAddressChange(field, e) {
    this.state.invoice.address[field] = e.target.value;
    this.setState(this.state);
  },

  handleCreate() {
    Action.create_invoice(
      this.state.txid,
      this.state.invoice
    )
  },

  handleUpdate() {
    Action.update_invoice(
      this.state.invoice
    )
  },

  render() {

    if (this.state.invoice_uuid && !this.state.invoice && !this.state.saving_failed) {
      return <div>Rechnung wird geladen, einen Moment bitte</div>
    }

    return <div>

            { this.state.saving && <div className="alert alert-info" role="alert">Rechnung wurde angelegt</div> }
            { this.state.saving_success && <div className="alert alert-success" role="alert">Rechnung wurde angelegt</div> }
            { this.state.saving_failed && <div className="alert alert-danger" role="alert">Beim anlegen der Rechnung ist ein Fehler aufgetreten.</div> }

            { this.state.loading && <div className="alert alert-info" role="alert">Rechnung wird geladen</div> }
            { this.state.loading_success && false && <div className="alert alert-success" role="alert">Rechnung wurde geladen</div> }
            { this.state.loading_failed && <div className="alert alert-danger" role="alert">Beim Laden der Rechnung ist ein Fehler aufgetreten.</div> }

            { this.state.updating && <div className="alert alert-info" role="alert">Rechnung wird aktualisiert</div> }
            { this.state.updating_success && <div className="alert alert-success" role="alert">Rechnung wurde aktualisiert</div> }
            { this.state.updating_failed && <div className="alert alert-danger" role="alert">Beim aktualisieren der Rechnung ist ein Fehler aufgetreten.</div> }


            <div>
              <form>

                <div className="form-group">
                  <label>Vorname</label>
                  <input type="text" className="form-control" value={this.state.invoice.address.first_name} onChange={this.handleAddressChange.bind(this, 'first_name')} />
                </div>

                <div className="form-group">
                  <label>Nachname</label>
                  <input type="text" className="form-control" value={this.state.invoice.address.last_name} onChange={this.handleAddressChange.bind(this, 'last_name')} />
                </div>

                <div className="form-group">
                  <label>Firma</label>
                  <input type="text" className="form-control" value={this.state.invoice.address.company_name} onChange={this.handleAddressChange.bind(this, 'company_name')} />
                </div>

                <div className="form-group">
                  <label>Straße</label>
                  <input type="text" className="form-control" value={this.state.invoice.address.street} onChange={this.handleAddressChange.bind(this, 'street')}/>
                </div>

                <div className="form-group">
                  <label>Hausnummer</label>
                  <input type="text" className="form-control" value={this.state.invoice.address.street_number} onChange={this.handleAddressChange.bind(this, 'street_number')} />
                </div>

                <div className="form-group">
                  <label>Plz</label>
                  <input type="text" className="form-control" value={this.state.invoice.address.zip} onChange={this.handleAddressChange.bind(this, 'zip')} />
                </div>

                <div className="form-group">
                  <label>Land</label>
                  <input type="text" className="form-control" value={this.state.invoice.address.country} onChange={this.handleAddressChange.bind(this, 'country')} />
                </div>

                { this.state.invoice.getItems().map(function(item, i) {
                    return <div key={i} draggable="true">
                      <hr/>
                      <div className="form-group form-inline">
                        <label style={{marginRight:"15px"}}>Anzahl</label>
                        <input style={{width:"80px"}} placeholder="1" type="text" className="form-control" value={item.getQuantity()} />
                        <label style={{marginRight:"15px", marginLeft: "25px"}}>Kosten</label>
                        <input placeholder="Kosten" type="text" className="form-control" value={item.getCost()} />
                      </div>
                      <div className="form-group">
                        <textarea rows="3" placeholder="Text" className="form-control" value={item.getText()} />
                      </div>
                    </div>
                }.bind(this))}

              </form>

              {(() => {
                if (this.state.invoice_uuid) {
                  return <input type="submit" value="Speichern" onClick={this.handleUpdate} />
                } else {
                  return <input type="submit" value="Anlegen" onClick={this.handleCreate} />
                }
              })()}

            </div>
          </div>
  }
})
