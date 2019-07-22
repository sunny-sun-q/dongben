

import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react';
import {toJS} from "mobx";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import { Col, Row, Switch, FormControl, Label, Checkbox, Message, Dropdown} from 'tinper-bee';
import {Button} from 'components/tinper-bee';
import Form from 'bee-form'

const FormItem = Form.FormItem;
import './index.less'

import {
  inject,
  observer
} from 'mobx-react';
// import EditTableMain from '../edit-table-main'
import CopyModelForm from '../../components/copy-modal'
import PublishModal from '../../components/publish-modal'

import {getContextId,getLanguage} from 'utils';
const contextId = getContextId();

const prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    treeRefStore: stores.treeRefStore,
    treeRefTreeStore: stores.treeRefTreeStore,
    treeEntryStore: stores.treeEntryStore,
    tableRefStore: stores.tableRefStore,
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class NodeInfoEdit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isPublish: false,
    };
    // this.nodeSaveClick = this.nodeSaveClick.bind(this)
    this.saveTableInfo = this.saveTableInfo.bind(this)
    this.copyModel = this.copyModel.bind(this)
    this.exportModel =  this.exportModel.bind(this)
    this.ExportSubmit =  this.ExportSubmit.bind(this)
    this.encodeRule = this.encodeRule.bind(this)
    this.unpublish = this.unpublish.bind(this);
    this.publishFun = this.publishFun.bind(this);
    this.publish = this.publish.bind(this);
  }

  async componentDidMount(){
    const { id } = this.props.match.params;
    await this.props.entityContentStore.queryPublish(id);
    await this.props.treeStore.getDesignInfo(id);
    // const { isPublish:isPublish1 } = this.props.entityContentStore.publishModal;
    // this.setState({
    //   isPublish:isPublish1
    // })
  }

  async componentWillReceiveProps(nextProps) {
    // console.log('nextProps.entityContentStore.table.body')
    // const { id } = this.props.match.params;
    // await this.props.entityContentStore.queryPublish(id);
    const { id: nextId } = nextProps.match.params
    const { id: prevId } = this.props.match.params
    if( nextId !== prevId ){
      await this.props.entityContentStore.queryPublish(nextId);
      // await this.props.treeStore.getDesignInfo(nextId);
    }
    // const { isPublish:isPublish1 } = this.props.entityContentStore.publishModal;
    // this.setState({
    //   isPublish:isPublish1
    // })
    // if (nextProps.entityContentStore.table.body && nextProps.entityContentStore.table.body !== this.props.entityContentStore.table.body) {
    //   this.setState({
    //     dataSource: nextProps.entityContentStore.table.mainTableInfo.entity || [],
    //     entity_items: nextProps.entityContentStore.table.mainTableInfo.entity_items || {},
    //     count: nextProps.entityContentStore.table.mainTableInfo.entity.length+1
    //   })
    // }
  }

  // nodeSaveClick(e) {
  //   e.preventDefault();
  //   this.props.form.validateFields(async (err, values) => {
  //     if (err) {
  //       // console.log('校验失败', values);
  //     } else {
  //       // console.log('提交成功', values)
  //       // {"isworkflow":true,"isstart_us_v":true,"statistics":false,
  //       Object.assign(values, {
  //         isstart_us_v: true,
  //         statistics: false
  //       })

  //       if (this.props.expendId) {
  //         // 更新
  //         let info =this.props.treeStore.nodeLeaf.info || {}
  //         info.pk_gd = info.id
  //         info.pk_category = info.pid
  //         info = Object.assign(info, values)
  //         delete info.children
  //         await this.props.treeStore.submitLeafRequest(info, this.props.expendId)
  //       } else {
  //         // 新增
  //         await this.props.treeStore.submitLeafRequest(values)
  //         const id = this.props.treeStore.nodeLeaf.info.id
  //         this.props.history.push(`/leaf/${id}`)
  //       }

  //       this.props.treeStore.resetTableStatus(true, true)
  //       await this.props.treeStore.getTree()
  //     }
  //   });
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('nextProps, nextState', nextProps, nextState);// 修改url进入的，这里能正确获取到新用户id
    return true;
  }

  onSwitchChange = async(e) => {
    const { entity, cacheEntity } = this.props.entityContentStore.table.mainTableInfo;
    const { editIndex} = this.props.entityContentStore.table;
    const { activeTabs } = this.props.entityContentStore.tableStatus
    if(editIndex > -1){
      Message.create({ content: this.props.intl.formatMessage({id:"js.rou.cus1.0086", defaultMessage:"编辑未完成，请确认或取消"}), color : 'danger'});
      return
    }
    if (activeTabs == 'father') {
      let _entity = toJS(entity)
      let _cacheEntity = toJS(cacheEntity)
      if (!(_.isEqual(_entity, _cacheEntity))) {
        Message.create({ content: this.props.intl.formatMessage({id:"js.mdm.enum.0025", defaultMessage:"数据已修改，请保存"}), color : 'danger'});
        return
      }
    }

    const { state } = this.props.treeStore.nodeLeaf.info
    const { id:pk_gd } = this.props.match.params;
    const { isPublish } = this.props.entityContentStore.publishModal;
    if(state !== 1){
      let isLenNone = this.getHasNotOnlyOne()
      if (!isLenNone) {
        await this.props.treeStore.startuse(pk_gd);
        this.props.treeStore.getTree()
        // console.log("启用，pk_gd：",pk_gd);
      }
    }else{
      if (isPublish) {
        Message.create({ content: this.props.intl.formatMessage({id:"js.con.nod.0001", defaultMessage:"请先反发布，在进行停用"}), color: 'danger' })
        return
      }
      await this.props.treeStore.stopuse(pk_gd);
      this.props.treeStore.getTree()
      // console.log("停用，pk_gd：",pk_gd);
    }
  };

  /** 判断模型是否启用 */
  ifStart = () => {
    const { state } = this.props.treeStore.nodeLeaf.info;
    if( state === 1){ //启用状态
      alert(this.props.intl.formatMessage({id:"js.con.nod.0002", defaultMessage:"该模型已启用，请停用后再试"}))
      return true;
    }
    return false;
  }

  encodeRule(){
    let starting = this.ifStart();
    if(starting) return;
    window.mdmNowUrl = window.location.href;
    this.props.history.push(`/encode/${this.props.match.params.id}`)
  }

  copyModel(nodeLeaf){
    // console.log("复制模型",nodeLeaf)
    this.props.entityContentStore.setCopyModal(true)
    this.props.entityContentStore.editNodeBranch(nodeLeaf)
  }

  exportModel(){
    const pk_gd = this.props.treeStore.nodeLeaf.info.id
    let flag = (
      new RegExp('%3C').test(pk_gd) | // <
      new RegExp('%7C').test(pk_gd) | // |
      new RegExp('%2F').test(pk_gd) | // /
      new RegExp('%27').test(pk_gd) | // '
      new RegExp('%22').test(pk_gd)   // "
    );
    if(!flag)
      window.open( prefixUrl + "/exportExcelForMDM/export?pk_gd=" + pk_gd);
  }

  /*
  * 导出主数据入XML模型
  */
  async ExportSubmit() {
    const pk_gd = this.props.treeStore.nodeLeaf.info.id
    let flag = (
     new RegExp('%3C').test(pk_gd) | // <
     new RegExp('%7C').test(pk_gd) | // |
     new RegExp('%2F').test(pk_gd) | // /
     new RegExp('%27').test(pk_gd) | // '
     new RegExp('%22').test(pk_gd)   // "
   );
   debugger;
   if(!flag)
     window.open( prefixUrl + `/exportExcelForMDM/exportXML?pk_gd=${pk_gd}`);
}
async unpublish(){
  const { id } = this.props.match.params;
  await this.props.entityContentStore.unPublish(id);
  await this.props.entityContentStore.queryPublish(id);
}
publishFun(){
  if(this.props.entityContentStore.publishModal.isPublish){
    this.unpublish()
  }else{
    debugger;
    this.publish();
  }
}
  async publish(){
    const { state } = this.props.treeStore.nodeLeaf.info;
    const { isPublish } = this.props.entityContentStore.publishModal;
    const { id } = this.props.match.params;
    if( state !== 1 ){
        alert(this.props.intl.formatMessage({id:"js.con.nod.0003", defaultMessage:"请先启用主数据后再发布"}));
        return;
    }
    await this.props.tableRefStore.resetRefMsg({});
    if (isPublish) {
      // 如果是已发布，显示发布内容
      let res = await this.props.entityContentStore.getPublishMsg(id);
      await this.props.tableRefStore.resetRefMsg(res);
      this.props.treeRefStore.resetRefMsg({
        treeref_pkgd: res.treeref_pkgd,
        treeref_pkgd_name: res.treeref_pkgd_name
      })

      this.setState({
        uistyle: res.uistyle
      })
    }
    this.props.entityContentStore.setPublishModal(true);
  }

  // unpublish(){
  //   this.props.entityContentStore.setPublishModal(true);
  // }

  /* 保存主表/子表
   * active：标识主子表
   */
  saveTableInfo = active => (e) => {
    e.preventDefault();
    let starting = this.ifStart();
    if(starting) return;
    switch(active){
      case 'father':
        this.props.saveMainTable();
        break;
      case 'son':
        this.props.saveSecondTable();
        break;
      default:
        break;
    }
  }

  openCodeRules(){
    window.mdmNowUrl = window.location.href;
    this.props.history.push(`/code-rules/${this.props.match.params.id}`)
  }

  getHasNotOnlyOne() {
    let isLenNone
    const { entity } = this.props.entityContentStore.table.mainTableInfo
    const { sonActiveTab, activeTabs } = this.props.entityContentStore.tableStatus
    if (activeTabs === 'father') {
      isLenNone = entity.length === 0
    } else {
      // secondTableInfo
      let secondTable = this.props.entityContentStore.table.secondTableInfo[sonActiveTab]
      if (!secondTable) return true
      if (secondTable) {
        isLenNone = secondTable.entity.length === 0
      }
    }
    return isLenNone
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { nodeLeaf,nodeLeaf:{info,tempNode} } = this.props.treeStore;
    const { activeTab } = this.props
    const { isPublish } = this.props.entityContentStore.publishModal;
    let state = info.state;
    let disabled1 = state === 1? true : false; //启用态禁用
    let disabled2 = state === 2? true : false; //停用态禁用
    let isLenNone = this.getHasNotOnlyOne();
    let getLan = getLanguage();
    // const { entity } = this.props.entityContentStore.table.mainTableInfo
    // const { sonActiveTab, activeTabs } = this.props.entityContentStore.tableStatus
    // if (activeTabs === 'father') {
    //   isLenNone = entity.length === 0
    // } else {
    //   // secondTableInfo
    //   let secondTable = this.props.entityContentStore.table.secondTableInfo[sonActiveTab]
    //   if (!secondTable) return true
    //   if (secondTable) {
    //     isLenNone = secondTable.entity.length === 0
    //   }
    // }
    const menu = (
      <ul className='u-dropdown-ul'>
          {
            contextId === 'mdm'? <li className='u-dropdown-li' key="1" onClick={this.ExportSubmit}><FormattedMessage id="js.con.nod.0004" defaultMessage="导出模型" /></li> : null}
          {
            contextId === 'mdm'? <li className='u-dropdown-li' key="2" onClick={this.exportModel}><FormattedMessage id="js.con.nod.0005" defaultMessage="导出模板"/></li>: null
          }
      </ul>
    );
    // console.log('disabled1 isLenNone', disabled1, isLenNone)
    return (
      <div className="add-main-data-section">
        <div className="section-wrap-r-header">
          <div className="main-data-btn">
            {/* { <Button
              className={`thirdlevel-btn ${disabled1? "disabled-btn" : ""}`}
              shape="border"
              onClick={() => this.encodeRule() }>
              <FormattedMessage id="js.con.nod.0006" defaultMessage="编码规则" />
            </Button> } */}
            <Button className="thirdlevel-btn" bordered onClick={() => this.copyModel(nodeLeaf)}>
              <FormattedMessage id="js.con.nod.0007" defaultMessage="复制模型" />
            </Button>
            {/* <Button className="thirdlevel-btn" shape="border" onClick={this.ExportSubmit}>
              <FormattedMessage id="js.con.nod.0008" defaultMessage="导出" />.XML
            </Button>
            <Button className="thirdlevel-btn" shape="border" onClick={this.exportModel}>
              <FormattedMessage id="js.con.nod.0009" defaultMessage="<FormattedMessage id="js.con.nod.0008" defaultMessage="导出" />模板" />
            </Button> */}
            <div>
                {
                  contextId === 'mdm'?
                  <Dropdown
                  trigger={['hover']}
                  overlay={menu}
                  animation="slide-up"
                  // onVisibleChange={onVisibleChange}
                >
                <Button bordered>
                  <FormattedMessage id="js.con.nod.0008" defaultMessage="导出" />
                </Button>
                </Dropdown>: null
                }
            </div>
            {/* {
              isPublish ? <Button
                shape="border"
                onClick={()=>this.unpublish()}>
                <FormattedMessage id="js.con.nod.0010" defaultMessage="取消发布" />
              </Button> : null
            } */}
            {/* {
              isPublish?
              <Button
                // className={`${disabled2? "disabled-btn" : ""}`}
                shape="border"
                onClick={()=>this.unpublish()}>
                <FormattedMessage id="js.con.nod.0010" defaultMessage="取消发布" />
              </Button> :
              <Button
                // className={`${disabled2? "disabled-btn" : ""}`}
                shape="border"
                onClick={()=>this.publish()}>
                <FormattedMessage id="js.con.nod.0011" defaultMessage="节点发布" />
              </Button>
            } */}
            <Button
              // className={`${disabled2? "disabled-btn" : ""}`}
              shape="border"
              colors="primary"
              onClick={()=>this.publish()}>
              <FormattedMessage id="js.con.nod.0011" defaultMessage="节点发布" />
            </Button>
            <Button
              className={`${disabled1 || isLenNone ? "disabled-btn" : ""}`}
              disabled={disabled1 || isLenNone}
              onClick={this.saveTableInfo(activeTab)}>
              <FormattedMessage id="js.con.nod.0012" defaultMessage="保存" />
            </Button>
            <CopyModelForm nodeLeaf={nodeLeaf}/>
            <PublishModal uistyle={this.state.uistyle}/>
            <Row className={["switch-container",getLan==='en_US'?'en-switch-container':''].join(" ")}>
              <Col sm={2}>
                <Switch
                  checked={ state === 1 }
                  onChange={this.onSwitchChange}
                  checkedChildren={this.props.intl.formatMessage({id:"js.con.nod.0013", defaultMessage:"启用"})}
                  unCheckedChildren={this.props.intl.formatMessage({id:"js.con.nod.0014", defaultMessage:"停用"})}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(Form.createForm()(NodeInfoEdit), {withRef: true});
