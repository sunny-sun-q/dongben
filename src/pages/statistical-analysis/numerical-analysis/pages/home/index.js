import React,{Component} from 'react';
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

import StatisticData from '../../containers/statistic-data'
@withRouter

@inject((stores) => {
  return {
    designStore: stores.designStore,
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
            <StatisticData />
          </div>
        </section>
      </div>
    )
  }
}

export default Home;
