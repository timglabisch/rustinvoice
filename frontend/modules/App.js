import React from 'react'
import Navigation from './layout/Navigation'
import CustomerStore from './store/CustomerStore'

export default React.createClass({

  render() {
    return <div>
            <Navigation></Navigation>
            <div>
              Hello, React Router!!
            </div>
          </div>
  }
})
