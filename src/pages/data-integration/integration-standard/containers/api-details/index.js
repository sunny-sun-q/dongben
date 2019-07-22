import React, { Component } from "react";
import {  Tooltip} from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import './index.less'
import Sysregister from '../../containers/sysregister-authority/index'
import {Button} from 'components/tinper-bee';
import imgUrl from '../../../../../assets/images/nodata_stand.png';
import {
  inject,
  observer
} from 'mobx-react';

import {
  withRouter
} from 'react-router-dom';

import {
  observable,
  action,
} from 'mobx'

const header_columns = [{ title: "参数名", dataIndex: "paramName", key: "paramName", width: "200px" },
{ title: "必填", dataIndex: "isMust", key: "isMust", width: "120px" },
{ title: "描述", dataIndex: "paramDescribe", key: "paramDescribe", width: "150px" },
{ title: "备注", dataIndex: "defaultValue", key: "defaultValue", width: "150px" }
];

const url_columns = [{ title: "参数名", dataIndex: "paramName", key: "paramName", width: "200px" },
{ title: "必填", dataIndex: "isMust", key: "isMust", width: "120px" },
{ title: "描述", dataIndex: "paramDescribe", key: "paramDescribe", width: "200px" },
{ title: "备注", dataIndex: "defaultValue", key: "defaultValue", width: "100px" }
];

const body_columns = [{ title: "参数名", dataIndex: "paramName", key: "paramName", width: "200px" },
{ title: "类型", dataIndex: "type", key: "type", width: "120px" },
{ title: "是否数组", dataIndex: "isArray", key: "isArray", width: "160px" },
{ title: "必填", dataIndex: "isMust", key: "isMust", width: "120px" },
{ title: "描述", dataIndex: "paramDescribe", key: "paramDescribe", width: "400px" },
  // { title: "默认值", dataIndex: "defaultValue", key: "value", width: "100px" }
];

const result_columns = [{ title: "参数名", dataIndex: "paramName", key: "paramName", width: "200px" },
{ title: "类型", dataIndex: "type", key: "type", width: "120px" },
{ title: "是否数组", dataIndex: "isArray", key: "isArray", width: "160px" },
{ title: "必填", dataIndex: "isMust", key: "isMust", width: "120px" },
{ title: "描述", dataIndex: "paramDescribe", key: "paramDescribe", width: "400px" },
  // { title: "默认值", dataIndex: "defaultValue", key: "value", width: "100px" }
];

const prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';
const visitHost = process.env.NODE_ENV === 'development' ? 'localhost:8080' : window.location.host;

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    apiStore: stores.apiStore,
    menuStore: stores.menuStore,
    sysregisterStroe: stores.sysregisterStroe,
  }

}) @observer
class Apidetails extends Component {

  constructor(props) {
    super(props);
    this.wsdl = this.wsdl.bind(this)
  }

  wsdl(oeder, realUrl) {
    if(oeder === 'showWsdl'){
      window.open(realUrl);
    }else if(oeder === 'downWsdl'){
      // window.open(prefixUrl + "/openapi/downloadwsdl?wsdlUrl=" + realUrl)
      window.open(prefixUrl + "/openapi/downloadwsdl")
    }
  }

  componentWillUpdate(){
    this.getApiDetails(this.props.apiStore.openapi)
  }

  getApiDetails(openapi) {
    let { code, superiorCoding } = this.props.menuStore.menu;
    let pk_gd = this.props.pk_gd;

    if (this.props.treeStore.tree.isleaf) {
      return (
        <div>
          {openapi.info.url != null ?
            <div className="simpleline">
              <strong>接口地址：</strong>
              <span>{ openapi.info.url.replace('ip:port', visitHost)}</span>
              {superiorCoding == 'webservice' && code != 'webserviceDistribute' ?
                <div>
                  <Button  onClick={() => this.wsdl("showWsdl",openapi.info.url.replace('ip:port', visitHost))}>查看服务定义</Button>
                  <Button  onClick={() => this.wsdl("downWsdl",openapi.info.url.replace('ip:port', visitHost))}>服务定义下载</Button>
                </div>
                :
                ""
              }
            </div>
            : ''}

          {openapi.info.method != null && openapi.info.method != '' ?
            <div className="simpleline">
              <strong>方法：</strong>
              <span>{openapi.info.method}</span>
            </div>
            : ''}

          {openapi.info.requestMethod != null && openapi.info.requestMethod != '' ?
            <div className="simpleline">
              <strong>请求方式：</strong>
              <span>{openapi.info.requestMethod}</span>
            </div>
            : ''}

          {openapi.url_data.length > 0 ?
            <div className="simpleline">
              <strong>请求参数(url):</strong>
              <row />
              <Table
                columns={url_columns}
                data={openapi.url_data}
                parentNodeId='parent'
                height={43}
                headerHeight={42}
              />
            </div>
            : ''}

          {openapi.rs_header_data.length > 0 ?
            <div className="simpleline">
              <strong>请求参数(header):</strong>
              <Table
                columns={header_columns}
                data={openapi.rs_header_data}
                parentNodeId='parent'
                height={43}
                headerHeight={42}
              />
            </div>
            : ''}

          {openapi.rs_body_data.length > 0 ?
            <div className="simpleline">
              <strong>请求参数(body):</strong>
              <Table
                columns={body_columns}
                data={openapi.rs_body_data}
                parentNodeId='parent'
                height={43}
                headerHeight={42}
              />
              <strong>请求参数示例说明:</strong>
              <Sysregister pk_gd={pk_gd} resultType='body' />
            </div>
            : ''}

          {openapi.ws_header_data.length > 0 ?
            <div className="simpleline">
              <strong>请求参数ー:</strong>
              <Table
                columns={header_columns}
                data={openapi.ws_header_data}
                parentNodeId='parent'
                height={43}
                headerHeight={42}
              />
            </div>
            : ''}

          {openapi.ws_body_data.length > 0 ?
            <div className="simpleline">
              <strong>请求参数二:</strong>
              <Table
                columns={body_columns}
                data={openapi.ws_body_data}
                parentNodeId='parent'
                height={43}
                headerHeight={42}
              />
              <strong>请求参数示例说明:</strong>
              <Sysregister pk_gd={pk_gd} resultType='body' />
            </div>
            : ''}

          {openapi.distribute_data.length > 0 ?
            <div className="simpleline">
              <strong>分发数据参数:</strong>
              <Table
                columns={result_columns}
                data={openapi.distribute_data}
                parentNodeId='parent'
                height={43}
                headerHeight={42}
              />
              <strong>分发数据参数示例说明:</strong>
              <Sysregister pk_gd={pk_gd} resultType='body' />
            </div>
            : ''}

          {/* && superiorCoding != 'webservice' */}
          {openapi.result_data.length > 0 ?
            <div className="simpleline">
              <strong>返回类型参数:</strong>
              <Table
                columns={result_columns}
                data={openapi.result_data}
                parentNodeId='parent'
                height={43}
                headerHeight={42}
              />
              <strong>返回类型参数示例说明:</strong>
              <Sysregister pk_gd={pk_gd} resultType='result' />
            </div>
            : ''}

          {/* {this.props.treeStore.tree.isleaf ? <Sysregister type='result' /> : ''} */}
        </div>
      )
    } else {
      return (<div className="no-data-display">
      <div>
          <img src={imgUrl} className="pic"></img>
      </div>
      <div className="word">
          {/* <FormattedMessage id="js.rou.stand.00221" defaultMessage="请选择具体主数据来查看集成的标准； " />
          <FormattedMessage id="js.rou.stand.00222" defaultMessage="生产系统或消费系统根据集成标准开发对接，主数据产品无须开发；" /> */}
          <span>请选择具体主数据来查看集成的标准；</span>
          <span>生产系统或消费系统根据集成标准开发对接，主数据产品无须开发；</span>
      </div>
      </div>);
    }
  }

  render() {
    return (
      this.getApiDetails(this.props.apiStore.openapi)
    )
  }
}

export default Apidetails;
