import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React,{Component} from 'react';
import { Route, } from 'react-router-dom';
import { success, Error, Warning } from 'utils/index.js'
import {   Modal } from 'tinper-bee';
import Card from './card'
import {Button} from 'components/tinper-bee';
import CardBtnGroup from './components/CardBtnGroup'
import './index.less'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Siderbartree from 'components/tree/index.js';
@inject((stores) => {
    return {
        cardStore: stores.cardStore,
        dataProcessStore : stores.dataProcessStore,
        dataHistoryStore : stores.dataHistoryStore,
        loadDataStore: stores.loadDataStore,
        comboxStore: stores.comboxStore
    }
})
@withRouter
@observer class TreeCard extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            nodeInfo : null,
            id : '',
            status : 0,
            modalFlag : false,
            node: null,
        }
        this.cond = null;
        this.nodeSaveClick = this.nodeSaveClick.bind(this)
        this.treeOption = {
            add : (e)=>{

                let wflowStartUser = this.props.cardStore.modelInfo.designInfo.wflowStartUser;
                let stopAllBtn = this.props.cardStore.modelInfo.designInfo.stopAllBtn;
                let stopWriteBtn = this.props.cardStore.modelInfo.designInfo.stopWriteBtn;
                if(wflowStartUser && !stopAllBtn && !stopWriteBtn){
                    let id = this.props.match.params.id;
                    window.mdmNowUrl = window.location.href;
                    this.props.history.push(`/tree-card/${id}/edit/new`);
                }
                else{
                    Warning(this.props.intl.formatMessage({id:"js.rou.tre.0001", defaultMessage:"无新增权限"}));
                }
                e.stopPropagation();

            },

            change : (e,node) => {

                let wflowStartUser = this.props.cardStore.modelInfo.designInfo.wflowStartUser;
                let stopAllBtn = this.props.cardStore.modelInfo.designInfo.stopAllBtn;
                let stopWriteBtn = this.props.cardStore.modelInfo.designInfo.stopWriteBtn;
                if(!stopWriteBtn && !stopAllBtn){
                    // let type = this.props.match.url;
                    let id = this.props.match.params.id;
                    window.mdmNowUrl = window.location.href;
                    this.props.history.push(`/tree-card/${id}/edit/${node.id}`);
                }
                else{
                    Warning(this.props.intl.formatMessage({id:"js.rou.tre.0002", defaultMessage:"无修改权限"}))
                }
                e.stopPropagation();
            },

            delete : async (e,node ) => {
                let stopAllBtn = this.props.cardStore.modelInfo.designInfo.stopAllBtn;
                let stopWriteBtn = this.props.cardStore.modelInfo.designInfo.stopWriteBtn;
                if(!stopAllBtn && !stopWriteBtn){
                    this.setState({
                        node : node,
                        modalFlag : true,
                    })
                }
                else{
                    Warning(this.props.intl.formatMessage({id:"js.rou.tre.0004", defaultMessage:"无删除权限"}))
                }
                e.stopPropagation();

            },
            download : async( e,node ) => {
                const mdm_code = this.props.cardStore.loadInfo.mdm_code;
                debugger
                let condition = ``;
                if(mdm_code) {
                    condition  = `cond=mdm_code in ('${mdm_code}')`;
                }
                else {
                    condition = `1=1`;
                }
                const pk_gd = `pk_gd=${this.props.match.params.id}`;
                window.open(`${GLOBAL_HTTP_CTX}/modeling/mdmshow/list/download?${pk_gd}&${condition}`);
            }
        }
        this.btnDisabled = {
           copyBtn : true,
           sealBtn : true,
           unsealBtn : true,
           downloadBtn : false,
           historyBtn : false,
           submitBtn : true,
           unsubmitBtn : true,
        }
    }

    nodeSaveClick() {

    }
    componentWillMount() {
        let pk_gd = this.props.match.params.id;
        console.log(pk_gd);
        this.props.cardStore.getModel(pk_gd);
        this.props.cardStore.getSocialConfig(pk_gd);
        this.setState({
            id : this.props.match.params.id
        })
    }
    componentDidMount = () =>{

    }

    leafClickCallBack = (value) => {
        this.cond = value;
        let id = this.props.match.params.id;

        let mdm_code = value.id;
        if(mdm_code && mdm_code !== '0') {
            window.mdmNowUrl = window.location.href;
            this.props.history.push(`/tree-card/${id}/${mdm_code}`);
        }
        else {
            window.mdmNowUrl = window.location.href;
            this.props.history.push(`/tree-card/${id}`);
            this.props.cardStore.loadInfo = {};
        }
        return true;
    }
    // 修改封存状态
    changeSeal = async (param) => {
        const type = param === 0? 'seal' : 'unseal' ;
        const mdm_code = this.props.cardStore.loadInfo.mdm_code;
        const id = this.props.match.params.id;
        await this.props.cardStore.sealStateChange(id, type, mdm_code);
        // 刷新页面
        this.props.cardStore.getLoadInfo(id, mdm_code);
    }
    //下载按钮
    download = async() => {
        const mdm_code = this.props.cardStore.loadInfo.mdm_code;
        let condition = ``;
        if(mdm_code) {
            condition  = `cond=mdm_code in ('${mdm_code}')`;
        }
        else {
            condition = `1=1`;
        }
        const pk_gd = `pk_gd=${this.props.match.params.id}`;
        window.open(`${GLOBAL_HTTP_CTX}/modeling/mdmshow/list/download?${pk_gd}&${condition}`);
    }

    // 历史记录按钮
    goHistory = () => {
        this.props.dataHistoryStore.modelInfo = this.props.cardStore.modelInfo;
        // this.props.dataHistoryStore.historyMdmcode = record.mdm_code;
        this.props.dataHistoryStore.historyOld = this.props.cardStore.loadInfo;
        const id = this.props.match.params.id;
        const mdm_code = this.props.cardStore.loadInfo.mdm_code;
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/tree-card/${id}/history/${mdm_code}`);
    }

    goProcess = (data) => {
        this.props.dataProcessStore.rowData = data;
        // this.props.history.push(`/process/${this.props.match.params.id}/${record.pkmdm_flow}`);
        let id = this.props.match.params.id;
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/tree-card/${id}/process/${data.mdm_code}`);
    }
    // 复制按钮
    copy = () => {
        const id = this.props.match.params.id;
        const mdm_code = this.props.cardStore.loadInfo.mdm_code;
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/tree-card/${id}/edit/copy_${mdm_code}`);
    }
    getDisabled = () => {
        const stopWriteBtn = this.props.cardStore.modelInfo.designInfo && this.props.cardStore.modelInfo.designInfo.stopWriteBtn;
        const isWorkFlow = this.props.cardStore.modelInfo.designInfo && this.props.cardStore.modelInfo.designInfo.isworkflow;
        const loadInfo = this.props.cardStore.loadInfo;
        if( loadInfo ) {
            this.btnDisabled.copyBtn = !loadInfo.mdm_code || stopWriteBtn;
            this.btnDisabled.sealBtn = loadInfo.mdm_datastatus !== 3 || stopWriteBtn;
            this.btnDisabled.unsealBtn = loadInfo.mdm_datastatus !== 4 || stopWriteBtn;
            this.btnDisabled.historyBtn = !loadInfo.mdm_code || stopWriteBtn;
            this.btnDisabled.isWorkFlow = isWorkFlow;
            this.btnDisabled.submitBtn = loadInfo.mdm_datastatus !== 0 || stopWriteBtn;
            this.btnDisabled.unsubmitBtn = loadInfo.mdm_datastatus !== 5 || stopWriteBtn;
        }
    }

    getFunc = () => {
        return {
            sealBtn : this.changeSeal,
            unsealBtn : this.changeSeal,
            downloadBtn : this.download,
            historyBtn : this.goHistory,
            copyBtn : this.copy,
            processBtn : this.goProcess,
        }
    }
    deleteItem = async() => {
        let pk_gd = this.props.match.params.id;
        let mdm_code = this.state.node.id;
        await this.props.cardStore.deleteItems(pk_gd, mdm_code);
        if (this.props.cardStore.refleshFlag) {
            this.props.cardStore.refleshFlag = false;
            success(this.props.intl.formatMessage({ id: "js.rou.tre.0003", defaultMessage: "删除成功" }));
            setTimeout(() => {
                window.mdmNowUrl = window.location.href;
                this.props.history.push(`/tree-card/${pk_gd}`);
            }, 3000);
        }
        this.cancel();
    }
    cancel = () => {
        this.setState({
            modalFlag : false,
            node : null,
        })
    }
    render() {
        this.getDisabled();
        const loadInfo = this.props.cardStore.loadInfo;
        const { modalFlag } = this.state;
        return (
            <section className="section-wrap">
                <div className="section-wrap-l">
                    <Siderbartree
                        // root={null}
                        root={{id: '0', name: this.props.intl.formatMessage({id:"js.rou.tre.0005", defaultMessage:"参照树根节点"}), isRoot: true}}
                        ifNoHover={false}
                        showIcon = {true}
                        autoSelect={true}
                        isRefTree = { true }
                        expendId = {this.props.match.params.mdmcode }
                        url = '/modeling/mdmshow/list/tree'
                        filterOption = {{pk_gd:this.state.id}}
                        hasClickCallBack = { true }
                        leafClickCallBack = { this.leafClickCallBack } // 点击叶子节点的回调
                        specialFlag = { true }
                        option = { this.treeOption }
                    />
                </div>
                {
                this.props.match.params.mdmcode ? 
                <div className="section-wrap-r">
                    <CardBtnGroup
                        disabled = { this.btnDisabled}
                        func = { this.getFunc() }
                        loadInfo = { loadInfo }
                        info = {{ id:this.props.match.params.id ,mdm_code: this.props.match.params.mdmcode}}
                    />
                    <Card
                        nodeInfo = { this.state.nodeInfo}
                        status = { this.state.status }
                        option = { this.cardOption }

                    />
                </div>
                : null 
                }
                <Modal
                    show={modalFlag}
                    style={{ width: 400 }}
                    onHide={this.cancelBatchDel} >
                    <Modal.Header>
                        <Modal.Title>{this.props.intl.formatMessage({id:"js.com.tre1.0011", defaultMessage:"删除"})}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.props.intl.formatMessage({id:"js.com.tre1.0016", defaultMessage:"您确定要删除吗？"})}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.cancel} bordered style={{ marginRight: 20 }}><FormattedMessage id="js.rou.cus1.0008" defaultMessage="取消" /></Button>
                        <Button onClick={this.deleteItem} ><FormattedMessage id="js.rou.cus1.0015" defaultMessage="确认" /></Button>
                    </Modal.Footer>
                </Modal>
            </section>

        )
    }
}

export default injectIntl(TreeCard, {withRef: true});
