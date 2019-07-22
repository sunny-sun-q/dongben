import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

import "bee-pagination/build/Pagination.css"

// import 'bee-button/build/Button.css'
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import QFilter from '../queryAndFilter'
import LogTables from '../logtable'

@withRouter
@inject((stores) => {
  return {
    logTablesStore: stores.logTablesStore,
    sysStore: stores.sysStore
  }
}) @observer

class MdmLog extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        addShowModal: false
    }
  }
  componentDidMount() {
    
  }

  render() {
    let { opr_type } = this.props
    return (
      <div >
        <QFilter  opr_type={opr_type}/>
        <LogTables opr_type={opr_type}/>
      </div>
    )
  }
}

export default MdmLog; 
