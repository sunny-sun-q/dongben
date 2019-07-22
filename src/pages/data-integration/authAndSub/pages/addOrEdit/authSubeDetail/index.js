import React from "react";
import { Error } from 'utils/index'
import { Label, FormControl, Row, Col, Tabs, Checkbox } from 'tinper-bee';
// import { Select } from 'tinper-bee';
// import Select from 'bee-select';
// const Option = Select.Option;

// import Form from 'bee-form';
// const FormItem = Form.FormItem;
import FormList from 'components/FormList';
import Combox from 'components/combox/index.js';
const FormItem = FormList.Item;
import TemplateTable from './temple'
const { TabPane } = Tabs;

import { toJS } from "mobx";

// import SeniorSearch from '../../../containers/SeniorSearch';
import SeniorSearch from 'components/SeniorSearch/index.js'

import './index.less'
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

let index = 1;

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    dataMaintainStore: stores.dataMaintainStore,
    comboxStore: stores.comboxStore,
    seniorSearchStore: stores.seniorSearchStore
  }
}) @observer
class AuthSubeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      activeKey: '主表',
      initCondition: ''
    };
    this.mdmNowUrl = window.mdmNowUrl + '';
  }

  componentWillUpdate() {
  }

  componentWillReceiveProps(nextProps) {
  }
  async componentDidMount() {
    // debugger
    // await this.props.comboxStore.getCombox('com.yonyou.iuapmdm.remotesysreg.web.SysregisterCombo')
  }

  open = () => {
    this.props.seniorSearchStore.setSeniorModal(true)
  }

  save = async () => {
    window.location.href = this.mdmNowUrl;
    // window.history.go(-1);
  }

  getExtCondition = (extCondition) => {
    debugger
    this.props.dataMaintainStore.table.oneInfo.extCondition = extCondition;
  }

  construct() {
    let { sysAuths } = this.props.dataMaintainStore.table.oneInfo;
    if (undefined == sysAuths || sysAuths.length == 0) {
      return;
    }

    let subTabs = sysAuths.slice(1, sysAuths.length)

    return [
      <TabPane
        tab={<span>{sysAuths[0].name }</span>}
        key={`主表`}
      >
        <div>
          <TemplateTable selectIndex={0}
          />
        </div>
      </TabPane>,
    ].concat(subTabs.map((t, index) => {
      return (
        <TabPane
          tab={<span>{subTabs[index].name}</span>}
        // tab={<span>{`子表${index + 1}`}</span>}
          key={`子表${index + 1}`}
        >
          <div>
            <TemplateTable selectIndex={`${index + 1}`}
            />
          </div>
        </TabPane>);
    }));
  }

  onBack = async () => {
    window.history.go(-1);
  }

  onAuthSubeChange = (key) => {
    return (value) => {
      let oneInfo = toJS(this.props.dataMaintainStore.table.oneInfo);
      let _oneInfo = Object.assign({}, oneInfo);
      if("readable" == key || "writeable" == key || "subscribe" == key){
        value = value ? 1 : 0

        let _sysAuths = _oneInfo.sysAuths
        for(let i=0; i< _sysAuths.length; i++ ){
          _sysAuths[i][key] = value
          let _itemVOs =  _sysAuths[i].itemVOs;
          for(let j=0; j<_itemVOs.length; j++){
            _itemVOs[j][key] = value
          }
        }
      }
      if("pk_sysregister" == key){
        let options = toJS(this.props.comboxStore.selectDataSource);
        options.map((item) => {
          if(item.value == value){
            _oneInfo.sysname = item.text
          }
        })
      }

      _oneInfo[key] = value;

      this.props.dataMaintainStore.table.oneInfo = _oneInfo
    }
  }

  onTabChange = (activeKey) => {
    console.log("onTabChange:", activeKey)
    this.setState({
      activeKey: activeKey
    });
  }

  getSelectSysItem = (item)=>{
    let oneInfo = toJS(this.props.dataMaintainStore.table.oneInfo);
    let _oneInfo = Object.assign({}, oneInfo);
    let entityCount = _oneInfo.sysAuths.length
    _oneInfo.entity_readableCount = entityCount
    _oneInfo.entity_writeableCount = entityCount
    _oneInfo.entity_subscribeCount = entityCount

    _oneInfo.pk_sysregister = item.value
    _oneInfo.sysname = item.text
    _oneInfo.sysvo = item.sysRegisterVO
    if("producer" == item.sysRegisterVO.radio_type){
      _oneInfo.readable = 0
      _oneInfo.readableDisabled = 1
      _oneInfo.subscribe = 0
      _oneInfo.subscribeDisabled = 1
      _oneInfo.writeable = 1
      _oneInfo.writeableDisabled = 0

      let _sysAuths = _oneInfo.sysAuths
      for(let i=0; i< _sysAuths.length; i++ ){
        _sysAuths[i].readable = 0
        _sysAuths[i].subscribe = 0
        _sysAuths[i].writeable = 1
        let _itemVOs =  _sysAuths[i].itemVOs;
        for(let j=0; j<_itemVOs.length; j++){
          _itemVOs[j].readable = 0
          _itemVOs[j].subscribe = 0
          _itemVOs[j].writeable = 1
        }
      }
    }

    if("comsumer" == item.sysRegisterVO.radio_type){
      _oneInfo.readable = 1
      _oneInfo.readableDisabled = 0
      _oneInfo.subscribe = 1
      _oneInfo.subscribeDisabled = 0
      _oneInfo.writeable = 0
      _oneInfo.writeableDisabled = 1
      let _sysAuths = _oneInfo.sysAuths
      for(let i=0; i< _sysAuths.length; i++ ){
        _sysAuths[i].readable = 1
        _sysAuths[i].subscribe = 1
        _sysAuths[i].writeable = 0
        let _itemVOs =  _sysAuths[i].itemVOs;
        for(let j=0; j<_itemVOs.length; j++){
          _itemVOs[j].readable = 1
          _itemVOs[j].subscribe = 1
          _itemVOs[j].writeable = 0
        }
      }
    }

    if("all" == item.sysRegisterVO.radio_type){
      _oneInfo.readable = 1
      _oneInfo.readableDisabled = 0
      _oneInfo.subscribe = 1
      _oneInfo.subscribeDisabled = 0
      _oneInfo.writeable = 1
      _oneInfo.writeableDisabled = 0
      let _sysAuths = _oneInfo.sysAuths
      for(let i=0; i< _sysAuths.length; i++ ){
        _sysAuths[i].readable = 1
        _sysAuths[i].subscribe = 1
        _sysAuths[i].writeable = 1
        let _itemVOs =  _sysAuths[i].itemVOs;
        for(let j=0; j<_itemVOs.length; j++){
          _itemVOs[j].readable = 1
          _itemVOs[j].subscribe = 1
          _itemVOs[j].writeable = 1
        }
      }
    }
    console.log("select_sys_oneInfo:", _oneInfo)
    this.props.dataMaintainStore.table.oneInfo = _oneInfo
  }

  render() {
    let { activeKey } = this.state

    let oneInfo = this.props.dataMaintainStore.table.oneInfo
    let { isAllDisabled, isShowTip, errorCode, errorName, errorSys, extCondition } = this.props.dataMaintainStore.table.oneInfo

    let { pk_gd } = this.props.dataMaintainStore.table.nodeinfo
    const errorClassName =  'error-tip';

    return (
      <div style={{ width: '100%' }}>
        <div className={`second-table ${this.props.className}`}>

          <div className='data-maintenance-detail'>
            <div className="main-data-form">
              <FormList size="sm">
                <FormItem label="主数据:" >
                  <FormControl
                    disabled={true}
                    className="demo1-input"
                    value={oneInfo.gdname}
                  />
                  <FormControl
                    disabled={true}
                    type="hidden"
                    className="demo1-input"
                    value={oneInfo.pk_gd}
                  />
                  <FormControl
                    disabled={true}
                    type="hidden"
                    className="demo1-input"
                    value={oneInfo.pk_auth_sube_id}
                  />
                </FormItem>
                <FormItem label={'编码:'} required>
                  <FormControl
                    className="demo1-input"
                    value={oneInfo.code}
                    onChange={this.onAuthSubeChange("code")}
                  />
                  <span className={errorClassName}>
                      {errorCode && isShowTip ? errorCode : ''}
                  </span>
                </FormItem>
                <FormItem label={'名称:'} required>
                    <FormControl
                      className="demo1-input"
                      value={oneInfo.name}
                      onChange={this.onAuthSubeChange("name")}
                    />
                    <span className={errorClassName}>
                        {errorName && isShowTip ? errorName : ''}
                    </span>
                </FormItem>
                <FormItem label={'集成系统:'} required>
                  <Combox
                    fullclassname={"com.yonyou.iuapmdm.remotesysreg.web.SysregisterCombo"}
                    disabled={false}
                    getSelectItem = {this.getSelectSysItem}
                    defaultValue={oneInfo.sysname}
                  />
                  <span className={errorClassName}>
                    {errorSys && isShowTip ? errorSys : ''}
                  </span>
                </FormItem>
                <FormItem label="条件:" className="senior-search-item">
                  <FormControl placeholder=''
                    readOnly
                    value={this.props.dataMaintainStore.table.oneInfo.extCondition}
                    onClick={this.open}
                  />
                  <SeniorSearch
                    className="senior-search"
                    title={"条件编辑"}
                    fontStyle='icon'
                    pk_gd={pk_gd}
                    pk_category={''}
                    getData={(extCondition) => this.getExtCondition(extCondition)}
                    appendType = { true }
                    initCondition = { extCondition }
                    url = '/mdmblood/advSearch'
                  />
                </FormItem>
              </FormList>
            </div>
          </div>
          <div className="tabs-wrap auth-sube-tabs">
            <Tabs
              activeKey={activeKey}
              onChange={this.onTabChange}
              defaultActiveKey={activeKey}
              animated={false}
            >
              {this.construct()}
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default FormList.createForm()(AuthSubeDetail)
