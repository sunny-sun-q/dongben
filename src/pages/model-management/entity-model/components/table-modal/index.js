import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {Component} from 'react';
import {  Col, Row, FormControl, Icon } from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import Modal from 'bee-modal'
import Tree from 'components/tree'
import PropTypes from 'prop-types';
import './index.less';
import {Button} from 'components/tinper-bee';
const propTypes = {
  title: PropTypes.string,//模态框标题
};

const defaultProps = {
  // title: this.props.intl.formatMessage({id:"js.com.tab.0001", defaultMessage:"实体字段"})
  title: "实体字段"
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
class RefModal extends Component {
	constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      selectedRowIndex: -1
    }
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.submit = this.submit.bind(this);
    this.rowclick = this.rowclick.bind(this);
  }
  tempRefObj = {
    treelistlabelfield_name:'',
    treelistlabelfield:'',
    treeparentid:'',
    treeparentid_name:'',
    treelabelfield:'',
    treelabelfield_name:'',
    treeref_foreignkey:'',
    treeref_foreignkey_code:'',
    treeref_foreignkey_name:''
  }

  tempCombObj = {
    treelabelfield_name:'',
    treelabelfield:''
  }

  close() {
    if (this.props.currentNode === 'ref') {
      this.props.entityContentStore.setTableModal(true, false, false)
    } else if (this.props.currentNode === 'selectDown') {
      this.props.entityContentStore.setSelectDownModal(true, false, false)
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ifReset !== this.props.ifReset) {
      this.tempRefObj = {}
    }
  }

  open() {
    if (this.props.currentNode === 'ref') {
      this.props.entityContentStore.setTableModal(false, true, false)
    } else if (this.props.currentNode === 'selectDown') {
      this.props.entityContentStore.setSelectDownModal(false, true, false)
    }
  }

  submit(e) {
    e.preventDefault();
    let {
      fieldref:{
        reference,
        combodata
      },
      currentNode
    } = this.props.entityContentStore;
    if(currentNode === 'ref'){
      switch(Number(reference.reftype)){
        case 1: //表型
          this.tempRefObj = Object.assign(this.tempRefObj,{
            treeparentid:'',
            treeparentid_name:'',
            treelabelfield:'',
            treelabelfield_name:'',
            treeref_foreignkey:'',
            treeref_foreignkey_code:'',
            treeref_foreignkey_name:''
          });
          break;
        case 2: //树型
          this.tempRefObj = Object.assign(this.tempRefObj,{
            treelistlabelfield_name:'',
            treelistlabelfield:'',
            treeref_foreignkey:'',
            treeref_foreignkey_code:'',
            treeref_foreignkey_name:''
          });
          break;
        default:
          break;
      }

      reference = Object.assign(reference, this.tempRefObj)
      this.props.entityContentStore.resetRefMsg(reference)
    }else if(currentNode === 'selectDown'){
      // 下拉需要reftype = 0
      combodata = Object.assign(combodata, this.tempCombObj, {
        reftype: 0
      });
      this.props.entityContentStore.resetCombodata(combodata);
    }
    this.close();
    this.setState({
      selectedRowIndex: -1
    });
  }

  rowclick = (record,index) => {
    const { currentNode, fieldref:{formName}} = this.props.entityContentStore;
    let field = `${formName}`;
    let field_code = `${formName}_code`;
    let field_name = `${formName}_name`;
    switch(currentNode){
      case 'ref':
        // 缓存在tempRefObj中，点确定时修改store中的fieldref
        // this.tempRefObj = Object.assign(this.tempRefObj, {
        //   treelistlabelfield_name: record.name,
        //   treelistlabelfield:record.pk_entityitem
        // })
        this.tempRefObj[field] = record.pk_entityitem || '';
        if(field_code === 'treeref_foreignkey_code'){
          this.tempRefObj[field_code] = record.code || '';
        }
        this.tempRefObj[field_name] = record.name || '';
        break;
      case 'selectDown':
        this.tempCombObj = Object.assign(this.tempCombObj, {
          treelabelfield_name: record.name,
          treelabelfield: record.pk_entityitem
        })
        break;
      default:
        break;
    }
    this.setState({
      selectedRowIndex: index
    });
  }

  // 双击回显，并点击确认
  onRowDoubleClick = (record, index, event) => {
    // console.log(record, index, event)
    this.rowclick(record, index)
    this.submit(event)
  }

	render() {
    const { title } = this.props;
    const { header,body } = this.props.entityContentStore.fieldref.tableList;
    const { columns, data } = this.state;
    const { entityContentStore } = this.props;
		return (
      <div>
        <Modal
          show={entityContentStore.fieldref.ifTableModalShow}
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
            <Table
              columns={header}
              data={body}
              parentNodeId='parent'
              height={43}
              headerHeight={42}
              scroll={{y: 250 }}
              onRowDoubleClick={this.onRowDoubleClick}
              rowClassName={(record,index,indent)=>{
                if (this.state.selectedRowIndex == index) {
                    return 'selected';
                } else {
                    return '';
                }
              }}
              onRowClick={this.rowclick}
            />
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                <FormattedMessage id="js.com.tab.0002" defaultMessage="取消" />
            </Button>
            <Button colors="primary" onClick={this.submit}>
                <FormattedMessage id="js.com.tab.0003" defaultMessage="确认" />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}

export default injectIntl(RefModal, {withRef: true});
