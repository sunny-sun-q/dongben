import React,{Component} from 'react';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {  Label } from 'tinper-bee'
import {Button} from 'components/tinper-bee';
import {Popconfirm} from 'components/tinper-bee';
import classnames from 'classnames';
import Modal from 'bee-modal'
import _ from 'lodash'
import {toJS} from "mobx";
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';
import EditTableMain from '../edit-table-main';
import EditTableSecond from '../edit-table-second';
import NodeInfoEdit from '../../containers/node-info-edit';
import {getContextId,contextBack} from 'utils';
const contextId = getContextId();
import Message from 'bee-message';
@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore
  }
}) @observer
class EditTable extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      active: 'father',
      id: this.props.match.params.id,
      msg1: this.props.intl.formatMessage({id:"js.rou.cus1.0039", defaultMessage:"主表数据已修改，是否保存？"})
    }
    this.switchNav = this.switchNav.bind(this)
  }

  async switchNav(type) {
    if(type === 'son'){
      let l = this.props.entityContentStore.table.mainTableInfo.entity.length;
      if(l < 1){
        Message.create({ content: this.props.intl.formatMessage({id:"js.rou.cus1.0040", defaultMessage:"主表必须存在属性"}), color : 'danger'});
        return;
      }
    }
    this.setState({
      active: type
    })
    this.props.entityContentStore.clearConfigEntityItems();
    const { id } = this.props.match.params;
    if (type === 'father') {
      const { pk_mdentity } = this.props.entityContentStore.table.mainTableInfo.entity_items;
      // console.log(pk_mdentity);
      await this.props.entityContentStore.getFieldref(id,pk_mdentity); //获取所有参照
      this.props.entityContentStore.changeActiveTabs(type,-1)
    } else {
      const { sonActiveTab } = this.props.entityContentStore.tableStatus
      const { secondTableInfo } = this.props.entityContentStore.table;
      if(sonActiveTab > -1){
        if(secondTableInfo.length > sonActiveTab){
          const { entity_items:{pk_mdentity} } = secondTableInfo[sonActiveTab];
          this.props.entityContentStore.getFieldref(id,pk_mdentity,sonActiveTab); //获取所有参照
          this.props.entityContentStore.changeActiveTabs(type,-1)
        }
      }else{
        if(secondTableInfo.length > 0){
          const { entity_items:{pk_mdentity} } = secondTableInfo[0];
          this.props.entityContentStore.getFieldref(id,pk_mdentity,0); //获取所有参照
        }
        this.props.entityContentStore.changeActiveTabs(type,0)
      }
  }

  }

  onRef=(ref)=>{
    this.EditTableMain=ref;
  }

  onRef2=(ref)=>{
    this.EditTableSecond=ref;
  }

  componentDidMount() {
    const { id } = this.props.match.params
    if (id) {
      this.props.entityContentStore.getTableRequest(id)
    }
  }

  componentWillReceiveProps(nextProps){
    const { id: nextId } = nextProps.match.params
    const { id: prevId } = this.props.match.params
    if( nextId !== prevId ){
      this.setState({
        active: 'father'
      })
      // 重新设置tabs为 主表，子表为第一个
      this.props.entityContentStore.changeActiveTabs('father', -1)
    }
  }

  async changeTab(tab){
    if(tab === 'son'){
      let l = this.props.entityContentStore.table.mainTableInfo.entity.length;
      if(l < 1){
        Message.create({ content: this.props.intl.formatMessage({id:"js.rou.cus1.0040", defaultMessage:"主表必须存在属性"}), color : 'danger'});
        return;
      }
    }
    let res
    switch(tab){
      case "son":
        res = await this.EditTableMain.saveMainTable()
        break
      case "father":
        res = await this.EditTableSecond.saveSecondTable()
    }
    if (res) {
      this.switchNav(tab);
    }
  }

  // 点击取消并跳转
  cancelToGO(tab) {
    switch(tab){
      case "son":
        this.EditTableMain.resetTable()
        break
      case "father":
        const { sonActiveTab } = this.props.entityContentStore.tableStatus
        const { secondTableInfo } = this.props.entityContentStore.table;
        let cacheEntity = secondTableInfo[sonActiveTab].cacheEntity
        this.props.entityContentStore.setSecondResource(cacheEntity)
        break
    }
    this.switchNav(tab);
  }

  closeModal = () => {
    this.setConfirmModal(false)
    if(this.props.entityContentStore.backFlag){
      contextBack();
      return;
    }
    const { nextNodeInfo } = this.props.treeStore
    if (nextNodeInfo.id && (nextNodeInfo.isparent || nextNodeInfo.isRoot)) {
      window.mdmNowUrl = window.location.href;
      this.props.history.push(`/`)
    } else {
      this.props.treeStore.setNodeLeaf(nextNodeInfo)
      window.mdmNowUrl = window.location.href;
      this.props.history.push(`/leaf/${nextNodeInfo.id}`)
    }
  }

  setConfirmModal(value) {
    this.props.treeStore.setConfirmSaveModal(value)
  }

  save = async () => {
    this.props.treeStore.setConfirmSaveModal(false)
    let res = await this.EditTableMain.saveMainTable()

    if (res) {
      if(this.props.entityContentStore.backFlag){
        contextBack();
        return;
      }
      const { nextNodeInfo } = this.props.treeStore
      if (nextNodeInfo.id && (nextNodeInfo.isparent || nextNodeInfo.isRoot)) {
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/`)
      } else {
        this.props.treeStore.setNodeLeaf(nextNodeInfo)
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/leaf/${nextNodeInfo.id}`)
      }
    }
  }

  getIfModify(activeTabs) {
    // const { activeTabs, sonActiveTab } = this.props.entityContentStore.tableStatus
    // // console.log(entity.length)
    // // console.log(cacheEntity.length)
    if (activeTabs === 'father') {

      const { entity, cacheEntity } = this.props.entityContentStore.table.mainTableInfo;
      let hasPkEntityitem = 0
      entity.forEach((li) => {
        hasPkEntityitem++
      })
      // if (hasPkEntityitem === 0) {
      //   this.setState({
      //     msg1: '请先新建主表'
      //   })
      //   // msg1 = "主表数据已修改，是否保存？";
      // }
      // const { secondTableInfo } = this.props.entityContentStore.table;
      // secondTableInfo:{entity: secondCacheEntity }
      // let secondEntity = secondTableInfo.entity
      let _entity = toJS(entity)
      let _cacheEntity = toJS(cacheEntity)
      if (!(_.isEqual(_entity, _cacheEntity))) {
        return true
      }
    }
    if (activeTabs == 'son') {
      const { sonActiveTab } = this.props.entityContentStore.tableStatus
      const { secondTableInfo } = this.props.entityContentStore.table;
      let len = secondTableInfo.length;
      if (len === 0 && sonActiveTab === 0) return false;
      const item1= toJS(secondTableInfo[sonActiveTab] && secondTableInfo[sonActiveTab].entity)
      const item2= toJS(secondTableInfo[sonActiveTab] && secondTableInfo[sonActiveTab].cacheEntity)
      return !(_.isEqual(item1, item2))
    }
  }

  render() {
    const placement = "right";
    const msg1 = this.props.intl.formatMessage({id:"js.rou.cus1.0039", defaultMessage:"主表数据已修改，是否保存？"});
    const msg2 = this.props.intl.formatMessage({id:"js.rou.cus1.0041", defaultMessage:"子表数据已修改，是否保存？"});
    const locale = {
      ok: this.props.intl.formatMessage({id:"js.rou.cus1.0042", defaultMessage:"是"}),
      cancel: this.props.intl.formatMessage({id:"js.rou.cus1.0043", defaultMessage:"否"})
    }
    const locale2 = {

    }
    const size = 'lg';
    const { active, id } = this.state;
    const { secondTableInfo } = this.props.entityContentStore.table; //true:有修改未保存 false:没有修改
    let len = secondTableInfo.length;
    // console.log(this.props.treeStore.nodeLeaf.info.state,"启用/停用")
    let ulDisplay = contextId === 'mdm'? 'flex' : 'none';
    return (
      <div className="table-section">
        <NodeInfoEdit
          expendId={id}
          activeTab={active}
          saveMainTable={()=>{this.EditTableMain.saveMainTable && this.EditTableMain.saveMainTable()}}
          saveSecondTable={()=>{this.EditTableSecond.saveSecondTable && this.EditTableSecond.saveSecondTable()}}
        />
        <ul className="table-section-nav" style={{
          'display': ulDisplay
        }
        }>
          { this.getIfModify('son')?
            <Popconfirm trigger="click" rootClose placement="left" content={msg2} onClose={()=>this.changeTab('father')} onCancel={() => this.cancelToGO('father')} locale={locale}>
              <li className={active === 'father' ? 'active' : ''}>
                <FormattedMessage id="js.rou.cus1.0044" defaultMessage="主表" />
                <div className="underline"></div>
              </li>
            </Popconfirm>
            :
            <li onClick={() => this.switchNav('father')} className={active === 'father' ? 'active' : ''}>
              <FormattedMessage id="js.rou.cus1.0044" defaultMessage="主表" />
              <div className="underline"></div>
            </li>
          }

          { this.getIfModify('father') ?
            <Popconfirm trigger="click" rootClose placement={placement} content={msg1} onClose={()=>this.changeTab('son')} onCancel={() => this.cancelToGO('son')} locale={locale}>
              <li className={active === 'son' ? 'active' : ''}>
                <FormattedMessage id="js.rou.cus1.0045" defaultMessage="子表" />
                <div className="underline"></div>
              </li>
            </Popconfirm>
            :
            <li onClick={() => this.switchNav('son')} className={active === 'son' ? 'active' : ''}>
              <FormattedMessage id="js.rou.cus1.0045" defaultMessage="子表" />
              <div className="underline"></div>
            </li>
          }
        </ul>
        <EditTableMain
          onRef={this.onRef}
          expendId={id}
          className={classnames({
            "show" : active === 'father',
            "hidden" : active !== 'father'

          })}
        />
        <EditTableSecond
          onRef={this.onRef2}
          className={classnames({
            "show" : active === 'son',
            "hidden" : active !== 'son',
            "none-table-tab" : active === 'son' && len === 0
          })}
        />

        <Modal
          show={this.props.treeStore.confirmSaveModal}
          onHide={this.closeModal}
          style={{width: 600}}
          className="tree-modal"
          backdropClosable={false}
        >
          <Modal.Header className="text-center" closeButton>
              <Modal.Title>
                <FormattedMessage id="js.con.edi1.0008" defaultMessage="确认信息" />
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-body-content">
              <h3><FormattedMessage id="js.rou.cus1.0046" defaultMessage="数据已修改，是否保存?" /></h3>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button bordered style={{ marginRight: 20 }} onClick={this.closeModal}>
              <FormattedMessage id="js.rou.cus1.0043" defaultMessage="否" />
            </Button>
            <Button colors="primary" onClick={this.save}>
              <FormattedMessage id="js.rou.cus1.0042" defaultMessage="是" />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default injectIntl(EditTable, {withRef: true});
