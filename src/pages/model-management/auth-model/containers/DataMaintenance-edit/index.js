import React from "react";
import { Error } from 'utils/index'
import { Row, Col, FormControl, Label, Checkbox, Input, Icon, Tooltip, Animate, Tabs, Message, InputNumber } from 'tinper-bee';
import Header from 'components/header/index.js'
import Select from 'bee-select';
const Option = Select.Option;

import TemplateTable from './temple'
const { TabPane } = Tabs;
import Table from 'bee-table';

import Form from 'bee-form'
import Combox from 'components/combox/index.js';
const FormItem = Form.FormItem;
import { Button } from 'components/tinper-bee';

// import SeniorSearch from '../SeniorSearch';
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
class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //是修改还是新增,还是查看
      editState: 0,
      tabs: [{
        title: '主表',
        content: 'content'
      }],
      activeKey: '主表',
      mustInput: false,
    };
    this.save = this.save.bind(this);
    this.mdmNowUrl = window.mdmNowUrl + '';
  }

  componentWillUpdate() {
  }

  componentWillReceiveProps(nextProps) {
  }
  componentDidMount() {
    this.props.comboxStore.getCombox('com.yonyou.iuapmdm.dataauthority.web.SysRoleCombo')
  }

  async save() {
    console.log(this.props.dataMaintainStore)
    const { info } = this.props.dataMaintainStore.table;
    if (info.name == '') {
      Message.create({ content: '权限名称不能为空！', color: 'danger' });
      return;
    }
    if (info.pk_role == '') {
      Message.create({ content: '请选择授权角色！', color: 'danger' });
      return;
    }
    if (this.props.dataMaintainStore.table.info.wflowseq == 0) {
      this.props.dataMaintainStore.table.info.wflowseq = 1;
    }

    if (this.props.dataMaintainStore.table.editState == 0) {
      await this.props.dataMaintainStore.save(this.props.match.params.id);
    } else {
      await this.props.dataMaintainStore.update(this.props.match.params.id);
    }
    console.log(this.props.history, this.props.match)
    // this.props.history.push(`/leaf/${this.props.match.params.id}`)
    window.location.href = this.mdmNowUrl;
    // window.history.go(-1);
  }

  componentWillMount() {

  }

  showConditionEdit() {
  }


  onRef = (ref) => {
    this.TemplateTable = ref
  }

  saveSecondTable = () => {
    this.TemplateTable.saveSecondTable();
  }

  onSelectChange = value => {
    this.props.dataMaintainStore.table.info.pk_role = value;
    console.log(value);
    console.log(`selected ${value}`);
  }

  // 子表删除
  remove = async (title) => {
    // e.stopPropagation();
    const { secondTableInfo } = this.props.dataMaintainStore.table;
    const { id } = this.props.match.params;
    let foundIndex = 0;
    const after = secondTableInfo.filter((t, i) => {
      if (t.title === title) {
        foundIndex = i;
      }
      return;
    });
    if (after.length > 0) {
      await this.props.entityContentStore.deleteSecondTableList(secondTableInfo[foundIndex].entity_items.pk_mdentity)
      this.props.entityContentStore.getTableRequest(id)
    } else {
      Message.create({ content: '请先保存子表！', color: 'danger' });
    }
  }


  construct() {
    const disabled = true;
    const { activeKey } = this.state;
    const { mainAuthInfo, subAuthInfo } = this.props.dataMaintainStore.table;
    let sub = [];
    let subKey = [];
    if (undefined == mainAuthInfo || mainAuthInfo.length == 0) {
      return;
    }
    for (var key in subAuthInfo) {
      subKey.push(key);
      sub.push(subAuthInfo[key]);
    }
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', mainAuthInfo);
    // let entity_pk = t.entity_pk;
    return [
      <TabPane
        tab={<span>{mainAuthInfo[0].entityName} </span>}
        key={`主表`}
      >
        <div>
          <TemplateTable selectIndex={index} data={mainAuthInfo} />
        </div>
      </TabPane>,
    ].concat(sub.map((t, index) => {
      // let title = t.title;

      return (
        <TabPane
          tab={<span>{sub[index][0].entityName}
          </span>}
          key={`子表${index + 1}`}
        >
          <div>
            <TemplateTable data={sub[index]} />
            {/* <TemplateTable selectIndex={index} tableInfo={t} onRef={this.onRef} /> */}
          </div>
        </TabPane>);
    }));
  }

  onBack = async () => {
    window.location.href = this.mdmNowUrl;
    // window.history.go(-1);
  }
  checkMust = (value) => {
    if (!value) {
      this.setState({
        mustInput: true
      })
    }
    else {
      this.setState({
        mustInput: false
      })
    }
  }
  getFilterCon = (filterCon) => {
    console.log("set filterCon before:", filterCon)
    this.props.dataMaintainStore.table.info.filterCon = filterCon;
    console.log("set filterCon after:", this.props.dataMaintainStore.table.info.filterCon)
  }


  onChange = (v) => {
    this.props.dataMaintainStore.table.info.name = v;
  }

  onChange2 = (v) => {
    this.props.dataMaintainStore.table.info.filterCon = v;
  }
  // 获取工作流顺序
  onChangeWflowSeq = (v) => {
    this.props.dataMaintainStore.table.info.wflowseq = v;
  }
  // 增加
  add = (e) => {
    e.stopPropagation();
    this.props.entityContentStore.addSecondTableList()
  }

  // 点击切换
  onTabChange = (activeKey) => {
    this.setState({
      activeKey
    });
  }

  open = () => {
    this.props.seniorSearchStore.setSeniorModal(true)
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    let { selectDataSource } = this.props.comboxStore;
    let _options = [];
    let { editState } = this.props.dataMaintainStore.table;
    let filterCon = this.props.dataMaintainStore.table.info.filterCon;
    const errorClassName = 'error-tip';
    const { errorName, errorRole } = this.props.dataMaintainStore.table.info;
    {
      selectDataSource ?
        selectDataSource.map((option, index) => (
          _options.push(<Option value={option.value} item={option} key={option.value}>{option.text}</Option>)
        ))
        : ''
    }
    let titlename = '权限模型';
    let showSave = true;
    if (editState == 0) {
      titlename = '新增权限模型';
    } else if (editState == 1) {
      titlename = '修改权限模型';
    } else if (editState == 2) {
      titlename = '查看权限模型';
      showSave = false;
    }

    // setTimeout(() => {
    //   let bodyHeight = document.body.offsetHeight;
    //   let detailHeight = document.getElementById('data-maintenance-detail').offsetHeight;
    //   let h = bodyHeight - detailHeight - 160;
    //   document.getElementsByClassName('u-tabs-content')[0].style.cssText = "height: " + h + 'px;'
    // })

    return (
      <div className={`second-table ${this.props.className}`}>
        <div className='data-maintenance-detail' id="data-maintenance-detail">
          <div className="main-data-form-auth-model">
            <Row>
              <Col md={3}>
                <FormItem className="form-item-input form-data-node">
                  <Label className='item-title'>序号：</Label>
                  <div className='item-detail'>
                    <InputNumber
                      max={20}
                      min={1}
                      step={1}
                      value={this.props.dataMaintainStore.table.info.wflowseq}
                      onChange={this.onChangeWflowSeq}
                      disabled={editState == 2 ? true : false}
                    />
                  </div>
                </FormItem>
              </Col>
              <Col md={3}>

                {/* <FormItem label={<span>权限名称：<span className="data-rules">*</span></span>} >
                  <FormControl
                    className="demo1-input"
                    value={this.props.dataMaintainStore.table.info.name}
                    onChange={this.onChange}
                  />
                  <span className={errorClassName}>
                    {errorName && isShowTip ? errorName : ''}
                  </span>
                </FormItem> */}
                <FormItem className="form-item-input form-data-node">
                  <Label className='item-title'><span>权限名称：<span className="data-rules">*</span></span></Label>
                  <div className='item-detail'>
                    <FormControl placeholder="权限名称"
                      value={this.props.dataMaintainStore.table.info.name}
                      onChange={this.onChange}
                      onBlur={(value, e) => { this.checkMust(value) }}
                      disabled={editState == 2 ? true : false}
                    // {...getFieldProps('name', {
                    //   validateTrigger: 'onBlur',
                    //   rules: [{
                    //     required: true, message: <span><Icon type="uf-exc-t"></Icon><span>请输入权限名称</span></span>,
                    //   }],
                    // })}
                    />
                  </div>
                  {
                    this.state.mustInput ?
                      <span className='error'>
                        {/* {getFieldError('name')} */}
                        必填项
                  </span> : null
                  }

                </FormItem>

              </Col>
              <Col md={3}>
                <FormItem className="form-item-input form-data-node">
                  <Label className='item-title'><span>授权角色：<span className="data-rules">*</span></span></Label>
                  <div className='item-detail'>
                    <Select
                      defaultValue={this.props.dataMaintainStore.table.info.role}
                      onSelect={this.onSelectChange}
                      disabled={editState == 2 ? true : false}
                    >
                      <Option value="">请选择</Option>
                      {_options}
                    </Select>
                  </div>
                </FormItem>
              </Col>
              <Col md={3}>
                <FormItem className="form-item-input form-data-node">
                  <Label className='item-title'>数据范围：</Label>
                  <div className='item-detail'>
                    <FormControl placeholder=''
                      className="auth-modal-data-range"
                      readOnly
                      value={this.props.dataMaintainStore.table.info.filterCon}
                      onChange={this.onChange2}
                      onClick={editState == 2 ? null : this.open}
                      disabled={editState == 2 ? true : false}
                    />
                    <div className="icon-btn">
                      <SeniorSearch
                        className="senior-search"
                        title={"条件编辑"}
                        fontStyle='icon'
                        pk_gd={this.props.match.params.id}
                        pk_category={''}
                        appendType={true}
                        getData={(filterCon) => this.getFilterCon(filterCon)}
                        initCondition={filterCon}
                      />
                    </div>
                  </div>
                </FormItem>
              </Col>

            </Row>

          </div>

        </div>
        <div className="tabs-wrap auth-model-wraps">
          <Tabs
            activeKey={this.state.activeKey}
            onChange={this.onTabChange}
            tabBarStyle="primary"
            defaultActiveKey="摸鱼儿"
            animated={false}
          >
            {this.construct()}
          </Tabs>
        </div>
      </div>
    );
  }
}


export default Form.createForm()(Edit)
