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
    },

    output: function(flag) {

      console.log('what?!!');

      var status = flag ? 'ONLINE' : 'OFFLINE';

      this.trigger(status);
    }

});
