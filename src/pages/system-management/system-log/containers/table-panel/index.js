import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import classnames from 'classnames';
import './index.less'
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

@withRouter

//注入日志表存储store
@inject((stores) => {
  return {
    LogTable: stores.LogTable,
  }
}) @observer

// 日志表格组件
export default class TablePanel extends Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
      display: 'hide',
      showLoading: true,
      needMultiSelect: false,
      pageIndex: 1,
      pageSize: 10,
    }
    this.column = [
      {
        title: "主数据",
        dataIndex: "pk_gd_name",
        key: "pk_gd_name",
        width: 120,
      }, {
        title: "主子表",
        dataIndex: "pk_mdentity_name",
        key: "pk_mdentity_name",
        width: 120,
      },
      {
        title: "操作类型",
        dataIndex: "opertype",
        key: "opertype",
        width: 120,
      }, {
        title: "操作状态",
        dataIndex: "operstate",
        key: "operstate",
        width: 120,
      }, {
        title: "操作用户",
        dataIndex: "username",
        key: "username",
        width: 200,
      }, {
        title: "操作时间",
        dataIndex: "opertime",
        key: "opertime",
        width: 200,
      }, {
        title: "操作内容",
        dataIndex: "opercontent",
        key: "opercontent",
        width: 200,
      }
    ]
  }

  // 页面渲染完后加载数据动作
  async componentDidMount() {
    const { LogTable } = this.props

    let needMultiSelect = false, display = 'hide'
    await LogTable.getTables(10, 1)
    this.setState({
      display: display,
      needMultiSelect: needMultiSelect,
      showLoading: false,
      total: LogTable.table1.total,
      totalPages: LogTable.table1.totalPages
    })
  }


  // 分页单页数据条数选择函数
  onPageSizeSelect = (index, pageSize) => {
    let { LogTable } = this.props
    let { pageIndex } = this.state
    LogTable.getTables(pageSize, pageIndex)
    this.setState({
      pageSize: pageSize
    })
  }

  // 分页组件点击页面数字索引执行函数
  onPageIndexSelect = pageIndex => {
    let { LogTable } = this.props
    let { pageSize } = this.state

    LogTable.getTables(pageSize, pageIndex)
    this.setState({
      pageIndex: pageIndex
    })
  }

  render() {
    let { info } = this.props.LogTable.table1
    let { totalPages, total } = this.props.LogTable.table1
    let { display, needMultiSelect, pageIndex, pageSize, showLoading } = this.state;

    return (
      <div className='DemoOrder-root'>

        <div className={classnames({
          "table-header": true,
          "mt25": true,
          "show": display === 'show',
          "hide": display === 'hide'
        })} >
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
          onTableSelectedData={this.onTableSelectedData}
          onPageSizeSelect={this.onPageSizeSelect}
          onPageIndexSelect={this.onPageIndexSelect}
        />
      </div>
    )
  }
}