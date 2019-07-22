import React, {Component} from "react";
import {HashRouter, Route, Switch} from 'react-router-dom';
import CardEdit from '../../../data-management/management/routes/tree_card/tree_card_edit'
import History from './home_history'
import Process from './home_process'
import ProcessDetail from './home_process_detail'
import Home from './home';




const Routes = () => (
  <HashRouter>
    <div style={{'width': '100%', height: '100%'}}>
      <Switch>


        {/*因 Home 下包含子路由，所以其他平级路由要写在下面的路由之前 即 paht="/"*/}
        
              <Route path="/:type/:id/edit/:mdmcode" component={CardEdit} />
              <Route path="/:type/:id/history/:mdmcode" component = {History} />
              <Route path="/:type/:id/process/:mdmcode" component = {Process} />
              
              <Route path="/process/:pk_id" component={ProcessDetail} />
        
        <Route path="/" component={Home} />
      </Switch>
    </div>
  </HashRouter>
)

export default Routes;
