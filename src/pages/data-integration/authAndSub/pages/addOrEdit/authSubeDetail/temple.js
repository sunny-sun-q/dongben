import React from "react";
import { Error } from 'utils/index'
import PaginationTable from 'components/PaginationTable'
import { Row, Col, FormControl, Label, Checkbox, Input, Icon, Button, Tooltip, Animate, Message } from 'tinper-bee';
import Select from 'bee-select';
const Option = Select.Option;
import { toJS } from "mobx";
// import Table from 'bee-table';

import Form from 'bee-form'

const FormItem = Form.FormItem;

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
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    dataMaintainStore: stores.dataMaintainStore,
    comboxStore: stores.comboxStore
  }
}) @observer
class TemplateTable extends React.Component {
  constructor(props) {
    super(props);
    let self = this;
    this.state = {

      needMultiSelect: false,
      pageIndex: 1,
      pageSize: 99999,

      tatal: 1,
      pageCount: 1,
      selectIndex: 0,
    };

  }

  onCheckAll = (key) =>{
    return (value) => {
      debugger
      console.log("all_oneInfo-before", this.props.dataMaintainStore.table.oneInfo)
      const selectIndex = this.state.selectIndex

      let entityKey = "", entityItemsKey = "";
      if("readable" === key){
        entityKey = "entity_readableCount"
        entityItemsKey = "entityItems_readableCount"
      }else if("writeable" === key){
        entityKey = "entity_writeableCount"
        entityItemsKey = "entityItems_writeableCount"
      }else if("subscribe" === key){
        entityKey = "entity_subscribeCount"
        entityItemsKey = "entityItems_subscribeCount"
      }

      value = value ? 1 : 0

      let _oneInfo = Object.assign({}, this.props.dataMaintainStore.table.oneInfo)
      let _data = Object.assign({}, _oneInfo.sysAuths[selectIndex])

      _data[key] = value
      _data[entityItemsKey] = value === 0 ? 0 : _data.itemVOs.length

      let _itemVOs = _data.itemVOs;
      for(let i=0; i<_itemVOs.length; i++){
        _itemVOs[i][key] = value
      }

      _oneInfo.sysAuths[selectIndex] = _data

      let entityKeyValue = _oneInfo[entityKey]
      entityKeyValue = (value === 1) ? entityKeyValue + 1 : entityKeyValue - 1
      _oneInfo[entityKey] = entityKeyValue
      if(0 === entityKeyValue){
        _oneInfo[key] = 0
      }
      if(entityKeyValue === _oneInfo.sysAuths.length){
        _oneInfo[key] = 1
      }

      this.props.dataMaintainStore.table.oneInfo = _oneInfo
      console.log("all_oneInfo-after", this.props.dataMaintainStore.table.oneInfo)
    }
  }

  onCheckItemChange = (index, record, key) => {
    return (value) => {
      debugger
      const selectIndex = this.state.selectIndex
      let _oneInfo = Object.assign({}, this.props.dataMaintainStore.table.oneInfo)
      let _data = Object.assign({}, _oneInfo.sysAuths[selectIndex])

      if("readable" == key || "writeable" == key || "subscribe" == key){
        value = value ? 1 : 0

        let entityKey = "", entityItemsKey = "";
        if("readable" === key){
          entityKey = "entity_readableCount"
          entityItemsKey = "entityItems_readableCount"
        }else if("writeable" === key){
          entityKey = "entity_writeableCount"
          entityItemsKey = "entityItems_writeableCount"
        }else if("subscribe" === key){
          entityKey = "entity_subscribeCount"
          entityItemsKey = "entityItems_subscribeCount"
        }

        // 向上控制一层
        let entityItemsKeyValue = _data[entityItemsKey]
        entityItemsKeyValue = (value === 1) ? entityItemsKeyValue + 1 : entityItemsKeyValue - 1
        _data[entityItemsKey] = entityItemsKeyValue

        if(0 === entityItemsKeyValue){
          _data[key] = 0

          _oneInfo[entityKey] = _oneInfo[entityKey] - 1
          if( 0 === _oneInfo[entityKey]){
            _oneInfo[key] = 0
          }
        } else {
          if(0 === _data[key]){
            _oneInfo[entityKey] = _oneInfo[entityKey] + 1
            _oneInfo[key] = 1
          }
          _data[key] = 1
        }
        console.log("selectIndex:::" + selectIndex + "::数量::" , entityItemsKeyValue)
      }

      let _itemVOs= _data.itemVOs
      _itemVOs[index][key] = value
      _data.itemVOs = _itemVOs

      _oneInfo.sysAuths[selectIndex] = _data
      this.props.dataMaintainStore.table.oneInfo = _oneInfo

      console.log("select_items_oneInfo", this.props.dataMaintainStore.table.oneInfo)
    };
  }

  componentDidMount() {
    this.setState({
      selectIndex: this.props.selectIndex
    })

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectIndex !== this.props.selectIndex){
      this.setState({
        selectIndex: nextProps.selectIndex
      })
    }
  }

  render() {
    let { writeableDisabled, readableDisabled, subscribeDisabled } = this.props.dataMaintainStore.table.oneInfo
    console.log("writeableDisabled", writeableDisabled)
    console.log("readableDisabled", readableDisabled)
    console.log("subscribeDisabled", subscribeDisabled)

    let { needMultiSelect, pageIndex, pageSize, total, pageCount } = this.state
    let data = this.props.dataMaintainStore.table.oneInfo.sysAuths[this.state.selectIndex] || {}

    this.columns = [
      {
        title: "字段编码",
        dataIndex: "code",
        key: "code"
      },
      {
        title: "字段名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: <div><Checkbox
                  checked={data.writeable}
                  className="checked-table"
                  disabled={writeableDisabled}
                  onChange={this.onCheckAll("writeable")}
                />可写
                </div>,
        dataIndex: "writeable",
        key: "writeable",
        render: (text, record, index) => {
          return (
            <Checkbox
              className="checked-table"
              checked={record.writeable}
              disabled={writeableDisabled}
              onChange={this.onCheckItemChange(index, record, "writeable")}
            />
          );
        }
      },
      {
        title: <div><Checkbox // 表头在constractor方法,如果想改变值,可以给其默认值,不能设置checked,否则表头不再刷新
                  checked={data.readable}
                  className="checked-table"
                  disabled={readableDisabled}
                  onChange={this.onCheckAll("readable")}
                />可读
                </div>,
        dataIndex: "readable",
        key: "readable",
        render: (text, record, index) => {
          return (
            <Checkbox
              className="checked-table"
              checked={record.readable}
              disabled={readableDisabled}
              onChange={this.onCheckItemChange(index, record, "readable")}
            />
          )
        }
      },
      {
        title: <div><Checkbox
                className="checked-table"
                checked={data.subscribe}
                disabled={subscribeDisabled}
                onChange={this.onCheckAll("subscribe")}
              />可订阅
              </div>,
        dataIndex: "subscribe",
        key: "subscribe",
        render: (text, record, index) => {
          return (
            <Checkbox
              className="checked-table"
              checked={record.subscribe}
              disabled={subscribeDisabled}
              onChange={this.onCheckItemChange(index, record, "subscribe")}
            />
          );
        }
      }
    ];

    return (
      <div className="main-table main-table-wrap">
        <div className="main-data-form">
          <PaginationTable
            needMultiSelect={needMultiSelect}
            columns={this.columns}
            data={data.itemVOs}

            pageIndex={pageIndex}
            pageSize={pageSize}
            totalPages={pageCount}
            total={total}

            maxPageCount={99999}
            checkMinSize={6}
          // getSelectedDataFunc={this.getSelectedDataFunc}
          // onPageSizeSelect={this.onPageSizeSelect}
          // onPageIndexSelect={this.onPageIndexSelect}
          />
        </div>
      </div >
    );
  }
}

export default Form.createForm()(TemplateTable)
