import React from 'react'
import CustomersStore from './store/CustomersStore'
import CustomerStore from './store/CustomerStore'
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
                <Link to={'/customer/' + this.props.customer.uuid}>
                    <div>
                        vorname: { this.props.customer.address.first_name }
                    </div>
                    <div>
                        nachname: { this.props.customer.address.last_name }
                    </div>
                </Link>
                <hr/>
            </div>
        </div>;
    }
});

export default React.createClass({

    componentDidMount: function () {
        this.unsubscribeCustomers = CustomersStore.listen(this.onStatusChange);
        this.unsubscribeCustomer = CustomerStore.listen(this.onStatusChange);
        Action.require_customers();
    },

    componentWillUnmount: function () {
        this.unsubscribeCustomers();
        this.unsubscribeCustomer();
    },

    getInitialState() {
        return {
            mounted_since: new Date,
            loading: 1,
            customers: CustomersStore.getCustomers(),
            has_more_to_load: true,
            isInfiniteLoading: false,
            query: CustomersStore.getQuery()
        };
    },

    handleInfiniteLoad: function () {

        if (!this.state.has_more_to_load) {
            return;
        }

        this.setState({
            isInfiniteLoading: true
        });
        Action.require_customers(this.state.query);
    },

    elementInfiniteLoad: function () {

        if (!this.state.has_more_to_load) {
            return <div className="alert alert-info" role="alert">Keine
                weiteren Kunden.</div>
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
            deleting_failed: !!CustomerStore.getLogs(this.state.mounted_since, 'deleting_failed').length,
            loading: CustomersStore.isLoading(),
            customers: CustomersStore.getCustomers(),
            has_more_to_load: CustomersStore.hasMoreToLoad(),
            query: CustomersStore.getQuery(),
            isInfiniteLoading: false
        });
    },

    onDelete(customer) {
        if (!confirm("Kunden #" + customer.uuid + " " + customer.address.first_name + " " + customer.address.last_name + " wirklich löschen?")) {
            return;
        }

        this.setState(this.state);
        Action.delete_customer(customer);
    },

    onFilterCustomers(e) {
        this.setState({query: e.target.value});
        var current_value = e.target.value;

        this.setState({loading: 1});

        window.setTimeout(function () {
            if (current_value == this.state.query) {
                Action.require_customers(current_value);
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
                        placeholder={this.state.loadig ? "Kundendaten werden geladen" : "Suche nach Kunden ..."}
                        onChange={this.onFilterCustomers}
                        value={this.state.query}
                    />
                </div>
            </div>

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
                { this.state.customers.map(function (customer) {
                    return <div key={customer.uuid}>
                        <ListItem
                            customer={customer}
                            onDelete={this.onDelete.bind(this, customer)}
                        />
                    </div>
                }.bind(this))}
            </Infinite>
        </div>
    }
})
