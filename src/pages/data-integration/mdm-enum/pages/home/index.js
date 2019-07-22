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

import QFilter from './queryAndFilter'
import EnumTables from './enumTables'

@withRouter
@inject((stores) => {
  return {
    enumTablesStore: stores.enumTablesStore,
  }
}) @observer
class Home extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="main" >
        <section className="section-wrap">

          <QFilter  />
          <EnumTables />
        </section>
      </div>
    )
  }
}

export default Home;
