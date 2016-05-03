import Reflux from "reflux";
import Action from './../action/Action'
import Customer from './../dto/Customer'

export default Reflux.createStore({

    init: function() {
      this.customers = [];
      this.loading = 0;
      this.total = 0;
      this.ajaxRequest = null;

      this.listenTo(Action.require_customers, this.on_load_customers);
      this.listenTo(Action.deleted_customer, this.on_delete_customer);
    },

    isLoading : function() {
      return !!this.loading;
    },

    getCustomers : function() {
      return this.customers;
    },

    hasMoreToLoad : function() {
      return this.total > this.customers.length;
    },

    on_delete_customer: function(customer) {
      var customers = this.customers.filter(function(v) {
        return v.uuid != customer.uuid;
      });

      if (customers.length != this.customers.length) {
        --this.total;
      }

      this.customers = customers;

      this.trigger();
    },

    on_load_customers: function(query = null, page = 0) {

      if (query != this.query) {
        this.customers = [];
        this.total = null;

        if (this.ajaxRequest) {
          this.ajaxRequest.abort();
        }
      }

      if (query !== null) {
        this.query = query;
        this.total = null;
      }

      if (this.isLoading()) {
        return;
      }

      this.loading++;

      this.ajaxRequest = $.ajax({
        url: "http://127.0.0.1:6767/customers?q=" + (query ? query : '') + "&from=" + (this.customers.length),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function(data) {
        this.total = data.total;
        this.customers = this.customers.concat(data.customers);
      }.bind(this)).fail(function() {
        Action.created_customer_failed("nooopee");
      }.bind(this)).complete(function() {
        this.loading--;
        this.trigger();
      }.bind(this));
    }

});
