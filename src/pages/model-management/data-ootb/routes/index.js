import React from 'react'
import { HashRouter, Route  } from 'react-router-dom'
import HomeContainer from './home/container'
import CreateContainer from './create/container'

const AppRoutes = () => {
  return (
    <HashRouter>
      <div>
        <Route exact path="/" component={HomeContainer}/>
        <Route path="/create/:pk" component={CreateContainer}/>
      </div>
    </HashRouter>
  )
}
export default AppRoutes;
