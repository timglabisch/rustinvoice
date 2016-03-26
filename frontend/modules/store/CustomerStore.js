import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function() {
        console.log('listen')
        this.listenTo(Action.create_customer, this.create_customer)
    },

    create_customer: function(c) {
      console.log(c);

      $.ajax({
        url: "http://127.0.0.1:6767/customers",
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(c),
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function() {
        Action.created_customer("yeahhh");
      }).fail(function() {
        Action.created_customer_failed("nooopee");
      });
    },

    delete_customer: function(c) {
      $.ajax({
        url: "http://127.0.0.1:6767/customers/" + c.uuid,
        method: 'DELETE',
        cache: false
      }).done(function() {
        this.load_all();
      }.bind(this)).fail(function() {
        console.log("delete failed");
      });
    },

    load_all: function() {
      $.ajax({
        url: "http://127.0.0.1:6767/customers",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache: false
      }).done(function(data) {
        this.trigger(data);
      }.bind(this)).fail(function() {
        Action.created_customer_failed("nooopee");
      });
    }

});
