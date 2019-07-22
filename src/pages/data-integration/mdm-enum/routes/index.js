import React, { Component } from "react";
import {HashRouter,Route} from 'react-router-dom';

import Home from '../pages/home/index.js';




const Routes= () => (
  <HashRouter>
    <Route path="/" exact={true} component={Home} />
  </HashRouter>
)

export default Routes;
