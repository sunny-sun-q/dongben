import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react'
import { Switch, InputNumber, Col, Row,FormControl, Label, Radio } from "tinper-bee";
import Select from 'bee-select';
import Form from 'bee-form';
import {DatePicker} from 'components/tinper-bee';
import TimePicker from "tinper-bee/lib/Timepicker";
import 'bee-datepicker/build/DatePicker.css';
import SearchPanel from 'components/SearchPanel';
import MdmRefComp from 'components/mdmRef';
const FormItem = Form.FormItem;
const Option  = Select.Option;
import moment from "moment";
import {
    inject,
    observer
} from 'mobx-react';
import './index.less'
import store from '../../../../../../system-management/system-log/stores/store';
import { seniorSearchStore } from '../../../../../../model-management/auth-model/stores/store';

class DataMaintenanceForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            orderType: '',
            orderDeptName: '',
            orderNo: '',
            refKeyArraydeptCheckBy:"",
            orderGoodsCount: '',
            refKeyArrayorderBy:"",
            orderGoods: '',
            remark: '',
            deptCheckByName: '',
            refKeyArrayorderDept:"",
            orderAmount: '',
            orderByName: '',
            orderDate: '',
            orderName: '',
            condition: '',
            selection: {}
        };
        this.temp = {}; // 中间变量,用来保存时间格式
    }
    componentWillMount(){

    }
    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error,values) => {
        this.props.form.validateFields(async (err, values) => {
            console.log(this.temp);
            for(let item in this.temp){
                if(values[item]){
                    values[item] = moment(values[item]).format(this.temp[item]);
                }
            }

            console.log("查询：", values)
            let tempCondition = this.getSearchCondition(values);
            this.props.search(encodeURI(tempCondition));
        });


    }

    getSearchCondition = (valueObj) =>{
        let res = [];
        for(let item in valueObj){
            if(item.match(/^\$ref\$_(.*)/) && valueObj[item]!==''){
                let name = item.match(/^\$ref\$_(.*)/)[1];
                let obj = JSON.parse(valueObj[item]);
                if(obj.refpk){
                    res.push(`${name} = '${obj.refpk}'`)
                }
            }
            else if(valueObj[item]!==''){
                res.push(`${item} like '%${valueObj[item].replace(new RegExp('\'','gm'),'\'\'')}%'`)
            }
        }
        return res.join(' and ');
    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            orderType:'',
            orderDeptName:'',
            orderNo:'',
            refKeyArraydeptCheckBy:'',
            deptCheckBy:'',
            orderGoodsCount:'',
            refKeyArrayorderBy:'',
            orderBy:'',
            orderGoods:'',
            remark:'',
            deptCheckByName:'',
            refKeyArrayorderDept:'',
            orderDept:'',
            orderAmount:'',
            orderByName:'',
            orderDate:'',
            orderName:'',
            dealArr: []
        })
    }

    seniorSearch = (value) => {
        this.props.search(value);
    }

    getSelectionInfo = async ( value ) => {
        // 只在第一次点击时请求数据
        // console.log(value)
        if(!this.state.selection[value.fieldId]) {
            let pk_entityitem = value.pk_entityitem;
            await this.props.dataEditStore.getSelectionData(this.props.match.params.id, pk_entityitem ,value.fieldId);
            // console.log(this.props.match.params.id, value.pk_entityitem ,value.fieldId);
            this.setState({
                selection: this.props.dataEditStore.selectionData
            })
        }
    }

    getEnumInfo = async (value) => {
        if(!this.state.selection[value.fieldId]) {
            let pk_entityitem = value.pk_entityitem;
            await this.props.dataEditStore.getEnumData( pk_entityitem, value.fieldId);
            // console.log(this.props.match.params.id, value.pk_entityitem ,value.fieldId);
            this.setState({
                selection: this.props.dataEditStore.selectionData
            })
        }
    }

    // 动态渲染搜索项目列表
    renderSearchList = (header, func ) => {
        return header.map(item =>{
            if(!item.fieldType)return null;
            return (
                <Col md={3} xs={6}>
                    <FormItem>
                        <Label>
                            {item.text}
                        </Label>
                        <div className='item-detail'>
                            {this.renderSearchListHelper(item, func, )}
                        </div>

                    </FormItem>
                </Col>
            )
        })
    }

    renderSearchListHelper = (item, func) => {
        // console.log(item);
        let self = this;
        switch (item.fieldType) {
            case 1:     // 字符     string
            case 9:     // 图片
            case 10:     // 附件
            case 11:     // 大文本
                {
                    return (
                        <FormControl
                            {
                            ...func(item.fieldId, {
                                initialValue: '',
                            })
                            }
                        />
                    )
                }
            case 2:     // 整型     number
            case 4:     // 浮点
                {
                    return (
                        <FormControl
                            {
                            ...func(item.fieldId, {
                                initialValue: '',
                            })
                            }
                        />
                    )
                }
            case 3:     // 布尔
            {
                return (
                    <Select
                        {
                        ...func(item.fieldId, {
                            initialValue: '',

                        })
                        }
                    >
                        <Option key='0' value=""><FormattedMessage id="js.com.Sea2.0002" defaultMessage="请选择" /></Option>
                        <Option key='1' value="1"><FormattedMessage id="js.com.Sea2.0003" defaultMessage="是" /></Option>
                        <Option key='2' value="0"><FormattedMessage id="js.com.Sea2.0004" defaultMessage="否" /></Option>
                    </Select>
                )
            }
            case 5:     // 日期
                {
                    this.temp[item.fieldId] = "YYYY-MM-DD";
                    return (
                        <DatePicker
                            {
                            ...func(item.fieldId, {
                                initialValue: '',
                            })
                            }
                            format="YYYY-MM-DD"
                        />
                    )
                }
            case 6: {    // 日期时间
                this.temp[item.fieldId] = "YYYY-MM-DD HH:mm:ss";
                return (
                    <DatePicker
                        {
                        ...func(item.fieldId, {
                            initialValue: '',
                        })
                        }
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime={true}
                    />
                )
            }
            case 12:{    // 时间
                this.temp[item.fieldId] = 'HH:mm:ss';
                return (
                    <TimePicker
                        {
                        ...func(item.fieldId, {
                            initialValue: '',
                        })
                        }
                        format="HH:mm:ss"
                    />
                )
            }
            case 8:     // 下拉 combox
            {
                return (
                    <Select
                        {
                        ...func(item.fieldId, {
                            initialValue: '',

                        })
                        }
                        onFocus = { ()=>self.getSelectionInfo(item)}
                    >
                        <Option key="" value="" ><FormattedMessage id="js.com.Sea2.0002" defaultMessage="请选择" /></Option>

                        {
                            this.renderSelectionList(item)
                        }
                    </Select>
                )
            }
            case 7:     // 参照
                {
                    return (
                        <MdmRefComp
                            {...func(`$ref$_${item.fieldId}`, {
                                initialValue: '',
                            })
                            }
                            pk_entityitem={item.pk_entityitem}
                            pk_gd={ this.props.match.params.id}
                        />
                    )
                }
            case 13: {  // 枚举类型
                return (
                    <Select
                        {
                        ...func(item.fieldId, {
                            initialValue: '',
                        })
                        }
                        onFocus = { ()=>self.getEnumInfo(item)}
                    >
                        <Option key="" value="" ><FormattedMessage id="js.com.Sea2.0002" defaultMessage="请选择" /></Option>

                        {
                            this.renderSelectionList(item)
                        }
                    </Select>
                )
            }
            default:
                return (
                    // <FormControl
                    //     {
                    //     ...func(item.fieldId, {
                    //         initialValue: '',
                    //     })
                    //     }
                    // />
                    null

                );
        }
    }

    renderSelectionList = (item ) => {

        if(this.state.selection[item.fieldId]){
            return this.state.selection[item.fieldId].map( (items ) => {
                return (
                    <Option key={items.value} value={items.value}>{items.text}</Option>
                )
            })
        }
        return null;
    }

    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let extraBtn = {
            name : this.props.intl.formatMessage({id:"js.com.Sea2.0005", defaultMessage:"高级查询"}),
            func : this.seniorSearch
        }


        // array 表头信息
        // let header = this.props.dataMaintainStore.realTable.header;
        let header = this.props.dataMaintainStore.modelInfo && this.props.dataMaintainStore.modelInfo.entitys[0].body;
        // console.log(header)
        let searchItems = [{
            fieldId: "mdm_code",
            fieldType: 1,
            text: "MDMCODE",
            width: 100,
        }];
        header.map(item =>{

            if( item && item.queryatt ) {   // item.queryatt
                searchItems.push({
                    fieldId:item.code,
                    fieldType:item.fieldtype,
                    text:item.name,
                    width: item.fieldlength,
                    pk_entityitem: item.pk_entityitem
                });
            }
        })
        if(searchItems.length === 1) {
            return null;
        }
        return (
            <SearchPanel
                    className='data-maintenance-form'
                    form={self.props.form}
                    reset={self.reset}
                    search={self.search}
                    extra = { extraBtn }
                    pk_gd = { self.props.match.params.id}
                    >
                <Row className='search-area-content'>
                    {self.renderSearchList(searchItems, getFieldProps )}
                </Row>
            </SearchPanel>
        )
    }
}

export default injectIntl(Form.createForm()(DataMaintenanceForm), {withRef: true});
