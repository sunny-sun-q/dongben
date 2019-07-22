import React, { Component } from 'react';
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

import Header from 'components/header/index.js'
import { Tabs } from 'tinper-bee';
const { TabPane } = Tabs;

import EditTable from '../../containers/edit-table'
@withRouter
@inject((stores) => {
  return {
    taskTablesStore: stores.taskTablesStore,
  }
}) @observer
class Home extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    // console.log(this.props.taskTablesStore)
    // console.log('Component DID MOUNT!');
  }

  onChange = (activeKey) => {
    console.log(`onChange ${activeKey}o-^-o`);
    this.setState({
      activeKey,
    });
  }


  render() {
    return (
      <div className="main">
        <Header title="主数据任务" />
        <section className="section-wrap">
          <Tabs
            defaultActiveKey="1"
            onChange={this.onChange}
            tabBarStyle="upborder"
            className="demo1-tabs">
            <TabPane tab='主数据一' key="1">
              <EditTable />
            </TabPane>
            <TabPane tab='主数据二' key="2">
              456  
            </TabPane>
          </Tabs>
        </section>
      </div>
    )
  }
}

export default Home;
