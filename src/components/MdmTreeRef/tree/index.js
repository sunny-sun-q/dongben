
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {
	Component
} from 'react';
import { Icon, Menu,  Tooltip, Upload  } from 'tinper-bee';
import Message from 'bee-message';
const { Item } = Menu;
import Dropdown from 'bee-dropdown'
// import Menu from 'bee-menu'
import {Button} from 'components/tinper-bee';
import Modal from 'bee-modal';
import Tree from 'bee-tree'
import TreeModal from './tree-modal'

// import 'antd/lib/tree/style/index.css';
import './index.less'

import {
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';
import { success, Warning } from '../../utils/index';

import {getContextId} from 'utils';
const contextId = getContextId();

const TreeNode = Tree.TreeNode;
const prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';// 'http://127.0.0.1:8080/iuapmdm';

@withRouter
@inject((stores) => {
  return {
    treeRefTreeStore: stores.treeRefTreeStore,
    treeRefStore: stores.treeRefStore
  }
}) @observer
class Siderbartree extends Component {
	constructor(props) {
    super(props);
    const keys = this.props.keys;
    const self = this;
		this.state = {
      defaultExpandedKeys: keys,
      isHover: "", // 悬停  这个实际上是悬停时得到当前节点的id
      showModal: false,
      modalTitle: '',
      delModalShow: false,
      selectedKeys: [''],
      selecteCategory:''
    };

    this.mdmUpload={
      name: 'file', //文件名
      action: ``, // 上传的服务器地址
      accept: '.xml', //设置文件接收类型
      showUploadList:false, // 是否显示上传列表
      headers: { // 设置请求的头部信息
        authorization: 'authorization-text',
      },
      onChange(info) {// 当文件正在上传，上传成功和上传失败触发的回调函数。 当上传状态发生变化，返回下列参数。
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          console.log(`${info.file.name} file uploaded successfully`);
          if('success' == info.file.response.flag){
            success(<FormattedMessage id="js.com.tre1.0001" defaultMessage=".xml上传文件成功,开始解析并导入模型" />)
            self.xmlParseToModel(info.file.response.fileName, self.state.selecteCategory);
          }else{
            Warning(<FormattedMessage id="js.com.tre1.0002" defaultMessage=".xml上传文件失败" />)
          }
        } else if (info.file.status === 'error') {
          console.log(`${info.file.name} file upload failed.`);
        }
      }
    },

    this.loop = this.loop.bind(this)
    this.closeDelModal = this.closeDelModal.bind(this)
    this.delSubmit = this.delSubmit.bind(this)
    this.onExpand = this.onExpand.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.xmlParseToModel = this.xmlParseToModel.bind(this);
  }

  onTreeSelect = (selectedKeys, info) => {
    // this.props.treeRefTreeStore.setNodeLeaf
    console.log('selected', selectedKeys);
  }

  async componentDidMount() {
    await this.props.treeRefTreeStore.getTree(this.props.url, this.props.expendId, this.props.filterOption)
    let showTree = this.getInitTree()
    let loopFun = (data) => {
      return data.map(item => {
        if (item.children.length>0) {
          loopFun(item.children)
        }
        if(item.id === this.props.expendId){
          this.leafClick(item);
        }
      });
    }
    loopFun(showTree)
  }

  async componentWillReceiveProps(nextProps) {
    if(this.props.expendId != nextProps.expendId){
      await this.props.treeRefTreeStore.getTree(this.props.url, this.props.expendId, this.props.filterOption)
      let showTree = this.getInitTree()
      let loopFun = (data) => {
        return data.map(item => {
          if (item.children.length>0) {
            loopFun(item.children)
          }
          if(item.id === this.props.expendId){
            this.leafClick(item);
          }
        });
      }
      loopFun(showTree)
    }
  }

  onVisibleChange(visible) {
    console.log(visible)
  }

  onDownSelect({ key }) {
    console.log(`${key} selected`);
  }

  async xmlParseToModel( uploadFileName, pk_category){
    var resultData = await this.props.treeRefTreeStore.xmlParseToModel(uploadFileName, pk_category);
    var expectId = resultData.expectId;
    // 获取导入后的设计模型主键,刷新树并展开新导入的节点
    this.props.treeRefTreeStore.resetTempNode()
    // 刷新树对象
    this.props.treeRefTreeStore.getTree(this.props.url, expectId)
    // 跳转对应节点,涉及创建新的节点再挂接在树上
    // self.props.history.push(`/leaf/` + expectId)
  }

  /**
   * 点击树节点
   * case 1: 点击叶节点，切换右侧内容
   * case 2: 叶节点切换到其他叶节点，切换右侧内容
   * case 3: 点击枝干，清空右侧内容
   * case 4: 枝干切换到其他枝干，无动作
   * @param {*} node
   * @param {*} flag 是否双击
   */
  async leafClick(node, paramFlag) {
    const { id } = this.props.match.params;
    if(this.props.isRefTree) {
      this.props.leafClickCallBack && this.props.leafClickCallBack(node, paramFlag)
      this.props.treeRefTreeStore.setNextNodeInfo(node, '')
      this.props.treeRefTreeStore.setSelectedKeys([node.id]);
      return
    }
    if(this.props.hasClickCallBack) {
      let flag = this.props.leafClickCallBack && this.props.leafClickCallBack(node,this.props.treeRefTreeStore.tree.joinfield)
      if (flag){
        const { info } = this.props.treeRefTreeStore.tree
        this.setState({
          selectedKeys: [this.props.match.params.id ? this.props.match.params.id : '']
        })
        this.props.treeRefTreeStore.setNextNodeInfo(node, '')
        this.props.treeRefTreeStore.setSelectedKeys([node.id]);
        return
      }
    }

    if (!node.isparent && !node.isRoot) { // 点击叶子节点
      if(this.props.isRefTree) {
        this.props.leafClickCallBack&&this.props.leafClickCallBack(node);
        this.props.treeRefTreeStore.setSelectedKeys([node.id]);
      } else { // 是否重复点击叶子节点
        this.props.treeRefTreeStore.setLeafTapMsg(node, 'leafNode');
        this.props.treeRefTreeStore.setSelectedKeys([node.id]);
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/leaf/${node.id}`)
      }
    }else if( id && (node.isparent || node.isRoot) ){ //前一节点是否为枝干 && 主数据分类
      this.props.treeRefTreeStore.setBranchInfo(node)
      window.mdmNowUrl = window.location.href;
      this.props.history.push(`/`)
    }

  }

  // 拼出树节点的title
  nodeContent(node,noChild) {
    let editIcon = null
    let addIcon = null
    let delIcon = null
    let folderIcon = null
    let ImportIcon = null
    const { isRefTree } = this.props;
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id: 'js.com.tre.0001',defaultMessage:"主数据"}): this.props.intl.formatMessage({id: 'js.rou.cus.0001',defaultMessage:"档案"})
    let addText =  this.props.intl.formatMessage({id: 'js.com.tre1.0008',defaultMessage:"添加"}) + text;
    let editText =  this.props.intl.formatMessage({id: 'js.com.tre1.0010',defaultMessage:"修改"}) + text;
    let delText =  this.props.intl.formatMessage({id: 'js.com.tre1.0011',defaultMessage:"删除"}) + text;
    switch(true){
      case node.isRoot && this.props.specialFlag :
      {
        addIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0003" defaultMessage="添加数据" />}>
            <Icon type="uf-plus"
              onClick={(e) =>this.props.option.add(e,node)}
            />
          </Tooltip>
        );
        break;
      }
      case this.props.specialFlag:
      {
        addIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0003" defaultMessage="添加数据" />}>
            <Icon type="uf-plus"
              onClick={(e) =>this.props.option.add(e,node)}
            />
          </Tooltip>
        );
        editIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0004" defaultMessage="修改数据" />}>
            <Icon type="uf-pencil"
              onClick={(e) =>this.props.option.change(e,node)}
            />
          </Tooltip>
        );
        delIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0005" defaultMessage="删除数据" />}>
            <Icon
              type="uf-del"
              onClick={(e) =>this.props.option.delete(e,node)}
            />
          </Tooltip>
        );
        break;
      }
      case node.id === '0': //根节点
        folderIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0006" defaultMessage="添加下级分类" />}>
            <Icon type="folder-white-shape uf-folder-o"
              onClick={(e) =>this.onIconClick(e,node, 'rootFolder')}
            />
          </Tooltip>
        );
        break;
      case (node.isparent && !noChild): //有叶子节点的树枝干
        editIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0007" defaultMessage="修改分类" />}>
            <Icon type="uf-pencil"
              onClick={(e) =>this.onIconClick(e,node, 'branchEdit')}
            />
          </Tooltip>
        );
        addIcon = (
          <Tooltip inverse placement="bottom" overlay={addText}>
            <Icon type="uf-plus"
              onClick={(e) =>this.onIconClick(e,node, 'branchAdd')}
            />
          </Tooltip>
        );
        ImportIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0009" defaultMessage=".xml模型导入" />}>
            <Icon type="uf-upload"
              onClick={(e) =>this.onIconClick(e,node, 'importDesignModel')}
            />
          </Tooltip>
        );
        if(contextId !== 'mdm'){
          ImportIcon = null;
        }
        folderIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0006" defaultMessage="添加下级分类" />}>
            <Icon type="folder-white-shape uf-folder-o"
              onClick={(e) =>this.onIconClick(e,node, 'branchFolder')} // 主数据分类
            />
          </Tooltip>
        );
        break;
      case (noChild && !node.isparent && (node.state === 0 || node.state === 2) && (node.publish === 0 || !node.publish)): //叶子节点，即数据模型
        editIcon = (
          <Tooltip inverse placement="bottom" overlay={editText}>
            <Icon type="uf-pencil"
              onClick={(e) =>this.onIconClick(e,node, 'leafEdit')}
            />
          </Tooltip>
        );
        delIcon = (
          <Tooltip inverse placement="bottom" overlay={delText}>
            <Icon
              type="uf-del"
              onClick={(e) =>this.onIconClick(e,node, 'leafDel')}
            />
          </Tooltip>
        );
        break;
      case (noChild && node.isparent): //没有叶子的树枝干
        editIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0007" defaultMessage="修改分类" />}>
            <Icon type="uf-pencil"
              onClick={(e) =>this.onIconClick(e,node, 'branchEdit')}
            />
          </Tooltip>
        )
        addIcon = (
          <Tooltip inverse placement="bottom" overlay={addText}>
            <Icon type="uf-plus"
              onClick={(e) =>this.onIconClick(e,node, 'branchAdd')}
            />
          </Tooltip>
        );
        ImportIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0009" defaultMessage=".xml模型导入" />}>
            <Icon type="uf-upload"
              onClick={(e) =>this.onIconClick(e,node, 'importDesignModel')}
            />
          </Tooltip>
        );
        if(contextId !== 'mdm'){
          ImportIcon = null;
        }
        // ImportIcon = null;
        folderIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0006" defaultMessage="添加下级分类" />}>
            <Icon type="folder-white-shape uf-folder-o"
              onClick={(e) =>this.onIconClick(e,node, 'branchFolder')} // 主数据分类
            />
          </Tooltip>
        );
        delIcon = (
          <Tooltip inverse placement="bottom" overlay={<FormattedMessage id="js.com.tre1.0012" defaultMessage="删除分类" />}>
            <Icon
              type="uf-del"
              onClick={(e) =>this.onIconClick(e,node, 'branchDel')}
            />
          </Tooltip>
        );
        break;
      default:
        break;
    }

    return (
      <div className="tree-branch" onClick={() => this.leafClick(node)} onDoubleClick={() => this.onDoubleClick(node)}>
        <div className={`${isRefTree? "hide-tree-icon" : "show-tree-icon"}`}>  {/* 算式运算 */}
          {
            node.isparent || node.id === '0' ? <Icon type="folder-white-shape uf-folder-o" />
            : node.obNode? <Icon type="uf uf-book" />: <Icon type="uf uf-list-s-o" />
          }
        </div>
        <div className="tree-name">
          {/* {node.name} */}
          <a title={node.name}>{node.name}</a>
        </div>
        {

          this.state.isHover === node.id && !this.props.ifNoHover && (this.props.showIcon!==false) ? (<div className={`icon-group`} >
            {editIcon}
            {addIcon}
            {ImportIcon}
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
          <TreeNode key={item.id} title={this.nodeContent(item)} data-id={item.id}>
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={this.nodeContent(item,true)} data-id={item.id} />;
    });
  }

  onMouseEnter = (e) => {
		this.setState({
			isHover: e.node.props.eventKey
		})
  }

  async onIconClick(e, item, type) {
    // let event = e || window.event
    if (window.event) {
      window.event.cancelBubble = true;
    }
    e.stopPropagation && e.stopPropagation()
    // 清空editInfo 内容
    this.props.treeRefTreeStore.setEditInfo({})
    this.props.treeRefStore.resetRefMsg({});
    const {treeRefTreeStore } = this.props;
    // 草稿、停用
    if (type === 'rootFolder' || type === 'branchFolder') { // rootFolder branchFolder branchAdd
      this.props.treeRefTreeStore.setModalMsg(item, type)
      this.props.treeRefTreeStore.setTreeModal(true)
    } else if (type === 'branchEdit' || type === 'leafEdit'){
      setTimeout(() => {
        this.props.treeRefTreeStore.setModalMsg(item, type)
      }, 100)
      await this.props.treeRefTreeStore.getDesignInfo(item.id);
      this.props.treeRefTreeStore.editNodeBranch(item, type)
      this.props.treeRefTreeStore.setTreeModal(true)
    } else if(type === 'branchAdd'){
      this.props.treeRefTreeStore.resetTempNode()
      this.props.treeRefTreeStore.setModalMsg(item, type)
      this.props.treeRefTreeStore.setTreeModal(true)
      this.props.treeRefTreeStore.getTree(this.props.url, this.props.expendId)
    } else if(type === 'importDesignModel'){
      this.setState({
        selecteCategory: item.id
      })
      this.props.treeRefTreeStore.setModalMsg(item, 'importDesignModel')
      ReactDOM.findDOMNode(this.refs.upload).click(); // 获取uplaod组件对应的真实dom   this.refs.upload是<Upload>组件的一个实例
    } else if (type === 'leafDel' || type === 'branchDel') {
      if (type === 'leafDel' && item.publish) {
        Message.create({content: <FormattedMessage id="js.com.tre1.0013" defaultMessage="已经发布的主数据不能删除！" />, color: 'danger'})
        return
      }
      this.setState({
        delModalShow: true
      })
      this.props.treeRefTreeStore.setModalMsg(item, type)
    } else {
      window.mdmNowUrl = window.location.href;
      this.props.history.push('/')
      // defaultExpandedKeys
      // this.props.treeRefTreeStore.setExpandedKeys()
      this.props.treeRefTreeStore.setNodeLeaf(item, type)
      this.props.treeRefTreeStore.resetTableStatus(true,false)
    }
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
   * 树展开和收起
   * @param {*} expandedKeys
   */
  onExpand(expandedKeys) {
    this.props.treeRefTreeStore.setExpandedKeys(expandedKeys);
  }

  /**
   * 删除主数据、主数据分类
   */
  async delSubmit() {
    const { state } = this.props.treeRefTreeStore.modal.nodeInfo;
    const { nodeType } = this.props.treeRefTreeStore.modal;
    // 叶子节点才需要弹出
    if( state === 1 && nodeType === 'leafDel'){
        alert(<FormattedMessage id="js.com.tre1.0014" defaultMessage="该模型已启用，不能进行删除操作" />);
        return;
    }
    const { id } = this.props.treeRefTreeStore.modal.nodeInfo;
    const { url,expendId } = this.props;
    switch(nodeType){
      case "leafDel": //删除主数据
        await this.props.treeRefTreeStore.getEntitys(id);
        if(this.props.treeRefTreeStore.pk_mdentity){
          await this.props.treeRefTreeStore.delEntitys(this.props.treeRefTreeStore.pk_mdentity)
        }
        await this.props.treeRefTreeStore.delLeaf(id)

        break;
      case "branchDel":
        await this.props.treeRefTreeStore.delBranch(id)
        break;
      default:
        break;
    }
    this.props.treeRefTreeStore.getTree(url, expendId)
    this.closeDelModal()
    window.mdmNowUrl = window.location.href;
    this.props.history.push('/')
  }

  onDragEnter(info) {
    console.log(info)

  }

  onDrop(info) {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.id === key) {
          return callback(item, index, arr);
        }
        if (item.children.length > 0) {
          return loop(item.children, key, callback);
        }
      });
    };
    let showTree = this.getInitTree()

    let dragObj;
    loop(showTree, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(showTree, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      ar.splice(i, 0, dragObj);
    } else {
      loop(showTree, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }

    this.props.treeRefTreeStore.resetTreeInfo(showTree[0].children)
  }

  filterById(info = [], id) {
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => { // forEach方法中的function回调支持3个参数，第1个是遍历的数组内容；第2个是对应的数组索引，第3个是数组本身
        if (item.id === key) {
          return callback(item, index, arr);
        }
        if (item.children && item.children.length > 0) {
          return loop(item.children, key, callback);
        }
      });
    };

    loop(info, id, (item, index, arr) => { // 回调函数
      arr.splice(index, 1);// 从数组中删除指定index角标的1个元素
    });
    return info
  }

  getInitTree() {

    const { tree, tree: {info} } = this.props.treeRefTreeStore  // 获取store下对象写法
    let tempInfo = info
    if (this.props.filterById && this.props.filterById.filterId) {// 自参照弹出框
      tempInfo = this.filterById(tempInfo, this.props.filterById.filterId)
    }
    const root = this.props.root
    let showTree = []
    if (root) {
      showTree = [{
        id: root.id,
        name: root.name,
        isRoot: true,
        children: tempInfo
      }]
    } else {
      showTree = tempInfo
    }
    return showTree
  }

  onDoubleClick (node) {
    if (!node.isparent && !node.isRoot) {
      this.leafClick(node, true)
    }
  }

	render() {
    let { id } = this.props.match.params;
    const { autoSelect=false } = this.props; //自动进行节点匹配
    const { expandedKeys, selectedKeys } = this.props.treeRefTreeStore.tree;
    if("" != this.state.selecteCategory){
      var action = prefixUrl + '/loadingThirdPartService/uploadXML?pk_category=' + this.state.selecteCategory;
      this.mdmUpload.action = action;
    }
    let showTree = this.getInitTree()
    let obj = {}

    if (!autoSelect) {
      if (!this.props.isRefTree) obj.selectedKeys = [id]
      !id ? id = this.props.treeRefTreeStore.branchInfo.id : null
    }else {
      obj.selectedKeys = selectedKeys;
      id = expandedKeys[0] || null;
    }

		return (
      <div>
        <Tree
          // onSelect={this.onTreeSelect}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          defaultExpandedKeys={["0"]}
          expandedKeys={expandedKeys}
          defaultSelectedKeys={!this.props.defaultNoneSelect ? [id] : []}
          // selectedKeys={!this.props.isRefTree ? [id] : false}
          onExpand={this.onExpand}
          openIcon={<Icon type="uf-arrow-down" />}
          closeIcon={<Icon type="uf-arrow-right" />}
          autoExpandParent={false}

          {...obj}

          // draggable
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
        >
          {this.loop(showTree)}
        </Tree>
        <TreeModal title={this.state.modalTitle} leafClick={this.leafClick}/>
        {/* 删除时的提示框 */}
        <Modal
          show={this.state.delModalShow}
          onHide={this.closeDelModal}
          style={{width: 600}}
          className="tree-modal"
          backdropClosable={false}
        >
          <Modal.Header className="text-center" closeButton>
              <Modal.Title>
                <FormattedMessage id="js.com.tre1.0015" defaultMessage="确认信息" />
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-body-content">
              <i className="uf uf-exc-t del-warning-icon"></i>
              <h3><FormattedMessage id="js.com.tre1.0016" defaultMessage="您确定要删除吗？" /></h3>
            </div>
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button colors="primary" style={{ marginRight: 20 }} onClick={this.closeDelModal}>
                <FormattedMessage id="js.com.tre1.0017" defaultMessage="取消" />
            </Button>
            <Button bordered onClick={this.delSubmit}>
                <FormattedMessage id="js.com.tre1.0018" defaultMessage="确认" />
            </Button>
          </Modal.Footer>
        </Modal>
        <Upload {...this.mdmUpload} style={{display:'none'}}>

          <Button colors="primary" className="upload-button" ref='upload'>
            <FormattedMessage id="js.com.tre1.0019" defaultMessage="装载" />
          </Button>
        </Upload>
      </div>
		);
	}
}

export default injectIntl(Siderbartree, {withRef: true});;
