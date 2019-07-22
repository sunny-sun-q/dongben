import React, { Component } from 'react'
import {  Icon, FormControl } from 'tinper-bee'
import Checkbox from 'bee-checkbox';
import Modal from 'bee-modal'
import Tree from 'bee-tree'
const TreeNode = Tree.TreeNode;
import {Button} from 'components/tinper-bee';
// import './index.less'

import {
  observer,
} from 'mobx-react';


@observer
class ModalView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    }
  }

  onSearch = () => {
    const { searchValue } = this.state;
    this._loadTree(searchValue)
  }

  onChange = (value) => {
    this.setState({searchValue: value})
  }

  _loadTree = (param='') => {
    const { loadTree } = this.props;
    loadTree(param)
  }

  componentWillReceiveProps(nextProps) {
    const { nodeInfo: nexNodeInfo } = nextProps;
    const { nodeInfo } = this.props;
    if (!nodeInfo && nexNodeInfo) {
      this._loadTree()
    }
  }

  renderTreeNode = (treeModel, parentIndex='') => {
    const { onChecked } = this.props;
    const nodeList = treeModel.map((treeItem, index) => {
      //node_type 节点类型 root|folder|main|sub
      const { children, id, displayname, checked, halfChecked, node_type, disabled } = treeItem;
      const _children = children || [];
      //dataIndex 用来标示节点在treeModal中的未知
      const dataIndex = `${parentIndex}${index}`;
      const data = {
        ...treeItem,
        dataIndex,
      }
      let titleNode = (
        <div className={`tree-title`}>
          <Checkbox
            className={node_type === 'sub' ? 'checkbox-sub' : ''}
            disabled={disabled}
            key={id}
            indeterminate={halfChecked}
            checked={checked}
            onChange={(checkType) => {
              onChecked(checkType, data)
            }}
          />
          <span>{displayname}</span>
        </div>
      )

      if (checked) {
        this.canConfirm = true
      }

      return (
        <TreeNode
          key={id}
          title={titleNode}
          data={data}
          isLeaf={node_type === 'sub'}
        >
          {this.renderTreeNode(_children, `${dataIndex}-`)}

        </TreeNode>
      )
    })
    return nodeList
  }


  render() {
    const {
      nodeInfo,
      tree,
      onCancel,
      onConfirm,
      onClear
    } = this.props;
    const show = !!nodeInfo;
    if (!show) {
      return null
    }

    this.canConfirm = false;
    const nodeList = this.renderTreeNode(tree);
    return (
      <Modal
        enforceFocus={false}
        className="create-modal pop_dialog"
        size="lg"
        show={show}
        onHide={onCancel}
        backdropClosable={false}
      >

        <Modal.Header
          className="create-modal-header"
          closeButton={false}
        >
          <Modal.Title
            className="create-modal-title"
          >
            <span>增加预置</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          className="create-modal-body"
        >
          <div className='create-modal-tree-w'>
            <Tree
              defaultExpandAll={true}
              className="create-modal-tree"
              openIcon={<Icon type="uf-arrow-down" />}
              closeIcon={<Icon type="uf-arrow-right" />}
            >
              {nodeList}
            </Tree>
          </div>
        </Modal.Body>

        <Modal.Footer className="pop_footer">
          <Button
            bordered
            colors="primary"
            onClick={onClear}
            style={{
              float: 'left',
              margin: '0'
            }}
          >清空已选</Button>
          <Button
            bordered
            onClick={onCancel}
          >取消</Button>
          <Button
            colors="primary"
            disabled={!this.canConfirm}
            onClick={onConfirm}
          >确定</Button>
        </Modal.Footer>
      </Modal>
    )
  }

}
export default ModalView
