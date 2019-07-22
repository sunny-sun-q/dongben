

import {
  observable,
  action,
} from 'mobx'

import request from '../../../../utils/request'
import { success } from '../../../../utils/index'

export default class BakEntityContentStore {
  // @observable 声明自身的state,在改变时会触发生命周期动作
  @observable baktable = {
    headGrid: [],
    bakTableInfo: {
      entity: {},
      entity_items: []
    }, // 主表信息
  }

  // 获取副本建模的列名
  @action getBaktableGrid(values) {
    return new Promise((resolve, reject) => {
      request('/mdmbak/grid', {
        method: "get",
        data: values
      }).then((resp) => {
        success(resp.data.msg)
        this.baktable.headGrid = resp.data;
        resolve()
      }).catch(reject)
    })
  }

  // @action为请求后台动作
  @action getTableRequest(pk_baktable) {
    return new Promise((resolve, reject) => {
      request(`/mdmbak/loadForReact/${pk_baktable}`, {
        method: "GET",
        data: {}
      }).then((resp) => {
        this.baktable.bakTableInfo.entity = resp.data.bak;
        var arr = []
        if (resp.data.bak_items.length > 0) {
          this.baktable.bakTableInfo.entity_items=resp.data.bak_items;
        }else{
          
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
