import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {Component} from 'react';
import {  Col,  Row, FormControl, Icon } from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import Modal from 'bee-modal'
import Form from 'bee-form'
import Tree from 'components/tree'
import PropTypes from 'prop-types';
const FormItem = Form.FormItem;
import './index.less';
import {Button} from 'components/tinper-bee';
const propTypes = {
  title: PropTypes.string,//模态框标题
  label: PropTypes.string,//表单Label内容
};

const defaultProps = {
  title: <FormattedMessage id="js.com.Mdm4.0001" defaultMessage="实体字段" />,
  label: <FormattedMessage id="js.com.Mdm4.0002" defaultMessage="树父ID" />,
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
    treeRefStore: stores.treeRefStore,
    tableRefStore: stores.tableRefStore,
    treeStore: stores.treeStore,
  }
}) @observer
class MdmTableRef extends Component {
	constructor(props) {
    super(props);
    this.state = {
      selectedRowIndex: -1,
      tempReference: {}
    }
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.submit = this.submit.bind(this);
    this.rowclick = this.rowclick.bind(this);
  }

  close() {
    this.props.tableRefStore.setTableModal(false);
    // 让第一个modal显示出来
    this.props.treeStore.setTreeModalDisplayNone(false)
  }

  open() {
    const { fieldId,fieldName } = this.props;
    const { treeref_pkgd } = this.props.treeRefStore.refTree.info;
    const { id } = this.props.match.params;
    let fullclassname = 'com.yonyou.iuapmdm.modeling.mdmdesign.ref.MdmEntityFieldRefData'
    let type = 'grid'
    let pk_gd, ref_boolbean
    switch(fieldId){
      case "treeparentid":
        pk_gd = treeref_pkgd || ''
        ref_boolbean = true;
        break;
      case "treeref_foreignkey":
        pk_gd = id;
        ref_boolbean = true;
        break;
      default:
        break;
    }
    this.props.tableRefStore.setTableModal(true);
    this.props.tableRefStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean);
  }

  submit(e) {
    e.preventDefault();
    this.close();
    this.props.tableRefStore.resetRefMsg(this.state.tempReference);
    this.setState({
      selectedRowIndex: -1
    });
  }

  rowclick = (record,index) => {
    const { fieldId } = this.props.tableRefStore.refTable;
    let fieldName = `${fieldId}_name`;
    debugger
    const { tempReference } = this.state
    tempReference[fieldId] = record.pk_entityitem || '';
    tempReference[fieldName] = record.name || '';
    this.setState({
      selectedRowIndex: index,
      tempReference
    });
  }

  // 双击回显，并点击<FormattedMessage id="js.com.Mdm4.0005" defaultMessage="确认" />
  onRowDoubleClick = (record, index, event) => {
    console.log(record, index, event)
    this.rowclick(record, index)
    this.submit(event)
  }

	render() {
    const { title,label,fieldId,fieldName } = this.props;
    const { isShowModal,tableList:{header,body},info } = this.props.tableRefStore.refTable;
    const { columns, data } = this.state;
		return (
        <div className="mdm-table-ref">
            {/* <Row>
                <Col md={3} xs={3} sm={3} className="line-height-30">
                    <label>{label}</label>
                </Col>
                <Col md={9} xs={9} sm={9}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        value={ info[`${fieldName}`] || ''}
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={this.open} />
                    </FormItem>
                </Col>
            </Row> */}
            <Modal
            show={isShowModal}
            onHide={this.close}
            style={{width: 600}}
            className="ref-modal"
            backdropClosable={false}
            >
            <Modal.Header className="text-center" closeButton>
                <Modal.Title style={{textAlign: 'left'}}>
                <FormattedMessage id="js.com.Mdm4.0003" defaultMessage="实体字段" />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="ref-modal-body">
                <Table
                columns={header}
                data={body}
                parentNodeId='parent'
                height={43}
                headerHeight={42}
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
                    <FormattedMessage id="js.com.Mdm4.0004" defaultMessage="取消" />
                </Button>
                <Button colors="primary" onClick={this.submit}>
                    <FormattedMessage id="js.com.Mdm4.0005" defaultMessage="确认" />
                </Button>
            </Modal.Footer>
            </Modal>
        </div>
		);
	}
}

MdmTableRef.propTypes = propTypes;
MdmTableRef.defaultProps = defaultProps;
export default MdmTableRef
