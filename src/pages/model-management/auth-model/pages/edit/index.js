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

import {  Label } from 'tinper-bee'
import Header from 'components/header/index.js'
import SiderbarTree from 'components/tree/index.js'
import Edit from '../../containers/DataMaintenance-edit';
import {Button} from 'components/tinper-bee';
@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    dataMaintainStore: stores.dataMaintainStore
  }
}) @observer
class Leaf extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: this.props.match.params.id
    }
    this.nodeSaveClick = this.nodeSaveClick.bind(this)
    this.mdmNowUrl = window.mdmNowUrl + '';
  }

  nodeSaveClick() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id && nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({
        id: nextProps.match.params.id
      })
      this.props.dataMaintainStore.getTableRequest(nextProps.match.params.id)
    }
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  save = async () => {
    const { info } = this.props.dataMaintainStore.table;
    if (info.name == '') {
      Message.create({ content: '权限名称不能为空！', color: 'danger' });
      return;
    }
    //默认值1，代表在工作流中
    if (info.wflowseq == '') {
        info.wflowseq = 1;
    }
    if (info.pk_role == '') {
      Message.create({ content: '请选择授权角色！', color: 'danger' });
      return;
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

  onBack = () => {
    window.location.href = this.mdmNowUrl;
    // window.history.go(-1);
  }

  render() {
    // const { table } = this.props.dataMaintainStore

    let { editState } = this.props.dataMaintainStore.table;
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

    const { nodeLeaf } = this.props.treeStore
    const { id } = this.state
    return (
      <div className="main maintenance auth-model-maintenance">
        <Header title={`${titlename}`} back={true}>
          <div className="maintenance-btn">
            {/* <Button colors="primary" size="sm" className='head-cancel' onClick={this.onBack}>取消</Button> */}
            <Button className="thirdlevel-btn" bordered onClick={this.onBack}>
              取消
            </Button>
            {showSave ? <Button colors="primary" className='head-save' onClick={this.save} style={{ marginLeft: '10px' }}>确定</Button> : <div></div>}

          </div>
        </Header>
        <section className="section-wrap auth-model-wrap">
          {/* <div className="section-wrap-l">
            <SiderbarTree
              root={{ id: '0', name: '主数据分类', isparent: true }}
              expendId={id}
              ifNoHover={true}
            />
          </div> */}
          <div className="section-wrap-r">
            <Edit />
          </div>
        </section>
      </div>
    )
  }
}

export default Leaf;
