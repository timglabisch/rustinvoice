import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function() {
        this.listenTo(Action.create_invoice, this.on_create_invoice);
        this.listenTo(Action.delete_invoice, this.on_delete_invoice);
        this.listenTo(Action.load_invoice, this.on_load_invoice);
        this.listenTo(Action.update_invoice, this.on_update_invoice);

        this.invoices = {};
        this.logs = {};
    },

    on_create_invoice: function(txid, invoice) {

      debugger;

      if (!txid) {
        console.log("missing transaction id");
        return;
      }

      this.logs[txid] = {
        invoice: invoice,
        date: new Date(),
        state: 'saving'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/invoices",
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(invoice),
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function() {
        this.logs[txid].state = "saving_success"
        Action.created_invoice();
      }.bind(this)).fail(function() {
        his.logs[txid].state = "saving_failed"
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

    getInvoice: function(uuid) {
      return this.invoices[uuid] || null;
    },

    on_update_invoice: function(invoice) {

      this.invoices[invoice.uuid] = invoice;

      this.logs[invoice.uuid] = {
        date: new Date(),
        state: 'updating'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/invoices/" + invoice.uuid,
        method: 'PUT',
        data: JSON.stringify(invoice),
        cache: false
      }).done(function() {
        this.logs[invoice.uuid].state = "updating_success"
      }.bind(this)).fail(function() {
        this.logs[invoice.uuid].state = "updating_failed"
      }.bind(this)).complete(function() {
        this.trigger()
      }.bind(this));
    },

    on_load_invoice: function(uuid) {
      this.logs[uuid] = {
        date: new Date(),
        state: 'loading'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/invoices/" + uuid,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function(invoice) {
        this.logs[uuid].state = "loading_success"
        this.invoices[uuid] = invoice;
      }.bind(this)).fail(function() {
        this.logs[uuid].state = "loading_failed"
      }.bind(this)).complete(function() {
        this.trigger()
      }.bind(this));
    },

    on_delete_invoice: function(invoice) {

      delete this.invoices[invoice.uuid];

      this.logs[invoice.uuid] = {
        invoice: invoice,
        date: new Date(),
        state: 'deleting'
      };

      $.ajax({
        url: "http://127.0.0.1:6767/invoices/" + invoice.uuid,
        method: 'DELETE',
        cache: false
      }).done(function() {
        this.logs[invoice.uuid].state = "deleting_success"
        Action.deleted_invoice();
      }.bind(this)).fail(function() {
        this.logs[invoice.uuid].state = "deleting_failed"
      }.bind(this)).complete(function() {
        this.trigger()
      }.bind(this));
    }

});
