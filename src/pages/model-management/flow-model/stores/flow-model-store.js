

import {
  observable,
  action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { success, Error } from 'utils/index.js'

export default class FlowModelStore {
  @observable flowModelata = {
    processDefinitionId: "",
    modelId: ""
  }

  //流程发布
  @action publishProcess(funcode) {
    return new Promise((resolve, reject) => {
     const url =  '/modeling/mdmdesign/publishProcess'
      request(url, {
        method: "GET",
        param: {funcode}
      }).then((resp) => {
        if(resp.data.success){
          success("流程发布成功")
        }else{
          Error("流程发布失败:" + resp.data.message)
        }
        resolve(resp.data.data)
      }).catch(reject)
    })
  }

  //流程设计
  @action processDesigner(funcode) {
    return new Promise((resolve, reject) => {
     const url =  '/modeling/mdmdesign/processDesigner'
      request(url, {
        method: "GET",
        param: {funcode}
      }).then((resp) => {
          this.flowModelata.modelId = resp.data
        resolve(resp.data.data)
      }).catch(reject)
    })
  }

  //getProcessDefinitionId
  @action getProcessDefinitionId(funcode) {
    return new Promise((resolve, reject) => {
     const url =  '/modeling/mdmdesign/getProcessDefinitionId'
      request(url, {
        method: "GET",
        param: {funcode}
      }).then((resp) => {
        this.flowModelata.processDefinitionId = resp.data
        resolve(resp.data.data)
      }).catch(reject)
    })
  }

  toJson() {
    return {

    }
  }
}
