

import {
  observable,
  action
} from 'mobx'
import request from 'utils/request.js'

export default class SocialDataStore {
  @observable socialData = {
    corpnfo:{

    },
  }

  @observable BaseInfoURL = {
    confInfo:{

    },
  }

  @observable ItemsForQueryForm = {
    queryItems : []
  }

  @observable queryItemColumnByItfPK = {
    queryCode : ''
  }

  // 请求企业列表所属url接口的信息
  @action getBaseInfoURL(groupNum, groupOrder) {
    return new Promise((resolve, reject) => {
      request('/socialmng/socialitf/getPkGdByConfig', {
        method: "GET",
        param: {
          groupNum : groupNum,
          groupOrder : groupOrder
        }
      }).then((resp) => {

        this.BaseInfoURL = {
          confInfo: resp.data.data,
        }
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }

  // 根据pk_gd来查询对应主数据的查询项
  @action getRequestQueryItems(pkGd) {
    return new Promise((resolve, reject) => {
      request('/socialmng/socialitf/getRequestQueryItemsByPkGd', {
        method: "GET",
        param: {
          pk_gd : pkGd,
        }
      }).then((resp) => {
        var data = resp.data.obj;
        this.ItemsForQueryForm = {
          queryItems : data,
        }
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }

  // 根据pk_gd来查询对应主数据的查询项
  @action getQueryItemColumnByItfPK(pk_itf) {
    return new Promise((resolve, reject) => {
      request('/socialmng/socialitf/getQueryItemColumnByItfPK', {
        method: "GET",
        param: {
          pk_itf : pk_itf,
        }
      }).then((resp) => {
        var data = resp.data.obj;
        this.queryItemColumnByItfPK = {
          queryCode : data.code,
        }
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }

  @action getCompanyInfo(baseinfo,corpName) {
    return new Promise((resolve, reject) => {
      request('/socialmng/clientportrait/detailforselected', {
        method: "GET",
        param: {'code':baseinfo,'corpName':corpName,'pageSize':'10','pageIndex':'1'}
      }).then((resp) => {
        this.socialData = {
            corpInfo: resp.data.obj,
          }
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }

  @observable intelligentMaintainData = {
    intelligentMaintainList: [],
    pageIndex:'0',
    pageSize:'5',
    totalPages:0
  }

  // 社会化主数据接口
  @action getBankDot(pageIndex =0, pageSize=5) {
    return new Promise((resolve, reject) => {
      get('/apilink/getBankDot', {pageIndex, pageSize}).then((resp) => {
        this.socialData.socialDataList = (resp.data&&resp.data.content)||[]
        this.socialData.totalPages = (resp.data&&resp.data.totalPages)||0
        resolve()
      }).catch(reject)
    })
  }

  // 智能维护客商列表接口
  @action getListMdmCorpByPage(pageIndex =0, pageSize=5) {
    return new Promise((resolve, reject) => {
      get('/tenant/listMdmCorpByPage', {pageIndex, pageSize}).then((resp) => {
        this.intelligentMaintainData.intelligentMaintainList = (resp.data&&resp.data.content)||[]
        this.intelligentMaintainData.totalPages = (resp.data&&resp.data.totalPages)||0
        resolve()
      }).catch(reject)
    })
  }

  // 智能维护客商列表接口
  @action saveSignCorpMdm(corpId) {
    return new Promise((resolve, reject) => {
      post('/tenant/signCorpMdm', {corpId},{}).then((resp) => {
        resolve()
      }).catch(reject)
    })
  }


}
