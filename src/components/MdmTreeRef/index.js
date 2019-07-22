import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {Component} from 'react';
import {  Col, Row, FormControl, Icon } from 'tinper-bee';
import Tree from 'bee-tree';
import PropTypes from 'prop-types';
import Form from 'bee-form'
import Modal from 'bee-modal';
const FormItem = Form.FormItem;
const TreeNode = Tree.TreeNode;
import './index.less';
import {Button} from 'components/tinper-bee';
const propTypes = {
  submitName:PropTypes.string,//确定的文字
  cancelName:PropTypes.string,//<FormattedMessage id="js.com.Mdm2.0003" defaultMessage="取消" />的文字
  title: PropTypes.string,//模态框标题
  label: PropTypes.string,//表单Label内容
  fieldId: PropTypes.string,//字段id
  fieldName: PropTypes.string, //字段名称
  url: PropTypes.string,//树请求URL
  disabled: PropTypes.bool, //是否禁用
  defaultValue: PropTypes.string, //默认值
  onChange: PropTypes.func, //值更改事件
};

const defaultProps = {
  title: <FormattedMessage id="js.com.Mdm2.0001" defaultMessage="主数据" />,
  label: <FormattedMessage id="js.com.Mdm2.0002" defaultMessage="树主数据" />,
  fieldId: "ref_pkgd",
  fieldName: "ref_pkgd_name",
  disabled: false,
  defaultValue: ""
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
    treeRefStore: stores.treeRefStore,
  }
}) @observer
class MdmTreeRef extends Component {
	constructor(props) {
        super(props);
        this.state={
          defaultValue: props.defaultValue,
          disabled: props.disabled
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.submit = this.submit.bind(this);
        this.loop = this.loop.bind(this);
        this.leafClickCallBack = this.leafClickCallBack.bind(this);
    }

    tempReference = {

    }

    close() {
        this.props.treeRefStore.setTreeModal(false);
         // 让第一个modal显示出来
         this.props.treeStore.setTreeModalDisplayNone(false)
    }

    componentDidMount(){
        this.props.treeRefStore.getTree(this.props.url);
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.defaultValue !== this.props.defaultValue) {
        this.setState({
          defaultValue: nextProps.defaultValue,
        })
      }
      if (nextProps.disabled !== this.props.disabled) {
        this.setState({
          disabled: nextProps.disabled
        })
      }
    }

    open() {
      this.props.treeStore.setTreeModalDisplayNone(true)
      this.props.treeRefStore.setTreeModal(true);
    }

    loop(data) {
        return data.map(item => {
            if (item.children.length>0) {
                return (
                <TreeNode key={item.id} selectable={item.id != 0} title={this.nodeContent(item)} >
                    {this.loop(item.children)}
                </TreeNode>
                );
            }
            return <TreeNode key={item.id} selectable={item.id != 0} title={this.nodeContent(item)} />;
        });
    }

    nodeContent(node){
        return (
            <div className="tree-branch" onClick={() => this.leafClickCallBack(node)} onDoubleClick={() => this.onDoubleClick(node)}>
                <div className="tree-name">
                    {node.name}
                </div>
            </div>
        )
    }

    submit(e) {
        e && e.preventDefault();
        debugger
        this.props.treeRefStore.resetRefMsg(this.tempReference);
        this.props.onChange && this.props.onChange(this.tempReference)
        this.close();
    }

    leafClickCallBack(item) {
        if(item.id === 0){
          return;
        }
        const { fieldId, fieldName } = this.props;
        if(fieldId || fieldName){
            this.tempReference[fieldId] = item.id || '';
            this.tempReference[fieldName] = item.name || '';
        }else{
            this.tempReference = item;
        }
        this.sessionStore = item
    }

    onDoubleClick (node) {
      // if (!node.isparent && !node.isRoot) {
        if(node.id === 0){
          return;
        }
        this.leafClickCallBack(node, true)
        this.submit()
      // }
    }

	render() {
        const { title,label,fieldId,fieldName } = this.props;
        const { getFieldProps,getFieldError } = this.props.form;
        const { defaultValue, disabled } = this.state
        const { isShowModal,info,treeData } = this.props.treeRefStore.refTree;
        console.log('defaultValue', defaultValue)
        // console.log('info[fieldName]', fieldName, info[fieldName]) treeref_pkgd_name
		return (
        <div className="mdm-tree-ref">
            <Row>
                <Col md={3} xs={3} sm={3} className="line-height-30">
                    <label>{label}</label>
                </Col>
                <Col md={9} xs={9} sm={9}>
                    <FormItem className='input-field ref-tree-input'>
                        <FormControl
                            placeholder=''
                            value={ info[fieldName] || defaultValue}
                            disabled={ disabled }
                        // {...getFieldProps('ref_pkgd_name', {
                        //     validateTrigger: 'onBlur',
                        //     rules: [{
                        //         required: true, message: '请输入参照主数据'
                        //     }],
                        //     initialValue: ''
                        // }) }
                        />
                        <Icon type="uf-symlist ref-icon-btn" onClick={!disabled ? this.open : null} className={`${disabled? "disabled-ref-icon":""}`}/>
                    </FormItem>
                </Col>
            </Row>
            <Modal
            show={isShowModal}
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
                <Tree
                onSelect={this.onTreeSelect}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                defaultCheckedKeys={["0"]}
                defaultExpandAll
                >
                {this.loop(treeData)}
                </Tree>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                    <FormattedMessage id="js.com.Mdm2.0003" defaultMessage="取消" />
                </Button>
                <Button colors="primary" onClick={this.submit}>
                    <FormattedMessage id="js.com.Mdm2.0004" defaultMessage="确认" />
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
