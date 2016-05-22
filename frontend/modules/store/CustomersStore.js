import Reflux from "reflux";
import Action from './../action/Action'
import Customer from './../dto/Customer'

export default Reflux.createStore({

    init: function () {
        this.customers = [];
        this.loading = 0;
        this.total = 0;
        this.ajaxRequest = null;
        this.query = null;

        this.listenTo(Action.require_customers, this.on_load_customers);
        this.listenTo(Action.deleted_customer, this.on_delete_customer);
        this.listenTo(Action.created_customer, this.on_refresh);
        this.listenTo(Action.updated_customer, this.on_refresh);
    },

    isLoading: function () {
        return !!this.loading;
    },

    getCustomers: function () {
        return this.customers;
    },

    hasMoreToLoad: function () {
        return this.total > this.customers.length;
    },

    on_delete_customer: function (customer) {
        var customers = this.customers.filter(function (v) {
            return v.uuid != customer.uuid;
        });

        if (customers.length != this.customers.length) {
            --this.total;
        }

        this.customers = customers;

        this.trigger();
    },

    on_refresh: function () {
        this.customers = [];
        this.total = null;
        this.loading = 0;
        this.query = null;

        this.on_load_customers();
    },

    on_load_customers: function (query = null) {

        if (query != this.query) {
            this.customers = [];
            this.total = null;

            if (this.ajaxRequest) {
                this.ajaxRequest.abort();
            }
        }

        this.query = query;

        if (this.isLoading()) {
            return;
        }

        this.loading++;

        this.ajaxRequest = $.ajax({
            url: "http://127.0.0.1:6767/customers?q=" + (query ? query : '') + "&from=" + (this.customers.length),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            cache: false
        }).done(function (data) {
            this.total = data.total;
            this.customers = this.customers.concat(data.customers);
        }.bind(this)).fail(function () {
            Action.created_customer_failed("nooopee");
        }.bind(this)).complete(function () {
            this.loading--;
            this.trigger();
        }.bind(this));
    },

    getQuery: function() {
        return this.query;
    }


});
