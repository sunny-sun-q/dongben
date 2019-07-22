import React, { Component } from 'react';
import PaginationTable from 'components/PaginationTable'

import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores) => {
  return {
    cusinfo: stores.cusinfo
  }
}) @observer
class PortraitureList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      needMultiSelect: false,
      pageIndex: 1,
      pageSize: 10
    };
  }

  // 处理并展示数据
  showListByResult = () => {
    
  }
  
  async componentDidMount(){

    let { pageIndex, pageSize } = this.state
    let { code, corpName } = this.props
    await this.props.cusinfo.getTables(code, corpName)
  }
  
  async componentWillReceiveProps(nextProps,nextState){

    if(nextProps.code !== this.props.code ){
      await this.props.cusinfo.getTables(nextProps.code, nextProps.corpName)
    }
  }

  getSelectedDataFunc = (data) => { }

  // 表格勾选回调函数，返回选中数据
  onTableSelectedData = data => {  }

  // 分页单页数据条数选择函数
  onPageSizeSelect = (index, pageSize) => {
    let { code, corpName } = this.props
    this.setState({
      pageSize : pageSize,
    })
    this.props.cusinfo.tables.pageSize = pageSize
    this.props.cusinfo.getTables(code, corpName)
  }

  // 分页组件点击页面数字索引执行函数
  onPageIndexSelect = pageIndex => {

    let { code, corpName } = this.props
    this.setState({
      pageIndex : pageIndex
    })
    this.props.cusinfo.tables.pageIndex = pageIndex
    this.props.cusinfo.getTables(code, corpName)
  }

  render() {
    let { datas, totalPages, total, _columnss } = this.props.cusinfo.tables
    let { needMultiSelect, pageIndex, pageSize } = this.state

    return (
      <div>
        <PaginationTable
          needMultiSelect={needMultiSelect}
          data={datas}  
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalPages={totalPages}
          total={total}
          columns={_columnss}
          checkMinSize={6}
          scroll={{y: '350px' }}
          showJump={false}//是否显示跳页选择
          maxButtons={3}
          onPageSizeSelect={this.onPageSizeSelect}
          onPageIndexSelect={this.onPageIndexSelect}
        />
      </div>
    )
  }
}
export default PortraitureList;
