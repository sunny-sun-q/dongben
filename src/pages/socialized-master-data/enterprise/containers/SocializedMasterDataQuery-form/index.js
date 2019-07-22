import React, { Component } from 'react'
import { Switch, InputNumber, Col, Row,FormControl, Label } from "tinper-bee";
import Form from 'bee-form';
import {DatePicker} from 'components/tinper-bee';
import SearchPanel from 'components/SearchPanel';
import './index.less'
import {
    withRouter
} from 'react-router-dom';
import {
    inject,
    observer
} from 'mobx-react';
const format = "YYYY-MM-DD";
const formatDateTime = "YYYY-MM-DD HH:mm:ss";
const dateInputPlaceholder = "选择日期";
import { debug } from 'util';

@withRouter
@inject((stores) => {
    return {
        entityContentStore: stores.entityContentStore,
    }
  })
@observer
// 社会化主数据查询表单
class SocializedMasterDataQueryForm extends Component {
    constructor(props){
        super(props)
        this.state = {
        };
        this._form = [];
        this.header = [];
        this.reset = this.reset.bind(this);
        this.search = this.search.bind(this);
    }

    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = () => {
        var moment = require('moment');
        var queryConditon = '';
        var queryResult = this.header;
        queryResult.map((item,index)=>{
            let code = item.code;
            const name = item.name;
            const value = item.value;
            if(value != ''){
                const fieldType = item.fieldType;
                switch (fieldType) {
                    // 字符串类型
                    case 1: ;
                    case 2: ;
                    case 3: ;
                    case 4: queryConditon += (code + " LIKE '%"+ value +"%' AND ");  break;
                    case 5: queryConditon += (code + " = '"+ value.format(format) +"' AND ");  break;
                    case 6: queryConditon += (code + " = '"+ value.format(formatDateTime) +"' AND ");  break;
                }
            }
        })

        if(queryConditon.lastIndexOf(" AND ") != -1){
            queryConditon = queryConditon.substring(0,queryConditon.lastIndexOf(" AND "));
        }
        console.log(this.header + "===============================")
        let gdCode = this.props.socialDataStore.BaseInfoURL.confInfo.designated_entity
        this.props.entityContentStore.getTableDataRequest(gdCode, queryConditon)

    }

    // 合成表单数据
    mapFormItem = header => {
        const { getFieldProps, getFieldError } = this.props.form;
        this._form = []
        this.header = header
        var cacheHead = this.header;
        cacheHead.map((item,index)=>{

            var fieldType = item.fieldType;
            switch (fieldType) {
                // 字符串类型
                case 1:;
                case 2:;
                case 3:;
                case 4:;
                    this._form.push(
                        <Col md={4} xs={6} className="form-col">
                            <Label>
                                {item.name}：
                            </Label>
                                <FormControl
                                    {
                                    ...getFieldProps(item.code, {
                                        validateTrigger: 'onBlur',
                                        initialValue: item.value,
                                        rules: [{
                                            required: true,message: '请填写主表数据',
                                        }],
                                        onChange: function (v) {
                                            item.value = v;
                                        }
                                    }
                                    )}
                                />
                            <span className='error'>
                                {getFieldError('aa')}
                            </span>
                        </Col>
                    );
                    break;
                // 时间日期类型
                case 5:
                    this._form.push(
                        <Col md={4} xs={6}  className="form-col">
                            <Label className='time'>
                                {item.name}：
                            </Label>
                                <DatePicker
                                    {
                                    ...getFieldProps(item.code, {
                                        initialValue: item.value,
                                    }
                                    )}
                                    format={format}
                                    onChange={(v) =>{ item.value = v} }
                                    defaultValue={item.value}
                                />
                            <span className='error'>
                                {getFieldError('aa')}
                            </span>
                        </Col>
                    );
                    break;
                // 时间日期类型
                case 6:
                    this._form.push(
                        <Col md={4} xs={6}  className="form-col">
                            <Label className='time'>
                                {item.name}：
                            </Label>
                                <DatePicker
                                    {
                                    ...getFieldProps(item.code, {
                                        initialValue: item.value,
                                    }
                                    )}
                                    format={formatDateTime}
                                    showTime={true}
                                    onChange={(v) =>{ item.value = v} }
                                    defaultValue={item.value}
                                />
                            <span className='error'>
                                {getFieldError('aa')}
                            </span>
                        </Col>
                    );
                    break;
                // 参照下拉类型
                // case 7:
                //     this._form.push(
                //         <Col md={4} xs={6}>
                //             <Label>
                //                 {item.text}：
                //             </Label>
                //             <Select {
                //                 ...getFieldProps(item.code, {
                //                     initialValue: '',
                //                 }
                //                 )}>
                //                 <Option value="">请选择</Option>
                //                 {
                //                     item.reference.map((item, index) => {
                //                         return (
                //                             <Option key={index} value={item.code}>{item.name}</Option>
                //                         )
                //                     })
                //                 }
                //             </Select>
                //             <span className='error'>
                //                 {getFieldError('aa')}
                //             </span>
                //         </Col>
                //     );
                //     break;
                case 7:
                    break;
                default:

            }
        })
        console.log(cacheHead,"===========================")
    }

    /**
     * 重置
     */
    reset = () => {
        var newCache = this.header;
        newCache.map((item,index)=>{
            item.value = ""
        })
        console.log(this.header)
    }


    render(){

        const { getFieldProps, getFieldError } = this.props.form;
        var items = this.props.socialDataStore.ItemsForQueryForm.queryItems;
        items && items.length > 0 ? this.mapFormItem(items) : [];

        var self = this;

        return (
            <div>
                {items && items.length > 0 ?
                    <SearchPanel
                        form={this.props.form}
                        reset={this.reset}
                        search={this.search}
                        className='data-maintenance-form'>
                        <Row>
                            {self._form}
                        </Row>
                    </SearchPanel>
                    :
                    <div></div>
                }
            </div>
        )
    }
}

export default Form.createForm()(SocializedMasterDataQueryForm)
