/**
 *
 * @title 表格+分页
 * @description 点击分页联动表格
 */

import React, { Component } from "react";

import { Table, Checkbox } from 'tinper-bee';
import multiSelect from "tinper-bee/lib/multiSelect.js";
/////start  引入单独的组件////////
import "bee-pagination/build/Pagination.css"
import Pagination from 'bee-pagination';
/////end////////


import {
  inject,
  observer
} from 'mobx-react';


const columns = [
  {
    title: "远程系统名称",  // 列的标题
    dataIndex: "name",  // 显示数据记录的字段
    key: "name"  // 列的键
  },
  {
    id: "123",
    title: "远程系统编码",
    dataIndex: "code",
    key: "code"
  },
  { title: "成功收件人邮箱",
    dataIndex: "suc_email_receiver",
    key: "suc_email_receiver"
  },
  {
    title: "失败收件人邮箱",
    dataIndex: "fai_email_receiver",
    key: "fai_email_receiver"
  },
  {
    title: "分发url",
    dataIndex: "distribute_url",
    key: "distribute_url"
  },
  {
    title: "备注",
    dataIndex: "description",
    key: "description",
    width: '400px'
  },
  {
    title: "认证令牌",
    dataIndex: "token",
    key: "token"
  }
];

const pageData = { };

//拼接成复杂功能的table组件不能在render中定义，需要像此例子声明在组件的外侧，不然操作state会导致功能出现异常
const MultiSelectTable = multiSelect(Table, Checkbox);

// start //
@inject((stores) => {
  return {
    taskTablesStore: stores.taskTablesStore
  }
}) @observer
// end //


class EditTableMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: pageData[1],
      activePage: 1,
      pageNumber: 10

    };
    this.handleSelect = this.handleSelect.bind(this)
    this.list = []
  }

  componentDidMount() {
    console.log(this.props.taskTablesStore)
    console.log('Component DID MOUNT!');
  }

  componentWillMount() {
    console.log('Component WILL MOUNT!');
    this.props.taskTablesStore.getTables(10, 1)
  }

  handleSelect(eventKey) {
    eventKey = parseInt(eventKey)
    this.setState({
      data: pageData[eventKey],
      activePage: eventKey
    });
    const {
      pageNumber
    } = this.state
    this.props.taskTablesStore.getTables(pageNumber, eventKey)
  }

  getSelectedDataFunc = data => {// data 是选择的所有行数据数组
    this.props.taskTablesStore.setTableChooseItem(data);
  };

  dataNumSelect = (index,value) =>{// => 函数自带绑定
    console.log(index + "----"  + value);
    const { activePage } = this.state
    if (activePage*parseInt(value) > this.props.taskTablesStore.table.total) {
      this.setState({
        activePage: 1
      })
      this.props.taskTablesStore.getTables(parseInt(value), 1)
      return
    }
    console.log('activePage', activePage)
    this.setState({
      pageNumber: parseInt(value)
    })

    this.props.taskTablesStore.getTables(parseInt(value), activePage)
    console.log(index,value);
  }

  render() {
    let multiObj = {
      type: "checkbox"
    };

    const {info, total} = this.props.taskTablesStore.table
    
    const {
      pageNumber
    } = this.state
  
    let _info = [];
    info.forEach((item) => {
      _info.push({...item, 
          key: item.pk_sysregister
        })
    }); 
  
    console.log("----info-",_info) 

    return (
      <div>
        <MultiSelectTable
          columns={columns}
          data={_info}
          multiSelect={multiObj}
          getSelectedDataFunc={this.getSelectedDataFunc}
        />
        <Pagination
          first // 第一页
          last //最后一面
          prev // 前一页
          next // 下一页
          maxButtons={5} // 显示最多页数
          boundaryLinks //显示边界按钮
          items={total%pageNumber === 0 ? total/pageNumber : total/pageNumber+1}   // 总页数
          activePage={this.state.activePage} //哪一页是激活状态
          onSelect={this.handleSelect} // 切换页的方法
          onDataNumSelect={this.dataNumSelect} // 选择每页多少条的回调函数
          showJump={true} // 是否显示跳页选择
          total={total} // 一共多少条
          dataNum={1} // 下拉选择的设定值的index
        />
      </div>
    );
  }
}


export default EditTableMain
