import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import { Icon, FormControl, Row, Col, Modal, Button } from 'tinper-bee';
import Form from 'bee-form';
import TreeModal from '../../components/tree-modal'

const FormItem = Form.FormItem;

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore,
  }
})) @observer
class RefModule extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ifShowMapping : false,
      ifShowChangeMapping : false,
    };

    this.showRefTreeModal = this.showRefTreeModal.bind(this);
    this.matchingShowNameCode = this.matchingShowNameCode.bind(this);
    this.cleanAndOpenTreeModal = this.cleanAndOpenTreeModal.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({
        showModal: false
    });
  }
  open() {
    this.setState({
        showModal: true
    });
  }

  // 清空对应的配置信息并打开参照主数据树的modal
  cleanAndOpenTreeModal(){
    const entityContentStore = this.props.entityContentStore;
    // 清空数据库
    entityContentStore.deleteByShowTableCodeAndSelectedTableCode(this.props.match.params.name, entityContentStore.tempReference.treeref_pkgd);
    // 清空页面缓存
    entityContentStore.cleanDatas();
    // 关闭提示
    this.close();
    // 打开树参照框
    this.showRefTreeModal();
  }

  showRefTreeModal() {
    // 先找出entityStory中是否已经配置了映射
    let { mappingExist } = this.props.entityContentStore.mappingDatas;
    // 如果已经有了映射数据的话，则弹出提示框让用户确认是否要重新选择。然后清空对应数据
    if(mappingExist){
      this.open();
    // 如果没有配置则弹出相应的选择框
    }else{
      const { setRefModal, getFieldref } = this.props.entityContentStore;
      this.props.entityContentStore.setRefModal(true)
    }
  }

  matchingShowNameCode(){
    const { treeref_pkgd_code, treeref_pkgd_name } = this.tempReference;
    this.setState({
      showSelectNameCode : treeref_pkgd_code == '' ? '': treeref_pkgd_name + "(" +  treeref_pkgd_code + ")"
    })
  }

  render() {
    let self= this;
    var {ifEntitySelect, treeref_pkgd, treeref_pkgd_code, treeref_pkgd_name} = this.props.entityContentStore.tempReference;
    var showSelectNameCode = treeref_pkgd_code == '' ? '': treeref_pkgd_name + "(" +  treeref_pkgd_code + ")"
    const { getFieldProps, getFieldError } = this.props.form;
    const { entityContentStore } = this.props;

    return (
      <Row className='u-row mdm-social-config'>
        <Col md={5} xs={5} sm={5} className="line-height-30 " style={{textAlign:"left",width:115+'px'}}>
          <div className='grayDeep'>选择主数据模型</div>
        </Col>
        <Col md={2} xs={2} sm={2}>
          <FormItem className='input-field ref-tree-input'>
            <FormControl placeholder=''
              defaultValue = {showSelectNameCode || ''}
              value = {showSelectNameCode || ''}
              // {...getFieldProps('ref_pkgd_name', {
              //   validateTrigger: 'onBlur',
              //   rules: [{
              //     required: true, message: '请输入参照主数据'
              //   }],
              //   initialValue: showSelectNameCode == '' ? '': showSelectNameCode,
              // })}
            />
            <Icon className="uf-symlist ref-icon-btn" onClick={this.showRefTreeModal} />
            <span className='error'>
              {getFieldError('ref_pkgd_name')}
            </span>
          </FormItem>
        </Col>
        {/* selectTreeNodeInfo={self.tempReference} matchingShowNameCode={self.matchingShowNameCode} */}
        <TreeModal />
        {/* 提示重新选择框 */}
        <Modal
            show = { this.state.showModal }
            onHide = { this.close } >
                <Modal.Header closeButton>
                    <Modal.Title>提示信息</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    您确定要重置接口的映射配置吗?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={ this.close } shape="border" style={{marginRight: 15}}>取消</Button>
                    <Button onClick={ this.cleanAndOpenTreeModal } colors="primary"  >确定</Button>
                </Modal.Footer>
           </Modal>
      </Row>
    )
  }
}

export default Form.createForm()(RefModule);
