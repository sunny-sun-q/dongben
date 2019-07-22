

import React, { Component } from 'react';
import { Col, Row, FormControl, Label, Checkbox, Radio, Button } from 'tinper-bee';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
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
        enumTablesStore: stores.enumTablesStore
    }
}) @observer
class EnumValue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            valueEcho: this.props.valueEcho,
            valueRecord: this.props.valueRecord
        };

    }

    componentDidMount() {
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let { valueEcho, valueRecord } = this.props.enumTablesStore.tableinfo.e_value

        return (
            <div className="enum-value-body">
                <FormItem className='hidediv'>
                    <FormControl placeholder='' className=''
                        {...getFieldProps('pk_enumvalue', {
                            validateTrigger: 'onBlur',
                            initialValue: valueEcho ? valueRecord.pk_enumvalue : ''
                        })}
                    />
                </FormItem>
                <FormItem className='hidediv'>
                    <FormControl placeholder='' className=''
                        {...getFieldProps('pk_enumtype', {
                            validateTrigger: 'onBlur',
                            initialValue: valueRecord.pk_enumtype
                        })}
                    />
                </FormItem>
                <FormItem className='hidediv'>
                    <FormControl placeholder=''
                        {...getFieldProps('orderno', {
                            validateTrigger: 'onBlur',
                            initialValue: valueEcho ? valueRecord.orderno : ''
                        })} />
                </FormItem>

                <Row className="padding-bottom-20">
                    <Col md={6} className="">
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0001" defaultMessage="分类编码" /></Label>
                            <FormControl className='lineOfTwo'
                                disabled
                                {...getFieldProps('category_code', {
                                    validateTrigger: 'onBlur',
                                    initialValue:  valueRecord.category_code
                                })} />
                        </FormItem>
                    </Col>
                    <Col md={6} className="">
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0010" defaultMessage="编码" /></Label>
                            <FormControl placeholder={this.props.intl.formatMessage({id:"js.mdm.enum.0002", defaultMessage:"请输入分类编码"})} className='lineOfTwo'
                                {...getFieldProps('code', {
                                    validateTrigger: 'onBlur',

                                    rules: [{
                                        required: true, message: this.props.intl.formatMessage({id:"js.mdm.enum.0003", defaultMessage:"必输项"}),
                                    },{
                                        max: 30, message: this.props.intl.formatMessage({id:"js.mdm.enum.0004", defaultMessage:"长度限定在30以内"})
                                    }],
                                    initialValue: valueEcho ? (null == valueRecord.code ? '' : valueRecord.code) : ''
                                })} />
                            <span className='error'>
                                {getFieldError('code')}
                            </span>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="padding-bottom-20">
                    <Col md={6} className="">
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0011" defaultMessage="名称" /></Label>
                            <FormControl placeholder={this.props.intl.formatMessage({id:"js.mdm.enum.0006", defaultMessage:"请输入名称"})} className='lineOfTwo'
                                {...getFieldProps('name', {
                                    validateTrigger: 'onBlur',
                                    rules: [{
                                        required: true, message: this.props.intl.formatMessage({id:"js.mdm.enum.0003", defaultMessage:"必输项"})
                                    },{
                                        max: 30, message: this.props.intl.formatMessage({id:"js.mdm.enum.0007", defaultMessage:"长度限定在30以内"})
                                    }],
                                    initialValue: valueEcho ? (null == valueRecord.name ? '' : valueRecord.name) : ''
                                })}
                            />
                            <span className='error'>
                                {getFieldError('name')}
                            </span>
                        </FormItem>
                    </Col>
                    <Col md={6} className="lineOfOne">
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0008" defaultMessage="备注" /></Label>
                            <FormControl className="lineOfTwo" placeholder={this.props.intl.formatMessage({id:"js.mdm.enum.0009", defaultMessage:"请输入描述信息"})} //componentClass='textarea'
                                {...getFieldProps('descri', {
                                    validateTrigger: 'onBlur',
                                    rules: [{
                                        required: false, message: this.props.intl.formatMessage({id:"js.mdm.enum.0009", defaultMessage:"请输入描述信息"})
                                    }],
                                    initialValue: valueEcho ? (null == valueRecord.descri ? '' : valueRecord.descri) : ''
                                })} />
                            <span className='error'>
                                {getFieldError('descri')}
                            </span>
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default injectIntl(EnumValue, {withRef: true});
