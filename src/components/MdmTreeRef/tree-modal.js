import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {Component} from 'react';
import {  Col, Row, FormControl, Icon } from 'tinper-bee';
import PropTypes from 'prop-types';
import Form from 'bee-form'
const FormItem = Form.FormItem;
import Modal from 'bee-modal';
import Tree from 'components/MdmTreeRef/tree';
import './index.less';
import {Button} from 'components/tinper-bee';
const propTypes = {
  submitName:PropTypes.string,//确定的文字
  cancelName:PropTypes.string,//<FormattedMessage id="js.com.Mdm.0003" defaultMessage="取消" />的文字
  title: PropTypes.string,//模态框标题
  label: PropTypes.string,//表单Label内容
  fieldId: PropTypes.string,//字段id
  fieldName: PropTypes.string, //字段名称
  url: PropTypes.string,//树请求URL
};

const defaultProps = {
  title: <FormattedMessage id="js.com.Mdm.0001" defaultMessage="主数据" />,
  label: <FormattedMessage id="js.com.Mdm.0002" defaultMessage="树主数据" />,
  fieldId: "ref_pkgd",
  fieldName: "ref_pkgd_name"
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
    treeRefTreeStore: stores.treeRefTreeStore,
    treeRefStore: stores.treeRefStore,
  }
}) @observer
class MdmTreeRef extends Component {
	constructor(props) {
        super(props);
        this.state={
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.submit = this.submit.bind(this);
        this.leafClickCallBack = this.leafClickCallBack.bind(this);
    }

    tempReference = {

    }

    close() {
        this.props.treeRefStore.setTreeModal(false);
    }

    open() {
        this.props.treeRefStore.setTreeModal(true);
    }

    submit(e) {
        e.preventDefault();
        this.props.treeRefStore.resetRefMsg(this.tempReference);
        this.close();
    }

    leafClickCallBack(item) {
        const { fieldId,fieldName } = this.props;
        this.tempReference[fieldId] = item.id || '';
        this.tempReference[fieldName] = item.name || '';
    }

	render() {
        const { title,label,fieldId,fieldName } = this.props;
        const { getFieldProps,getFieldError } = this.props.form;
        const { isShowModal,info } = this.props.treeRefStore.refTree;
        console.log(fieldName,'79802')
		return (
        <div className="mdm-tree-ref">
            {/* <Row>
                <Col md={3} xs={3} sm={3} className="line-height-30">
                    <label>{label}</label>
                </Col>
                <Col md={9} xs={9} sm={9}>
                    <FormItem className='input-field ref-tree-input'>
                        <FormControl
                            placeholder=''
                            value={ info[fieldName] || ''}
                        // {...getFieldProps('ref_pkgd_name', {
                        //     validateTrigger: 'onBlur',
                        //     rules: [{
                        //         required: true, message: '请输入参照主数据'
                        //     }],
                        //     initialValue: ''
                        // }) }
                        />
                        <Icon type="uf-symlist ref-icon-btn" onClick={this.open} />
                    </FormItem>
                </Col>
            </Row> */}
            <Modal
            show={isShowModal}
            onHide={this.close}
            style={{width: 300}}
            className="ref-modal"
            backdropClosable={false}
            >
            <Modal.Header className="text-center" closeButton>
                <Modal.Title style={{textAlign: 'left'}}>
                {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="ref-modal-body">
                <Tree ifNoHover={true} isRefTree={true} leafClickCallBack={this.leafClickCallBack}/>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                    <FormattedMessage id="js.com.Mdm.0003" defaultMessage="取消" />
                </Button>
                <Button colors="primary" onClick={this.submit}>
                    <FormattedMessage id="js.com.Mdm.0004" defaultMessage="确认" />
                </Button>
            </Modal.Footer>
            </Modal>
        </div>
		);
	}
}

MdmTreeRef.propTypes = propTypes;
MdmTreeRef.defaultProps = defaultProps;
export default Form.createForm()(MdmTreeRef)
