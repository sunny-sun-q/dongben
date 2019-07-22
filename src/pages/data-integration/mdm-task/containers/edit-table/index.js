import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import { Button,  Tooltip } from 'tinper-bee'
import {Table} from 'components/tinper-bee';
import Modal from 'bee-modal'
import Form from 'bee-form'
import "bee-pagination/build/Pagination.css"
import Pagination from 'bee-pagination';

// import 'bee-button/build/Button.css'
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';
import EditTableMain from '../edit-table-main'
import Task from '../task'



@withRouter
@inject((stores) => {
  return {
    taskTablesStore: stores.taskTablesStore
  }
}) @observer

class EditTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        addShowModal: false
    }
    this.addClick = this.addClick.bind(this);
    this.submitAdd = this.submitAdd.bind(this)
    this.closeAdd = this.closeAdd.bind(this)
    // this.startTask = this.startTask.bind(this)
    

    this.columns = [
      {
        title: "任务名称",  // 列的标题
        dataIndex: "name",  // 显示数据记录的字段
        key: "name" , // 列的键
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                width: "60px",
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
        title: "任务编码",
        dataIndex: "code",
        key: "code",
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                width: "60px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
              }}>{text}</span>
            </Tooltip>
          );
        }
      },
      { title: "cron表达式",
        dataIndex: "cronExpression",
        key: "cronExpression",
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                width: "60px",
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
        title: "任务类",
        dataIndex: "showJobClassName",
        key: "showJobClassName",
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                width: "60px",
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
        title: "执行状态",
        dataIndex: "taskState",
        key: "taskState",
        render: (text, record, index) => {
          return (
            <Tooltip inverse overlay={text}>
              <span tootip={text} style={{
                display: "inline-block",
                width: "60px",
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
        title: "操作",
        dataIndex: "oper",
        key: "oper",
        render: (text, record, index) =>{// 箭头函数传递this对象
          return (
            <ul className="display-flex handle-btn-group">
              <li onClick={() => {
                this.startTask(text, record, index)
              }}>
                启动
              </li>
              <li onClick={
                () => {this.stopTask(text, record, index) }
              }>
                暂停
              </li>
              <li onClick={
                () => {this.editTask(text, record, index) }}>
                修改
              </li>
              <li onClick={
                () => {this.deleteTask(text, record, index) }
              }>
                删除
              </li>
            </ul>
          );
        }
      }
    ];
  }

  startTask(text, record, index) {// text, record, index :第几行,从0开始

    this.props.taskTablesStore.startTask(record.taskId);
   
  }

  stopTask(text, record, index) {

    this.props.taskTablesStore.stopTask(record.taskId);
  }

  editTask(text, record, index) {
     this.props.taskTablesStore.editTask(record);
  }

  deleteTask(text, record, index) {
    this.props.taskTablesStore.deleteTask(record.taskId);
  }

  addClick() {
    
    this.setState({
      addShowModal: true,
      echo: false
    })
  }

  closeAdd() {
    this.setState({
      addShowModal: false
    })
  }

  submitAdd(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('校验失败', values);
      } else {
        console.log('values', typeof values)
        this.props.taskTablesStore.addSysRegister(values)
        this.closeAdd()
      }
    });
  }

  componentDidMount() {
    this.props.taskTablesStore.getTables(10, 1)
  }

  dataNumSelect = (index,value) =>{// => 函数自带绑定
  
    const { activePage } = this.state
    if (activePage*parseInt(value) > this.props.taskTablesStore.table.total) {
      this.setState({
        activePage: 1
      })
      this.props.taskTablesStore.getTables(parseInt(value), 1)
      return
    }
    console.log('activePage', activePage)
    this.setState({
      pageNumber: parseInt(value)
    })

    this.props.taskTablesStore.getTables(parseInt(value), activePage)
    console.log(index,value);
  }

  render() {
    const size = 'lg';
    const {info, total} = this.props.taskTablesStore.table
   
    const {pageNumber} = this.state

    let _info = [];
    info.forEach((item) => {
      _info.push({...item,
          key: item.taskId
        })
    });

    return (
      <div className="task-edit-table">
        <div className="button-group">
          <Button colors="primary" icon="download" size={size} onClick={this.addClick}>
            <i className="uf uf-add-c-o"></i>
            新增
          </Button>
        </div>

        <div className="tablesTip">任务列表</div>

        <Table
            columns={this.columns}
            data={_info}
            parentNodeId='parent'
            height={43}
            headerHeight={42}
            onRowClick={(record, index, indent) => {
              this.setState({
                selectedRowIndex: index
              });
            }}
          />

          <Pagination
            first // 第一页
            last //最后一面
            prev // 前一页
            next // 下一页
            maxButtons={5} // 显示最多页数
            boundaryLinks //显示边界按钮
            items={total%pageNumber === 0 ? total/pageNumber : total/pageNumber+1}   // 总页数
            activePage={this.state.activePage} //哪一页是激活状态
            onSelect={this.handleSelect} // 切换页的方法
            onDataNumSelect={this.dataNumSelect} // 选择每页多少条的回调函数
            showJump={true} // 是否显示跳页选择
            total={total} // 一共多少条
            dataNum={1} // 下拉选择的设定值的index
          />

        {/* <EditTableMain /> */}
        {/*  新增系统模态框 */}
        <Modal
          show={this.state.addShowModal}
          onHide={this.closeAdd}
          size={this.state.modalSize}
          style={{ width: 600 }}
          className="sysregiter-add-modal"
        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title>新增/编辑</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Task form={this.props.form} echo={this.state.echo}/>
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button shape="border" style={{ marginRight: 20 }} onClick={this.closeAdd}>取消</Button>
            <Button colors="primary" onClick={this.submitAdd}>确认</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Form.createForm()(EditTable); 
