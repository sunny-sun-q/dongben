

import React, { Component } from 'react';
import { Col, Row, FormControl, Label, Checkbox, Radio, Button } from 'tinper-bee';

import Form from 'bee-form'

const FormItem = Form.FormItem;
import './index.less'

import {
    withRouter
} from 'react-router-dom';

import {
    inject,
    observer
} from 'mobx-react';

@withRouter
@inject((stores) => {// 获取数据
    return {
        systablesStore: stores.systablesStore
    }
}) @observer
class SysRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRadioValue: 'all',
            echo: this.props.echo,
            visible: true
        };

    }

    componentDidMount() {
        let oneData = this.props.record
        if (oneData != null && oneData != undefined && oneData.radio_type) {
            let visible = oneData.radio_type == "producer" ? false : true
            this.setState({
                selectedRadioValue: oneData.radio_type,
                visible: visible
            })
        }
    }

    handleRadioChange = (value) => {
        if ("producer" == value) {
            this.setState({
                visible: false
            })
        } else if ("comsumer" == value || "all" == value) {
            this.setState({
                visible: true
            })
        }
        this.setState({
            selectedRadioValue: value
        });
    }

    updateToken = () => {
        this.props.systablesStore.updateToken();
    }


    render() {
        const self = this;
        const { getFieldProps, getFieldError } = this.props.form;
        let oneData = this.props.systablesStore.table.record
        let { echo, selectedRadioValue, visible } = this.state

        const { showErrorInfo1, showErrorInfo2 } = this.props.systablesStore.modal;
        if (oneData != null && oneData.radio_type) {
        }

        return (
            <div className="sysregiter-body">

                <FormItem className='hidediv'>
                    <FormControl placeholder='' disabled='disabled'
                        {...getFieldProps('orderno', {
                            validateTrigger: 'onBlur',
                            initialValue: echo ? (null == oneData.orderno ? '' : oneData.orderno) : ''
                        })} />
                </FormItem>
                <FormItem className='hidediv'>
                    <FormControl placeholder='' disabled='disabled'
                        {...getFieldProps('dr', {
                            validateTrigger: 'onBlur',
                            initialValue: echo ? (null == oneData.dr ? '' : oneData.dr) : ''
                        })} />
                </FormItem>
                <FormItem className='hidediv'>
                    <FormControl placeholder='' className=''
                        {...getFieldProps('pk_sysregister', {
                            validateTrigger: 'onBlur',
                            initialValue: echo ? oneData.pk_sysregister : ''
                        })}
                    />
                </FormItem>
                <Radio.RadioGroup className='radio-type'
                    name="radio_type"
                    selectedValue={selectedRadioValue}
                    {...getFieldProps('radio_type', {
                        initialValue: echo ? oneData.radio_type : selectedRadioValue,
                        onChange(value) {
                            self.handleRadioChange(value)
                        }
                    })}
                >

                    <Radio value="producer" >生产系统</Radio>
                    <Radio value="comsumer" >消费系统</Radio>
                    <Radio value="all" >两者都是</Radio>
                </Radio.RadioGroup>
                <Row className="padding-bottom-20">
                    <Col md={2} xs={3} sm={3} className="before_label">
                        系统编码
                        <span className="redStar">*</span>
                    </Col>
                    <Col md={4} xs={9} sm={9} className="">
                        <FormControl placeholder='请输入系统编码' className='lineOfTwo'
                            {...getFieldProps('code', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true, message: '请输入系统编码',
                                },{
                                    max: 30, message: '编码长度限定在30以内'
                                }],
                                initialValue: echo ? (null == oneData.code ? '' : oneData.code) : ''
                            })} />
                        <span className='error'>
                            {getFieldError('code')}
                        </span>
                    </Col>
                    <Col md={2} xs={3} sm={3} className="before_label">
                        系统名称
                        <span className="redStar">*</span>
                    </Col>
                    <Col md={4} xs={9} sm={9} className="">
                        <FormControl placeholder='请输入系统名称' className='lineOfTwo'
                            {...getFieldProps('name', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true, message: '请输入系统名称'
                                },{
                                    max: 30,  message: '名称长度限定在30以内'
                                }],
                                initialValue: echo ? (null == oneData.name ? '' : oneData.name) : ''
                            })}
                        />
                        <span className='error'>
                            {getFieldError('name')}
                        </span>
                    </Col>
                </Row>
                <Row className="padding-bottom-20" style={{ display: visible ? "block" : "none" }}>
                    <Col md={2} xs={3} sm={3} className="before_label">
                        成功收件人
                            </Col>
                    <Col md={4} xs={9} sm={9} className="">
                        <FormControl placeholder="多个邮箱可以用逗号分隔" className='lineOfTwo mail-input'
                            {...getFieldProps('suc_email_receiver', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: false, message: '多个邮箱用逗号分隔',
                                }
                                ],
                                initialValue: echo ? (null == oneData.suc_email_receiver ? '' : oneData.suc_email_receiver) : ''
                            })}
                        />
                        <span className='error' style={{ display: `${showErrorInfo1 ? 'block' : 'none'}` }}>
                            {/* {getFieldError('suc_email_receiver')} */}
                            请检查成功收件人邮箱
                        </span>
                    </Col>
                    <Col md={2} xs={3} sm={3} className="before_label">
                        失败收件人
                            </Col>
                    <Col md={4} xs={9} sm={9} className="">
                        <FormControl placeholder="多个邮箱可以用逗号分隔" className='lineOfTwo mail-input'
                            {...getFieldProps('fai_email_receiver', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: false, message: '多个邮箱可以用逗号分隔',
                                }
                                ],
                                initialValue: echo ? (null == oneData.fai_email_receiver ? '' : oneData.fai_email_receiver) : ''
                            })}
                        />
                        <span className='error' style={{ display: `${showErrorInfo2 ? 'block' : 'none'}` }}>
                            {/* {getFieldError('fai_email_receiver')} */}
                            请检查失败收件人邮箱
                        </span>
                    </Col>
                </Row>
                <Row className="padding-bottom-20" style={{ display: visible ? "block" : "none" }}>
                    <Col lg={2} md={6} xs={12} className="before_label">
                        分发服务
                    </Col>
                    <Col md={10} xs={6} sm={12} className="lineOfOne">
                        <FormControl placeholder='请输入分发服务URL'
                            {...getFieldProps('distribute_url', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: false, message: '请输入分发服务URL:'
                                }],
                                initialValue: echo ? (null == oneData.distribute_url ? '' : oneData.distribute_url) : ''
                            })} />
                        <span className='error'>
                            {getFieldError('distribute_url')}
                        </span>
                    </Col>
                </Row>
                <Row className="padding-bottom-20">
                    <Col lg={2} md={6} xs={12} className="before_label">
                        备注
                    </Col>
                    <Col md={10} xs={6} sm={12} className="lineOfOne">
                        <FormControl componentClass='textarea' className="textarea-input" placeholder='请输入描述信息'
                            {...getFieldProps('description', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: false, message: '请输入描述信息'
                                }],
                                initialValue: echo ? (null == oneData.description ? '' : oneData.description) : ''
                            })} />
                        <span className='error'>
                            {getFieldError('description')}
                        </span>
                    </Col>
                </Row>
                <Row className='padding-top-2'>
                    <Col md={2} xs={3} sm={3} className="before_label padding-top-25">
                        认证令牌
                    </Col>
                    <Col md={8} xs={6} sm={6} className="padding-top-25">
                        <FormItem className='input-field'>
                            <FormControl placeholder='' disabled='disabled'
                                {...getFieldProps('token', {
                                    validateTrigger: 'onBlur',
                                    rules: [{
                                        required: false, message: ''
                                    }],
                                    initialValue: echo ? (null == oneData.token ? '' : oneData.token) : ''
                                })} />
                            <span className='error'>
                                {getFieldError('token')}
                            </span>
                        </FormItem>
                    </Col>
                    <Col md={2} xs={3} sm={3} className="text-align padding-top-25">
                        <Button bordered disabled={echo ? false : true} onClick={this.updateToken}>更新令牌</Button>
                    </Col>
                </Row>


            </div>
        );
    }
}

export default SysRegister
