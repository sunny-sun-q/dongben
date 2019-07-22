import {
  observable,
  action,
} from 'mobx'
import request from 'utils/request.js'

 class LogTable {

  @observable qfcond = {
    pk_gd: '',     
    operstate: '', // 1成功2失败
    username: '', // 操作用户
    start: '',
    end: '',
    opertype: ''  // 1,增加 2,修改 3,删除  4,发布 5,反发布 6,导出
  }

  @observable table1 = {
    info: [],
    total: 0,
    totalPages: 1, 
    viewDetailPKLOG: ''
  }

  @observable tableitem1 = {
    info: [],
    total: 0,
    totalPages: 1, 
    showLogItemsModal:false
  }

  // 获取系统日志表数据
  @action getTables(pageSize, pageIndex) {
    let url = '/mlog/react/data'
    this.qfcond.pageSize = pageSize;
    this.qfcond.pageIndex = pageIndex;

    return new Promise((resolve, reject) => {

      request(url, {
        method: "GET",
        param: this.qfcond
      }).then((resp) => {
        let data = []
        data = resp.data.data;
        data.forEach((item) => {
          item.key = item.pk_log;
        });

     
        this.table1.info = data || []
        this.table1.total = resp.data.total || 0
        this.table1.totalPages = resp.data.pageCount || 0
       
        resolve()
      }).catch(reject)
    })
  }

  @action setQFCond(qfcond) {
    this.qfcond = qfcond
  }

  toJson() {
    return {

    }
  }
}

export default new LogTable();
