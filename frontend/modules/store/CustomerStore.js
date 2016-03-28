import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function() {
        this.listenTo(Action.create_customer, this.on_create_customer);
        this.listenTo(Action.delete_customer, this.on_delete_customer);

        this.transaction_states = {};
    },

    getCustomerState: function(txid) {
      if (!this.transaction_states[txid]) {
        throw "unknown state request " + txid;
      }

      return this.transaction_states[txid];
    },

    on_create_customer: function(txid, customer) {

      if (!txid) {
        console.log("missing transaction id");
        return;
      }

      this.transaction_states[txid] = {
        type: 'customer_create',
        is_created: false,
        has_error: false,
        is_saving: true
      };

      $.ajax({
        url: "http://127.0.0.1:6767/customers",
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(customer),
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function() {
        this.transaction_states[txid] = {
          type: 'customer_create',
          is_created: true,
          has_error: false,
          is_saving: false
        };
      }.bind(this)).fail(function() {
        this.transaction_states[txid] = {
          type: 'customer_create',
          is_created: false,
          has_error: true,
          is_saving: false
        };
      }.bind(this)).complete(function() {
        this.trigger();
      }.bind(this));
    },

    on_delete_customer: function(txid, customer) {

      if (!txid) {
        console.log("missing transaction id");
        return;
      }

      this.transaction_states[txid] = {
        type: 'customer_delete',
        is_deleted: false,
        has_error: false,
        is_saving: false
      };

      $.ajax({
        url: "http://127.0.0.1:6767/customers/" + customer.uuid,
        method: 'DELETE',
        cache: false
      }.bind(this)).done(function() {
        this.transaction_states[txid] = {
          type: 'customer_delete',
          is_deleted: true,
          has_error: false
        };
      }.bind(this)).fail(function() {
        this.transaction_states[txid] = {
          type: 'customer_delete',
          is_deleted: false,
          has_error: true
        };
      }).complete(function() {
        this.trigger()
      }.bind(this));
    }

});
