

import {
  observable,
  action
} from 'mobx'
import request from '../../../../utils/request'

// 租户详情数据源
export default class InterfaceConfigurationStore {

  @observable intefaceData = {
    // 接口信息
    intefaceInfo:{
      tableDatas: [],           // 租户名称
    },
    // 分页信息
    pagingInfo:{
      defaultIndex: 1,
      defaultSize: 10,
      realIndex: -1,
      realSize: -1,
      total: 0,
      totalPages: 0,
    }
  }

  // 根据token请求线上租户的详细信息
  @action getInterfaceList( condition ) {
    let { defaultIndex, defaultSize, realIndex, realSize} = this.intefaceData.pagingInfo;
    let pageIndex = (realIndex == -1 ? defaultIndex : realIndex);
    let pageSize = (realSize == -1 ? defaultSize : realSize);

    return new Promise((resolve, reject) => {
      request('/socialmng/socialitf/query', {
        method: "GET",
        param: {condition:condition, pageIndex:pageIndex, pageSize:pageSize}
      }).then((resp) => {
        const result = resp.data;
        this.intefaceData.intefaceInfo = {
          tableDatas:       result.data
        }
        this.intefaceData.pagingInfo = {
          total: result.total,
          totalPages: result.pageCount,
          realIndex: pageIndex,
          realSize: pageSize,
          defaultIndex: 1,
          defaultSize: 10,
        }
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }

}
