import React from "react";
import { Error } from 'utils/index'
import { FormControl, Label, Checkbox, Input, Icon, Button, Tooltip, Animate ,Message,Table} from 'tinper-bee';
import Select from 'bee-select';
const Option = Select.Option;
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';

import FieldtypeModal from '../fieldtype-modal'
import SelectDownModal from '../select-down-modal'
import ValidateModal from '../../components/validate-modal'
import PublishModal from '../../components/publish-modal'
// import EditTable from '../main-table'

import Form from 'bee-form'

const FormItem = Form.FormItem;

import renderInput from "tinper-bee/lib/InputRender.js";
import renderSelect from "tinper-bee/lib/SelectRender.js";
import dragColumn from "tinper-bee/lib/dragColumn";
import './index.less'
const InputRender = renderInput(Form, Input, Icon);
const SelectRender = renderSelect(Select, Icon);
const DragColumnTable = dragColumn(Table);
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
import { debug } from "util";


@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore,
    comboxStore: stores.comboxStore
  }
})
@observer
class DataModelTable extends React.Component {
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
    };
    this.saveMainTable = this.saveMainTable.bind(this)
    this.delTableCell = this.delTableCell.bind(this)
    this.columns = [
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0004", defaultMessage:"字段编码"}),
        dataIndex: "code",
        key: "code",
        width: 150,
        render: (text, record, index) => {
          return index === this.state.key ? (
            <input
              value={text}
              onChange={this.onCellChange(index, "code")}
            />
          ) : (text ||'')
        }
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0005", defaultMessage:"字段名称"}),
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (text, record, index) => {
          return index === this.state.key ? (
            <input
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
        width: 150,
        render: (text, record, index) => this.renderColumnsSelect(text, record, index)
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0021", defaultMessage:"长度"}),
        dataIndex: "fieldlength",
        key: "fieldlength",
        width: 100,
        render: (text, record, index) => this.renderColumnsText(text, record, index)
      },
      {
        title: this.props.intl.formatMessage({id:"js.rou.cus1.0022", defaultMessage:"必输项"}),
        dataIndex: "required",
        key: "required",
        width: 100,
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
        width: 100,
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
        width: 100,
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
        width: 100,
        render: (text, record, index) => {
          return index === this.state.key ? (
            <input
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
        width: 250,
        fixed: "right",
        render: (text, record, index) => {
          const { state } = this.props.treeStore.nodeLeaf.info;
            return (index !== this.state.key) ? (
              <ul className={`display-flex handle-btn-group ${state === 1?"disabled-oper":""}`}>
                <li onClick={() => {
                  this.editItemClick(text, record, index) }}>
                <FormattedMessage id="js.rou.cus1.0026" defaultMessage="编辑" />
                </li>
                <li onClick={
                  () => {this.onDelete(text, record, index) }
                }>
                  <FormattedMessage id="js.rou.cus1.0027" defaultMessage="删除" />
                </li>
                <li onClick={
                  () => {this.moveup(text, record, index) }
                }>
                  <FormattedMessage id="js.rou.cus1.0028" defaultMessage="上移" />
                </li>
                <li onClick={
                  () => {this.movedown(text, record, index) }
                }>
                  <FormattedMessage id="js.rou.cus1.0029" defaultMessage="下移" />
                </li>
                <li onClick={
                  () => {this.validateRules(text, record, index) }
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

  // 渲染文本框
  renderColumnsText = (text, record, index) => {
    const { fieldLengthMap } = this.props.entityContentStore.table;
    const { getFieldProps } = this.props.form;
    let fieldtype = record.fieldtype;
    return index === this.state.key ? (
      <input
        value={text}
        onChange={this.onCellChange(index, "fieldlength")}
        {...getFieldProps('fieldlength', {
          initialValue: fieldLengthMap[fieldtype] || '',
        }) }
      />
    ) : (text||'')
  }

  // 渲染下拉框
  renderColumnsSelect = (text, record, index) => {
    let { selectDataSource } = this.props.comboxStore;
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
              defaultValue=""
              onSelect={this.onSelectChange(index, record, "fieldtype", 'fieldtype_name')}
            >
              <Option value=""><FormattedMessage id="js.rou.cus1.0010" defaultMessage="请选择" /></Option>
              {_options}
            </Select>
          ) : (
            <div className="fieldtype">
              {text || ''}
              {Number(record.fieldtype) === 7 ? <i size='sm' className='uf uf-settings ref-btn' onClick={() => this.setRef(record.code,record.name,1,index,record)}></i>
                : ''}
              {Number(record.fieldtype) === 8 ? <i size='sm' className='uf uf-settings ref-btn' onClick={() => this.setSelect(record.code,record.name,1,index,record)}></i>
              : ''}
            </div>
          )
  }

  async componentWillReceiveProps(nextProps) {
    const { id: nextId } = nextProps.match.params
    const { id: prevId } = this.props.match.params
    if( nextId !== prevId ){
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
    const { entity,entity_items } = this.props.entityContentStore.table.mainTableInfo;
    this.props.entityContentStore.getFieldref(id,entity_items.pk_mdentity); //获取所有参照
    this.props.onRef && this.props.onRef(this);
    // // console.log(table)
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
    // console.log("编辑前：",this.editItemCache,"编辑后：",record);
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
    }else{ //新增状态取消，删除该行
      dataSource.splice(index,1);
      this.setState({
        ifEditStatus: true,
        count: count-1,
        key: -1,
        dataSource
      })
    }
  }

  // 确认
  async ok(text, record, index) {
    const { dataSource } = this.state;
    if( record.code=='' || record.name=='' ){
      Message.create({content: 'code and name is required!', color: 'danger'});
      return
    }
    if( record.fieldtype == ''){
      Message.create({content: this.props.intl.formatMessage({id:"js.rou.cus1.0032", defaultMessage:"请选择字段类型!"}), color: 'danger'});
      return
    }
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        // console.log('校验失败', values);
      } else {
        // console.log('提交成功', values);
        let _fieldlength = String(values.fieldlength).split(".").join(",");
        dataSource[index].fieldlength = _fieldlength;
      }
    })
    await this.props.entityContentStore.setResource([...dataSource])
    this.setState({
      dataSource:dataSource,
      ifEditStatus: true,
      key: -1
    })
  }

  /** 判断模型是否启用 */
  ifStart = () => {
    const { state } = this.props.treeStore.nodeLeaf.info;
    if( state === 1){ //启用状态
      alert(this.props.intl.formatMessage({id:"js.rou.cus1.0033", defaultMessage:"该模型已启用，请停用后再试"}))
      return true;
    }
    return false;
  }

  /** 行编辑 */
  editItemClick(text, record, index) {
    this.editItemCache = Object.assign(this.editItemCache,{
      code:record.code,
      name:record.name,
      fieldlength : record.fieldlength,
      fieldtype : record.fieldtype,
      fieldtype_name : record.fieldtype_name,
      required: record.required,
      isunique: record.isunique,
      queryatt: record.queryatt,
      defaultvalue: record.defaultvalue
    })
    // console.log("编辑前",record)
    let starting = this.ifStart();
    if(starting) return;
    this.setState({
      key: index,
      ifEditStatus: false
    })
    this.props.entityContentStore.changeEditFlag(true);
  }

  /** 行删除 */
  onDelete = async(text, record, index) => {
    let starting = this.ifStart();
    if(starting) return;
    let { count, dataSource } = this.state;
    let _del = dataSource.splice(index, 1);
    _del[0].status = 3; //删除操作标志位
    this.delItems.push(_del[0]);
    // console.log(this.delItems,"删除项")
    if(record.fieldtype === 7){ //参照
      this.props.entityContentStore.findRefByCode(record.code,record.name,3,index,record); // 3:删除标志位
    }else if(record.fieldtype === 8){
      this.props.entityContentStore.findComboByCode(record.code,record.name,3,index,record); // 3:删除标志位
    }else if(record.fieldtype === 13){
      this.props.entityContentStore.findEnumByCode(record.code,record.name,3); // 3:删除标志位
    }
    this.setState({
      dataSource,
      count:count - 1
    });
    this.props.entityContentStore.changeEditFlag(true);
  };

  /** 新增行 */
  handleAdd = () => {
    let starting = this.ifStart();
    if(starting) return;
    const { count, dataSource } = this.state;
    let orderno = this.getMaxOrderno();
    let newData = {
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
    };
    let len = dataSource.length

    if (len > 0) {
      let lastItem = dataSource[len-1]
      if (!lastItem.code || !lastItem.name) {
        Error(this.props.intl.formatMessage({id:"js.rou.cus1.0035", defaultMessage:"新增的第"}){len}this.props.intl.formatMessage({id:"js.rou.cus1.0036", defaultMessage:"行未完成"}))
        return
      }
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      key:count - 1,
      ifEditStatus: false
    });
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
    let { dataSource } = this.state;
    if(dataSource.length == 0) return;
    if(index == 0) return;
    this.swapArray(dataSource, index, index-1);
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
    let { dataSource } = this.state;
    if(dataSource.length == 0) return;
    if(index+1 == dataSource.length) return;
    this.swapArray(dataSource, index, index+1);
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
    return (value, {props:{item}}) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = item.value;
      dataSource[index][key_name] = value;
      this.setState({ dataSource });
      switch(Number(record.fieldtype)){
        case 7 : //参照
          this.setRef(record.code,record.name,'',index,record);
          break;
        case 8 : //下拉
          this.setSelect(record.code,record.name,'',index,record);
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
  setSelect = (code,name,status) => {
    this.props.entityContentStore.setSelectDownModal(true, false)
    this.props.entityContentStore.findComboByCode(code,name,status);
    this.props.entityContentStore.changeEditFlag(true);
  }

  // 输入框改变
  onCellChange = (index, key) => {
    return e => {
      const dataSource = [...this.state.dataSource];
      // console.log('oncelll===', e.target.value)
      dataSource[index][key] = e.target.value;
      // console.log(dataSource[index][key])
      this.setState({ dataSource });
    };
  };

  // 点击保存
  saveMainTable(e) {
    // e.preventDefault();
    const { dataSource } = this.state;
    const { id } = this.props.match.params
    const { nodeLeaf } = this.props.treeStore;
    const { mainTableInfo } = this.props.entityContentStore.table;
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        // console.log('校验失败', values);
      } else {
        // console.log('提交成功', values)
        // {"isworkflow":true,"isstart_us_v":true,"statistics":false,
        let entity = Object.assign(mainTableInfo.entity_items, {
            pk_gd: id,
            zztype: "1",
            code: nodeLeaf.info.code,
            name: nodeLeaf.info.name,
            tablename: ""
        },values,{
          tablename: `mdm_${nodeLeaf.info.code}`
        })
        let entity_items = dataSource.concat(this.delItems);
        // console.log(entity_items,"提交数据")
        if(entity_items.length === 0){
          alert(this.props.intl.formatMessage({id:"js.rou.cus1.0037", defaultMessage:"请完善主表信息"}))
          return
        }
        await this.props.entityContentStore.saveTableRequest(entity_items, entity)
        await this.props.entityContentStore.getTableRequest(id)
        this.props.entityContentStore.getFieldref(id); //获取所有参照
        this.props.entityContentStore.changeEditFlag(false);
        this.setState({
          dataSource: this.props.entityContentStore.table.mainTableInfo.entity || [],
          entity_items: this.props.entityContentStore.table.mainTableInfo.entity_items || {},
          count: this.props.entityContentStore.table.mainTableInfo.entity.length+1
        })
        this.delItems.length = 0;
      }
    });
  }

  delTableCell() {
    const { mulSelectItem } = this.state
    // console.log(' mulSelectItem', mulSelectItem)

    const dataSource = [...this.state.dataSource];
    let selectKey = mulSelectItem.map(item => item.key)
    let tempDataSource = dataSource.filter(item => {
      return !selectKey.includes(item.key)
    })
    this.props.entityContentStore.setResource(tempDataSource)
    this.setState({ dataSource: tempDataSource });

  }

  render() {
    let { dataSource, count, record } = this.state;
    const { expendId } = this.props
    const columns = this.columns;
    const { getFieldProps, getFieldError } = this.props.form;
    let multiObj = {
      type: "checkbox"
    };
    const { nodeLeaf,nodeLeaf:{info:{state}} } = this.props.treeStore
    const { entity,entity_items } = this.props.entityContentStore.table.mainTableInfo
    // console.log('nodeLeaf.info.state', state)
    return (
      <div className={`main-table ${this.props.className}`}>
        <Button
          className={`sql-btn margin-bottom-10 margin-right-10 ${state === 1? "disabled-btn":""}`}
          shape="border"
          size={"sm"}
          onClick={this.handleAdd}
        >
          <i className="uf uf-plus"></i>
          {this.props.intl.formatMessage({id:"js.rou.cus1.0038", defaultMessage:"新增字段"})}
        </Button>

        <DragColumnTable
          className="mdm-table"
          data={dataSource}
          columns={columns}
          getBodyWrapper={this.getBodyWrapper}
          getSelectedDataFunc={this.getSelectedDataFunc}
          scroll={{ x: "110%", y: 350 }}
        />
        {this.props.entityContentStore.currentNode === 'ref' ?
          <FieldtypeModal /> : <SelectDownModal />
        }
        <ValidateModal recordInfo={record}/>
        <PublishModal />
      </div>
    );
  }
}

export default Form.createForm()(DataModelTable)
