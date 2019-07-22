import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
// import {BpmButtonSubmit,BpmButtonRecall} from 'yyuap-bpm';
import { Tooltip, Button, Message, Modal, Loading } from 'tinper-bee';
import Select from 'bee-select';
// import moment from "moment/moment";
// import DataMaintenanceForm from '../DataMaintenance-form';
// import SeniorSearch from 'components/SeniorSearch';
// import AcExport from '../DemoOrder-export';
// import AcUpload from 'ac-upload';
// import 'ac-upload/build/ac-upload.css';
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
// import { DEFAULT_ECDH_CURVE } from 'tls';
@withRouter
////////*************** */

@inject((stores) => {
  return {
    logTablesStore: stores.logTablesStore,
  }
}) @observer
export default class LogItemTables extends Component {
  constructor(props) {
    super(props);
    // let self = this;
    this.state = {
      needMultiSelect: false,
      pageIndex: 1,
      pageSize: 10,
    }
  }

  column = [
    {
      title: "业务id",
      dataIndex: "busi_id",
      key: "busi_id",
      width: 70,
    },{
      title: "MDMCODE",
      dataIndex: "mdm_code",
      key: "mdm_code",
      width: 150,
    },{
      title: "操作状态",
      dataIndex: "operationstate",
      key: "operationstate",
      width: 90,
    },{
      title: "错误类型",
      dataIndex: "errorstate",
      key: "errorstate",
      width: 130,
    },{
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      width: 300,
    }

  ]

  componentDidMount() {
    // await this.props.logTablesStore.getItemsByOneRecord(10, 1)
  }

  // 分页单页数据条数选择函数
  onPageSizeSelect = (index, pageSize) => {

    let {pageIndex} = this.state
    let { logTablesStore } = this.props
    logTablesStore.getItemsByOneRecord(pageSize, pageIndex)
    this.setState({
      pageSize: pageSize
    })
  }

  // 分页组件点击页面数字索引执行函数
  onPageIndexSelect = pageIndex => {

    let { pageSize } = this.state
    let { logTablesStore } =  this.props
    logTablesStore.getItemsByOneRecord(pageSize, pageIndex)
    this.setState({
      pageIndex: pageIndex
    })
  }

  close = () => {
    if(this.props.opr_type === 1){
      this.props.logTablesStore.tableitem1.showLogItemsModal = false
    }
    if(this.props.opr_type === 2){
      this.props.logTablesStore.tableitem2.showLogItemsModal = false
    }

    this.setState({
      showLogItemsModal: false
    })
  }

  render() {
    const { info } = this.props.opr_type === 1 ? this.props.logTablesStore.tableitem1 : this.props.logTablesStore.tableitem2

    let { showLogItemsModal } = this.props;
    let { needMultiSelect, pageIndex, pageSize } = this.state
    let { totalPages, total } =  this.props.opr_type === 1 ? this.props.logTablesStore.tableitem1 : this.props.logTablesStore.tableitem2
    return (
      <div className='DemoOrder-root'>
        <Modal
          width={821}
          show={showLogItemsModal}
          onHide={this.close} >
          <Modal.Header closeButton>
            <Modal.Title>详情</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <PaginationTable
              needMultiSelect={needMultiSelect}
              data={info}   //
              pageIndex={pageIndex} //
              pageSize={pageSize} //
              totalPages={totalPages} //
              total={total} //
              columns={this.column} //
              checkMinSize={6} //
              // getSelectedDataFunc={this.tabelSelect} //
              // onTableSelectedData={this.onTableSelectedData} //
              onPageSizeSelect={this.onPageSizeSelect} //
              onPageIndexSelect={this.onPageIndexSelect} //
            />
          </Modal.Body>

          <Modal.Footer>
            {/* <Button onClick={() => this.close()} shape="border" style={{ marginRight: 50 }}>关闭</Button> */}
          </Modal.Footer>
        </Modal>
      </div>

    )
  }
}
