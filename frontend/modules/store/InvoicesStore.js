import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function() {
      this.invoices = [];
      this.loading = 0;

      this.listenTo(Action.require_invoices, this.on_load_invoices);
      this.listenTo(Action.created_invoice, this.on_load_invoices);
      this.listenTo(Action.deleted_invoice, this.on_load_invoices);
    },

    isLoading : function() {
      return !!this.loading;
    },

    getInvoices : function() {
      return this.invoices;
    },

    on_load_invoices: function() {

      if (this.isLoading()) {
        return;
      }

      this.loading++;

      $.ajax({
        url: "http://127.0.0.1:6767/invoices",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function(data) {
        this.invoices = data.invoices;
      }.bind(this)).fail(function() {
        Action.created_customer_failed("nooopee");
      }.bind(this)).complete(function() {
        this.loading--;
        this.trigger();
      }.bind(this));
    }

});
