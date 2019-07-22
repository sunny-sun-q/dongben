

import {
  observable,
  action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { success,Error } from 'utils/index.js'


export default class DataMaintainStore {

  @observable table = {
    info: {
      name: '',
      role: '',
      pk_role: '',
      filterCon: '',
      wflowseq: '',
      pk_authority: '',

      //错误提示
      errorName: '',
      errorRole: '',
      isShowTip: false

    },
    //是新增=0，修改=1
    editState: 0,
    //某个主数据的所有的授权模型信息
    allAuthInfo: [],
    //主表授权信息
    mainAuthInfo: [],
    //子表的授权信息
    subAuthInfo: {},

    selectData: [],
  }

  /**
     * 获取主表数据
     * @param {*} pk_gd 
     */
  @action getTableRequest(pk_gd) {
    let condition = "1=1";
    return new Promise((resolve, reject) => {
      request('/dataAuthority/queryDataAuths', {
        method: "GET",
        param: {
          pk_gd,
          pk_category: ''
        }
      }).then((resp) => {
        resp.data.data.forEach((item) => {
          item.key = item.pk_authority;
        });
        this.table.allAuthInfo = resp.data.data;
        resolve()
      }).catch(reject)
    })
  }


  @action createDataAuth(pk_gd) {
    let condition = "1=1";
    return new Promise((resolve, reject) => {
      request('/dataAuthority/createDataAuth', {
        method: "GET",
        param: {
          pk_gd,
          pk_category: ''
        }
      }).then((resp) => {
        this.table.mainAuthInfo = resp.data.data.itemVOs;
        this.table.subAuthInfo = resp.data.data.subItemVOs;
        resolve()
      }).catch(reject)
    })
  }


  @action delDataAuths(pk_authoritys) {
    return new Promise((resolve, reject) => {
      let data = { pk_authoritys };
      request('/dataAuthority/delete', {
        method: "POST",
        data: {
          pk_authoritys: JSON.stringify(data)
        }
      }).then((resp) => {
        resolve()
      }).catch(reject)
    })
  }


  @action save(pk_gd) {
    let data = {};
    data.info = this.table.info;
    data.mainAuthInfo = this.table.mainAuthInfo;
    data.subAuthInfo = this.table.subAuthInfo;
    return new Promise((resolve, reject) => {
      request('/dataAuthority/save', {
        data: {
          data: JSON.stringify(data),
          pk_gd,
        },
        method: 'POST'
      }).then((resp) => {
        resolve()
      }).catch(reject)
    })
  }

  @action update(pk_gd) {
    let data = {};
    data.info = this.table.info;
    data.mainAuthInfo = this.table.mainAuthInfo;
    data.subAuthInfo = this.table.subAuthInfo;
    return new Promise((resolve, reject) => {
      request('/dataAuthority/update', {
        data: {
          data: JSON.stringify(data),
          pk_gd,
        },
        method: 'POST'
      }).then((resp) => {
        resolve()
      }).catch(reject)
    })
  }

  @action changeFilterCon(filterCon) {
    this.table.info.filterCon = filterCon;
  }

  toJson() {
    return {

    }
  }
}
