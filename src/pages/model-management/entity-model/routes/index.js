import React, { Component } from "react";
import {HashRouter,Route} from 'react-router-dom';

import Home from '../pages/home/index.js';
import Leaf from '../pages/leaf/index.js';
import EncodeRule from '../pages/encode/index.js';

// import SocializedData from 'pages/socializedData/index';
// import Supplier from 'pages/supplier/index';

const Routes= () => (
  <HashRouter>
    <div style={{'width':'100%',height:'100%'}}>
      <Route path="/" exact={true} component={Home} />
      <Route path="/leaf/:id" component={Leaf} />
      <Route path="/encode/:id" component={EncodeRule} />
    </div>
  </HashRouter>
)

export default Routes;
