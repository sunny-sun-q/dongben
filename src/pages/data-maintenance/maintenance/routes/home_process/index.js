import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from "react";
import { Button, Icon, Loading} from "tinper-bee";
import { inject, observer } from 'mobx-react';
import Card from "../../../../data-management/management/routes/tree_card/card"
import "./index.less";
import { BpmTaskApprovalWrap } from 'yyuap-bpm';
import { toJS } from 'mobx';
import { Error} from 'utils';
import queryString from 'query-string';

@inject((stores) => {
    return {
      dataProcessStore: stores.dataProcessStore,
      cardStore: stores.cardStore,
    }
  })
class Process extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingFlag : false,
        }
        // debugger;
        this.mdmNowUrl = window.mdmNowUrl + '';
    }

    componentDidMount () {
        let id = this.props.match.params.id;
        let flow = this.props.match.params.mdmflow;
        // this.setState
        // this.props.dataProcessStore.foo();
    }
    /**
     *
     * @description 提交初始执行函数
     * @param {string, string} type 为start、success
     * 
        onStart={_this.onBpmStarts}
        onSuccess={_this.onBpmStartss}
        onError={_this.onBpmEnds}
        onEnd={_this.onBpmEndss}
     */
    // onBpmStart = (type) => {
    //     return 123
    // }
    // onBpmStart = async (type) => {//保存
    onBpmStart = (type) => {
    // onBpmStart = (type) => async () => {
    // onBpmStart = async () => {
        console.log(1)
        // return false
        // return this.save()
        // await new Promise((resolve, reject) => {
        //     reject()
            // throw 'save error'
        // })
        if(type == 'agree'){
            if(!this.save()){
                return false
            }
            console.log(2)
            //     console.log(type)
        //     new Promise((resolve, reject) => {
            // if(await this.save()){
            //     console.log('调用成功')
            // }else{
            //     console.log('调用失败')
            // }
        //     })
        }
        this.setState({
            loadingFlag: true
        })
    }
    onBpmSuccess = (type) => {
    // onBpmSuccess = (type) => async () => {
        // debugger
        this.setState({
            loadingFlag: false
        })
        this.onBack1();
    }
    /**
     *
     * @description 提交失败和结束执行的函数
     * @param {string,string} type 为error、end
     */
    onBpmEnd = (type) => {
    // onBpmEnd = (type) => async () => {
        this.setState({
            loadingFlag: false
        })
          // actions.masterDetailOrder.updateState({
          //     showLoading: false
          // })
      }
    onBpmError = () => {
    // onBpmError = (type) => async (error) => {
        Error(error.msg);
    }
    save = async (submitFlag = false, isProcess ) => {//保存
    // save = (submitFlag = false, isProcess ) => {//保存
        // for(let item in this.legal){
        //     if(this.legal[item] === false){
        //         // Message.create({ content: this.props.intl.formatMessage({id:"js.tre.tre.0004", defaultMessage:"数据填写错误"}), color: 'danger' });
        //         return null;
        //     }
        // }
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
            // delete main.mdm_code;
            // delete main.pk_mdm;
            delete main.mdm_version;
            // 删除子表中的mdmcode等信息
            for(let subTableItem in sub){
                sub[subTableItem].map( (item,index) => {
                    // delete item.mdm_code;
                    delete item.mdm_parentcode;
                    // delete item.pk_mdm;
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
            const sys_code = "cmdm";
            // this.props.cardStore.save(id, main, sub, null, {}, old_sub, sys_code);
            await this.props.cardStore.save(id, main, sub, null, {}, old_sub, sys_code);
        // await this.props.cardStore.save(id, main, sub, null, old_main, old_sub);
            // this.onBack();
        }


    }
    /**
   * 返回
   * @returns {Promise<void>}
   */

    onBack1 = async () => {
        // debugger;
        let {from} = queryString.parse(this.props.match.url);
        // const searchObj = queryString.parse(this.props.location.search);
        // let {from} = searchObj;
        if(from === 'taskcenter'|| from === 'msgCenter') {
        window.parent.bpmCloseOrder();
        } else {
        let id = this.props.match.params.id;
        this.props.history.push(`/leaf/${id}/staffflow`);
        // window.location.href = this.mdmNowUrl;
        // window.history.go(-1)
        }
        // const { btnFlag } = this.state;
        // if (btnFlag === 2) { //判断是否为详情态
        //     const searchObj = queryString.parse(this.props.location.search);
        //     let { from } = searchObj;
        //     switch (from) {
        //         case undefined:
        //             this.clearQuery();
        //             actions.routing.replace({ pathname: '/' });
        //             break;
        //         default:
        //             actions.routing.goBack()
        //     }
        //
        // } else {
        //     this.setState({ showPopBackVisible: true });
        // }
    }


    // onBpmEndd = (type) => async (error) => {
    //     if (type == 'error') {
    //         Error(error.msg);
    //     }
    //     this.setState({
    //         loadingFlag: false
    //     })
    //     // actions.masterDetailOrder.updateState({
    //     //     showLoading: false
    //     // })
    // }

    // onBpmStarts = (type, appType) => async () => {
    //     console.log(appType)
    //     let {appType} = queryString.parse(this.props.match.url);
    //     console.log(appType)
    //     if (type == 'start') {
    //         this.setState({
    //             loadingFlag: true
    //         })
    //     } else {
    //         this.setState({
    //             loadingFlag: false
    //         })
    //         this.onBack1();
    //     }
    // }
    /**
   *
   * @param rowData为行数据
   * @memberof AddEditPassenger
   */
    onClickToBPM = (id) => {
        console.log(id)
        // let id = this.props.match.params.id;
        // const searchObj = queryString.parse(this.props.location.search);
        // let { from } = searchObj;
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/process/${id}`);
    }

    onBack = async() => {
      let {from} = queryString.parse(this.props.match.url);
      // const searchObj = queryString.parse(this.props.location.search);
      // let {from} = searchObj;
      // window.history.go(-1);
      if(from === 'taskcenter'|| from === 'msgCenter') {
        window.parent.bpmCloseOrder();
      } else {
        let id = this.props.match.params.id;
        this.props.history.push(`/leaf/${id}/staffflow`);
        // window.location.href = this.mdmNowUrl;
        // window.history.go(-1)
      }
    }
    /**
     *
     *
     * @param {Number} btnFlag
     * @param {*} appType
     * @param {数据id} id
     * @param {*} processDefinitionId 流程定义ID
     * @param {*} processInstanceId 流程实例ID
     * @param {行数据} rowData
     * @returns
     */
    showBpmComponent = (btnFlag, appType, processDefinitionId, processInstanceId, rowData,formId,from,id) => {
        let _this = this;
        let id1 = '';
        if(from === 'taskcenter'|| from === 'msgCenter') {
          id1 = formId;
        } else {
          id1 = (rowData.mdm_code+':'+this.props.match.params.id)
        }
        if(appType === '2') {
          formId = id
        }
        // let id = (rowData.pk_mdm+':'+this.props.match.params.id);
        // btnFlag为2表示为详情
        if((btnFlag == 2)) {
            console.log(appType)
            if(appType === '1') {
                return (
                <div className="process111">
                <BpmTaskApprovalWrap
                    className={123}
                    id={id1}
                    onBpmFlowClick={() => {
                        this.onClickToBPM(id1)
                    }}
                    appType={appType}
                    onStart={_this.onBpmStart}
                    onSuccess={_this.onBpmSuccess}
                    onError={_this.onBpmError}
                    onEnd={_this.onBpmEnd}
                />
                <Loading show={this.state.loadingFlag} loadingType="line" />
                </div>
                )
            }
          if(appType === '2') {
            return (
              <div className="process111">
              <BpmTaskApprovalWrap
                  id={formId}
                  processDefinitionId={processDefinitionId}
                  processInstanceId={processInstanceId}
                  onBpmFlowClick={() => {
                      _this.onClickToBPM(id1)
                  }}
                  appType={appType}
                  onStart={_this.onBpmStart}
                  onSuccess={_this.onBpmSuccess}
                  onError={_this.onBpmError}
                  onEnd={_this.onBpmEnd}
              />
                {/*
                    onStart={_this.onBpmStart('start')}
                    onSuccess={_this.onBpmStart('success')}
                    onError={_this.onBpmEnd('error')}
                    onEnd={_this.onBpmEnd('end')}
                  onStart={_this.onBpmStart}
                  onSuccess={_this.onBpmSuccess}
                  onError={_this.onBpmError}
                  onEnd={_this.onBpmEnd}
                   <Button shape="border"  className='head-btn head-save' onClick={this.save}>
                    <FormattedMessage id="js.tre.tre.0009" defaultMessage="暂存" />
                </Button> */}
              </div>
            )
          }
        }

    }


    render() {
      let _this = this;
      let {appType,processDefinitionId, processInstanceId,formId,from,id} = queryString.parse(this.props.match.url);

      let orderRow = this.props.dataProcessStore.rowData;
      let btnFlag = 2;
        return (
            <div className="data-process">
                <div className="section-wrap-r-header">
                    <div className="main-data-btn-back">
                        <Button  className='head-cancel' onClick={this.onBack}>
                            <Icon type="uf-anglepointingtoleft"/>
                            <FormattedMessage id="js.rou.hom5.0001" defaultMessage="返回" />
                        </Button>
                    </div>
                    <h5 className="section-wrap-r-title">
                        <FormattedMessage id="js.rou.hom5.0002" defaultMessage="审批详情" />
                    </h5>
                </div>
                {
                    _this.showBpmComponent(btnFlag, appType ? appType : "1", processDefinitionId, processInstanceId, orderRow,formId,from,id)
                }
                <Card
                    special = { true }
                    processClassName="data-process-detail"
                />
            </div>
        )
    }



}

export default Process;
