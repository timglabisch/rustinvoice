import React from 'react'
import { render } from 'react-dom'
import App from './modules/App'
import Customer from './modules/Customer'
import Customers from './modules/Customers'
import { Router, Route, hashHistory, Link } from 'react-router'

render((
  <div>
     <Router history={hashHistory}>
       <Route path="/" component={App}>
         <Route path="/customers" component={Customers}/>
         <Route path="/customer" component={Customer}/>
       </Route>
     </Router>
  </div>
), document.getElementById('app'))
