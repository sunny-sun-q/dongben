import React from "react";
import { Error } from 'utils/index'
import { Row, Col, FormControl, Label, Checkbox, Input, Icon, Tooltip, Animate, Message } from 'tinper-bee';
import Select from 'bee-select';
const Option = Select.Option;

import { Table } from 'components/tinper-bee';

import Form from 'bee-form'
import { Button } from 'components/tinper-bee';
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
    this.state = {
      //是否可以编辑
      editable: false,
      isMainTable: false,
      entity_pk: '',
      dataSource: [],
      entity_name: '',
      all_read: false,
      all_write: false,

      // entity_items: props.dataMaintainStore.table.mainTableInfo.entity_items || {},
      // count: 0,
      // key: -1,
      // ifEditStatus: true,
      // hoverCell: -1, // 划过的item
      // entity_items: {},
      // mulSelectItem: []
    };
    this.onChangeAllRead = this.onChangeAllRead.bind(this);
    this.onChangeAllWrite = this.onChangeAllWrite.bind(this);
    // this.delTableCell = this.delTableCell.bind(this)
  }

  onChangeAllRead() {
    let isMainTable = false;
    // 根据datasource来判断是否是主子表
    if (this.state.dataSource[0] != undefined) {
      let zztype = this.state.dataSource[0]['zztype'];
      if (zztype == 1) {
        isMainTable = true;
      } else {
        isMainTable = false;
      }
    }
    //修改state中的数据状态
    //修改datastore中的数据状态
    if (this.state.all_read) {
      this.state.all_write = false;
      this.state.dataSource.forEach((item) => {
        item['readable'] = 0;
        item['writeable'] = 0;
      });
    } else {
      this.state.dataSource.forEach((item) => {
        item['readable'] = 1;
      });
    }
    //修改checked的状态
    this.setState({
      all_read: !this.state.all_read,
      all_write: this.state.all_write,
      dataSource: this.state.dataSource,
    });
  }

  onChangeAllWrite() {
    let isMainTable = false;
    // 根据datasource来判断是否是主子表
    if (this.state.dataSource[0] != undefined) {
      let zztype = this.state.dataSource[0]['zztype'];
      console.log('zzzzzzzzzzzzzzzzType', zztype);
      if (zztype == 1) {
        isMainTable = true;
      } else {
        isMainTable = false;
      }
    }
    //修改state中的数据状态
    //修改datastore中的数据状态
    if (this.state.all_write) {
      this.state.dataSource.forEach((item) => {
        item['writeable'] = 0;
      });
    } else {
      this.state.all_read = true;
      this.state.dataSource.forEach((item) => {
        //可写必须可读
        item['writeable'] = 1;
        item['readable'] = 1;
      });
    }
    this.setState({
      all_write: !this.state.all_write,
      all_read: this.state.all_read,
      dataSource: this.state.dataSource,
    });
  }

  editItemClick(text, record, index) {
    this.setState({
      key: record.key,
      ifEditStatus: false
    })
  }

  onDelete = (text, record, index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.props.dataMaintainStore.setResource(dataSource)
    this.setState({ dataSource });
  };

  componentDidMount() {
    let dataSource = this.props.data;
    let all_read = false;
    let all_write = false;
    if (dataSource != undefined && dataSource[0] != undefined) {
      all_read = dataSource.every((item) => {
        return item["readable"] == 1;
      });
      all_write = dataSource.every((item) => {
        return item['writeable'] == 1;
      });
    }


    this.setState({
      dataSource: this.props.data || [],
      entity_name: this.props.data[0] == undefined ? '' : this.props.data[0]['entityName'],
      entity_pk: this.props.data[0] == undefined ? '' : this.props.data[0]['pk_entity'],
      all_read,
      all_write,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      //
      let dataSource = this.props.data;
      let all_read = false;
      let all_write = false;
      if (dataSource != undefined && dataSource[0] != undefined) {
        all_read = dataSource.every((item) => {
          return item["readable"] == 1;
        });
        all_write = dataSource.every((item) => {
          return item['writeable'] == 1;
        });
      }
      //
      this.setState({
        dataSource: nextProps.data || [],
        entity_name: nextProps.data[0]['entityName'] || '',
        entity_pk: nextProps.data[0]['pk_entity'] || '',
        all_read,
        all_write,
      })
    }
  }

  // checkbox 切换
  onCheckChange = (text, index, record, key) => {
    // return () => {
    let txt = text == 0 ? 1 : 0;
    const dataSource = [...this.state.dataSource];
    dataSource[index][key] = txt;
    //可读必须可写
    if (key == "writeable" && dataSource[index][key] == 1) {
      dataSource[index]["readable"] = 1;
    }
    //不可读必须不可写
    if (key == "readable" && dataSource[index][key] == 0) {
      dataSource[index]["writeable"] = 0;
    }
    //
    let all_read = false;
    let all_write = false;
    //
    if (dataSource.every(item => {
      return (item.readable == 1);
    })) {
      all_read = true;
    } else {
      all_read = false;
    }
    //
    if (dataSource.every(item => {
      return (item.writeable == 1);
    })) {
      all_write = true;
    } else {
      all_write = false;
    }

    this.setState({ dataSource, all_read, all_write });
    // };
  };

  // 下拉选择
  // onSelectChange = (index, key, key_name) => {
  //   return (value, { props: { item } }) => {
  //     console.log(item)
  //     console.log(`selected ${value} ${item}`);
  //     const dataSource = [...this.state.dataSource];
  //     dataSource[index][key] = item.value;
  //     dataSource[index][key_name] = value;
  //     this.setState({ dataSource });

  //   };
  // };

  // 输入框改变
  onCellChange = (index, key) => {
    return e => {
      const dataSource = [...this.state.dataSource];
      console.log('oncelll===', e.target.value)
      dataSource[index][key] = e.target.value;
      this.setState({ dataSource });
    };
  };

  render() {
    let { dataSource } = this.state;
    let { editState } = this.props.dataMaintainStore.table;
    // const columns = this.columns;
    const { getFieldProps, getFieldError } = this.props.form;
    const { nodeLeaf } = this.props.treeStore;
    const { entity_items } = this.props.dataMaintainStore.table.mainAuthInfo;
    let columns = [
      {
        title: "字段编码",
        dataIndex: "attrCode",
        key: "attrCode",
        width: '25%',
      },
      {
        title: "字段名称",
        dataIndex: "attrName",
        key: "attrName",
        width: '25%',
      },
      {
        title: <div><Checkbox
          checked={this.state.all_read}
          onChange={this.onChangeAllRead}
          disabled={editState == 2 ? true : false}
        >
        </Checkbox><span>查看权限</span></div>,
        dataIndex: "readable",
        key: "readable",
        width: '25%',
        render: (text, record, index) => {
          let { editState } = this.props.dataMaintainStore.table;
          return (
            <Checkbox
              checked={record.readable}
              disabled={editState == 2 ? true : false}
              onChange={() => this.onCheckChange(text, index, record, "readable")}
            />
          )
        }
      },
      {
        title: <div>
          <Checkbox
            checked={this.state.all_write}
            onChange={this.onChangeAllWrite}
            disabled={editState == 2 ? true : false}
          >
          </Checkbox>
          <span>编辑权限</span>
        </div>,
        dataIndex: "writeable",
        key: "writeable",
        width: '25%',
        render: (text, record, index) => {
          let { editState } = this.props.dataMaintainStore.table;
          return (
            <Checkbox
              checked={record.writeable}
              disabled={editState == 2 ? true : false}
              onChange={() => this.onCheckChange(text, index, record, "writeable")}
            />
          );
        }
      },
    ];
    // const entity_name = mainAuthInfo[0]['entityName'] || '';

    return (
      <div className="main-table main-table-wrap">
        <div>
          <Table
            className="mdm-table"
            data={dataSource}
            columns={columns}
          // getBodyWrapper={this.getBodyWrapper}
          />
        </div>

      </div >
    );
  }
}

export default Form.createForm()(TemplateTable)
