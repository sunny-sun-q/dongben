import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React from "react";
import { Error } from 'utils/index'
import { FormControl, Label, Checkbox, Input, Icon,  Tooltip, Animate, Tabs, Message, Modal } from 'tinper-bee';
import Select from 'bee-select';
import {Popconfirm} from 'components/tinper-bee';
const Option = Select.Option;
import {Button} from 'components/tinper-bee';
import TemplateTable from './temple'
const {TabPane} = Tabs;
import Table from 'bee-table';

import Form from 'bee-form'

const FormItem = Form.FormItem;

import {toJS} from "mobx";
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
    entityContentStore: stores.entityContentStore,
    comboxStore: stores.comboxStore
  }
}) @observer
class EditTableSecond extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [{
        title: this.props.intl.formatMessage({id:"js.con.edi1.0001", defaultMessage:"子表1"}),
        content: 'content'
      }],
      activeKey: this.props.intl.formatMessage({id:"js.con.edi1.0001", defaultMessage:"子表1"}),
      showModal: false,
    };
    // this.tempActiveKey = ""
  }

  componentDidMount() {
    // this.props.entityContentStore.getTableRequest(this.props.match.params.id)
    this.props.onRef&&this.props.onRef(this)
    this.props.comboxStore.getCombox('com.yonyou.iuapmdm.modeling.mdmdesign.entity.MDEntityDataTypeCombo')
  }

  onRef = (ref) => {
    this.TemplateTable = ref
  }

  saveSecondTable = () => {
    return this.TemplateTable.saveSecondTable();
  }

  resetTemplateTableState = () => {

    this.TemplateTable.resetTemplateTableState();
  }

  // 子表删除
  async remove(index){
    // console.log(index)
    // e.stopPropagation();
    const { secondTableInfo } = this.props.entityContentStore.table;
    const { id } = this.props.match.params;
    let pk_mdentity = secondTableInfo[index].entity_items.pk_mdentity;
    if(pk_mdentity){
      await this.props.entityContentStore.deleteSecondTableList(secondTableInfo[index].entity_items.pk_mdentity)
    }
    await this.props.entityContentStore.getTableRequest(id)


    if( index > 0 ){ //设置上一条的选中状态
      // 删除一条数据，重新设置子表的位置
      this.props.entityContentStore.changeActiveTabs('son', index-1)
      this.setState({
        activeKey:`子表${index}`
      });
    }
  }

  construct() {
    let content = this.props.intl.formatMessage({id:"js.con.edi1.0003", defaultMessage:"确定要删除该子表吗？"})
    const disabled = true;
    const { activeKey } = this.state;
    const { secondTableInfo } = this.props.entityContentStore.table;
    const { state } = this.props.treeStore.nodeLeaf.info;
    return secondTableInfo.map((t, index) => {
      let delBtn = (activeKey === `子表${index+1}` && state !== 1)?
        <Popconfirm trigger="click" rootClose placement="right" content={content} onClose={() => this.remove(index)}>
          <Icon
              type="uf-del"
              className="close-icon"
          />
        </Popconfirm> : '' ;
      return (
        <TabPane
        tab={<span>{`子表${index+1}`}
                {delBtn}
              </span>}
          key={`子表${index+1}`}
        >
          <div style={{
            height: '100%'
          }}>
            <TemplateTable selectIndex={index} tableInfo={t} activeKey={activeKey} onRef={this.onRef}/>
          </div>
        </TabPane>);
      }).concat(state !== 1?[
        <TabPane
            tab={<a style={{color: 'white', cursor: 'pointer'}} onClick={this.add}><FormattedMessage id="js.con.edi1.0005" defaultMessage="添加子表" /></a>}
            disabled={disabled}
            key={'__add'}
        />,
      ]:[]);
  }

  // 增加
  add = (e) => {
    e.stopPropagation();
    const { state } = this.props.treeStore.nodeLeaf.info;
    let error1 = this.props.intl.formatMessage({id:"js.con.edi1.0006", defaultMessage:"该模型已启用，请停用后再试"})
    if( state === 1){ //启用状态
      Error(error1)
      return;
    }
    const { secondTableInfo, ifEditFlag } = this.props.entityContentStore.table;
    const { sonActiveTab } = this.props.entityContentStore.tableStatus
    let len = secondTableInfo.length;
    let currentTabInfo = secondTableInfo[len-1];
    let ifSecondTableModify = this.ifSecondTableModify(sonActiveTab)


    this.onTabChange(`子表${len+1}`, true);

    // if (len === 0 || (!ifSecondTableModify && currentTabInfo && currentTabInfo.entity_items.pk_mdentity)){
      // this.props.entityContentStore.addSecondTableList()
      // this.onTabChange(`子表${len+1}`, true);
    // } else {
    //   this.setState({
    //     showModal: true,
    //     ifAdd: true
    //   })
    // }
  }

  ifSecondTableModify(index) {
    const { secondTableInfo } = this.props.entityContentStore.table;
    let len = secondTableInfo.length;
    if (len === 0 && index === 0) return false;
    const item1= toJS(secondTableInfo[index].entity)
    const item2= toJS(secondTableInfo[index].cacheEntity)
    return !(_.isEqual(item1, item2))
  }

  // 点击切换
  onTabChange = (activeKey, flag) => {

    const { secondTableInfo } = this.props.entityContentStore.table;
    const { sonActiveTab } = this.props.entityContentStore.tableStatus
    let len = secondTableInfo.length;
    let currentTabInfo = secondTableInfo[len-1];
    let ifSecondTableModify = this.ifSecondTableModify(sonActiveTab)
    if (len === 0 || (!ifSecondTableModify && currentTabInfo && currentTabInfo.entity_items.pk_mdentity)){
      this.setState({
        activeKey
      })
      if (flag) {
        this.props.entityContentStore.addSecondTableList()
        let index = activeKey.replace(/[^0-9]/ig,"");
        this.props.entityContentStore.changeActiveTabs('son', index-1)
      } else {
        let index = activeKey.replace(/[^0-9]/ig,"");
        this.props.entityContentStore.changeActiveTabs('son', index-1)
      }
    } else {
      this.setState({
        showModal: true,
        nextActiveKey: activeKey
      })
      if (flag) {
        this.setState({
          ifAdd: true
        })
      }
    }
    // this.tempActiveKey = activeKey;
  }

  close = () => {
    this.setState({
      showModal:false
    })
  }

  submit = async () => {
    const { secondTableInfo } = this.props.entityContentStore.table;
    const { sonActiveTab } = this.props.entityContentStore.tableStatus
    let len = secondTableInfo.length;
    let currentTabInfo = secondTableInfo[sonActiveTab];
    let { entity_items } = currentTabInfo;
    let error1 = this.props.intl.formatMessage({id:"js.con.edi1.0007", defaultMessage:"子表编码和名称不能为空"})
    if(!entity_items.code || !entity_items.name){
      this.setState({
        showModal: false
      })
      Error(error1);
    }else{
      await this.TemplateTable.saveSecondTable();
      this.setState({
        showModal: false,
        // activeKey: this.tempActiveKey
      })
      // ifAdd => 新增标志
      // nextActiveKey => 下次要跳转到标志
      const { ifAdd, nextActiveKey } = this.state
      if (ifAdd) {
        this.props.entityContentStore.addSecondTableList()
        this.setState({
          activeKey:`子表${len+1}`
        });
      } else if (nextActiveKey) {
        this.setState({
          activeKey: nextActiveKey
        });
      }
      this.setState({
        ifAdd: '',
        nextActiveKey: ''
      })
    }
    // const { ifSaveSuccess } = this.props.entityContentStore.table;
    // const { activeKey } = this.state;
    // // console.log(ifSaveSuccess,this.tempActiveKey)
  }

  render() {
    return (
      <div className={`second-table ${this.props.className}`}>
        <Tabs
          activeKey={this.state.activeKey}
          onChange={this.onTabChange}
          tabBarStyle="primary"
          style={{
            height: '100%'
          }}
          // defaultActiveKey="摸鱼儿"
          animated={false}
        >
          {this.construct()}
        </Tabs>
        <Modal
          show = { this.state.showModal }
          onHide = { this.close } >
          <Modal.Header closeButton>
            <Modal.Title><FormattedMessage id="js.con.edi1.0008" defaultMessage="确认信息" /></Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormattedMessage id="js.con.edi1.0009" defaultMessage="数据已修改，是否保存？" />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={ this.close } bordered style={{marginRight: 20}}><FormattedMessage id="js.con.edi1.0010" defaultMessage="取消" /></Button>
            <Button onClick={ this.submit } colors="primary"><FormattedMessage id="js.con.edi1.0011" defaultMessage="确认" /></Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default injectIntl(Form.createForm()(EditTableSecond), {withRef: true});
