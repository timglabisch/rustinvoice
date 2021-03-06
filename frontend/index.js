import React from 'react'
import { render } from 'react-dom'
import App from './modules/App'
import Customer from './modules/Customer'
import Invoice from './modules/Invoice'
import Invoices from './modules/Invoices'
import Customers from './modules/Customers'
import Import from './modules/Import'
import { Router, Route, hashHistory, Link } from 'react-router'

render((
  <div>
     <Router history={hashHistory}>
       <Route path="/" component={App}>
         <Route path="/customers" component={Customers}/>
         <Route path="/customer" component={Customer}/>
         <Route path="/customer/:uuid" component={Customer}/>
         <Route path="/invoices" component={Invoices}/>
         <Route path="/invoice" component={Invoice}/>
         <Route path="/invoice/:uuid" component={Invoice}/>
         <Route path="/import" component={Import}/>
       </Route>
     </Router>
  </div>
), document.getElementById('app'))
