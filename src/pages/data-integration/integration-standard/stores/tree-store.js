import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'

export default class TreeStore1 {
  constructor(props) {

  }
  // 树的信息
  @observable tree = {
    info: [],
    activeType: '', // 当前选中 root branch leaf
    isleaf: false,
    node: ''
  }

  // 树弹出框的信息
  @observable modal = {
    showModal: false,
    nodeInfo: {},
    nodeType: ''
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

  @action getTree(url, expendId) {
    return new Promise((resolve, reject) => {
      url = url || '/modeling/category/md-tree'
      request(url, {
        method: "GET",
        data: {}
      }).then((resp) => {
        this.tree.info = resp.data || []
        console.log(this.nodeLeaf.info)
        // if (!expendId) {
        //   this.nodeLeaf.info = ''
        // }
        this.tree.activeType = 'root'
        resolve()
      }).catch(reject)
    })
  }

  //树叶子节点的单击事件
  @action leafClick(node) {
    if (!node.isRoot && !node.isparent) {
      this.tree.isleaf = true;
      this.tree.node = node;
    } else {
      this.tree.isleaf = false;
      this.tree.node = node;
    }
  }


  toJson() {
    return {

    }
  }
}

