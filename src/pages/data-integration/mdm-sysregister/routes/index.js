import React, { Component } from "react";
import {HashRouter,Route} from 'react-router-dom';

import Home from '../pages/home/index.js';
import Tree from 'components/tree/index'

// import SocializedData from 'pages/socializedData/index';
// import Supplier from 'pages/supplier/index';

const Routes= () => (
  <HashRouter>
    <Route path="/" exact={true} component={Home} />
    {/* <Route path='/Home/About' component={Tree} /> */}
  </HashRouter>
)

export default Routes;
