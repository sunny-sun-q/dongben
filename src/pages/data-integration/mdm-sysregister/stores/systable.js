

import {
    observable,
    action,
  } from 'mobx'
import qs from 'qs'
  import request from 'utils/request.js'
  import { success } from 'utils/index.js'

  export default class Systables {
    @observable table = {
      info: [],
      total: 0,
      totalPages: 1,
      record: {},
      isShowModal: false,
      rowDatas: [] // 有多选框时才用到
    }

    @observable modal = {
      showErrorInfo1: false,
      showErrorInfo2: false,
    }

    @action setErrorInfo(value1,value2) {
      this.modal.showErrorInfo1 = value1;
      this.modal.showErrorInfo2 = value2;
    }

    /**
     *
     * @param {*} pageSize
     * @param {*} pageIndex 获取后台数据用于列表展示
     */
    @action getSystables(pageIndex, pageSize) {

      return new Promise((resolve, reject) => {
        request('/sysRegister/query', {
          method: "GET",
          param: {pageIndex, pageSize}
        }).then((resp) => {

          let data = resp.data.data;
          if("" != data && data.length > 0){
            data.forEach((item) => {
              item.key = item.pk_sysregister
              item.radio_type_show = item.radio_type === 'producer' ? '生产者' : item.radio_type === 'comsumer' ? '消费者' : '生产者&消费者'
              // item.dr_show = item.dr === 0 ? '已启用': '已停用'
            });
          }
          this.table.info = data || [];
          this.table.total = resp.data.total;
          this.table.totalPages = resp.data.pageCount;

          resolve()
        }).catch(reject)
      })
    }

    /**
     * 新增远程系统
     * @param {*} values 页面收集的远程系统数据
     */
    @action addSysRegister(values) {
      return new Promise((resolve, reject) => {
        request(`/sysRegister/save`, {
          method: "POST",
          data: values,
          formatJSon: true,
          headers: {
            'Content-Type':'application/json'
          }
        }).then((resp) => {
          if("fail" == resp.data.flag){
            this.table.isShowModal = true
          }else{
            this.table.isShowModal = false
            success(resp.data.msg)
            this.getSystables(1, 10)
          }
        resolve()
        }).catch(reject)
      })
    }

    /**
     * 更新远程系统
     * @param {*} pk_sysregister
     */
    @action editSysRegister(values) {
      return new Promise((resolve, reject) => {
        request(`/sysRegister/update`, {
          method: "POST",
          data: values,
          formatJSon: true,
          headers: {
            'Content-Type':'application/json'
          }
        }).then((resp) => {
          if("fail" == resp.data.flag){
            this.table.isShowModal = true
          }else{
            this.table.isShowModal = false
            success(resp.data.msg)
            this.getSystables(1, 10)
          }
        resolve()
        }).catch(reject)
      })
    }

    /**
     * 删除远程系统, 启用和停止远程系统
     */
    @action deleteSysRegister() {
      let pk_sysregister = this.table.record.pk_sysregister
      return new Promise((resolve, reject) => {
        request(`/sysRegister/delete?pk_sysregister=${pk_sysregister}`, {
          method: "GET",
          param: {}
        }).then((resp) => {
          success(resp.data.msg)
          this.getSystables(1, 10)
        resolve()
        }).catch(reject)
      })
    }

    /**
     * 带多选择框时选中的数据[]
     */
    @action setTableChooseItem(datas) {
      this.table.rowDatas = datas
    }

    /**
     *
     */
    @action updateToken() {
      return new Promise((resolve, reject) => {
        //
        let pk_sysregister =  this.table.record.pk_sysregister
        request(`/sysRegister/refleshToken/${pk_sysregister}`, {
          method: "GET",
          param: {}
        }).then((resp) => {
          if("success" == resp.data.flag){
            this.table.record.token =  resp.data.data.token;// 返回的token
          }

        resolve()
        }).catch(reject)
      })
    }

    toJson() {
      return {

      }
    }
  }
