import React,{Component} from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import './index.less'
import {
  inject,
  observer,

} from 'mobx-react';

import {toJS} from "mobx";

import _ from 'lodash'

import Modal from 'bee-modal'
import {  Label,Message } from 'tinper-bee'
import Header from 'components/header/index.js'
import Siderbartree from 'components/tree/index.js'
import EditTable from '../../containers/edit-table'
import NodeInfoEdit from '../../containers/node-info-edit'
import CheckModel from '../../components/check-modal'
import {getContextId,contextBack} from 'utils';
const contextId = getContextId();
@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore
  }
}) @observer
class Leaf extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: this.props.match.params.id,
      modalShow: false
    }
  }


  // async componentDidMount() {
  //   await this.props.entityContentStore.getTableRequest(this.props.match.params.id)
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id && nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({
        id: nextProps.match.params.id
      })
      this.props.entityContentStore.getTableRequest(nextProps.match.params.id)
    }
  }

  componentDidMount() {
    // this.props.entityContentStore.getTableRequest(this.props.match.params.id)
  }

  // 是否提示 用户保存
  checkIsSave = (node) => {
    const { entity, cacheEntity } = this.props.entityContentStore.table.mainTableInfo;
    const { secondTableInfo ,editIndex} = this.props.entityContentStore.table;
    // secondTableInfo:{entity: secondCacheEntity }
    let secondEntity = secondTableInfo.entity

    const { activeTabs, sonActiveTab } = this.props.entityContentStore.tableStatus
    // console.log(entity.length)
    // console.log(cacheEntity.length)

    // tableStatus = {
    //   activeTabs: 'father',
    //   sonActiveTab: ''
    if(editIndex > -1){
      Message.create({ content: this.props.intl.formatMessage({id:"js.rou.cus1.0086", defaultMessage:"编辑未完成，请确认或取消"}), color : 'danger'});
      return true
    }
    if (activeTabs == 'father') {
      let _entity = toJS(entity)
      let _cacheEntity = toJS(cacheEntity)
      if (!(_.isEqual(_entity, _cacheEntity))) {
        this.props.treeStore.setConfirmSaveModal(true)
        return true
      }
    }
    // else {
    //   let _entity = toJS(entity)
    //   let _cacheEntity = toJS(secondTableInfo[sonActiveTab].entity)
    //   if (!(_.isEqual(_entity, _cacheEntity))) {
    //     this.setState({
    //       modalShow: true
    //     })
    //     return true
    //   }
    // }
  }

  closeModal = () => {
    this.setState({
      modalShow: false
    })
  }

  render() {
    const { table } = this.props.entityContentStore
    const { nodeLeaf } = this.props.treeStore
    const { id } = this.state
    let sideBarFlag = window.location.href.indexOf("modulefrom=sidebar")>0 || window.sideBarFlag;
    if(sideBarFlag)
      window.sideBarFlag = sideBarFlag
    if(contextId === 'mdm'){
      sideBarFlag = true;
    }
    let backFun = () => {
      this.props.entityContentStore.setBackFlag(true)
      let checkflag = this.checkIsSave();
      if(!checkflag){
        contextBack();
      }
    }

    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    let headerText = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0018", defaultMessage:"数据模型"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0019", defaultMessage:"自定义档案建模"});
    let warpHeight = sideBarFlag? '100%': 'calc(100% - 51px)';
    let checkFun = async (item)=>{
      this.props.entityContentStore.setCheckModal(true)
      await this.props.entityContentStore.getCheckInfo(item.id)
    }
    return (
      <div className="main">
      {
          sideBarFlag? '' : <Header title={headerText}  back={true} backFn={backFun}/>
        }
        {/* <Header title="数据模型" /> */}
        <section className="section-wrap" style={{
          height: warpHeight
        }}>
          <div className="section-wrap-l">
            <Siderbartree
              checkFun={checkFun}
              root={{id: '0', name: text, isparent: true}}
              expendId={id}
              hasClickCallBack={true}
              leafClickCallBack={this.checkIsSave}
            />
          </div>
          <div className="section-wrap-r">
            <CheckModel />
            {/* <NodeInfoEdit expendId={id} /> */}
            <EditTable />
          </div>
        </section>

      </div>
    )
  }
}

export default injectIntl(Leaf, {withRef: true});;;
