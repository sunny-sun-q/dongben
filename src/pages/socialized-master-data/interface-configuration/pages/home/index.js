import React, { Component } from 'react';
import {  FormControl, Button, Col, Row ,Label, Modal } from 'tinper-bee';
import PaginationTable from 'components/PaginationTable'
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import Header from 'components/header/index.js'

@withRouter
@inject((stores) => {
  return {
    interfaceConfigurationStore: stores.interfaceConfigurationStore
  }
}) @observer
class Home extends Component {
  constructor(props, context) {
    super(props, context);
    const self = this;
    this.state = {
      hint: " 搜接口名称/功能",
      searchValue: "",
      showModal: false,
      showModalinfo : ''
    }
    this.defaultcolums = 
    [
      {
        title: "接口名称",
        dataIndex: "interface_name",
        key: "interface_name",
        width: "170px",
      },{
        title: "功能",
        dataIndex: "interface_description",
        key: "interface_description",
        width: "300px",
      },{
        title: "接口状态",
        dataIndex: "tenant_inter_status",
        key: "tenant_inter_status",
        width: "150px",
        render: (text, record, index) => {
          // 0未购买  // 1购买
          return ( text == 1 ) ? (
            <Button className="stateClass" >已购买</Button>
          ) : (
            <Button className="unbuy-btn">未购买</Button>
          )
        }
      },{
        title: "使用方式",
        dataIndex: "instructions_interface",
        key: "instructions_interface",
        width: "150px",
      },{
        title: "使用方式详情描述",
        dataIndex: "instructions_details_interface",
        key: "instructions_details_interface",
        width: "220px",
      },{
        title: "配置状态",
        dataIndex: "is_configuration_successful",
        key: "is_configuration_successful",
        width: "150px",
        render: (text, record, index) => {
          // 0未配置  // 1,2,3,4  //-1配置成功
          switch (text) {
            case 0:
            return <Button className="unbuy-btn"  >未配置</Button>;
              break;
            case 1:
              return <Button className="stateClass"  >配置完成</Button>;
              break;
            // case -1:
            //   return <Button className="stateClass" colors="primary" >配置完成</Button>;
            //   break;
            default :
              return <Button className="unbuy-btn" colors="primary">未配置</Button>;
              break;
          }
        }
      },{
        title: "操作",
        dataIndex: "operate",
        key: "operate",
        width: "130px",
        render(text, record, index) {
          return (
            <div className='operation-btn'>
              <li
                tooltip={text}
                onClick={() => { self.cellClick(record) }}
              >
                配置
              </li>
            </div>
          )
        }
      },
    ]
  }

  /**
   * 按配置按钮跳转不同页面
   */
  cellClick(record){
      if( record.tenant_inter_status == 2 ){
        this.setState({
          showModal : true,
          showModalinfo : "请先购买 [ " + record.interface_name + " ] 接口 ",
        })
      }else if( record.tenant_inter_status == 1 ){
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/configurationpage/${record.pk_interfaceinfo}`)
      }
  }

  onChange = (value) => {
    this.setState({
      searchValue:value,
    })
  }

  // 分页单页数据条数选择函数
  onPageSizeSelect = (index, pageSize) => {
    let pagingInfo = this.props.interfaceConfigurationStore.intefaceData.pagingInfo;
    // pagingInfo.realIndex = index; 这里了的index是pagesize所在数组的index
    // pageSize改变后当前页数发生变化置为-1
    pagingInfo.realIndex = -1;
    pagingInfo.realSize = pageSize;
    this.props.interfaceConfigurationStore.getInterfaceList(this.state.searchValue);
  }

  // 分页组件点击页面数字索引执行函数
  onPageIndexSelect = pageIndex => {
    let pagingInfo = this.props.interfaceConfigurationStore.intefaceData.pagingInfo;
    pagingInfo.realIndex = pageIndex; 
    this.props.interfaceConfigurationStore.getInterfaceList(this.state.searchValue);
  }

  onSearch = (value) => {
    let searchValue = this.state.searchValue;
    let interfaceConfigurationStore = this.props.interfaceConfigurationStore;
    let pagingInfo = interfaceConfigurationStore.intefaceData.pagingInfo;
    pagingInfo.realIndex = -1;
    // pagingInfo.pageSize = -1;
    interfaceConfigurationStore.getInterfaceList(searchValue);
  }

  close() {
    this.setState({
      showModal: false
    });
  }

  componentDidMount(){
    // 通过商店加载接口列表
    let interfaceConfigurationStore = this.props.interfaceConfigurationStore;
    interfaceConfigurationStore.getInterfaceList();
  }

  render() {
    let { intefaceInfo, pagingInfo } = this.props.interfaceConfigurationStore.intefaceData;
    let { defaultIndex, defaultSize, realIndex, realSize, total, totalPages } = pagingInfo;
    let { tableDatas } = intefaceInfo;
    let {  showModal, showModalinfo, hint } = this.state;
    let columns = this.defaultcolums;
    return (
      <div className="main">
        {/* <Header title="社会化配置" /> */}
        {/* 社会化主数据接口 */}
        
        <div className="tableHeader">
          <Row className="tableTitle"></Row>
          <FormControl 
            className="input" 
            // defaultValue={this.state.hint} 
            placeholder={hint}
            onSearch={this.onSearch.bind(this)} 
            onChange={this.onChange}  
            type="search"
          />
        </div>

        <PaginationTable
          needMultiSelect={false}
          className = "myTableClass"
          data={tableDatas}
          pageIndex={realIndex == -1 ? defaultIndex : realIndex}
          pageSize={realSize == -1 ? defaultSize : realSize}
          totalPages={totalPages}
          total={total}
          columns={columns}
          checkMinSize={6}
          // getSelectedDataFunc={this.tabelSelect}
          // onTableSelectedData={this.onTableSelectedData}
          onPageSizeSelect={this.onPageSizeSelect.bind(this)}
          onPageIndexSelect={this.onPageIndexSelect}
          scroll={{x: true, y: 450}}
        />

        <Modal
            show = { showModal }
            onHide = { this.close.bind(this) } >
                <Modal.Header closeButton>
                    <Modal.Title>提示：</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    { showModalinfo }
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={ this.close.bind(this) } colors="primary">确认</Button>
                </Modal.Footer>
           </Modal>
      </div>
    )
  }
}

export default Home;
