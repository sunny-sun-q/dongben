import React, { Component } from "react";
import {HashRouter,Route} from 'react-router-dom';

// import Home from '../pages/home/index.js';
// import Relation from '../pages/relation/index.js';
import Portraiture from '../pages/portraiture/index.js';


const Routes= () => (
  <HashRouter>
    <div style={{'width':'100%',height:'100%'}}>
      <Route path="/:name" exact={true} component={Portraiture} />
      {/* <Route path="/portraiture/:name" component={Portraiture}></Route>
      <Route path="/Relation/:name" component={Relation}></Route> */}
    </div>
  </HashRouter>
)

export default Routes;
