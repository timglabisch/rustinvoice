import React from 'react'

export default React.createClass({

  componentDidMount: function() {

  },

  componentWillUnmount: function() {

  },

  getInitialState() {
     return {
       open: false,
       completions: [
         "foo",
         "bar"
       ]
    };
  },

  onStatusChange: function() {

  },

  onFoo() {
    debugger;
  },

  open() {
    if (this.state.open) {
      return;
    }

    this.setState({open: true});
  },

  close() {
    if (!this.state.open) {
      return;
    }

    this.setState({open: false});
  },

  render() {
    // die challenge hier ist blut und leave sinnvoll zu mixen, um das fenster dann zu schließen
    return <div onMouseLeave={this.close}>
        <input type="text" onFocus={this.open}/>
        {this.state.open && (() => {
          return <ul style={{
            position: 'absolute',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: 10,
            listStyle: 'none',
            minWidth: 300
          }}>
          { this.state.open && this.state.completions.map(function(completion) {
              return <li
                  onClick={this.onFoo.bind(this, completion)}
                  key={completion}
                  style={{paddingTop: 10, paddingBottom: 10, display: "block", backgroundColor: "yellow"}}
                >
                {completion}
              </li>
          }.bind(this))}
          </ul>
        })()}
      </div>
  }
})
