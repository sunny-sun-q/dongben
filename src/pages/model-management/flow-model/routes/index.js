import React, { Component } from "react";
import {HashRouter,Route} from 'react-router-dom';

import Home from '../pages/home/index.js';
import Leaf from '../pages/leaf/index.js';

const Routes= () => (
  <HashRouter>
    <div style={{'width':'100%',height:'100%'}}>
      <Route path="/" exact={true} component={Home} />
      <Route path="/leaf/:id/:code" component={Leaf} />
    </div>
  </HashRouter>
)

export default Routes;
