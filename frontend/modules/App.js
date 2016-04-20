import React from 'react'
import CustomerStore from './store/CustomerStore'
import { Router, Route, hashHistory, Link } from 'react-router'

export default React.createClass({

  render() {

    return <div>
    <nav className="navbar navbar-inverse navbar-fixed-top">
     <div className="container-fluid">
       <div className="navbar-header">
         <a className="navbar-brand" href="#">Rustinvoice</a>
       </div>
       <div id="navbar" className="navbar-collapse collapse">
       </div>
     </div>
   </nav>

    <div className="container-fluid">
     <div className="row">
       <div className="col-sm-3 col-md-2 sidebar">
         <ul className="nav nav-sidebar">
           <li className="active"><a href="#">Overview <span className="sr-only">(current)</span></a></li>
           <li style={{position: 'relative'}}>
             <Link to="/customer" style={{zIndex: 199, position: 'absolute', right: 15, marginTop:3, padding:0}}>
               <div className="btn btn-success">
                 +
               </div>
             </Link>
             <Link to="/customers">Kunden</Link>
           </li>
           <li>
            <Link to="/invoice" style={{zIndex: 199, position: 'absolute', right: 15, marginTop:3, padding:0}}>
             <div className="btn btn-success">
               +
             </div>
            </Link>
            <Link to="/invoices">Rechnungen</Link>
           </li>
         </ul>
       </div>
       <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          {(() => {
            if (this.props.location.pathname == "/") {
              return <div>HELLO</div>
            } else {
              return this.props.children
            }
          })()}
       </div>
     </div>
    </div>
  </div>
  }
})
