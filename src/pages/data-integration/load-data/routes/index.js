import React, { Component } from "react";
import {HashRouter,Route} from 'react-router-dom';

import Home from '../pages/home/index.js';


const Routes= () => (
  <HashRouter>
    <div style={{'width':'100%',height:'100%'}}>
      {/*因 Home 下包含子路由，所以其他平级路由要写在下面的路由之前 即 paht="/"*/}
      <Route path="/" component={Home} />
      {/* <Route path="/" component={Home} />  新弹出页面覆盖原页面*/}
    </div>
  </HashRouter>
)

export default Routes;
