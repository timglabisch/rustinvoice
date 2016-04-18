import React from 'react'

export default React.createClass({

  render() {

    return <span>
        <div
          style={{color: "#777", position: "absolute", padding: "5px 0 0 7px", fontSize: "1.3em"}}
        >
          {this.props.replaceText}
        </div>
        <input
          type="text"
          autoComplete="off"
          className="form-control"
          style={this.props.replaceText ? {color: "transparent" } : {}}
          value={this.props.value}
          {...this.props}
          />
      </span>
  }
})
