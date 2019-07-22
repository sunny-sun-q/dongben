import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react';
import Form from 'bee-form';
import { FormControl, Label, FormGroup, Menu,Row,Col, Checkbox, Icon } from 'tinper-bee';
import { Table,DatePicker, RangePicker } from 'components/tinper-bee';
import {Button} from 'components/tinper-bee';
import { Error, success, Warning } from 'utils/index';
import TimePicker from "tinper-bee/lib/Timepicker";
import moment from "moment";
import Select from 'bee-select'; //单独引入
import 'bee-select/build/Select.css'; //单独引入
import Modal from 'bee-modal'; //单独引入
import PropTypes from 'prop-types';
import './index.less';
import MdmRefComp from 'components/mdmRef';
const FormItem = Form.FormItem;
const Option = Select.Option;
let count = 0;


/**
 * 部分不能通过this.props.form.resetFields()清空的组件，需要传reset方法，在reset方法中自行清空
 */
const propTypes = {
    searchOpen:PropTypes.bool,//是否默认展开，false默认关闭
    search: PropTypes.func,//查询的回调
    reset:PropTypes.func,//重置的回调
    getData:PropTypes.func,
    closeFun: PropTypes.func,
    resetName:PropTypes.string,//重置的文字
    searchName:PropTypes.string,//查询的文字
    title: PropTypes.string,
    autoShow: PropTypes.bool,
    fontStyle: PropTypes.string, // 显示按钮的样式，button、icon, 默认是button
    size: PropTypes.string, // 按钮的大小
};

const defaultProps = {
    searchOpen:false,
    autoShow: false,
    search: () => {},
    reset: () => {},
    getData: () => {},
    closeFun: () => {},
    title: "",
    fontStyle: "",
    size: "sm"
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
    seniorSearchStore: stores.seniorSearchStore,
}
}) @observer
class SeniorSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record:{},
            notLegal: new Map(),
            current: 1,
            columns:[{
                    title: <FormattedMessage id="js.com.Sen2.0001" defaultMessage="条件" />,
                    dataIndex: "condition",
                    key: "condition",
                    width: 100,
                },{
                    title: <FormattedMessage id="js.com.Sen2.0002" defaultMessage="操作符" />,
                    dataIndex: "operator",
                    key: "operator",
                    width: 100,
                    render: (text, record, index) => this.renderColumnsSelect(text, record, index)
                },{
                    title: <FormattedMessage id="js.com.Sen2.0003" defaultMessage="取值" />,
                    dataIndex: "value",
                    key: "value",
                    width: 200,
                    render: (text, record, index) => this.renderColumns(text, record, index, "value")
                },{
                    title: <FormattedMessage id="js.com.Sen2.0004" defaultMessage="操作" />,
                    dataIndex: "operation",
                    key: "operation",
                    width: 90,
                    render: (text, record, index) => {
                        return <i size='sm' className='uf uf-del del-btn' onClick={this.onTableDelete(index)}></i>
                    }
                }],
        };
        this.header =[]
        this.body = []
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onMenuSelect = this.onMenuSelect.bind(this);
        this.addToTable = this.addToTable.bind(this);
        this.resetTable = this.resetTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        this.ShowRefTableModal = this.ShowRefTableModal.bind(this)
        this.onComboxSelectChange = this.onComboxSelectChange.bind(this)
        this.setData = this.setData.bind(this)
    }

    setData(header, body){
        this.setState({
            header: header,
            body: body
        })
    }

    onChangeRangeDate = (value, index, column, record) => {
      const dateFormat = "YYYY-MM-DD";
      let begin = ''
      let end = ''
      if(value && value.length > 0){
        begin = moment(value[0]).format(dateFormat)
      }
      if(value && value.length > 1){
        end = moment(value[1]).format(dateFormat)
      }
      this.handleChange(begin, index, column, record, "begin")
      this.handleChange(end, index, column, record, "end")
      this.setState({
        filltime: value
      })
    }

    // 普通编辑框渲染
    renderColumns = (text, record, index, column) =>{
        const { getFieldProps, getFieldError } = this.props.form;
        const { notLegal } = this.state
        // let className = notLegal.get(record.key)? 'border-red': ''
        let className = [];
        if(record.errFlag || notLegal.get(record.key)){
            className= ["border-red"]
        }
        const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
        const dateFormat = "YYYY-MM-DD";
        const timeFormat = "HH:mm:ss";
        const dateInputPlaceholder = this.props.intl.formatMessage({id:"js.com.Sen2.0005", defaultMessage:"选择日期"});
        const timeInputPlaceholder = this.props.intl.formatMessage({id:"js.com.Sen2.0006", defaultMessage:"选择时间"});
        let _component;
        const _defaultComponet = <FormControl className = {className} value={record.value} onChange={(value) => this.handleChange(value, index, column, record)}/>
        let defaultDateValue = record.value? moment(record.value): ""
        let defaultTimeValue = record.value? moment(record.value,timeFormat): ""
        let _dateComponent;
        if(record.operator === 'js.com.Sen2.0014'){
            _dateComponent = <FormItem>
                                    <DatePicker
                                        format={dateFormat}
                                        className={className}
                                        showTime={false}
                                        onChange={(d) => {let v = d?moment(d).format(dateFormat):d; this.handleChange(v, index, column, record)}}//
                                        onOk={(d) => {let v = d?moment(d).format(dateFormat):d; this.handleChange(v, index, column, record)}}//
                                        // locale={dateLanguage}
                                        defaultValue={ defaultDateValue }
                                        placeholder={dateInputPlaceholder}
                                        showOk = { true }
                                    />
                                </FormItem>
        }else if(record.operator === 'js.com.Sen2.0015'){
            _dateComponent = <FormItem>
                                <div>
                                    <DatePicker
                                        format={dateFormat}
                                        className={className}
                                        showTime={false}
                                        onChange={(d) => {let v = d?moment(d).format(dateFormat):d; this.handleChange(v, index, column, record)}}//
                                        onOk={(d) => {let v = d?moment(d).format(dateFormat):d; this.handleChange(v, index, column, record)}}//
                                        // locale={dateLanguage}
                                        defaultValue={ defaultDateValue }
                                        placeholder={dateInputPlaceholder}
                                        showOk = { true }
                                    />
                                    </div>
                                </FormItem>
        }else if(record.operator === 'js.com.Sen2.0016'){
            _dateComponent = <FormItem>
                                <div>
                                    <div>
                                    <DatePicker
                                        format={dateFormat}
                                        className={className}
                                        showTime={false}
                                        onChange={(d) => {let v = d?moment(d).format(dateFormat):d; this.handleChange(v, index, column, record)}}//
                                        onOk={(d) => {let v = d?moment(d).format(dateFormat):d; this.handleChange(v, index, column, record)}}//
                                        // locale={dateLanguage}
                                        defaultValue={ defaultDateValue }
                                        placeholder={dateInputPlaceholder}
                                        showOk = { true }
                                    />
                                    </div>
                                    </div>
                                </FormItem>
        }
        let _dateTimeComponent;
        if(record.operator === 'js.com.Sen2.0014'){
        _dateTimeComponent = <FormItem>
                                <DatePicker
                                    format={dateTimeFormat}
                                    showTime={true}
                                    className={className}
                                    onChange={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record)}}//
                                    onOk={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record)}}//
                                    // locale={dateLanguage}
                                    defaultValue={ defaultDateValue }
                                    placeholder={dateInputPlaceholder}
                                    showOk = { true }
                                />
                            </FormItem>
        }else if(record.operator === 'js.com.Sen2.0015'){
            _dateTimeComponent = <FormItem>
                <div>
                                <DatePicker
                                    format={dateTimeFormat}
                                    showTime={true}
                                    className={className}
                                    onChange={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record)}}//
                                    onOk={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record)}}//
                                    // locale={dateLanguage}
                                    defaultValue={ defaultDateValue }
                                    placeholder={dateInputPlaceholder}
                                    showOk = { true }
                                />
                                </div>
                            </FormItem>
        }else if(record.operator === 'js.com.Sen2.0016'){
            _dateTimeComponent = <FormItem>
                <div><div>
                                <DatePicker
                                    format={dateTimeFormat}
                                    showTime={true}
                                    className={className}
                                    onChange={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record)}}//
                                    onOk={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record)}}//
                                    // locale={dateLanguage}
                                    defaultValue={ defaultDateValue }
                                    placeholder={dateInputPlaceholder}
                                    showOk = { true }
                                />
                                </div>
                                </div>
                            </FormItem>
        }
        let _timeComponent;
        if(record.operator === 'js.com.Sen2.0014'){
            _timeComponent = <FormItem>
                                <TimePicker
                                    format={timeFormat}
                                    className={className}
                                    onChange={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record)}}//
                                    onOk={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record)}}//
                                    // locale={dateLanguage}
                                    defaultValue={ defaultTimeValue }
                                    placeholder={timeInputPlaceholder}
                                />
                            </FormItem>
        }else if(record.operator === 'js.com.Sen2.0015'){
            _timeComponent = <FormItem>
                <div>
                                <TimePicker
                                    format={timeFormat}
                                    className={className}
                                    onChange={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record)}}//
                                    onOk={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record)}}//
                                    // locale={dateLanguage}
                                    defaultValue={ defaultTimeValue }
                                    placeholder={timeInputPlaceholder}
                                />
                                </div>
                            </FormItem>
        }else if(record.operator === 'js.com.Sen2.0016'){
            _timeComponent = <FormItem>
                <div><div>
                                <TimePicker
                                    format={timeFormat}
                                    className={className}
                                    onChange={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record)}}//
                                    onOk={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record)}}//
                                    // locale={dateLanguage}
                                    defaultValue={ defaultTimeValue }
                                    placeholder={timeInputPlaceholder}
                                />
                                </div></div>
                            </FormItem>
        }
        if(record.type == "date"){
            _component = _dateComponent
        }else if(record.type == "datetime"){
            _component = _dateTimeComponent
        }
        else if(record.type == "time"){
            _component = _timeComponent
        }
        else{
            _component = _defaultComponet
        }

        if(record.type === "boolean"){
            let isChecked = record.value === "1" || record.value == true? true: false
            _component = <Checkbox checked = { isChecked } onChange={(value) => this.handleChange(value, index, column, record)} />
        }
        else if(record.type === "ref"){
            let init = JSON.stringify({
                refpk: record.value
            })
            _component = (
                <MdmRefComp
                        value = { init }
                        className={className}
                        modalProps={{
                            backdropStyle: {
                                opacity: 0,
                                filter: 'alpha(opacity=0)'
                            }
                        }}
                        onChange = { (value)=> {this.onRefChange(value, index, column, record)}}
                        pk_entityitem={record.entity}
                        pk_gd={record.pk}
                        autofocus = { false}
                />
            )
        }else if(record.type == "combox"){
            _component =
                <Select
                value = { record.value }
                    className={className}
                    onSelect={(value) =>this.onComboxSelectChange(value, index, column, record, text)}
                    >
                    {
                        record.selectDataSource.map && record.selectDataSource.map((option) => (
                        <Option value={option.value} item={option} key={option.value}>{option.text}</Option>
                        )
                    )
                    }
                </Select>
        }
        else if(record.type === 'enum') {
            _component =
                <Select
                    className={className}
                    value = { text }
                    onSelect={(value) =>this.onComboxSelectChange(value, index, column, record)}
                    >
                    {
                        record.selectDataSource.map((option) => (
                        <Option value={option.value} item={option} key={option.value}>{option.text}</Option>
                    ))
                    }
                </Select>
        }
        else{
            //TODO 比较用symbol
            if(record.operator === `js.com.Sen2.0021` || (record.operator.props && record.operator === `js.com.Sen2.0021`)){
                if(record.type == "date"){
                    let defaultRangeDateValue = ["", ""]
                    if(record.value && record.value.length == 2 && record.value[0] && record.value[1]){
                        defaultRangeDateValue = [moment(record.value[0]), moment(record.value[1])]
                    }
                    _component =
                    (<div>
                            <RangePicker
                                className={className}
                                format={dateFormat}
                                placeholder={this.props.intl.formatMessage({id:"js.com.Sen2.0008", defaultMessage:"开始 ~ 结束"})}
                                dateInputPlaceholder={[this.props.intl.formatMessage({id:"js.com.Sen2.0009", defaultMessage:"开始"}), this.props.intl.formatMessage({id:"js.com.Sen2.0010", defaultMessage:"结束"})]}
                                showClear={true}
                                style={{width: 200}}
                                defaultValue ={ defaultRangeDateValue }
                                onChange={
                                  (v) => this.onChangeRangeDate(v, index, column, record)
                                }
                                renderFooter={()=>{
                                  return (
                                      <div></div>
                                  )
                                }}
                            />
                        {/* </FormItem> */}

                    </div>)
                }else if(record.type == "datetime"){
                    let defaultDateTimeValueBegin = ""
                    let defaultDateTimeValueEnd = ""
                    if(record.value){
                        if(record.value[0]){
                            defaultDateTimeValueBegin = moment(record.value[0])
                                ? moment(record.value[0])
                                : ""
                            }
                        if(record.value[1]){
                            defaultDateTimeValueEnd = moment(record.value[1])
                                ? moment(record.value[1])
                                : ""
                            }
                    }
                    _component =
                    (<div className="search-date-range-value">
                        <FormItem>
                            <Label>{<FormattedMessage id="js.com.Sen2.0011" defaultMessage="开始时间" />}</Label>
                            <DatePicker className='text-width-style'
                                format={dateTimeFormat}
                                showTime={true}
                                className={className}
                                onChange={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record, "begin")}}//
                                onOk={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record, "begin")}}//
                                // locale={dateLanguage}
                                defaultValue={ defaultDateTimeValueBegin }
                                placeholder={dateInputPlaceholder}
                            />
                        </FormItem>
                        <FormattedMessage id="js.com.Sen2.0012" defaultMessage="—" />
                        <FormItem>
                            <Label>{<FormattedMessage id="js.com.Sen2.0013" defaultMessage="结束时间" />}</Label>
                            <DatePicker className='text-width-style'
                                format={dateTimeFormat}
                                showTime={true}
                                className={className}
                                onChange={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record, "end")}}//
                                onOk={(d) => {let v = d?moment(d).format(dateTimeFormat):d;this.handleChange(v, index, column, record, "end")}}//
                                // locale={dateLanguage}
                                defaultValue={ defaultDateTimeValueEnd }
                                placeholder={dateInputPlaceholder}
                            />
                        </FormItem>
                    </div>)
                }
                else if(record.type == "time") {
                    let defaultTimeValueBegin = ""
                    let defaultTimeValueEnd = ""
                    if(record.value){
                        if(record.value[0]){
                            defaultTimeValueBegin = moment(record.value[0],timeFormat)
                        }
                        if(record.value[1]){
                            defaultTimeValueEnd = moment(record.value[1],timeFormat)
                        }
                    }

                    console.log('lyktest01' + record.value[0]);
                    console.log(defaultTimeValueBegin)
                    _component =
                    (<div className="search-date-range-value">
                        <FormItem>
                            <Label>{<FormattedMessage id="js.com.Sen2.0011" defaultMessage="开始时间" />}</Label>
                            <TimePicker className='text-width-style'
                                format={timeFormat}
                                //className={className}
                                onChange={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record, "begin")}}//
                                onOk={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record, "begin")}}//
                                // locale={dateLanguage}
                                defaultValue={ defaultTimeValueBegin }
                                placeholder={timeInputPlaceholder}
                            />
                        </FormItem>
                     <FormattedMessage id="js.com.Sen2.0012" defaultMessage="—" />
                        <FormItem>
                            <Label>{<FormattedMessage id="js.com.Sen2.0013" defaultMessage="结束时间" />}</Label>
                            <TimePicker className='text-width-style'
                                format={timeFormat}
                                //className={className}
                                onChange={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record, "end")}}//
                                onOk={(d) => {let v = d?moment(d).format(timeFormat):d;this.handleChange(v, index, column, record, "end")}}//
                                // locale={dateLanguage}
                                defaultValue={ defaultTimeValueEnd }
                                placeholder={timeInputPlaceholder}
                            />
                        </FormItem>
                    </div>)
                }
                else{
                    let classNameBegin = notLegal.get(record.key + "begin") || record.errFlag
                        ? "contain-form-ontrol-red"
                        : "contain-form-ontrol";
                    let classNameEnd = notLegal.get(record.key + "end") || record.errFlag
                        ? "contain-form-ontrol-red"
                        : "contain-form-ontrol";
                    _component =
                    (<div>
                        <FormControl className={ classNameBegin } value={record.value[0]} onChange={(value) => this.handleChange(value, index, column,record, "begin")}/>
                      <FormattedMessage id="js.com.Sen2.0012" defaultMessage="—" />
                        <FormControl className={ classNameEnd } value={record.value[1]} onChange={(value) => this.handleChange(value, index, column,record, "end")}/>
                    </div>)
                }
            }
        }
        return _component
    }

    /**
     * 表格参照模态框
     * @param {*} name 标识字段名称
     */
    async ShowRefTableModal(record) {
        const {grid} = this.props.seniorSearchStore.table
        await this.props.seniorSearchStore.getReference(record.pk, record.entity)
        await this.props.seniorSearchStore.getGrid(grid.fullclassname, grid.type, grid.pk_gd, grid.pk_entityitem, grid.refPkGd)
        this.props.seniorSearchStore.setTableModal(true)

        this.setState({
            header: this.props.seniorSearchStore.table.fieldref.header,
            body: this.props.seniorSearchStore.table.fieldref.body
        })
    }

    onComboxSelectChange = (value, index, column, record, text)=>{
        record.errFlag = false
        const { dataSource } = this.props.seniorSearchStore.table;
        const target = dataSource.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            target [column] = value
            if(record.selectDataSource.map){
                record.selectDataSource.map((option) => {
                    if(option.value ==  value){
                        target.refName = option.text
                    }
                })
            }
            this.props.seniorSearchStore.setTableData([...dataSource])
        }
    }

    handleChange = (value, index, column, record, between)=>{
        console.log('handleChangeFun')
        const { dataSource } = this.props.seniorSearchStore.table;
        const target = dataSource.filter((item,newDataIndex) => index === newDataIndex)[0];
        const { notLegal } =  this.state
        let suffixKey = between? between: ''
        let legalKey = record.key + suffixKey
        if(record.type == "integer"){
            // if(isNaN(value)){
            if(value % 1 === 0){
                notLegal.delete(legalKey)
            }else{
                notLegal.set(legalKey, value)
            }
            this.setState({
                notLegal: notLegal
            })
        }else if(record.type == "double"){
            let reg=/^[-\+]?\d+(\.\d+)?$/;
            if(!reg.test(value)){
                notLegal.set(legalKey, value)
            }else{
                notLegal.delete(legalKey)
            }
            this.setState({
                notLegal: notLegal
            })
        }
        if (target) {
            if(between){
                if(typeof(target[column]) == "string"){
                    target[column] = []
                }
                if(between === "begin"){
                    record.begin = value
                    target[column][0] = value
                    console.log('lyktest02' + record.begin);
                }
                else if(between === "end"){
                    record.end = value
                    if(!target[column][0]){
                        target[column][0] = ""
                    }
                    target[column][1] = value
                }
                // target[column] = [record.begin, record.end]
            }else{
                target[column] = value
            }
        this.props.seniorSearchStore.setTableData([...dataSource])
        }
        if(!this.isEmptyElement(record)){
            record.errFlag = false
        }
    }
    onRefChange = (value, index, column, record) => {
        const { dataSource } = this.props.seniorSearchStore.table;
        const target = dataSource.filter((item,newDataIndex) => index === newDataIndex)[0];

        if (target) {
            let val = JSON.parse(value);
            target [column] = val.refpk;
            target.refName = val.refname;
            this.props.seniorSearchStore.setTableData([...dataSource])
        }
    }

    renderColumnsSelect = (text, record, index) => {
        const { dataType } = this.props.seniorSearchStore.table
        let options = dataType[record.type].values;
        let defaultValue =  record.operator
            ? record.operator
            : dataType[record.type].default.props
            ? dataType[record.type].default.props.id
            : dataType[record.type].default
        let _options = [];
        {options?
            options.map((option,index) => (
                _options.push(<Option value={option.props.id} item={option} key={index}>{option}</Option>)
            ))
            : ''
        }
        return (record.type == 'boolean' ? "":
            <Select
              defaultValue={defaultValue}
              onSelect={this.onSelectChange(index, record, "operator", 'operator_name')}
            >
                {/* <Option value="">请选择</Option> */}
                {_options}
            </Select>
        )
    }

    // 下拉选择
    onSelectChange = (index, record, key, key_name) => {
        return (value, {props:{item}}) => {
            this.resetFormColumnValue(record)
            const { dataSource } = this.props.seniorSearchStore.table;
            const target = dataSource.filter((item,newDataIndex) => index === newDataIndex)[0];
            if (target) {
                target.operator = value;
                this.props.seniorSearchStore.setTableData([...dataSource])

            }
        };
    };

    //下拉联动删除值
    resetFormColumnValue = (record) =>{
        const { notLegal} = this.state
        notLegal.forEach(function(value, key){
            if(key.indexOf(record.key) != -1){
                notLegal.delete(key)
            }
        })
        record.begin = ""
        record.end = ""
        record.value = ""
        // record.selectDataSource = {}
    }

    // 删除表格行
    onTableDelete = (index) => {
        const { dataSource } = this.props.seniorSearchStore.table;
        const { notLegal} = this.state
        return () => {
        //删除state校验数据
        if(dataSource[index].key){
            notLegal.forEach(function(value, key){
                if(key.indexOf(dataSource[index].key) != -1){
                    notLegal.delete(key)
                }
            })
        }
          dataSource.splice(index, 1);
          this.props.seniorSearchStore.setTableData([...dataSource])
        }
    };

    open=()=>{
        this.props.seniorSearchStore.setSeniorModal(true)
    }

    //关闭模态框
    close=()=>{
        this.props.seniorSearchStore.setSeniorModal(false)
        this.props.closeFun();
        //this.props.seniorSearchStore.table.dataSource = []
    }

    /**
     * 拼接搜索条件
     */
    search=()=>{
        const { notLegal } = this.state
        if(notLegal.size > 0){
            Error("请输入正确的数据类型")
            return
        }
        let { dataSource } = this.props.seniorSearchStore.table;
        const { appendType, bothAll, needEscape } = this.props
        let results = ""
        let appendTypeResults = ''
        let defaultResults = ''
        let resulesAll = {};
        let delimiter = "; ";
        let type_dmt = "&";
        //dataSource = this.filterDataSource(dataSource)
        this.props.seniorSearchStore.setTableData(dataSource)
        let errFlag = false;
        if(appendType || bothAll){
            results = ""
            const javaOperators = {
                'js.com.Sen2.0014' : '==',
                'js.com.Sen2.0015' : '>',
                'js.com.Sen2.0016' : '<',
                'js.com.Sen2.0017': '!=',
                'js.com.Sen2.0018': '>=',
                'js.com.Sen2.0019': '<=',
                'js.com.Sen2.0020': 'like',
            }

            dataSource.forEach(element => {
                let{ type, operator, value, key } = element
                element.errFlag = false
                if(this.isEmptyElement(element)){
                    element.errFlag = true
                    errFlag = true;
                    return
                }
                //单引号转换成两个单引号
                element = this.replaceSinglequotes(element)
                //value = value.replace(new RegExp('\'','gm'),'\'\'')
                if(element.type == "ref" || element.type == "combox" || element.type == "enum"){
                    value = value + "|" + element.refName
                }
                const { dataSource } = this.props.seniorSearchStore.table
                if(type == 'boolean') {
                    if(value)
                        results = results + key + " == 1" + type_dmt + type + delimiter;
                    else
                        results = results + key + " == 0" + type_dmt + type + delimiter;
                }
                else if(operator == "js.com.Sen2.0020") {
                    if(value != '')
                        results = results + key + " like " + value + type_dmt + type + delimiter;
                }
                else if(operator == "js.com.Sen2.0021") {
                    let begin = element.value[0]//element.begin? element.begin: element.value[0]
                    let end = element.value[1]//element.end? element.end: element.value[1]
                    if(type != 'integer' && type != 'double'){
                        if(type == "date"){
                            if(!begin)
                                begin  = moment().format("YYYY-MM-DD")
                            if(!end)
                                end  = moment().format("YYYY-MM-DD")
                        }else if(type == "datetime"){
                            if(!begin)
                                begin  = moment().format("YYYY-MM-DD HH:mm:ss")
                            if(!end)
                                end  = moment().format("YYYY-MM-DD HH:mm:ss")
                        }
                        else if(type == "time"){
                            if(!begin)
                                begin  = moment().format("HH:mm:ss")
                            if(!end)
                                end  = moment().format("HH:mm:ss")
                        }
                        //begin = "'" + begin + "'"
                        //end = "'" + end + "'"
                    }

                    if(begin == '' && end != '') {
                        results = results + key + " <= " + begin + type_dmt + type + delimiter;
                    }
                    else if(begin != '' && end == '') {
                        results = results + key + " >= " + begin + type_dmt + type + delimiter;
                    }
                    else if(begin != '' && end != '') {
                        results = results + key + " >= " + begin + type_dmt + type + delimiter + key + " <= " + end + type_dmt
                        + type + delimiter;
                    }
                }
                // else if(operator == "js.com.Sen2.0017" && type != 'ref' && type != 'combox') {
                //     results = results + key + " <> " + value + type_dmt + type + delimiter;
                // }
                else {
                    if(type == "date"){
                        if(!value)
                            value  = moment().format("YYYY-MM-DD")
                    }
                    else if(type == "datetime"){
                        if(!value)
                            value  = moment().format("YYYY-MM-DD HH:mm:ss")
                    }
                    else if(type == "time"){
                        if(!value)
                            value  = moment().format("HH:mm:ss")
                    }
                    if(value != '') {
                        //此处不需要处理类型，后台进行处理
                        let stringValue
                        if(type != 'integer' && type != 'double')
                            stringValue = "'" + value + "'";
                        else{
                            stringValue = value;
                        }

                        if(operator == "js.com.Sen2.0017") {
                            results = results + key + " <> " + value + type_dmt + type + delimiter;
                        }else{
                            results = results + key + " " + javaOperators[operator] + " " + value + type_dmt + type + delimiter;
                        }
                    }
                }
            });

            appendTypeResults = results;
            if(bothAll){
                resulesAll.appendTypeResults = results;
            }
        }
        if(!appendType || bothAll){
            results = ""
            let operators = {
                'js.com.Sen2.0014' : '=',
                'js.com.Sen2.0015' : '>',
                'js.com.Sen2.0016' : '<',
                'js.com.Sen2.0017': '!=',
                'js.com.Sen2.0018': '>=',
                'js.com.Sen2.0019': '<='
            }
            dataSource.forEach(element => {
                let{ type, operator, value, key } = element
                element.errFlag = false
                if(this.isEmptyElement(element)){
                    element.errFlag = true
                    errFlag = true;
                    return
                }

                //单引号转换成两个单引号
                // if(typeof(value) == "string"){
                //     value = value.replace(new RegExp('\'','gm'),'\'\'')
                // }
                element = this.replaceSinglequotes(element)
                console.log(operator)
                if(type == 'boolean') {
                    if(value)
                        results = results + key + "=1 and ";
                    else
                        results = results + key + "=0 and ";
                }
                //包含
                else if(operator == "js.com.Sen2.0020") {
                    if(value != ''){
                        let ret = this.escapeSql(element.value)
                        if(ret.flag){
                            results = results + key + " like '%" + ret.value + "%'" + " ESCAPE \'$\' and ";
                        }else{
                            results = results + key + " like '%" + ret.value + "%' and ";
                        }
                    }
                }
                //介于
                else if(operator == "js.com.Sen2.0021") {
                    let begin = element.begin
                    let end = element.end
                    if(type != 'integer' && type != 'double'){
                        if(type == "date"){
                            if(!begin)
                                begin  = moment().format("YYYY-MM-DD")
                            if(!end)
                                end  = moment().format("YYYY-MM-DD")
                        }else if(type == "datetime"){
                            if(!begin)
                                begin  = moment().format("YYYY-MM-DD HH:mm:ss")
                            if(!end)
                                end  = moment().format("YYYY-MM-DD HH:mm:ss")
                        }
                        else if(type == "time"){
                            if(!begin)
                                begin  = moment().format("HH:mm:ss")
                            if(!end)
                                end  = moment().format("HH:mm:ss")
                        }
                        begin = "'" + begin + "'"
                        end = "'" + end + "'"
                    }

                    if(begin == '' && end != '') {
                        results = results + key + " <= " + begin + " and ";
                    }
                    else if(begin != '' && end == '') {
                        results = results + key + " >= " + begin + " and ";
                    }
                    else if(begin != '' && end != '') {
                        results = results + key + " between " + begin + " and " + end + " and ";
                    }
                }
                //不等于
                // else if(operator == "js.com.Sen2.0017" && type != 'ref' && type != 'combox') {
                //     results = results + key + "<>" + value + " and ";
                // }
                else {
                    if(type == "date"){
                        if(!value)
                            value  = moment().format("YYYY-MM-DD")
                    }
                    else if(type == "datetime"){
                        if(!value)
                            value  = moment().format("YYYY-MM-DD HH:mm:ss")
                    }
                    else if(type == "time"){
                        if(!value)
                            value  = moment().format("HH:mm:ss")
                    }
                    if(value != '') {
                        let stringValue = ""
                        if(type != 'integer' && type != 'double')
                            stringValue = "'" + value + "'";
                        else{
                            stringValue = value;
                        }

                        if(operator == "js.com.Sen2.0017") {
                            results = results + key + " <> " + stringValue+ " and ";
                        }else{
                            results = results + key + " " + operators[operator] + " " + stringValue + " and ";
                        }
                    }
                }
            });
            if(results != '')
            results = results.substring(0, results.length - 5);

            defaultResults = results;
            if(bothAll){
                resulesAll.defaultResults = results;
            }
        }
        // this.props.seniorSearchStore.table.dataSource = []
        if(errFlag){
            Error("请输入")
            this.forceUpdate()
            return
        }
        if(appendType){
            results = appendTypeResults
        }else{
            results = defaultResults
            if(needEscape){
                results = encodeURI(results)
                // results = escape(results)
            }
        }
        this.props.seniorSearchStore.setSql(results)
        if(bothAll){
            this.props.getData(resulesAll);
        }else{
            this.props.getData(results);
        }
        this.props.seniorSearchStore.setSeniorModal(false)

    }

    escapeSql = (value) =>{
        let ret = {
            value: '',
            flag: false
        }

        if(value.indexOf('_') != -1){
            ret.flag = true
            value = value.replace(new RegExp('_','gm'),'$_')// + " ESCAPE \'$\'"
        }else if(value.indexOf('%') != -1){
            ret.flag = true
            value = value.replace(new RegExp('%','gm'),'$%')// + " ESCAPE \'$\'"
        }
        ret.value = value
        return ret
    }

    filterDataSource = (datasource) => {
        return datasource.filter(function(item, index){
            if(item.value !== "" && item.value !== []){
                return item
            }
        })
    }

    isEmptyElement =(element) =>{
        if(element.value === ""){
            return true
        }
        if(element.operator == "js.com.Sen2.0021"){
            if(element.value.length < 2){
                return true
            }else{
                if(element.value[0] == "" || element.value[1] == ""){
                    return true
                }
            }
        }
        return false
    }

    replaceSinglequotes =(element) =>{
        let { value } = element
        if(typeof(value) == "string"){
            element.value = value.replace(new RegExp('\'','gm'),'\'\'')
        }else{
            if(element.operator == "js.com.Sen2.0021"){
                if(value[0] && typeof(value[0]) == "string"){
                    element.value[0] = value[0].replace(new RegExp('\'','gm'),'\'\'')
                }
                if(value[1] && typeof(value[1]) == "string"){
                    element.value[1] = value[1].replace(new RegExp('\'','gm'),'\'\'')
                }
            }
        }
        return element
    }

    /**
     * 清空Table数据源。
     */
    resetTable = ()=>{
        const { dataSource } = this.props.seniorSearchStore.table;
        dataSource.length = 0;
        this.props.seniorSearchStore.setTableData([...dataSource])
    }

    /**
     * 点击左侧菜单项
     */
    clickMenuItem = (e) => {
        count += 1;
        setTimeout(() => {
            if (count === 2) { //双击
                this.addToTable();
            }
            count = 0;
        }, 300);
        this.setState({
            current: e.key,
        });
    }

    /**
     * 获取当前选中行的item对象。
     * @param {*} item
     */
    onMenuSelect({item,key,selectedKeys}){
        // console.log(`key:${key} selected`) //获取key
        let currentObject = {}
        currentObject.value = item.props.children //获取选中对象的数据
        currentObject.key = item.props.eventKey
        currentObject.type = item.props.type
        currentObject.pk = this.props.match.params.id || item.props.pk
        currentObject.entity = item.props.entity
        this.props.seniorSearchStore.setMenuSelected(currentObject);
    }

    /**
     * 将已选的item对象添加到表格行
     */
    async addToTable() {
        let _selected = this.props.seniorSearchStore.menu.selected
        if(!_selected.value){
            Error(this.props.intl.formatMessage({id:"js.con.edi.0017", defaultMessage:"请选择"}))
            return
        }
        const { dataSource, dataType } = this.props.seniorSearchStore.table
        let isExist = dataSource.find(item => item.key === _selected.key)
        let operator = dataType[_selected.type].default.props
            ? dataType[_selected.type].default.props.id
            : dataType[_selected.type].default
        if(!isExist)
        {
            if(_selected.type == "combox"){
                await this.props.seniorSearchStore.getCombox(_selected.pk, _selected.entity)
            }
            else if(_selected.type === 'enum'){
                await this.props.seniorSearchStore.getEnum(_selected.pk, _selected.entity)
            }
            const { selectDataSource } = this.props.seniorSearchStore.table
            const newData = {
                key: _selected.key,
                condition: _selected.value,
                operator: operator,
                value: _selected.type == "boolean"? false: '',
                type: _selected.type,
                pk: _selected.pk,
                entity: _selected.entity,
                selectDataSource: selectDataSource
            };
            this.props.seniorSearchStore.setTableData([...dataSource, newData])
        }
    }

    initConditionControl = (initCondition) =>{
        if(!initCondition || initCondition === ''){
            return
        }
        const { info } = this.props.seniorSearchStore.menu
        const javaOperators = {
            '==' : 'js.com.Sen2.0014',
            '>' : 'js.com.Sen2.0015',
            '<' : 'js.com.Sen2.0016',
            '<>': 'js.com.Sen2.0017',
            '>=': 'js.com.Sen2.0018',
            '<=': 'js.com.Sen2.0019',
            'like': 'js.com.Sen2.0020'
        }

        const DELIMITOR = ";", TYPE_DELIMITOR = "&"
        initCondition = initCondition.replace(/(^\s*)|(\s*$)/g, "")
        let datas = initCondition.split(DELIMITOR)
        let maps = new Map()
        datas.forEach( async (item) => {
            if(item.length > 0){
                let rowData = item.split(TYPE_DELIMITOR)
                let keyValue = rowData[0], javaDataType = rowData[1]
                keyValue = keyValue.replace(/(^\s*)|(\s*$)/g, "")
                let arrayKeyValue = keyValue.split(' ')
                if(arrayKeyValue.length >= 3){
                    //字符串解析的运算逻辑
                    let key = arrayKeyValue[0], logical = arrayKeyValue[1], value = arrayKeyValue[2]
                    if(arrayKeyValue.length == 4){
                        value += " " + arrayKeyValue[3]
                    }
                    let entity;
                    // if(key === 'mdm_code') {
                    //     entity = {
                    //         name:'mdm_code',
                    //         code:'mdm_code',
                    //         type:'string'
                    //     }
                    // }
                    entity = info.filter(item => item.code === key)[0]
                    let operator = javaOperators[logical]
                    if(!maps.get(key)){
                        maps.set(key, value)
                    }
                    else{
                        //处理“区间”这种情况
                        let value1 = maps.get(key)
                        value = [value1, value]
                        operator = "js.com.Sen2.0021"
                        this.props.seniorSearchStore.remodeLastData()
                    }
                    if(!entity)return;
                    if(entity.type == "combox"){
                        await this.props.seniorSearchStore.getCombox(entity.pk_gd, entity.pk_entityitem)
                    }
                    else if(entity.type === 'enum'){
                        await this.props.seniorSearchStore.getEnum(entity.pk_gd, entity.pk_entityitem)
                    }
                    // else if(entity.type === 'ref'){
                    //     this.props.seniorSearchStore.getRef(entity.pk_gd, entity.pk_entityitem)
                    // }
                    //处理下拉,枚举,参照,直转换
                    let refName = ""
                    if(entity.type == "ref" || entity.type == "combox" || entity.type == "enum"){
                        let typeValues = value.split('|')
                        if(typeValues.length == 2){
                            value = typeValues[0]
                            refName = typeValues[1]
                        }else if(typeValues.length > 2){
                            let strLentth = value.indexOf("|");
                            refName = value.substring(strLentth + 1 ,value.length)
                            value = value.substring(0,strLentth)
                        }
                    }
                    const { selectDataSource } = this.props.seniorSearchStore.table
                    const newData = {
                        key: entity.code,
                        condition: entity.name,
                        operator: operator,
                        value: value,
                        type: entity.type,
                        pk: entity.pk_gd,
                        entity: entity.pk_entityitem,
                        selectDataSource: selectDataSource,
                        refName: refName
                    };
                    const { dataSource } = this.props.seniorSearchStore.table
                    this.props.seniorSearchStore.setTableData([...dataSource, newData])
                }
            }
          });
    }

    async componentDidMount() {

        const {pk_gd, pk_category,entitycode,url} = this.props
        this.props.seniorSearchStore.table.dataSource = []
        if(pk_gd ){
            await this.props.seniorSearchStore.getMenuData(pk_gd, pk_category,url)
            this.initConditionControl(this.props.initCondition)
        }
        if(entitycode){
            await this.props.seniorSearchStore.getMenuDataByEntityCode(entitycode)
            this.initConditionControl(this.props.initCondition)
        }
        if(this.props.autoShow){
            this.open();
        }
    }

    render() {
        const { children,className,form,resetName,searchName,title, disabled, size } = this.props;
        const { columns } = this.state;
        const { modal, table, menu } = this.props.seniorSearchStore;
        let classes = 'search-panel';
        if(className){
            classes += ' '+className
        }
        let _menu = () => {
            return (
                <Menu onClick={this.clickMenuItem} selectedKeys={[this.state.current]} mode="inline" onSelect={this.onMenuSelect}>
                    {/* <Menu.Item key={"mdm_code"} type={"string"} pk={""} entity={""}>mdm_code</Menu.Item> */}
                    {menu.info && menu.info instanceof Array ? menu.info.map((_item,index)=>{
                        return (
                            <Menu.Item key={_item.code} type={_item.type} pk={_item.pk_gd} entity={_item.pk_entityitem}>{_item.name}</Menu.Item>
                        )
                    }) : ''}
                </Menu>
            )
        }
        let _table = () => {
            return (
                <Table
                    columns={columns}
                    data={table.dataSource}
                />
            )
        }
        let buttonFun = () => {
            if(!this.props.autoShow){
                return this.props.fontStyle === 'icon' ? (
                    <Icon
                      type="uf-pencil"
                      disabled={disabled}
                      onClick={this.open}
                    />
                  ) : (
                    <Button
                      disabled={disabled}
                      size= {size}
                    //   colors="primary"
                      onClick={this.open}>
                      { title }
                    </Button>
                  )
            }
            return null
        }
        return (
            <div className="senior-search-panel">
                {
                    buttonFun()
                }
                <Modal
                    className="senior-search-modal 123"
                    show={modal.showModal}
                    onHide={this.close}
                    style={{width: 890}}
                    autoFocus={false}
                    enforceFocus={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{ title }</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Row>
                            <Col md={3}>
                                <Label>{<FormattedMessage id="js.com.Sen2.0022" defaultMessage="待选条件：" />}</Label>
                                <div>
                                    {_menu()}
                                </div>
                            </Col>
                            <Col md={2} className="select-btn">
                                <Button  onClick={this.addToTable} style={{marginBottom:20}}><FormattedMessage id="js.com.Sen2.0023" defaultMessage="添加" /></Button>
                                <Button bordered  onClick={this.resetTable}><FormattedMessage id="js.com.Sen2.0024" defaultMessage="重置" /></Button>
                            </Col>
                            <Col md={7}>
                                <Label>{<FormattedMessage id="js.com.Sen2.0025" defaultMessage="已选条件：" />}</Label>
                                <div className='senior-search-table'>
                                    {_table()}
                                </div>
                            </Col>
                        </Row>

                    </Modal.Body>

                    <Modal.Footer className="text-center">
                        <Button bordered style={{ marginRight: 20 }} onClick={this.close}>{resetName?resetName:<FormattedMessage id="js.com.Sen2.0026" defaultMessage="取消" />}</Button>
                        <Button onClick={this.search}>{searchName?searchName:<FormattedMessage id="js.com.Sen2.0027" defaultMessage="确定" />}</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
SeniorSearch.propTypes = propTypes;
SeniorSearch.defaultProps = defaultProps;
export default injectIntl(Form.createForm()(SeniorSearch), {withRef: true});
