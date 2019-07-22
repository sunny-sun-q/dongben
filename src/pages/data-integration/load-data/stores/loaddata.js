import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'
import { success } from 'utils/index.js'

export default class Loaddata {
  @observable loadData = {
    table: {
      // header : [ {
      //   dataIndex: "mdm_code",
      //   width: 100,
      //   title: "MDMCODE",
      //   key: "mdm_code"
      // }],
      header:[],
      body:[],
      total:0,
      pageCount:1
    },
    resp: {
      flag: true,
      msg: '',
      fileName: ''
    }
  }

  @action getExcelData(pk_sys, pk_gd, fileName, pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
      let url = '/loadingThirdPartService/getExcelData1'
      request(url, {
        method: "GET",
        param: { pk_sys, pk_gd, fileName, pageIndex, pageSize }
      }).then((resp) => {

        this.loadData.table.body = resp.data.data || []
        this.loadData.table.total = resp.data.total || 0
        this.loadData.table.pageCount = resp.data.pageCount || 0
        resolve(resp.data.data)
      }).catch(reject)
    })
  }


  /**
   *getMasterDataSchema
   *
   * @param {*} gdCode
   * @returns
   * @memberof LoadData
   */
  @action getMasterDataSchema(gdCode) {
    return new Promise((resolve, reject) => {
      request('/distributeThirdPartService/getMasterDataSchema', {
        method: "GET",
        param: { gdCode }
      }).then((resp) => {
        if("success" == resp.data.flag){
          let header = resp.data.header;
          header.map((item, index) => {          
            if("mdm_code" === item.key){          
              item.title = "ID",
              item.key =  "id",
              item.dataIndex =  "id",
              item.width = 100
            }
          })
          this.loadData.table.header = header   
        }
        resolve()
      }).catch((e) => {
        this.loadData.table = {
          header: []
        }
        reject(e)
      })
    })
  }


  /**
   *保存所选装载数据
   *
   * @param {*} postData
   * @returns
   * @memberof LoadData
   */
  @action saveSelected(postData) {
    return new Promise((resolve, reject) => {
      request(`/loadingThirdPartService/saveSelected`, {
        method: "POST",
        data: postData
      }).then((resp) => {
        if(resp.data.isAllSuccess === true){
          success("保存成功!")
        }
        this.loadData.resp = resp.data
        resolve()
      }).catch(reject)
    })
  }

    /**
   *getExcelData
   *
   * @param {*} pageIndex
   * @param {*} pageSize
   * @param {*} pk_sys
   * @param {*} pk_gd
   * @param {*} pk_category
   * @param {*} pk_baktable
   * @param {*} fileName
   * @returns
   * @memberof LoadData
   */
  @action downloadErrorExcel(fileName) {
    return new Promise((resolve, reject) => {
      let url = '/loadingThirdPartService/downloadFile'
      request(url, {
        method: "GET",
        param: { fileName }
      }).then((resp) => {

        resolve()
      }).catch(reject)
    })
  }

  toJson() {
    return {

    }
  }
}
