import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {  Button, Col, Row, Label, FormControl } from 'tinper-bee';

import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import Form from 'bee-form'
const FormItem = Form.FormItem;

import Header from 'components/header/index.js'
import RefModule from '../../containers/ref-module/index.js';
import MappingPage from '../../containers/mapping-page/index.js';

@withRouter
@inject((stores) => {
  return {
    interfaceConfigurationStore: stores.interfaceConfigurationStore,
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class ConfigurationPage extends Component {
  constructor(props, context) {
    super(props, context);
    const self = this;
    this.state = {
      // showMappingModule : true,
    }
    this.cancel = this.cancel.bind(this);
    this.mdmNowUrl = window.mdmNowUrl + '';
  }

  async cancel(){
      await this.props.entityContentStore.cleanDatas();
      // await this.props.interfaceConfigurationStore.getInterfaceList();
      // 清空数据并回退
      window.location.href = this.mdmNowUrl;
      // window.history.go(-1);
  }

  componentDidMount(){
    // 根据当前接口的id查询出是否配置了相关配置，限制每个接口只能配置一个主数据
    var pk_interface = this.props.match.params.name;
    this.props.entityContentStore.getMappingDatasIfExist( pk_interface );
  }

  submit = (e) => {
    // 抑制提交事件
    e.preventDefault();
    // 获取要提交的数据
    var submitDatas = this.props.entityContentStore.mappingDatas.showMap;
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log('校验失败', values);
      } else {
        await this.props.entityContentStore.saveMapping(this.props.match.params.name, this.props.entityContentStore.tempReference.treeref_pkgd, submitDatas);
        await this.cancel();
      }
    });
    // 保存数据给后台
  }

  render() {
    const self = this;
    // let { showMappingModule } = this.state;
    let { ifEntitySelect } = this.props.entityContentStore.tempReference;

    return (
      <div className="main">

        <Header title="社会化配置" back={true}>
          <Button className="title-btn" colors="primary" onClick={this.submit}>
            提交
          </Button>
          <Button className="cancel-btn title-btn " shape="border" onClick={this.cancel}>
            取消
          </Button>
        </Header>

        <section className="section-top">
          {/* <Row className="top-label">选择主数据模型</Row> */}
          <RefModule />
        </section>

        <section className="section-bottom ">
          {
            ifEntitySelect ? (
              <MappingPage form = {this.props.form}/>
            ) : (
              <div />
            )
          }
        </section>
      </div>
    )
  }
}

export default Form.createForm()(ConfigurationPage);
