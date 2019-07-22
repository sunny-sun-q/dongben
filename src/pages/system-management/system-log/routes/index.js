import React, { Component } from "react";
import {HashRouter,Route} from 'react-router-dom';

import Home from '../pages/home/index.js';
import Tree from 'components/tree/index'

const Routes= () => (
  <HashRouter>
    <Route path="/" exact={true} component={Home} />
  </HashRouter>
)

export default Routes;
