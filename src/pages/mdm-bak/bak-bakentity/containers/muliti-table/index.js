import React,{Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

import { Table, Checkbox, FormControl, Input, Icon, Button, Label } from 'tinper-bee';
import Select from 'bee-select';
import renderInput from "tinper-bee/lib/InputRender.js";;
import renderSelect from "tinper-bee/lib/SelectRender.js";;
const InputRender = renderInput(Form, Input, Icon);
const SelectRender = renderSelect(Select, Icon);
import multiSelect from "bee-table/build/lib/multiSelect.js";

import "bee-pagination/build/Pagination.css"
import Pagination from 'bee-pagination';
import Form from 'bee-form'
const FormItem = Form.FormItem;


// 就是将选择框和表进行合并
let MultiSelectTable  = multiSelect(Table, Checkbox);

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores => {
  return {
    treeStore: stores.treeStore,
    comboxStore: stores.comboxStore,
    bakEntityContentStore: stores.bakEntityContentStore,
  }
})) @observer
class EditTable extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectData: [],     //选中数据
      selectDataCount: 1, //选中数据数量
      dataCount:0,        //总数据数量
      currentPage:0,      //当前页数
      type:'',            //类型,新增/更改/删除
    };
  }

  // 过滤数据
  fliterData(isSelectAll){
    alert("clicked:" + isSelectAll);
  }

  // 清空表体
  clearTableBody(){
    this.getRequestTable()
    this.dataSource = [{}]
  }

  // 只有修改prop的值触发该函数
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id && nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({
        id: nextProps.match.params.id
      })
      // 当选中的节点进行改变的时候触发,从新请求副本实体信息和详情信息
      this.getRequestTable(nextProps.match.params.id)
    }
  }

  // 组件即将挂载时触发
  componentDidMount() {
    this.props.bakEntityContentStore.getBaktableGrid();
  }

  // 获取请求的表数据
  getRequestTable(id) {
    let gdCode = id || this.props.match.params.id;
    this.props.bakEntityContentStore.getTableRequest(id);
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

  // 获取选中的表数据
  getSelectedDataFunc = data => {
    console.log('===',data);
    this.setState({
      selectData: data
    })
  };

  // 渲染
  render() {
    // 引入的变量
    const { getFieldProps, getFieldError } = this.props.form;
    // 获取表头的数据
    const bakTable = this.props.bakEntityContentStore.baktable;
    this.columns = this.mapTableHeader( bakTable.headGrid || []);
    
    // 分别展开表头和表体
    const entityInfo = bakTable.bakTableInfo.entity;

    return (
      <div>
        <div className="main-data-form">
          {/* 表的实体信息 */}
          {/* <FormItem className="form-data-node">
            <Label>所属远程系统名称：</Label>
            <span>
              {entityInfo.pk_sysregister ? this.props.treeStore.nodeLeaf.info.name : '' }
            </span>
          </FormItem> */}
          <FormItem className="form-item-input">
            <Label>编码<span className="require-icon">*</span>：</Label>
            <FormControl placeholder=''
              disabled={this.state.type == ''}
              {...getFieldProps('code', {
                validateTrigger: 'onBlur',
                initialValue: entityInfo.code || '',
                rules: [{
                  required: true, message: '请输入编码'
                },{
                  pattern: /^[a-zA-Z]\w*$/, message: '编码只能以字母开头，可以由字母数字下划线组成',
                }]
            }) } />
            <span className='error'>
              {getFieldError('code')}
            </span>
          </FormItem>
          <FormItem className="form-item-input">
            <Label>名称<span className="require-icon">*</span>：</Label>
            <FormControl placeholder=''
              disabled={this.state.type == ''}
              {...getFieldProps('name', {
                validateTrigger: 'onBlur',
                initialValue: entityInfo.name || '',
                rules: [{
                  required: true, message: '请输入名称'
                }]
            }) } />
            <span className='error'>
                {getFieldError('name')}
            </span>
          </FormItem>
          <FormItem className="form-item-input">
            <Label>副本实体名称<span className="require-icon">*</span>：</Label>
            <FormControl placeholder=''
              disabled={true}
              {...getFieldProps('tablename', {
                validateTrigger: 'onBlur',
                initialValue: entityInfo.tablename || '',
                rules: [{
                  required: true, message: '请输入副本表名称'
                }]
            }) } />
            <span className='error'>
                {getFieldError('tablename')}
            </span>
          </FormItem>
        </div>
        {/* 多选的的表展示 */}
        {
          this.columns.length !== 0 ? (
            <MultiSelectTable
              data={bakTable.bakTableInfo.entity_items}
              columns={this.columns}
              getSelectedDataFunc={this.getSelectedDataFunc}
            />
          ) : null
        }

        {/* 分页组件展示 */}
        <Pagination
          first // 第一页
          last //最后一面
          prev // 前一页
          next // 下一页
          maxButtons={10} // 显示最多页数
          boundaryLinks //显示边界按钮
          // items={total/pageNumber+1}
          // activePage={this.state.activePage} //哪一页是激活状态
          // onSelect={this.handleSelect} // 切换页的方法
          // onDataNumSelect={this.dataNumSelect} // 选择每页多少条的回调函数
          // showJump={true} // 是否显示跳页选择
          // total={total} // 一共多少条
          dataNum={1} // 下拉选择的设定值的index
        />
      </div>
    )
  }
}

export default Form.createForm()(EditTable);
