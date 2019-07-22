

import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'
import { post } from 'utils/request.js'
import qs from 'querystring'
import { success } from 'utils/index.js'
import { debug } from 'util';

function getMapRepeat(arr, key) {

  arr.forEach((item) => {
    if (item.key===key) {
      return item.children;
    } else {
      getMapRepeat(item.children, key)
    }
  })
}

export default class treeStore1 {
  constructor(props) {
    // this.nodeLeaf.info = {}
    // console.log('this.nodeLeaf.info', this.nodeLeaf.info)
  }
  // 树的信息
  @observable tree = {
    info: [],
    activeType: '' ,// 当前选中 root branch leaf
    expandedKeys: ['0'],
    selectedKeys: [],
    specialFlag : null,
  }

  // 上级节点名称
  @observable parentName = ''

  // 导入节点的期望id
  @observable expectId = ''

  /**
   * 上级节点名称(复制或者新建主数据)
   * @param {*} data
   */
  @action setParentName(value){
    this.parentName = value
  }

  // 树弹出框的信息
  @observable modal = {
    showModal: false,
    nodeInfo: {},
    nodeType: '',
    editInfo: {}, //存储表单修改未提交的信息
  }

  // 树上加号，新增主数据信息(或者点击叶子节点)
  @observable nodeLeaf = {
    info: {},
    nodeType: '',
    tempNode: {},
    ifShowCreateLeaf: false,
    ifShowTable: false,
    ifShowLeafMessage: false  // 点击叶子节点时设置为true
  }
  // 点击跳转到branch时保存的数据
  @observable branchInfo = {}
  // 参照树的节点
  @observable refTree = {
    selectInfo: {}
  }

  @observable pk_mdentity = ''
  @observable ifDisplayNoneClass = false
  @observable confirmSaveModal = false
  @observable nextNodeInfo = {}

  /**
   * 设置切换树上面的节点 确认按钮modal
   * @param {*} value
   */
  @action setConfirmSaveModal(value){
    this.confirmSaveModal = value;
  }

  /**
   * 设置跳转之后的node的信息
   * @param {*} value
   */
  @action setNextNodeInfo(value){
    this.nextNodeInfo = value;
  }

  @action resetTreePkGdName(){
    delete this.refTree.info.treeref_pkgd_name
  }

  /**
   * 
   * @param {*} url  可以用this.props传递过来,即使不传有个默认值
   * @param {*} expendId 
   * @param {*} filterOption 
   */
  @action getTree(url, expendId, filterOption) {
    return new Promise((resolve, reject) => {
      url = url || '/modeling/category/md-tree';
      // console.log("url",url);
      request(url, {
        method: "GET",
        data: {},
        param: filterOption
      }).then((resp) => {
        this.tree.info = resp.data.data || resp.data || []
        // console.log(this.nodeLeaf.info)
        // if (!expendId) {
        //   this.nodeLeaf.info = ''
        // }

        this.tree.joinfield = resp.data.joinfield || null;
        this.tree.pid = resp.data.pid || null ;
        console.log(resp.data);

        // console.log(resp.data);

        this.tree.activeType = 'root'
        resolve()
        // console.log("resp:", resp);
      }).catch(reject)
    })
  }

  /**
   * 设置数的值
   * @param {*} value
   */
  @action resetTreeInfo(value){
    this.tree.info = value;
  }

  /**
   * 控制树展开收起
   * @param {*} value
   */
  @action setExpandedKeys(value){
    this.tree.expandedKeys = value;
  }

  @action setSelectedKeys(keys) {
    this.tree.selectedKeys = keys
  }

  @action setEditInfo(value, key){
    this.modal.editInfo = value;
    // key && value[key] ? this.modal.nodeInfo.id = value[key] : null
    // key && value[key + '_name'] ? this.modal.nodeInfo.name = value[key+'_name'] : null
  }

  //启用
  @action startuse(pk_gd) {
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmdesign/startuse/model`, {
        method: "POST",
        param: {
          pk_gd,
        }
      }).then((resp) => {
        success(resp.data.msg)
        this.nodeLeaf.info.state = 1;
        resolve()
      }).catch(reject)
    })
  }

  //停用
  @action stopuse(pk_gd) {
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmdesign/stopuse/model`, {
        method: "POST",
        param: {
          pk_gd,
        }
      }).then((resp) => {
        success(resp.data.msg)
        this.nodeLeaf.info.state = 2;
        resolve()
      }).catch(reject)
    })
  }

  // modal弹框是否显示
  @action setTreeModal(value) {
    this.modal.showModal = value
  }

  // 点击选中树文件夹节点图标时，保存点击节点数据
  @action setModalMsg(node, type) {
    console.log('=========', node.state)
    this.modal.nodeInfo = node
    this.modal.nodeType = type
  }

  // 点击选中树节点加号图标时，保存点击节点数据
  @action setNodeLeaf(node, type) {
    this.nodeLeaf.info = node
    this.nodeLeaf.ifShowCreateLeaf = true
  }

  // 点击选中树文件夹节点编辑图标时，保存点击节点数据
  @action editNodeBranch(node, type) {
    this.modal.nodeInfo = node
    this.modal.nodeType = type
  }

  // 查询上级分类
  @action findCategory(pk_category){
    return new Promise((resolve, reject) => {
      request('/modeling/category/findCategory', {
        method: 'GET',
        param: {
          pk_category,
        }
      }).then((resp) => {
        this.nodeLeaf.info.pk_category_name = resp.data.name;
        resolve()
      }).catch(reject)
    })
  }

  // 点击选中树节点图标时，保存点击节点数据数据
  @action setLeafTapMsg(node, type) {
    this.tree.selectedKeys = [node.id];
    this.nodeLeaf.info = node;
    this.nodeLeaf.nodeType = type;
    this.nodeLeaf.ifShowLeafMessage = true;
  }

  // 点击选中树节点图标时，保存点击节点数据数据
  @action setBranchInfo(node) {
    this.branchInfo = node
  }

  // 重置表示否显示
  @action resetTableStatus(value1,value2) {
    this.nodeLeaf.ifShowCreateLeaf = value1
    this.nodeLeaf.ifShowTable = value2
  }


//   root: modeling/category/save {"pk_parent":0,"code":"root11","name":"1231"}
// {"pk_parent":"e5a74be3-07ed-4aea-9cbd-33f3fb60be06","code":"code002","name":"kkk"}
// branch 主数据分类：modeling/category/save
//  主数据： iuapmdm/modeling/mdmdesign/save

//  {"isworkflow":true,"isstart_us_v":true,"isstatistics":false,"pk_category":"e5a74be3-07ed-4aea-9cbd-33f3fb60be06","code":"codemain","name":"namemain"}
  // 主数据分类保存(树枝干)
  @action submitAddNodeRequest(data) {
    data = Object.assign(data, {
      pk_parent: this.modal.nodeInfo.id || '0'
    })
    return new Promise((resolve, reject) => {
      // modeling/mdmdesign/save
      request('/modeling/category/save', {
        data: {
          data: JSON.stringify(data)
        },
        method: 'POST'
      }).then((resp) => {
        success(resp.data.msg)
        resolve(resp.data.data)
      }).catch(reject)
    })
  }

  // 主数据分类修改(树枝干)
  @action submitEditNodeRequest(data) {
    data = Object.assign(data, {
      pk_category: this.modal.nodeInfo.id,
      pk_parent: data.pk_category || this.modal.nodeInfo.pid,
      status: 0
    })
    return new Promise((resolve, reject) => {
      request('/modeling/category/save', {
        data: {
          data: JSON.stringify(data)
        },
        method: 'POST'
      }).then((resp) => {
        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
  }

  @action getDesignInfo(pk_gd){
    return new Promise((resolve, reject) => {
      request("/modeling/mdmdesign/getDesignInfo", {
        method: "GET",
        param: {
          pk_gd,
        }
      }).then((resp) => {
        this.nodeLeaf.tempNode = resp.data;
        resolve()
      }).catch(reject)
    })
  }

  // 根据上传后的文件名称解析文件为主数据模型
  @action xmlParseToModel(uploadFileName, pk_category){
    return new Promise((resolve, reject) => {
      request("/loadingThirdPartService/xmlParseToModel", {
        method: "GET",
        param: {
          uploadFileName,
          pk_category
        }
      }).then((resp) => {
        const data = resp.data;
        if(data.flag){
          success(data.msg)
        }
        resolve(data)
      }).catch(reject)
    })
  }

  // 清除 启用统计 启用流程特性
  @action resetTempNode() {
    this.nodeLeaf.tempNode.isstatistics = false
    this.nodeLeaf.tempNode.isworkflow = false
  }
  // 更新 TempNode
  @action updateTempNode(value = {}) {
    // value = Object.assign(this.nodeLeaf.tempNode, {})
    // this.nodeLeaf.tempNode = value
  }
  // 主数据保存(树叶节点)
  @action submitLeafRequest(data, id) {
    let data1 = this.nodeLeaf.tempNode;
    data1.code = data.code;
    data1.name = data.name;
    data1.isstatistics = data.isstatistics;
    data1.isworkflow = data.isworkflow;
    if (!id) {
      data = Object.assign(data, {
        pk_category: this.modal.nodeInfo.id,
      })
    }else{
      data = Object.assign(data1, {
        // pk_category: this.modal.nodeInfo.pid,
        pk_category: data.pk_category || this.modal.nodeInfo.pid,
        pk_gd : id
      })
    }
    return new Promise((resolve, reject) => {
      request('/modeling/mdmdesign/save', {
        data: {
          data: JSON.stringify(data)
        },
        method: 'POST'
      }).then((resp) => {
        // if (!id) {
          this.nodeLeaf.info = resp.data.data
        // }
        success(resp.data.msg)
        resolve(resp.data.data)
      }).catch(reject)
    })
  }

  // 主数据删除(树叶节点)
  @action delLeaf(id) {
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmdesign/delete/${id}`, {
        data: {},
        formatJSon: true,
        headers: {
          'Content-Type':'application/json'
        },
        method: 'DELETE'
      }).then((resp) => {
        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
  }

  //主数据分类删除
  @action delBranch(pk_category){
    return new Promise((resolve, reject) => {
      request(`/modeling/category/delete/${pk_category}`, {
        data: {},
        formatJSon: true,
        headers: {
          'Content-Type':'application/json'
        },
        method: 'DELETE'
      }).then((resp) => {
        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
  }

  //获取实体
  @action getEntitys(pk_gd) {
    let pk_mdentity;
    return new Promise((resolve, reject) => {
      request(`/modeling/entity/getEntitys?pk_gd=${pk_gd}`, {
        method: "GET",
        data: {}
      }).then((resp) => {
        if(resp.data[0]){
          pk_mdentity = resp.data[0].head.pk_mdentity
        }
        this.pk_mdentity = pk_mdentity;
        resolve()
      }).catch(reject)
    })
  }

  //删除实体
  @action delEntitys(pk_mdentity) {
    return new Promise((resolve, reject) => {
      request(`/modeling/entity/delete/${pk_mdentity}`, {
        data: {},
        formatJSon: true,
        headers: {
          'Content-Type':'application/json'
        },
        method: 'DELETE'
      }).then((resp) => {
        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
  }

  // 参照中树叶子节点的点击
  @action setRefTreeSelectInfo(info) {
    this.refTree.selectInfo = info
  }

  // 设置treeModal有没displaynone的className
  @action setTreeModalDisplayNone(value) {
    this.ifDisplayNoneClass = value
  }

  toJson() {
    return {

    }
  }
}

