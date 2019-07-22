

import React, {
    Component
} from 'react';
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
        taskTablesStore: stores.taskTablesStore
    }
}) @observer
class SysRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRadioValue: 'all',
            // sysregiters: this.props.taskTablesStore.table.rowDatas || [],
            echo: this.props.echo,
            visible: true
        };

        this.handleRadioChange = this.handleRadioChange.bind(this)

    }

    handleRadioChange(value) {

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

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const self = this;
        return (
            <div className="task-body">
                <Row className="padding-bottom-20">
                    <Col md={3} xs={3} sm={3} className="before_label">
                        系统编码
                            </Col>
                    <Col md={9} xs={9} sm={9} className="">
                        <FormControl placeholder='请输入系统编码' className='lineOfOne'
                            {...getFieldProps('code', {
                                validateTrigger: 'onBlur',

                                rules: [{
                                    required: true, message: '请输入系统编码',
                                }],
                                initialValue: this.state.echo ? this.props.taskTablesStore.table.rowDatas[0].code : ''
                            })} />
                        <span className='error'>
                            {getFieldError('code')}
                        </span>
                    </Col>
                </Row>
                <Row className="padding-bottom-20" style={{ display: this.state.visible ? "block" : "none" }}>
                    <Col md={3} xs={3} sm={3} className="before_label">
                        系统名称
                            </Col>
                    <Col md={9} xs={9} sm={9} className="">
                        <FormControl placeholder='请输入系统名称' className='lineOfOne'
                            {...getFieldProps('name', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true, message: '请输入系统名称'
                                }],
                                initialValue: this.state.echo ? this.props.taskTablesStore.table.rowDatas[0].name : ''
                            })}
                        />
                        <span className='error'>
                            {getFieldError('name')}
                        </span>
                    </Col>
                </Row>

                <Row className="padding-bottom-20" style={{ display: this.state.visible ? "block" : "none" }}>
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
                                initialValue: this.state.echo ? this.props.taskTablesStore.table.rowDatas[0].distribute_url : ''
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
                                initialValue: this.state.echo ? this.props.taskTablesStore.table.rowDatas[0].description : ''
                            })} />
                        <span className='error'>
                            {getFieldError('description')}
                        </span>
                    </Col>
                </Row>


                <Row className='padding-top-2'>
                    <Col md={2} xs={3} sm={3} className="before_label padding-top-2">
                        认证令牌
                    </Col>
                    <Col md={8} xs={6} sm={6} className="padding-top-2">
                        <FormItem className='input-field'>
                            <FormControl placeholder='' disabled='disabled'
                                {...getFieldProps('token', {
                                    validateTrigger: 'onBlur',
                                    rules: [{
                                        required: false, message: ''
                                    }],
                                    initialValue: this.state.echo ? this.props.taskTablesStore.table.rowDatas[0].token : ''
                                })} />
                            <span className='error'>
                                {getFieldError('token')}
                            </span>
                        </FormItem>
                    </Col>
                    <Col md={2} xs={3} sm={3} className="text-align">
                        <Button shape="border">更新令牌</Button>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default SysRegister



