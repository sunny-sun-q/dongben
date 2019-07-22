import React, { Component } from 'react';
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

import { Tabs } from 'tinper-bee';
import TabPanel from '../../containers/tab-panel'
const { TabPane } = Tabs;

@withRouter
@inject((stores) => {
  return {
    LogTable: stores.LogTable,
  }
}) @observer
class Home extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
  }

  onChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  }


  render() {
    return (
      <div className="main" style={{'overflow-y': 'hidden'}}>
        <section className="section-wrap">
          <Tabs 
            style={{'overflow-y': 'hidden'}}
            defaultActiveKey="1"
            onChange={this.onChange}
            tabBarStyle="upborder"
            className="demo1-tabs">
            <TabPane tab='系统日志' key="1">
              <TabPanel/>
            </TabPane>
          </Tabs>
        </section>
      </div>
    )
  }
}

export default Home;
