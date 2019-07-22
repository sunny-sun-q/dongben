import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
// import {BpmButtonSubmit,BpmButtonRecall} from 'yyuap-bpm';
import { Tooltip, Message, Modal, Loading } from 'tinper-bee';
import Select from 'bee-select';
import classnames from 'classnames';
import {Button} from 'components/tinper-bee';

// import moment from "moment/moment";
// import DataMaintenanceForm from '../DataMaintenance-form';
// import SeniorSearch from 'components/SeniorSearch';
// import AcExport from '../DemoOrder-export';
// import AcUpload from 'ac-upload';
// import 'ac-upload/build/ac-upload.css';

import LogItemTables from '../logdetail'

import './index.less'
////////*********** */
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

@withRouter

@inject((stores) => {
  return {
    logTablesStore: stores.logTablesStore,
    sysStore: stores.sysStore
  }
}) @observer
export default class LogTables extends Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
      display: 'hide',
      showLoading: true,
      needMultiSelect: false,
      pageIndex: 1,
      pageSize: 10,
      // totalPages: 1, //总页数
      // total: 1, // 总条数
    }
    this.column = [
      {
        title: "类型",
        dataIndex: "opr_type",
        key: "opr_type",
        width: 100,
      }, {
        title: "主数据",
        dataIndex: "gd_name",
        key: "gd_name",
        width: 120,
      }, {
        title: "主子表",
        dataIndex: "entity_name",
        key: "entity_name",
        width: 120,
      },
      // {
      //   title: "物料主数据",
      //   dataIndex: "dyna_name",
      //   key: "dyna_name",
      //   width: 150,
      // },
      {
        title: "集成系统",
        dataIndex: "sys_name",
        key: "sys_name",
        width: 120,
      }, {
        title: "操作状态",
        dataIndex: "opr_state",
        key: "opr_state",
        width: 120,
      }, {
        title: "用户",
        dataIndex: "opr_user",
        key: "opr_user",
        width: 200,
      }, {
        title: "时间",
        dataIndex: "opr_time",
        key: "opr_time",
        width: 200,
      }, {
        title: "备注",
        dataIndex: "opr_comment",
        key: "opr_comment",
        width: 200,
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                width: "180px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
              }}>{text}</span>
            </Tooltip>
          );
        }
      }, {
        title: "操作",
        dataIndex: "d",
        key: "d",
        width: 100,
        // fixed: "right",
        render(text, record, index) {
          return (
            <div className='operation-btn'>
              {/* <i size='sm' className='uf uf-search edit-btn'
                onClick={() => {
                  self.viewDetail(record.pk_log)
                }}>
              </i> */}
              <a style={{color:"#1E7BE2",cursor:"pointer"}} onClick={() => {
                  self.viewDetail(record.pk_log)
                }}>查看</a>
            </div>
          )
        }
      }
    ]
  }



  viewDetail(pk_log){
    let { logTablesStore } =  this.props

    if(this.props.opr_type === 1){
      logTablesStore.tableitem1.showLogItemsModal = true
      logTablesStore.table1.viewDetailPKLOG = pk_log
    }else{
      logTablesStore.tableitem2.showLogItemsModal = true
      logTablesStore.table2.viewDetailPKLOG = pk_log
    }

    logTablesStore.getItemsByOneRecord(10, 1)
  }

  async componentDidMount() {
    const { opr_type, logTablesStore } = this.props

    let needMultiSelect = false, display = 'hide'
    if (2 === opr_type) {
      needMultiSelect = true
      display = 'show'
    }

    logTablesStore.qfcond.opr_type = opr_type
    await logTablesStore.getTables(10, 1)
    this.setState({
      display: display,
      needMultiSelect: needMultiSelect,
      showLoading: false,
      total: opr_type === 1 ?  logTablesStore.table1.total : logTablesStore.table2.total,
      totalPages: opr_type === 1 ? logTablesStore.table1.totalPages : logTablesStore.table2.totalPages
    })
  }

  getSelectedDataFunc = (data) => {
    let { logTablesStore } =  this.props
    logTablesStore.table2.rowDatas = data

    let logs = data // []
    let pk_logs = ''
    for(let i=0; i<logs.length; i++){
      if('失败' === logs[i].opr_state){
        pk_logs = pk_logs + logs[i].pk_log + ','
      }
    }
    pk_logs = pk_logs.substr(0, pk_logs.length-1)
    logTablesStore.table2.pk_logs = pk_logs
    if('' != pk_logs){
      logTablesStore.table2.isDisabledFailedButton = false
    }
  }

  onPageSizeSelect = (index, pageSize) => {
    let { logTablesStore } = this.props
    let { pageIndex } = this.state
    logTablesStore.getTables(pageSize, pageIndex)
    this.setState({
      pageSize: pageSize
    })
  }

  onPageIndexSelect = pageIndex => {
    let { logTablesStore } = this.props
    let { pageSize } = this.state

    logTablesStore.getTables(pageSize, pageIndex)
    this.setState({
      pageIndex: pageIndex
    })
  }

  failureToResend = () => {

    let { logTablesStore } =  this.props
    if('' != logTablesStore.table2.pk_logs){
      logTablesStore.failureToResendMulti();
    }
  }

  render() {
    let { info, isDisabledFailedButton } = this.props.opr_type ===1 ? this.props.logTablesStore.table1 : this.props.logTablesStore.table2
    let { showLogItemsModal } = this.props.opr_type ===1 ? this.props.logTablesStore.tableitem1 : this.props.logTablesStore.tableitem2
    let { totalPages, total } = this.props.opr_type ===1 ? this.props.logTablesStore.table1 : this.props.logTablesStore.table2
    let { display, needMultiSelect, pageIndex, pageSize, showLoading } = this.state;

    return (
      <div className='DemoOrder-root'>

         <div  className={classnames({
            "table-header":true,
            "mt25":true,
            "show" : display === 'show',
            "hide" : display === 'hide'
          })} >
            <Button
              disabled={isDisabledFailedButton}
              style={{"marginLeft":24}}
              onClick={this.failureToResend}>
               失败重发
            </Button>
        </div>

        <PaginationTable
          needMultiSelect={needMultiSelect}
          data={info}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalPages={totalPages}
          total={total}
          columns={this.column}
          checkMinSize={6}
          getSelectedDataFunc={this.getSelectedDataFunc}
          onPageSizeSelect={this.onPageSizeSelect}
          onPageIndexSelect={this.onPageIndexSelect}
        />
        {/* <Loading show={showLoading} loadingType="line" /> */}

        <LogItemTables showLogItemsModal = {showLogItemsModal} opr_type = {this.props.opr_type}/>
      </div>
    )
  }
}
