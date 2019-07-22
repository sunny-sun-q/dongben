import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { Message } from 'tinper-bee';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';
import {Button }from 'components/tinper-bee';
// import { Button } from 'tinper-bee'

import Header from 'components/header/index.js'
import AuthSubeDetail from './authSubeDetail';
@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    dataMaintainStore: stores.dataMaintainStore
  }
}) @observer
class AddOrEdit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      nodeId: this.props.match.params.id
    }
    this.mdmNowUrl = window.mdmNowUrl + '';
  }

  componentWillMount(){
  }

  componentDidMount() {
  }

  save = () => {
    debugger
    let _oneInfo =  this.props.dataMaintainStore.table.oneInfo

    let systemOS = _oneInfo.sysvo
    if(undefined != systemOS){
      if("producer" === systemOS.radio_type){
        if(0 === _oneInfo.entity_writeableCount){
          console.log("给出扣示信息")
          Message.create({ content: '请选中写权限！', color: 'danger' });
          return ;
        }
      }
      if("comsumer" === systemOS.radio_type){
        if((0 === _oneInfo.entity_readableCount && 0 === _oneInfo.entity_subscribeCount)){
          console.log("给出扣示信息")
          Message.create({ content: '请至少选中可读或可订阅中至少一种权限！', color: 'danger' });
          return ;
        }
      }
      if("all" === systemOS.radio_type){
        if(0 === _oneInfo.entity_writeableCount && 0 === _oneInfo.entity_readableCount && 0 === _oneInfo.entity_subscribeCount){
          console.log("给出扣示信息")
          Message.create({ content: '请至少选中一种权限！', color: 'danger' });
          return ;
        }
      }
    }

    _oneInfo.sysvo = ""
   
    if("" == _oneInfo.code || "" == _oneInfo.name || "" == _oneInfo.pk_sysregister || undefined === systemOS){

      if("" == _oneInfo.code){
        _oneInfo.errorCode = '必输项'
      } else {
        _oneInfo.errorCode = '';
      }
      if("" == _oneInfo.name){
        _oneInfo.errorName = '必输项'
      } else {
        _oneInfo.errorName = '';
      }
      if("" == _oneInfo.pk_sysregister){
        _oneInfo.errorSys = '必输项'
      } else {
        _oneInfo.errorSys = '';
      }
      _oneInfo.isShowTip = true
      console.log("modify-sys:", this.props.dataMaintainStore.table.oneInfo)
      this.props.dataMaintainStore.table.oneInfo = _oneInfo
      this.refs.AuthSubeDetailRef.forceUpdate();
    } else{
      _oneInfo.errorCode = ''
      _oneInfo.errorName = ''
      _oneInfo.errorSys = ''
      _oneInfo.isShowTip = false

      this.props.dataMaintainStore.table.oneInfo = _oneInfo
      this.refs.AuthSubeDetailRef.forceUpdate();
      this.props.dataMaintainStore.save(this.mdmNowUrl);
    }
  }

  onBack = () => {
    window.location.href = this.mdmNowUrl;
    // window.history.go(-1);
  }

  render() {
    let { isAdd } = this.props.dataMaintainStore.table;
    let titlename = '新增授权订阅';
    if (isAdd) {
      titlename = '新增授权订阅';
    } else {
      titlename = '修改授权订阅';
    }

    return (
      <div className="main maintenance authAndSub-maintenance">
        <Header title={`${titlename}`} back={true} className="maintenance-header"> {/**backFn, title, back, children */}
          <div className="maintenance-btn">
            <Button bordered  onClick={this.onBack}>
              取消
            </Button>
            <Button  onClick={this.save} style={{ marginLeft: '16px' }}>确定</Button>
          </div>
        </Header>
        <section className="section-wrap maintenance-wrap">
          <AuthSubeDetail
            ref="AuthSubeDetailRef"
          />
        </section>
      </div>
    )
  }
}

export default AddOrEdit;
