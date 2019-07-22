import React,{Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

import {  Checkbox, FormControl, Input, Icon, Button, Label } from 'tinper-bee';
import {Table} from 'components/tinper-bee';

import "bee-pagination/build/Pagination.css"
import Pagination from 'bee-pagination';
import Form from 'bee-form'
const FormItem = Form.FormItem;


import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores => {
  return {
    comboxStore: stores.comboxStore,
    bakLogStore: stores.bakLogStore,
  }
})) @observer
class BaklogTable extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {

    };

    //分页props
    this.paginationInfo = {
      selectedRowIndex:{},      //选中数据
      dataCount:0,              //总数据数量
      activePage:1,             //当前页数
    }
  }


  // 只有修改prop的值触发该函数
  componentWillReceiveProps(nextProps) {
    // 当选中的节点进行改变的时候触发,从新请求副本实体信息和详情信息
    // this.getRequestTable()
  }

  // 组件即将挂载时触发
  componentDidMount() {
    // 第一次挂载请求数据请求参数都为空
    // this.props.bakEntityContentStore.getBaktableGrid();
  }

  // 获取请求的表数据
  getRequestTable() {
    this.props.bakLogStore.getBaklogGrid(id);
  }

  // 展开表头
  mapTableHeader(header) {
    const temparr = header.map((item) => {
      return {
          title: item.text,
          dataIndex: item.fieldId,
          key: item.fieldId,
          width: item.width,
        }
    })
    return temparr
  }

  // 展开表数据
  mapTableData(header, body) {
    let arr = []
    for(let i = 0; i < body.length; i++) {
      let json = {}
      header.forEach( row => {
        json[row.fieldId] = body[i][row.fieldId]
      })
      arr.push({
        ...json,
        key: json.mdm_code
      })
    }
    
    console.log('arr====', arr)
    return arr;
  }

  handleSelect(eventKey) {
		console.log(eventKey);
	    this.setState({
	      activePage: eventKey
	    });
  }
    
  // 渲染
  render() {
    // 引入的变量
    // 获取表头的数据
    // const bakTable = this.props.bakEntityContentStore.baktable;
    this.columns = this.mapTableHeader( [] || []);
    
    return (
      <div>
        <h1>展示</h1>
        {/* 展示表格 */}
        {/* <Table
          columns={columns}
          data={data}
          parentNodeId='parent'
          height={43}
          headerHeight={42}
          onRowClick={(record, index, indent) => {
            this.setState({
              selectedRowIndex: index
            });
          }}
        /> */}
        {/* 分页组件展示 */}
        {/* <Pagination
          first // 第一页
          last //最后一面
          prev // 前一页
          next // 下一页
          maxButtons={10} // 显示最多页数
          boundaryLinks //显示边界按钮
          // items={total/pageNumber+1}
          // activePage={this.state.activePage} //哪一页是激活状态
          onSelect={this.handleSelect.bind(this)} // 切换页的方法
          // onDataNumSelect={this.dataNumSelect} // 选择每页多少条的回调函数
          // showJump={true} // 是否显示跳页选择
          // total={total} // 一共多少条
          dataNum={1} // 下拉选择的设定值的index
        /> */}
      </div>
    )
  }
}

export default BaklogTable;
