import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function() {
        this.listenTo(Action.create_customer, this.on_create_customer);
        this.listenTo(Action.delete_customer, this.on_delete_customer);
        this.listenTo(Action.load_customer, this.on_load_customer);
        this.listenTo(Action.update_customer, this.on_update_customer);

        this.customers = {};
        this.logs = {};
    },

    on_create_customer: function(txid, customer) {

      if (!txid) {
        console.log("missing transaction id");
        return;
      }

      this.logs[txid] = {
        customer: customer,
        date: new Date(),
        state: 'saving'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/customers",
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(customer),
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function() {
        this.logs[txid].state = "saving_success"
        Action.created_customer();
      }.bind(this)).fail(function() {
        this.logs[txid].state = "saving_failed"
      }.bind(this)).complete(function() {
        this.trigger();
      }.bind(this));
    },

    getLog: function(id, since, state) {

      if (!this.logs[id]) {
        return null;
      }

      if (!(this.logs[id].date >= since && (!state || this.logs[id].state == state))) {
        return null;
      }

      return this.logs[id];
    },

    getLogs: function(since, state) {
      return Object.keys(this.logs)
        .map(function(logentryKey) {
          return this.getLog(logentryKey, since, state);
        }.bind(this))
        .filter(function(logentryKey) {
          return logentryKey;
        }.bind(this));
    },

    getCustomer: function(uuid) {
      return this.customers[uuid] || null;
    },

    on_update_customer: function(customer) {

      this.customers[customer.uuid] = customer;

      this.logs[customer.uuid] = {
        date: new Date(),
        state: 'updating'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/customers/" + customer.uuid,
        method: 'PUT',
        data: JSON.stringify(customer),
        cache: false
      }).done(function() {
        this.logs[customer.uuid].state = "updating_success"
      }.bind(this)).fail(function() {
        this.logs[customer.uuid].state = "updating_failed"
      }.bind(this)).complete(function() {
        this.trigger()
      }.bind(this));
    },

    on_load_customer: function(uuid) {
      this.logs[uuid] = {
        date: new Date(),
        state: 'loading'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/customers/" + uuid,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function(customer) {
        this.logs[uuid].state = "loading_success"
        this.customers[uuid] = customer;
      }.bind(this)).fail(function() {
        this.logs[uuid].state = "loading_failed"
      }.bind(this)).complete(function() {
        this.trigger()
      }.bind(this));
    },

    on_delete_customer: function(customer) {

      delete this.customers[customer.uuid];

      this.logs[customer.uuid] = {
        customer: customer,
        date: new Date(),
        state: 'deleting'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/customers/" + customer.uuid,
        method: 'DELETE',
        cache: false
      }).done(function() {
        this.logs[customer.uuid].state = "deleting_success"
        Action.deleted_customer(customer);
      }.bind(this)).fail(function() {
        this.logs[customer.uuid].state = "deleting_failed"
      }.bind(this)).complete(function() {
        this.trigger()
      }.bind(this));
    }

});
