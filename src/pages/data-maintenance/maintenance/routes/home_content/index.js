import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import { ButtonGroup, Modal, Loading, Tooltip ,Timeline,ProgressBar} from 'tinper-bee';
import SearchArea from './components/SearchArea';
import SeniorSearch from 'components/SeniorSearch';
import {BpmButtonSubmit, BpmButtonRecall} from 'yyuap-bpm';
import {success,Error,getContextId} from 'utils';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { createTab } from 'utils'
import './index.less'
import imgUrl from '../../../../../assets/images/entityModel/disabled.png';
import { toJS } from 'mobx';
import {Button} from 'components/tinper-bee';

const TimelineItem = Timeline.Item;
const ifMdm = getContextId() === "mdm";
@withRouter
@inject((stores) => {
    // console.log(stores)
    return {
        treeStore: stores.treeStore,
        dataEditStore: stores.dataEditStore,
        dataMaintainStore: stores.dataMaintainStore,
        seniorSearchStore: stores.seniorSearchStore,
        dataHistoryStore : stores.dataHistoryStore,
        dataProcessStore: stores.dataProcessStore,
        cardStore: stores.cardStore,
        showIframe: false,
    }
})
@observer
class DataMaintenanceRoot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex:"",
            currentRecord:null,
            id: '',
            pageIndex: 1,  // 从1开始
            pageSize: 10,
            step: 10,
            delData: [],
            condition: '',
            isworkflow : true,
            processSubmitData:{},
            processRecallData:{},
            loadingFlag : false ,// 加载状态
            showDataImporModal: false,
            importData: [],
            dataImportArr:[],
            importActive: false,
            selectData : [],
            downloadUrl : ``,
            finalUrl : ``,
            modalType : ``,
        }
        this.modalInfo = {
            "":{
                title:"",desc:"",confirmText:""
            },
            "seal":{
                title:this.props.intl.formatMessage({id:"js.rou.ctt.00371", defaultMessage:"封存确认"}),
                desc: this.props.intl.formatMessage({id:"js.rou.ctt.00372", defaultMessage:"是否封存所选择数据"}),
                confirmText:this.props.intl.formatMessage({id:"js.con.edi3.0019", defaultMessage:"确定"}),
            },
            "unseal":{
                title:this.props.intl.formatMessage({id:"js.rou.ctt.00373", defaultMessage:"解封确认"}),
                desc: this.props.intl.formatMessage({id:"js.rou.ctt.00374", defaultMessage:"是否解封所选择数据"}),
                confirmText:this.props.intl.formatMessage({id:"js.con.edi3.0019", defaultMessage:"确定"}),
            },
            "delete":{
                title:this.props.intl.formatMessage({id:"js.rou.ctt.00375", defaultMessage:"删除确认"}),
                desc: this.props.intl.formatMessage({id:"js.rou.ctt.00376", defaultMessage:"是否删除所选择数据"}),
                confirmText:this.props.intl.formatMessage({id:"js.con.edi3.0019", defaultMessage:"确定"}),
            },
            "downloadData":{
                title:this.props.intl.formatMessage({id:"js.rou.ctt.00377", defaultMessage:"下载确认"}),
                desc: this.props.intl.formatMessage({id:"js.rou.ctt.00378", defaultMessage:"是否下载所选择数据"}),
                confirmText:this.props.intl.formatMessage({id:"js.rou.hom.0031", defaultMessage:"下载"}),
            },
            "downloadAllData":{
                title:this.props.intl.formatMessage({id:"js.rou.ctt.00377", defaultMessage:"下载确认"}),
                desc: this.props.intl.formatMessage({id:"js.rou.ctt.00379", defaultMessage:"您确定要下载所有数据吗"}),
                confirmText:this.props.intl.formatMessage({id:"js.con.edi3.0019", defaultMessage:"确定"}),
            },
            "downloadPic":{
                title:this.props.intl.formatMessage({id:"js.rou.hom.00369", defaultMessage:"图片预览/下载"}),
                desc: "",
                confirmText:this.props.intl.formatMessage({id:"js.rou.hom.0031", defaultMessage:"下载"}),
            },
            "downloadFile":{
                title:this.props.intl.formatMessage({id:"js.rou.ctt.00377", defaultMessage:"下载确认"}),
                desc: this.props.intl.formatMessage({id:"js.rou.ctt.00380", defaultMessage:"是否下载所选择文件"}),
                confirmText:this.props.intl.formatMessage({id:"js.rou.hom.0031", defaultMessage:"下载"}),
            },
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id && nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({
                id: nextProps.match.params.id,
                selectData: [],
                condition : '',
                pageIndex : 1,
            });
            this.showState(nextProps.match.params.id);
        }
        else if(nextProps.cardStore.treeTableMdmcode) {
            this.search(nextProps.cardStore.treeTableMdmcode);
        }
    }
    componentDidMount() {
        this.showState(this.props.match.params.id ,this.props.cardStore.treeTableMdmcode );
    }

    // 展示内容或空白页
    showState = async (id ,mdmcode) => {
        this.props.dataMaintainStore.setIsShow(false);
        this.props.cardStore.getSocialConfig(id);
        await this.props.dataMaintainStore.getDesignInfo(id);
        if(this.props.dataMaintainStore.designInfo){
            this.setState({
                downloadUrl : ``,
                finalUrl : ``,
                isworkflow: this.props.dataMaintainStore.designInfo.isworkflow,

            })
            if(this.props.dataMaintainStore.designInfo.state === 1 ){
                if(mdmcode){
                    await this.search(mdmcode);
                }
                else await this.getRequestTable(id);
            }
            else {
                this.props.dataMaintainStore.setIsShow(true);
            }
        }
        else {
            this.props.dataMaintainStore.setIsShow(true);
        }
    }

    /**
     * 请求表格数据
     * @param id
     */
    getRequestTable(id, pageIndex, pageSize, condition) {
        //
        let gdCode = id || this.props.match.params.id;
        if (this.props.treeStore.tree.selectedKeys.length === 0) {
            this.props.treeStore.setSelectedKeys([gdCode]);
        }
        condition = condition || this.state.condition;
        this.props.dataMaintainStore.getTableRequest(gdCode, pageIndex, pageSize, condition)
    }

    /**
     * 合成表头数组
     * @param header
     */
    mapTableHeader(header) {
        let temparr = header.map((item) => {
            // if(item.fieldId === "mdm_version") return '';
            const text = item.fieldId === "mdm_code" ? "MDMCODE":item.text;
            return {
                title : (<Tooltip inverse overlay={text}  placement="bottom" >
                <span tootip={text}
                    className = 'table-tooltip'
                >
                    {text}
                </span>
              </Tooltip>),
                dataIndex: item.fieldId === "mdm_code" ? "mdm_code" : item.fieldId,
                key: item.fieldId === "mdm_code" ? "mdm_code" : item.fieldId,
                width: 150,


            }
        })
        temparr.splice(1,0,...this.renderStatus());
        return temparr
    }

    /**
     * 新增，修改 0 新增 1 修改 2 复制
     */
    cellClick = (record, index, editFlag) => {
        console.log('666', record, index)
        this.props.dataEditStore.editInfo = {};
        this.props.dataEditStore.editFlag = editFlag;
        this.props.dataEditStore.subInfoDel = []
        const type = this.props.match.url;
        if(editFlag === 0 ){
            window.mdmNowUrl = window.location.href;
            this.props.history.push(`${type}/edit/new`);
        }
        else if (editFlag === 1) {
            let temp = this.props.dataMaintainStore.realTable.gridData[index];
            this.props.dataEditStore.editInfo = temp;
            this.props.dataEditStore.recordInfo = record;
            window.mdmNowUrl = window.location.href;
            this.props.history.push(`${type}/edit/${record.mdm_code}`);
        }
        else if (editFlag === 2) {
            let temp = this.props.dataMaintainStore.realTable.gridData[index];
            this.props.dataEditStore.editInfo = temp;
            this.props.dataEditStore.recordInfo = record;
            window.mdmNowUrl = window.location.href;
            this.props.history.push(`${type}/edit/copy_${record.mdm_code}`);
        }

    }
    // 点击历史记录
    historyClick = (record) => {
        this.props.dataHistoryStore.modelInfo = this.props.dataMaintainStore.modelInfo;
        this.props.dataHistoryStore.historyOld = record;
        let type = this.props.match.url;
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`${type}/history/${record.mdm_code}`);
    }
    // 点击查看流程
    processClick = (record) => {
        this.props.dataProcessStore.rowData = record;
        let type = this.props.match.url;
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`${type}/process/${record.mdm_code}`);
    }

    renderStatus = () => {
        let oThis = this;
        return [{
                title: this.props.intl.formatMessage({id:"js.rou.hom.0008", defaultMessage:"状态"}),
                dataIndex: '$status$',
                key: '$status$',
                width: 100,
                render(text, record, index) {
                    let flag = record.mdm_datastatus || 0;
                    const status = [ {
                            text: oThis.props.intl.formatMessage({id:"js.rou.hom.0009", defaultMessage:"未提交"}),
                            key: "uncommited"
                        }, {
                            text: oThis.props.intl.formatMessage({id:"js.rou.hom.0010", defaultMessage:"审批中"}),
                            key: "checking"
                        }, {
                            text: oThis.props.intl.formatMessage({id:"js.rou.hom.0011", defaultMessage:"已驳回"}),
                            key: "rejected"
                        }, {
                            text: oThis.props.intl.formatMessage({id:"js.rou.hom.0012", defaultMessage:"已发布"}),
                            key: "unseal"
                        }, {
                            text: oThis.props.intl.formatMessage({id:"js.rou.hom.0013", defaultMessage:"已封存"}),
                            key: "seal"
                        }, {
                            text: oThis.props.intl.formatMessage({id:"js.rou.hom.0014", defaultMessage:"已提交"}),
                            key: "commited"
                        }]
                    let tempClass = 'status-circle ' + status[flag].key;
                    return (
                        <ul className="display-flex status">
                            <li className='li-status'>
                                <span className={tempClass}></span>
                                {status[flag].text}
                            </li>
                        </ul>
                    )
                }
            }
        ]
    }

    //tabel选中数据
    tabelSelect = (selectedList,record,index) => {
        let {  gridData  } = this.props.dataMaintainStore.table;
        // 如果在回调中增加setState逻辑，需要同步data中的_checked属性。即下面的代码
        const allChecked = selectedList.length == 0?false:true;
        // record为undefind则为全选或者全不选
        if(!record) {
            gridData.forEach(item=>{
                item._checked = allChecked;
            })
        }
        else{
            gridData[index]['_checked'] = record._checked;
        }
        this.setState({
            selectData: selectedList
        })
    }

    // 分页单页数据条数选择函数
    onPageSizeSelect = (index, value) => {
        this.setState({
            pageSize: value,
            pageIndex: 1
        })
        this.getRequestTable(this.state.id, 1, value);
    }

    // 分页组件点击页面数字索引执行函数
    onPageIndexSelect = (value) => {
        this.setState({
            pageIndex: value,
        });
        this.getRequestTable(this.state.id, value, this.state.pageSize);
    }

    changeModalFlag = (flag) => {
        let delArr = this.state.selectData;
        if(flag === `downloadData` && delArr.length === 0){
            flag = `downloadAllData`;
        }
        this.setState({
            modalType : flag,
            delData: delArr,
            finalUrl : ``
        })
    }
    closeModal = () => {
        this.setState({
            modalType :``,
            downloadUrl : ``,
        })
    }
    confirmModal = async(flag) => {
        let { delData,id ,pageIndex ,pageSize, selectData} = this.state;
        let { total } = this.props.dataMaintainStore.table;
        if (flag === 'delete') {

            let para = [];
            for (let i = 0; i < delData.length; i++) {
                para.push(delData[i].mdm_code);
            }
            const delTotal = delData.length;
            let pageNumber = pageIndex;
            if((total-delTotal) % pageSize === 0 && pageNumber > 1) {
                pageNumber--;
            }
            para = para.join(',');
            await this.props.dataMaintainStore.deleteItems(this.props.match.params.id, para);
            this.getRequestTable(id, pageNumber, pageSize);
            this.setState({
                modalType : ``,
                delData: [],
                selectData: []
            })
            return null;
        }
        else if(flag === 'seal' || flag === 'unseal' ) {
            let mdmCodes;
            let codesArr = [];
            for (let i = 0; i < selectData.length; i++) {
                codesArr.push(selectData[i].mdm_code);
            };
            mdmCodes = codesArr.join(',');
            await this.props.dataMaintainStore.sealStateChange(this.props.match.params.id, flag, mdmCodes);
            this.getRequestTable(id, pageIndex, pageSize);
            this.setState({
                modalType : ``,
                selectData : []
            })
        }
        else if(flag === 'downloadData' || flag === 'downloadAllData') {
            await this.download();
            this.setState({
                modalType : ``,
            })
        }
        else if(flag === 'downloadFile' ) {
            window.open(this.state.downloadUrl)
            this.setState({
                // finalUrl : this.state.downloadUrl,
                modalType : ``,
                downloadUrl : ``,
            })
        }
        else if(flag === 'downloadPic' ) {
            window.open(this.state.downloadUrl)
            this.setState({
                // finalUrl : this.state.downloadUrl,
                modalType : ``,
                downloadUrl : ``,
            })
        }
    }

    //下载按钮
    download = async() => {
        let pk_gd = `pk_gd=${this.props.match.params.id}`;
        let condition = `1=1`;
        let searchCondition = this.state.condition;
        if(searchCondition){
            condition = `cond=${searchCondition}`;
        }

        if(this.state.selectData.length === 0){
            window.open(`${GLOBAL_HTTP_CTX}/modeling/mdmshow/list/download?${pk_gd}&${condition}`)
            // this.setState({
            //     finalUrl : `${GLOBAL_HTTP_CTX}/modeling/mdmshow/list/download?${pk_gd}&${condition}`
            // })
            return;
        }
        let temp = [];
        this.state.selectData.map( ( item ) => {
            temp.push(`'${item.mdm_code}'`);
        })
        condition = `cond=mdm_code in (${temp.join(',')})`;
        console.log(condition)
        const url = `${GLOBAL_HTTP_CTX}/modeling/mdmshow/list/download?${pk_gd}&${condition}`;
        window.open(url)
        // this.setState({
        //     finalUrl : url
        // })
        return ;
    }

    // 点击图片/文件下载
    downloadFile = (record, key, url, type) => {
        if(!url){
            return null;
        }
        this.setState({
            downloadUrl : url,
        })
        if(type === 'picture'){
            this.changeModalFlag('downloadPic');
        }
        else {
            this.changeModalFlag('downloadFile');
        }
    }

    // 搜索操作
    search = (condition) => {
        this.setState({
            condition: condition
        })
        // this.getRequestTable(this.state.id, 1, this.state.pageSize, condition);
        let gdCode = this.state.id || this.props.match.params.id;
        this.props.dataMaintainStore.getTableRequest(gdCode, 1, this.state.pageSize, condition)
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
            let msg = operation == 'submit' && this.props.intl.formatMessage({ id: "js.rou.hom.0015", defaultMessage: "单据提交成功" }) || this.props.intl.formatMessage({ id: "js.rou.hom.0016", defaultMessage: "单据撤回成功" });
            success(msg);
            this.getRequestTable(this.props.match.params.id);
            this.setState({
                loadingFlag: false
            })
        }
    }
  /**
 *
 * @description 提交失败和结束执行的函数
 * @param {string,string} operation为submit recall type 为error、end
 */
  bpmEnd = (operation, type) => async (error) => {
      if (type == 'error') {
          Error(error.msg);
      }
      this.setState({
          loadingFlag: false
      })
  }

  getHoverContent = () => {
      let _this=this;
      let {currentIndex,currentRecord} = this.state;
      const historyInfo = this.props.dataMaintainStore.historyInfo;
      const isWorkFlow = this.props.dataMaintainStore.designInfo.isworkflow;
      const data = this.props.dataMaintainStore.realTable && this.props.dataMaintainStore.realTable.gridData[currentIndex];
      const code = this.props.dataMaintainStore.designInfo.code;
      const obj = {
          pk_gd: this.props.match.params.id,
          main: JSON.stringify(data),
          sub:''
      }
      const objRecall = {
          pk_gd: this.props.match.params.id,
          mdm_code: currentRecord && currentRecord.mdm_code
      }
        const btnChange = (
            <li className='op-btn op-btn-change' onClick={() => { this.cellClick(currentRecord, currentIndex, 1) } }><FormattedMessage id="js.rou.hom.0017" defaultMessage="编辑" /></li>
        )
        const btnCopy = (
            <li className='op-btn op-btn-copy' onClick={() => { this.cellClick(currentRecord, currentIndex, 2) } }><FormattedMessage id="js.rou.hom.0018" defaultMessage="复制" /></li>
        )
        const btnProcess = (
            <li className='op-btn op-btn-process' onClick={() => { this.processClick(currentRecord) }}><FormattedMessage id="js.rou.hom.0005" defaultMessage="查看流程" /></li>
        )
        const btnHistory = (
            <li className='op-btn op-btn-history' onClick={() => { this.historyClick(currentRecord) }}><FormattedMessage id="js.rou.hom.0006" defaultMessage="历史记录" /></li>
        )
        const btnSubmit = (
            <li className='op-btn op-btn-submit' >
            <BpmButtonSubmit
                        className="ml8"
                        funccode={code}
                        nodekey="003"
                        url={`/iuapmdm/modeling/mdmshow/flowdata/submit`}
                        urlAssignSubmit={`/iuapmdm/modeling/mdmshow/flowdata/assignSubmit`}
                        params={obj}                        // url={`${GROBAL_HTTP_CTX}/purchase_order/submit`}
                        // urlAssignSubmit={`${GROBAL_HTTP_CTX}/purchase_order/assignSubmit`}
                        onStart={_this.bpmStart('submit', 'start')}
                        onSuccess={_this.bpmStart('submit', 'success')}
                        onError={_this.bpmEnd('submit', 'error')}
                        onEnd={_this.bpmEnd('submit', 'end')}
                    >
                        <span className="ml8"  size='sm' colors="primary">
                        <FormattedMessage id="js.rou.hom.0019" defaultMessage="提交" />
                        </span>
                    </BpmButtonSubmit>
            </li>
        )
        const btnRecall = (
            <li className='op-btn op-btn-recall' >
            <BpmButtonRecall
                            params={objRecall}
                            url={`/iuapmdm/modeling/mdmshow/flowdata/unsubmit`}
                            onStart={_this.bpmStart('recall', 'start')}
                            onSuccess={_this.bpmStart('recall', 'success')}
                            onError={_this.bpmEnd('recall', 'error')}
                            onEnd={_this.bpmEnd('recall', 'end')}
                        >
                            <span className="ml8" size='sm' colors="primary">
                            <FormattedMessage id="js.rou.hom.0020" defaultMessage="收回" />
                            </span>
                        </BpmButtonRecall>
            </li>
        )
        const btnVerify = (
            <li className='op-btn op-btn-verify' onClick={() => {alert('verify')} }><FormattedMessage id="js.rou.hom.0021" defaultMessage="审核" /></li>
        )
        if(currentRecord) {
            const status = currentRecord.mdm_datastatus;
            if(isWorkFlow && this.props.dataMaintainStore.designInfo.wflowEndUser) {
                if(status===0){
                    return (
                        <ul className="display-flex handle-btn-group">
                            {btnSubmit}
                            {btnChange}
                            {btnCopy}
                            {btnHistory}
                        </ul>
                    )
                }
                else if(status===1) {
                    return (
                        <ul className="display-flex handle-btn-group">
                            {btnCopy}
                            {btnProcess}
                            {btnHistory}
                        </ul>
                    )
                }
                else if(status===2) {
                    return (
                        <ul className="display-flex handle-btn-group">
                            {btnChange}
                            {btnCopy}
                            {btnProcess}
                            {btnHistory}
                        </ul>
                    )
                }
                else if(status===3) {
                    return (
                        <ul className="display-flex handle-btn-group">
                            {btnChange}
                            {btnCopy}
                            {btnProcess}
                            {btnHistory}
                        </ul>
                    )
                }
                else if(status===4) {
                    return (
                        <ul className="display-flex handle-btn-group">
                            {btnCopy}
                            {btnProcess}
                            {btnHistory}
                        </ul>
                    )
                }else if(status===5) {
                  return (
                  <ul className="display-flex handle-btn-group">
                      {btnRecall}
                      {btnCopy}
                      {btnProcess}
                      {btnHistory}
                  </ul>
                )
                }
            }
            else {
                if(status===4){
                    return (
                        <ul className="display-flex handle-btn-group">
                            {btnCopy}
                            {btnHistory}
                        </ul>
                    )
                }
                return (
                    <ul className="display-flex handle-btn-group">
                        {btnChange}
                        {btnCopy}
                        {btnHistory}
                    </ul>
                )
            }
        }
        return null;
    }

    onRowHover = (index, record) => {
        this.setState({
            currentIndex : index,
            currentRecord : record,
        })
    }
    getBtnFlag = ( arr ) => {
        let flag ={
            sealFlag : 0,
            unSealFlag : 0,
            delFlag : 0
        };

        if(arr.length){
            for(let i=0; i<arr.length; i++){
                let status = arr[i].mdm_datastatus;
                flag.sealFlag += (status === 3?1:0);
                flag.unSealFlag += (status === 4?1:0);
                flag.delFlag += (status === 4 || status === 5 || status === 1? 1 : 0 );
            }
        }
        else{
            flag.delFlag = -1;
        }
        return flag;
    }

    dealTooptip = ( arr ) => {
        if(arr[2] && arr[2].key==='mdm_version'){
            arr.splice(2,1);
        }
        arr.map( ( item , index) => {
            if(item.render){
                return null;
            }
            let key = item.key;
            item.render = (text, record, index) => {

                // console.log(record);
                let r = record;
                let url; // = `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/download?saveAddr=${record[`${key}_picAddress_`]}`;
                let overlayInfo;
                let showText;
                let type = ``;
                if(record[`${key}_fullPicName_`]){
                    let saveAddr = `saveAddr=${encodeURI(record[`${key}_picAddress_`])}`;
                    let fileName = `fileName=${encodeURI(record[`${key}_picAddress_`])}`;

                    let showUrl =  `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/download?${saveAddr}`;
                    type = 'picture';
                    // overlayInfo = (<img className="img-show" src={showUrl}/>);
                    overlayInfo = this.props.intl.formatMessage({id:"js.rou.hom.00369", defaultMessage:"图片预览/下载"});
                    showText = record[`${key}_picName_`];
                    url = `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/download?${saveAddr}&${fileName}`;
                }
                else if(record[`${key}_fullFileName_`]){
                    let saveAddr = `saveAddr=${encodeURI(record[`${key}_fileAddress_`])}`;
                    let fileName = `fileName=${encodeURI(record[`${key}_fileAddress_`])}`;
                    type = 'file';
                    // overlayInfo = text;
                    overlayInfo = this.props.intl.formatMessage({id:"js.rou.hom.00366", defaultMessage:"文件下载"});
                    showText = record[`${key}_fileName_`];
                    url = `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/download?${saveAddr}&${fileName}`;
                }
                else {
                    overlayInfo = text;
                    showText = text;
                    url = null;
                }
                return (
                  <span className='table-detail-block'>
                      <Tooltip inverse overlay={overlayInfo}  placement="bottom" >
                        <span tootip={overlayInfo}
                            onClick = { ()=> {this.downloadFile(r,key,url,type) }}
                            className = {`table-tooltip table-tooltip-${type}`}>
                          {showText}
                        </span>
                      </Tooltip>
                  </span>
                )
            }
        })
    }

    // 去启用
    startUsing = () => {
        const id = this.props.match.params.id;
        createTab({
            id: "mdm_data_model",
            router: `/iuapmdm_fr/model-management/entity-model.html#/leaf/${id}?modulefrom=sidebar`,
            title: '数据模型',
            title2:`Data model`,
            title3:`數據模型`,
        })
    }
    showDataImport = () => {
        this.setState({
            showDataImporModal: true,
            showIframe: true,
            importActive: true
        },() => {
            let oThis = this;
            let iframeOnloadFun = ()=>{
                try {
                    let html = oThis.refs.iload.contentWindow.document.body.innerHTML;
                    var regex = /<\s*\/?\s*[a-zA-z_]([^>]*?["][^"]*["])*[^>"]*>/g;
	                html = html.replace(regex,"");
                    if(!html) {
                        return;
                    }
                     console.log(html,html.split('#bl#'));
                    this.setState({
                        dataImportArr :html.split('#bl#')
                    },() =>{
                        let bodyHeight = document.getElementById("importBody").offsetHeight;
                        let modelHeight = document.getElementById("importContent").offsetHeight;
                        if(modelHeight >= bodyHeight) {
                        document.getElementById("importBody").scrollTop = modelHeight - bodyHeight;
                        }
                    })
                    // 处理数据
                    let endFlag  = html.indexOf('COMPLETE') > -1;
                    if(endFlag){
                        this.setState({
                        showIframe: false,
                        importActive: false
                        })
                        clearInterval(oThis.interFun);
                    }
                  } catch{

                  }


            }
            iframeOnloadFun();
            oThis.interFun = setInterval(() =>{
            iframeOnloadFun();
            },400)
        })
    }
    closeImportModal = () => {
      this.setState({
        showDataImporModal: false,
        dataImportArr:[],
      })
      this.getRequestTable(this.state.id, 1, 10);
    }
     render() {
        const { isShow } = this.props.dataMaintainStore;
        if(!isShow) {
            return null;
        }
        if (!this.props.dataMaintainStore.designInfo) {
            return (
                <div className="no-data-display">
                    <div>
                        <img src={imgUrl} className="pic"></img>
                    </div>
                    <div className="word">
                        <FormattedMessage id="js.rou.hom.0022" defaultMessage="该主数据没有实体，请先在实体建模中添加主数据实体" />
                    </div>
                    <div>
                        <Button
                            className="btn"
                            onClick = { ()=> { this.startUsing()}}
                        >
                            <FormattedMessage id="js.rou.hom.0024" defaultMessage="去启用" />
                        </Button>
                    </div>
                </div>
            );
        }
        const self = this;
        let { list, showLoading } = this.props;

        let { selectData, downloadUrl,  modalType, pageIndex, pageSize,showDataImporModal,showIframe,dataImportArr,importActive } = this.state;
        let { header, gridData, total, pageCount } = this.props.dataMaintainStore.table;
        let stopAllBtn, stopWriteBtn;
        if( this.props.dataMaintainStore.modelInfo.entitys ){
            stopAllBtn =  this.props.dataMaintainStore.modelInfo.entitys[0].head.stopAllBtn;
            stopWriteBtn = this.props.dataMaintainStore.modelInfo.entitys[0].head.stopWriteBtn;
        }
        let totalPages = pageCount;
        this.columns = this.mapTableHeader(header || [])
        this.dealTooptip(this.columns);
        let tableDataSource = gridData;
        let btnFLag = this.getBtnFlag(this.state.selectData);
        let sealFlag = btnFLag.sealFlag;
        let unSealFlag = btnFLag.unSealFlag;
        let delFlag = btnFLag.delFlag;
        let wflowStartUser = this.props.dataMaintainStore.designInfo.wflowStartUser;
        let showSeniorSearch = true;
        let showDataImport = this.props.dataMaintainStore.designInfo.pk_obinfo;
        let headerF = this.props.dataMaintainStore.realTable.header;
        let items = [];
        let url = "/iuapmdm/integrate/data/nc/whole?pk_gd="+this.props.match.params.id;
        let searchUrl = '/modeling/mdmshow/list/advSearch';
        if(dataImportArr.length > 0) {
          for (var i = 0; i < dataImportArr.length; i++) {
            if(dataImportArr[i] === '') {
              continue;
            }
            items.push(<TimelineItem>{dataImportArr[i]}</TimelineItem>)
          }
        }
        headerF.map(item =>{
            if( item && item.queryatt ) {   // item.queryatt
                showSeniorSearch = false;
            }
        })
        if(stopAllBtn){
            return (
                <div className="no-data-display">
                    <div>
                    <img src={imgUrl} className="pic"></img>
                    </div>
                    <div className="word">
                        <FormattedMessage id="js.rou.hom.0025" defaultMessage="当前用户无查看该主数据的权限" />
                    </div>
                </div>
            )
        }
        if (this.props.dataMaintainStore.designInfo.state !== 1) {
            return (
                <div className="no-data-display">
                    <div>
                        <img src={imgUrl} className="pic"></img>
                    </div>
                    <div className="word">
                        <FormattedMessage id="js.rou.hom.0026" defaultMessage="该主数据没有启用模型，请先在实体建模中启用主数据模型" />
                    </div>
                    <div>
                        <Button

                            className="btn"
                            onClick = { ()=> { this.startUsing() }}
                        >
                            <FormattedMessage id="js.rou.hom.0024" defaultMessage="去启用" />
                        </Button>
                    </div>
                </div>
            );
        }
        return (
            <div className='data-maintenance-root'>
                {/* 搜索与查询组件 */}
                {
                    !showSeniorSearch ?
                    <SearchArea
                        {...this.props}
                        pageIndex={this.state.pageIndex}
                        pageSize={this.state.pageSize}
                        condition={this.state.condition}
                        search={this.search}
                    /> : null
                }
                {/* 按钮组 */}
                <div className='table-header mt4'>
                    <ButtonGroup className='header-btn-group'>
                        <Button colors="primary"
                            disabled={stopWriteBtn || !wflowStartUser}

                            onClick={() => { self.cellClick({}, -1, 0) }}>
                            <FormattedMessage id="js.rou.hom2.0018" defaultMessage="新增" />
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup className='header-btn-group' style={{ margin: 10 }}>
                        <Button
                            disabled={sealFlag<1 || stopWriteBtn}

                            onClick = { () => { self.changeModalFlag(`seal`)}}>
                            <FormattedMessage id="js.rou.hom.0028" defaultMessage="封存" />
                        </Button>
                        <Button
                            disabled={unSealFlag<1 || stopWriteBtn}

                            onClick = { () => { self.changeModalFlag(`unseal`)}}>
                            <FormattedMessage id="js.rou.hom.0029" defaultMessage="解封" />
                        </Button>
                        <Button
                            colors="primary"

                            disabled={delFlag!==0 || stopWriteBtn}
                            onClick={() => { self.changeModalFlag(`delete`) }}
                            >
                            <FormattedMessage id="js.rou.hom.0030" defaultMessage="删除" />
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup className='header-btn-group'>
                        <Button

                            onClick = { () => {self.changeModalFlag('downloadData')}}
                            shape="border"
                            >
                            <FormattedMessage id="js.rou.hom.0031" defaultMessage="下载" />
                        </Button>
                    </ButtonGroup>
                    {
                        showSeniorSearch ?
                            <ButtonGroup className='header-btn-group'>
                                <SeniorSearch
                                    title={this.props.intl.formatMessage({id:"js.rou.hom.0032", defaultMessage:"高级查询"})}
                                    pk_gd={this.props.match.params.id}
                                    getData={this.search}
                                    size=""
                                    url={searchUrl}
                                    className='header-btn btn-download'
                                    needEscape= { true }
                                />
                            </ButtonGroup>: null
                    }
                    {
                        showDataImport ?
                            <ButtonGroup className='import-btn-group '>
                            <Tooltip inverse overlay={this.props.intl.formatMessage({ id: "js.rou.hom.00370", defaultMessage: "开箱即用模型的数据同步" })} placement="bottom" >
                                <span >
                                <Button
                                    bordered

                                    onClick={() => self.showDataImport(this.props.match.params.id)}
                                >
                                    {this.props.intl.formatMessage({ id: "js.rou.hom.00364", defaultMessage: "同步数据" })}
                                </Button>
                                </span>
                                </Tooltip>
                            </ButtonGroup> : null
                    }
                </div>
                {/* 展示表格 */}
                <PaginationTable
                    data={tableDataSource}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    total={total}
                    columns={this.columns}
                    checkMinSize={6}
                    hoverContent={this.getHoverContent}
                    onRowHover = {this.onRowHover}
                    getSelectedDataFunc={this.tabelSelect}
                    onTableSelectedData={this.onTableSelectedData}
                    onPageSizeSelect={this.onPageSizeSelect}
                    onPageIndexSelect={this.onPageIndexSelect}
                />
                <Modal
                    show={modalType !== `` }
                >
                    <Modal.Header>
                        <Modal.Title>
                            {this.modalInfo[modalType].title}
                            </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        { modalType === 'downloadPic' ?
                        <img  src={downloadUrl} className='img-download-tips'/>
                        : this.modalInfo[modalType].desc}
                        </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.closeModal()} bordered style={{ marginRight: 15 }}><FormattedMessage id="js.tre.tre.0008" defaultMessage="取消" /></Button>
                        <Button onClick={() => this.confirmModal(modalType)} >
                        {this.modalInfo[modalType].confirmText}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showDataImporModal}
                    className="show-data-import-modal"
                    onHide = { this.closeImportModal }
                >
                    <Modal.Header closeButton>
                        <Modal.Title><FormattedMessage id="js.rou.hom.00361" defaultMessage="数据导入进度" /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="importBody">
                        {
                            showIframe?<iframe width="100%" ref="iload"  style={{"display":'none'}}
                                src={url}>
                            </iframe> :""
                        }
                    <Timeline color="red" id="importContent">
                      { items }
                    </Timeline>
                    </Modal.Body>
                    <Modal.Footer>
                        {
                        items.length>0 ? <div>
                         <ProgressBar active={importActive} size="sm" now = {100} colors="primary"/>
                         <div className="import-title">{importActive?this.props.intl.formatMessage({id:"js.rou.hom.00362", defaultMessage:"数据导入中..."}) : this.props.intl.formatMessage({id:"js.rou.hom.00363", defaultMessage:"数据导入完成"})}</div>
                         </div>:''
                       }
                    </Modal.Footer>
                </Modal>
                <iframe src={this.state.finalUrl || ''} style={{display:'none'}}></iframe>
                <Loading show={this.state.loadingFlag} loadingType='line'/>
            </div>
        )
    }
}
export default injectIntl(DataMaintenanceRoot, {withRef: true});
