import React from "react";
import { Error } from 'utils/index'
import { FormControl, Label, Checkbox, Input, Icon,  Tooltip, Animate ,Message} from 'tinper-bee';
import {Table,Popconfirm} from 'components/tinper-bee';
import Select from 'bee-select';
const Option = Select.Option;
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import {Button} from 'components/tinper-bee';
import FieldtypeModal from '../fieldtype-modal'
import SelectDownModal from '../select-down-modal'
import EnumModal from '../enum-modal'
import NCModal from '../nc-modal'
import ValidateModal from '../../components/validate-modal'
// import EditTable from '../main-table'

import Form from 'bee-form'

const FormItem = Form.FormItem;

import { checkFieldLength } from 'utils'

import renderInput from "tinper-bee/lib/InputRender.js";
import renderSelect from "tinper-bee/lib/SelectRender.js";
import './index.less'
const InputRender = renderInput(Form, Input, Icon);
const SelectRender = renderSelect(Select, Icon);
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
import { success } from "utils/index";
import { debug, checkFieldType } from "utils";

// 这些类型的长度固定
let typeList = ['3', '5', '6', '9', '10', '12', '13']

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore,
    comboxStore: stores.comboxStore
  }
})
@observer
class EditTableMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      entity_items: {},
      count: 0,
      key: -1,
      ifEditStatus: true,
      hoverCell: -1, // 划过的item
      entity_items: {},
      mulSelectItem: [],
      record:{},
      contentStr: ''
    };
    this.saveMainTable = this.saveMainTable.bind(this)
    this.delTableCell = this.delTableCell.bind(this)
    this.popClick = this.popClick.bind(this)
    this.ncColumns = [
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0047", defaultMessage:"源编码"}),
        dataIndex: "ob_code",
        key: "ob_code",
        width: 150,
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0048", defaultMessage:"源显示名称"}),
        dataIndex: "ob_column",
        key: "ob_column",
        width: 150,
        render: (text, record, index) => this.renderNCColumns(text, record, index)
      },
    ]
    this.columns = [
      {
        title: <div><span style={{color: 'red',padding: '0px 5px 0px 0px'}}>*</span>{  this.props.intl.formatMessage({id:"js.rou.cus1.0004", defaultMessage:"字段编码"})}</div>,
        dataIndex: "code",
        key: "code",
        width: 150,
        render: (text, record, index) => this.renderColumns(text, record, index)
      },
      {
        title: <div><span style={{color: 'red',padding: '0px 5px 0px 0px'}}>*</span>{ this.props.intl.formatMessage({id:"js.rou.cus1.0005", defaultMessage:"字段名称"})}</div>,
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (text, record, index) => {
          return index === this.state.key ? (
            <FormControl
            value={text}
            onChange={this.onCellChange(index, "name")}
          />
          ) : (text ||'')
        }

      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0020", defaultMessage:"类型"}),
        dataIndex: "fieldtype_name",
        key: "fieldtype_name",
        width: 140,
        render: (text, record, index) => this.renderColumnsSelect(text, record, index)
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0021", defaultMessage:"长度"}),
        dataIndex: "fieldlength",
        key: "fieldlength",
        width: 70,
        render: (text, record, index) => this.renderColumnsText(text, record, index)
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0022", defaultMessage:"必输项"}),
        dataIndex: "required",
        key: "required",
        width: 70,
        render: (text, record, index) => {
          return (
            <Checkbox
              disabled={ !(index === this.state.key) }
              checked={record.required}
              onChange={(!this.state.ifEditStatus && index === this.state.key) ? this.onCheckChange(index, "required") : null}
            />
          )
        }
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0023", defaultMessage:"是否唯一"}),
        dataIndex: "isunique",
        key: "isunique",
        width: 70,
        render: (text, record, index) => {
          return (
            <Checkbox
              disabled={ !(index === this.state.key) }
              checked={record.isunique}
              onChange={(!this.state.ifEditStatus && index === this.state.key) ? this.onCheckChange(index, "isunique") : null}
            />
          );
        }
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0024", defaultMessage:"查询条件"}),
        dataIndex: "queryatt",
        key: "queryatt",
        width: 70,
        render: (text, record, index) => {
          return (
            <Checkbox
              disabled={ !(index === this.state.key) }
              checked={record.queryatt}
              onChange={(!this.state.ifEditStatus && index === this.state.key) ? this.onCheckChange(index, "queryatt") : null}
            />
          );
        }
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0025", defaultMessage:"默认值"}),
        dataIndex: "defaultvalue",
        key: "defaultvalue",
        width: 70,
        render: (text, record, index) => {
          let fieldtype = parseInt(record.fieldtype);
          let editFlag = fieldtype === 1 || fieldtype === 3 || fieldtype === 4 || fieldtype === 2;
          return index === this.state.key &&  editFlag? (
            <FormControl
              value={text}
              onChange={this.onCellChange(index, "defaultvalue")}
            />
          ) : (text||'')
        }
      },
      {
        title: "",
        dataIndex: "done",
        key: "done",
        width: 210,
        fixed: "right",
        render: (text, record, index) => {
          const { state } = this.props.treeStore.nodeLeaf.info;
            return (index !== this.state.key) ? (
              // <ul className={`display-flex handle-btn-group`}>
              <ul className={`display-flex handle-btn-group ${state === 1 || (this.state.key > -1 && index !== this.state.key) ? "disabled-oper":""}`}>
                <li onClick={state === 1 || (this.state.key > -1 && index !== this.state.key) ? null : () => {
                  this.editItemClick(text, record, index) }}>
                  <FormattedMessage id="js.rou.cus1.0026" defaultMessage="编辑" />
                </li>
                {
                  state === 1 || (this.state.key > -1 && index !== this.state.key) ? (
                    <li>
                      <FormattedMessage id="js.rou.cus1.0027" defaultMessage="删除" />
                    </li>
                  ) : (
                    <Popconfirm  onClick={() =>{this.popClick(text, record, index)}} onClose={() => {this.onDelete(text, record, index) }} trigger="click" rootClose placement="right" content={this.state.contentStr} >
                      <li >
                        <FormattedMessage id="js.rou.cus1.0027" defaultMessage="删除" />
                      </li>
                      </Popconfirm>
                  )
                }

                <li onClick={
                  state === 1 || (this.state.key > -1 && index !== this.state.key) ? null : () => {this.moveup(text, record, index) }
                }>
                  <FormattedMessage id="js.rou.cus1.0028" defaultMessage="上移" />
                </li>
                <li onClick={
                  state === 1 || (this.state.key > -1 && index !== this.state.key) ? null : () => {this.movedown(text, record, index) }
                }>
                  <FormattedMessage id="js.rou.cus1.0029" defaultMessage="下移" />
                </li>
                <li onClick={
                  state === 1 || (this.state.key > -1 && index !== this.state.key) ? null : () => {this.validateRules(text, record, index) }
                }>
                  <FormattedMessage id="js.rou.cus1.0030" defaultMessage="校验规则" />
                </li>
              </ul>
            ) : (
              <ul className="display-flex">
                <li onClick={() => {
                  this.cancel(text, record, index) }}>
                  <FormattedMessage id="js.rou.cus1.0008" defaultMessage="取消" />
                </li>
                <li onClick={() => {
                  this.ok(text, record, index) }}>
                  <FormattedMessage id="js.rou.cus1.0031" defaultMessage="确定" />
                </li>
              </ul>
            )
          }
        // }
      }
    ];

  }

  delItems = []; //行删除缓存数组

  editItemCache = {}; //行编辑缓存对象

  renderColumns = (text, record, index) => {
    const { state } = this.props.treeStore.nodeLeaf.info;
    // console.log('record.focusInput', record.focusInput)
    return index === this.state.key ? (
      <FormControl
        disabled={ record.pk_entityitem && state === 2 }
        value={text}
        onChange={this.onCellChange(index, "code")}
        autoFocus
      />
    ) : (text ||'')
  }


  renderNCColumns = (text, record, index) => {
    return index === this.state.key ? (
<div className="u-select u-select-enabled" onClick={() =>{this.showNCModal(index,record)}}>
    <div className="u-select-selection
            u-select-selection--single" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-expanded="false" tabindex="0">
        <div className="u-select-selection-rendered">
            <div className="u-select-selection-selected-value" title={text} >{text}</div>
        </div><span className="u-select-arrow" unselectable="on" ><i className="u-select-arrow-icon"></i></span>
    </div>
</div>
    ) : (text ||'')
  }

  showNCModal = (index,record) =>{
    // let pk_obinfo = record.pk_obinfo;
    let pk_obinfo = this.props.entityContentStore.table.mainTableInfo.entity_items.pk_obinfo;
    // let pk_obid = record.pk_obid;
    let pk_obid = this.props.entityContentStore.table.mainTableInfo.entity_items.pk_obid;
    this.props.entityContentStore.setNCIndex(index,record)
    this.props.entityContentStore.setNCModal(true)
    this.props.entityContentStore.findNCAllData(pk_obinfo,pk_obid)
  }

  // 渲染文本框
  renderColumnsText = (text, record, index) => {
    const { fieldLengthMap } = this.props.entityContentStore.table;
    const { getFieldProps } = this.props.form;
    let fieldtype = record.fieldtype;
    // console.log('fieldtype in typeList')
    return index === this.state.key && !(typeList.includes(String(fieldtype)))? (
      <FormControl
        // value={text}
        // onChange={this.onCellChange(index, "fieldlength")}
        style={{
          width: '60px'
        }}
        {...getFieldProps('fieldlength', {
          initialValue: record.fieldlength || '',
          onChange: this.onCellChange(index, "fieldlength"),
          getValueProps: (value) =>{
            return {
              value: record.fieldlength
            }
          },
        }) }
      />
    ) : (record.fieldlength || '')
  }

  // 渲染下拉框
  renderColumnsSelect = (text, record, index) => {

    let { selectDataSource } = this.props.comboxStore;
    const { state } = this.props.treeStore.nodeLeaf.info;
    const { id } = this.props.match.params;
    let _options = [];
    {selectDataSource?
      selectDataSource.map((option,index) => (
          _options.push(<Option value={option.text} item={option} key={option.value}>{option.text}</Option>)
      ))
      : ''
    }
    // console.log('record.fieldtype_name', record.fieldtype_name)
    // console.log('record.fieldtype_name record', record)
    return index === this.state.key ?
          (
            <Select
              defaultValue={record.fieldtype_name || this.props.intl.formatMessage({id:"js.rou.cus1.0010", defaultMessage:"请选择"})}
              onSelect={this.onSelectChange(index, record, "fieldtype", 'fieldtype_name')}
            >
              {/* <Option value="">请选择</Option> */}
              {_options}
            </Select>
          ) : (
            <div className="fieldtype">
              {text || ''}
              {Number(record.fieldtype) === 7 ? <i size='sm' className='uf uf-settings ref-btn' onClick={() => this.setRef(record.code,record.name,1,index,record)}></i>
                : ''}
              {Number(record.fieldtype) === 8 ? <i size='sm' className='uf uf-settings ref-btn' onClick={() => this.setSelect(record.code,record.name,1,index,record)}></i>
              : ''}
              {Number(record.fieldtype) === 13 ? <i size='sm' className='uf uf-settings ref-btn' onClick={() => {this.setEnum(record.code,record.name,1,index);}}></i>
              : ''}
            </div>
          )
  }

  async componentWillReceiveProps(nextProps) {
    const { id: nextId } = nextProps.match.params
    const { id: prevId } = this.props.match.params
    const { ifEditStatus,key } = this.state;
    if( nextId !== prevId ){
      if(!ifEditStatus){
        await this.cancel("","",key)
      }
      await this.props.entityContentStore.getTableRequest(nextId); //获取主表信息
      const { entity,entity_items } = nextProps.entityContentStore.table.mainTableInfo;
      this.props.entityContentStore.getFieldref(nextId,entity_items.pk_mdentity); //获取所有参照
      this.setState({
        dataSource: entity || [],
        entity_items: entity_items || {},
        count: entity.length+1
      })
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    await this.props.entityContentStore.getTableRequest(id); //获取主表信息
    this.props.entityContentStore.getDesignInfo(id);
    const { entity,entity_items } = this.props.entityContentStore.table.mainTableInfo;
    this.props.entityContentStore.getFieldref(id,entity_items.pk_mdentity); //获取所有参照
    this.props.onRef && this.props.onRef(this);
    // console.log(table)
    this.setState({
      dataSource: entity || [],
      entity_items: entity_items || {},
      count: entity.length+1
    })
    this.props.comboxStore.getCombox('com.yonyou.iuapmdm.modeling.mdmdesign.entity.MDEntityDataTypeCombo')
  }

  // 取消
  cancel(text, record, index) {
    const { dataSource,count } = this.state;
    let nowObCode = dataSource[index].ob_code;
    if(nowObCode){
      for(let i = 0; i < this.props.entityContentStore.fieldref.NCSelectedData.length; i++){
        let nowSelectedData = this.props.entityContentStore.fieldref.NCSelectedData[i];
        if(nowSelectedData.fieldName === nowObCode){
          this.props.entityContentStore.fieldref.NCSelectedData.splice(i,1)
        }
      }
    }
    let oldObCode = this.editItemCache.ob_code;
    let oldObColumn = this.editItemCache.ob_column;
    if(oldObCode){
      this.props.entityContentStore.fieldref.NCSelectedData.push({
        fieldName:oldObCode,
        displayname:oldObColumn
      })
    }
    // console.log("编辑前：",this.editItemCache,"编辑后：",record);
    if(dataSource[index].pk_entityitem){ //编辑状态取消，恢复到修改前
      dataSource[index] = Object.assign(dataSource[index],{
        ob_code: this.editItemCache.ob_code,
        ob_column: this.editItemCache.ob_column,
        code : this.editItemCache.code,
        name : this.editItemCache.name,
        fieldlength : this.editItemCache.fieldlength,
        fieldtype : this.editItemCache.fieldtype,
        fieldtype_name : this.editItemCache.fieldtype_name,
        required: this.editItemCache.required,
        isunique: this.editItemCache.isunique,
        queryatt: this.editItemCache.queryatt,
        defaultvalue: this.editItemCache.defaultvalue
      })
      this.setState({
        ifEditStatus: true,
        key: -1,
        dataSource,
      });
      this.props.entityContentStore.changeEditIndex(-1)

    } else if(dataSource[index].ifOkStatus) { // 取消的这条数据之前已经保存过
      dataSource[index] = this.editItemCache
      this.setState({
        ifEditStatus: true,
        key: -1,
        dataSource,
      });
      this.props.entityContentStore.changeEditIndex(-1)
    } else{ //新增状态取消，删除该行
      dataSource.splice(index,1);
      // 同时删除参照、下拉、校验规则配置
      if(Number(record.fieldtype) === 7){ //参照
        this.props.entityContentStore.findRefByCode(record.code,record.name,3,index,record); // 3:删除标志位
      }else if(Number(record.fieldtype) === 8){
        this.props.entityContentStore.findComboByCode(record.code,record.name,3,index,record); // 3:删除标志位
      }
      this.props.entityContentStore.getValidateRule(record.code,record.name,3); // 3:删除标志位
      this.setState({
        ifEditStatus: true,
        count: count-1,
        key: -1,
        dataSource
      })
      this.props.entityContentStore.changeEditIndex(-1)
    }
    return dataSource
  }

  componentDidUpdate(prevProps, prevState) {

  }

  // 确认
  getConfirmCheck(text, record, index) {
    let patt = /^[a-zA-Z]\w*$/;
    let flag = true;
    const { dataSource } = this.state;
    if( record.code=='' || record.name=='' ){
      Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0049", defaultMessage:"字段编码和字段名称是必填项"}), color: 'danger'});
      // dataSource[index].focusInput = 'code'
      // this.setState({
      //   dataSource
      // })
      return
    }
    if( !patt.test(record.code) ){
      Message.create({content:this.props.intl.formatMessage({id:"js.rou.cus1.0050", defaultMessage:"编码只能以字母开头，可以由字母数字下划线组成"}), color: 'danger'});
      return
    }
    if( record.fieldtype == ''){
      Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0032", defaultMessage:"请选择字段类型!"}), color: 'danger'});
      return
    }
    dataSource.find((item,index)=>{
      if(item.orderno === record.orderno){ //不和自身比较
        return
      }
      if(index + 1 === dataSource.length){
        return
      }
      if(record.code === item.code || record.name === item.name){
        flag = false;
        Error(this.props.intl.formatMessage({id:"js.rou.cus1.0051", defaultMessage:"字段编码及字段名称不能重复"}))
        return ;
      }
    })

    if(!flag){ //编码重复
      return ;
    }

    // 长度只能是数字，字符的话可以有一个逗号
    if (parseInt(record.fieldtype) == 4) {
      // let pattFloat = /^\d*,{0,1}\d*$/;
      // if (!pattFloat.test(record.fieldlength)) {
      //   Error(`浮点数类型字符的长度请输入数字或者用","分隔的数字`)
      //   return
      // }
      let res = checkFieldLength(record.fieldtype, record.fieldlength)
      if (res) return
    } else {
      let pattInt = /^\d*$/;
      if (!pattInt.test(record.fieldlength)) {
        Error(this.props.intl.formatMessage({id:"js.rou.cus1.0052", defaultMessage:"类型字符长度请输入整数，范围是1~4000"}))
        return
      }
      let res = checkFieldLength(record.fieldtype, record.fieldlength)
      if (res) return
    }

    if (record.fieldtype_name === this.props.intl.formatMessage({id:"js.rou.cus1.0053", defaultMessage:"下拉"})) {
      let { combodata } = this.props.entityContentStore.fieldref
      if (!record.pk_entityitem && !combodata.ref_pkgd_name && !combodata.treelabelfield_name) {
        Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0054", defaultMessage:"下拉参数未配置"}), color: 'danger'});
        return
      }
    } else if (record.fieldtype_name === this.props.intl.formatMessage({id:"js.rou.cus1.0055", defaultMessage:"参照"})){
      const {
        reftype,
      } = this.props.entityContentStore.fieldref.reference;
      // 新增参照的时候需要 校验 reftype
      if (!record.pk_entityitem && !reftype) {
        Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0056", defaultMessage:"参照参数未配置"}), color: 'danger'});
        return
      }
    } else if(record.fieldtype_name === this.props.intl.formatMessage({id:"js.rou.cus1.0057", defaultMessage:"枚举"})){
      const {
        enumSaveData
      } = this.props.entityContentStore.fieldref;
      // 新增参照的时候需要 校验 reftype
      if (!record.pk_entityitem && !enumSaveData.pk_gd) {
        Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0058", defaultMessage:"枚举参数未配置"}), color: 'danger'});
        return
      }
    }

    const { nodeLeaf: { info } } = this.props.treeStore;
    let state = info.state;
    // 如果启用之后在停用，长度只能改大，不能改小(如果是新增的话不处理)
    if (state === 2 && record.pk_entityitem) {
      let { cacheEntity } = this.props.entityContentStore.table.mainTableInfo
      let cacheItem = cacheEntity.find(item => item.pk_entityitem == record.pk_entityitem)
      if (cacheItem && parseInt(record.fieldlength) < parseInt(cacheItem.fieldlength)) {
        Message.create({content:  this.props.intl.formatMessage({id:"js.rou.cus1.0059", defaultMessage:"启用之后再停用，长度只能改大，不能改小"}), color: 'danger'});
        return
      }
    }

    // ifOkStatus = true => 保存过的记录
    dataSource[index].ifOkStatus = true
    return dataSource;
  }

  // 确认
  async ok (text, record, index) {
    let dataSource = this.getConfirmCheck(text, record, index)
    let { entity } = this.props.entityContentStore.table.mainTableInfo;
    let oldFieldtype = this.editItemCache.fieldtype || '';
    this.props.entityContentStore.resetConfigEntityItems(record);
    if(record.pk_entityitem && parseInt(oldFieldtype) === 8 && parseInt(record.fieldtype) !== parseInt(oldFieldtype)){ //已存库，并将下拉类型修改为其他类型
      this.props.entityContentStore.resetComboEntityItems(record.pk_entityitem);
    }
    if (dataSource) {
      await this.props.entityContentStore.setResource([...dataSource])
      if(record.fieldtype === '13'){
        this.props.entityContentStore.okEnum();
      }
      this.setState({
        dataSource:dataSource,
        ifEditStatus: true,
        key: -1
      })
      this.props.entityContentStore.changeEditIndex(-1)
      return dataSource
    }
  }

  /** 判断模型是否启用 */
  ifStart = () => {
    const { state } = this.props.treeStore.nodeLeaf.info;
    if( state === 1){ //启用状态
      // alert("该模型已启用，请停用后再试")
      return true;
    }
    return false;
  }

  /** 行编辑 */
  async editItemClick(text, record, index) {
    this.editItemCache = Object.assign(this.editItemCache,{
      ob_code:record.ob_code,
      ob_column:record.ob_column,
      code:record.code,
      name:record.name,
      fieldlength : record.fieldlength,
      fieldtype : record.fieldtype,
      fieldtype_name : record.fieldtype_name,
      required: record.required,
      isunique: record.isunique,
      queryatt: record.queryatt,
      defaultvalue: record.defaultvalue,
      orderno: record.orderno,
      ifOkStatus: record.ifOkStatus,
      key: record.key,
      pk_entityitem: record.pk_entityitem,
      required: record.required,
      status: record.status
    })
    // console.log("编辑前",record)

    let starting = this.ifStart();
    if(starting) return;
    let { key, dataSource } = this.state;
    // 如果有行在编辑态，需要先确认
    if (key > -1) {
      let tempDataSource = await this.ok('', dataSource[key], key)
      if (!tempDataSource) return
    }

    this.setState({
      key: index,
      ifEditStatus: false
    })
    this.props.entityContentStore.changeEditIndex(index)
    
    this.props.entityContentStore.fieldref.nowNCObj = {
      fieldName:record.ob_code,
      displayname:record.ob_column
    }

    this.props.entityContentStore.changeEditFlag(true);
  }
  popClick = async (text, record, index) => {
    let contentStr = this.props.intl.formatMessage({id:"js.con.edi3.0014", defaultMessage:"确定删除吗？"})
    let nowState = this.props.treeStore.nodeLeaf.info.state;
    if(nowState == 2 && record.pk_entityitem){
      let entityCode = this.props.entityContentStore.table.mainTableInfo.entity_items.code;
      let itemCode = record.code;
      let deleteObj = await this.props.entityContentStore.checkDelete(entityCode,itemCode);
      if(deleteObj.flag && deleteObj.msg){
        contentStr = deleteObj.msg
      }
    }
    this.setState({
      contentStr: contentStr
    })
  }

  /** 行删除 */
  onDelete = async (text, record, index) => {
    let { count, dataSource, key } = this.state;
    if (key > -1) {
      let tempDataSource = await this.ok('', dataSource[key], key)
      if (!tempDataSource) return
    }
    let starting = this.ifStart();
    if(starting) return;

    let _del = dataSource.splice(index, 1);
    if(_del[0].pk_entityitem){
      _del[0].status = 3; //删除操作标志位
      this.delItems.push(_del[0]);
    }
    // console.log(this.delItems,"删除项")
    let enum_4_entity_items = this.props.entityContentStore.table.configEntityItems.enum_4_entity_items;
    let enum_4_entity_items_del = this.props.entityContentStore.table.configEntityItems.enum_4_entity_items_del;
    let delItem = enum_4_entity_items.splice(index,1);
    this.props.entityContentStore.table.configEntityItems.enum_4_entity_items_del = enum_4_entity_items_del.concat(delItem);
    if(Number(record.fieldtype) === 7){ //参照
      this.props.entityContentStore.findRefByCode(record.code,record.name,3,index, record); // 3:删除标志位
    }else if(Number(record.fieldtype) === 8){
      this.props.entityContentStore.findComboByCode(record.code,record.name,3,index, record); // 3:删除标志位
    }else if(Number(record.fieldtype) === 13){
      this.props.entityContentStore.findEnumByCode(record.code,record.name,3); // 3:删除标志位
    }
    this.props.entityContentStore.getValidateRule(record.code,record.name,3); // 3:删除标志位
    let nowObCode = record.ob_code;
    for(let i = 0; i < this.props.entityContentStore.fieldref.NCSelectedData.length; i++){
      let nowSelectedData = this.props.entityContentStore.fieldref.NCSelectedData[i];
      if(nowSelectedData.fieldName === nowObCode){
        this.props.entityContentStore.fieldref.NCSelectedData.splice(i,1)
      }
    }
    this.setState({
      dataSource,
      count:count - 1
    });
    await this.props.entityContentStore.setResource([...dataSource])
    this.props.entityContentStore.changeEditFlag(true);
  };

  /** 新增行 */
  handleAdd = async () => {
    let starting = this.ifStart();
    if(starting) return;
    const { count, dataSource, key } = this.state;
    let orderno = this.getMaxOrderno();
    let newData = {
      searchId: (Math.random() + '').replace('.',''),
      ob_code: "",
      ob_column: "",
      pk_entityitem:"",
      orderno:orderno,
      key: count,
      name: "",
      code: "",
      fieldtype: "1",
      fieldtype_name:this.props.intl.formatMessage({id:"js.rou.cus1.0034", defaultMessage:"字符"}),
      fieldlength: "100",
      required: false,
      isunique: false,
      queryatt: false,
      defaultvalue: '',
      status: '0'
    };
    // let len = dataSource.length
    // if (len > 0) {
    //   let lastItem = dataSource[len-1]
    //   if (!lastItem.code || !lastItem.name) {
    //     Error(`新增的第${len}行未完成!`)
    //     return
    //   }
    // }
    if (key > -1) {
      let tempDataSource = this.getConfirmCheck('', dataSource[key], key)
      if (tempDataSource) {
        await this.props.entityContentStore.setResource([...tempDataSource])
        if(dataSource[key].fieldtype === '13'){
          this.props.entityContentStore.okEnum();
        }
        this.setState({
          dataSource: [...tempDataSource, newData],
          count: count + 1,
          key:count - 1,
          ifEditStatus: false
        });
        this.props.entityContentStore.changeEditIndex(count - 1)
      }
    } else {
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
        key:count - 1,
        ifEditStatus: false
      });
      this.props.entityContentStore.changeEditIndex(count - 1)
    }
    this.props.entityContentStore.table.configEntityItems.enum_4_entity_items.push({})
    this.props.entityContentStore.changeEditFlag(true);

    // this.props.entityContentStore.setResource([...dataSource, newData])
    // 新增的时候让 props和state保持一致
  };

  /** 配置校验规则 */
  validateRules = (text, record, index) => {
    let starting = this.ifStart();
    if(starting) return;
    this.props.entityContentStore.setValidateModal(true)
    this.setState({
      record:record
    })
    this.props.entityContentStore.changeEditFlag(true);
  };

  /**
   * 获取数据源中最大的orderno
   */
  getMaxOrderno = () => {
    let orderno = 0;
    let { dataSource } = this.state;
    let i = dataSource.length;
    if(i > 0){
      orderno = dataSource[i-1].orderno + 1;
    }
    return orderno;
  }

  /**
  * 数组元素交换位置
  * @param {array} arr 数组
  * @param {number} index1 添加项目的位置
  * @param {number} index2 删除项目的位置
  * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
  */
  swapArray = (arr, index1, index2) => {
    if(arr[index1] && arr[index2]){
      let arrindex2 = arr.splice(index2, 1, arr[index1])[0];
      let orderno1 = arr[index1].orderno;
      let orderno2 = arrindex2.orderno;
      arr[index1] = arrindex2;
      arr[index1].orderno = orderno1;
      arr[index2].orderno = orderno2;
    }
    return arr;
  }

  /**
   * 上移
   * @param {*} text
   * @param {*} record
   * @param {*} index
   */
  moveup(text, record, index){
    let starting = this.ifStart();
    if(starting) return;
    let { dataSource, key } = this.state;
    if(dataSource.length == 0) return;
    if(index == 0) return;
    let tempDataSource
    // 先取消在做其他操作
    if (key > -1) {
      tempDataSource = this.cancel('', dataSource[key], key)
    }

    if (tempDataSource) {
      dataSource = tempDataSource
    }
    this.swapArray(dataSource, index, index-1);
    this.swapArray(this.props.entityContentStore.table.configEntityItems.enum_4_entity_items, index, index-1);
    this.setState({
      dataSource
    });
    this.props.entityContentStore.changeEditFlag(true);


  }

  /**
   * 下移
   * @param {*} text
   * @param {*} record
   * @param {*} index
   */
  movedown(text, record, index){
    let starting = this.ifStart();
    if(starting) return;
    let { dataSource, key } = this.state;
    if(dataSource.length == 0) return;

    let tempDataSource;
    // 先取消在做其他操作
    if (key > -1) {
      tempDataSource = this.cancel('', dataSource[key], key)
    }
    if (tempDataSource) {
      dataSource = tempDataSource
    }
    // 取消过后的 判断是不是能下移
    if(index+1 == dataSource.length) return;
    this.swapArray(dataSource, index, index+1);
    this.swapArray(this.props.entityContentStore.table.configEntityItems.enum_4_entity_items, index, index+1);
    this.setState({
      dataSource
    });

    this.props.entityContentStore.changeEditFlag(true);

  }

  getBodyWrapper = body => {
    return (
      <Animate
        transitionName="move"
        component="tbody"
        className={body.props.className}
      >
        {body.props.children}
      </Animate>
    );
  };

  getSelectedDataFunc = data => {
    // console.log(data);
    this.setState({
      mulSelectItem: data
    })
  };

  // checkbox 切换
  onCheckChange = (index, key) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      if(value && key === 'isunique'){
        dataSource[index]['required'] = value;
      }
      if(key === 'required' && dataSource[index]['isunique']){
        dataSource[index]['required'] = true;
      }
      this.setState({ dataSource });
    };
  };

  // 下拉选择
  onSelectChange = (index, record, key, key_name) => {

    let { pk_entityitem } = record;
    let { id } = this.props.match.params;
    const { fieldLengthMap } = this.props.entityContentStore.table;
    return (value, {props:{item}}) => {

      const { nodeLeaf: { info } } = this.props.treeStore;
      let state = info.state;

      // 如果是启用转成停用，有些类型不能相互转换
      if (state === 2 && pk_entityitem) {
        if (!(checkFieldType(record.fieldtype, item.value))) {
          return
        }
      }

      const dataSource = [...this.state.dataSource];

      // if (typeList.includes(item.value)) {
        dataSource[index]['fieldlength'] = fieldLengthMap[item.value]
      // }
      dataSource[index][key] = item.value;
      dataSource[index][key_name] = value;
      this.setState({ dataSource });
      switch(Number(record.fieldtype)){
        case 7 : //参照
          if (!record.code || !record.name) {
            Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0060", defaultMessage:"请先输入字段编码和字段名称"}), color: 'danger'});
            return
          }
          this.setRef(record.code,record.name,'',index,record);
          break;
        case 8 : //下拉
          if (!record.code || !record.name) {
            Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0060", defaultMessage:"请先输入字段编码和字段名称"}), color: 'danger'});
            return
          }
          this.setSelect(record.code,record.name,'',index,record);
          break;
        case 13: //枚举
        if (!record.code || !record.name) {
          Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0060", defaultMessage:"请先输入字段编码和字段名称"}), color: 'danger'});
          return
        }
        this.setEnum(record.code,record.name,undefined,index);
        break;
        default:
          break;
      }
    };
  };

  // 设置参照
  setRef = (code,name,status,index,record) => {
    this.props.entityContentStore.setRefModal(true, false);
    this.props.entityContentStore.findRefByCode(code,name,status,index,record); //code:标识entityitem
    this.props.entityContentStore.changeEditFlag(true);
  }

  // 设置下拉框
  setSelect = (code,name,status,index,record) => {
    this.props.entityContentStore.setSelectDownModal(true, false)
    this.props.entityContentStore.findComboByCode(code,name,status,index,record);
    this.props.entityContentStore.changeEditFlag(true);
  }

  // 设置枚举
  setEnum = (code,name,status,index) => {
    this.props.entityContentStore.setOperateIndex(index)
    this.props.entityContentStore.setEnumModal(true)
    this.props.entityContentStore.findEnumByCode(code,name,status);
    this.props.entityContentStore.changeEditFlag(true);
  }
  // 输入框改变
  onCellChange = (index, key) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      // console.log('oncelll===', value)
      dataSource[index][key] = value;
      // console.log(dataSource[index][key])
      this.setState({ dataSource });
    };
  };

  async resetTable() {
    const { cacheEntity } = this.props.entityContentStore.table.mainTableInfo;
    this.setState({
      dataSource: cacheEntity
    })
    this.props.entityContentStore.resetMainTable()
  }

  // 点击保存
  async saveMainTable(e) {
    // e.preventDefault();
    let { dataSource,ifEditStatus,key } = this.state;
    const { id } = this.props.match.params
    const { nodeLeaf } = this.props.treeStore;
    const { mainTableInfo } = this.props.entityContentStore.table;
    const { tempNode } = this.props.entityContentStore.dataModal;
    let length = dataSource.length;
    let newData = dataSource[length-1];
    // console.log(newData,'编辑行')
    // if(!ifEditStatus) {
    //   this.cancel("",newData,key)
    // }
    let tempDataSource
    // 先取消在做其他操作
    if (key > -1) {
      tempDataSource = this.cancel('', dataSource[key], key)
    }

    if (tempDataSource) {
      dataSource = tempDataSource
    }
    // this.props.form.validateFields(async (err, values) => {
    //   if (err) {
    //     console.log('校验失败', values);
    //   } else {
    //     console.log('提交成功', values)
        // {"isworkflow":true,"isstart_us_v":true,"statistics":false,
        let entity = Object.assign(mainTableInfo.entity_items, {
            pk_gd: id,
            zztype: "1",
            code: nodeLeaf.info.code || tempNode.code,
            name: nodeLeaf.info.name || tempNode.name,
            tablename: ""
        }, {
          tablename: `mdm_${nodeLeaf.info.code || tempNode.code}`
        })
        let entity_items = dataSource.concat(this.delItems);
        // console.log(entity_items,"提交数据")
        await this.props.entityContentStore.saveTableRequest(entity_items, entity)
        await this.props.entityContentStore.getTableRequest(id)
        const { pk_mdentity } = this.props.entityContentStore.table.mainTableInfo.entity_items;
        // console.log(pk_mdentity);
        await this.props.entityContentStore.getFieldref(id,pk_mdentity); //获取所有参照
        this.setState({
          dataSource: this.props.entityContentStore.table.mainTableInfo.entity || [],
          entity_items: this.props.entityContentStore.table.mainTableInfo.entity_items || {},
          count: this.props.entityContentStore.table.mainTableInfo.entity.length+1
        })
        this.delItems.length = 0;
        return true

      // }
    // });
  }

  delTableCell() {
    const { mulSelectItem } = this.state
    // console.log(' mulSelectItem', mulSelectItem)
    const dataSource = [...this.state.dataSource];
    // for(let i = 0; i < mulSelectItem.length; i++) {
    //   dataSource.findIndex(item => item.key === mulSelectItem.key)
    //   dataSource.splice(index, 1);
    // }mulSelectItem item.key
    let selectKey = mulSelectItem.map(item => item.key)
    let tempDataSource = dataSource.filter(item => {
      return !selectKey.includes(item.key)
    })
    this.props.entityContentStore.setResource(tempDataSource)
    this.setState({ dataSource: tempDataSource });

  }

  updateNC(selectedRecord){
    let index = this.props.entityContentStore.fieldref.NCIndex;
    let dataSource = this.state.dataSource
    dataSource[index] = Object.assign(dataSource[index],{
      ob_code:selectedRecord.fieldName,
      ob_column:selectedRecord.displayname,
      pk_obid:selectedRecord.pk_obid,
      ob_column_id:selectedRecord.ob_column_id,
      pk_obinfo:selectedRecord.pk_obinfo,
      ob_table:selectedRecord.ob_table
    })
    this.setState({ dataSource });
  }

  render() {
    let { dataSource, count, record } = this.state;
    const { expendId } = this.props
    let columns = this.columns;
    const { getFieldProps, getFieldError } = this.props.form;
    // const { id } = this.props.match.params;
    const { nodeLeaf, parentName, nodeLeaf:{info:{state}} } = this.props.treeStore
    const { modal } = this.props.treeStore

    const { tempNode } = this.props.entityContentStore.dataModal;
    const { entity,entity_items } = this.props.entityContentStore.table.mainTableInfo
    const { activeTabs } = this.props.entityContentStore.tableStatus
    let obNode = this.props.treeStore.nodeLeaf.info.obNode;
    if(obNode)
      columns = this.ncColumns.concat(this.columns);
    // console.log('nodeLeaf.info.state', state)
    return (
      <div className={`main-table ${this.props.className}`}>
        <div className="main-data-form">
          <FormItem className="form-data-node">
            <Label>{<FormattedMessage id="js.rou.cus1.0061" defaultMessage="上级节点名称:" />}</Label>
            <span>
              {
                nodeLeaf.info.parent_name || parentName
              }
            </span>
          </FormItem>
          <FormItem className="form-data-node">
            <Label>{<FormattedMessage id="js.rou.cus1.0062" defaultMessage="编码:" />}</Label>
            <span>
              {
                nodeLeaf.info.code || tempNode.code
              }
            </span>
          </FormItem>
          <FormItem className="form-data-node">
            <Label>{<FormattedMessage id="js.rou.cus1.0063" defaultMessage="名称:" />}</Label>
            <span>
              {
                nodeLeaf.info.name || tempNode.name
              }
            </span>
          </FormItem>
          {
            obNode?<FormItem className="form-data-node">
            <Label>{<FormattedMessage id="js.rou.cus1.0064" defaultMessage="表名:" />}</Label>
            <span>
              {
                dataSource[0] && dataSource[0].ob_table
              }
            </span>
          </FormItem>:''
          }


        </div>
        {/* <EditTable /> */}
        <Button
          className={`margin-bottom-16 margin-right-10 ${state === 1? "disabled-btn":""}`}
          colors="primary"
          disabled={state === 1}
          onClick={this.handleAdd}
        >
          {<FormattedMessage id="js.rou.cus1.0065" defaultMessage="新增属性" />}
        </Button>

        {/* <Button
          className="sql-btn margin-bottom-10 "
          shape="border"
          onClick={this.delTableCell}
        >
          删除选中行
        </Button> */}

        <Table
          className="mdm-table"
          data={dataSource}
          columns={columns}
          headerScroll={false}
          rowKey={r => r.orderno}
          // getBodyWrapper={this.getBodyWrapper}
          getSelectedDataFunc={this.getSelectedDataFunc}
          rowClassName={(record,index,indent)=>{
            if (index === this.state.key) {
                return 'row-edit u-table-row-hover';
            } else {
                return '';
            }
          }}
          scroll={{ y: 280 }}
          syncHover={!(this.state.key > -1)}
        />
        {this.props.entityContentStore.currentNode === 'ref' ?
          <FieldtypeModal /> : <SelectDownModal />
        }
        {
          this.props.entityContentStore.currentNode === 'enum' ?<EnumModal/>: ''
        }
        {
          obNode ?<NCModal
          updateNC={(selectedRecord) => {this.updateNC(selectedRecord)}}/>: ''
        }

        {
          activeTabs === 'father' ? <ValidateModal recordInfo={record}/> : null
        }

      </div>
    );
  }
}

export default injectIntl(Form.createForm()(EditTableMain), {withRef: true});
