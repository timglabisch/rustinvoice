import React from 'react'
import InvoicesStore from './store/InvoicesStore'
import InvoiceStore from './store/InvoiceStore'
import Action from './action/Action'
import {Link} from 'react-router'
import Loader from './Loader'
import Infinite from 'react-infinite'


var ListItem = React.createClass({
    render: function () {
        return <div className="infinite-list-item">
            <div style={{position: 'relative', height: 85}}>
                <button onClick={this.props.onDelete}
                        style={{position: 'absolute', right: 0}}
                        type="button" className="btn btn-danger">
                    x
                </button>
                <Link to={'/invoice/' + this.props.invoice.uuid}>
                    <div>
                        vorname: { this.props.invoice.address.first_name }
                    </div>
                    <div>
                        nachname: { this.props.invoice.address.last_name }
                    </div>
                </Link>
                <hr/>
            </div>
        </div>;
    }
});

export default React.createClass({

    componentDidMount: function () {
        this.unsubscribeInvoices = InvoicesStore.listen(this.onStatusChange);
        this.unsubscribeInvoice = InvoiceStore.listen(this.onStatusChange);
        Action.require_invoices();
    },

    componentWillUnmount: function () {
        this.unsubscribeInvoices();
        this.unsubscribeInvoice();
    },

    getInitialState() {
        return {
            mounted_since: new Date,
            loading: InvoicesStore.isLoading(),
            invoices: InvoicesStore.getInvoices(),
            has_more_to_load: true,
            isInfiniteLoading: false,
            query: InvoicesStore.getQuery()
        };
    },

    handleInfiniteLoad: function () {

        if (!this.state.has_more_to_load) {
            return;
        }

        this.setState({
            isInfiniteLoading: true
        });

        Action.require_invoices(this.state.query);
    },

    elementInfiniteLoad: function () {

        if (!this.state.has_more_to_load) {
            return <div className="alert alert-info" role="alert">Keine weiteren Rechnungen.</div>
        }

        return <div className="infinite-list-item">
            Loading...
        </div>;
    },

    componentWillReceiveProps(nextProps) {
        this.onStatusChange();
    },

    onStatusChange: function () {
        this.setState({
            deleting_failed: !!InvoiceStore.getLogs(this.state.mounted_since, 'deleting_failed').length,
            loading: InvoicesStore.isLoading(),
            invoices: InvoicesStore.getInvoices(),
            has_more_to_load: InvoicesStore.hasMoreToLoad(),
            query: InvoicesStore.getQuery(),
            isInfiniteLoading: false
        });
    },

    onDelete(invoice) {
        if (!confirm("Rechnung #" + invoice.uuid + " " + invoice.address.first_name + " " + invoice.address.last_name + " wirklich löschen?")) {
            return;
        }

        Action.delete_invoice(invoice);
    },

    onFilterInvoices(e) {
        this.setState({query: e.target.value});
        var current_value = e.target.value;

        this.setState({loading: 1});

        window.setTimeout(function () {
            if (current_value == this.state.query) {
                Action.require_invoices(current_value);
            }
        }.bind(this), 250);
    },

    render() {
        return <div>

            <div style={{margin: "80px auto", width: 470}}>
                <div
                    style={{position: 'absolute', marginLeft: -25, marginTop:15}}>
                    <Loader loading={this.state.loading}/>
                </div>
                <div className="input-group input-group-lg">
                    <input
                        type="text"
                        style={{width:450}}
                        className="form-control"
                        placeholder={this.state.loadig ? "Rechnungen werden geladen" : "Suche nach Rechnungen ..."}
                        onChange={this.onFilterInvoices}
                        value={this.state.query}
                    />
                </div>
            </div>

            { this.state.loading &&
            <div className="alert alert-info" role="alert">Rechnungen
                werden momenten aktualisiert</div> }
            { this.state.deleting_failed &&
            <div className="alert alert-danger" role="alert">Beim
                Löschen ist ein Fehler aufgetreten</div> }


            <Infinite elementHeight={85}
                      useWindowAsScrollContainer={true}
                      infiniteLoadBeginEdgeOffset={200}
                      onInfiniteLoad={this.handleInfiniteLoad}
                      loadingSpinnerDelegate={this.elementInfiniteLoad()}
                      isInfiniteLoading={this.state.isInfiniteLoading}
            >
                { this.state.invoices.map(function (invoice) {
                    return <div key={invoice.uuid}>
                        <ListItem
                            invoice={invoice}
                            onDelete={this.onDelete.bind(this, invoice)}
                        />
                    </div>
                }.bind(this))}
            </Infinite>
        </div>
    }
})
