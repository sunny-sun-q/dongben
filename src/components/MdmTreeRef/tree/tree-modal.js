import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {
	Component
} from 'react';
// import { Button } from 'tinper-bee';
import {Button} from 'components/tinper-bee';
import Form from 'bee-form'
import Modal from 'bee-modal'
import AddMainDataForm from './maindata-form'
import EditDataForm from './editdata-form'
import './index.less'

import {
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores) => {
  return {
    treeRefTreeStore: stores.treeRefTreeStore,
  }
}) @observer
class TreeModal extends Component {
	constructor(props) {
		super(props);
		// this.state = {
    //   showModal: false,
    // };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.submit = this.submit.bind(this);
  }

  close() {
    this.props.treeRefTreeStore.setTreeModal(false)
  }

  open() {
    this.props.treeRefTreeStore.setTreeModal(true)
  }

  submit(e) {
    e.preventDefault();
    this.props.form.validateFields(async(err, values) => {
        if (err) {
            console.log(<FormattedMessage id="js.com.tre4.0001" defaultMessage="校验失败" />, values);
        } else {
            console.log(<FormattedMessage id="js.com.tre4.0002" defaultMessage="提交成功" />, values)
             // rootMainfolder
            const { nodeType, nodeInfo } = this.props.treeRefTreeStore.modal
            // debugger
            console.log('nodeType', nodeType)
            if (nodeType === 'branchAdd' ) {
              // 如果是主数据 接口名称：/modeling/mdmdesign/save
              let leafNode = await this.props.treeRefTreeStore.submitLeafRequest(values)
              this.close()
              const { expandedKeys } = this.props.treeRefTreeStore.tree;
              await this.props.treeRefTreeStore.getTree(this.props.url, this.props.expendId)
              if (leafNode && leafNode.id) {
                if (!expandedKeys.includes(leafNode.pid)) {
                  expandedKeys.push(leafNode.pid)
                }
                // 复制成功保存上级节点名称
                this.props.treeRefTreeStore.setParentName(nodeInfo.name)
                this.props.treeRefTreeStore.setExpandedKeys(expandedKeys);
                window.mdmNowUrl = window.location.href;
                this.props.history.push(`/leaf/${leafNode.id}`)
              }
            } else if(nodeType === 'rootFolder' || nodeType === 'branchFolder'){
              let leafNode = await this.props.treeRefTreeStore.submitAddNodeRequest(values)
              this.close()
              await this.props.treeRefTreeStore.getTree(this.props.url, this.props.expendId)
              // if (leafNode && leafNode.id) {
              //   this.props.history.push(`/`)
              // }

            } else if (nodeType === 'branchEdit' || nodeType === 'leafEdit'){
              // 修改编辑
              const { nodeInfo,editInfo } = this.props.treeRefTreeStore.modal;
              values.pk_category = editInfo.treeref_pkgd;
              console.log(values)
              switch(nodeInfo.isparent){
                case true: //树枝干
                  await this.props.treeRefTreeStore.submitEditNodeRequest(values);
                  break;
                case false: //叶子节点
                  await this.props.treeRefTreeStore.getDesignInfo(nodeInfo.id);
                  await this.props.treeRefTreeStore.submitLeafRequest(values,nodeInfo.id);
                  break;
              }
              this.close()
              // modal.nodeType === 'rootFolder' || modal.nodeType === 'branchFolder' || modal.nodeType === 'branchEdit'
              await this.props.treeRefTreeStore.getTree(this.props.url, this.props.expendId)
            }

        }
    });
  }

	render() {
    const { modal, ifDisplayNoneClass,nodeLeaf:{info:{state}} } = this.props.treeRefTreeStore
    let flag = modal.nodeType === 'leafEdit' ? true : false; // 修改主数据
    // console.log('ifDisplayNoneClass', ifDisplayNoneClass)
		return (
      <div>
                <Modal
                  show={modal.showModal}
                  onHide={this.close}
                  style={{width: 600}}
                  className="tree-modal"
                  backdropClosable={false}
                  style={{display: ifDisplayNoneClass ? 'none' : 'block'}}
                  backdropStyle={{display: ifDisplayNoneClass ? 'none' : 'block'}}
                >
                  <Modal.Header className="text-center" closeButton>
                      <Modal.Title>
                        {modal.nodeType === 'rootFolder' || modal.nodeType === 'branchFolder' || modal.nodeType === 'branchEdit'? <FormattedMessage id="js.com.tre4.0003" defaultMessage="主数据分类" /> : <FormattedMessage id="js.com.tre4.0004" defaultMessage="主数据" />}
                      </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* {modal.nodeType === 'branchEdit'?
                      <EditDataForm form={this.props.form}/>:<AddMainDataForm form={this.props.form} />
                    } */}
                    <AddMainDataForm form={this.props.form} />
                  </Modal.Body>
                  <Modal.Footer className="text-center">
                  <Button bordered disabled={flag && (state === 1 || state === 2)} style={{ marginRight: 20 }} onClick={this.close}>
                        <FormattedMessage id="js.com.tre4.0005" defaultMessage="取消" />
                    </Button>
                    <Button colors="primary" disabled={flag && (state === 1 || state === 2)} onClick={this.submit}>
                        <FormattedMessage id="js.com.tre4.0006" defaultMessage="确认" />
                    </Button>
                  </Modal.Footer>
                </Modal>
      </div>

		);
	}
}

export default Form.createForm()(TreeModal)
