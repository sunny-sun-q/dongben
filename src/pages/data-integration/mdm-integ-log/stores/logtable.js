

import {
  observable,
  action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { Message } from 'tinper-bee'
import { success } from 'utils/index.js'

export default class LogTables {

  @observable qfcond = {
    pk_gd: '',
    // pk_category: '',
    pk_sys: '',      
    opr_state: 0, // 1成功2失败
    start: '',
    end: '',
    opr_type: 1  // 1,装载2,分发
  }

  @observable table1 = {
    info: [],
    total: 0,
    totalPages: 1, 
    // rowDatas: [],
    viewDetailPKLOG: ''
  }

  @observable table2 = {  
    isDisabledFailedButton: true, 
    info: [],
    total: 0,
    totalPages: 1, 
    rowDatas: [], // 选中的数据集合list<row>
    pk_logs: '', // 选中的数据集中的分发失败的日志的pk集合
    viewDetailPKLOG: ''
  }

  @observable tableitem1 = {
    info: [],
    total: 0,
    totalPages: 1, 
    // rowDatas: [],
    showLogItemsModal:false
  }

  @observable tableitem2 = {
    info: [],
    total: 0,
    totalPages: 1, 
    // rowDatas: [],
    showLogItemsModal:false
  }

  @action getTables(pageSize, pageIndex) {
    // 实际上获取装载日志和分发日志是同一个接口,由opr_type来区分
    // let url = ''
    // if(1 === this.qfcond.opr_type){
    //   url = '/ldlog/getDistributeLogs1';
    // }
    // if(2 === this.qfcond.opr_type){
    //   url = '/ldlog/getDistributeLogs1';
    // }
    let url = '/ldlog/getDistributeLogs1'
    this.qfcond.pageSize = pageSize;
    this.qfcond.pageIndex = pageIndex;

    return new Promise((resolve, reject) => {

      request(url, {
        method: "GET",
        param: this.qfcond
      }).then((resp) => {
        let data = []
        data = resp.data.data;
        data.forEach((item) => {
          item.key = item.pk_log;
        });

        if(this.qfcond.opr_type === 1 ){
          this.table1.info = data || []
          this.table1.total = resp.data.total || 0
          this.table1.totalPages = resp.data.pageCount || 0
        }
        if(this.qfcond.opr_type === 2 ){
          this.table2.info = data || []
          this.table2.total = resp.data.total || 0
          this.table2.totalPages = resp.data.pageCount || 0
        }
       
        resolve()
      }).catch(reject)
    })
  }

  @action getItemsByOneRecord(pageSize, pageIndex) {

    return new Promise((resolve, reject) => {
      request('/ldlog/getDistributeLogItems', {
        method: "GET",
        param: {
          pk_log: this.qfcond.opr_type === 1 ? (this.table1.viewDetailPKLOG) : (this.table2.viewDetailPKLOG),
          pageSize: pageSize,
          pageIndex: pageIndex  
        }
      }).then((resp) => {

        let data = []
        data = resp.data.subData.data;
        data.forEach((item) => {
          item.key = item.pk_logitem;
        });

        if(this.qfcond.opr_type === 1 ){
          this.tableitem1.info = data || []
          this.tableitem1.total = resp.data.subData.totalElements || 0
          this.tableitem1.totalPages = resp.data.subData.totalPages || 0
        }
        if(this.qfcond.opr_type === 2 ){
          this.tableitem2.info = data || []
          this.tableitem2.total = resp.data.subData.totalElements || 0
          this.tableitem2.totalPages = resp.data.subData.totalPages || 0
        }

        resolve()
      }).catch(reject)
    })
  }

  @action failureToResendMulti() {
    let pk_logs = this.table2.pk_logs
    return new Promise((resolve, reject) => {
      request('/distributeThirdPartService/failureToResendMulti', {
        method: "GET",
        param: {
          pk_logs: pk_logs
        }
      }).then((resp) => {
        let listretvos = resp.data
        let rlt_flag = true
        let retVo = {}
        for(let i=0; i<resp.data.length; i++){
          retVo = resp.data[i];
          if(!retVo.success){// 如果失败自动提示
            rlt_flag = false
            Message.create({content: '重发失败,请检查', color: 'danger'})
          }
        }
        if(rlt_flag){
          Message.create({content: '重发成功', color: 'info'})
        }
        this.getTables(10, 1);
        resolve()
      }).catch(reject)
    })
  }

  @action setQFCond(qfcond) {
    this.qfcond = qfcond
  }

  toJson() {
    return {

    }
  }
}
