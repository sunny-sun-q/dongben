

import {
  observable,
  action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { Message } from 'tinper-bee'
import { success, Warning } from 'utils/index.js'

export default class EnumTables {

  @observable qfilter = {
    code:'',
    name:'',
    descri: ''
  }

  @observable tableinfo = {
    outDatas: [{
      pk_enumtype: '',
      orderno: '',
      code: '',
      name: '',
      descri:'',
      enumvalus:[{
        pk_enumvalue: '',
        pk_enumtype: '',
        orderno: '',
        category_code: '',
        code: '',
        name: '',
        enum_value: '',
        descri: ''
      }]
    }], 

    isDisable: true,
    e_type: {
      isShowDelTypeModal: false,
      typeEcho: true,
      typeRecord: {},  
      isShowTypeModal: false,
      opertype: 'start'  
    },
    e_value: {
      isShowDelValueModal: false,
      valueEcho: true, 
      valueRecord: {},
      isShowValueModal: false,
      opertype: 'start' 
    }

  }

  @action getTables(pageIndex, pageSize) {
    this.qfilter.pageIndex = pageIndex
    this.qfilter.pageSize = pageSize

    return new Promise((resolve, reject) => {
      request('/modeling/enum/queryEnumType', {
        method: "GET",
        param: this.qfilter
      }).then((resp) => {   
        let data = resp.data.data;
        data.forEach((item) => {
          item.key = item.pk_enumtype;
          item.enumvalus = []
        });
        this.tableinfo.outDatas = data || []
        resolve()
      }).catch((e) => {

      })
    })
  }

  @action getItemsByOneRecord() {

    let pk_enumtype = this.tableinfo.e_value.valueRecord.pk_enumtype
    let outDatas = this.tableinfo.outDatas
    let index = 0
    for(let i=0; i< outDatas.length; i++){
      if(pk_enumtype === outDatas[i].pk_enumtype){
        index = i
        break;
      }
    }
    return new Promise((resolve, reject) => {
      request('/modeling/enum/queryEnumValue', {
        method: "GET",
        param: {
          pk_enumtype: pk_enumtype,
          selectType: "1"
        }
      }).then((resp) => {
        let data = resp.data.data;
        data.forEach((item) => {
          item.key = item.pk_enumvalue;
        });
        this.tableinfo.outDatas[index].enumvalus = data || []     
        resolve()
      }).catch((e) => {
      })
    })
  }

  @action saveRowEnumType() {
    return new Promise((resolve, reject) => {
      request('/modeling/enum/saveEnumType', {
        method: "POST",
          data: this.tableinfo.e_type.typeRecord,
          formatJSon: true,
          headers: {
            'Content-Type':'application/json'
          }
      }).then((resp) => {
        let e_type = {
          typeEcho: false,
          typeRecord: {},  
          isShowTypeModal: false, 
        }
        this.tableinfo.e_type = e_type
        this.getTables(1, 99999)
        resolve()
      }).catch((e) => {

      })
    })
  }

  // @action startOrStopEnumType() {
  //   let partUrl = ''
  //   if('stop' === this.tableinfo.e_type.opertype){
  //     partUrl = 'stopEnumType'
  //   }
  //   if('start' === this.tableinfo.e_type.opertype){
  //     partUrl = 'startEnumType'
  //   }
  //   return new Promise((resolve, reject) => {
  //     request(`/modeling/enum/${partUrl}`, {
  //       method: "GET",
  //       param: {
  //         pk_enumtype: this.tableinfo.e_type.typeRecord.pk_enumtype
  //       }
  //     }).then((resp) => {
  //       if("success" === resp.data.flag){
  //         this.getTables(1, 99999)
  //       }
  //       resolve()
  //     }).catch(reject)
  //   })
  // }

  @action delEnumType() {
    return new Promise((resolve, reject) => {
      request('/modeling/enum/delEnumType', {
        method: "GET",
        param: {
          pk_enumtype: this.tableinfo.e_type.typeRecord.pk_enumtype
        }
      }).then((resp) => {
        this.tableinfo.e_type.isShowDelTypeModal = false
        this.getTables(1, 99999)
        resolve()
      }).catch((e) => {

      })
    })
  }

  @action saveRowEnumValue() {
    return new Promise((resolve, reject) => {
      request('/modeling/enum/saveEnumValue', {
        method: "POST",
          data: this.tableinfo.e_value.valueRecord,
          formatJSon: true,
          headers: {
            'Content-Type':'application/json'
          }
      }).then((resp) => {           
        this.tableinfo.e_value.isShowValueModal = false
        resolve()
      }).catch((e) => {

      })
    })
  }

  @action startOrStopEnumValue() {
    let partUrl = ''
    if('stop' === this.tableinfo.e_value.opertype){
      partUrl = 'stopEnumValue'
    }
    if('start' === this.tableinfo.e_value.opertype){
      partUrl = 'startEnumValue'
    }
    return new Promise((resolve, reject) => {
      request(`/modeling/enum/${partUrl}`, {
        method: "GET",
        param: {
          pk_enumvalue: this.tableinfo.e_value.valueRecord.pk_enumvalue
        }
      }).then((resp) => {  //success true     
        resolve()   
      }).catch((e) => {

      })
    })
  }

  @action delEnumValue() {
    return new Promise((resolve, reject) => {
      request('/modeling/enum/delEnumValue', {
        method: "GET",
        param: {
          pk_enumvalue: this.tableinfo.e_value.valueRecord.pk_enumvalue,
          pk_enumtype: this.tableinfo.e_value.valueRecord.pk_enumtype
        }
      }).then((resp) => {
        this.tableinfo.e_value.isShowDelValueModal = false
        resolve()
      }).catch((e) => {

      })
    })
  }

  @action setqfilter(qfilter) {
    this.qfilter = qfilter
  }

  toJson() {
    return {

    }
  }
}
