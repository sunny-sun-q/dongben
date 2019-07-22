import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

import "bee-pagination/build/Pagination.css"
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import QueryPanel from '../query-panel'
import TablePanel from '../table-panel'

@withRouter
@inject((stores) => {
  return {
    LogTable: stores.LogTable,
  }
}) @observer

/**
 * 系统日志主页
 */
class TabPanel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        addShowModal: false
    }
  }
  componentDidMount() {
    
  }

  render() {
    return (
      <div >
        <QueryPanel/>
        <TablePanel/>
      </div>
    )
  }
}

export default TabPanel; 
