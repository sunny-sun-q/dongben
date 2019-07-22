import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'

const prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';// 'http://127.0.0.1:8080/iuapmdm';

export default class SysregisterStroe1 {
  constructor(props) {

  };

  @observable sysregister = {
    isTreeClick: 'N',
  }

  @observable authClickActive = {
    activeKey: '',
  }

  // 除了分发接口的数据
  @observable sysregisterExcludeDistribute = {
    selectSysregisterNode: '',  // 选中的集成系统，用于body参数和返回结果信息的联动
    queryBodyData: [],  // 用于body参数展示
    resultBodyData: []  // 用于result结果展示
  }

  // 分发接口的数据
  @observable sysregisterForDistribute = {
    data: []
  }

  @action getData(tree_id, menu_type, realInterfaceCode, paramType, superiorCoding) {
    if (tree_id && menu_type && realInterfaceCode && paramType) {
      var p = new Promise((resolve, reject) => {
        request('/openapi/queryAuthoritys', {
          method: "GET",
          param: { "pk_gd": tree_id, 'type': menu_type, 'real_interface_code': realInterfaceCode,
           'param_type':paramType, 'superior_coding':superiorCoding}
        }).then((resp) => {
          if (resp.data) {
            if (resp.data.data.length > 0) {
              switch (paramType) {
                case "body":
                  this.sysregisterExcludeDistribute.queryBodyData = resp.data.data;
                  break;
                case "result":
                  this.sysregisterExcludeDistribute.resultBodyData = resp.data.data;
                  break;
                case "distribute":
                  this.sysregisterForDistribute.data = resp.data.data;
                  break;
                default:
                  break;
              }
            } else {
              switch (paramType) {
                case "body":
                  this.sysregisterExcludeDistribute.queryBodyData = "";
                  break;
                case "result":
                  this.sysregisterExcludeDistribute.resultBodyData = "";
                  break;
                case "distribute":
                  this.sysregisterForDistribute.data = "";
                  break;
                default:
                  break;
              }
            }

          }
          resolve()
        }).catch(reject)
      })
    }
  }

  @action download(tree_id, menu_type, realInterfaceCode, paramType, superiorCoding, downloadType, systemCode) {
    window.open(prefixUrl + "/openapi/download?tree_id=" + tree_id + "&menu_type=" + menu_type 
      + "&real_interface_code=" + realInterfaceCode + "&param_type=" + paramType + "&superior_coding=" + superiorCoding
      + "&downloadType=" + downloadType + "&systemCode=" + systemCode);
  }

  toJson() {
    return {

    }
  }
}
