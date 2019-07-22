import React, { Component } from 'react';
import PaginationTable from 'components/PaginationTable'
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

import { Tooltip, Label } from 'tinper-bee';
import {Button} from 'components/tinper-bee';

import "bee-pagination/build/Pagination.css"
import { Warning, Error } from 'utils/index'
import Combox from 'components/combox/index.js';
import SeniorSearch from 'components/SeniorSearch';

import Form from 'bee-form';
const FormItem = Form.FormItem;

import { toJS } from "mobx";

const size = 'lg';

import 'bee-table/build/Table.css';
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores => {
  return {
    treeStore: stores.treeStore,
    distributeStore: stores.distributeStore,
    comboxStore: stores.comboxStore,
    seniorSearchStore: stores.seniorSearchStore
  }
})) @observer
class EditTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      nodeId: '',

      sql: '',         // 高级过滤查询条件
      selectDatas: [],  // 列表选中的数据

      isQueryDisable: false, // TODO 控制过滤按钮没起作用
      isAdvQueryDisable: false,
      isDisable: false,

      needMultiSelect: true,
      pageIndex: 1,
      pageSize: 10
    }

  }

  reset = (nodeId) => {
    this.setState({
      nodeId: nodeId ? nodeId : this.state.nodeId,

      sql: '',         // 高级过滤查询条件
      selectDatas: [],  // 列表选中的数据

      isQueryDisable: false, // TODO 控制过滤按钮没起作用
      isAdvQueryDisable: false,
      isDisable: false,

      needMultiSelect: true,
      pageIndex: 1,
      pageSize: 10
    })

  }

  // 重置功能
  clearTableBody = async() => {
    await this.reset()
    await this.filterTable("")
  }

  // 高级查询过滤
  filterTable = (sql) => {
    let pk_sysregister = this.props.comboxStore.selectedItem.value
    let { nodeId, pageIndex, pageSize } = this.state

    this.props.distributeStore.getDistributeData(pk_sysregister, nodeId, sql, pageIndex, pageSize)

    this.setState({
      sql: sql
    })
  }

  queryDistriData = () => {
    if (!this.props.comboxStore.selectedItem.value) {
      Warning('请选择集成系统')
      return
    }
    let pk_sysregister = this.props.comboxStore.selectedItem.value
    let { nodeId, sql, pageIndex, pageSize } = this.state
    this.props.distributeStore.getDistributeData(pk_sysregister, nodeId, sql, pageIndex, pageSize);
  }

  distributeData = () => {
    const { selectDatas } = this.state
    if (selectDatas.length === 0) {
      Warning('请选择要分发的数据')
      return
    }

    let entity = {
      masterData: JSON.stringify(selectDatas),
      systemCode: this.props.comboxStore.selectedItem.value,
      mdType: this.props.match.params.id,
      treeType: "1",
      action: "DISTRIBUTE_MANUL",
    }
    this.props.distributeStore.distributeMD(entity)
  }

  componentWillReceiveProps(nextProps) {
    let nodeId = nextProps.match.params.id
    if (nodeId && nodeId !== this.props.match.params.id) {
      let table={ header:[], body:[], total:0, pageCount:1 }

      this.props.distributeStore.distribute.table = table
      this.reset(nodeId)
      this.props.distributeStore.getHeaderByNodeID(nodeId)

      const { state } = this.props.treeStore.nodeLeaf.info
      if (state == 0) {
        Error("主数据未启用")
        this.setState({
          isDisabled: true
        })
        return
      } else if (state == 2) {
        Error("主数据已停用")
        this.setState({
          isDisabled: true
        })
        return
      } else {
        this.setState({
          isDisabled: false
        })
      }
    }
  }

  componentDidMount() {
    let nodeId = this.props.match.params.id;
    this.props.distributeStore.getHeaderByNodeID(nodeId)
    this.setState({
      nodeId: nodeId
    })
  }

  getSelectedDataFunc = (selectedList,record,index) => {
    let body = this.props.distributeStore.distribute.table.body
    this.setState({
      selectDatas: selectedList
    })

    // 如果在回调中增加setState逻辑，需要同步data中的_checked属性。即下面的代码
    const allChecked = selectedList.length == 0 ? false : true;
    //record为undefind则为全选或者全不选
    if(!record){
      body.forEach(item=>{
        if(! item._disabled){
          item._checked = allChecked;
        }
      })
    }else{
      body[index]['_checked'] = record._checked;
    }

  };

  onPageSizeSelect = (index, pageSize) => {
    let { nodeId, sql, pageIndex } = this.state
    let pk_sysregister = this.props.comboxStore.selectedItem.value
    this.props.distributeStore.getDistributeData(pk_sysregister, nodeId, sql, pageIndex, pageSize);
    this.setState({
      pageSize: pageSize
    })
  }

  onPageIndexSelect = pageIndex => {
    let { nodeId, sql, pageSize } = this.state
    let pk_sysregister = this.props.comboxStore.selectedItem.value
    this.props.distributeStore.getDistributeData(pk_sysregister, nodeId, sql, pageIndex, pageSize);
    this.setState({
      pageIndex: pageIndex
    })
  }

  render() {
    const { header, body, total, pageCount } = this.props.distributeStore.distribute.table
    const { needMultiSelect, pageIndex, pageSize, isDisable, isQueryDisable, isAdvQueryDisable } = this.state
    const { id, pid } = this.props.treeStore.nodeLeaf.info

    let columns = toJS(header)

    return (
      <div className='data-distribution-containers'>
        <div className="data-distribution-header-oper">
        <FormItem className='sys-os'>
          <Label>集成系统：</Label>
          <Combox
            fullclassname={"com.yonyou.iuapmdm.remotesysreg.web.SysregisterCombo"}
            disabled={false}
            className="distribute-select-sys"
          />
        </FormItem>
        <Button shape="border" disabled={isQueryDisable}  onClick={this.queryDistriData}>
            查询
        </Button>
        </div>
        <div className="data-distribution-info">
        <div>
        <SeniorSearch
          className="thirdlevel-btn"
          title={"高级查询"}
          pk_gd={id}
          pk_category={''}
          getData={(sql) => this.filterTable(sql)}
          // disabled={isDisable}
          disabled={isAdvQueryDisable}
          size="md"
          needEscape= { true }
          appendType = { false }
          bordered
        />
        <Button  shape="border" style={{marginLeft:'20px'}}
            icon="download"  disabled={isDisable}
            onClick={this.clearTableBody}>
          重置
        </Button>
        <Button  disabled={isDisable}  className="data-distribution-btn" onClick={this.distributeData}>
          分发
        </Button>
        </div>

        <PaginationTable
          columns={columns}
          data={body}

          needMultiSelect={needMultiSelect}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalPages={pageCount}
          total={total}

          checkMinSize={6}
          getSelectedDataFunc={this.getSelectedDataFunc}
          onPageSizeSelect={this.onPageSizeSelect}
          onPageIndexSelect={this.onPageIndexSelect}
        />
        </div>


      </div>
    )
  }
}

export default EditTable;
