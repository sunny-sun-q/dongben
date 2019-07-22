import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import { Icon, FormControl, Row, Col,  Button } from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import Form from 'bee-form';
import TableModal from '../../components/table-modal/index.js'
import dragColumn from "tinper-bee/lib/dragColumn";;;
const DragColumnTable = dragColumn(Table);

const FormItem = Form.FormItem;

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore,
  }
})) @observer
class MappingPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.ShowRefTableModal = this.ShowRefTableModal.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      refresh : 1,
      selectedIndex : -1,
    };
    this.defaultColumns= [
      {
        title: "接口实体明细字段",
        dataIndex: "showMapItemNameCode",
        key: "showMapItemNameCode",
        width: "50%"
      },
      {
        title: "主数据实体明细字段",
        dataIndex: "selectedMapItemNameCode",
        key: "selectedMapItemNameCode",
        width: "50%",
        render: (text, record, index) => {
          return(
            <FormItem className='input-field ref-tree-input'>
              <FormControl
                value={text}
                onKeyDown = { this.onKeyDown}
                onClick={()=> {this.setState({
                  selectedIndex : index
                })}}
                onBlur = {()=>{
                  this.setState({
                    selectedIndex : -1
                  })
                }}
              />
              <Icon type="uf-symlist ref-icon-btn" onClick={()=>this.ShowRefTableModal(index)} />
            </FormItem>
          )
        }
      },
    ];
  }

  ShowRefTableModal( index ) {
    // fullclassname, type, pk_gd, ref_boolbean
    // let fullclassname = 'com.yonyou.iuapmdm.modeling.mdmdesign.ref.MdmEntityFieldRefData'
    var entityStory = this.props.entityContentStore;
    // pk_gd 取得是 table的行中的ref_pkgd
    // 因为接口只会返回一行数据，所以取第一条的ref_pkgd
    // let pk_gd = entityStory.tempReference.treeref_pkgd;
    // 这里要记录选中数据的index用于会写到加载的数据中
    entityStory.mappingDatas.selectIndex = index;
    // entityStory.getEntityValue(fullclassname, 'grid', pk_gd, false);
    entityStory.setTableModal( false, true)
  }

  getTableData(){
    let refresh = this.state.refresh;
    this.setState({
      data : refresh + 1,
    })
  }

  onKeyDown = ( e ) => {
    if(e.keyCode === 8) {
      this.reset();
    }
  }
  reset = ()=> {

    const { selectedIndex } = this.state;
    if(selectedIndex === -1) return ;
      let entityStore = this.props.entityContentStore;
      let selectShowData = entityStore.mappingDatas.showMap[selectedIndex];

      selectShowData.selectedMapItemId = '';
      selectShowData.selectedMapItemName = '';
      selectShowData.selectedMapItemCode = '';
      selectShowData.selectedMapItemNameCode = '';
      selectShowData.selectedMapItemFieldType = '';

      // 替换原先的展示数据，并加入新的映射数据中
      Object.assign(entityStore.mappingDatas.showMap[selectedIndex], selectShowData)
      entityStore.mappingDatas.mappingMap.push(selectShowData);
      this.getTableData()
  }

  // 提交表单
  submit = (e) => {
    // 抑制提交事件
    e.preventDefault();
    // 获取要提交的数据
    var submitDatas = this.props.entityContentStore.mappingDatas.showMap;
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('校验失败', values);
      } else {
        this.props.entityContentStore.saveMapping(this.props.match.params.name, this.props.entityContentStore.tempReference.treeref_pkgd, submitDatas);
      }
    });
    // 保存数据给后台
  }

  render() {
    let self = this;
    let { showMap, selectedMap, mappingMap} = this.props.entityContentStore.mappingDatas;
    let showDatas = showMap;
    return (
      <div className='mapping-page'>
        <Table 
          columns={self.defaultColumns} 
          data={showDatas}
          // bordered
          // dragborder={true} 
          // draggable={true}
          scroll={{y: 550 }}
        />
        <TableModal className="tablefield" getData={()=>{this.getTableData()}}/>
      </div>
    )
  }
}

export default Form.createForm()(MappingPage);
