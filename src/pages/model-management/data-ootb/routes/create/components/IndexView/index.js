import React, { Component } from 'react';
// import queryStr from 'query-string-es5/index';
import { Icon, Message, Tooltip } from 'tinper-bee';
import Tree from 'bee-tree';
import Checkbox from 'bee-checkbox';
import Table from 'bee-table';
import multiSelect from "./multiSelect";

import Header from '../Header';
import AddModal from '../AddModal';
import CreateModal from '../CreateModal';
import AddConfigModal from '../AddConfigModal';
import AddSubModal from '../AddSubModal'
import './index.less';

const TreeNode = Tree.TreeNode;
const MultiSelectTable = multiSelect(Table, Checkbox);

const toolTipProps = {
  inverse: true,
  placement: 'bottom'
}

import {
  observer,
} from 'mobx-react';

import Alert from '../Alert'

const errText = {
  refEmpty: "为了完整的创建模型，您还需要选择已选属性的参照关系（参照关系不全的，需要您手动添加）请您赶紧去标红的节点中查看与编辑吧！",
  propsEmpty: "为了完整的创建模型，您必选完善所选属性的参照关系，请您去标红的节点中查看与编辑吧！"
}

@observer
class IndexView extends Component {
  constructor(props) {
    super(props)
    this.mdmNowUrl = window.mdmNowUrl + '';
    // this.renderLoadStatus = this.renderLoadStatus.bind(this);
  }

  verifyCreateModel = () => {
    const { createStore: { verifyTreeModel } } = this.props;
    verifyTreeModel((errMap) => {
      let errType1 = false, errType2 = false;
      Object.values(errMap).forEach(err => {
        if (err) {
          const values = Object.values(err);
          if (values.length > 0) {
            if (!errType1) {
              Alert.show({
                message: errText.refEmpty,
                autoHide: true
              });
              errType1 = true;
            }
          } else {
            if (!errType2) {
              Alert.show({
                message: errText.propsEmpty,
                autoHide: true
              });
              errType2 = true;
            }
          }
        }
      })
    })
  }


  beginSendModel = async() => {
    const { createStore: { saveModel } } = this.props;

    await saveModel();
    this.renderLoadStatus();
  }

  onNext = () => {
    const { createStore: { createNext } } = this.props;
    createNext()
  }

  onFinish = () => {
    if (top.window.createTab) {
      let getUrlSearch = function (href) {
        var name = "";
        var value = "";
        var search = {};
        var str = href || location.href; //取得整个地址栏
        var num = str.indexOf("?");
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
          num = arr[i].indexOf("=");
          if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            search[name] = value;
          }
        }
        return search;
      }
      let queryObj = getUrlSearch();
      top.window.createTab({
        id: "mdm_data_model",
        router: '/iuapmdm_fr/model-management/entity-model.html?modulefrom=sidebar',
        title: '数据模型',
        title2: `Data model`,
        title3: `數據模型`,
        title4: ``,
        title5: ``,
        title6: ``,
      })
    }
  }

  onTreeSelect = (keys, node) => {
    const { createStore: { setActiveNode } } = this.props;
    const { data } = node.node.props;
    setActiveNode(data)
  }
  onTableRefClick = (node, tableData) => {
    const { createStore } = this.props;
    if (node) {
      const { createStore } = this.props;
      const { setActiveNode } = createStore;
      setActiveNode(node)
    } else {
      const { createState } = this.props;
      const { treeModelMap, activeNode } = createState;
      const { setAddRefTreeModelInfo } = createStore;
      let addRefNode = treeModelMap[activeNode.pid];
      let node_type = addRefNode.node_type;
      if(node_type === 'sub'){
        addRefNode = treeModelMap[treeModelMap[addRefNode.pid].pid]
      }
      if(node_type === 'main' || node_type === 'main_sub'){
        addRefNode = treeModelMap[addRefNode.pid];
      }
      setAddRefTreeModelInfo(addRefNode, tableData.dataType)
    }
  }

  expandedKeys = [];
  canCreate = false;

  renderTreeNode = (treeModel, treeModelErr) => {
    const { createStore } = this.props;
    const {
      setTreeChecked,
      setAddFolderModelInfo,
      setAddRefTreeModelInfo,
      setTreeModelMap,
      setAddSubTreeModel
    } = createStore;
    const loop = (treeModel, parentIndex = "", disabled = false) => {
      const nodeList = treeModel.map((treeItem, index) => {
        //node_type 节点类型 root|folder|main|sub
        const { children, id, displayname, node_type, checked, halfChecked, isSelect, tableUpdated } = treeItem;
        const _children = children || [];
        //dataIndex 用来标示节点在treeModal中的位置
        const dataIndex = `${parentIndex}${index}`;
        const data = {
          ...treeItem,
          dataIndex,
        }
        setTreeModelMap(data);

        if ((!isSelect || tableUpdated) && (halfChecked || checked)) {
          this.canCreate = true;
        }

        let checkBoxCls = node_type === 'sub' ? 'checkbox-sub' : '';
        if (treeModelErr && treeModelErr[id]) {
          checkBoxCls += ' checkbox-err'
        }


        let titleNode = (
          <div className='tree-node-content'>
            <Checkbox
              disabled={isSelect || disabled}
              className={checkBoxCls}
              indeterminate={halfChecked}
              checked={checked}
              onChange={(checkType) => {
                setTreeChecked(checkType, data)
              }}
            />
            <Tooltip {...toolTipProps} overlay={displayname}>
              <span className='tree-text'>{displayname}</span>
            </Tooltip>
            {node_type === 'root' || node_type === "folder" ? (
              <span className='tree-add-icon' style={{ marginLeft: '10px' }}>
                <Icon
                  type="uf-plus"
                  onClick={(e) => {
                    e= e.nativeEvent;
                    if(e){
                      if(e.stopPropagation){
                        e.stopPropagation();
                      }
                      e.cancelBubble = true
                    }
                    setAddRefTreeModelInfo(data)
                  }}
                />
                <Icon
                  type="uf-folder-o"
                  onClick={(e) => {
                    e= e.nativeEvent;
                    if(e){
                      if(e.stopPropagation){
                        e.stopPropagation();
                      }
                      e.cancelBubble = true
                    }
                    setAddFolderModelInfo(data)
                  }}
                />
              </span>
            ) : null}
            {node_type === 'main_sub' ? (
              <span className='tree-add-icon' style={{ marginLeft: '10px' }}>
                <Icon
                  type="uf-plus"
                  onClick={(e) => {
                    e= e.nativeEvent;
                    if(e){
                      if(e.stopPropagation){
                        e.stopPropagation();
                      }
                      e.cancelBubble = true
                    }
                    setAddSubTreeModel(data)
                  }}
                />

              </span>
            ) : null}
          </div>
        )

        let _childDidabled = false;
        //当主表没有选中时 子表不可操作
        if (node_type === 'main_sub') {
          _childDidabled = !checked
        }

        const canDraggable = (node_type === 'folder' || node_type === 'main' || node_type === 'main_sub') && !isSelect;

        if (_children.length > 0) {
          this.expandedKeys.push(id)
        }

        return (
          <TreeNode
            disabled={disabled}
            key={id}
            title={titleNode}
            data={data}
            draggable={canDraggable}
          >
            {loop(_children, `${dataIndex}-`, _childDidabled)}

          </TreeNode>
        )
      })
      return nodeList;
    }
    return loop(treeModel)
  }

  onDrag = (dragData) => {
    const { dragNode, node: targetNode } = dragData;
    const { data: dragNodeData } = dragNode.props;
    const { data: targetNodeData } = targetNode.props;
    if (targetNodeData.node_type === 'root') {
      return false;
    }
    if (dragNodeData.node_type === targetNodeData.node_type) {
      return false;
    }
    if (dragNodeData.pid === targetNodeData.id) {
      return false;
    }
    const { createStore: { dragTreeNode } } = this.props;
    dragTreeNode(dragNodeData, targetNodeData)
  }

  columns = [
    {
      title: '名称',
      key: 'displayname',
      dataIndex: 'displayname'
    }, {
      title: '主键',
      key: 'isKey',
      dataIndex: 'isKey',
      render: (text) => {
        return Boolean(text) ? '是' : '否'
      }
    }, {
      title: '字段名称',
      key: 'fieldName',
      render: (record) => {
        const { attrType, fieldName } = record;
        if (attrType === 204 && record.defFlag=== false) {
          const { dataType } = record;
          const { createState } = this.props;
          const { treeModelMap } = createState;
          const node = treeModelMap[dataType];
          return (
            <a
              style={{
                color: node ? '#1E7BE2' : '#F44336',
                cursor: 'pointer'
              }}
              onClick={this.onTableRefClick.bind(null, node, record)}
            >(参照){fieldName}</a>
          )
        } else {
          return fieldName
        }
      }
    }, {
      title: '字段类型',
      key: 'fieldType',
      dataIndex: 'fieldType'
    }, {
      title: '字段长度',
      key: 'fieldLength',
      dataIndex: 'fieldLength'
    }
  ]




  getTableErr = (err) => {
    const errList = Object.values(err);
    const len = errList.length;
    let errInfo = '';
    if (len === 0) {
      errInfo = '请您至少选择3个属性'
    } else {
      errInfo = `请您增加预置中缺失${len > 1 ? `${len}个` : ''}的参照关系：${errList.join('、')}！`
    }
    return errInfo
  }

  renderLoadStatus = () => {
    console.log('renderLoadStatus start');
    this.forceUpdate();
    let _this = this;
    // let runFlag = false;
    // let startTime = (new Date()).getTime();
    const { showModelStatus } = this.props.createStore;
    let iframeOnloadFun = () => {
      try {
        console.log('iframeOnloadFun ',_this.refs.iload)
        if(_this.refs.iload){
            console.log('iframeOnloadFun body',_this.refs.iload.contentWindow.document.body);
        }
        if (_this.refs.iload && _this.refs.iload.contentWindow.document.body) {
          // runFlag = true;
          let h = _this.refs.iload.contentWindow.document.body.innerHTML;
          let regex = /<\s*\/?\s*[a-zA-z_]([^>]*?["][^"]*["])*[^>"]*>/g;
          h = h.replace(regex, "");
          console.log('iframe innerHTML' , h);
          let html = h.split('#bl#');
          html.pop();
          let content = html.pop();
          console.log('iframe content' , content);
          if (!content) {
            showModelStatus('');
          }else {
            let complete = false;
            if(content.indexOf('COMPLETE') > -1){
              complete = true;
              console.log(' clearInterval COMPLETE')
              clearInterval(_this.interFun);
              content = html.pop();
            }
            content = JSON.parse(content);

            if (Object.prototype.toString.call(content) === '[object Array]') {
              showModelStatus(content, complete);
            }
          }
          // 处理数据
        }
        // else{
        //   let nowTime = (new Date()).getTime();
        //   console.log('nowTime - startTime',nowTime - startTime)
        //   if((nowTime - startTime) > (60 * 1000)){
        //     _this.forceUpdate();
        //   }
        // }
      } catch (e) {
        console.log(e)
      }
    }
    // iframeOnloadFun();
    if(_this.interFun)
      clearInterval(_this.interFun);
    _this.interFun = setInterval(() => {
      console.log('setInterval setInterval')
      iframeOnloadFun();
    }, 200);
  }

  onBack = () =>{
    window.location.href = this.mdmNowUrl;
  }

  render() {
    const { createStore, createState, history } = this.props;
    const {
      setAddFolderModelInfo,
      setTreeChecked,
      saveFolder,
      setTableSelected,
      setAddRefTreeModelInfo,
      getRefTreeModel,
      setRefTreeCheck,
      clearRefTreeCheck,
      saveRefModel,
      setCreateTreeModel,
      setAddSubTreeModel,
      getSubTreeModel,
      setSubTreeCheck,
      clearSubTreeCheck,
      saveSubTreeModel
    } = createStore;
    const {
      treeModel,
      treeModelErr,
      addFolderModelInfo,
      activeNode,
      tableListMap,
      createTreeModel,
      createStatus,
      serviceDoneNum,
      serviceModelList,
      addRefTreeModelInfo,
      refDefaultSearch,
      refTreeModel,
      refTreeModelType,
      addSubTreeModelInfo,
      subTreeModel,
      createFailMsg,
      showIframe
    } = createState;
    let tabList = null;
    let tableErr = '';
    if (activeNode) {
      const activeId = activeNode.id;
      tabList = tableListMap[activeId];
      if (treeModelErr && treeModelErr[activeId]) {
        tableErr = this.getTableErr(treeModelErr[activeId])

      }
    }

    this.canCreate = false;
    const nodeList = this.renderTreeNode(treeModel, treeModelErr);

    const url = `${GLOBAL_HTTP_CTX}/obInfo/log?pk_obinfo=${this.props.match.params.pk}`;
    console.log('iframe', url, 'showIframe', showIframe);
    return (
      <div
        className="create-page-wrapper"
      >
        <Header
          onCancel={this.onBack}
          onOk={this.verifyCreateModel}
          okDisable={!this.canCreate}
        />

        <div className="create-page-content">

          <div className="create-page-tree-wrapper">
            <Tree
              draggable
              className="create-page-tree"
              defaultExpandAll={true}
              defaultExpandedKeys={this.expandedKeys}
              openIcon={<Icon type="uf-arrow-down" />}
              closeIcon={<Icon type="uf-arrow-right" />}
              onCheck={setTreeChecked}
              onSelect={this.onTreeSelect}
              onDrop={this.onDrag}
              selectedKeys={activeNode ? [activeNode.id] : []}
            >
              {nodeList}
            </Tree>
          </div>

          <div className="create-page-table-wrapper">
            {tabList ? (
              <MultiSelectTable
                key={Math.random()}
                rowKey={record => record.id}
                title={() => {
                  return (
                    <div className="create-table-title">
                      <span>选择数据</span>
                      <span className="table-err">{tableErr}</span>
                    </div>
                  )
                }}
                columns={this.columns}
                data={tabList}
                multiSelect={{
                  type: "checkbox"
                }}
                getSelectedDataFunc={setTableSelected}
              />
            ) : null}
          </div>
        </div>

        {showIframe ? <iframe src={url} width="100%" ref="iload"
          style={{ display: 'none' }}
        ></iframe> : null}
        <AddModal
          info={addFolderModelInfo}
          onCancel={setAddFolderModelInfo.bind(null, null)}
          onConfirm={saveFolder}
        />

        <CreateModal
          dataSource={createTreeModel}
          onCancel={setCreateTreeModel.bind(null, true)}
          onBegin={this.beginSendModel}
          onNext={this.onNext}
          onFinish={this.onFinish}
          createFailMsg={createFailMsg}
          createStatus={createStatus}
          progressNow={serviceDoneNum}
          progressMax={serviceModelList.length}
        />

        <AddConfigModal
          nodeInfo={addRefTreeModelInfo}
          tree={refTreeModel}
          treeType={refTreeModelType}
          defaultSearch={refDefaultSearch}
          onCancel={setAddRefTreeModelInfo.bind(null, null)}
          onConfirm={saveRefModel}
          loadTree={getRefTreeModel}
          onChecked={setRefTreeCheck}
          onClear={clearRefTreeCheck}

        />

        <AddSubModal
          nodeInfo={addSubTreeModelInfo}
          tree={subTreeModel}
          onCancel={setAddSubTreeModel.bind(null, null)}
          onConfirm={saveSubTreeModel}
          loadTree={getSubTreeModel}
          onChecked={setSubTreeCheck}
          onClear={clearSubTreeCheck}
        />


      </div>
    )
  }
}
export default IndexView
