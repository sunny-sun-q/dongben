import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React,{Component} from 'react';
import { ButtonGroup, Icon, Dropdown, Menu, Message, Loading } from 'tinper-bee';
import './index.less'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import MainTable from '../components/MainTable';
import SubTable from '../components/SubTable';
import { toJS } from 'mobx';
import {BpmButtonSubmit, BpmButtonRecall} from 'yyuap-bpm';
import {success,Error} from 'utils';
import {Button} from 'components/tinper-bee';
@inject((stores) => {
    return {
        cardStore: stores.cardStore,
        treeStore: stores.treeStore
    }
})

@withRouter

@observer class TreeCardEdit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            status : 0, // 0 展示   1 编辑
            seal : 0,
            editFlag : 0, // 0新增 1修改 other 复制
            showTips : false,
            loadingFlag : false,
            subHeight : 0,

        }
        this.approvalList = []
        this.legal = {}
        this.processParams = {}
        this.mdmNowUrl = window.mdmNowUrl + '';
    }

    componentWillMount = () => {



    }

    componentDidMount = async() => {
        this.props.cardStore.subInfoDel = {};
        // 调用model以获取渲染样式
        let pk_gd = this.props.match.params.id;
        let mdm_code =  this.props.match.params.mdmcode;
        await this.props.cardStore.getModel(pk_gd);
        if(mdm_code === 'new'){
            this.props.cardStore.getLoadInfo(pk_gd);
            this.setState({
                editFlag : 0
            })
        }
        else if( mdm_code.match(/^copy_/)){
            let code = mdm_code.match(/^copy_(.*)$/)[1]
            this.props.cardStore.getLoadInfo(pk_gd,code);
            this.setState({
                editFlag : code
            })
        }
        else{
            this.props.cardStore.getLoadInfo(pk_gd,mdm_code);
            this.setState({
                editFlag : 1
            })
        }

    }

    componentWillReceiveProps = () => {
    }

    delete = () => {
        // this.props.history.push(`/tree-card/03e98d28-f5d1-4e86-a0f1-6e98f6df2c36`);
        console.log( toJS(this.props.cardStore.loadInfo))
        // this.props.cardStore.deleteItems(this.props.match.params.id,this.props.cardStore.loadInfo.mdm_code);
        console.log(this.props.match.params.id,this.props.cardStore.loadInfo.mdm_code)
    }

    //下载按钮
    download = async() => {
        let condition = `cond=mdm_code in ('${this.props.cardStore.loadInfo.mdm_code}')`;
        let pk_gd = `pk_gd=${this.props.match.params.id}`;
        window.open(`${GLOBAL_HTTP_CTX}/modeling/mdmshow/list/download?${pk_gd}&${condition}`);
    }

    // 修改封存状态
    changeSeal = async (param) => {
        let type = param === 0? 'seal' : 'unseal' ;
        let mdmCodes = this.props.cardStore.loadInfo.mdm_code;
        await this.props.cardStore.sealStateChange(this.props.match.params.id, type, mdmCodes);
        // 刷新页面
        this.props.cardStore.getLoadInfo(this.props.match.params.id);
    }



    onSelect = ()=> {

    }
    renderTitle = () => {
        if(this.state.editFlag===0){
            return this.props.intl.formatMessage({id:"js.tre.tre.0001", defaultMessage:"新增"});
        }
        else if(this.state.editFlag===1){
            return this.props.intl.formatMessage({id:"js.tre.tre.0002", defaultMessage:"修改"});
        }
        else{
            return this.props.intl.formatMessage({id:"js.tre.tre.0003", defaultMessage:"复制"});
        }
    }
    onBack = async() => {
        await this.props.cardStore.reset();
        window.location.href = this.mdmNowUrl;
        // window.history.go(-1); 
    }
    submit = (isProcess = false) => {
        this.save(true,isProcess);
    }
    save = async (submitFlag = false, isProcess ) => {//保存
        this.setState({
            showTips : true,
        });
        for(let item in this.legal){
            if(this.legal[item] === false){
                // Message.create({ content: this.props.intl.formatMessage({id:"js.tre.tre.0004", defaultMessage:"数据填写错误"}), color: 'danger' });
                return null;
            }
        }
        let id = this.props.match.params.id;
        // 处理参照的数据
        let info = this.props.cardStore.loadInfo;
        let header = ( this.props.cardStore.modelInfo.entitys && this.props.cardStore.modelInfo.entitys[0] )|| {};
        let mainTableHeader = header.body;
        mainTableHeader.map( (item) => {
            if(item.fieldtype === 7 && info[`$ref$${item.code}`]){
                let temp = info[`$ref$${item.code}`];
                info[item.code] = temp==='empty' ? '' : temp.mdmcode_busiid;
                info[`${item.code}_name`] = temp==='empty' ? '' : temp.name;
            }
            else if(item.fieldtype === 3 && (info[item.code] == null || info[item.code] == '')) {
                info[item.code] = 0;
            }
        })
        let main = {};
        let sub = {};
        let old_main = {};
        let old_sub = {};
        // 组装当前信息
        for(let item in info) {
            // sub_ 子表    $ref$ 参照
            if(item.match(/^sub_/)){
                let name = item.match(/^sub_(.*)/)[1];
                let entitys = this.props.cardStore.modelInfo.entitys;
                for(let i = 0; i < entitys.length; i++){
                    let nowEntity = entitys[i];
                    let nowName = nowEntity.head.name;
                    if(name === nowName){
                        let subTableHeader = nowEntity.body;
                        subTableHeader.map( (subItem) => {
                            info[item].map((row) =>{
                                if(subItem.fieldtype === 7 && row[`$ref$${subItem.code}`]){
                                    let temp = row[`$ref$${subItem.code}`];
                                    row[subItem.code] = temp==='empty' ? '' : temp.mdmcode_busiid;
                                    row[`${subItem.code}_name`] = temp==='empty' ? '' : temp.name;
                                }
                                else if(subItem.fieldtype === 3 && (row[subItem.code] == null || row[subItem.code] == '')) {
                                    row[subItem.code] = 0;
                                }
                            })
                            
                        })
                    }
                }
                sub = { ...sub,[name]:toJS(info[item])}
            }
            else if(item.match(/^$ref$/)){

            }
            else{
                main = { ...main,[item]:info[item]}
            }
        }
        // 组装原有信息
        let info_r = this.props.cardStore.loadInfo_r;
        for(let item in info_r) {
            if(item.match(/^sub_/)){
                let name = item.match(/^sub_(.*)/)[1];
                old_sub = { ...old_sub,[name]:toJS(info_r[item])}
            }
            else if(item.match(/^\$ref\$/)){

            }
            else{
                old_main = { ...old_main,[item]:info_r[item]}
            }
        }

        // 向 sub 中加入已删除数据
        let subInfoDelObj = toJS(this.props.cardStore.subInfoDel);
        for(let item in subInfoDelObj){
            let name = item.match(/^sub_(.*)/)[1];
            sub[name] = sub[name].concat(subInfoDelObj[item] || []);
        }
        
        main.mdm_datastatus = submitFlag === true ? '3' : '0';
        if(this.state.editFlag === 0){  // 新增
            console.log('new-----------\n',main,sub,old_main,old_sub);
        }
        else if(this.state.editFlag === 1 ){    // 修改
            console.log('change-------\n',main,sub,old_main,old_sub)
        }
        else{   // 复制
            delete main.mdm_code;
            delete main.pk_mdm;
            delete main.mdm_version;
            // 删除子表中的mdmcode等信息
            for(let subTableItem in sub){
                sub[subTableItem].map( (item,index) => {
                    delete item.mdm_code;
                    delete item.mdm_parentcode;
                    delete item.pk_mdm;
                })
            }

            console.log('copy-----------\n',main,sub,old_main,old_sub);
        }
        if(isProcess === true){
            // main.mdm_datastatus = '5';
            let obj = {
                pk_gd: id,
                main : JSON.stringify(main),
                sub : sub,
            }
            this.processParams = obj;
            return obj;
        }
        else {
            await this.props.cardStore.save(id, main, sub, null, old_main, old_sub);
            this.onBack();
        }


    }

    /**
     *
     * @description 提交初始执行函数
     * @param {string, string} operation为submit recall type 为start、success
     */
    bpmStart = (operation, type) => async () => {
        if (type == 'start') {
            this.setState({
                loadingFlag: true
            })
        } else {
            let msg = operation == 'submit' && this.props.intl.formatMessage({id:"js.tre.tre.0005", defaultMessage:"单据提交成功"}) || this.props.intl.formatMessage({id:"js.tre.tre.0006", defaultMessage:"单据撤回成功"});
            success(msg);
            this.setState({
                loadingFlag: false
            })
            setTimeout(()=>{
                this.onBack();
            },1000)
        }
    }
    /**
   *
   * @description 提交失败和结束执行的函数
   * @param {string,string} operation为submit recall type 为error、end
   */
    bpmEnd = (operation, type) => async (error) => {
        if (type == 'error' && error.msg!=='请选择提交的单据') {
            Error(error.msg);
        }
        this.setState({
            loadingFlag: false
        })
    }

    legalCheck = (flag) => {
        this.legal = flag;
    }

    //获取暂存.提交按钮的禁用状态
    getDisabled = () => {
        const entitys = this.props.cardStore.modelInfo && this.props.cardStore.modelInfo.entitys;
        let res = true;
        if(entitys) {
            entitys.map( (item)=> {
                res = res && item.head.stopWriteBtn;
            })
        }
        return res;
    }
    setSubHeight = ( value ) => {
        if(this.state.subHeight === 0){
            this.setState({
                subHeight : value,
            })
        }
    }
    render() {

        let header = ( this.props.cardStore.modelInfo.entitys && this.props.cardStore.modelInfo.entitys[0] )|| {};
        let designInfo = this.props.cardStore.modelInfo && this.props.cardStore.modelInfo.designInfo;
        let loadInfo = this.props.cardStore.loadInfo;
        let mainTableHeader = (header.body);
        const disabled = this.getDisabled();
        let code = designInfo ? designInfo.code : '';
        let mdm_datastatus = loadInfo? loadInfo.mdm_datastatus: 0;
        mdm_datastatus = mdm_datastatus? parseInt(mdm_datastatus) : 0;
        if(this.props.cardStore.loadInfo.empty) return null;
        return (
            <div className = 'data-edit-page'>

                <div className="section-wrap-r-header">
                    <div className="main-data-btn-back">
                        <Button  className='head-back' onClick={this.onBack}>
                            <Icon type="uf-anglepointingtoleft"/>
                            <span className='head-back-word'><FormattedMessage id="js.tre.tre.0007" defaultMessage="返回" /></span>
                        </Button>
                    </div>
                    <h5 className="section-wrap-r-title">
                        {this.renderTitle()}
                    </h5>
                    <div className="main-data-btn">
                        <Button bordered className='head-btn head-cancel' onClick={this.onBack}><FormattedMessage id="js.tre.tre.0008" defaultMessage="取消" /></Button>
                        {
                            mdm_datastatus != 3?<Button shape="border"  className='head-btn head-save' onClick={this.save} disabled={disabled}>
                                <FormattedMessage id="js.tre.tre.0009" defaultMessage="暂存" />
                            </Button>:null
                        }
                        {
                            designInfo && designInfo.isworkflow && !disabled && designInfo.wflowEndUser?
                            // 1 ?
                                <BpmButtonSubmit
                                    className="ml8"
                                    funccode={code}
                                    nodekey="003"
                                    url={`/iuapmdm/modeling/mdmshow/flowdata/submit`}
                                    urlAssignSubmit={`/iuapmdm/modeling/mdmshow/flowdata/assignSubmit`}
                                    params={this.processParams}                        // url={`${GROBAL_HTTP_CTX}/purchase_order/submit`}
                                    // urlAssignSubmit={`${GROBAL_HTTP_CTX}/purchase_order/assignSubmit`}
                                    onStart={this.bpmStart('submit', 'start')}
                                    onSuccess={this.bpmStart('submit', 'success')}
                                    onError={this.bpmEnd('submit', 'error')}
                                    onEnd={this.bpmEnd('submit', 'end')}
                                >
                                    <Button  className='head-btn head-submit' onMouseEnter={()=>{this.submit(true, true)}}>
                                        <FormattedMessage id="js.tre.tre.0010" defaultMessage="提交" />
                                    </Button>
                                </BpmButtonSubmit>
                            :
                            <Button  className='head-btn head-submit' onClick={this.submit} disabled={disabled}>
                                <FormattedMessage id="js.tre.tre.0011" defaultMessage="提交" />
                            </Button>
                        }
                    </div>
                </div>

                {/* 主表区域 */}
                <MainTable
                    header = { mainTableHeader }
                    pk_gd = { this.props.match.params.id}
                    selectionData = { this.props.cardStore.selectionData }
                    store =  { this.props.cardStore }
                    status = { 1 }
                    showTips = { this.state.showTips }
                    legalCheck = { this.legalCheck }
                    setSubHeight = { this.setSubHeight }
                />

                {/* 子表区域 */}

                <SubTable
                    navInfo = { this.props.cardStore.modelInfo }
                    status = { 1 }
                    style = { {minHeight:this.state.subHeight}}
                />
                <Loading show={this.state.loadingFlag} loadingType="line" />

            </div>
        )
    }
}

export default injectIntl(TreeCardEdit, {withRef: true});
