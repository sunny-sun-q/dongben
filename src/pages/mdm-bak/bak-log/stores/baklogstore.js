

import {
  observable,
  action,
} from 'mobx'

import request from '../../../../utils/request'
import { success } from '../../../../utils/index'

export default class BakLogStore {
  // @observable 声明自身的state,在改变时会触发生命周期动作
  // 副本日志数据
  @observable baklogtable = {
    total: {},        //日志总数量
    pageCount: {},    //每页显示数量
    header: [],       //日志表头
    gridData: [],     //日志明细
  }

  // 根据查询的条件获取对应的日志列表
  @action getBaklogGrid(conditon) {
    return new Promise((resolve, reject) => {
      request(`/mdmbaklog/data?cond=${conditon}`, {
        method: "get",
        data: values
      }).then((resp) => {
        success(resp.data.msg)
        this.baklogtable.total = resp.data.total;
        this.baklogtable.pageCount = resp.data.pageCount;
        this.baklogtable.header = resp.data.header;
        this.baklogtable.gridData = resp.data.gridData;
        resolve()
      }).catch(reject)
    })
  }

  @observable baklogPagination = {
    total: {},              //总条数
    items: {},              //总页数
    maxButtons: {},         //分页按钮个数
    activePage: {},         //显示哪页是激活状态
    dataNumSelect: [],      //每页多少条的下拉选择Option内容
    header: ['5','10','15','20','50','100'],             
                            //每页多少条的下拉选择Option内容
    dataNum: 10,            //下拉选择的设定值的index
  }

  toJson() {
    return {

    }
  }
}
