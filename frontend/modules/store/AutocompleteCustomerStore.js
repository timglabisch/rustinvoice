import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init() {
      this.completions = [];
      this.loading = 0;
      this.latest_request = null;

      this.listenTo(Action.autocomplete_customer, this.on_autocomplete_customer);
    },

    isLoading() {
      return !!this.loading;
    },

    getCompletions() {
      return this.completions;
    },

    on_autocomplete_customer(q) {

      if (this.isLoading() && this.latest_request) {
        this.latest_request.abort();
      }

      this.loading++;

      this.latest_request = $.ajax({
        url: "http://127.0.0.1:6767/suggest?query=" + q,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function(data) {
        this.completions = data.customers;
      }.bind(this)).fail(function() {
        // mhhmmmm
      }.bind(this)).complete(function() {
        this.loading--;
        this.trigger();
      }.bind(this));
    }

});
