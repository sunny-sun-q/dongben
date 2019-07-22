import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from "react";
import Form from 'bee-form';
import { Icon, Tooltip,  Modal, Loading } from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import 'bee-table/build/Table.css';
import { toJS } from 'mobx'
import {BpmButtonSubmit, BpmButtonRecall} from 'yyuap-bpm';
import { inject, observer } from 'mobx-react';
import {success,Error,getContextId} from 'utils';
import './index.less';
import {Button} from 'components/tinper-bee';

@inject((stores) => {
    return {
      treeStore: stores.treeStore,
      dataMaintainStore: stores.dataMaintainStore,
      dataEditStore: stores.dataEditStore,
      dataHistoryStore : stores.dataHistoryStore,
    }
  })
class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,  // 从1开始
            pageSize: 10,
            historyHeader: [],
            historyData: [],
            selectedRowIndex: null,
            selectedData: {},    // 已经选择的数据,回溯时使用
            old_main: {},
            showModal: false,
            btnDisabled : false,    // 回溯按钮是否可用
            loadingFlag : false,
        }
        this.obj = {}
        this.mdmNowUrl = window.mdmNowUrl + '';
    }
    componentWillMount = async () => {
        this.update();
        const dataStatus = this.props.dataHistoryStore.historyOld.mdm_datastatus;
        const isWorkFlow = this.props.dataHistoryStore.modelInfo.designInfo.isworkflow;
        if(dataStatus !== 3 ) {
            this.setState({
                btnDisabled : true,
            })
        }
    }
    componentWillReceiveProps = () => {
    }
    componentDidMount = () => {
        let old = toJS(this.props.dataHistoryStore.historyOld);
        this.setState({
            old_main: old,
        })
    }
    update = async () => {
        this.props.dataHistoryStore.historyHeader = [];
        this.props.dataHistoryStore.historyData = [];
        await this.props.dataHistoryStore.getHistoryData(this.props.match.params.id,this.props.match.params.mdmcode);
        let header = this.props.dataHistoryStore.historyHeader;
        let data = this.props.dataHistoryStore.historyData;
        this.setState({
            historyHeader: header,
            historyData : data,
            selectedRowIndex: null,
            selectedData: {},
        })
    }
    close = ()=> {
        this.setState({
            showModal: false
        });
    }
    open = ()=> {
        this.setState({
            showModal: true
        });
        let data = {...this.state.selectedData};
        data.mdm_version = this.props.dataHistoryStore.historyOld.mdm_version;
        this.obj = {
            pk_gd : this.props.match.params.id,
            main : data,
            submitType : 'toback'
        }
    }
    confirm = async() => {
        let old_main = this.state.old_main;
        let data = {...this.state.selectedData};
        let mdm_version = this.props.dataHistoryStore.historyOld.mdm_version;
        data.mdm_version = mdm_version;
        await this.props.dataHistoryStore.saveHistoryData(this.props.match.params.id, data, old_main);
        this.props.dataHistoryStore.historyOld++;
        console.log(data, old_main);
        this.setState({
            showModal: false
        });
        // this.update();
        this.onBack();
    }

    onBack = async() => {
        window.location.href = this.mdmNowUrl;
        // window.history.go(-1);
    }

    onRowClick = (record, index, indent) => {
        console.log(record); // 参数:缺ckr属性
        let temp = record;
        temp.ckr = false;
        this.setState({
            selectedRowIndex: index,
            selectedData: temp
        })
    }


    changeRowIndex = (record,index,indent)=>{
        if (this.state.selectedRowIndex == index) {
            return 'row-selected table-row';
        } else {
            return 'table-row';
        }
      }
    dealTooptip = ( arr ) => {
        arr.map( ( item ) => {
            item.render = (text, record, index) => {
                let reg =   /\w+#\w+/;
                if(reg.test(text)){
                    let str = text.split('#')[1];
                    // 展示图片
                    return (
                        <Tooltip inverse overlay={text} placement="bottom" >
                            <span tootip={text}
                                style={{
                                    display: "inline-block",
                                    width: `${item.width}px`,
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    verticalAlign: "middle",
                                }}>
                                {str}
                            </span>
                        </Tooltip>
                    )
                }
                return (
                  <Tooltip inverse overlay={text}  placement="bottom" >
                    <span tootip={text}
                      style={{
                        display: "inline-block",
                        width: `${item.width}px`,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}>
                      {text}
                    </span>
                  </Tooltip>
                )
            }
        })
    }

    bpmStart = (operation, type) => async () => {
        if (type == 'start') {
            this.setState({
                loadingFlag: true
            })
        } else {
            let msg = operation == 'submit' && this.props.intl.formatMessage({ id: "js.rou.hom.0015", defaultMessage: "单据提交成功" }) || this.props.intl.formatMessage({ id: "js.rou.hom.0016", defaultMessage: "单据撤回成功" });
            success(msg);
            this.setState({
                loadingFlag: false
            })
            this.onBack();
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

    isEmpty = (obj) => {
        for (let item in obj) {
            return false;
        }
        return true;
    }
    getBlank = (v) => {
        return [{
            title:'',
            width:50,
            dataIndex:'_blank_',
            key:`_blank${v}`,
        }]
    }
    render(){
        const { historyData, historyHeader,_historyHeader } = this.props.dataHistoryStore;
        const stopWriteBtn = this.props.dataMaintainStore.modelInfo.entitys && this.props.dataMaintainStore.modelInfo.entitys[0].head.stopWriteBtn;
        const isWorkFlow = this.props.dataMaintainStore.modelInfo.designInfo && this.props.dataMaintainStore.modelInfo.designInfo.isworkflow;
        let headerArr = this.getBlank(1).concat(toJS(historyHeader)).concat(this.getBlank(2));
        let dataArr = toJS(historyData);
        this.dealTooptip(headerArr);
        let empty = this.isEmpty(this.state.old_main) || this.isEmpty(this.state.selectedData);

        return (
            <div className='data-history'>
               
                <div className="section-wrap-r-header">
                    <div className="main-data-btn-back">
                        <Button  className='head-back' onClick={this.onBack}>
                            <Icon type="uf-anglepointingtoleft"/>
                            <span className='head-back-word'><FormattedMessage id="js.tre.tre.0007" defaultMessage="返回" /></span>
                        </Button>
                    </div>
                    <h5 className="section-wrap-r-title">
                        <FormattedMessage id="js.rou.hom4.0002" defaultMessage="历史记录" />
                    </h5>
                    <div className="main-data-btn">
                        
                        {
                            stopWriteBtn || historyData.length === 1?'':
                            <Button
                            disabled={empty || this.state.btnDisabled || this.state.old_main.mdm_version === this.state.selectedData.mdm_version }
                            className={this.state.old_main.mdm_version === this.state.selectedData.mdm_version? 'u-button-disabled' : ''}
                            size='sm'
                                colors="primary"  onClick={ this.open}>
                                <FormattedMessage id="js.rou.hom4.0003" defaultMessage="数据回溯" />
                            </Button>
                        }
                    </div>
                </div>
                <div className="history-table">
                        <Table
                            columns = { headerArr }
                            data = { dataArr }
                            onRowClick={ this.onRowClick }
                            rowClassName={ this.changeRowIndex }
                            // scroll={{y: 600 }}
                            // className = 'table'
                        />

                </div>
                <Modal
                    show={this.state.showModal}
                    onHide={this.close} >
                    <Modal.Header closeButton>
                        <Modal.Title><FormattedMessage id="js.rou.hom4.0004" defaultMessage="提示" /></Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <FormattedMessage id="js.rou.hom4.0005" defaultMessage="确认回溯" />?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.close} shape="border" style={{ marginRight: 8 }}><FormattedMessage id="js.rou.hom4.0006" defaultMessage="取消" /></Button>

                        {isWorkFlow ?
                            <BpmButtonSubmit
                                funccode={this.props.match.params.id}
                                nodekey="003"
                                url={`/iuapmdm/modeling/mdmshow/flowdata/submit`}
                                urlAssignSubmit={`/iuapmdm/modeling/mdmshow/flowdata/assignSubmit`}
                                params={this.obj}                        // url={`${GROBAL_HTTP_CTX}/purchase_order/submit`}
                                // urlAssignSubmit={`${GROBAL_HTTP_CTX}/purchase_order/assignSubmit`}
                                onStart={this.bpmStart('submit', 'start')}
                                onSuccess={this.bpmStart('submit', 'success')}
                                onError={this.bpmEnd('submit', 'error')}
                                onEnd={this.bpmEnd('submit', 'end')}
                            >
                                <Button >
                                    <FormattedMessage id="js.rou.hom4.0007" defaultMessage="确认" />
                                </Button>
                            </BpmButtonSubmit> :
                            <Button onClick={this.confirm} ><FormattedMessage id="js.rou.hom4.0007" defaultMessage="确认" /></Button>
                        }
                    </Modal.Footer>
                </Modal>
                <Loading show={this.state.loadingFlag} loadingType="line" />
            </div>
        )
    }
}
export default injectIntl(Form.createForm()(History), {withRef: true});
