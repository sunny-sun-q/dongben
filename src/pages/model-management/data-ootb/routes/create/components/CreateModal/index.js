import React, { Component } from 'react'
import {  Icon, ProgressBar, Tooltip } from 'tinper-bee'
import Modal from 'bee-modal'
import Tree from 'bee-tree'
const TreeNode = Tree.TreeNode;
import loadingIcon from './loading.svg'
import loadingImage from 'images/ootb/loading.png'
import './index.less'
import {Button} from 'components/tinper-bee';
const statusConfig = {
  'wait': {
    icon: 'uf-time-c-o',
    text: '等待创建',
    className: 'status-ser-wait'
  },
  'doing': {
    icon: 'uf-time-c-o',
    text: '正在创建',
    className: 'status-ser-doing'
  },
  'success': {
    icon: 'uf-correct-2',
    text: '创建成功',
    className: 'status-ser-success'
  },
  'fail': {
    icon: 'uf-close-c-o',
    text: '创建失败',
    className: 'status-ser-fail'
  }
}

const createStatusMap = {
  'createSuccess': {
    title: '恭喜，创建模型成功！',
    message: '所有数据已经创建到实体建模中，赶快去查看吧！'
  },
  'createFail': {
    title: '创建失败！'
  }
}

class ModalView extends Component{
  constructor(props) {
    super(props);

  }

  expandedKeys = [];


  renderTreeNode = (treeModel, parentIndex='') => {

    const nodeList = treeModel.map((treeItem, index) => {
      //node_type 节点类型 root|folder|main|sub
      const { children, id, displayname, serviceStatus, failMsg } = treeItem;
      const _children = children || [];
      //dataIndex 用来标示节点在treeModal中的未知
      const dataIndex = `${parentIndex}${index}`;
      const data = {
        dataIndex,
        ...treeItem
      }
      const {icon, text, className} = statusConfig[serviceStatus];
      let titleNode = (
        <div className={`tree-title ${className}`}>
          {serviceStatus === 'doing' ? (
            <img src={loadingIcon} alt=""/>
          ) : (
            <Icon type={icon}/>
          )}
          <span>{displayname}</span>

          <span className='status-text'>
              {text}
            </span>

          {serviceStatus === 'fail' && failMsg ? (
            <Tooltip
              placement="top"
              inverse
              overlay={failMsg}
            >
              <span className='status-text' style={{marginRight: '20px'}}>
                查看原因
              </span>
            </Tooltip>
          ) : null}

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
          className={id}
        >
          {this.renderTreeNode(_children, `${dataIndex}-`)}

        </TreeNode>
      )
    })
    return nodeList
  }


  render() {
    const {
      dataSource,
      onCancel,
      onBegin,
      onNext,
      onFinish,
      progressNow,
      progressMax,
      createStatus,
      createFailMsg
    } = this.props;
    const show = !!dataSource;
    if (!show) {
      return null
    }
    let nodeList = null;
    const isSend = createStatus === "start" || createStatus === 'sending' || createStatus === 'sendSuccess' || createStatus === 'sendFail';
    const isCreating = createStatus === 'creating';
    console.log(dataSource);
    if (isSend) {
      nodeList = this.renderTreeNode(dataSource);
    }

    const statusMap = createStatusMap[createStatus];
    if (createStatus === 'createFail') {
      statusMap.message = createFailMsg
    }
    return (
      <Modal
        enforceFocus={false}
        className="create-modal pop_dialog"
        size="lg"
        show={show}
        onHide={onCancel}
        backdropClosable={false}
      >

        {isCreating ? null : (
          <Modal.Header closeButton={false}>
            {isSend ? (
              <Modal.Title>
                模型创建
              </Modal.Title>
            ) : null}
          </Modal.Header>
        )}

        <Modal.Body
          className="create-modal-body"
        >
          {isSend? (
            <div className='create-modal-tree-w'>
              <Tree
                className="create-modal-tree"
                defaultExpandAll={true}
                expandedKeys={this.expandedKeys}
                openIcon={<Icon type="uf-arrow-down" />}
                closeIcon={<Icon type="uf-arrow-right" />}
              >
                {nodeList}
              </Tree>
            </div>
          ) : null}

          {createStatus === 'sending' ? (
            <div className='create-modal-progress'>
              <p className='progress-num'>
                {parseInt((progressNow/progressMax) * 100)}%
              </p>
              <ProgressBar
                colors='primary'
                now={progressNow}
                max={progressMax}
              />
              <p className="progress-text">正在安装请稍后…</p>
            </div>
          ) : null}

          {createStatus === 'creating' ? (
            <div className='create-modal-creating'>
              <img src={loadingImage} alt=""/>
              <span>初始化...</span>
            </div>
          ) : null}

          {createStatus === 'createSuccess' || createStatus === 'createFail' ? (
            <div className="create-modal-create-info">
              {createStatus === 'createSuccess' ? (
                <Icon className="info-icon success" type='uf-correct'/>
              ) : null}
              {createStatus === 'createFail' ? (
                <Icon className='info-icon fail' type='uf-close'/>
              ) : null}
              <p className="info-status">{statusMap.title}</p>
              <p className="info-msg">{statusMap.message}</p>
            </div>
          ) : null}

        </Modal.Body>

        <Modal.Footer className="pop_footer">
          {createStatus === 'start' ? (
            [<Button
              bordered
              onClick={onCancel}
            >取消</Button>,
            <Button
              colors="primary"
              onClick={onBegin}
                >开始</Button>]
          ) : null}
          {createStatus === 'sending' ? (
            <Button
              colors="primary"
              disabled
            >进行中</Button>
          ) : null}
          {createStatus === 'sendSuccess' ? (
            <Button
              colors="primary"
              onClick={onNext}
            >下一步</Button>
          ) : null}
          {createStatus === 'createSuccess' ? (
            [<Button
              bordered
              onClick={onCancel}
            >完成</Button>,
              <Button
                colors="primary"
                onClick={onFinish}
              >查看模型</Button>]
          ) : null}
          {createStatus === 'createFail' || createStatus === 'sendFail' ? (
            <Button
              colors="primary"
              onClick={onCancel}
            >重新创建</Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    )
  }

}
export default ModalView
