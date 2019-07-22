import React, {Component} from "react";
import {HashRouter, Route, Switch} from 'react-router-dom';

import Home from '../pages/home';
import AddOrEdit from '../pages/addOrEdit';

const Routes = () => (
  <HashRouter>
    <div style={{'width': '100%', height: '100%'}}>
      <Switch>
        {/*因 Home 下包含子路由，所以其他平级路由要写在下面的路由之前 即 paht="/"*/}
        <Route path="/addOrEdit/:id/" component={AddOrEdit} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  </HashRouter>
)

export default Routes;
