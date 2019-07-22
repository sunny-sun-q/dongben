

import {
  observable,
  action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { success } from 'utils/index.js'

export default class SysRegister {
  @observable sysrs = {
    rowDatas: []
  }
  
  @observable mdRefTree = [];
  @action getAllSys() {
    return new Promise((resolve, reject) => {
      request(`/combo/getComboData?fullclassname=com.yonyou.iuapmdm.remotesysreg.web.SysregisterCombo`, {
        method: "GET",
        param: {}
      }).then((resp) => {

        // success(resp.data.msg)
        this.sysrs.rowDatas = resp.data || []

        resolve()
      }).catch(reject)
    })
  }

  @action getMdRefTree() {
    return new Promise((resolve, reject) => {
      request('/modeling/category/md-reftree', {
        method: "GET",
      }).then((resp) => {
        let datas = resp.data.data
        function recursionTreeDatas(datas){
          datas.map((item,index)=>{
            item.refname = item.name
            if(item.children.length>0){
              recursionTreeDatas(item.children)
            }else{
              delete item['children']
              item.isLeaf = true
            }
          })
        }
        recursionTreeDatas(datas)
        this.mdRefTree = datas;
        resolve()
      }).catch(reject)
    })
  }

  
  toJson() {
    return {

    }
  }
}
