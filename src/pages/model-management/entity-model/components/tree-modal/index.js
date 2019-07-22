import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {Component} from 'react';
import {  Col, Row, FormControl, Icon } from 'tinper-bee';
import PropTypes from 'prop-types';
import Form from 'bee-form'
const FormItem = Form.FormItem;
import Modal from 'bee-modal';
import Tree from 'components/treeEntry';
import {Button} from 'components/tinper-bee';
const propTypes = {
  submitName:PropTypes.string,//确定的文字
  cancelName:PropTypes.string,//取消的文字
  title: PropTypes.string,//模态框标题
};

const defaultProps = {
  // title: this.props.intl.formatMessage({id:"js.com.tre.0001", defaultMessage:"主数据"})
  title: "主数据"
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
    treeEntryStore: stores.treeEntryStore,
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class TreeModal extends Component {
	constructor(props) {
		super(props);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.submit = this.submit.bind(this);
    this.leafClickCallBack = this.leafClickCallBack.bind(this);
  }

  tempReference = {
    ref_pkgd_name: "",
    ref_pkgd: "",
    treeref_pkgd: "",
    treeref_pkgd_name: ""
  }

  tempCombodata = {
    ref_pkgd_name: "",
    ref_pkgd: ""
  }

  componentWillReceiveProps(nextProps){
    // console.log(nextProps.currentNode,this.props.currentNode,'6666666666');
  }

  close() {
    if (this.props.currentNode === 'ref') {
      this.props.entityContentStore.setTableModal(true, false, false)
    } else if (this.props.currentNode === 'selectDown') {
      this.props.entityContentStore.setSelectDownModal(true, false, false)
    }
  }

  open() {
    if (this.props.currentNode === 'ref') {
      this.props.entityContentStore.setTableModal(false, false, true)
    } else if (this.props.currentNode === 'selectDown') {
      this.props.entityContentStore.setSelectDownModal(false, false, true)
    }
  }

  submit(e) {
    e && e.preventDefault();
    let {
      fieldref:{
        reference,
        combodata
      },
      currentNode
     } = this.props.entityContentStore;
     const { activeTabs } = this.props.entityContentStore.tableStatus
    if(currentNode === 'ref'){
      switch(Number(reference.reftype)){
        case 1: //表型
          this.tempRefObj = Object.assign(this.tempRefObj || {},{
            treeref_pkgd: "",
            treeref_pkgd_name: ""
          });
          break;
        case 2: //树型
          this.tempRefObj = Object.assign(this.tempRefObj || {},{
            treeref_pkgd: "",
            treeref_pkgd_name: ""
          });
          break;
        default:
          break;
      }
      // 如果是参照主数据,需要清空所有

      if (this.props.title === this.props.intl.formatMessage({id:"js.com.tre.0002", defaultMessage:"参照主数据"})) {
        let newReference = Object.assign(reference, this.tempReference, {
          treelistlabelfield_name: '',
          treeref_pkgd_name: '',
          treeparentid_name: '',
          treelabelfield_name: '',
          treeref_foreignkey_name: '',
          isRefSelf: ''
        });

        // 如果是树形，参照自身，需要设置树父ID 不可编辑
        let { id } = this.props.match.params
        if (this.tempReference.ref_pkgd === id && activeTabs === 'father') {
          newReference.isRefSelf = '1'
        }
        this.props.entityContentStore.resetRefMsg(newReference);
        this.props.entityContentStore.setIfRestTable()
      } else {
        reference = Object.assign(reference, this.tempReference);
        this.props.entityContentStore.resetRefMsg(reference);
      }
    }else if(currentNode === 'selectDown'){
      // 下拉需要reftype = 0
      combodata = Object.assign(combodata, this.tempCombodata, {
        reftype: 0,
        isRefSelf: ''
      });
      // 如果是树形，参照自身，需要设置树父ID 不可编辑
      let { id } = this.props.match.params

      if (this.tempCombodata.ref_pkgd === id && activeTabs === 'father') {
        combodata.isRefSelf = '1'
      }
      this.props.entityContentStore.resetCombodata(combodata);
    }
    // this.tempReference = {
    //   ref_pkgd_name: "",
    //   ref_pkgd: "",
    //   treeref_pkgd: "",
    //   treeref_pkgd_name: ""
    // }
    // this.tempCombodata = {
    //   ref_pkgd_name: "",
    //   ref_pkgd: ""
    // }
    this.close();
  }

  leafClickCallBack(item, flag) {
    if(item.isparent){ //主数据分类不能作为参照主数据
      return
    }
    const { currentNode, fieldref:{formName}} = this.props.entityContentStore;
    let field = `${formName}`;
    let field_name = `${formName}_name`;
    switch(currentNode){
      case 'ref':
        // 缓存在tempReference中，点确定时修改store中的fieldref
        // this.tempReference = Object.assign(this.tempReference, {
        //   ref_pkgd_name: item.name,
        //   ref_pkgd: item.id
        // })
        this.tempReference[field] = item.id || '';
        this.tempReference[field_name] = item.name || '';
        break;
      case 'selectDown':
        this.tempCombodata = Object.assign(this.tempCombodata, {
          ref_pkgd_name: item.name,
          ref_pkgd: item.id,
        })
        break;
      default:
        break;
    }
    if (flag) this.submit()
  }

	render() {
    const { title } = this.props;
    const { modal } = this.props.treeEntryStore;
    const {
      entityContentStore,
      entityContentStore:{
        currentNode
      },
      entityContentStore:{
        fieldref
      }
    } = this.props;
    // console.log("设置参照/下拉", currentNode)

		return (
      <div>
        <Modal
          show={entityContentStore.fieldref.ifTreeModalShow}
          onHide={this.close}
          style={{width: 600}}
          className="ref-modal"
          backdropClosable={false}
        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title style={{textAlign: 'left'}}>
              {title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="ref-modal-body">
            <Tree ifNoHover={true} isRefTree={true} filterById={this.props.filterById}  leafClickCallBack={this.leafClickCallBack}/>
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                <FormattedMessage id="js.com.tre.0003" defaultMessage="取消" />
            </Button>
            <Button colors="primary" onClick={this.submit}>
                <FormattedMessage id="js.com.tre.0004" defaultMessage="确认" />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}

TreeModal.propTypes = propTypes;
TreeModal.defaultProps = defaultProps;
export default injectIntl(TreeModal, {withRef: true});
