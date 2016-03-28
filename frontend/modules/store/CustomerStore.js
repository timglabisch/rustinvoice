import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function() {
        this.listenTo(Action.create_customer, this.on_create_customer);
        this.listenTo(Action.delete_customer, this.on_delete_customer);

        this.transaction_states = {};
        this.deletions = {};
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
        Action.created_customer();
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

    getDeletions: function(since, state) {
      return Object.keys(this.deletions)
        .filter(function(logentryKey) {
          return this.deletions[logentryKey].date >= since && (!state || this.deletions[logentryKey].state == state);
        }.bind(this)).map(function(logentryKey) {
          return this.deletions[logentryKey];
        }.bind(this));
    },

    on_delete_customer: function(customer) {

      this.deletions[customer.uuid] = {
        customer: customer,
        date: new Date(),
        state: 'deleting'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/customers/" + customer.uuid,
        method: 'DELETE',
        cache: false
      }).done(function() {
        this.deletions[customer.uuid].state = "deleted"
        Action.deleted_customer();
      }.bind(this)).fail(function() {
        this.deletions[customer.uuid].state = "failed"
      }.bind(this)).complete(function() {
        this.trigger()
      }.bind(this));
    }

});
