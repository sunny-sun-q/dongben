import React, {
	Component
} from 'react';
import { Col, Row, FormControl, Label, Checkbox,  Message } from 'tinper-bee';
import Form from 'bee-form'
import Modal from 'bee-modal'
import MdmTreeRef from 'components/MdmTreeRef';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import {Button} from 'components/tinper-bee';
const FormItem = Form.FormItem;
import './index.less'

import {
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

import {getContextId} from 'utils';
const contextId = getContextId();

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    treeRefStore: stores.treeRefStore,
    treeRefTreeStore: stores.treeRefTreeStore,
    treeEntryStore: stores.treeEntryStore,
    tableRefStore: stores.tableRefStore,
    entityContentStore: stores.entityContentStore
  }
}) @observer
class CopyModelForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
            isstatistics:false,
            isworkflow:false,
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }
    close() {
        this.props.entityContentStore.setCopyModal(false)
    }

    open() {
        this.props.entityContentStore.setCopyModal(true)
    }

    submit = (e) => {
      e.preventDefault();
        let flag = true;
        const { id } = this.props.match.params;
        const { info } = this.props.treeRefStore.refTree;
        let treeref_pkgd = info.treeref_pkgd;
        const { nodeLeaf} = this.props.treeStore
        if(!treeref_pkgd)
            treeref_pkgd = nodeLeaf && nodeLeaf.info && nodeLeaf.info.pid

        this.props.form.validateFields(async(err, values) => {
            if (err && (err.code && err.code.errors &&  err.code.errors[0].message !== true) || (err.name && err.name.errors &&  err.name.errors[0].message !== true)) {
            //   console.log('校验失败', values);
            } else {
                // console.log('提交成功', values);
                await this.props.entityContentStore.getDesignInfo(id);
                let obj = this.props.entityContentStore.dataModal.tempNode;
                obj = Object.assign(obj,{
                    code : values.code,
                    name : values.name,
                    isstatistics : values.isstatistics,
                    isworkflow : values.isworkflow,
                    pk_category : treeref_pkgd,
                    pk_gd : id
                })
                if(!obj.pk_category){
                    flag = false;
                    alert(this.props.intl.formatMessage({id:"js.rou.cus1.0039", defaultMessage:"请选择上级分类！"}))
                    // Message.create({content: '请选择上级分类!', color: 'danger'});
                    return;
                }
                let data = await this.props.entityContentStore.copyDesign(obj);
                if(!data.flag){
                    flag = false
                }
                if(flag){
                    this.close();
                }
                let leafNode = data.data;
                await this.props.treeStore.getTree()
                const { expandedKeys } = this.props.treeStore.tree;

                if (leafNode && leafNode.id) {
                  if (!expandedKeys.includes(leafNode.pid)) {
                    expandedKeys.push(leafNode.pid)
                  }
                  this.props.treeStore.setNodeLeaf(leafNode)
                  this.props.treeStore.setExpandedKeys(expandedKeys);

                  // 复制成功保存上级节点名称
                  const { info } = this.props.treeRefStore.refTree;
                  this.props.treeStore.setParentName(info.treeref_pkgd_name)
                  window.mdmNowUrl = window.location.href;
                  this.props.history.push(`/leaf/${leafNode.id}`)
                }

            }
        })
    }

	render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { ifDisplayNoneClass, nodeLeaf} = this.props.treeStore
        const { dataModal } = this.props.entityContentStore
        const self = this;
        let initCode = '', initName = ''
        initCode = dataModal.nodeInfo.code || dataModal.tempNode.code
        initName = dataModal.nodeInfo.name || dataModal.tempNode.name
        const { isShowModal,info,treeData } = this.props.treeRefStore.refTree;
        let checkboxDisplay = contextId === 'mdm'? 'block' : 'none';
        let error1 = this.props.intl.formatMessage({id:"js.rou.cus1.0069", defaultMessage:"请输入不是重复的编码"})
        let error2 = this.props.intl.formatMessage({id:"js.rou.cus1.0071", defaultMessage:"请输入不是重复的名称"})
        return (
            <div>
                <Modal
                show={dataModal.showModal}
                onHide={this.close}
                style={{width: 600}}
                className="tree-modal"
                backdropClosable={false}
                style={{display: ifDisplayNoneClass ? 'none' : 'block'}}
                backdropStyle={{display: ifDisplayNoneClass ? 'none' : 'block'}}
                >
                <Modal.Header className="text-center" closeButton>
                    <Modal.Title>
                        <FormattedMessage id="js.rou.cus1.0067" defaultMessage="复制模型" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Row className="padding-bottom-40">
                        <Col md={3} xs={3} sm={3} className="modal-l">
                            上级分类
                        </Col>
                        <Col md={9} xs={9} sm={9} className="modal-r">
                        {
                            dataModal.nodeInfo.name
                        }
                        </Col>
                    </Row> */}
                    <Row>
                        <Col md={3} xs={3} sm={3} className="modal-l">
                            <div className='grayDeep'>{this.props.intl.formatMessage({id:"js.rou.cus1.0062", defaultMessage:"编码"})}<span className="require-icon">*</span></div>
                        </Col>
                        <Col md={9} xs={9} sm={9} className="modal-r">
                            <FormItem className='input-field'>
                            <FormControl placeholder=''
                                {...getFieldProps('code', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true, message: this.props.intl.formatMessage({id:"js.rou.cus1.0068", defaultMessage:"请输入编码"}),
                                },{
                                  validator(rule, value, callback) {
                                    if(value === initCode) {
                                      callback(new Error(error1));
                                    } else {
                                      callback(true)
                                    }
                                  }
                                }],
                                initialValue: initCode
                            }) } />
                            <span className='error'>
                                {getFieldError('code')}
                            </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} xs={3} sm={3} className="modal-l">
                            <div className='grayDeep'>{this.props.intl.formatMessage({id:"js.rou.cus1.0063", defaultMessage:"名称"})}<span className="require-icon">*</span></div>
                        </Col>
                        <Col md={9} xs={9} sm={9} className="modal-r">
                            <FormItem className='input-field'>
                            <FormControl placeholder=''
                                {...getFieldProps('name', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true, message: this.props.intl.formatMessage({id:"js.rou.cus1.0070", defaultMessage:"请输入名称"}),
                                },{
                                  validator(rule, value, callback) {
                                    if(value === initName) {
                                      callback(new Error(error2));
                                    } else {
                                      callback(true)
                                    }
                                  }
                                }],
                                initialValue: initName
                            }) } />
                            <span className='error'>
                                {getFieldError('name')}
                            </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} xs={12} sm={12} className="modal-r">
                            <MdmTreeRef
                                label={this.props.intl.formatMessage({id:"js.rou.cus1.0072", defaultMessage:"上级分类"})}
                                fieldId="treeref_pkgd"
                                fieldName="treeref_pkgd_name"
                                url="/modeling/category/cat-tree"
                                defaultValue={nodeLeaf && nodeLeaf.info && nodeLeaf.info.parent_name}
                            />
                        </Col>
                    </Row>
                    <Row className="checkbox-row" style={{
                        'display': checkboxDisplay
                        }
                        }>
                        <Col lg={6} md={6} xs={6} className="text-center">
                            <FormItem>
                                {/* <Label>启用统计：</Label> */}
                                <Checkbox
                                    colors="primary"
                                    checked={this.state.isstatistics}
                                    {
                                    ...getFieldProps('isstatistics', {
                                        initialValue: dataModal.nodeInfo.isstatistics,
                                        onChange(value) {
                                            self.setState({ isstatistics: value });
                                        },
                                    })
                                    }
                                >
                                <FormattedMessage id="js.rou.cus1.0073" defaultMessage="启用统计" />
                                </Checkbox>
                            </FormItem>
                            {/* <FormItem>
                                <Label>启用数据版本：</Label>
                                <Checkbox
                                    colors="primary"
                                    checked={this.state.isstart_us_v}
                                    {
                                    ...getFieldProps('isstart_us_v', {
                                        initialValue: dataModal.nodeInfo.isstart_us_v,
                                        onChange(value) {
                                            self.setState({ isstart_us_v: value });
                                        },
                                    })
                                    }
                                >
                                </Checkbox>
                            </FormItem> */}
                        </Col>
                        <Col lg={6} md={6} xs={6}>
                            <FormItem>
                                {/* <Label>启用流程特性：</Label> */}
                                <Checkbox
                                    colors="primary"
                                    checked={this.state.isworkflow}
                                    {
                                    ...getFieldProps('isworkflow', {
                                        initialValue: dataModal.nodeInfo.isworkflow,
                                        onChange(value) {
                                            self.setState({ isworkflow: value });
                                        },
                                    })
                                    }

                                >
                                <FormattedMessage id="js.rou.cus1.0074" defaultMessage="启用流程特性" />
                                </Checkbox>
                            </FormItem>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                        <FormattedMessage id="js.rou.cus1.0008" defaultMessage="取消" />
                    </Button>
                    <Button colors="primary" onClick={this.submit}>
                        <FormattedMessage id="js.rou.cus1.0015" defaultMessage="确认" />
                    </Button>
                </Modal.Footer>
                </Modal>
        </div>
        );
	}
}

export default injectIntl(Form.createForm()(CopyModelForm), {withRef: true});
