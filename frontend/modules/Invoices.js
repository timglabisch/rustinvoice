import React from 'react'
import Customer from './dto/Customer'
import InvoicesStore from './store/InvoicesStore'
import InvoiceStore from './store/InvoiceStore'
import Action from './action/Action'
import { Link } from 'react-router'

export default React.createClass({

  componentDidMount: function() {
    this.unsubscribeInvoices = InvoicesStore.listen(this.onStatusChange);
    this.unsubscribeInvoice = InvoiceStore.listen(this.onStatusChange);
    Action.require_invoices();
  },

  componentWillUnmount: function() {
    this.unsubscribeInvoices();
    this.unsubscribeInvoice();
  },

  getInitialState() {
     return {
       mounted_since: new Date,
       loading: InvoicesStore.isLoading(),
       invoices: InvoicesStore.getInvoices()
     };
  },

  onStatusChange: function() {
    this.setState({
      deleting_failed: !!InvoiceStore.getLogs(this.state.mounted_since, 'deleting_failed').length,
      loading: InvoicesStore.isLoading(),
      invoices: InvoicesStore.getInvoices()
    });
  },

  onDelete(invoice) {
    if (!confirm("Rechnung #" + invoice.uuid +  " " + invoice.address.first_name + " " + invoice.address.last_name + " wirklich löschen?")) {
      return;
    }

    Action.delete_invoice(invoice);
  },

  render() {
    return <div>

        <div style={{margin: "80px auto", width: 470}}>
          <div className="input-group input-group-lg">
            <input type="text" style={{width:450}} className="form-control" placeholder="Suche nach Rechnungen ..." aria-describedby="sizing-addon1"/>
          </div>
        </div>

        { this.state.loading && <div className="alert alert-info" role="alert">Rechnungen werden momenten aktualisiert</div> }
        { this.state.deleting_failed && <div className="alert alert-danger" role="alert">Beim Löschen ist ein Fehler aufgetreten</div> }

        { this.state.invoices.map(function(invoice) {
            return <div style={{position: 'relative'}} key={invoice.uuid}>
              <button onClick={this.onDelete.bind(this, invoice)} style={{position: 'absolute', right: 0}} type="button" className="btn btn-danger">
                x
              </button>
              <Link to={'/invoice/' + invoice.uuid}>
                <div>
                  foo: { invoice.uuid }
                </div>
              </Link>
              <hr/>
            </div>
        }.bind(this))}
      </div>
  }
})
