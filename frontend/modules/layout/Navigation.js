import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return <ul role="nav">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/customers">Customers</Link></li>
    </ul>
  }
})
