import React from 'react'
import CustomerSuggest from './autocomplete/CustomerSuggest';
import Customer from './dto/Customer';

export default React.createClass({

  getDefaultProps() {
     return {
       loading : false
     };
  },

  render() {

    if (!this.props.loading) {
      return <div/>
    }

    return <div style={{zoom: "40%"}} className="sk-folding-cube">
      <div className="sk-cube1 sk-cube"></div>
      <div className="sk-cube2 sk-cube"></div>
      <div className="sk-cube4 sk-cube"></div>
      <div className="sk-cube3 sk-cube"></div>
    </div>
  }
})
