import React, { Component } from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { toJS } from "mobx";

import {  Form, Checkbox, FormControl, Icon, Tooltip, Modal } from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import dragColumn from "tinper-bee/lib/dragColumn";;
const DragColumnTable = dragColumn(Table);
import {Button} from 'components/tinper-bee';

import EnumType from './enumType'
import EnumValue from './enumValue'

import './index.less'

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

@withRouter

@inject((stores) => {
  return {
    enumTablesStore: stores.enumTablesStore
  }
}) @observer
class EnumTables extends Component {
  constructor(props) {
    super(props);
    let self = this

    this.state = {
      typeModalSize: 'lg',
      typeModalTitle: this.props.intl.formatMessage({id:"js.mdm.enum.0012", defaultMessage:"新增枚举类型"}),

      valueModalSize: 'lg',
      valueModalTitle: this.props.intl.formatMessage({id:"js.mdm.enum.0013", defaultMessage:"新增枚举�?"}),

      delTypeModalTitle: this.props.intl.formatMessage({id:"js.mdm.enum.0014", defaultMessage:"删除枚举类型"}),
      delTypeModalBody: this.props.intl.formatMessage({id:"js.mdm.enum.0015", defaultMessage:"你确定要删除此枚举类型吗?"}),

      delValueModalTitle: this.props.intl.formatMessage({id:"js.mdm.enum.0016", defaultMessage:"删除枚举�?"}),
      delValueModalBody: this.props.intl.formatMessage({id:"js.mdm.enum.0017", defaultMessage:"你确定要删除此枚举�?�吗?"}),
    };
    this.outColumns = [
      {
        title: "",
        dataIndex: "",
        key: "",
        width: 50,
      },
      {
        title: this.props.intl.formatMessage({id:"js.mdm.enum.0001", defaultMessage:"分类编码"}),
        dataIndex: "code",
        key: "code",
        width: 200,

      },
      {
        title: this.props.intl.formatMessage({id:"js.mdm.enum.0005", defaultMessage:"分类名称"}),
        dataIndex: "name",
        key: "name",
        width: 200,

      },
      {
        title: this.props.intl.formatMessage({id:"js.mdm.enum.0008", defaultMessage:"备注"}),
        dataIndex: "descri",
        key: "descri",
        width: 200,

      },
      {
        title: "",
        dataIndex: "",
        key: "",
        width: 120,
        render: (text, record, index) => {
          return (
            <ul className="display-flex handle-btn-group">
              <li onClick={() => { this.openValueModal(text, record, index) }}> <FormattedMessage id="js.mdm.enum.0013" defaultMessage="新增枚举�?" /> </li>
              <li onClick={() => { this.editEnumType(text, record, index) }}> <FormattedMessage id="js.mdm.enum.0018" defaultMessage="修改" /> </li>
              {/* <li onClick={() => { this.startOrStopEnumType(text, record, index) }}> { record.dr===0 ? '禁用' : '启用' } </li> */}
              <li onClick={() => { this.delEnumType(text, record, index) }}> <FormattedMessage id="js.mdm.enum.0019" defaultMessage="删除" /> </li>
            </ul >
          );
        }
      }
    ];

    this.innerColumns = [
      {
        title: this.props.intl.formatMessage({id:"js.mdm.enum.0001", defaultMessage:"分类编码"}),
        dataIndex: "category_code",
        key: "category_code",
        width: 200,
      },
      {
        title: this.props.intl.formatMessage({id:"js.mdm.enum.0010", defaultMessage:"编码"}),
        dataIndex: "code",
        key: "code",
        width: 200,
      },
      {
        title: this.props.intl.formatMessage({id:"js.mdm.enum.0011", defaultMessage:"名称"}),
        dataIndex: "name",
        key: "name",
        width: 200
      },
      {
        title: this.props.intl.formatMessage({id:"js.mdm.enum.0008", defaultMessage:"备注"}),
        dataIndex: "descri",
        key: "descri",
        width: 200,
      },
      {
        title: "",
        dataIndex: "",
        key: "",
        width: 200,
        render: (text, record, index) => {
          return (
            <ul className="display-flex handle-btn-group">
              <li onClick={() => { self.editEnumValue(text, record, index) }}> <FormattedMessage id="js.mdm.enum.0018" defaultMessage="修改" /> </li>
              <li onClick={() => { self.startOrStopEnumValue(text, record, index) }}> { record.dr===0 ? this.props.intl.formatMessage({id:"js.mdm.enum.0020", defaultMessage:'禁用'}) : this.props.intl.formatMessage({id:"js.mdm.enum.0021", defaultMessage:'启用'}) } </li>
              <li onClick={() => { self.delEnumValue(text, record, index) }}> <FormattedMessage id="js.mdm.enum.0019" defaultMessage="删除" /> </li>
            </ul >
          );
        }
      }
    ];
  }

  openTypeModal = () => {
    let e_type = {
      typeEcho: false,
      typeRecord: {},
      isShowTypeModal: true,
    }
    this.props.enumTablesStore.tableinfo.e_type = e_type
  }

  closeTypeModal = () => {
    let e_type = {
      typeEcho: false,
      typeRecord: {},
      isShowTypeModal: false,
    }
    this.props.enumTablesStore.tableinfo.e_type = e_type
  }

  saveEnumType = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log('校验失败', values);
      } else {
        if(values.code.replace(/(^s*)|(s*$)/g, "").length > 0  && values.name.replace(/(^s*)|(s*$)/g, "").length > 0){
          let { typeEcho, isShowTypeModal } = this.props.enumTablesStore.tableinfo.e_type
          let e_type = {
            typeEchoz: typeEcho,
            typeRecord: values,
            isShowTypeModal: isShowTypeModal
          }
          this.props.enumTablesStore.tableinfo.e_type = e_type
          console.log("saveEnumType:", values)

          await this.props.enumTablesStore.saveRowEnumType()
          await this.props.enumTablesStore.getItemsByOneRecord()
          this.forceUpdate();

        }
      }
    })
  }

  editEnumType = (text, record, index) => {
    let e_type = {
      isShowTypeModal: true,
      typeRecord: record,
      typeEcho: true
    }
    this.props.enumTablesStore.tableinfo.e_type = e_type
  }

  delEnumType = (text, record, index) => {
    console.log("delEnumType:", record.pk_enumtype)
    let e_type = {
      isShowDelTypeModal: true,
      typeRecord: record
    }
    this.props.enumTablesStore.tableinfo.e_type = e_type
  }

  closeDelTypeModal = () => {
    let e_type = {
      isShowDelTypeModal: false,
      typeRecord: {}
    }
    this.props.enumTablesStore.tableinfo.e_type = e_type
  }

  confirmDelEnumType = () => {
    this.props.enumTablesStore.delEnumType()
  }

  startOrStopEnumValue = async (text, record, index) => {
    this.props.enumTablesStore.tableinfo.e_value.valueRecord = record

    if(0===record.dr){
      this.props.enumTablesStore.tableinfo.e_value.opertype = 'stop'
    }else{
      this.props.enumTablesStore.tableinfo.e_value.opertype = 'start'
    }

    await this.props.enumTablesStore.startOrStopEnumValue()
    await this.props.enumTablesStore.getItemsByOneRecord()
    this.forceUpdate();
  }

  // startOrStopEnumType = (text, record, index) => {
  //   console.log("startOrStopEnumType:", record.pk_enumtype)
  //   this.props.enumTablesStore.tableinfo.e_type.typeRecord = record
  //   if(0===record.dr){
  //     this.props.enumTablesStore.tableinfo.e_type.opertype = 'stop'
  //   }else{
  //     this.props.enumTablesStore.tableinfo.e_type.opertype = 'start'
  //   }
  //   this.props.enumTablesStore.startOrStopEnumType()
  // }

  openValueModal = (text, record, index) => {
    let valueRecord = {}
    valueRecord.pk_enumtype = record.pk_enumtype
    valueRecord.category_code = record.code
    let e_value = {
      valueEcho: false,
      valueRecord: valueRecord,
      isShowValueModal: true,
    }
    this.props.enumTablesStore.tableinfo.e_value = e_value
  }

  closeValueModal = () => {
    console.log("e_value", this.props.enumTablesStore.tableinfo.e_value)
    let { valueEcho, valueRecord } = this.props.enumTablesStore.tableinfo.e_value
    let e_value = {
      valueEcho: valueEcho,
      valueRecord: valueRecord,
      isShowValueModal: false
    }
    this.props.enumTablesStore.tableinfo.e_value = e_value
  }

  saveEnumValue = async (e) => {
    e.preventDefault();
    this.props.form.validateFields( async (err, values) => {
      if (err) {
        console.log('校验失败', values);
      } else {
        if(values.code.replace(/(^s*)|(s*$)/g, "").length > 0  && values.name.replace(/(^s*)|(s*$)/g, "").length > 0){
          let e_value = {
            valueRecord: values
          }
          this.props.enumTablesStore.tableinfo.e_value = e_value
          console.log("saveEnumValue:", values)
          await this.props.enumTablesStore.saveRowEnumValue()
          await this.props.enumTablesStore.getItemsByOneRecord()
          this.forceUpdate();
        }
      }
    })
  }

  editEnumValue = (text, record, index) => {
    let e_value = {
      valueEcho: true,
      valueRecord: record,
      isShowValueModal: true,
    }
    this.props.enumTablesStore.tableinfo.e_value = e_value
  }

  delEnumValue = (text, record, index) => {
    let e_value = {
      isShowDelValueModal: true,
      valueRecord: record
    }
    this.props.enumTablesStore.tableinfo.e_value = e_value
  }

  closeDelValueModal = () => {
    let { valueRecord } = this.props.enumTablesStore.tableinfo.e_value
    let e_value = {
      isShowDelValueModal: false,
      valueRecord: valueRecord
    }
    this.props.enumTablesStore.tableinfo.e_value = e_value
  }

  confirmDelEnumValue = async () => {
    await this.props.enumTablesStore.delEnumValue();
    await this.props.enumTablesStore.getItemsByOneRecord()
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.enumTablesStore.getTables(1, 99999)
  }

  expandedRowRender = (record, index, indent) => {
    let innerDatas = this.props.enumTablesStore.tableinfo.outDatas[index].enumvalus
    let height = 200
    return (
      <Table
        columns={this.innerColumns}
        style={{ y: height }}
        data={innerDatas}
      />
    );
  };
  getData = async (expanded, record) => {
    if(expanded){
      let e_value = {
        valueRecord: record
      }
      this.props.enumTablesStore.tableinfo.e_value = e_value
      await this.props.enumTablesStore.getItemsByOneRecord()
      this.forceUpdate();
    }
  }
  haveExpandIcon = (record, index) => {
    return false
  }

  render() {
    let { typeModalSize, typeModalTitle, valueModalSize, valueModalTitle, delTypeModalTitle, delTypeModalBody, delValueModalTitle, delValueModalBody } = this.state
    let { isShowTypeModal, isShowDelTypeModal } = this.props.enumTablesStore.tableinfo.e_type
    let { isShowValueModal, isShowDelValueModal } = this.props.enumTablesStore.tableinfo.e_value
    let { outDatas } = this.props.enumTablesStore.tableinfo

    return (
      <div className="enum-main">
        <div className="button-group">
          <Button   onClick={() => this.openTypeModal()}>
            <FormattedMessage id="js.mdm.enum.0022" defaultMessage="新建分类" />
          </Button>
        </div>
        <div className="nest-table">
          <DragColumnTable
            columns={this.outColumns}
            data={outDatas}
            onExpand={this.getData}
            expandedRowRender={this.expandedRowRender}
            scroll={{ x: true }}
            dragborder={true}
            draggable={true}
            haveExpandIcon={this.haveExpandIcon}
          />
        </div>

        <div className="hideModal">
          <Modal
            show={isShowTypeModal}
            onHide={this.closeTypeModal}
            size={typeModalSize}
            style={{ width: 800 }}
            className="enum-type-modal"
            backdropClosable={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{typeModalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EnumType form={this.props.form}/>
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Button bordered style={{ marginRight: 20 }} onClick={this.closeTypeModal}><FormattedMessage id="js.mdm.enum.0023" defaultMessage="取消" /></Button>
              <Button  onClick={this.saveEnumType}><FormattedMessage id="js.mdm.enum.0024" defaultMessage="确认" /></Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="hideModal">
          <Modal
            show={isShowValueModal}
            onHide={this.closeValueModal}
            size={valueModalSize}
            style={{ width: 800 }}
            className="enum-value-modal"
            backdropClosable={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{valueModalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EnumValue form={this.props.form} />
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Button bordered style={{ marginRight: 20 }} onClick={this.closeValueModal}><FormattedMessage id="js.mdm.enum.0023" defaultMessage="取消" /></Button>
              <Button  onClick={this.saveEnumValue}><FormattedMessage id="js.mdm.enum.0024" defaultMessage="确认" /></Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="hideModal">
          <Modal
            show={isShowDelTypeModal}
            onHide={this.closeDelTypeModal}
            size={valueModalSize}
            style={{ width: 400 }}
            className="enum-type-modal"
            backdropClosable={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{delTypeModalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {delTypeModalBody}
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Button bordered style={{ marginRight: 20 }} onClick={this.closeDelTypeModal}><FormattedMessage id="js.mdm.enum.0023" defaultMessage="取消" /></Button>
              <Button  onClick={this.confirmDelEnumType}><FormattedMessage id="js.mdm.enum.0024" defaultMessage="确认" /></Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="hideModal">
          <Modal
            show={isShowDelValueModal}
            onHide={this.closeDelValueModal}
            size={valueModalSize}
            style={{ width: 400 }}
            className="enum-type-modal"
            backdropClosable={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{delValueModalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {delValueModalBody}
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Button bordered style={{ marginRight: 20 }} onClick={this.closeDelValueModal}><FormattedMessage id="js.mdm.enum.0023" defaultMessage="取消" /></Button>
              <Button  onClick={this.confirmDelEnumValue}><FormattedMessage id="js.mdm.enum.0024" defaultMessage="确认" /></Button>
            </Modal.Footer>
          </Modal>
        </div>

      </div>
    );
  }
}

export default injectIntl(Form.createForm()(EnumTables), {withRef: true});
