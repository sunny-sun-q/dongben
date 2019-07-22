import React, { Component } from 'react'
import { Message, Switch, InputNumber, Col, Row, FormControl, Label, Radio } from "tinper-bee";
import Select from 'bee-select';
import Form from 'bee-form';
import {DatePicker} from 'components/tinper-bee';
import moment from "moment";
import SearchPanel from 'components/SearchPanel';
import RefTreeWithInput from 'ref-tree';
import 'ref-tree/lib/index.css';

const FormItem = Form.FormItem;
import './index.less'

let prefixUrl;
prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';
const option1 = {
    checkable: false, //是否带复选框
    title: '请选择主数据',
    searchable: false,
    param: {
        treeloadData: false
    },
    refModelUrl: {
        treeUrl: `${prefixUrl}/modeling/category/md-reftree`,//'/iuapmdm/modeling/category/md-reftree', //树请求
    },// 打包上线时 /iuapmdm/modeling/category/md-reftree
    // jsonp: true,
    matchUrl: '',
    filterUrl: '',
    defaultExpandAll: true,
    valueField: "id",
    displayField: '{name}',//显示内容的键
    lang: 'zh_CN'
};

const danger = function () {
    Message.create({content: '请重新选择主数据', color: 'danger'});
};

import {
    BrowserRouter as Router,
    Route,
    Link,
    withRouter
} from 'react-router-dom';

import {
    inject,
    observer
} from 'mobx-react';
@withRouter


@inject((stores) => {
    return {
        LogTable: stores.LogTable,
    }
}) @observer
class QueryPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pk_gd: '',
            username: '',
            operstate: '',
            start: '',
            end: '',
            opertype: '',
            children: []
        }
    }
    componentWillMount() {

    }

    componentDidMount() {
    }

    onSelectStartTime = (d) => {
        this.setState({
            start: d.toLocalDate
        })
    }

    onSelectEndTime = (d) => {
        this.setState({
            end: d.toLocalDate
        })
    }

    onChangeStart = (d) => {
    }
    onChangeEnd = (d) => {
    }

    search = async(error, values) => {
        this.props.form.validateFields(async (err, values) => {
            let { LogTable } = this.props

            let qfconf = {
                pk_gd: values.pk_gd === undefined ? "" : JSON.parse(values.pk_gd).refpk,
                username: values.username === undefined ? "" : values.username,
                operstate: values.operstate === undefined ? '' : values.operstate ,
                start: values.start === undefined ? "" : moment(values.start).format('YYYY-MM-DD HH:mm:ss'),
                end: values.end === undefined ? "" : moment(values.end).format('YYYY-MM-DD HH:mm:ss'),
                opertype: values.opertype === undefined ? '' : values.opertype ,
            }

            await LogTable.setQFCond(qfconf);
            await LogTable.getTables(10, 1);
        });


    }

    onSaveMdm1 = (record) => {
        if(record[0].isparent){
            Message.create({content: '请重新选择主数据', color: 'danger'});
        }
    }

    reset = () => {

        this.setState({
            pk_gd: '',
            username:'',
            operstate: '',
            start: '',
            end: '',
            opertype: '',
        })
    }

    oprTypeChange = value => {
        this.setState({
            opertype: value
        })
    };

    oprStateChange = value => {
        this.setState({
            operstate: value
        })
    };

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;

        const format = "YYYY-MM-DD HH:mm:ss";
        const dateInputPlaceholder = "选择日期";

        let self = this;
        let {
            refKeyArraydeptCheckBy,
            refKeyArrayorderBy,
            refKeyArrayorderDept,
        } = this.state;
        return (
            <SearchPanel
                className='qfilter'
                searchOpen={true}
                form={this.props.form}
                reset={this.reset}
                search={this.search}>
                <Row>

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>主数据</Label>
                            <RefTreeWithInput
                                onSave= {this.onSaveMdm1}
                                className="qfilter-ref-tree"
                                {...option1}
                                backdrop={true}
                                style={{
                                    position: 'absolute'
                                }}
                                {...getFieldProps('pk_gd', {
                                })}
                            />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>操作类型</Label>
                            <Select
                                  {...getFieldProps('opertype', {
                                      initialValue: '',
                                      onChange: this.oprTypeChange
                                  })}
                                >
                                <Option value="">全部</Option>
                                <Option value={3}>新增</Option>
                                <Option value={4}>修改</Option>
                                <Option value={5}>删除</Option>
                                <Option value={7}>发布</Option>
                                <Option value={8}>反发布</Option>
                                <Option value={9}>排重</Option>
                                <Option value={11}>导出</Option>
                            </Select>

                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>操作状态</Label>
                            <Select
                                  {...getFieldProps('operstate', {
                                      initialValue: '',
                                      onChange: this.oprStateChange
                                  })}
                                >
                                <Option value="">全部</Option>
                                <Option value={1}>成功</Option>
                                <Option value={2}>失败</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>操作用户</Label>
                            <FormControl placeholder='' 
                               {...getFieldProps('username', {
                                  validateTrigger: 'onBlur',
                                  initialValue:''
                               })}
                           />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem className="datepicker">
                            <Label>起始时间</Label>
                            <DatePicker className='text-width-style'
                                format={format}
                                showTime={true}
                                onSelect={this.onSelectStartTime}
                                onChange={this.onChangeStart}
                                defaultValue={moment()}
                                placeholder={dateInputPlaceholder}
                                {...getFieldProps('start', {
                                })}
                            />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem className="datepicker">
                            <Label>结束时间</Label>
                            <DatePicker className='text-width-style'
                                format={format}
                                showTime={true}
                                onSelect={this.onSelectEndTime}
                                onChange={this.onChangeEnd}
                                defaultValue={moment()}
                                placeholder={dateInputPlaceholder}
                                {...getFieldProps('end', {
                                })}
                            />
                        </FormItem>
                    </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(QueryPanel)
