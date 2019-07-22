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
import MdmLog from '../../containers/mdmlog'
@withRouter
@inject((stores) => {
  return {
    logTablesStore: stores.logTablesStore,
    sysStore: stores.sysStore
  }
}) @observer
class Home extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
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
      <div className="mdm-integ-log"
          style={{overflowY: 'hidden'}}
        >
        {/* <Header title="集成日志" /> */}

        <section className="section-wrap mdm-integ-log-wrap">
          <Tabs
            style={{overflowY: 'hidden'}}
            defaultActiveKey="1"
            onChange={this.onChange}
            className="demo1-tabs mdm-tabs-integ-log">
            <TabPane tab='装载日志' key="1">
              <MdmLog opr_type={1}/>
            </TabPane>
            <TabPane tab='分发日志' key="2">
              <MdmLog opr_type={2}/>
            </TabPane>
          </Tabs>
        </section>
      </div>
    )
  }
}

export default Home;
