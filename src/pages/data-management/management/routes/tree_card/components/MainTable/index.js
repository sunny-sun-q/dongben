import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React,{Component, Children} from 'react';
import { FormControl, Form, Row, Col, Label, Icon, Tooltip ,Modal } from 'tinper-bee';
import Upload from 'bee-upload'
import Select from 'bee-select';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DatePicker } from 'components/tinper-bee';
import TimePicker from "tinper-bee/lib/Timepicker";
import moment from "moment";
import MdmRefComp from 'components/mdmRef';
import './index.less'
import { Error, success, Warning } from 'utils/index';
const regInt = /^-?(([1-9]\d*)|0)$/;
const regFloat = /^-?(([1-9]\d*)|0)(\.\d*)?$/;
const Option = Select.Option;
const regPicture = /(\.png$)|(\.jpg$)|(\.gif$)/;
import {Button} from 'components/tinper-bee';
const modalInfo = {
    '':{
        title: ``,
        desc: ``,
        confirm: ``,
    },
    'file':{
        title: <FormattedMessage id="js.rou.hom.00366" defaultMessage="文件下载" />,
        desc: <FormattedMessage id="js.rou.hom.00367" defaultMessage="是否下载文件" />,
        confirm:<FormattedMessage id="js.com.Car.0010" defaultMessage="下载" />,
    },
    'picture':{
        title: <FormattedMessage id="js.rou.hom.00369" defaultMessage="图片预览/下载" />,
        desc: <FormattedMessage id="js.rou.hom.00368" defaultMessage="是否下载图片" />,
        confirm: <FormattedMessage id="js.com.Car.0010" defaultMessage="下载" />,
    }
}
@withRouter
@inject((stores) => {
    return {
        cardStore: stores.cardStore,
    }
})
@observer class MainTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectionData : {}, // 下拉信息
            selection : {},
            fileList : {},
            tipsShow : false,   // 是否显示tips
            loadInfo : {},
            searchInfo : [], // 社会化配置 下拉选项
            modalType : '', // file  picture
            downloadUrl : ``,
            finalUrl : ``,
        }
        this.editLegal = {};
        this.errorTips = {
            required:  this.props.intl.formatMessage({ id: "js.com.Mai.0022", defaultMessage: "该项是必填项" }) ,
            errorTips:this.props.intl.formatMessage({ id: "js.com.Mai.0019", defaultMessage: "文件上传错误,提示:" }) ,
            errorInteger: this.props.intl.formatMessage({ id: "js.com.Mai.0013", defaultMessage: "请输入整数" }) ,
            errorFloat: this.props.intl.formatMessage({ id: "js.com.Mai.0014", defaultMessage: "请输入浮点数" }) ,
            errorReg: this.props.intl.formatMessage({ id: "js.com.Mai.0023", defaultMessage: "不符合匹配规则,提示:" }) ,
            errorPic: this.props.intl.formatMessage({ id: "js.com.Mai.0020", defaultMessage: "请上传png,jpg或gif格式的图片" }) ,
            errorFile: this.props.intl.formatMessage({ id: "js.com.Mai.0021", defaultMessage: "请上传非png,jpg和gif格式的文件" }) ,
          }
    }

    componentWillMount  ()  {

    }

    componentDidMount (){
        this.setState({
            loadInfo : {...this.props.store.loadInfo}
        })
    }
    componentWillReceiveProps (nextProps){
        if(nextProps.showTips === true){
            this.setState({
                tipsShow : true
            })
        }
    }
    setDefault = ( value,e,item ) => {
        if(!this.props.store.loadInfo[item.code]){
            this.props.store.loadInfo[item.code] = item.defaultvalue;
            this.setState({
                loadInfo : {...this.state.loadInfo,[item.code]:item.defaultvalue}
            })
        }
    }
    onInputChange = (code) => {
        return (value) => {
            console.log(value)
            this.props.store.loadInfo[code] = value;
            let temp = {};
            temp[code] = value;
            this.setState({
                loadInfo : {...this.state.loadInfo,[code]:value}
            })

        }
    }

    onBoolChange = (code) => {
        return (value) => {
            this.props.store.loadInfo[code] = value;
            this.setState({
                loadInfo : {...this.state.loadInfo,[code]:value}
            })
        }
    }

    onDateChange = (code, format ) => {

        return (value) => {
            let info = value ? moment(value).format(format) : '';
            this.props.store.loadInfo[code] = info;
            this.setState({
                loadInfo : {...this.state.loadInfo,[code]:info}
            })
        }
    }



    onRefChange = ( code ) => {
        return ( v ) => {
            let obj = v[0] || 'empty';
            // let obj = JSON.parse(value);
            this.props.store.loadInfo[`$ref$${code}`] = obj;
            this.setState({
                loadInfo : {...this.state.loadInfo,[code]:obj}
            })
        }
    }

    onSelectChange = ( item ) => {
        return ( value, record ) => {
            this.props.store.loadInfo[item.code] = value;
            this.props.store.loadInfo[`${item.code}_name`] = record.props.children;
            this.setState({
                selection : {...this.state.selection,[item.code]:value,[`${item.code}_name`]: record.props.children}
            })
        }
    }

    getSelectionInfo = async ( code , pk_entityitem) => {
        //只在第一次点击时请求数据
        // if (!this.props.store.selectionData[pk_entityitem + code]) {
            await this.props.store.getSelectionData(this.props.pk_gd, pk_entityitem, code);
        // }
        this.setState({
            selectionData: this.props.store.selectionData
        })

    }
    getEnumInfo = async ( code , pk_entityitem) => {
        //只在第一次点击时请求数据
        // debugger
        console.log(this.props.store.selectionData)
        // if (!this.props.store.selectionData[pk_entityitem + code]) {
            await this.props.store.getEnumData(pk_entityitem, code);
        // }
        this.setState({
            selectionData: this.props.store.selectionData
        })

    }

    renderSelection = ( arr ) => {
        if(arr){
            return arr.map( (item) => {
                return (
                    <Option key={item.value} value={item.value}>{item.text}</Option>
               )
            })
        }
    }

    handleChangeFile = ( info ,item ) => {
        if (info.file.status === 'done') {
            this.props.store.loadInfo[item.code] = info.file.response.file;
            let temp = {};
            temp[item.code] = info.file.response.file;
            this.setState({
                loadInfo : {...this.state.loadInfo,[item.code]:info.file.response.file}
            })

        }
    }

    onRemoveFile = ( item )=> {
        console.log(item);
        this.props.store.loadInfo[item.code] = null;
        // this.props.store.loadInfo[`_file_${item.code}`] = null;
        this.setState({
            loadInfo : {...this.state.loadInfo,[item.code]:''}
        })
    }
    searchChange = ( value ) => {
        this.setState({
            searchString : value
        })
    }
    onSocialKeyDown = (e) => {
        console.log(e.keyCode)
        if(e.keyCode === 13) {
            // console.log(this.state.searchString)
            this.socialSearch(this.state.searchString);
        }
    }

    socialSearch = async (value) => {
        let param = [];
        param.push({'queryParamName':this.props.cardStore.socialConfig.queryParamName,'entityValue':value}); // this.props.cardStore.socialConfig.queryParamName

        await   this.props.cardStore.getSocialSearchItem(this.props.match.params.id , JSON.stringify(param));
        this.setState({
            searchInfo : this.props.cardStore.socialItems
        })
    }
    /**
     * 检查文件大小是否符合要求
     */
    checkFileSize = ( file, MAX = 10240 ,item ) => {
        const reg = new RegExp(item.regexvalidateclass.toLowerCase());
        if(item.fieldtype === 9) {
            if(!regPicture.test(file.name.toLowerCase())) {
                Error(this.errorTips.errorPic);
                return false;
            }
        }
        else {
            if(regPicture.test(file.name.toLowerCase())) {
                Error(this.errorTips.errorFile);
                return false;
            }
        }
        if(!reg.test(file.name.toLowerCase())) {
            Error(this.errorTips.errorTips+ ' '+ item.validateprompt);
            return false;
        }
        let text = this.props.intl.formatMessage({id:"js.com.Sub.0006", defaultMessage:"文件大于"}) + (MAX/1024) + 'MB'
        if((file.size/1024)>= MAX){
            Error(text)
            return false;
        }
        return true;
    }
    loadSocialInfo = async (key, value) => {
        let param = [];
        param.push({queryParamName:this.props.cardStore.socialConfig.queryParamName,entityValue:value.props.children});
        await  this.props.cardStore.getSocialSearchDetail(this.props.match.params.id , JSON.stringify(param)); // this.props.cardStore.socialConfig.queryParamName
    }

    downloadFile = (text, type) => {
        const addr = text.split('#')[0];
        const fileName = text.split('#')[1];
        const url =  `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/download?saveAddr=${addr}&fileName=${fileName}`;
        // window.open(url,'_blank')
        this.setState({
            finalUrl : ``,
            downloadUrl : url,
            modalType : type
        })
    }

    closeModal = () => {
        this.setState({
            downloadUrl : ``,
            modalType : ''
        })
    }
    confirmModal = () => {
        // console.log(this.state.downloadUrl);
        // window.open(this.state.downloadUrl,'_blank')
        this.setState({
            finalUrl : this.state.downloadUrl,
        })
        this.closeModal();
    }
    renderMdmcode = () => {
        let mdm_code = "";
        if ( this.props.store.loadInfo && this.props.match.params.mdmcode) {
            if ( this.props.match.params.mdmcode.match(/^copy_(.*)/) ) {
                return null;
            }
            else {
                mdm_code = this.props.store.loadInfo.mdm_code;
            }
        }
        if ( mdm_code ) {
            return (
                <Col key={'mdm_code'} className='main-table-col' md={4} xs={6} >
                    <div className='table-item'>
                        <div className="item-title">
                            MDMCODE：
                        </div>
                        <div className='item-detail'>
                            <div>
                                <FormControl
                                    value={ mdm_code }
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            )
        }
        return null;

    }
    renderSocialItem = ( header ) => {
        if(this.props.cardStore.socialConfig){ // this.props.cardStore.socialConfig
            return header.map((item, index) => {
                let socialConfigItem = this.props.cardStore.socialConfig.entityCode;//this.props.cardStore.socialConfig.entityCode;
                const required = item.required;
                const reg = new RegExp(item.regexvalidateclass);
                const value = this.props.store.loadInfo[item.code];
                let notLegal = this.state.tipsShow && ((required && !value) ||!reg.test(value));
                if (item.code === socialConfigItem) { //socialConfigItem
                    console.log(this.props.store.loadInfo[item.code])
                    return (
                        <Col key={item.fieldId} className='main-table-col' md={ 4 } xs={ 6 } >
                            <div className='table-item'>
                                <div className="item-title">
                                    <span className='star-icon-red'>*</span> {item.name}：
                                </div>
                                <div className='item-detail'>
                                    <div>
                                        <Select
                                            data = { this.state.searchInfo }
                                            showSearch = { true }
                                            value = { this.props.store.loadInfo[item.code]}
                                            onSearch = { this.searchChange }
                                            className={notLegal ? 'border-red-f' : 'border-blue'}
                                            disabled={item.rwauth === 1}
                                            onSelect = { this.loadSocialInfo }
                                            onKeyDown = { this.onSocialKeyDown}
                                        />

                                    </div>
                                </div>
                            </div>
                        </Col>
                    );
                }
                return null;
            } )
        }
        return null;
    }

    renderStatus = () => {
        let res;
        if(this.props.showStatus >= 0){
            switch(this.props.showStatus){
                case 0: res = this.props.intl.formatMessage({id:"js.com.Mai.0004", defaultMessage:"未提交"}); break;
                case 1: res = this.props.intl.formatMessage({id:"js.com.Mai.0005", defaultMessage:"审批中"}); break;
                case 2: res = this.props.intl.formatMessage({id:"js.com.Mai.0006", defaultMessage:"已驳回"}); break;
                case 3: res = this.props.intl.formatMessage({id:"js.com.Mai.0007", defaultMessage:"已发布"}); break;
                case 4: res = this.props.intl.formatMessage({id:"js.com.Mai.0008", defaultMessage:"已封存"}); break;
                case 5: res = this.props.intl.formatMessage({id:"js.com.Mai.0009", defaultMessage:"已提交"}); break;
                default: res = this.props.intl.formatMessage({id:"js.com.Mai.0010", defaultMessage:"无"}); break;
            }
            return (
                <Col key='status' className='main-table-col' md={4} xs={6} >
                    <div className='table-item'>
                        <div className="item-title"><FormattedMessage id="js.com.Mai.0011" defaultMessage="状态：" /></div>
                        <div className='item-detail'>
                            <div>
                                <FormControl
                                    value={ res }
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            )
        }
    }
    renderHelper = ( arr ) =>{
        if(!arr)return null;
        return arr.map( (item) => {
            let className = 'table-item';
            let sp =false;
            if(item.fieldtype === 9 || item.fieldtype === 10){
                className += ' file';
                if(this.props.status ===0){
                    className += ' file-disabled'
                }
            }
            else if( item.fieldtype === 11 ){
                className += ` text-area`;
                sp = true;
            }
            if(this.props.cardStore.socialConfig && item.code === this.props.cardStore.socialConfig.entityCode) {
                return null;
            }
            return (
                <Col  className = 'main-table-col'
                    md = {sp?12:4}
                    xs = {sp?12:6}
                    key = { item.code}
                >
                    <div className={ className }>
                        <div className="item-title">

                            <Tooltip inverse overlay={item.name} placement="bottom" >
                                <span tootip={item.name} className='title-tooltip'>
                                    {
                                        item.required ?
                                            <span className='star-icon-red'>*</span>
                                            : null
                                    }
                                    {item.name}
                                </span>
                            </Tooltip>
                            <span>
                                :&nbsp;
                            </span>
                        </div>
                        <div className = {sp?`item-text-area`:`item-detail`}>
                            {this.renderItem(item)}
                        </div>
                    </div>
                </Col>
            )
        })
    }
    renderErrorTips = ( required , value,code, reg, type) =>{
        this.editLegal[code] = true;
        if(required && !value){
            this.editLegal[code] = false;
            if(!this.state.tipsShow)return null;
            return (
                <span className='error-tips'>
                    <FormattedMessage id="js.com.Mai.0001" defaultMessage="必填项" />
                </span>
            )
        }
        else if(required && reg && !reg.test(value)){
            this.editLegal[code] = false;
            if(!this.state.tipsShow)return null;
            return (
                <span className='error-tips'>
                    <FormattedMessage id="js.com.Mai.0012" defaultMessage="不符合正则校验规则" />
                </span>
            )
        }
        else if(value && type === 2 && !regInt.test(value)){
            this.editLegal[code] = false;
            if(!this.state.tipsShow)return null;
            return (
                <span className='error-tips'>
                    <FormattedMessage id="js.com.Mai.0013" defaultMessage="请输入整数" />
                </span>
            )
        }
        else if(value && type === 4 && !regFloat.test(value)){
            this.editLegal[code] = false;
            if(!this.state.tipsShow)return null;
            return (
                <span className='error-tips'>
                    <FormattedMessage id="js.com.Mai.0014" defaultMessage="请输入浮点数" />
                </span>
            )
        }
        if(this.props.legalCheck)this.props.legalCheck(this.editLegal);
        return null;
    }
    renderItem = ( item ) => {
        let disabled = this.props.status === 0;
        const required = item.required || item.isunique;
        const reg = new RegExp(item.regexvalidateclass);
        switch (item.fieldtype) {
            case 1: // 字符
            {
                return (
                    <div>
                    <FormControl
                        defaultValue = { item.defaultvalue }
                        value = { this.props.store.loadInfo[item.code] || ''}
                        onChange = {this.onInputChange(item.code)}
                        disabled = { item.rwauth === 1 || disabled}
                        onBlur = { (value,e) => {this.setDefault(value,e,item) }}
                        maxLength = { item.fieldlength}
                    />
                    {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code,reg,1)}
                    </div>
                )
            }
            case 2: // 整型
            {
                return (
                    <div>
                        <FormControl
                            defaultValue = { item.defaultvalue }
                            value = { this.props.store.loadInfo[item.code] || ''}
                            onChange = {this.onInputChange(item.code)}
                            disabled = { item.rwauth === 1 || disabled}
                            onBlur = { (value,e) => {this.setDefault(value,e,item) }}
                            maxLength = { item.fieldlength}

                        />
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code], item.code,reg ,2)}
                    </div>
                )
            }
            case 3: // 布尔
            {
                const value = this.props.store.loadInfo[item.code] == '1' || this.props.store.loadInfo[item.code] == true || this.props.store.loadInfo[item.code] == 'true';
                return (
                    <div>
                        <Select
                            onChange = { this.onBoolChange(item.code)}
                            value = { value ? `1` : '0'}
                            disabled = { item.rwauth === 1 || disabled}
                        >
                            <Option key='0' value="1"><FormattedMessage id="js.com.Mai.0015" defaultMessage="是" /></Option>
                            <Option key='1' value='0'><FormattedMessage id="js.com.Mai.0016" defaultMessage="否" /></Option>
                        </Select>
                        {this.renderErrorTips(required,  this.props.store.loadInfo[item.code], item.code,reg)}
                    </div>
                )
            }
            case 4:  // 浮点
            {
                return (
                    <div>
                        <FormControl
                            defaultValue = { item.defaultvalue }
                            value = { this.props.store.loadInfo[item.code] || ''}
                            onChange = {this.onInputChange(item.code)}
                            disabled = { item.rwauth === 1 || disabled}
                            onBlur = { (value,e) => {this.setDefault(value,e,item) }}
                            maxLength = { item.fieldlength}

                        />
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code,reg ,4)}
                    </div>
                )
            }
            case 5:  // 日期
            {
                return (
                    <div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder={this.props.store.loadInfo[item.code] || ''}
                            onChange = { this.onDateChange( item.code, "YYYY-MM-DD")}
                            disabled = { item.rwauth === 1 || disabled}
                        />
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code)}
                    </div>
                )
            }
            case 6: // 日期时间
            {
                return (
                    <div >
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            showTime = { true }
                            placeholder={this.props.store.loadInfo[item.code] || ''}
                            onChange = { this.onDateChange( item.code , "YYYY-MM-DD HH:mm:ss")}
                            disabled = { item.rwauth === 1 || disabled}
                        />
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code)}
                    </div>

                )
            }
            case 7:  // 参照
            {
                let init = '';
                let info = this.props.store.loadInfo;
                // if (info[item.code] && !info[`$ref$${item.code}`] && typeof(info[item.code])==='string') {
                //     init = JSON.stringify({
                //         refname: info[`${item.code}_name`],
                //         refpk: info[item.code]
                //     })
                // }
                if (info[item.code] && typeof(info[item.code])==='string') {
                    init = JSON.stringify({
                        refname: info[`${item.code}_name`],
                        refpk: info[item.code]
                    })
                }
                return (
                    <div class="mdm-ref-comp">
                        <MdmRefComp
                            value = { init || '' }
                            // placeholder = { this.props.store.loadInfo[`${item.code}_name`]}
                            pk_entityitem={item.pk_entityitem}
                            authfilter={true}
                            pk_gd={this.props.pk_gd}
                            // onChange={this.onRefChange(item.code)}
                            onSave = {this.onRefChange(item.code)}
                            disabled = { item.rwauth === 1 || disabled }
                        />
                        {this.renderErrorTips(required,this.props.store.loadInfo[`$ref$${item.code}`] || this.props.store.loadInfo[item.code],item.code)}
                    </div>

                )
            }
            case 8:  // 下拉
            {
                return (
                    <div>
                        <Select
                            onFocus={() => { this.getSelectionInfo( item.code ,item.pk_entityitem ) }}
                            onSelect={this.onSelectChange(item)}
                            value={ this.state.selection[item.code] || this.props.store.loadInfo[`${item.code}_name`] } // 初始值
                            disabled = { item.rwauth === 1 || disabled }
                        >
                            {
                                this.renderSelection(toJS(this.state.selectionData[item.pk_entityitem + item.code]))
                            }
                        </Select>
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code)}
                    </div>
                )
            }
            case 13:  // 枚举
            {
                return (
                    <div>
                        <Select
                            onFocus={() => { this.getEnumInfo( item.code ,item.pk_entityitem ) }}
                            onSelect={this.onSelectChange(item)}
                            value={ this.state.selection[item.code] || this.props.store.loadInfo[`${item.code}_name`] } // 初始值
                            disabled = { item.rwauth === 1 || disabled }
                        >
                            {
                                this.renderSelection(toJS(this.state.selectionData[item.pk_entityitem + item.code]))
                            }
                        </Select>
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code)}
                    </div>
                )
            }
            case 9:  // 图片
            {
                let picUrl = null;
                let info = this.props.store.loadInfo[item.code];
                if(info){
                    picUrl =  `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/download?saveAddr=${info.split('#')[0]}`
                }

                return (
                    <div>
                        <Upload
                        {...{
                            action: `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/upload`,
                            listType: 'picture',
                            accept:".gif,.png,.jpg,",
                            size: 10485760,   // 10485760 Byte === 10MB
                            onChange: (info) => {this.handleChangeFile(info, item)},
                            onRemove: () => {this.onRemoveFile(item) },
                            beforeUpload : (file) =>( this.checkFileSize(file, 10240, item)),
                            showUploadList: false
                        }}
                            disabled = { item.rwauth === 1 || this.props.store.loadInfo[item.code] || disabled}
                        >
                            <Button
                                type="primary"
                                shape="border"
                                className="upload-btn"
                                disabled = { item.rwauth === 1 || this.props.store.loadInfo[item.code] || disabled}
                                >
                                <Icon type="uf-upload" /> <FormattedMessage id="js.com.Chi.0010" defaultMessage="选择图片" />
                            </Button>
                            <span style={ {display : "block", fontSize :12,margin:8} }><FormattedMessage id="js.com.Mai.0017" defaultMessage="请您选择图片进行上传，大小不超过10MB" /></span>
                        </Upload>
                        {this.props.store.loadInfo[item.code]?<div className="file-display">
                            <img className='file-display-pic' src={picUrl} />
                            <span className='file-display-name file-display-name-p' onClick={()=>{this.downloadFile(info, 'picture')}}>{info.split('#')[1]}</span>
                            <Icon type='uf-close' className='file-display-close' onClick = { ()=>{this.onRemoveFile(item)}} />
                        </div>:null}
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code)}

                    </div>
                )
            }
            case 10: // 附件
            {
                let info = this.props.store.loadInfo[item.code];
                return (
                    <div>
                        <Upload
                        {...{
                            action: `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/upload`,
                            listType: 'text',
                            size: 1024000,   // 10485760 Byte === 10MB
                            onChange: (info) => {this.handleChangeFile(info, item)},
                            onRemove: () => {this.onRemoveFile(item) },
                            multiple: false,
                            beforeUpload : (file) =>( this.checkFileSize(file, 10240, item)),
                            showUploadList: false
                        }}
                            disabled = { item.rwauth === 1 || this.props.store.loadInfo[item.code] || disabled}
                        >
                            <Button
                                type="primary"
                                shape="border"
                                className="upload-btn"
                                disabled = { item.rwauth === 1 || this.props.store.loadInfo[item.code] || disabled}
                                >
                                <Icon type="uf-upload" /> <FormattedMessage id="js.com.Chi.0012" defaultMessage="选择文件" />
                            </Button>
                            <span style={ {display : "block", fontSize : '12px',margin:8} }><FormattedMessage id="js.com.Mai.0018" defaultMessage="请您选择文件进行上传，大小不超过10MB" /></span>
                        </Upload>
                        {this.props.store.loadInfo[item.code]?<div className="file-display" style={{height:40}}>
                            <Icon type='uf-link' />
                            <span className='file-display-name file-display-name-f'onClick={()=>{this.downloadFile(info, 'file')}}>{info.split('#')[1]}</span>
                            <Icon type='uf-close' className='file-display-close' onClick = { ()=>{this.onRemoveFile(item)}} />
                        </div>:null}

                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code)}
                    </div>
                )
            }
            case 11: // 大文本
            {
                return (
                    <div>
                        <FormControl
                            className = "text-area-input"
                            componentClass='textarea'
                            value = { this.props.store.loadInfo[item.code] || ''}
                            onChange = {this.onInputChange(item.code)}
                            disabled = { item.rwauth === 1 || disabled }
                            maxLength = { item.fieldlength}
                        />
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code])}
                    </div>
                )
            }
            case 12:  // 时间
            {
                return (
                    <div >
                        <TimePicker
                            format="HH:mm:ss"
                            placeholder={this.props.store.loadInfo[item.code] || ''}
                            onChange = { this.onDateChange( item.code , "HH:mm:ss")}
                            disabled = { item.rwauth === 1 || disabled}
                            className={ item.rwauth === 1 || disabled ? 'disable-time-picker':''}
                        />
                        {this.renderErrorTips(required, this.props.store.loadInfo[item.code],item.code)}
                    </div>
                )
            }
            default:
            {
                return (
                    <FormControl
                        className = "item-detail"
                        value = { this.props.store.loadInfo[item.code] }
                        onChange = {this.onInputChange(item.code)}
                        disabled = { item.rwauth === 1 || disabled }
                    />
                )
            }
        }
    }

    // 修改列表顺序 普通-文本区域-文件
    changeHeader = ( arr ) => {
        if(arr){
            let tempFile = [];
            let tempTextArea = [];
            let tempOther = [];
            let res = [];
            arr.map( (item ) => {
                switch(item.fieldtype){
                    case 9:
                    case 10:
                    {
                        tempFile.push(item);
                        break;
                    }
                    case 11:
                    {
                        tempTextArea.push(item);
                        break;
                    }
                    default:{
                        tempOther.push(item);
                        break;
                    }
                }
            })
            return res.concat(tempOther, tempTextArea, tempFile);
        }
        return [];
    }

    render() {
        let header = this.changeHeader(toJS(this.props.header));
        console.log(header)
        const { modalType, downloadUrl} = this.state;
        const {style, setSubHeight} = this.props;
        console.log(this.props.cardStore.loadInfo)
        if(this.props.cardStore.loadInfo.empty) return null;
        console.log(123)
        const mainTableDOM = document.getElementsByClassName('main-table')[0];
        if(mainTableDOM && mainTableDOM.clientHeight > 48 && setSubHeight ){
            const subHeight = window.innerHeight - mainTableDOM.clientHeight - 44;
            setSubHeight(subHeight);
        }
        return (
            <div className = 'main-table' style={style}>
                <Row className = 'main-table-row'>
                    { this.renderMdmcode()}
                    { this.renderStatus()}
                    { this.renderSocialItem(header)}
                    {this.renderHelper(header)}
                </Row>
                <Modal
                    show={ modalType !== '' }
                >
                    <Modal.Header>
                    <Modal.Title>{modalInfo[modalType].title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {
                            modalType === 'file' ?
                            <span>{modalInfo[modalType].desc}</span>
                            :
                            <div>
                                <img className='img-download-tips' src={downloadUrl}/>
                            </div>
                        }
                        </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.closeModal()} shape="border" style={{ marginRight: 15 }}><FormattedMessage id="js.rou.hom.0035" defaultMessage="关闭" /></Button>
                        <Button onClick={() => this.confirmModal()} colors="primary"><FormattedMessage id="js.rou.hom.0031" defaultMessage="下载" /></Button>
                    </Modal.Footer>
                </Modal>
                <iframe src={this.state.finalUrl} style={{display:'none'}}></iframe>
            </div>
        )
    }
}

export default injectIntl(Form.createForm()(MainTable), {withRef: true});
