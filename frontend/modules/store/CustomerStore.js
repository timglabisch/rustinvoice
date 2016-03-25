import Reflux from "reflux";
import Action from './../action/Action'


export default Reflux.createStore({

    init: function() {
        console.log('listen')
        this.listenTo(Action.on, this.output);
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
      }).done(function() {
        Action.created_customer("yeahhh");
      }).fail(function() {
        Action.created_customer_failed("nooopee");
      });
    },

    output: function(flag) {

      console.log('what?!!');

      var status = flag ? 'ONLINE' : 'OFFLINE';

      this.trigger(status);
    }

});
