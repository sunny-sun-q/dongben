

import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'
import { post } from 'utils/request.js'
import { success } from 'utils/index.js'

export default class EntityContentStore {
  @observable tableDatas = {
    columns: [],
    datas: [],
    total:0,
    pageCount:0
  }

  @action reset(){
    this.tableDatas = {
      columns: [],
      datas: [],
      total:0,
      pageCount:0
    }
  }

  @observable queryCondition = {
    opr_state: 1,
    start: '',
    end: '',
  }

  // 参照
  @observable queryForm = {
    column: []   // 后台请求获得的查询项 {title:"请购部门",dataIndex:"orderDeptName",key:"orderDeptName",width:200}
  }

  // 获取企业客商详情的请求
  @action getTableDataRequest( gdCode, condition, pageIndex, pageSize) {
    let encodeCondition = encodeURI(condition)
    return new Promise((resolve, reject) => {
      request('/modeling/mdmshow/list/query', {
        method: "GET",
        param: { pk_gd:gdCode, condition:encodeCondition, pageIndex, pageSize }
      }).then((resp) => {
        this.tableDatas = {
          columns: resp.data.header,
          datas: resp.data.gridData,//mapTableData(resp.data.header, resp.data.data)
          total: resp.data.total || 0,
          pageCount: resp.data.pageCount || 1
        }
        resolve()
      }).catch((e) => {
        this.tableDatas = {
          columns: []
        }
        reject(e)
      })
    })
  }

  // 获取查询字段列表
  @action getQueryFieldList(code) {
    return new Promise((resolve, reject) => {
      request('/socialmng/clientportrait/getquerylist', {
        method: "GET",
        param: { code: code }
      }).then((resp) => {
        if (resp.data.success) {
          this.queryForm.column = resp.data.obj;
        } else {
          // 提示信息
        }
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }


  toJson() {
    return {

    }
  }
}
