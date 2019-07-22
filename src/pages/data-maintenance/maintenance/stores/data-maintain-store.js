import {
  observable,
  action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { success } from 'utils/index.js'
import { timingSafeEqual } from 'crypto';

export default class DataMaintainStore {
  @observable qfcond = {
    pk_gd: '',
    pk_category: '',
    pk_sys: '',
    opr_state: 1,
    start: '',
    end: '',
    opr_type: 1,
  }

  @observable table = {
    gridData: [],
    header:[],
    total: 0,
    pageCount: 1,
  }

  @observable realTable = {
    gridData: [],
    header:[],
    total: 0,
    pageCount: 1,
  }

  @observable form = []

  @observable tableitem = {
    info: [],
    total: 0,
    totalPages: 1,
    rowDatas: []
  }

  @observable historyInfo = {
    flag : '',
    msg : '',
    data : ''

  }

  @observable designInfo = {
  }

  @observable modelInfo = {}

  // 社会化配置信息
  @observable socialConfig = {}

  @observable isShow = false;
 
  /**
   * 
   * @param {*} pk_gd 获取历史记录显示控制状态
   */
  @action getHistoryInfo(pk_gd){
    let rid = this.getRid();
    return new Promise((resolve, reject) =>{
      request('/modeling/mdmdesign/ishistory',{
        method: "GET",
        param: {
          rid,
          pk_gd
        }
      }).then((resp) =>{
        // console.log(resp)
        this.historyInfo.flag = resp.data.flag;
        this.historyInfo.msg = resp.data.msg;
        this.historyInfo.data = resp.data.data;
        resolve();
      }).catch(reject);

    });
  }

  /**
   *
   * @param {*} pageSize
   * @param {*} pageIndex 获取后台数据用于列表展示
   */
  @action getTables(pageSize, pageIndex, opr_type) {
    this.qfcond.pageSize = pageSize;
    this.qfcond.pageIndex = pageIndex;

    this.qfcond.opr_type = opr_type;

    return new Promise((resolve, reject) => {
      
      request('/modeling/mdmshow/list/query', {
        method: "GET",
        param: this.qfcond
      }).then((resp) => {
        this.table.info = resp.data.data || []
        this.table.total = resp.data.total
        this.table.totalPages = resp.data.pageCount
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 
   * @param {*} pk_gd 
   * @param {*} pageIndex 当前页数
   * @param {*} pageSize  页面规模
   * @param {*} condition 搜索条件
   */
  @action getTableRequest(pk_gd, pageIndex = 1, pageSize = 10, condition = "1=1"){
    console.log("get table info");
    return new Promise((resolve, reject) => {
      if(!condition)
        condition = '1=1'
      request('/modeling/mdmshow/list/query', {
        method: "GET",
        param: {
          pageIndex,
          pageSize,
          pk_gd,
          condition:(condition)
        }
      }).then((resp) => {
        // console.log(resp);
        // this.table.gridData = resp.data.gridData || [];
        this.realTable.header = [].concat(resp.data.header);
        this.table.header = this.changeName(resp.data.header);
        
        let obj = JSON.parse(JSON.stringify(resp.data.gridData))
        this.realTable.gridData = this.changeGridRealData(obj, resp.data.header);
        this.table.gridData = this.changeGridData(resp.data.gridData, resp.data.header);
        
        this.table.pageCount = resp.data.pageCount;
        this.realTable.pageCount = resp.data.pageCount;

        this.realTable.total = resp.data.total;
        this.table.total = resp.data.total;
        
        this.setIsShow(true);
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 主表保存新增数据
   * @param {*} pk_gd
   * @param {*} approver_status
   * @param {*} main
   * @param {*} sub
   */
  @action submitAddTable(pk_gd){
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmshow/card/save`, {
        method: "POST",
        data: {
          pk_gd,
          approver_status,
          main,
          sub
        }
      }).then((resp) => {
        success(resp.data.msg);
        resolve();
      }).catch(reject)
    })
  }

  @action setFormItem(fieldObj){
    console.log(this.table.header)
    fieldObj.map((_field,index)=>{
      this.form.push({
        label:_field.text,
        fieldId:_field.fieldId
      })
    })
  }

  @action getItemsByOneRecord(pageSize,pageIndex) {

    return new Promise((resolve, reject) => {
      request('/ldlog/getDistributeLogItems?pk_log=b7ecbbff-3e2e-452b-80ae-17332dabb82a&rid=1543042388612', {
        method: "GET",
        param: {
          // pk_log,

          pageSize,
          pageIndex
        }
      }).then((resp) => {
        this.tableitem.info = resp.data.subData.data || []
        this.tableitem.total = resp.data.subData.totalElements
        this.tableitem.totalPages = resp.data.subData.totalPages

        resolve()
      }).catch(reject)
    })
  }

  @action setQFCond(qfcond) {
    this.qfcond = qfcond
  }

  @action deleteItems(pk_gd, mdmCodes){
    let rid = this.getRid();
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmshow/list/remove/`,{
        method: "GET",
        param: {
          pk_gd,
          mdmCodes,
          rid
        }
      }).then(( resp ) => {
        // success(resp.data.msg); // 提示 删除成功
        resolve();
      }).catch(reject);
    })
  }

  @action getDesignInfo(pk_gd) {
    let rid = this.getRid();
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmshow/list/model`,{
        method: "GET",
        param: {
          pk_gd,
          rid
        }
      }).then((resp) => {
        ////////
        // resp.data.sotpAllBtn = true
        // resp.data.sotpWriteBtn = true
        // resp.data.wflowStartUser = true
        this.modelInfo = resp.data;
        this.designInfo = resp.data.designInfo;
        resolve();
      }).catch(reject);
    })
  }

  @action sealStateChange(pk_gd, sealType, mdmCodes) {
    let rid = this.getRid();
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmshow/list/seal/`,{
        method: "GET",
        param: {
          pk_gd,
          mdmCodes,
          sealType,
          rid
        }
      }).then((resp) => {
        console.log("success");
        if(resp.data.msg)
          success(resp.data.msg)
        resolve();
      }).catch(reject);
    })
  }

  @action getSocialConfig = (pk_gd) => {
    let rid = this.getRid();
    return new Promise((resolve, reject) => {
      request(`/socialMaintenance/confirmSocial`,{
        method: "GET",
        param: {
          pk_gd,
          rid
        }
      }).then((resp) => {
        if(resp.data.data === 'true') this.socialConfig = resp.data.obj[0];
        resolve();
      }).catch(reject);
    })
  }

  getRid = () => {
    return new Date().getTime();
  }

  changeName = (arr) => {
    // if(!arr)return;
    for(let i=0; i<arr.length; i++) {
      let temp = arr[i].fieldType;
      if(temp && (temp === 8 ||temp ===7 || temp===13)) { // 下拉 参照 枚举 
        arr[i].fieldId += `_name`;
      }
    }
    return arr;
  }
  changeGridData = (gridData, header) => {
    header.map( (value, index, arr) => {
      let item = value.fieldId;
      if(value.fieldType && value.fieldType===3) {
        gridData.map( (value, index, arr) => {
          gridData[index][item] = gridData[index][item] === 1 || gridData[index][item] === true? '是' : '否';
        });
      }
      else if(value.fieldType && value.fieldType===9 ) {
        gridData.map( (value, index, arr) => {
          gridData[index][`${item}_fullPicName_`] = gridData[index][item];
          gridData[index][`${item}_picAddress_`]= gridData[index][item].split("#")[0];
          gridData[index][`${item}_picName_`] = gridData[index][item].split("#")[1];
        });
      }
      else if(value.fieldType && value.fieldType === 10) {
        gridData.map( (value, index, arr) => {
          gridData[index][`${item}_fullFileName_`] = gridData[index][item];
          gridData[index][`${item}_fileAddress_`]= gridData[index][item].split("#")[0];
          gridData[index][`${item}_fileName_`] = gridData[index][item].split("#")[1];
        });
      }
    })
    return gridData;
  }

  changeGridRealData = (gridData, header) => {
    header.map( (value, index, arr) => {
      let item = value.fieldId;
      if(value.fieldType && value.fieldType===3) {
        gridData.map( (value, index, arr) => {
          gridData[index][item] = gridData[index][item] === true ? '1' : '0';
        });
      }
    })
    return gridData;
  }

  setIsShow = ( value ) => {
    this.isShow = value;
  }

  toJson() {
    return {

    }
  }
}
