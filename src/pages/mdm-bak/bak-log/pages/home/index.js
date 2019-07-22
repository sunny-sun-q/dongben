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

import Header from '../../../../../components/header/index.js'
import BaklogLeftForm from '../../containers/baklogleft-form'
import BaklogTable from '../../containers/baklog-table'

class Home extends Component{
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="main">
        <Header title="清洗日志" />
        {/* 类似专用的div */}
        <section className="section-wrap">
          <div className="section-wrap-l">
            {/* 日志左侧一般是一个查询表单 */}
            <BaklogLeftForm />
          </div>
          <div className="section-wrap-r">
            {/* 自定义表 */}
            <BaklogTable />
          </div>
        </section>
      </div>
    )
  }
}

export default Home;
