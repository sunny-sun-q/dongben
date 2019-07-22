import React, { Component } from 'react';
import PaginationTable from 'components/PaginationTable'
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';


import { Checkbox, Label, Upload, Loading } from 'tinper-bee';
import Tooltip from 'bee-tooltip';
import Modal from 'bee-modal';

import "bee-pagination/build/Pagination.css"
import Pagination from 'bee-pagination';
import Form from 'bee-form'
import Table from 'bee-table';
import { success, Warning, Error } from 'utils/index'

import Combox from 'components/combox/index.js';

import { toJS } from "mobx";
import {Button} from 'components/tinper-bee';
import 'bee-table/build/Table.css';
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

const prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';// 'http://127.0.0.1:8080/iuapmdm';

@withRouter

@inject((stores => {
  return {
    treeStore: stores.treeStore,
    loadDataStore: stores.loadDataStore,
    comboxStore: stores.comboxStore
  }
})) @observer
class Edittable extends Component {
  constructor(props, context) {
    super(props, context);
    const self = this;
    this.state = {
      nodeId: '',

      fileName: '',
      selectData: [],
      isDisable: false,
      needMultiSelect: true,
      pageIndex: 1,
      pageSize: 10,
      isShowModal: false,
      isShowUploadLoading: false
    }

    this.mdmUpload = {
      name: 'file', //文件名
      action: `${prefixUrl}/loadingThirdPartService/upload`, // 上传的服务器地址
      accept: '.xls,.xlsx', //设置文件接收类型
      showUploadList: false, // 是否显示上传列表
      headers: { // 设置请求的头部信息
        authorization: 'authorization-text',
      },
      onChange(info) {// 当文件正在上传，上传成功和上传失败触发的回调函数。 当上传状态发生变化，返回下列参数。
        console.log(self.props)
        console.log(self.props.comboxStore.selectedItem.value)
        console.log(self.state.nodeId)
        self.setState({
          isShowUploadLoading: true
        })
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          self.setState({
            isShowUploadLoading: false
          })
          self.setState({
            fileName: info.file.response.fileName //服务器返回的参数
          })
          self.props.loadDataStore.getExcelData( // 获取上传后返回的excel数据
            self.props.comboxStore.selectedItem.value,
            self.state.nodeId,
            info.file.response.fileName,
            1,
            10
          )
          console.log(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          self.setState({
            isShowUploadLoading: false
          })
          console.log(`${info.file.name} file upload failed.`);
        }
      },
    }
  }

  clearTableBody() {
    this.getRequestTable()
  }

  async saveSelected(isSaveAll) {
    const { selectData } = this.state
    if (!isSaveAll && selectData.length === 0) {
      Warning('请选择要装载的数据')
      return
    }

    let entity = {
      pk_sys: this.props.comboxStore.selectedItem.value,
      pk_gd: this.props.match.params.id,
      pk_category: '',
      masterData: JSON.stringify(selectData),
      systemCode: this.props.comboxStore.selectedItem.value,
      fileName: this.state.fileName,
      saveAll: isSaveAll,
      loadType: 'manual'
    }
    await this.props.loadDataStore.saveSelected(entity)
    const { resp } = this.props.loadDataStore.loadData
    //TODO 根据后台返回条件弹出提示框
    if (resp.isAllSuccess !== true) {
      this.setState({
        isShowModal: true
      })
    }
  }

  closeModal = () => {
    this.setState({
      isShowModal: false
    })
  }

  downLoadExcel = () => {
    const { resp } = this.props.loadDataStore.loadData
    if(resp.fileName){
      window.open("/iuapmdm/loadingThirdPartService/downloadFile?fileName=" + resp.fileName);
      this.setState({
        isShowModal: false
      })
    } else{
      Error("服务器文件下载失败。")
    }
  }

  componentWillReceiveProps(nextProps) {
    let nodeId = nextProps.match.params.id
    if (nodeId && nodeId !== this.props.match.params.id) {

      let table={ header:[], body:[], total:0, pageCount:1 }
      this.props.loadDataStore.loadData.table = table

      this.setState({
        nodeId: nodeId
      })
      this.props.loadDataStore.getMasterDataSchema(nodeId)

      const { state } = this.props.treeStore.nodeLeaf.info
      if (state == 0) {
        Error("主数据未启用")
        this.setState({
          isDisable: true
        })
        //return
      } else if (state == 2) {
        Error("主数据已停用")
        this.setState({
          isDisable: true
        })
        //return
      } else {
        this.setState({
          isDisable: false
        })
      }
    }
  }

  componentDidMount() {
    let nodeId = this.props.match.params.id;
    this.props.loadDataStore.getMasterDataSchema(nodeId)
    this.setState({
      nodeId: nodeId
    })
  }

  uploadClick = () => {
    if (!this.props.comboxStore.selectedItem.value) {
      Warning('请选择集成系统')
      return
    }
    //console.log(ReactDOM.findDOMNode(this.refs.upload))
    ReactDOM.findDOMNode(this.refs.upload).click(); // 获取uplaod组件对应的真实dom   this.refs.upload是<Upload>组件的一个实例
  }

  getSelectedDataFunc = (selectedList,record,index) => {
    let body = this.props.loadDataStore.loadData.table.body
    this.setState({
      selectData: selectedList
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

  // 分页单页数据条数选择函数
  onPageSizeSelect = (index, pageSize) => {
    let { loadDataStore, comboxStore } = this.props
    let { nodeId, pageIndex, fileName } = this.state
    loadDataStore.getExcelData(
      comboxStore.selectedItem.value,
      nodeId,
      fileName,
      pageIndex,
      pageSize,
    )
    this.setState({
      pageSize: pageSize
    })
  }

  // 分页组件点击页面数字索引执行函数
  onPageIndexSelect = pageIndex => {
    let { loadDataStore, comboxStore } = this.props
    let { nodeId, pageSize, fileName } = this.state

    loadDataStore.getExcelData(
      comboxStore.selectedItem.value,
      nodeId,
      fileName,
      pageIndex,
      pageSize,
    )
    this.setState({
      pageIndex: pageIndex
    })
  }

  render() {
    const { header, body, total, pageCount } = this.props.loadDataStore.loadData.table
    const { resp } = this.props.loadDataStore.loadData
    let columns = toJS(header)

    let { needMultiSelect, pageIndex, pageSize, isDisable, isShowUploadLoading } = this.state

    return (
      <div className='data-load-containers'>
        <div className="button-group">
          <div className="left-button-group">
            <Label>集成系统：</Label>
            <Combox
              fullclassname={"com.yonyou.iuapmdm.remotesysreg.web.SysregisterCombo"}
              disabled={isDisable}
              className="load-select-sys"
            />
            <Button  disabled={isDisable} onClick={this.uploadClick} style={{marginLeft:'20px'}}>装载</Button>
            <Upload {...this.mdmUpload} >
              <Button  className="upload-button" ref='upload' style={{marginLeft:'20px'}}>
                装载
              </Button>
            </Upload>
          </div>
          <div className="right-button-group">
            <Button  disabled={isDisable} onClick={() => this.saveSelected(false)}>
              保存所选
            </Button>
            <Button  disabled={isDisable} onClick={() => this.saveSelected(true)} style={{marginLeft:'20px'}}>
              保存全部
            </Button>
          </div>

          <Modal
            show={this.state.isShowModal}
            onHide={this.closeModal}
            style={{ width: 600 }}
            className="tree-modal"
            backdropClosable={false}
          >
            <Modal.Header className="text-center" closeButton>
              <Modal.Title>
                确认信息
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-body-content">
                <h3>{resp.msg + ",是否需要下载？"}</h3>
              </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Button  bordered style={{ marginRight: 20 }} onClick={this.closeModal}>
                取消
            </Button>
            <Button  onClick={this.downLoadExcel}>
                确认
            </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <PaginationTable
          needMultiSelect={needMultiSelect}
          columns={columns}
          data={body}

          pageIndex={pageIndex}
          pageSize={pageSize}
          totalPages={pageCount}
          total={total}

          checkMinSize={6}
          getSelectedDataFunc={this.getSelectedDataFunc}
          onPageSizeSelect={this.onPageSizeSelect}
          onPageIndexSelect={this.onPageIndexSelect}
        />
        <Loading 
          loadingType='line'
          show={isShowUploadLoading}
        />
      </div>
    )
  }
}


export default Edittable;
