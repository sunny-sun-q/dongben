

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
class EnumType extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;

        let { typeEcho, typeRecord } = this.props.enumTablesStore.tableinfo.e_type

        return (
            <div className="enum-type-body">
                <FormItem className='hidediv'>
                    <FormControl placeholder='' className=''
                        {...getFieldProps('pk_enumtype', {
                            validateTrigger: 'onBlur',
                            initialValue: typeEcho ? typeRecord.pk_enumtype : ''
                        })}
                    />
                </FormItem>
                <FormItem className='hidediv'>
                    <FormControl placeholder=''
                        {...getFieldProps('orderno', {
                            validateTrigger: 'onBlur',
                            initialValue: typeEcho ? typeRecord.orderno : ''
                        })} />
                </FormItem>

                <Row className="padding-bottom-20">
                    <Col md={6} className="">
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0001" defaultMessage="分类编码" /></Label>
                            <FormControl placeholder={this.props.intl.formatMessage({id:"js.mdm.enum.0002", defaultMessage:"请输入分类编码"})} className='lineOfTwo'
                                {...getFieldProps('code', {
                                    validateTrigger: 'onBlur',

                                    rules: [{
                                        required: true, message: this.props.intl.formatMessage({id:"js.mdm.enum.0003", defaultMessage:"必输项"}),
                                    },{
                                        max: 30, message: this.props.intl.formatMessage({id:"js.mdm.enum.0004", defaultMessage:"长度限定在30以内"})
                                    }],
                                    initialValue: typeEcho ? (null == typeRecord.code ? '' : typeRecord.code) : ''
                                })} />
                            <span className='error'>
                                {getFieldError('code')}
                            </span>
                        </FormItem>
                    </Col>
                    <Col md={6} className="">
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0005" defaultMessage="分类名称" /></Label>
                            <FormControl placeholder={this.props.intl.formatMessage({id:"js.mdm.enum.0006", defaultMessage:"请输入名称"})} className='lineOfTwo'
                                {...getFieldProps('name', {
                                    validateTrigger: 'onBlur',
                                    rules: [{
                                        required: true, message: this.props.intl.formatMessage({id:"js.mdm.enum.0003", defaultMessage:"必输项"})
                                    },{
                                        max: 30, message: this.props.intl.formatMessage({id:"js.mdm.enum.0007", defaultMessage:"长度限定在30以内"})
                                    }],
                                    initialValue: typeEcho ? (null == typeRecord.name ? '' : typeRecord.name) : ''
                                })}
                            />
                            <span className='error'>
                                {getFieldError('name')}
                            </span>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="padding-bottom-20">
                    <Col md={6} className="lineOfOne">
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0008" defaultMessage="备注" /></Label>
                            <FormControl className="lineOfTwo" placeholder={this.props.intl.formatMessage({id:"js.mdm.enum.0009", defaultMessage:"请输入描述信息"})} //  componentClass='textarea'
                                {...getFieldProps('descri', {
                                    validateTrigger: 'onBlur',
                                    rules: [{
                                        required: false, message: this.props.intl.formatMessage({id:"js.mdm.enum.0009", defaultMessage:"请输入描述信息"})
                                    }],
                                    initialValue: typeEcho ? (null == typeRecord.descri ? '' : typeRecord.descri) : ''
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

export default injectIntl(EnumType, {withRef: true});
