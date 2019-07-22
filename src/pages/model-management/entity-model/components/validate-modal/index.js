import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {Component} from 'react';
import { Col, Row, FormControl, Icon, Label } from 'tinper-bee';
import Select from 'bee-select';
import PropTypes from 'prop-types';
import Form from 'bee-form'
import Modal from 'bee-modal';
import Tree from 'components/tree';
import './index.less';
const FormItem = Form.FormItem;
const Option = Select.Option;
import {Button} from 'components/tinper-bee';
const propTypes = {
  submitName:PropTypes.string,//确定的文字
  cancelName:PropTypes.string,//取消的文字
  title: PropTypes.string,//模态框标题
};

const defaultProps = {
//   title: this.props.intl.formatMessage({id:"js.com.val.0001", defaultMessage:"主数据"})
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
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class ValidateModal extends Component {
	constructor(props) {
        super(props);
        this.state = {
            selectedRowIndex : -1,
            validatetype:0,
            regx : '',
            regxTip:this.props.intl.formatMessage({id:"js.com.val.0002", defaultMessage:"Regex示例"}),
            validateprompt:"",
            regexvalidateclass:''
        }
        this.close = this.close.bind(this);
        this.submit = this.submit.bind(this);
    }
    regxArr = [
        {value:'^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$',name:this.props.intl.formatMessage({id:"js.com.val.0003", defaultMessage:"邮箱"})},
        {value:'^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$',name:this.props.intl.formatMessage({id:"js.com.val.0004", defaultMessage:"IP地址"})},
        {value:'^1(3|4|5|7|8)[0-9]{9}$',name:this.props.intl.formatMessage({id:"js.com.val.0005", defaultMessage:"手机号码"})},
        {value:'^([0-9]{17}[0-9X])|([0-9]{15})$',name:this.props.intl.formatMessage({id:"js.com.val.0006", defaultMessage:"身份证号"})},
        {value:'^[0-9]{6}$',name:this.props.intl.formatMessage({id:"js.com.val.0007", defaultMessage:"邮政编码"})},
        {value:'^$|(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$',name:this.props.intl.formatMessage({id:"js.com.val.0008", defaultMessage:"固定电话"})}
    ]

    componentWillReceiveProps(nextProps){
        if(nextProps.recordInfo !== this.props.recordInfo){
            let { pk_entityitem,pk_mdentity,code,name } = nextProps.recordInfo;
            let { validatetype,validateprompt,regexvalidateclass } = nextProps.recordInfo;
            this.props.entityContentStore.getValidateRule(code,name);
            this.setState({
                validatetype: validatetype || 0,
                validateprompt: validateprompt,
                regx: validatetype === 0? regexvalidateclass :'',
                regexvalidateclass: validatetype === 0? "": regexvalidateclass
            })
        }
    }

    close() {
        this.props.entityContentStore.setValidateModal(false)
    }

    submit(e) {
        e.preventDefault();
        const { recordInfo } = this.props;
        const { validatetype,validateprompt,regx,regexvalidateclass } = this.state;
        let obj = Object.assign(recordInfo, {
            validatetype : validatetype,
            validateprompt : validateprompt,
            regexvalidateclass : validatetype === 0? regx : regexvalidateclass
        })
        this.props.entityContentStore.saveValidateRule(obj);
        this.close();
    }

    changeType = value => {
        this.setState({
            validatetype:Number(value)
        })
    }

    changeReg = (value) =>{
        let tempRegx = this.regxArr.find((item)=>{return item.value === value})
        this.setState({
            regx : value,
            validateprompt: tempRegx ? tempRegx.name : ''
        })
    }

    /** 自定义正则表达式 */
    defineRegx = value => {
        this.setState({
            regx : value
        })
    }

    /** 校验规则语义 */
    changeRegxName = value => {
        this.setState({
            validateprompt : value
        })
    }

    /** 校验规则类 */
    changeRegxClass = value => {
        this.setState({
            regexvalidateclass : value
        })
    }

	render() {
        const self = this;
        const { getFieldProps, getFieldError } = this.props.form;
        const { showModal,info } = this.props.entityContentStore.validateModal;
        const { recordInfo } = this.props;
        // console.log(recordInfo,'000000000000000000')
        const { validatetype,regx,regxTip,validateprompt,regexvalidateclass } = this.state;
		return (
            <div>
                <Modal
                    show={showModal}
                    onHide={this.close}
                    style={{width: 900}}
                    className="validate-modal"
                    backdropClosable={false}
                >
                <Modal.Header className="text-center" closeButton>
                    <Modal.Title style={{textAlign: 'left'}}>
                    <FormattedMessage id="js.com.val.0009" defaultMessage="配置字段校验规则" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="ref-modal-body">
                    <Row>
                        <Col md={6} xs={6} sm={6}>
                            <FormItem className="input-field">
                                <Label>{<FormattedMessage id="js.com.val.0010" defaultMessage="字段编码：" />}</Label>
                                <FormControl
                                disabled
                                value={recordInfo? recordInfo.code : ''}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                            <FormItem className="input-field">
                                <Label>{<FormattedMessage id="js.com.val.0011" defaultMessage="字段名称：" />}</Label>
                                <FormControl
                                disabled
                                value={recordInfo? recordInfo.name : ''}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                            <FormItem className="input-field">
                                <Label>{<FormattedMessage id="js.com.val.0012" defaultMessage="校验规则类型：" />}</Label>
                                <Select
                                    {...getFieldProps('validatetype', {
                                        initialValue: String(validatetype) || '0',
                                        onChange(value) {
                                          self.changeType(value);
                                        },
                                    }) }
                                >
                                <Option value="0"><FormattedMessage id="js.com.val.0013" defaultMessage="正则表达式" /></Option>
                                <Option value="1"><FormattedMessage id="js.com.val.0014" defaultMessage="校验规则类" /></Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                            <FormItem className="input-field">
                                <Label>{<FormattedMessage id="js.com.val.0015" defaultMessage="正则表达式：" />}</Label>
                                <FormControl
                                    disabled={validatetype !== 0}
                                    onChange={this.defineRegx}
                                    value={regx || ''}/>
                                <Select
                                    className="regx-sample"
                                    disabled={validatetype !== 0}
                                    showSearch
                                    onChange={(value)=>this.changeReg(value)}
                                    value={regxTip}
                                >
                                {this.regxArr.map((item,index) => {
                                    return (
                                        <Option value={item.value}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                            <FormItem className="input-field">
                                <Label>{<FormattedMessage id="js.com.val.0016" defaultMessage="校验规则类：" />}</Label>
                                <FormControl
                                disabled={validatetype !== 1}
                                value={regexvalidateclass || ''}
                                onChange={this.changeRegxClass}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                            <FormItem className="input-field">
                                <Label>{<FormattedMessage id="js.com.val.0017" defaultMessage="校验规则语义：" />}</Label>
                                <FormControl
                                value={validateprompt || ''}
                                onChange={this.changeRegxName}
                                // {...getFieldProps('validateprompt', {
                                //     initialValue: recordInfo.validateprompt || '',
                                //     onChange(value) {
                                //         self.changeRegxName(value);
                                //     },
                                // }) }
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                        <FormattedMessage id="js.com.val.0018" defaultMessage="取消" />
                    </Button>
                    <Button colors="primary" onClick={this.submit}>
                        <FormattedMessage id="js.com.val.0019" defaultMessage="确认" />
                    </Button>
                </Modal.Footer>
                </Modal>
            </div>
		);
	}
}

ValidateModal.propTypes = propTypes;
ValidateModal.defaultProps = defaultProps;
export default injectIntl(Form.createForm()(ValidateModal), {withRef: true});
