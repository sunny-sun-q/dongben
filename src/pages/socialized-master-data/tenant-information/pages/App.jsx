import React from 'react'
import {
  withRouter,
} from 'react-router-dom'
import Routes from '../routes';

class App extends React.Component {
  render() {
    return (
      <Routes key="routes" />
    )
  }
}

export default App
