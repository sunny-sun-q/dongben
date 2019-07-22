import React, { Component } from 'react'
import { Message, Switch, InputNumber, Col, Row, FormControl, Label, Radio } from "tinper-bee";
import Select from 'bee-select';
import Form from 'bee-form';
import {DatePicker} from 'components/tinper-bee';
import moment from "moment";
import SearchPanel from 'components/SearchPanel';
import {RefTreeWithInput} from 'ref-tree';
import 'ref-tree/lib/index.css';


const FormItem = Form.FormItem;
import './index.less'


let prefixUrl;
prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';
const treeoption = {
    checkable: false, //是否带复选框
    title: '请选择主数据',
    searchable: false,
    param: {
        treeloadData: false
    },
    // refModelUrl: {
    //     treeUrl: `${prefixUrl}/modeling/category/md-reftree`,//'/iuapmdm/modeling/category/md-reftree', //树请求
    // },// 打包上线时 /iuapmdm/modeling/category/md-reftree
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
        logTablesStore: stores.logTablesStore,
        sysStore: stores.sysStore
    }
}) @observer
class QFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pk_gd: '',
            // pk_category: '',
            pk_sys: '',

            opr_state: '',
            start: '',
            end: '',

            opr_type: '',

            children: []
        }
    }
    componentWillMount() {

    }

    async componentDidMount() {
        const { sysStore } = this.props;
        sysStore.getMdRefTree();

        await sysStore.getAllSys();
        let options = sysStore.sysrs.rowDatas
        let _Children = []
        for (let i = 0; i < options.length; i++) {
            _Children.push(<Option key={options[i].value}>{options[i].text}</Option>);
        }
        
        this.setState({
            children: _Children
        })
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
            let { opr_type, logTablesStore } = this.props
            let qfconf = {
                pk_gd: values.pk_gd === undefined ? "" : JSON.parse(values.pk_gd).refpk,
                pk_sys: values.pk_sys === undefined ? "" : values.pk_sys,
                opr_state: values.opr_state === undefined ? 0 : values.opr_state === '' ? 0 : values.opr_state ,
                start: values.start ? moment(values.start).format('YYYY-MM-DD HH:mm:ss'): ""  ,
                end: values.end ?  moment(values.end).format('YYYY-MM-DD HH:mm:ss') : "",
                opr_type: opr_type
            }
            await logTablesStore.setQFCond(qfconf);
            await logTablesStore.getTables(10, 1);
        });


    }

    onSaveMdm1 = (record) => {
        console.log(record[0].isparent)
        if(record[0].isparent){
            Message.create({content: '请重新选择主数据', color: 'danger'});
        }
    }

    reset = () => {

        this.setState({
            pk_gd: '',
            // pk_category: '',
            pk_sys: '',

            opr_state: '',
            start: '',
            end: '',

            opr_type: '',
        })
    }

    sysChange = value => {
        this.setState({
            pk_sys: value
        })
    };

    oprStateChange = value => {
        this.setState({
            opr_state: value
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
                            <Label className='item-title'>主数据</Label>
                            <div className='item-detail'>
                            <RefTreeWithInput
                                {...treeoption}
                                onSave= {this.onSaveMdm1}
                                className="qfilter-ref-tree mdm-ref"
                                searchable={false}
                                backdrop={true}
                                {...getFieldProps('pk_gd', { })}
                                treeData = { this.props.sysStore.mdRefTree }
                            />
                            </div>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label className='item-title'>集成系统</Label>
                            <div className='item-detail'>
                                <Select
                                        onChange={this.sysChange}
                                        {...getFieldProps('pk_sys', {
                                        })}
                                    >
                                    {this.state.children}
                                </Select>
                            </div>

                        </FormItem>
                    </Col>
                
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label className='item-title'>操作状态</Label>
                            <div className='item-detail'>
                                <Select
                                    // onChange={this.oprStateChange}
                                      {...getFieldProps('opr_state', {
                                          initialValue: '',
                                          onChange: this.oprStateChange
                                      })}
                                    >
                                    <Option value="">全部</Option>
                                    <Option value={1}>成功</Option>
                                    <Option value={2}>失败</Option>
                                </Select>
                            </div>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem className="datepicker">
                            <Label className='item-title'>起始时间</Label>
                            <div className='item-detail'>
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
                            </div>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem className="datepicker">
                            <Label className='item-title'>结束时间</Label>
                            <div className='item-detail'>
                                <DatePicker className='text-width-style'
                                    format={format}
                                    showTime={true}
                                    onSelect={this.onSelectEndTime}//
                                    onChange={this.onChangeEnd}
                                    defaultValue={moment()}
                                    placeholder={dateInputPlaceholder}
                                    {...getFieldProps('end', {
                                    })}
                                />
                            </div>
                        </FormItem>
                    </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(QFilter)
