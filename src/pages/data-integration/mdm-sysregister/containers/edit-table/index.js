import React, { Component } from 'react';
import PaginationTable from 'components/PaginationTable'
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import { Message,  Label,ButtonGroup, Tooltip } from 'tinper-bee'
import Modal from 'bee-modal'
import Form from 'bee-form'
import {Button} from 'components/tinper-bee';

// import 'bee-button/build/Button.css'
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import SysRegister from '../sysregister'

const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式

@withRouter
@inject((stores) => {
  return {
    systablesStore: stores.systablesStore

  }
}) @observer
class EditTable extends Component {
  constructor(props, context) {
    super(props, context);
    let self = this;

    this.state = {
      // 新增或修改模态框
      echo: false,
      modalTitle: '新增/修改',
      modalBody: '你确定要禁用此系统吗',
      modalSize: '',
      record: {},

      needMultiSelect: false,
      pageIndex: 1,
      pageSize: 10
    };

    // 列头
    this.columns = [
      {
        title: "系统类型",
        dataIndex: "radio_type_show",
        key: "radio_type_show",
        width: 150
      },
      {
        id: "123",
        title: "系统编码",
        dataIndex: "code",
        key: "code",
        width: 120,
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                width: "104px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
              }}>{text}</span>
            </Tooltip>
          );
        }
      },
      {
        title: "系统名称",  // 列的标题
        dataIndex: "name",  // 显示数据记录的字段
        key: "name",  // 列的键
        width: 120,
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                maxWidth: "104px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
              }}>{text}</span>
            </Tooltip>
          );
        }
      },
      {
        title: "认证令牌",
        dataIndex: "token",
        key: "token",
        width: 350
      },
      {
        title: "服务地址",
        dataIndex: "distribute_url",
        key: "distribute_url",
        width: 250,
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                width: "234px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
              }}>{text}</span>
            </Tooltip>
          );
        }
      },
      {
        title: "状态",
        dataIndex: "dr",
        key: "dr",
        width: 100,
        render: (text, record, index) => {
          return (
            <div className="status-btns">
            {record.dr === 0 ?<span className="open-btn">已启用</span>:<span className="forbid-btn">已停用</span> }
            </div>
          )
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: (text, record, index) => {
          return (
            <ul className="display-flex handle-btn-group">
                <li onClick={() => { this.startOrStopSys(text, record, index) }}> { record.dr === 0 ? '禁用' : '启用' } </li>
                <li onClick={() => { this.editSys(text, record, index) }}> { '修改' } </li>
            </ul >
          );
        }
      },
      // {
      //   title: "成功收件人邮箱",
      //   dataIndex: "suc_email_receiver",
      //   key: "suc_email_receiver",
      //   width: 150,
      //   render: (text, record, index) => {
      //     return (
      //       <Tooltip inverse overlay={text}>
      //         <span tootip={text} style={{
      //           display: "inline-block",
      //           width: "134px",
      //           textOverflow: "ellipsis",
      //           overflow: "hidden",
      //           whiteSpace: "nowrap",
      //           verticalAlign: "middle",
      //         }}>{text}</span>
      //       </Tooltip>
      //     );
      //   }
      // },
      // {
      //   title: "失败收件人邮箱",
      //   dataIndex: "fai_email_receiver",
      //   key: "fai_email_receiver",
      //   width: 150,
      //   render: (text, record, index) => {
      //     return (
      //       <Tooltip inverse overlay={text}>
      //         <span tootip={text} style={{
      //           display: "inline-block",
      //           width: "134px",
      //           textOverflow: "ellipsis",
      //           overflow: "hidden",
      //           whiteSpace: "nowrap",
      //           verticalAlign: "middle",
      //         }}>{text}</span>
      //       </Tooltip>
      //     );
      //   }
      // },
      // {
      //   title: "备注",
      //   dataIndex: "description",
      //   key: "description",
      //   width: 150,
      //   render: (text, record, index) => {
      //     return (
      //       <Tooltip inverse overlay={text}>
      //         <span tootip={text} style={{
      //           display: "inline-block",
      //           width: "134px",
      //           textOverflow: "ellipsis",
      //           overflow: "hidden",
      //           whiteSpace: "nowrap",
      //           verticalAlign: "middle",
      //         }}>{text}</span>
      //       </Tooltip>
      //     );
      //   }
      // }
    ];
  }

  componentDidMount() {
    // this.props.systablesStore.getSystables(1, 10)
  }

  componentWillMount() {
    this.props.systablesStore.getSystables(1, 10)
  }

  addSys = () => {
    this.setState({
      echo: false,
      modalTitle: "新增"
    })
    this.props.systablesStore.table.isShowModal = true
  }

  editSys = (text, record, index) => {
    this.setState({
      echo: true,
      modalTitle: "修改",
      record: record  // 用于直接传入sysModal,初始化三选一按钮
    })
    this.props.systablesStore.table.record = record // 存入store用于给sysModal回显
    this.props.systablesStore.table.isShowModal = true
  }

  // 原逻辑删除,现改为禁用/启用功能
  startOrStopSys = (text, record, index) => {

    let modalTitle = record.dr == 0 ? '禁用提示' : '启用提示'
    let modalBody = record.dr == 0 ? '你确定要禁用此系统吗' : '你确定要启用此系统吗'
    this.setState({
      startOrStopShowModal: true,
      modalTitle: modalTitle,
      modalBody: modalBody,
    })
    this.props.systablesStore.table.record = record

  }

  close = () => {
    this.props.systablesStore.table.isShowModal = false
  }

  closeStartOrStop = () => {
    this.setState({
      startOrStopShowModal: false
    })
  }

  submit = (e) => {// 新增或修改模态框保存
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let emails = []
      if(null != values.suc_email_receiver && "" != values.suc_email_receiver){
        emails = values.suc_email_receiver.split(',')
        for(let i=0; i<emails.length; i++){
          if(!reg.test(emails[i])){
            this.props.systablesStore.setErrorInfo(true,false);
            return
          }
        }
      }

      if(null != values.fai_email_receiver && "" != values.fai_email_receiver){
        emails = values.fai_email_receiver.split(',')
        for(let i=0; i<emails.length; i++){
          if(!reg.test(emails[i])){
            this.props.systablesStore.setErrorInfo(false,true);
            return
          }
        }
      }

      if (err) {
        console.log('校验失败', values);
      } else {
        this.props.systablesStore.setErrorInfo(false,false);
        if(!this.state.echo){
          this.props.systablesStore.addSysRegister(values)
        }else{
          this.props.systablesStore.editSysRegister(values)
        }
      }
    });

  }

  submitStartAndStop= () => {
    this.props.systablesStore.deleteSysRegister()
    // 关闭modal
    this.closeStartOrStop()
  }

  getSelectedDataFunc = data => {
    console.log('getSelectedDataFunc===',data);
  };

  // 分页单页数据条数选择函数
  onPageSizeSelect = (index, pageSize) => {
    let { systablesStore } = this.props
    let { pageIndex } = this.state

    systablesStore.getSystables(pageIndex, pageSize)
    this.setState({
      pageSize: pageSize
    })
  }

   // 分页组件点击页面数字索引执行函数
   onPageIndexSelect = pageIndex => {
    let { systablesStore } = this.props
    let { pageSize } = this.state

    systablesStore.getSystables(pageIndex, pageSize)
    this.setState({
      pageIndex: pageIndex
    })
  }

  render() {
    // 新增或修改模态框属性
    let { echo, record, modalTitle, modalBody, modalSize } = this.state;
    let { isShowModal } = this.props.systablesStore.table
    let { needMultiSelect, pageIndex, pageSize } = this.state
    let {info, total, totalPages } = this.props.systablesStore.table


    return (
      <div className="sysregiter-edit-table">
        <div className="button-group">
          <Button  onClick={this.addSys}>
            新增
          </Button>
        </div>
        <div className="syslistpagin">
          <PaginationTable
            needMultiSelect={needMultiSelect}
            columns={this.columns}
            data={info}

            pageIndex={pageIndex}
            pageSize={pageSize}
            totalPages={totalPages}
            total={total}

            checkMinSize={6}
            getSelectedDataFunc={this.getSelectedDataFunc}
            onPageSizeSelect={this.onPageSizeSelect}
            onPageIndexSelect={this.onPageIndexSelect}
          />
        </div>

        <div className="hideModal">
          {/*  新增/修改 系统模态框 */}
          <Modal
            show={ isShowModal }
            onHide={this.close}
            size={ modalSize }
            style={{ width: 800 }}
            className="sysregiter-addOrEdit-modal"
            backdropClosable={false}
          >
            <Modal.Header className="text-center" closeButton>
              <Modal.Title>{ modalTitle }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SysRegister form={this.props.form} echo={echo} record={record}/>
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Button bordered style={{ marginRight: 20 }} onClick={this.close}>取消</Button>
              <Button onClick={this.submit}>确认</Button>
            </Modal.Footer>
          </Modal>

          {/*  启用/停止 系统 */}
          <Modal
            show={this.state.startOrStopShowModal}
            onHide={this.closeStartOrStop}
            style={{ width: 300 }}
            className="tsysregiter-modal"
            backdropClosable={false}
          >
            <Modal.Header className="text-center" closeButton>
              <Modal.Title>
                { modalTitle }
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              { modalBody }
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Button bordered style={{ marginRight: 20 }} onClick={this.closeStartOrStop}>取消</Button>
              <Button  onClick={this.submitStartAndStop}>确认</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    )
  }
}

export default Form.createForm()(EditTable);
