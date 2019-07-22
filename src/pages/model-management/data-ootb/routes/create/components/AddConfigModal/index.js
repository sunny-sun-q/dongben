import React, { Component } from 'react'
import { Icon, FormControl } from 'tinper-bee'
import Checkbox from 'bee-checkbox';
import Modal from 'bee-modal'
import Tree from 'bee-tree'
const TreeNode = Tree.TreeNode;
import {Button} from 'components/tinper-bee';
import './index.less'

import {
  observer,
} from 'mobx-react';


@observer
class ModalView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      searchValue: props.defaultSearch
    }
  }

  onSearch = () => {
    const { searchValue } = this.state;
    this._loadTree(searchValue, true)
  }

  onChange = (value) => {
    this.setState({searchValue: value})
  }

  _loadTree = (param='', isSearch=false) => {
    const { loadTree } = this.props;
    loadTree(param, isSearch)
  }

  componentWillReceiveProps(nextProps) {
    const {
      nodeInfo: nexNodeInfo,
      defaultSearch: nextDefSearch
    } = nextProps;
    const { nodeInfo } = this.props;
    if (!nodeInfo && nexNodeInfo) {
      if (nextDefSearch) {
        this.setState({
          searchValue: nextDefSearch || ''
        })
      }
      let param = nextDefSearch;
      let isSearch = !!nextDefSearch;
      this._loadTree(param, isSearch)
    }
  }

  expandedKeys = [];

  renderTreeNode = (treeModel, parentIndex='') => {
    const { onChecked } = this.props;
    const nodeList = treeModel.map((treeItem, index) => {
      //node_type 节点类型 root|folder|main|sub
      const { children, id, displayname, checked, halfChecked } = treeItem;
      const _children = children || [];
      //dataIndex 用来标示节点在treeModal中的未知
      const dataIndex = `${parentIndex}${index}`;
      const data = {
        dataIndex,
        ...treeItem
      }

      if (halfChecked || checked){
        this.canConfirm = true;
      }

      let titleNode = (
        <div className={`tree-title`}>
          {
            treeItem.type === 'ENTITY'?
            <Checkbox
            key={id}
            indeterminate={halfChecked}
            checked={checked}
            onChange={(checkType) => {
              onChecked(checkType, data)
            }}
          />: ''
          }
          <span>{displayname}</span>
        </div>
      )

      if (_children.length > 0) {
        this.expandedKeys.push(id)
      }

      return (
        <TreeNode
          key={id}
          title={titleNode}
          data={data}
          isLeaf={data.type === 'ENTITY'}
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
      treeType,
      onCancel,
      onConfirm,
      onClear,
      defaultSearch
    } = this.props;
    const show = !!nodeInfo;
    if (!show) {
      return null
    }
    let onCancelFun = () =>{
      this.setState({
        searchValue: ''
      })
      this.expandedKeys = [];
      onCancel()
    }
    let onConfirmFun = () => {
      this.expandedKeys = [];
      onConfirm()
      this.setState({
        searchValue: ''
      })
    }
    this.canConfirm = false;
    const nodeList = this.renderTreeNode(tree);

    // this.state.searchValue = ''
    return (
      <Modal
        enforceFocus={false}
        className="create-modal pop_dialog"
        size="lg"
        show={show}
        onHide={onCancelFun}
        backdropClosable={false}
      >

        <Modal.Header
          className="create-modal-header"
          closeButton={false}
        >
          <Modal.Title
            className="create-modal-title"
          >
            <span>选择模型</span>
          </Modal.Title>
          {!defaultSearch?<FormControl
            className="create-modal-search"
            size="sm"
            type="search"
            value={this.state.searchValue}
            onSearch={this.onSearch}
            onChange={this.onChange}
          />:''}
        </Modal.Header>

        <Modal.Body
          className="create-modal-body"
        >
          <div className='create-modal-tree-w'>
            <Tree
              defaultExpandAll={true}
              defaultExpandedKeys={this.expandedKeys}
              className="create-modal-tree"
              openIcon={<Icon type="uf-arrow-down" />}
              closeIcon={<Icon type="uf-arrow-right" />}
              loadData={treeType === 'all' ? this._loadTree : null}
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
            onClick={onCancelFun}
          >取消</Button>
          <Button
            colors="primary"
            disabled={!this.canConfirm}
            onClick={onConfirmFun}
          >确定</Button>
        </Modal.Footer>
      </Modal>
    )
  }

}
export default ModalView
