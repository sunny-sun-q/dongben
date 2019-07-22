import React,{Component} from 'react';
import { FormattedMessage } from 'react-intl'
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import EditTable from '../../containers/edit-table'

@withRouter
@inject((stores) => {
  return {
    systablesStore: stores.systablesStore,
  }
}) @observer
class Home extends Component{

  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    return (
      <div className="main">
        <section className="section-wrap">
          <div className="section-wrap-r">
            <EditTable />
          </div>
        </section>
      </div>
    )
  }
}

export default Home;
