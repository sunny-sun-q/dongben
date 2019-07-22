import React, { Component } from "react";
import {HashRouter,Route} from 'react-router-dom';

import Home from '../pages/home/index.js';


const Routes= () => (
  <HashRouter>
    <div style={{'width':'100%',height:'100%'}}>
      <Route path="/" exact={true} component={Home} />
    </div>
  </HashRouter>
)

export default Routes;
