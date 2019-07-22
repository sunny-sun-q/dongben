import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'

export default class ApiStore1 {
  constructor(props) {

  };

  // openapi详情信息
  // 树的信息
  @observable openapi = {
    info: [],
    url_data: [],
    // restUrl header param
    rs_header_data: [],
    // restUrl body param
    rs_body_data: [],
    // webService header param
    ws_header_data: [],
    // webService body param
    ws_body_data: [],
    result_data: [],
    distribute_data: [],
  }

  @action openapiClean() {
    var openApi = this.openapi;
    openApi.info = [],
    openApi.url_data = [],
    // restUrl header param
    openApi.rs_header_data = [],
    // restUrl body param
    openApi.rs_body_data = [],
    // webService header param
    openApi.ws_header_data = [],
    // webService body param
    openApi.ws_body_data = [],
    openApi.result_data = [],
    openApi.distribute_data = []
  }

  // 根据编码获取对应接口的详情信息
  @action getData(type, superiorCoding) {
    this.openapiClean();
    if (type != '') {
      var p = new Promise((resolve, reject) => {
        request('/openapi/getApiDetails', {  
          method: "GET",
          param: { "api_code": type }
        }).then((resp) => {
          if (resp.data) {
            this.openapi.info = resp.data;
            this.parseResultDataToOBJ(resp.data, superiorCoding);
          } else {
            this.openapi.info = [];
          }
          resolve()
        }).catch(reject)
      })
    }
  }

  @action parseResultDataToOBJ(openApiResult, superiorCoding) {
    if (openApiResult.listMdmOpenApiParamVO) {
      const openApi = this.openapi;
      openApiResult.listMdmOpenApiParamVO.map(item => {
        if (item.paramType == "url") {
          openApi.url_data.push(item);
        }
        
        if (item.paramType == "header") {
          if('rest' == superiorCoding){
            openApi.rs_header_data.push(item);
          }else{
            openApi.ws_header_data.push(item);
          }
        }
  
        if (item.paramType == "body") {
          if('rest' == superiorCoding){
            openApi.rs_body_data.push(item);
          }else{
            openApi.ws_body_data.push(item);
          }
        }
  
        if (item.paramType == "result") {
          openApi.result_data.push(item);
        }
  
        if (item.paramType == "distribute") {
          openApi.distribute_data.push(item);
        }
      })
    }
  }

  // 根据编码获取对应接口的详情信息
  // @action downWSDL( realURL) {
  //   var p = new Promise((resolve, reject) => {
  //     request('/openapi/downloadwsdl', {
  //       method: "GET",
  //       param: { "wsdlUrl": realURL }
  //     }).then((resp) => {

  //     }).catch(reject)
  //   })
  // }

  toJson() {
    return {

    }
  }
}

