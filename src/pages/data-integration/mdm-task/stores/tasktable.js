

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
      rowDatas: []
    }

    /**
     * 
     * @param {*} pageSize 
     * @param {*} pageIndex 获取后台数据用于列表展示
     */
    @action getTables(pageSize,pageIndex) {
     
      return new Promise((resolve, reject) => {
        request('/managerJob/listJobs1', {
          method: "GET",
          param: {pageSize,pageIndex}
        }).then((resp) => {

          this.table.info = resp.data.data || []
          this.table.total = resp.data.total

          resolve()
        }).catch(reject)
      })
    }

    /**
     * 
     * @param {*} taskVO 页面收集的远程系统数据 
     */
    @action addTask(taskVO) {
      console.log(values)
      return new Promise((resolve, reject) => {
        request(`/sysRegister/save`, {
          method: "POST",
          data: taskVO,
          formatJSon: true,
          headers: {
            'Content-Type':'application/json'
          }
        }).then((resp) => {
          success(resp.data.msg)
          this.getTables()
        resolve()
        }).catch(reject)
      })
    }

    /**
     * 
     * @param {*} taskVO 
     */
    @action editTask(taskVO) {
      return new Promise((resolve, reject) => {
        request(`/managerJob/modifyJob`, {
          method: "POST",
          data: taskVO,
          formatJSon: true,
          headers: {
            'Content-Type':'application/json'
          }
        }).then((resp) => {

          success(resp.data.msg)
        resolve()
        }).catch(reject)
      })
    }

    /**
     * 
     * @param {*} taskId 
     */
    @action deleteTask(taskId) {

      return new Promise((resolve, reject) => {
        request(`/managerJob/delJob?taskId=${taskId}`, {
          method: "GET",
          param: {}
        }).then((resp) => {
          success(resp.data.msg)
          this.getTables()
        resolve()
        }).catch(reject)
      })
    }

    /**
     * 
     * @param {*} taskId 
     */
    @action startTask(taskId) {

      return new Promise((resolve, reject) => {
        request(`/managerJob/resumeJob?taskId=${taskId}`, {
          method: "GET",
          param: {}
        }).then((resp) => {
          success(resp.data.msg)
          
        resolve()
        }).catch(reject)
      })
    }

    /**
     * 
     * @param {*} taskId 
     */
    @action stopTask(taskId) {

      return new Promise((resolve, reject) => {
        request(`/managerJob/pauseJob?taskId=${taskId}`, {
          method: "GET",
          param: {}
        }).then((resp) => {
          success(resp.data.msg)
          
        resolve()
        }).catch(reject)
      })
    }

    @action setTableChooseItem(datas) {
      this.table.rowDatas = datas
    }

    toJson() {
      return {

      }
    }
  }
