import React from 'react'

export default React.createClass({

  render() {

    if (!this.props || !this.props.customer) {
      return <div>Keine Kundeninformationen verfügbar.</div>
    }

    return <div>
        {this.props.customer.address.first_name} {this.props.customer.address.last_name}
        <small>
          {this.props.customer.address.zip} {this.props.customer.address.street} {this.props.customer.address.street_number}
        </small>
      </div>
  }
})
