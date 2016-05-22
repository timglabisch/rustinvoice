import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function () {
        this.invoices = [];
        this.loading = 0;

        this.listenTo(Action.require_invoices, this.on_load_invoices);
        this.listenTo(Action.deleted_invoice, this.on_deleted_invoices);
        this.listenTo(Action.created_invoice, this.on_refresh);
        this.listenTo(Action.updated_invoice, this.on_refresh);
    },

    isLoading: function () {
        return !!this.loading;
    },

    getInvoices: function () {
        return this.invoices;
    },

    hasMoreToLoad: function () {
        return this.total > this.invoices.length;
    },

    on_refresh: function () {
        this.invoices = [];
        this.total = null;
        this.loading = 0;
        this.query = null;

        this.on_load_invoices();
    },

    on_deleted_invoices: function (invoice) {
        var invoices = this.invoices.filter(function (v) {
            return v.uuid != invoice.uuid;
        });

        if (invoices.length != this.invoices.length) {
            --this.total;
        }

        this.invoices = invoices;

        this.trigger();
    },

    on_load_invoices: function (query = null) {

        if (query != this.query) {
            this.invoices = [];
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
            url: "http://127.0.0.1:6767/invoices?q=" + (query ? query : '') + "&from=" + (this.invoices.length),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            cache: false
        }).done(function (data) {
            this.total = data.total;
            this.invoices = this.invoices.concat(data.invoices);
        }.bind(this)).fail(function () {
            Action.created_customer_failed("nooopee");
        }.bind(this)).complete(function () {
            this.loading--;
            this.trigger();
        }.bind(this));
    },

    getQuery: function () {
        return this.query;
    }

});
