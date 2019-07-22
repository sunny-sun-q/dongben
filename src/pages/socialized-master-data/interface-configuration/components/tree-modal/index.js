import React, {Component} from 'react';
import { Button, Col, Row, FormControl, Icon } from 'tinper-bee';
import PropTypes from 'prop-types';
import Form from 'bee-form'
const FormItem = Form.FormItem;
import Modal from 'bee-modal';
import Tree from 'components/tree';

const propTypes = {
  submitName:PropTypes.string,//确定的文字
  cancelName:PropTypes.string,//取消的文字
  title: PropTypes.string,//模态框标题
};

const defaultProps = {
  title: "参照主数据"
};

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
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class TreeModal extends Component {
	constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.submit = this.submit.bind(this);
    this.leafClickCallBack = this.leafClickCallBack.bind(this);
  }

  // 暂时缓存数据的位置，只有提交时才替换
  nodeInfo = {
    treeref_pkgd : "",
    treeref_pkgd_code : "",
    treeref_pkgd_name : "",
    ifEntitySelect : "",
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.currentNode,this.props.currentNode,'6666666666');
  }


  close() {
      this.props.entityContentStore.setRefModal( false, true, 'refModal')
  }

  // 参照树的选择提交事件，根据接口的code和实体的code，分别获得主数据的明细列表和接口对应云上对应表的明细列表
  submit(e) {
    // 抑制点击事件等待逻辑完成
    e.preventDefault();
    var tempReference = this.props.entityContentStore.tempReference;
    // 方法2
    tempReference = Object.assign(tempReference,this.nodeInfo)

    // 根据接口的code和选择实体的code，分别加载
    // this.props.match.params.name 页面url上的接口主键
    // this.props.entityContentStore.tempReference.treeref_pkgd_code 选中实体的编码
    this.props.entityContentStore.getMappingDatas(this.props.match.params.name, this.props.entityContentStore.tempReference.treeref_pkgd);
    this.close();
  }

  // 参照树点击事件
  leafClickCallBack(item) {
    if( item.isparent ){
      return;
    }
    // 该方法不好使
    // let {treeref_pkgd, treeref_pkgd_code, treeref_pkgd_name} = this.tempReference;

    // 方法 参数ー：目标对象，参数二：添加对象
    this.nodeInfo = Object.assign(this.nodeInfo,{
      treeref_pkgd : item.id,
      treeref_pkgd_code : item.code,
      treeref_pkgd_name : item.name,
      ifEntitySelect : true
    })
    // var tempReference = this.props.entityContentStore.tempReference;
    // 方法2
    // tempReference.treeref_pkgd = item.id;
    // tempReference.treeref_pkgd_code = item.code;
    // tempReference.treeref_pkgd_name = item.name;
    // tempReference.ifEntitySelect = true;
  }

	render() {
    const {
      entityContentStore,
      entityContentStore:{
        fieldref
      }
    } = this.props;
		return (
      <div>
        <Modal
          show={entityContentStore.fieldref.ifModalShow}
          onHide={this.close}
          style={{width: 600}}
          className="ref-modal-overflowy-hidden ref-modal"

        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title style={{textAlign: 'left'}}>
            主数据模型
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="ref-modal-body">
            <Tree ifNoHover={true} isRefTree={true} leafClickCallBack={this.leafClickCallBack}/>
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button shape="border" style={{ marginRight: 15 }} onClick={this.close}>
                取消
            </Button>
            <Button colors="primary" onClick={this.submit}>
                确认
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}

TreeModal.propTypes = propTypes;
TreeModal.defaultProps = defaultProps;
export default TreeModal
