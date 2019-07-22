import React from 'react'
import {
  withRouter,
} from 'react-router-dom'
import Routes from '../routes';

import {HashRouter, Route} from 'react-router-dom';

import Home from './index.js';

// import SocializedData from 'pages/socializedData/index';
// import Supplier from 'pages/supplier/index';

const Routes= () => (
  <HashRouter>
    <Route path="/" exact={true} component={Home}></Route>
  </HashRouter>
)

class AppHome extends React.Component {
  render() {
    return (
      <Routes key="routes" />
    )
  }
}

export default AppHome
