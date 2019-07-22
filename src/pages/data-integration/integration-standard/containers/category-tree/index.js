
import React, {
	Component
} from 'react';
import { Icon, Menu, Button } from 'tinper-bee';
const { Item } = Menu;
import Modal from 'bee-modal';
import Tree from 'bee-tree'
import './index.less'

import {
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

const TreeNode = Tree.TreeNode;
@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    sysregisterStroe: stores.sysregisterStroe,
  }
}) @observer
class Siderbartree extends Component {
	constructor(props) {
		super(props);
		const keys = this.props.keys;
		this.state = {
			defaultExpandedKeys: keys,
			defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      isHover: "",
      showModal: false,
      modalTitle: '',
      delModalShow: false
    };
    this.loop = this.loop.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.closeDelModal = this.closeDelModal.bind(this)
    this.delSubmit = this.delSubmit.bind(this)
  }


  componentDidMount() {
    this.props.treeStore.getTree(this.props.url, this.props.expendId)
  }

  leafClick(node) {
    this.props.treeStore.leafClick(node);
    this.props.sysregisterStroe.sysregister.isTreeClick = 'Y';
  }

  nodeContent(node) {
    let editIcon = null
    let addIcon = null
    let delIcon = null
    let folderIcon = null

    return (
      <div className="tree-branch" onClick={() => this.leafClick(node)}>
        <div>
          {
            node.isparent || node.id === '0' ? <Icon type="folder-white-shape uf-folder-o" /> 
            : <Icon type="uf uf-list-s-o" />
          }
        </div>
        <div className="tree-name"
        >
          {node.name}
        </div>
        {
          this.state.isHover === node.id && !this.props.ifNoHover ? (<div className={`icon-group`} >
            {editIcon}
            {addIcon}
            {folderIcon}
            {delIcon}
          </div>) : null
        }
      </div>
    )
  }

  loop(data) {
    return data.map(item => {
      if (item.children.length>0) {
        return (
          <TreeNode key={item.id} title={this.nodeContent(item)} >
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={this.nodeContent(item,true)} />;
    });
  }
  

  onMouseEnter = (e) => {
		this.setState({
			isHover: e.node.props.eventKey
		})
  }

  onMouseLeave = () => {
      this.setState({
        isHover: "",
      })
  }

  closeDelModal() {
    this.setState({
      delModalShow: false
    })
  }

  /**
   * 删除主数据、主数据分类
   */
  async delSubmit() {
    const { nodeType } = this.props.treeStore.modal;
    const { id } = this.props.treeStore.modal.nodeInfo;
    const { url,expendId } = this.props;
    switch(nodeType){
      case "leafDel": //删除主数据
        await this.props.treeStore.getEntitys(expendId);
        if(this.props.treeStore.pk_mdentity){
          await this.props.treeStore.delEntitys(this.props.treeStore.pk_mdentity)
        }
        await this.props.treeStore.delLeaf(id)
        break;
      case "branchDel":
        await this.props.treeStore.delBranch(id)
        break;
      default:
        break;
    }
    this.props.treeStore.getTree(url, expendId)
    this.closeDelModal()
  }

	render() {
    const { tree } = this.props.treeStore
    const root = this.props.root
    const { id } = this.props.match.params
    let showTree = []
    if (root) {
      showTree = [{
        id: root.id,
        name: root.name,
        isRoot: true,
        children: tree.info
      }]
    } else {
      showTree = tree.info
    }
    console.log('this.props.match.params.id', this.props.match.params.id)
		return (
      <div>
        <Tree
          onSelect={this.onTreeSelect}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          defaultExpandAll
          defaultSelectedKeys={[id]}
          openIcon={<Icon type="uf-arrow-down" />} 
          closeIcon={<Icon type="uf-arrow-right" />}
        >
          {this.loop(showTree)}
        </Tree>

      </div>
		);
	}
}

export default Siderbartree
