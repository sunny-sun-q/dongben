import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React from "react";
import { Error } from 'utils/index'
import { FormControl, Label, Checkbox, Input, Icon,  Tooltip, Animate, Message } from 'tinper-bee';
import Select from 'bee-select';
const Option = Select.Option;

import {Table,Popconfirm,Button} from 'components/tinper-bee';
import Form from 'bee-form'
// import DataModelTable from '../data-model-table'
import ValidateModal from '../../components/validate-modal'

const FormItem = Form.FormItem;
import EnumModal from '../enum-modal'

import './index.less'
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';


import {
  inject,
  observer
} from 'mobx-react';

import {toJS} from "mobx";
import { checkFieldType, checkFieldLength } from "utils";

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
class TemplateTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cacheDataSource: [],
      dataSource: [],
      entity_items: {},
      activeIndex:0,
      count: 0,
      key: -1,
      ifEditStatus: true,
      hoverCell: -1, // 划过的item
      mulSelectItem: [],
      record:{}
    };
    this.firstFlag = false;
    this.saveSecondTable = this.saveSecondTable.bind(this)
    this.delTableCell = this.delTableCell.bind(this)
    this.columns = [
      {
        title: <div><span style={{color: 'red',padding: '0px 5px 0px 0px'}}>*</span>{ this.props.intl.formatMessage({id:"js.con.edi.0001", defaultMessage:"字段编码"})}</div>,
        dataIndex: "code",
        key: "code",
        width: 150,
        render: (text, record, index) => this.renderColumns(text, record, index)
        // render: (text, record, index) => {
        //   return index === this.state.key ? (
        //     <FormControl
        //       value={text}
        //       onChange={this.onCellChange(index, "code")}
        //     />
        //   ) : (text ||'')
        // }
      },
      {
        title: <div><span style={{color: 'red',padding: '0px 5px 0px 0px'}}>*</span>{ this.props.intl.formatMessage({id:"js.con.edi.0002", defaultMessage:"字段名称"})}</div>,
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
        title: this.props.intl.formatMessage({id:"js.con.edi.0003", defaultMessage:"类型"}),
        dataIndex: "fieldtype_name",
        key: "fieldtype_name",
        width: 140,
        render: (text, record, index) => this.renderColumnsSelect(text, record, index)
      },
      {
        title: this.props.intl.formatMessage({id:"js.con.edi.0004", defaultMessage:"长度"}),
        dataIndex: "fieldlength",
        key: "fieldlength",
        width: 70,
        render: (text, record, index) => this.renderColumnsText(text, record, index)
      },
      {
        title: this.props.intl.formatMessage({id:"js.con.edi.0005", defaultMessage:"必输项"}),
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
        title: this.props.intl.formatMessage({id:"js.con.edi.0006", defaultMessage:"是否唯一"}),
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
      // {
      //   title: "查询条件",
      //   dataIndex: "queryatt",
      //   key: "queryatt",
      //   width: 80,
      //   render: (text, record, index) => {
      //     return (
      //       <Checkbox
      //         disabled={ !(index=== this.state.key) }
      //         checked={record.queryatt}
      //         onChange={(!this.state.ifEditStatus && index === this.state.key) ? this.onCheckChange(index, "queryatt") : null}
      //       />
      //     );
      //   }
      // },
      {
        title: this.props.intl.formatMessage({id:"js.con.edi.0007", defaultMessage:"默认值"}),
        dataIndex: "defaultvalue",
        key: "defaultvalue",
        width: 70,
        render: (text, record, index) => {
          let fieldtype = parseInt(record.fieldtype);
          let editFlag = fieldtype === 1 || fieldtype === 3 || fieldtype === 4 || fieldtype === 2;
          return index === this.state.key  &&  editFlag? (
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
          let contentStr = this.props.intl.formatMessage({id:"js.con.edi3.0014", defaultMessage:"确定删除吗？"})
          return (index !== this.state.key) ? (
            // <ul className={`display-flex handle-btn-group`}>
            <ul className={`display-flex handle-btn-group ${state === 1 || (this.state.key > -1 && index !== this.state.key) ?"disabled-oper":""}`}>
              <li onClick={state === 1 || (this.state.key > -1 && index !== this.state.key) ? null : () => {
                this.editItemClick(text, record, index) }}>
                <FormattedMessage id="js.con.edi.0009" defaultMessage="编辑" />
              </li>
              {
                state === 1 || (this.state.key > -1 && index !== this.state.key) ? (
                  <li >
                    <FormattedMessage id="js.con.edi.0010" defaultMessage="删除" />
                  </li>
                ) : (
                  <Popconfirm onClose={() => {this.onDelete(text, record, index) }} trigger="click" rootClose placement="right" content={contentStr} >
                    <li >
                      <FormattedMessage id="js.con.edi.0010" defaultMessage="删除" />
                    </li>
                  </Popconfirm>
                )
              }

              <li onClick={
                state === 1 || (this.state.key > -1 && index !== this.state.key) ? null : () => {this.moveup(text, record, index) }
              }>
                <FormattedMessage id="js.con.edi.0012" defaultMessage="上移" />
              </li>
              <li onClick={
                state === 1 || (this.state.key > -1 && index !== this.state.key) ? null : () => {this.movedown(text, record, index) }
              }>
                <FormattedMessage id="js.con.edi.0013" defaultMessage="下移" />
              </li>
              <li onClick={
                  state === 1 || (this.state.key > -1 && index !== this.state.key) ? null : () => {this.validateRules(text, record, index) }
              }>
                <FormattedMessage id="js.con.edi.0014" defaultMessage="校验规则" />
              </li>
            </ul>
          ) : (
            <ul className="display-flex">
              <li onClick={() => {
                this.cancel(text, record, index) }}>
                <FormattedMessage id="js.con.edi.0015" defaultMessage="取消" />
              </li>
              <li onClick={() => {
                this.ok(text, record, index) }}>
                <FormattedMessage id="js.con.edi.0016" defaultMessage="确定" />
              </li>
            </ul>
          )
        }
      }
    ];

  }

  delItems = []; //行删除缓存数组

  editItemCache = {}; //行编辑缓存对象

  renderColumns = (text, record, index) => {
    const { state } = this.props.treeStore.nodeLeaf.info;
    return index === this.state.key ? (
      <FormControl
        value={text}
        disabled={record.pk_entityitem && state === 2}
        onChange={this.onCellChange(index, "code")}
        autoFocus
      />
    ) : (text ||'')
  }

  // 渲染文本框
  renderColumnsText = (text, record, index) => {
    const { fieldLengthMap } = this.props.entityContentStore.table;
    const { getFieldProps } = this.props.form;
    let fieldtype = record.fieldtype;
    return index === this.state.key && !(typeList.includes(fieldtype)) ? (
      <FormControl
        style={{
          width: '60px'
        }}
        // value={text}
        // onChange={this.onCellChange(index, "fieldlength")}
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
    ) : (record.fieldlength||'')
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
    return index === this.state.key ?
          (
            <Select
              defaultValue={record.fieldtype_name || this.props.intl.formatMessage({id:"js.con.edi.0017", defaultMessage:"请选择"})}
              onSelect={this.onSelectChange(index, record, "fieldtype", 'fieldtype_name')}
            >
              {_options}
            </Select>
          ) : (
            <div className="fieldtype">
              {text || ''}
              {Number(record.fieldtype) === 7 ?
                <i size='sm' className='uf uf-settings ref-btn' onClick={() => this.setRef(record.code,record.name,1,index,record)}></i>
                : ''}
              {Number(record.fieldtype) === 8 ?
                <i size='sm' className='uf uf-settings ref-btn' onClick={() => this.setSelect(record.code,record.name,1,index,record)}></i>
              : ''}
              {Number(record.fieldtype) === 13 ? <i size='sm' className='uf uf-settings ref-btn' onClick={ () => {this.setEnum(record.code,record.name,1,index);}}></i>
              : ''}
            </div>
          )
  }

  // 取消
  cancel(text, record, index) {
    const { dataSource,count } = this.state;
    if(record.pk_entityitem){ //编辑状态取消，恢复到修改前
      dataSource[index] = Object.assign(dataSource[index],{
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
    } else if (dataSource[index].ifOkStatus) { // 取消的这条数据之前已经保存过
      dataSource[index] = this.editItemCache
      this.setState({
        ifEditStatus: true,
        key: -1,
        dataSource,
      });
    } else { //新增状态取消，删除该行
      dataSource.splice(index,1);
      // 同时删除参照、下拉、校验规则配置
      if(Number(record.fieldtype) === 7){ //参照
        this.props.entityContentStore.findRefByCode(record.code,record.name,3,index,record); // 3:删除标志位
      }else if(Number(record.fieldtype) === 8){
        this.props.entityContentStore.findComboByCode(record.code,record.name,3,index,record); // 3:删除标志位
      }else if(Number(record.fieldtype) === 13){
        this.props.entityContentStore.findEnumByCode(record.code,record.name,3); // 3:删除标志位
      }
      this.props.entityContentStore.getValidateRule(record.code,record.name,3); // 3:删除标志位
      this.setState({
        ifEditStatus: true,
        count: count-1,
        key: -1,
        dataSource
      })
    }
  }

  // 确认
  getConfirmCheck(text, record, index) {
    let patt = /^[a-zA-Z]\w*$/;
    let flag = true;
    const { dataSource } = this.state;
    if( record.code=='' || record.name=='' ){
      Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0018", defaultMessage:"字段编码和字段名称是必填项"}), color: 'danger'});
      // dataSource[index].focusInput = 'code'
      // this.setState({
      //   dataSource
      // })
      return
    }
    if( !patt.test(record.code) ){
      Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0019", defaultMessage:"编码只能以字母开头，可以由字母数字下划线组成"}), color: 'danger'});
      return
    }
    if( record.fieldtype == ''){
      Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0020", defaultMessage:"请选择字段类型!"}), color: 'danger'});
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
        Error(this.props.intl.formatMessage({id:"js.con.edi.0021", defaultMessage:"字段编码及字段名称不能重复"}))
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
        Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0024", defaultMessage:"下拉的设置参数未选择"})});
        return
      }
    } else if (record.fieldtype_name === this.props.intl.formatMessage({id:"js.rou.cus1.0055", defaultMessage:"参照"})){
      const {
        reftype,
      } = this.props.entityContentStore.fieldref.reference;
      // 新增参照的时候需要 校验 reftype
      if (!record.pk_entityitem && !reftype) {
        Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0026", defaultMessage:"参照的设置参数未选择"}), color: 'danger'});
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
      let { cacheDataSource } = this.state
      // let cacheItem = cacheEntity.find(item => item.pk_entityitem == record.pk_entityitem)
      if (cacheDataSource && parseInt(record.fieldlength) < parseInt(cacheDataSource[index].fieldlength)) {
        Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0027", defaultMessage:"主数据"}), color: 'danger'});
        return
      }
    }

    // ifOkStatus = true => 保存过的记录
    dataSource[index].ifOkStatus = true
    return dataSource;
  }

  // 确认
  async ok(text, record, index) {
    let dataSource = this.getConfirmCheck(text, record, index)
    let oldFieldtype = this.editItemCache.fieldtype || '';
    this.props.entityContentStore.resetConfigEntityItems(record);
    if(record.pk_entityitem && parseInt(oldFieldtype) === 8 && parseInt(record.fieldtype) !== parseInt(oldFieldtype)){ //已存库，并将下拉类型修改为其他类型
      this.props.entityContentStore.resetComboEntityItems(record.pk_entityitem);
    }
    if (dataSource) {
      await this.props.entityContentStore.setSecondResource([...dataSource])
      if(record.fieldtype === '13'){
        this.props.entityContentStore.okEnum();
      }
      this.setState({
        dataSource:dataSource,
        ifEditStatus: true,
        key: -1
      })
    }
    return dataSource
  }

  /** 判断模型是否启用 */
  ifStart = () => {
    const { state } = this.props.treeStore.nodeLeaf.info;
    if( state === 1){ //启用状态
      alert(this.props.intl.formatMessage({id:"js.con.edi.0028", defaultMessage:"该模型已启用，请停用后再试"}))
      return true;
    }
    return false;
  }

  async editItemClick(text, record, index) {
    // console.log(record.key,index,this.state.key)
    this.editItemCache = Object.assign(this.editItemCache, {
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
    this.props.entityContentStore.changeEditFlag(true);
  }

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
    this.setState({
      dataSource,
      count:count - 1
    });
    await this.props.entityContentStore.setSecondResource([...dataSource])
    this.props.entityContentStore.changeEditFlag(true);
  };

  /** 新增行 */
  handleAdd = () => {
    let starting = this.ifStart();
    if(starting) return;
    const { count, dataSource, key } = this.state;
    let orderno = this.getMaxOrderno();
    const newData = {
      searchId: (Math.random() + '').replace('.',''),
      pk_entityitem:"",
      orderno:orderno,
      key: count,
      name: "",
      code: "",
      fieldtype: "1",
      fieldtype_name:this.props.intl.formatMessage({id:"js.con.edi.0029", defaultMessage:"字符"}),
      fieldlength: "100",
      required: false,
      isunique: false,
      queryatt: false,
      defaultvalue: '',
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
        this.setState({
          dataSource: [...tempDataSource, newData],
          count: count + 1,
          key:count - 1,
          ifEditStatus: false
        });
      }
      return
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      key:count -1,
      ifEditStatus: false
    });
    // this.props.entityContentStore.setSecondResource([...dataSource, newData])
    this.props.entityContentStore.changeEditFlag(true);
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

  let tempDataSource;
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

componentDidMount() {
  const { id } = this.props.match.params;
  const { activeKey } = this.props;
  let index = activeKey.replace(/[^0-9]/ig,""); //子表序号，从1开始
  const { secondTableInfo } = this.props.entityContentStore.table;
  const { entity, cacheEntity ,entity_items,entity_items:{pk_mdentity} } = secondTableInfo[index-1];
  this.props.onRef&&this.props.onRef(this)
  //   this.props.entityContentStore.getFieldref(id,pk_mdentity,index-1); //获取所有参照
  this.setState({
    dataSource: entity || [],
    cacheDataSource: cacheEntity || [],
    entity_items: entity_items || {},
    count: entity.length+1,
    activeIndex: index-1
  })
}

componentWillReceiveProps(nextProps){
  const { id } = this.props.match.params;
  const { ifEditStatus, key } = this.state;
  const { secondTableInfo } = this.props.entityContentStore.table;
  let index1 = nextProps.activeKey.replace(/[^0-9]/ig,"");
  let index2 = this.props.activeKey.replace(/[^0-9]/ig,"");
  if(this.props.entityContentStore.tableStatus.activeTabs === 'son'){
    if(index1 !== index2){

      // 注意下面代码重复
      if(!ifEditStatus){
        this.cancel("","",key)
      }
      if( index1-1 > -1 ){
        const { entity, cacheEntity, entity_items,entity_items:{pk_mdentity} } = secondTableInfo[index1-1];
        this.props.entityContentStore.getFieldref(id,pk_mdentity,index1-1); //获取所有参照

        this.setState({
          dataSource: entity || [],
          cacheDataSource: cacheEntity || [],
          entity_items: entity_items || {},
          count: entity.length+1,
          activeIndex: index1-1
        })
      }
      // 重复结束


    }else{
      if(index1 === 1 && !this.firstFlag){
        this.firstFlag = true;
        if(secondTableInfo[index1-1].entity.length > 0){

          // 注意此处代码重复
          if(!ifEditStatus){
            this.cancel("","",key)
          }
          if( index1-1 > -1 ){
            const { entity, cacheEntity, entity_items,entity_items:{pk_mdentity} } = secondTableInfo[index1-1];
            this.props.entityContentStore.getFieldref(id,pk_mdentity,index1-1); //获取所有参照

            this.setState({
              dataSource: entity || [],
              cacheDataSource: cacheEntity || [],
              entity_items: entity_items || {},
              count: entity.length+1,
              activeIndex: index1-1
            })
          }
          // 重复结束


        }
      }
    }

  }
}

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
  // onSelectChange = (index, key, key_name) => {
  //   return (value, {props:{item}}) => {
  //     // console.log(item)
  //     // console.log(`selected ${value} ${item}`);
  //     const dataSource = [...this.state.dataSource];
  //     dataSource[index][key] = item.value;
  //     dataSource[index][key_name] = value;
  //     this.setState({ dataSource });
  //   };
  // };
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
      dataSource[index]['fieldlength'] = fieldLengthMap[item.value]
      dataSource[index][key] = item.value;
      dataSource[index][key_name] = value;
      this.setState({ dataSource });
      switch(Number(record.fieldtype)){
        case 7 : //参照
          if (!record.code || !record.name) {
            Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0030", defaultMessage:"主请先输入字段编码和字段名称数据"}), color: 'danger'});
            return
          }
          this.setRef(record.code,record.name,'',index,record);
          break;
        case 8 : //下拉
          if (!record.code || !record.name) {
            Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0030", defaultMessage:"主数据请先输入字段编码和字段名称"}), color: 'danger'});
            return
          }
          this.setSelect(record.code,record.name,'',index,record);
          break;
          case 13: //枚举
          if (!record.code || !record.name) {
            Message.create({content: this.props.intl.formatMessage({id:"js.con.edi3.0032", defaultMessage:"请先输入字段编码和字段名称"}), color: 'danger'});
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
      this.setState({ dataSource });
    };
  };

  resetTemplateTableState() {
    this.setState({
      dataSource: []
    })
  }
  // 点击保存
  async saveSecondTable(e) {
    // e.preventDefault();
    const { dataSource,activeIndex,entity_items,ifEditStatus,key } = this.state;
    const { id } = this.props.match.params;
    const { secondTableInfo } = this.props.entityContentStore.table;
    if (secondTableInfo && secondTableInfo.length === 0) {
      Message.create({content: this.props.intl.formatMessage({id:"js.con.edi.0031", defaultMessage:"子表无数据"}), color: 'danger'})
    }
    const { pk_mdentity } = this.props.entityContentStore.table.mainTableInfo.entity_items;
    let submit_entity = Object.assign(entity_items, {
      pk_gd: id,
      pk_parent: pk_mdentity,
      zztype: "2",
      code: entity_items.code,
      name: entity_items.name,
      tablename: ""
    },{
      tablename: `mdm_${entity_items.code}`
    })
    let length = dataSource.length;
    let newData = dataSource[length-1];
    // console.log(newData,'编辑行')

    let tempDataSource
    // 先取消在做其他操作
    if (key > -1) {
      tempDataSource = this.cancel('', dataSource[key], key)
    }

    if (tempDataSource) {
      dataSource = tempDataSource
    }
    let entity_flag
    // 给出错误提示
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        entity_flag = true
        // console.log('校验失败', values);
        return
      }
    });
    if (entity_flag) return
    // this.props.form.validateFields(async (err, values) => {
    //   if (err) {
    //     // console.log('校验失败', values);
    //   } else {
        let submit_items = dataSource.concat(this.delItems);
        // console.log(submit_items,"提交数据")
        // if(submit_items.length === 0){
        //   Message.create({content: '请完善子表信息!', color: 'danger'});
        //   return
        // }

        await this.props.entityContentStore.saveTableRequest(submit_items, submit_entity)
        await this.props.entityContentStore.getTableRequest(id)

        const { activeKey } = this.props;
        let index = activeKey.replace(/[^0-9]/ig,""); //子表序号，从1开始
        // console.log(pk_mdentity);
        let secondTableInfo1 = this.props.entityContentStore.table.secondTableInfo;
        let pk_mdentity1 = secondTableInfo1[index-1].entity_items.pk_mdentity
        await this.props.entityContentStore.getFieldref(id,pk_mdentity1); //获取所有参照
        this.setState({
          dataSource: this.props.entityContentStore.table.secondTableInfo.entity || [],
          entity_items: submit_items || {},
          count: submit_items.length+1
        })
        return true
      // }
  //   });
  }

  delTableCell() {
    const { mulSelectItem } = this.state
    // console.log(' mulSelectItem', mulSelectItem)
    const dataSource = [...this.state.dataSource];
    let selectKey = mulSelectItem.map(item => item.key)
    let tempDataSource = dataSource.filter(item => {
      return !selectKey.includes(item.key)
    })
    this.props.entityContentStore.setSecondResource(tempDataSource)
    this.setState({ dataSource: tempDataSource });
  }

  render() {
    let self = this;
    let { dataSource,record } = this.state;
    const columns = this.columns;
    const { getFieldProps, getFieldError } = this.props.form;
    const { nodeLeaf,nodeLeaf:{info:{state}} } = this.props.treeStore;
    // // console.log(this.props.treeStore,"999999",nodeLeaf.info.parent_name)
    const { tempNode } = this.props.entityContentStore.dataModal;
    const { entity_items, entity } = this.props.tableInfo;
    const { activeTabs, sonActiveTab } = this.props.entityContentStore.tableStatus
    return (
      <div className="second-table-content">
        <div className="main-data-form">
        <FormItem className="form-data-node">
            <Label>{<FormattedMessage id="js.con.edi.0032" defaultMessage="上级节点名称：" />}</Label>
            <span>
              {
                nodeLeaf.info.parent_name
              }
            </span>
          </FormItem>
          <FormItem className="form-item-input form-data-node">
            <Label><FormattedMessage id="js.con.edi.0033" defaultMessage="编码" /><span className="require-icon">*</span>{<FormattedMessage id="js.con.edi.0034" defaultMessage="：" />}</Label>
            <FormControl placeholder=''
              disabled={state === 1 ||(state === 2 && entity_items.pk_mdentity)}
              {...getFieldProps('code', {
                validateTrigger: 'onBlur',
                initialValue: entity_items.code || '',
                onChange(value) {
                  self.props.entityContentStore.changeEditFlag(true);
                  self.setState({ entity_items: Object.assign(entity_items,{code:value}) });
                },
                rules: [{
                  required: true, message:this.props.intl.formatMessage({id:"js.con.edi.0035", defaultMessage:"请输入编码"})
                },{
                  pattern: /^[a-zA-Z]\w*$/, message: this.props.intl.formatMessage({id:"js.con.edi.0019", defaultMessage:"编码只能以字母开头，可以由字母数字下划线组成"}),
                }]
            }) } />
            <span className='error'>
              {getFieldError('code')}
            </span>
          </FormItem>
          <FormItem className="form-item-input form-data-node">
            <Label><FormattedMessage id="js.con.edi.0036" defaultMessage="名称" /><span className="require-icon">*</span>{<FormattedMessage id="js.con.edi.0034" defaultMessage="：" />}</Label>
            <FormControl placeholder=''
              disabled={nodeLeaf.info.state === 1}
              {...getFieldProps('name', {
                validateTrigger: 'onBlur',
                initialValue: entity_items.name || '',
                onChange(value) {
                  self.props.entityContentStore.changeEditFlag(true);
                  self.setState({ entity_items: Object.assign(entity_items,{name:value}) });
                },
                rules: [{
                  required: true, message: this.props.intl.formatMessage({id:"js.con.edi.0037", defaultMessage:"请输入名称"})
                }]
            }) } />
            <span className='error'>
                {getFieldError('name')}
            </span>
          </FormItem>
        </div>
        {/* <DataModelTable/> */}
        <Button
          className={`margin-bottom-16  ${state === 1? "disabled-btn":""}`}
          colors="primary"
          disabled={state === 1}
          onClick={this.handleAdd}
        >
          <FormattedMessage id="js.con.edi.0038" defaultMessage="新增属性" />
        </Button>

        <Table
          className="mdm-table"
          data={dataSource}
          columns={columns}
          headerScroll={false}
          // getBodyWrapper={this.getBodyWrapper}
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
        {
          activeTabs === 'son' && sonActiveTab === this.props.selectIndex ? <ValidateModal recordInfo={record}/> : null
        }
        {/* {
          this.props.entityContentStore.currentNode === 'enum' ?<EnumModal/>: ''
        } */}
      </div>
    );
  }
}

export default injectIntl(Form.createForm()(TemplateTable), {withRef: true});
