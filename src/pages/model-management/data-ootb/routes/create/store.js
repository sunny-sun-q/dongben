import {observable, action, toJS} from 'mobx/lib/mobx'
//TODO attrType == 204参照
import { getUuid } from 'utils'
import {
  treeModelService,
  tableDataService,
  verifyModelService,
  saveModelService,
  createModelService,
  refTreeModelService,
  saveRefModelService,
  subRefTreeModelService
} from './services'
import { async } from 'q';

const initState = {
  pk_obinfo: '', //
  treeModel: [], //右侧树
  treeModelMap: {}, //右侧树拍平
  treeModelErr: null,
  addFolderModelInfo: null, //添加分类的节点信息
  activeNode: null, //焦点节点
  tableListMap: {}, // 主子表数据 key节点id value表数据
  createTreeModel: null, //用于创建的树
  createStatus: 'start',//start|sending|sendEnd|creating|createSuccess|createFail
  createFailMsg: '',
  serviceDoneNum: 0, //创建模型已请求完成数
  serviceModelList: [], //创建模型调用后台接口参数列表
  addRefTreeModelInfo: null, //添加预置模型节点信息
  refDefaultSearch: '',
  refTreeModel: [], //预置模型树,
  refTreeModelType: 'all', //预置模型树类型 all || search
  addSubTreeModelInfo: null,
  subTreeModel: [],
  showIframe: false,
  currentDoneNodeNumber : -1,
}

class Store {

  @observable
  state = initState;

  setTreeModelMap = (info) => {
    this.state.treeModelMap[info.id] = info;
  }

  setPk = (pk) => {
    this.state.pk_obinfo = pk;
  }

  /**
   * @function dataIndexForEach 根据类似0-0-1这样的节点关系定位节点
   * */
  dataIndexForEach = (dataIndex, treeModel, cb) => {
    const indexList = dataIndex.split('-');
    let nodeList = [];
    indexList.forEach((index) => {
      let _node = nodeList[0];
      if (!_node) {
        _node = treeModel[index]
      } else {
        _node = _node.children[index]
      }
      nodeList.unshift(_node);
      if (cb) {
        cb(_node, nodeList, index)
      }
    })
    return {
      node: nodeList[0],
      nodeList
    }
  }

  isTable = (node_type) => {
    return node_type === 'main' || node_type === 'main_sub' || node_type === 'sub'
  }

  /**
   * @function getCheckedTreeModel
   * @desc 获取一选择的树节点
   * */
  getCheckedTreeModel = (treeModel, nodeConfig=null) => {
    const loop = (treeModel) => {
      return treeModel.filter((treeNode) => {
        const { halfChecked, checked, tableUpdated, node_type, isSelect } = treeNode;
        let filter = checked || halfChecked;
        let isTableFlag = this.isTable(node_type);
        if (isTableFlag) {
          filter = !!isSelect ? tableUpdated && checked : filter
        }
        // if (filter) {
          if (nodeConfig) {
            treeNode = Object.assign(treeNode, nodeConfig)
          }
          if (treeNode.children) {
            let _children = loop(treeNode.children);
            if(_children.length > 0){
              filter = true;
            }else{
              if(!isTableFlag){
                filter = false;
              }
            }
            treeNode.children = _children
          }
        // }
        return filter
      })
    }
    return loop(treeModel)
  }

  /**
   * @function getServiceModelList
   * @desc 通过已选择的树节点生成后台接口数据
   * */
  getServiceModelList = (createTreeModel) => {
    const { pk_obinfo, tableListMap } = this.toJS();
    const serviceModelList = [], _tableListMap = {};
    const loop = (treeModel, parentIndex='') => {
      treeModel.forEach((treeNode, index) => {
        const dataIndex = `${parentIndex}${index}`;
        treeNode.dataIndex = dataIndex;
        const serviceData = {
          pk_obinfo: pk_obinfo,
          treeData: treeNode,
        }
        let tableList = null;
        if (this.isTable(treeNode.node_type)) {
          let _tableList = tableListMap[treeNode.id];
          if (_tableList) {
            tableList = _tableList.filter(item => item._checked );
            if (tableList.length > 0) {
              _tableListMap[treeNode.id] = tableList;
            }
          }
        }

        serviceData.tableData = tableList;
        serviceModelList.push(serviceData);

        if (treeNode.children) {
          loop(treeNode.children, `${dataIndex}-`);
        }
      })
      // return treeModel
    }
    loop(createTreeModel);
    const serviceModelMap = {
      pk_obinfo: pk_obinfo,
      treeModel: createTreeModel,
      tableListMap: _tableListMap,
    };
    return {
      serviceModelList,
      serviceModelMap
    };
  }

  /**
   * @function setCreateTreeModel
   * @desc 设置页面中CreateModal的显示和隐藏
   * */
  @action
  setCreateTreeModel = (init = false) => {
    if (init) {
      this.state.createTreeModel = null;
      this.state.serviceModelList = [];
      this.state.serviceDoneNum = 0;
      this.state.createStatus = 'start';
    } else  {
      const { treeModel } = this.toJS();
      const createTreeModel = this.getCheckedTreeModel(treeModel, {serviceStatus: 'wait'});
      this.state.createTreeModel = createTreeModel;
    }
  }

  /**
   * @function verifyTreeModel 校验数据是否可创建
   * */
  @action
  verifyTreeModel = (errCb) => {
    const { treeModel } = this.toJS();
    const createTreeModel = this.getCheckedTreeModel(treeModel, {serviceStatus: 'wait'});
    const {serviceModelMap} = this.getServiceModelList(createTreeModel);
    this.state.treeModelErr = null;
    verifyModelService(serviceModelMap)
    .then(({data: res}) => {
      this.setCreateTreeModel(false);
    })
    .catch(res => {
      if (res.data) {
        errCb && errCb(res.data);
        this.state.treeModelErr = res.data;
      }
    })
  }

  /**
   * @function changeCreateTreeModel
   * @desc 创建过程中修改节点状态
   * */
  @action
  changeCreateTreeModel = (node, status, failMsg) => {
    const { createTreeModel } = this.state;
    const {node: _node} = this.dataIndexForEach(node.dataIndex, createTreeModel);
    _node.serviceStatus = status;
    if (status === 'fail') {
      _node.failMsg = failMsg
    }
  }

  /**
   * @function saveModel
   * @desc 开始保存节点
   * */
  @action
  saveModel = async () => {
    const { createTreeModel } = this.state;
    const { serviceModelList, serviceModelMap } = this.getServiceModelList(createTreeModel);
    this.state.serviceModelList =  serviceModelList;
    this.state.serviceModelMap = serviceModelMap;
    const { serviceModelList: _serviceModelList } = this.toJS();
    console.log(_serviceModelList);
    if (this.state.createStatus === 'start') {
      this.state.createStatus = 'sending';
    }

    // saveModelService(_serviceModelList).then((resp) => {
    //   console.log('state.showIframe true')
    //   this.state.showIframe = true;
    //   console.log('state.showIframe hou true')
    // }).catch( e=> {
    //   this.state.showIframe = true;
    //   console.log('0000000000000')
    // });

    return new Promise((resolve, reject) => {
      saveModelService(_serviceModelList).then((resp) => {
        console.log('state.showIframe true')
        this.state.showIframe = true;
        console.log('state.showIframe hou true')
        resolve()
      }).catch( e=> {
        this.state.showIframe = true;
        console.log('0000000000000')
        reject();
      });
    })
    // debugger;
    // this.state.showIframe = true;
    

    // let num = 0;
    // let t =  setInterval(()=>{
    //   num ++ ;
    //   console.log(num);
    //   if(num === 10) {
    //     clearInterval(t);
    //   }
    // },2000)


    // const ser = () => {
    //   const serviceData = _serviceModelList.shift();
    //   if (this.state.createStatus === 'start') {
    //     this.state.createStatus = 'sending';
    //   }
    //   if (serviceData) {
    //     const { treeData, createEnd } = serviceData;
    //     if (!createEnd) {
    //       this.changeCreateTreeModel(treeData, 'doing');
    //     }
    //     saveModelService(serviceData)
    //     .then(({data: resData}) => {
    //       const { flag } = resData;
    //       this.state.serviceDoneNum += 1;
    //       if (!createEnd) {
    //         this.changeCreateTreeModel(treeData, flag);
    //       }
    //       ser();
    //     }).catch((data) => {
    //       this.state.serviceDoneNum += 1;
    //       _createStatus = 'sendFail';
    //       if (!createEnd) {
    //         this.changeCreateTreeModel(treeData, 'fail', data.msg || '未知错误');
    //       }
    //       // ser()
    //     })
    //   }else {
    //     let _this = this;
    //     setTimeout(function () {
    //       if (_createStatus === 'sendSuccess') {
    //         _this.createNext()
    //       } else {
    //         _this.state.createStatus = _createStatus;
    //       }
    //     }, 1000)
    //   }
    // }
    // ser()
  }
  @action iframeComplete = () =>{
    if(this.state.createStatus != 'sendFail'){
      this.state.createStatus = 'sendSuccess';
      this.createNext();
    }
    console.log(' iframeComplete showIframe  false')
    this.state.showIframe = false;
  }
  // 根据数据刷新界面显示状态
  @action showModelStatus = (data, complete) => {
    const { serviceModelList, treeModel } = this.toJS();
    let { currentDoneNodeNumber } = this.state;
    if(data === '') {
      let {treeData} = serviceModelList[0];
      this.changeCreateTreeModel(treeData,'doing');
    }
    else {
      while(this.state.serviceDoneNum < data.length){
        let index = this.state.serviceDoneNum;
        let {treeData} = serviceModelList[index];
        if(data[index].flag === 'success'){
          this.changeCreateTreeModel(treeData,'success');
          this.state.serviceDoneNum++;
        }
        else if( data[index].flag === 'fail') {

          this.changeCreateTreeModel(treeData,'fail',data[index].msg?data[index].msg:'未知原因');
          this.state.createStatus = 'sendFail';
          // this.state.showIframe = false;
          break;
        }
        if(this.state.serviceDoneNum < serviceModelList.length) {
          let index = this.state.serviceDoneNum;
          let {treeData} = serviceModelList[index];
          this.changeCreateTreeModel(treeData,'doing');
        }
        if(this.state.serviceDoneNum === serviceModelList.length) {
          // this.state.createStatus = 'sendSuccess';
          // console.log('0000000')
          break;
        }
      }
      if(complete){
        this.iframeComplete();
      }
    }
    // if(data==='COMPLETE'){
    //   console.log('COMPLETE')
    //   this.state.showIframe = false;
    //   let {treeData} = serviceModelList[serviceModelList.length - 1];
    //   this.changeCreateTreeModel(treeData,'success');
    //   currentDoneNodeNumber = 0;
    //   this.state.createStatus = 'sendSuccess';
    //   // this.createNext();
    //   return true;
    // }
    // else if(data === 'FAIL') {
    //   this.state.showIframe = false;
    //   let {treeData} = serviceModelList[serviceModelList.length - 1];
    //   this.changeCreateTreeModel(treeData,'fail', data.msg || '未知错误');
    //   this.state.createStatus = 'sendFail';
    //   currentDoneNodeNumber = 0;

    //   return false;
    // }
    // while(currentDoneNodeNumber + 1 < data.length ){
    //   currentDoneNodeNumber ++ ;
    //   const { treeData, createEnd } = serviceModelList[currentDoneNodeNumber];
    //   if( currentDoneNodeNumber < data.length - 1 ){
    //     let dt = data[currentDoneNodeNumber];
    //     if(dt.flag === 'success'){
    //       this.changeCreateTreeModel(treeData,'success');
    //       this.state.serviceDoneNum += 1;
    //     }
    //     else {
    //       this.changeCreateTreeModel(treeData,'fail',dt.msg || '未知错误');
    //       this.state.createStatus = 'sendFail';
    //       currentDoneNodeNumber = 0;
    //       return false;
    //     }
    //   }
    //   else if( currentDoneNodeNumber === data.length - 1){
    //     let dt = data[currentDoneNodeNumber];
    //     if(dt.flag === 'success'){
    //       this.changeCreateTreeModel(treeData,'doing');
    //     }
    //     else {
    //       this.changeCreateTreeModel(treeData,'fail',dt.msg || '未知错误');
    //       this.state.createStatus = 'sendFail';
    //       currentDoneNodeNumber = 0;
    //       return false;
    //     }
    //   }
    // }
    // return true;
  }

  /**
   * @function createNext
   * @desc 节点保存完成后开始创建完整的节点数据
   * */
  @action
  createNext = () => {
    console.log('createNext begin')
    const { serviceModelMap } = this.state;
    this.state.createStatus = 'creating';
    createModelService(serviceModelMap)
    .then(({data: resData}) => {
      console.log('createNext resData')
      console.log(resData)
      const { flag } = resData;
      let createStatus = '';
      if (flag === 'success') {
        createStatus = 'createSuccess';
        this.getTreeModel()
      } else {
        createStatus = 'createFail'
      }
      this.state.createStatus = createStatus;
    }).catch((res) => {
      this.state.createStatus = 'createFail';
      this.state.createFailMsg = res.msg;
    })
  }

  /**
   * @function getTreeModel 获取右侧树
   * @param {Object} params
   * @param {String} params.pk_obinfo
   * */
  @action
  getTreeModel = (params) => {
    if (params) {
      this.setPk(params.pk_obinfo);
    } else {
      params = {pk_obinfo: this.state.pk_obinfo}
    }
    console.log('getTreeModel begin')
    treeModelService(params)
    .then(({data: resData}) => {
      console.log('getTreeModel resData')
      console.log(resData)
      const treeModel = [resData.data];
      this.initTreeModel(treeModel);
      this.state.treeModel = treeModel;

    })


    // this.state.treeModel = defTree
  }

  /**
   * 当模型已经预制过，再次进入预制页面，需要对获取到的树节点进行处理
   * @function initTreeModel 初始化右侧树
   * */
  initTreeModel = (treeModel) => {
    const { activeNode } = this.state;
    const loop = (treeData, parrentIndex='') => {
      treeData.forEach((treeNode, index) => {
        const dataIndex = `${parrentIndex}${index}`;
        treeNode.dataIndex = dataIndex;
        const { isSelect, children, node_type, id } = treeNode;
        if (activeNode && activeNode.id === id) {
          delete this.state.tableListMap[id];
          this.setActiveNode(treeNode);
        }
        const _checked = Boolean(isSelect);
        if (node_type === 'sub') {
          treeNode.checked = _checked
        } else if (node_type === 'main' || node_type === 'main_sub') {
          this.processTreeCheck(_checked, treeNode, treeModel, 'sub')
        }


        if (_checked && this.isTable(node_type)) {
          this.getTableList(treeNode, false)
        }
        if (children) {
          loop(children, `${dataIndex}-`)
        }
      })
    }
    loop(treeModel)
  }

  autoGetTable = (_node) => {
    const children = _node.children;
    if (this.isTable(_node.node_type)) {
      this.getTableList(_node, false)
    }
    if (children && children.length > 0) {
      children.forEach(item => {
        this.autoGetTable(item)
      })
    }
  }

  /**
   * @function processTreeCheck 处理树结构选择
   * @param {Boolean} type 改变的选择状态
   * @param {Object} info 选择改变的节点
   * @param {Array} treeModel 处理的树节点
   * @param {Boolean} filterType 过滤不关联的节点类型node_type，该接的的选择不会影响上级节点，只改变自身选择状态
   * */
  processTreeCheck = (type, info, treeModel, filterType='') => {
    const { dataIndex, checkedFrom } = info;
    const { activeNode, treeModelMap } = this.state;
    const { node, nodeList } = this.dataIndexForEach(dataIndex, treeModel);
    if (filterType && node.node_type === filterType) {
      node.checked = type;
      if (checkedFrom === 'tree') {
        this.processTableCheck(type, node);
      }
    } else {
      const getNodeCheckedStatus = (data) => {
        if (data.id === node.id ) {
          const func = (data) => {
            const { children } = data;
            if (!(filterType && data.node_type === filterType)) {
              data.halfChecked = type;
            }
            data.checked = type;
            treeModelMap[data.id] = data;
            if (this.isTable(data.node_type)) {
              if (activeNode && data.id === activeNode.id) {
                this.state.activeNode.checked = type
              }
              if (checkedFrom === 'tree') {
                this.processTableCheck(type, data);
              }
            }
            const hasChild = children && children.length > 0;
            if (hasChild) {
              children.forEach(item => {
                func(item)
              })
            }
          }
          func(data)
        } else {
          let halfChecked = false, checked = true;
          data.children.forEach(item => {
            let itemChecked = item.checked;
            if (itemChecked) {
              halfChecked = true;
            }else {
              checked = false;
            }
            if (item.halfChecked) {
              halfChecked = true;
            }
          })
          data.halfChecked = halfChecked;
          data.checked = checked;
          treeModelMap[data.id] = data;
        }

      }

      if (nodeList) {
        nodeList.forEach( parentNode => {
           getNodeCheckedStatus(parentNode)
        })
      }
    }

    if (checkedFrom === 'tree' && type) {
      const func = (_node) => {
        const children = _node.children;
        if (this.isTable(_node.node_type)) {
          this.getTableList(_node, false)
        }
        if (children && children.length > 0) {
          children.forEach(item => {
            func(item)
          })
        }
      }
      func(node)
    }

    return treeModel;
  }


  /**
   * @method setTreeChecked 设置选中节点
   * @param {Boolean} type -节点改变状态
   * @param {Object} info -点击节点信息
   * */
  @action
  setTreeChecked = (type, info) => {
    const { treeModel } = this.state;
    info.checkedFrom = 'tree';
    this.processTreeCheck(type, info, treeModel, 'sub');
    if (type) {
      const { tableListMap } = this.state;
      for (let key in tableListMap) {
        const tableList = tableListMap[key];
        tableList.map(item => {
          this.setTreeRefChecked(item)
        })
      }
    }
  }

  setTreeRefChecked = (tableItem) => {
    const {_checked, attrType} = tableItem;
    if (_checked && attrType === 204) {
      const { treeModelMap } = this.state;
      const treeNode = treeModelMap[tableItem.dataType];
      if (treeNode && !treeNode.checked) {
        treeNode.checkedFrom = 'tree';
        this.processTreeCheck(true, treeNode, this.state.treeModel, 'sub')
      }
    }
  }

  processTableCheck = (type, info) => {
    const { tableListMap } = this.state;
    const { id, children } = info;
    if (tableListMap[id]) {
      tableListMap[id].forEach(item => {
        const { preInit } = item;
        item._checked = type && preInit;
      })
    }
    if (children && children.length > 0) {
      children.forEach(child => {
        const { id } = child;
        if (tableListMap[id]) {
          tableListMap[id].forEach(item => {
            const { preInit } = item;
            item._checked = type && preInit;
          })
        }
      })
    }
  }



  getTableList = async (nodeInfo, showLoading=true) => {
    const {node_type, id, checked, isSelect: nodeIsSelect} = nodeInfo;
    const {pk_obinfo, tableListMap} = this.state;
    let _tableList = tableListMap[id];
    if ((node_type === "main" || node_type === 'main_sub' || node_type === "sub")) {
      if (!_tableList) {
         const {data: resData} = await tableDataService({
          pk_obinfo,
          entityFullName: nodeInfo.fullName
        }, showLoading)
        _tableList = resData.data;
        _tableList = _tableList.map(item => {
          const { preInit, isSelect } = item;
          const _item = {
            ...item,
            _checked: nodeIsSelect ?  Boolean(checked && isSelect) : Boolean(checked && preInit),
            _disabled: !!isSelect
          }

          // if (checked) {
          //   this.setTreeRefChecked(_item)
          // }

          return _item
        })
        tableListMap[id] = _tableList
      }
    }
  }

  /**
   * @function setActiveNode 设置当前焦点节点
   * @param {Object} info -节点相关信息
   * */
  @action
  setActiveNode = async (info) => {
    const {activeNode, treeModelErr} = this.state;

    await this.getTableList(info);
    if (activeNode && treeModelErr) {
      delete treeModelErr[activeNode.id]
    }
    this.state.activeNode = info;
  }

  /**
   * @function setTableSelected table勾选属性getSelectedDataFunc调用方法
   * @param {List} dataList 已选列表
   * @param {Object} data 点击某一列勾选时，会有此参数，当前操作列信息
   * @param {Number} index 同data 当前操作列index值
   * */
  @action
  setTableSelected = (dataList, data, index) => {
    const {activeNode, treeModel} = this.state;
    const { tableListMap } = this.toJS();
    const {id, checked=false} = activeNode;
    let tableList = tableListMap[id];
    if (data) {
      tableList[index] = data;
      tableListMap[id] = tableList
      if (data._checked) {
        this.setTreeRefChecked(data)
      }
    } else {
      if (dataList.length > 0) {
        tableListMap[id] = dataList;
        tableListMap[id].map(item => {
          this.setTreeRefChecked(item)
        })
      } else {
        tableList.forEach(item => {
          if (!item._disabled) {
            item._checked = false
          }
        })
      }
    }

    if (dataList.length > 0) {
      if (!checked) {
        this.processTreeCheck(true, activeNode, treeModel, 'sub');
        activeNode.checked = true;
      }
    } else {
      if (checked) {
        if (!tableList.find(item => item._checked)) {
          this.processTreeCheck(false, activeNode, treeModel, 'sub');
          activeNode.checked = false
        }
      }
    }

    //
    if (activeNode.isSelect) {
      const selectedTableList = tableList.filter(item => item.isSelect);
      const {node} = this.dataIndexForEach(activeNode.dataIndex, treeModel);
      if (dataList.length > selectedTableList.length) {
        node.tableUpdated = true
      } else {
        node.tableUpdated = false
      }
    }

    this.state.tableListMap = observable.object(tableListMap)

  }

  /**
   * @function setAddFolderModelInfo 设置添加分类的节点信息
   * */
  @action
  setAddFolderModelInfo = (info = null) => {
    this.state.addFolderModelInfo = info
  }

  /**
   * @function saveFolder 添加分类保存
   * */
  @action
  saveFolder = (info) => {
    const {addFolderModelInfo, treeModel} = this.state;
    const {dataIndex} = addFolderModelInfo;
    let {node: treeNode} = this.dataIndexForEach(dataIndex, treeModel);


    const { id, name } = info;
    if (!treeNode.children) {
      treeNode.children = []
    }
    const newData = {
      dataIndex: `${dataIndex}-${treeNode.children.length}`,
      id: getUuid(),
      pid: addFolderModelInfo.id,
      name: name,
      fullName: name,
      displayname: name,
      node_type: 'folder',
      children: null
    }
    treeNode.children.push(newData);

    this.processTreeCheck(false, newData, treeModel, 'sub');
    this.setAddFolderModelInfo();
  }


  @action
  setAddRefTreeModelInfo = (info=null, defSearch='') => {
    this.state.addRefTreeModelInfo = info;
    this.state.refDefaultSearch = defSearch;
    if (!info) {
      this.state.refTreeModel = [];
      this.state.refDefaultSearch = '';
    }
  }
  /**
   * @function getRefTreeModel
   * @param {Object|String} param
   * */
  @action
  getRefTreeModel = async (param="", isSearch=false) => {
    const { pk_obinfo } = this.state;
    const _param = { pk_obinfo };
    //如果param是string类型 表示不是树节点懒加载，需覆盖原有树结构
    const isAll = typeof param === 'string';
    if (isAll) {
      _param.keyword = param;
      _param.type = 'ROOT';
    }else {
      const nodeData = param.props.data;
      _param.keyword = nodeData.fullName;
      _param.type = nodeData.type
    }
    refTreeModelService(_param)
    .then(({data: resData}) => {
      const treeModel = resData.data || [];
      if (isSearch && param !== '') {
        this.state.refTreeModelType = 'search'
      } else {
        this.state.refTreeModelType = 'all'
      }
      if (isAll) {
        this.state.refTreeModel = treeModel;
      }else {
        const nodeData = param.props.data;
        const { dataIndex } = nodeData;
        const {node} = this.dataIndexForEach(dataIndex, this.state.refTreeModel);
        node.children = treeModel;
        const {refTreeModel} = this.toJS();
        this.state.refTreeModel = this.processTreeCheck(Boolean(nodeData.checked), nodeData, refTreeModel)
      }

    })
  }

  /**
   * @function setRefTreeCheck 参照树选择节点
   * */
  @action
  setRefTreeCheck = (type, node) => {

    const { refTreeModel } = this.toJS();
    this.state.refTreeModel = this.processTreeCheck(type, node, refTreeModel);
  }

  @action
  clearRefTreeCheck = () => {
    const { refTreeModel } = this.state;
    refTreeModel.forEach((item, index) => {
      item.dataIndex = index + '';
      this.processTreeCheck(false, item, refTreeModel)
    })
  }

  /**
   * @function saveRefModel 向后台提交参照树
   * */
  @action
  saveRefModel = () => {
    const { refTreeModel, addRefTreeModelInfo, treeModel } = this.state;
    const checkedTreeModel = this.getCheckedTreeModel(refTreeModel);
    saveRefModelService(checkedTreeModel)
    .then(({data: resData}) => {
      if (resData.data && resData.data.length > 0) {
        resData.data.forEach(item => {
          item.pid = addRefTreeModelInfo.id;
        });
        const {node: treeNode} = this.dataIndexForEach(addRefTreeModelInfo.dataIndex, treeModel);
        const len = treeNode.children ? treeNode.children.length :  0;
        treeNode.children = (treeNode.children || []).concat(resData.data);
        const nodeData = resData.data[0];
        nodeData.dataIndex = `${addRefTreeModelInfo.dataIndex}-${len}`;
        this.processTreeCheck(false, nodeData, treeModel, 'sub');
      }
      this.setAddRefTreeModelInfo()
    })
  }

  @action
  setAddSubTreeModel = (info=null) => {
    this.state.addSubTreeModelInfo = info;
    if (!info) {
      this.state.subTreeModel = []
    }
  }
  @action
  getSubTreeModel = () => {
    const { pk_obinfo, addSubTreeModelInfo } = this.toJS();
    const params = {
      pk_obinfo,
      id: addSubTreeModelInfo.id
    }
    subRefTreeModelService(params)
    .then(({data: resData}) => {
      const list = resData.data;
      const { children } = addSubTreeModelInfo;
      if (children && children.length > 0) {
        list.forEach(item => {
          const child = children.find(_item => _item.id === item.id);
          if (child) {
            addSubTreeModelInfo.disabled = true;
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
      addSubTreeModelInfo.halfChecked = false;
      addSubTreeModelInfo.checked = false;
      addSubTreeModelInfo.children = list;
      this.state.subTreeModel = [addSubTreeModelInfo];
    })
  }
  /**
   * @function setRefTreeCheck 参照树选择节点
   * */
  @action
  setSubTreeCheck = (type, node) => {
    const { subTreeModel } = this.state;
    this.processTreeCheck(type, node, subTreeModel);
  }

  @action
  clearSubTreeCheck = () => {
    const { subTreeModel } = this.state;
    subTreeModel.forEach((item, index) => {
      item.dataIndex = index + '';
      this.processTreeCheck(false, item, subTreeModel)
    })
  }

  @action
  saveSubTreeModel = () => {
    const {subTreeModel,  addSubTreeModelInfo, treeModel} = this.toJS();
    const checkedList = subTreeModel[0].children.filter(item => {
      const checked = item.checked;
      delete item.checked;
      delete item.halfChecked;
      return checked
    });

    const { node: treeNode} = this.dataIndexForEach(addSubTreeModelInfo.dataIndex, treeModel);
    treeNode.children = (treeNode.children || []).concat(checkedList);
    this.state.treeModel = treeModel;
    this.setAddSubTreeModel(null);
  }



  /**
   * @function dragTreeNode 拖拽右侧树
   * @param {Object} node 被拖拽节点信息
   * @param {Object} targetNode 目标节点信息
   * */
  @action
  dragTreeNode = (node, targetNode) => {
    let { treeModel } = this.state;
    //将被拖拽节点从原父节点移除
    this.dataIndexForEach(node.dataIndex, treeModel, (_node, nodeList, index ) => {
      if (_node.id === node.id) {
        const parentNode = nodeList[1];
        parentNode.children.splice(index, 1);
        //修改被拖拽节点选择状态
        if (parentNode.children.length > 0) {
          //当原父节点中还存在子节点，随便从子节点中取一个元素，模拟节点check 修改整个树的选择
          const child = parentNode.children[0];
          child.dataIndex = node.dataIndex.replace(/[0-9]+$/, '0');
          this.processTreeCheck(Boolean(child.checked), child, treeModel, 'sub')
        } else {
          // parentNode.halfChecked = false;
          // parentNode.checked = false;
          parentNode.dataIndex = node.dataIndex.replace(/-[0-9]+$/, '');
          this.processTreeCheck(false, parentNode, treeModel, 'sub')
        }
      }
    })

    //将被拖拽节点添加到目标节点中
    this.dataIndexForEach(targetNode.dataIndex, treeModel, (_node) => {
      if (_node.id === targetNode.id) {
        let children = _node.children || [];
        node.dataIndex = `${targetNode.dataIndex}-${children.length}`;
        node.pid = targetNode.id;
        children.push(node);
        _node.children= children;
        this.processTreeCheck(node.checked, node, treeModel)
      }
    });
  }

  initStore = () => {
    this.state = initState;
  }

  toJS = () => {
    return toJS(this.state)
  }

}

export default Store;
