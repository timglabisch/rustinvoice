import React from 'react'
import Invoice from './dto/Invoice'
import InvoiceItem from './dto/InvoiceItem'
import InvoiceStore from './store/InvoiceStore'
import Action from './action/Action'
import Autocomplete from './Autocomplete'
import PInput from './layout/PInput'

var placeholder = document.createElement("div");
placeholder.innerHTML = "Hierher verschieben.";
placeholder.style = "brackgroundColor: yellow; font-size: 25px; position:absolute; display:none";
placeholder.className = "placeholder";

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
     invoice: nextProps.params.uuid ? InvoiceStore.getInvoice(nextProps.params.uuid) : new Invoice(),
     completion: null
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

  handleChange() {

  },

  ensureAtleastOneItem() {
    if (!this.state.invoice.items.length || this.state.invoice.items[this.state.invoice.items.length - 1].getText()) {
      this.state.invoice.items.push(new InvoiceItem());
    }

    this.setState(this.state);
  },

  handleItemChange(field, index, e) {

    if (field == 'cost' || field == 'quantity') {
      e.target.value = Number(e.target.value);
    }

    this.state.invoice.items[index][field] = e.target.value;

    if (this.state.invoice.items.length == index + 1) {
      this.state.invoice.items.push(new InvoiceItem());
    }

    this.setState(this.state);
    this.ensureAtleastOneItem();
  },

  handleDeleteItem(index, e) {
    this.state.invoice.items.splice(index, 1);
    this.setState(this.state);
    this.ensureAtleastOneItem();
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

  onItemDragStart(e) {

    this.over = null;
    this.nodePlacement = null;

    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/html", e.currentTarget);
  },

  onItemDragEnd(e) {

    if (!this.over || !this.nodePlacement) {
      return;
    }

    this.dragged.style.display = "block";
    this.dragged.parentNode.removeChild(placeholder);

    // Update state
    var from = Number(e.target.dataset.id);
    var to = Number(this.over.dataset.id);
    if(from < to) to--;
    if(this.nodePlacement == "after") to++;
    this.state.invoice.items.splice(to, 0, this.state.invoice.items.splice(from, 1)[0]);
    this.setState(this.state);

    $(e.target).parent('.items').find('.item').css('opacity', 1);
  },

  onItemDragOver(e) {
    e.preventDefault();

    if(e.target.className != "item") return;

    this.dragged.style.opacity = "0.5"
    this.over = e.target;

    var relY = e.pageY - $(this.over).offset().top;
    var height = this.over.offsetHeight / 4;

    var parent = e.target.parentNode;

    if (relY >= height) {
      this.nodePlacement = "after";
      parent.insertBefore(placeholder, e.target);
    } else {
      this.nodePlacement = "before";
      parent.insertBefore(placeholder, e.target.nextElementSibling);
    }
  },

  onHoverAutocomplete(hover, completion) {
    this.setState({completion: hover ? completion : null});
  },

  onSelectAutocomplete(completion) {
    this.state.invoice.address = completion.address;
    this.state.completion = null;
    this.setState(this.state);
  },

  getAddressCompletion(field) {
    if (!this.state.completion) {
      return null;
    }

    return this.state.completion.address[field];
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

                <h3>Rechnung / Angebot</h3>

                <div className="form-group">
                  <label>Type</label>
                  <select className="form-control">
                    <option>Angebot</option>
                    <option>Rechnung</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Nummer</label>
                  <input type="text" className="form-control" value={this.state.invoice.number} onChange={this.handleChange.bind(this, 'number')} />
                </div>

                <div className="form-group">
                  <label>Datum</label>
                  <input type="date" className="form-control" value={this.state.invoice.date} onChange={this.handleChange.bind(this, 'date')} />
                </div>

                <div style={{position: 'absolute', marginLeft: 200, marginTop:8}}>
                  <Autocomplete
                    onSelect={this.onSelectAutocomplete}
                    onHover={this.onHoverAutocomplete}
                  />
                </div>
                <h3>Kundendaten</h3>


                <div className="form-group">
                  <label>Vorname</label>
                  <PInput
                    value={this.state.invoice.address.first_name}
                    onChange={this.handleAddressChange.bind(this, 'first_name')}
                    replaceText={this.getAddressCompletion('first_name')}
                  />
                </div>

                <div className="form-group">
                  <label>Nachname</label>
                  <PInput
                    value={this.state.invoice.address.last_name}
                    onChange={this.handleAddressChange.bind(this, 'last_name')}
                    replaceText={this.getAddressCompletion('last_name')}
                  />
                </div>

                <div className="form-group">
                  <label>Firma</label>
                  <PInput
                    value={this.state.invoice.address.company_name}
                    onChange={this.handleAddressChange.bind(this, 'company_name')}
                    replaceText={this.getAddressCompletion('company_name')}
                  />
                </div>

                <div className="form-group">
                  <label>Straße</label>
                  <PInput
                    value={this.state.invoice.address.street}
                    onChange={this.handleAddressChange.bind(this, 'street')}
                    replaceText={this.getAddressCompletion('street')}
                  />
                </div>

                <div className="form-group">
                  <label>Hausnummer</label>
                  <PInput
                    value={this.state.invoice.address.street_number}
                    onChange={this.handleAddressChange.bind(this, 'street_number')}
                    replaceText={this.getAddressCompletion('street_number')}
                  />
                </div>

                <div className="form-group">
                  <label>Plz</label>
                  <PInput
                    value={this.state.invoice.address.zip}
                    onChange={this.handleAddressChange.bind(this, 'zip')}
                    replaceText={this.getAddressCompletion('zip')}
                  />
                </div>

                <div className="form-group">
                  <label>Land</label>
                  <PInput
                    value={this.state.invoice.address.country}
                    onChange={this.handleAddressChange.bind(this, 'country')}
                    replaceText={this.getAddressCompletion('country')}
                  />
                </div>

                <div className="items" onDragOver={this.onItemDragOver}>
                { this.state.invoice.getItems().map(function(item, i) {
                    return <div className="item" draggable="true" style={{position: "relative"}} key={item.key} data-id={i} onDragEnd={this.onItemDragEnd} onDragStart={this.onItemDragStart}>
                      <hr/>
                      <button tabIndex={i+102} style={{position: 'absolute', right: 0}} type="button" className="btn btn-danger" onClick={this.handleDeleteItem.bind(this, i)}>
                        x
                      </button>
                      <div className="form-group form-inline">
                        <label style={{marginRight:"15px"}}>Anzahl</label>
                        <input tabIndex={i+100} style={{width:"80px"}} placeholder="1" type="text" className="form-control" value={item.getQuantity()} onChange={this.handleItemChange.bind(this, 'quantity', i)} />
                        <label style={{marginRight:"15px", marginLeft: "25px"}}>Kosten</label>
                        <input tabIndex={i+101} placeholder="Kosten" type="text" className="form-control" value={item.getCost()} onChange={this.handleItemChange.bind(this, 'cost', i)} />
                      </div>
                      <div className="form-group">
                        <textarea tabIndex={i+10} rows="3" placeholder="Text" className="form-control" value={item.getText()} onChange={this.handleItemChange.bind(this, 'text', i)} />
                      </div>
                    </div>
                }.bind(this))}
                </div>

              </form>

              {(() => {
                if (this.state.invoice_uuid) {
                  return <input tabIndex={this.state.invoice.getItems().length + 11} type="submit" value="Speichern" onClick={this.handleUpdate} />
                } else {
                  return <input tabIndex={this.state.invoice.getItems().length + 11} type="submit" value="Anlegen" onClick={this.handleCreate} />
                }
              })()}

            </div>
          </div>
  }
})
