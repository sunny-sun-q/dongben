import React, {Component} from 'react';
import {  Col, Row, FormControl, Icon, Label, Radio } from 'tinper-bee';
import Select from 'bee-select';
import PropTypes from 'prop-types';
import Form from 'bee-form'
import Modal from 'bee-modal';
import Tree from 'components/tree';
import MdmTreeRef from 'components/MdmTreeRef';
import MdmTableRef from 'components/MdmTableRef';
import './index.less';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
const FormItem = Form.FormItem;
const Option = Select.Option;
import {Button} from 'components/tinper-bee';
const propTypes = {
  submitName:PropTypes.string,//确定的文字
  cancelName:PropTypes.string,//取消的文字
  title: PropTypes.string,//模态框标题
};

const defaultProps = {
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
    treeRefStore: stores.treeRefStore,
    treeRefTreeStore: stores.treeRefTreeStore,
    treeEntryStore: stores.treeEntryStore,
    tableRefStore: stores.tableRefStore,
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class PublishModal extends Component {
	constructor(props) {
        super(props);
        this.state = {
            uistyle: this.props.uistyle || '1',
        }
        this.close = this.close.bind(this);
        this.publish = this.publish.bind(this);
        this.unpublish = this.unpublish.bind(this);
    }

    componentDidMount() {
      this.setState({
        uistyle: this.props.uistyle || '1'
      })
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.uistyle !== this.props.uistyle) {
        this.setState({
          uistyle: nextProps.uistyle
        })
      }
    }

    close() {
        this.props.entityContentStore.setPublishModal(false)
    }

    async unpublish(e){
        e.preventDefault();
        const { id } = this.props.match.params;
        await this.props.entityContentStore.unPublish(id);
        await this.props.entityContentStore.queryPublish(id);
        this.close();
        // window.parent.location.reload()
    }

    async publish(e) {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
          if (err) {
              // console.log('校验失败', values);
          } else {
            const { uistyle } = this.state;
            const { id } = this.props.match.params;
            const { treeref_pkgd,treeref_pkgd_name } = this.props.treeRefStore.refTree.info;
            const { treeparentid,treeparentid_name,treeref_foreignkey,treeref_foreignkey_name } = this.props.tableRefStore.refTable.info;

            let obj = Object.assign({
                uistyle,
                treeref_pkgd,
                treeref_pkgd_name,
                treeparentid,
                treeparentid_name,
                treeref_foreignkey,
                treeref_foreignkey_name
            },{
                treemasterid:"mdm_code",
                treemasterid_name:"mdm_code"
            })
            if (uistyle == '1'){
              delete obj.treeref_pkgd
              delete obj.treeref_pkgd_name
            } else if (uistyle == '3') {
              const { id } = this.props.match.params;
              obj.treeref_pkgd = id;
            }
            await this.props.entityContentStore.publishNode(id,obj);
            await this.props.entityContentStore.queryPublish(id);
            this.close();
            // window.parent.location.reload()
          }
      });

    }

    handleChange(value) {
        this.setState({uistyle: value});
    }

    open(fieldId){
        const { uistyle } = this.state;
        const { treeref_pkgd } = this.props.treeRefStore.refTree.info;
        const { id } = this.props.match.params;
        let fullclassname = 'com.yonyou.iuapmdm.modeling.mdmdesign.ref.MdmEntityFieldRefData'
        let type = 'grid'
        let pk_gd, ref_boolbean
        if(uistyle === '2'){
            switch(fieldId){
                case "treeparentid":
                    pk_gd = treeref_pkgd || ''
                    ref_boolbean = true;
                    type = 'tree'; //树父id，查询的参照必须是自参照类型，type作为标识
                    break;
                case "treeref_foreignkey":
                    pk_gd = id;
                    ref_boolbean = true;
                    break;
                default:
                    break;
            }
        }else if(uistyle === '3'){
            pk_gd = id || ''
            ref_boolbean = true;
            type = 'tree'; //树父id，查询的参照必须是自参照类型，type作为标识
        }
        this.props.tableRefStore.setTableModal(true,fieldId);
        this.props.tableRefStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean);

        // 让第一个modal隐藏
        this.props.treeStore.setTreeModalDisplayNone(true)
    }

	render() {
        const self = this;
        const { getFieldProps, getFieldError } = this.props.form;
        const { showModal } = this.props.entityContentStore.publishModal;

        const { ifDisplayNoneClass } = this.props.treeStore
        const { treeparentid_name, treeref_foreignkey_name, treeref_pkgd_name } = this.props.tableRefStore.refTable.info;
        const { info } = this.props.treeRefStore.refTree;
        const { isPublish } = this.props.entityContentStore.publishModal;
        const { uistyle } = this.state;
        // console.log('treeparentid_name', treeparentid_name)
		return (
            <div>

              <Modal
                show={showModal}
                onHide={this.close}
                style={{width: 500}}
                className="publish-modal"
                backdropClosable={false}

                style={{display: ifDisplayNoneClass ? 'none' : 'block'}}
                backdropStyle={{display: ifDisplayNoneClass ? 'none' : 'block'}}
                >
                <Modal.Header className="text-center" closeButton>
                    <Modal.Title style={{textAlign: 'left'}}>
                    <FormattedMessage id="js.rou.cus1.0075" defaultMessage="节点发布操作" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="ref-modal-body">
                    <Row className="radio-group">
                        <Radio.RadioGroup
                            name="lol"
                            selectedValue={uistyle}
                            onChange={this.handleChange.bind(this)}>
                            <Radio value="1" ><FormattedMessage id="js.rou.cus1.0076" defaultMessage="默认" /></Radio>
                            <Radio value="2" ><FormattedMessage id="js.rou.cus1.0077" defaultMessage="树表" /></Radio>
                            <Radio value="3" ><FormattedMessage id="js.rou.cus1.0078" defaultMessage="树卡" /></Radio>
                        </Radio.RadioGroup>
                    </Row>
                    {
                        uistyle === "2"?(
                            <Row>
                                <MdmTreeRef fieldId="treeref_pkgd" fieldName="treeref_pkgd_name" defaultValue={info.treeref_pkgd_name} />
                                <Row>
                                    <Col md={3} xs={3} sm={3} className="line-height-30">
                                        <label><FormattedMessage id="js.rou.cus1.0079" defaultMessage="树父ID" /></label>
                                    </Col>
                                    <Col md={9} xs={9} sm={9}>
                                        <FormItem className='input-field ref-tree-input'>
                                        <FormControl placeholder=''
                                          {...getFieldProps('treeparentid_name', {
                                              // value: treeparentid_name || '',
                                              initialValue: treeparentid_name || '',
                                              validateTrigger: 'onChange',
                                              rules: [{
                                                  required: true, message: this.props.intl.formatMessage({id:"js.rou.cus1.0080", defaultMessage:"请输入树父ID"}),
                                              }],
                                              getValueProps: (value) =>{
                                                return {
                                                  value: treeparentid_name
                                                }
                                              }
                                            })
                                          }
                                        />
                                        <span className='error'>
                                          {getFieldError('treeparentid_name')}
                                        </span>
                                        <Icon type="uf-symlist ref-icon-btn" onClick={()=>this.open("treeparentid")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={3} xs={3} sm={3} className="line-height-30">
                                        <label><FormattedMessage id="js.rou.cus1.0081" defaultMessage="外键字段" /></label>
                                    </Col>
                                    <Col md={9} xs={9} sm={9}>
                                        <FormItem className='input-field ref-tree-input'>
                                        <FormControl placeholder=''
                                            // value={ treeref_foreignkey_name || ''}
                                            {...getFieldProps('treeref_foreignkey_name', {
                                              initialValue: treeref_foreignkey_name || '',
                                              validateTrigger: 'onChange',
                                              rules: [{
                                                  required: true, message: this.props.intl.formatMessage({id:"js.rou.cus1.0082", defaultMessage:"请输入外键字段"}),
                                              }],
                                              getValueProps: (value) =>{
                                                return {
                                                  value: treeref_foreignkey_name
                                                }
                                              }
                                            })
                                          }
                                        />
                                        <span className='error'>
                                          {getFieldError('treeref_foreignkey_name')}
                                        </span>
                                        <Icon type="uf-symlist ref-icon-btn" onClick={()=>this.open("treeref_foreignkey")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <MdmTableRef />
                            </Row>
                        ):""
                    }
                    {
                        uistyle === "3"?(
                            <Row>
                                <Row>
                                    <Col md={3} xs={3} sm={3} className="line-height-30">
                                        <label><FormattedMessage id="js.rou.cus1.0079" defaultMessage="树父ID" /></label>
                                    </Col>
                                    <Col md={9} xs={9} sm={9}>
                                        <FormItem className='input-field ref-tree-input'>
                                        <FormControl placeholder=''
                                            {...getFieldProps('treeparentid_name', {
                                              // value: treeparentid_name,
                                              validateTrigger: 'onChange',
                                              rules: [{
                                                  required: true, message: this.props.intl.formatMessage({id:"js.rou.cus1.0080", defaultMessage:"请输入树父ID"}),
                                              }],
                                              initialValue: treeparentid_name,
                                              getValueProps: (value) =>{
                                                return {
                                                  value: treeparentid_name
                                                }
                                              }
                                            })
                                          }
                                        />
                                        <span className='error'>
                                          {getFieldError('treeparentid_name')}
                                        </span>
                                        <Icon type="uf-symlist ref-icon-btn" onClick={()=>this.open("treeparentid")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <MdmTableRef />
                            </Row>
                        ):""
                    }
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                        <FormattedMessage id="js.rou.cus1.0008" defaultMessage="取消" />
                    </Button>
                    {
                      isPublish ? (
                        <Button colors="primary" shape="border" className="publish-modal-btn" onClick={this.unpublish} style={{ marginRight: 20 }} >
                          <FormattedMessage id="js.rou.cus1.0083" defaultMessage="反发布" />
                        </Button>
                      ) : null
                    }
                    <Button colors="primary" onClick={this.publish}>
                        <FormattedMessage id="js.rou.cus1.0084" defaultMessage="发布" />
                    </Button>
                </Modal.Footer>
                </Modal>

            </div>

		);
	}
}

export default injectIntl(Form.createForm()(PublishModal), {withRef: true});


{/* <Modal
  show={showModal}
  onHide={this.close}
  style={{width: 500}}
  className="publish-modal"
  backdropClosable={false}
  >
  <Modal.Header className="text-center" closeButton>
      <Modal.Title style={{textAlign: 'left'}}>
      取消发布操作
      </Modal.Title>
  </Modal.Header>
  <Modal.Body className="ref-modal-body">
      <Row>确定要反发布吗？</Row>
  </Modal.Body>
  <Modal.Footer className="text-center">
      <Button shape="border" style={{ marginRight: 20 }} onClick={this.close}>
          取消
      </Button>
      <Button colors="primary" onClick={this.unpublish}>
          确认
      </Button>
  </Modal.Footer>
  </Modal>: */}
