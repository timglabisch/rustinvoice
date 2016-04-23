import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function() {
      this.customers = [];
      this.loading = 0;

      this.listenTo(Action.require_customers, this.on_load_customers);
      this.listenTo(Action.created_customer, this.on_load_customers);
      this.listenTo(Action.deleted_customer, this.on_load_customers);
    },

    isLoading : function() {
      return !!this.loading;
    },

    getCustomers : function() {
      return this.customers;
    },

    on_load_customers: function(query = null) {

      if (query !== null) {
        this.query = query;
      }

      if (this.isLoading()) {
        return;
      }

      this.loading++;

      $.ajax({
        url: "http://127.0.0.1:6767/customers?q=" + (query ? query : ''),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function(data) {
        this.customers = data.customers;
      }.bind(this)).fail(function() {
        Action.created_customer_failed("nooopee");
      }.bind(this)).complete(function() {
        this.loading--;
        this.trigger();
      }.bind(this));
    }

});
