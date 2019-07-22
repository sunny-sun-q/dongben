

import {
  observable,
  action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { success } from 'utils/index.js'

export default class DataMaintainStore {

  @observable table = {

    oneInfo: {// authsube  一条数据
      
      entity_readableCount: 0,
      entity_writeableCount: 0,
      entity_subscribeCount: 0,

      writeableDisabled: 0, 
      readableDisabled: 0,
      subscribeDisabled: 0,
      
      isAllDisabled: true,

      errorCode: '',
      errorName: '',
      errorSys: '',
      isShowTip: false,

      pk_auth_sube_id: '',
      name: '',
      code: '',
      sysname: '',
      pk_sysregister: '',
      gdname: '',
      pk_gd: '',
      extCondition:'',
      readable: '',
      writeable: '',
      sysAuths:[{
        // tab页内行级选中个数
        entityItems_readableCount: 0,
        entityItems_writeableCount: 0,
        entityItems_subscribeCount: 0,

        pk_authority:'',
        pk_auth_sube_id:'',
        pk_mdentity:'',
        code: '',
        name:'',
        zztype: '1',
        readable: '',
        writeable: '',
        itemVOs: [{
          pk_authority_item: '',
          pk_authority: '',
          pk_entityitem: '',
          code: '',
          readable: '',
          writeable: ''
        }]
      }]
    },
    //是新增=0，修改=1
    isAdd: true,

    nodeinfo:{
      pk_gd: '',
      gdanme: '',
    },
    single:{
      isShowSingleDelModal: false,
      delSinglePk: '',
      startOrStopPk:'',
      startOrStopValue: 0
    },
    grid: {
      authAndSube: [{
        pk_auth_sube_id: '',
        name: '',
        code: '',
        sysname: '',
        pk_sysregister: '',
        gdname: '',
        pk_gd: '',
        extCondition:'',
        sysAuths:[]
      }],
      total: 0,
      pageCount: 0
    }

  }

  @action getTableRequest(pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
      request('/sysAuthority/queryAuthAndSube', {
        method: "GET",
        param: {
          pk_gd: this.table.nodeinfo.pk_gd,
          pageIndex,
          pageSize
        }
      }).then((resp) => {
        let grid = {
          authAndSube: [],
          total: 0,
          pageCount: 0
        }
        if("success" == resp.data.flag){

          let authAndSub = resp.data.data
          authAndSub.forEach((item) => {
            item.key = item.pk_auth_sube_id
            if(item.dr === 0){
              item.s_status = '启用'
            }else{
              item.s_status = '停用'
            }
          });
          grid.authAndSube = authAndSub
          grid.total = resp.data.total
          grid.pageCount = resp.data.pageCount
        }
        this.table.grid = grid
        resolve()
      }).catch(reject)
    })
  }

  @action queryEntityListAuthSubeDetail(pk_auth_sube_id) {
    return new Promise((resolve, reject) => {
      request('/sysAuthority/queryEntityListAuthSubeDetail', {
        method: "GET",
        param: {
          pk_auth_sube_id
        }
      }).then((resp) => {
        let record =  this.table.oneInfo
        record.sysvo = resp.data.sysvo

        let _sysAuths = resp.data.data
        let entityCount = _sysAuths.length
        let entity_readableCount = 0, entity_writeableCount = 0, entity_subscribeCount = 0

        for(let i=0; i<entityCount; i++){
          let entityItemsCount = _sysAuths[i].itemVOs.length

          // 内层
          let entityItems_readableCount = 0, entityItems_writeableCount = 0, entityItems_subscribeCount = 0

          for(let j=0; j<entityItemsCount; j++){
            1 === _sysAuths[i].itemVOs[j].readable ? entityItems_readableCount = entityItems_readableCount + 1 : ''
            1 === _sysAuths[i].itemVOs[j].writeable ? entityItems_writeableCount = entityItems_writeableCount + 1 : ''
            1 === _sysAuths[i].itemVOs[j].subscribe ? entityItems_subscribeCount = entityItems_subscribeCount + 1 : ''
          }
          _sysAuths[i].entityItems_readableCount = entityItems_readableCount
          _sysAuths[i].entityItems_writeableCount = entityItems_writeableCount
          _sysAuths[i].entityItems_subscribeCount = entityItems_subscribeCount

          //外层
          1 === _sysAuths[i].readable ? entity_readableCount = entity_readableCount + 1 : ''
          1 === _sysAuths[i].writeable ? entity_writeableCount = entity_writeableCount + 1 : ''
          1 === _sysAuths[i].subscribe ? entity_subscribeCount = entity_subscribeCount + 1 : ''
        } 
        if(record.readableDisabled){
          record.entity_readableCount = entityCount
        }else{
          record.entity_readableCount = entity_readableCount
        }
        if(record.writeableDisabled){
          record.entity_writeableCount = entityCount
        }else{
          record.entity_writeableCount = entity_writeableCount
        }
        if(record.subscribeDisabled){
          record.entity_subscribeCount = entityCount
        }else{
          record.entity_subscribeCount = entity_subscribeCount
        }

        record.sysAuths = _sysAuths

        this.table.oneInfo = record
        resolve()
      }).catch(reject)
    })
  }

  @action queryEntityListAuthSubeDetailByMeta() {
    return new Promise((resolve, reject) => {
      request('/sysAuthority/queryEntityListAuthSubeDetailByMeta', {
        method: "GET",
        param: {
          pk_gd: this.table.nodeinfo.pk_gd,
          gdname: this.table.nodeinfo.gdname
        }
      }).then((resp) => {
        if("success" == resp.data.flag){
          
          let _oneInfo = resp.data.data;
          _oneInfo.isAllDisabled = true;
          
          let entityCount = _oneInfo.sysAuths.length;
          _oneInfo.entity_readableCount = entityCount;
          _oneInfo.entity_writeableCount = entityCount;
          _oneInfo.entity_subscribeCount = entityCount;
  
          for(let i=0; i<entityCount; i++){
            let entityItemsCount = _oneInfo.sysAuths[i].itemVOs.length;
            _oneInfo.sysAuths[i].entityItems_readableCount = entityItemsCount;
            _oneInfo.sysAuths[i].entityItems_writeableCount = entityItemsCount;
            _oneInfo.sysAuths[i].entityItems_subscribeCount = entityItemsCount;
          }

          this.table.oneInfo = _oneInfo;
        }
        resolve()
      }).catch(reject)
    })
  }
  @action startOrStop() {
    return new Promise((resolve, reject) => {
      request('/sysAuthority/startOrStop', {
        method: "GET",
        param: {
          pk_auth_sube_id: this.table.single.startOrStopPk,
          startOrStopValue: this.table.single.startOrStopValue
        }
      }).then((resp) => {
        this.getTableRequest(1, 10)
        this.table.single.startOrStopPk = ''      
        resolve()
      }).catch(reject)
    })
  }

  // pk_auth_sube_ids : 1qwqq,rerrt,tryrt'
  @action delAuthAndSubes(pk_auth_sube_ids) {
    return new Promise((resolve, reject) => {
      request('/sysAuthority/delAuthAndSubes', {
        method: "GET",
        param: {
          pk_auth_sube_ids: pk_auth_sube_ids
        }
      }).then((resp) => {
        this.getTableRequest(1, 10)
        this.table.single.isShowSingleDelModal = false      
        resolve()
      }).catch(reject)
    })
  }


  @action save(mdmNowUrl) {
    return new Promise((resolve, reject) => {
      // debugger
      // console.log("save_this.table.oneInfo", this.table.oneInfo)
      request('/sysAuthority/saveAuthAndSube', {
        data: {
          data: JSON.stringify(this.table.oneInfo)
        },
        method: 'POST'
      }).then((resp) => {
        if("success" == resp.data.flag){
          this.table.oneInfo={}
          window.location.href = mdmNowUrl;
          // window.history.go(-1);
        }
        resolve()
      }).catch(reject)
    })
  }

  // 调用高级查询SeniorSearch时使用此方法
  @action changeFilterCon(filterCon) {
    this.table.oneInfo.extCondition = filterCon;
  }

  toJson() {
    return {

    }
  }
}
