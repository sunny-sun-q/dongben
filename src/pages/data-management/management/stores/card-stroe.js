import {observable, action, } from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { success } from 'utils/index.js'
import { timingSafeEqual } from 'crypto';
import axios from "axios";
export default class cardStrore {
    @observable modelInfoHeader = {}

    @observable modelInfo = {}

    @observable loadInfo = { emtpy : true}   // mainTableInfo ==> loadInfo

    @observable loadInfo_r = {}

    @observable subInfo = {}

    @observable subInfoDel = {} // 存储删除的子表项

    @observable selectionData = {}

    @observable mainTableInfo_old = {}

    @observable refleshFlag = false;

    @observable treeTableMdmcode = '';

    // 社会化配置信息
    @observable socialConfig = {}
    @action getModel = (pk_gd)=> {
        let rid = this.getRid();
        return new Promise((resolve, reject) => {
            request(`/modeling/mdmshow/list/model`, {
                method: "GET",
                param: {
                    pk_gd,
                    rid,
                }
            }).then((resp) => {
                // console.log(resp)
                this.modelInfoHeader = resp.data.entitys[0];
                this.modelInfo = resp.data;
                resolve();
            }).catch(reject);

        });
    }

    @action getSelectionData = (pk_gd, pk_entityitem, code) => {
        let rid = this.getRid();
        return new Promise((resolve, reject) => {
            request(`/modeling/mdmshow/card/combo`, {
                method: "GET",
                param: {
                    rid,
                    pk_gd,
                    pk_entityitem,
                    "authfilter": true
                }
            }).then((resp) => {
                // console.log(resp)
                this.selectionData[pk_entityitem + code] = resp.data;
                resolve();
            }).catch(reject);

        });
    }
    @action getEnumData(pk_entityitem, id){
        return new Promise( (resolve, reject) => {
            request(`/modeling/enum/queryEnumCombo`,{
                method: "GET",
                param: {
                    pk_entityitem,
                    "authfilter": true
                }
            }).then(( resp ) =>{
                this.selectionData[pk_entityitem + id] = resp.data;
                resolve();
            }).catch(reject);
        })
    }
    @action getGridData = ( pk_gd, condition) => {
        let rid = this.getRid();
        condition = condition || `1=1'`;
        return new Promise((resolve, reject) => {
            request(`/modeling/mdmshow/list/query`, {
                method: "GET",
                param: {
                    rid,
                    pk_gd,
                    condition
                }
            }).then((resp) => {
                // console.log(resp)
                this.mainTableInfo = resp.data.gridData[0];
                resolve();
            }).catch(reject);

        });
    }

    // @action getLoadInfo = ( pk_gd, mdm_code) => {
    //     let rid = this.getRid();
    //     mdm_code = mdm_code ;
    //     debugger
    //     return new Promise((resolve, reject) => {
    //         request(`/modeling/mdmshow/card/load`, {
    //             method: "GET",
    //             param: {
    //                 rid,
    //                 pk_gd,
    //                 mdm_code
    //             }
    //         }).then((resp) => {
    //             // console.log(resp)
    //             debugger
    //             this.loadInfo = resp.data || {};
    //             this.loadInfo_r = { ...this.loadInfo }
    //             // console.log('11111',this.loadInfo_r,this.loadInfo);
    //             resolve();
    //         }).catch(reject => {
    //             debugger
    //             console.log(reject)
    //         });
    //     });
    // }
    @action getLoadInfo = ( pk_gd, mdm_code) => {
        let rid = this.getRid();
        mdm_code = mdm_code ;
        
        // let prefixUrl;
        // prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';// 'http://127.0.0.1:8080/iuapmdm';
        // let url = prefixUrl +`/modeling/mdmshow/card/load`;
        let url = `/modeling/mdmshow/card/load`;
        return new Promise((resolve, reject) => {
            request(url,{
                param: {
                    rid,
                    pk_gd,
                    mdm_code
                },
                method: "GET",
                notStandard: true,
                url:url
            }).then((resp) => {
                // console.log(resp)
                // 设置默认值
                let header = this.modelInfo && this.modelInfo.entitys && this.modelInfo.entitys[0];
                if(header && header.body && header.body.length > 0){
                    for(let i = 0; i < header.body.length; i++){
                        let item = header.body[i]
                        if(typeof resp.data[item.code] === 'undefined' || resp.data[item.code] === null || resp.data[item.code] === ''){
                            resp.data[item.code] = item.defaultvalue;
                        }
                    }
                }
                this.loadInfo = resp.data || {};
                this.loadInfo_r = { ...this.loadInfo }
                // console.log('11111',this.loadInfo_r,this.loadInfo);
                resolve();
            }).catch(reject => {
                console.log(reject)
            });
        });
    }

    @action sealStateChange(pk_gd, sealType, mdmCodes) {
        let rid = this.getRid();
        return new Promise((resolve, reject) => {
            request(`/modeling/mdmshow/list/seal/`, {
                method: "GET",
                param: {
                    pk_gd,
                    mdmCodes,
                    sealType,
                    rid
                }
            }).then((resp) => {
                resolve();
            }).catch(reject);
        })
    }
    @action deleteItems(pk_gd, mdmCodes) {
        let rid = this.getRid();
        return new Promise((resolve, reject) => {
            request(`/modeling/mdmshow/list/remove/`, {
                method: "GET",
                param: {
                    pk_gd,
                    mdmCodes,
                    rid
                }
            }).then((resp) => {

                if(resp.data.flag === 'success'){
                    this.refleshFlag = true;
                }
                else {
                    success(resp.data.msg); // 提示失败原因
                }
                resolve();
            }).catch(reject);
        })
    }
    @action save(pk_gd ,main={}, sub={} ,approver_status ,old_main={}, old_sub={}, sys_code){
        console.log(sys_code)
        let rid = this.getRid();
        main = JSON.stringify(main);
        sub = JSON.stringify(sub);
        old_main =JSON.stringify(old_main);
        old_sub = JSON.stringify(old_sub);
        return new Promise( (resolve, reject) => {
            request(`/modeling/mdmshow/card/save`,{
                method: "POST",
                headers:{
                    'Content-Type':'application/json'
                },
                data: {
                    pk_gd,
                    approver_status,
                    main,
                    sub,
                    old_main,
                    old_sub,
                    sys_code,
                }
            }).then(( resp ) =>{
                console.log(resp)
                if(resp.data.flag === 'success'){
                    resolve(true);
                    // return true
                }else{
                    resolve(false);
                    // return false
                }
            }).catch(reject);
        });
    }

    @action getSocialConfig = (pk_gd) => {
        let rid = this.getRid();
        return new Promise((resolve, reject) => {
            request(`/socialMaintenance/confirmSocial`,{
                method: "GET",
                param: {
                pk_gd,
                rid
                }
            }).then((resp) => {
                this.socialConfig = {};
                if(resp.data.data === 'true') this.socialConfig = resp.data.obj[0];
                resolve();
            }).catch(reject);
        })
    }

    @action getSocialSearchItem = (pk_gd, requestParam) => {
        return new Promise((resolve, reject) => {
          request(`/socialMaintenance/searchEnterprise`,{
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            // param: {
            //     pk_gd,
              
            // },
            data : {
                pk_gd,
                requestParam
            }
          }).then((resp) => {
            this.socialItems = [];
            resp.data.obj.map(item => {
              this.socialItems.push({
                key : item.name,
                value : item.name,
              })
            });
            resolve();
          }).catch(reject);
        })
      }
      
    @action getSocialSearchDetail = (pk_gd, requestParam) => {
        return new Promise((resolve, reject) => {
          request(`/socialMaintenance/searchDetail`,{
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            data: {
              pk_gd,
              requestParam
            }
          }).then((resp) => {
              // get resp.data.obj[0]
              let respData = resp.data.obj[0];
              let header = this.modelInfo && this.modelInfo.entitys && this.modelInfo.entitys[0];
              if(header && header.body && header.body.length > 0){
                  for(let i = 0; i < header.body.length; i++){
                      let item = header.body[i]
                      if(typeof respData[item.code] === 'undefined' || respData[item.code] === null || respData[item.code] === ''){
                        respData[item.code] = item.defaultvalue;
                      }
                  }
              }
             
              this.loadInfo_r = JSON.parse(JSON.stringify(respData));
              this.loadInfo = respData;
            //   for (let item in this.loadInfo) {
            //       if (typeof (this.loadInfo[item]) === 'object') {
            //           this.subInfo = Object.assign({}, toJS(this.subInfo), { [item]: toJS(this.loadInfo[item]) });
            //           if (this.loadInfo[item]) {
            //               this.loadInfo[item].map((i) => {
            //                   i.key = i.key || i.pk_mdm;
            //               })
            //           }
            //       }
            //   }
            resolve();
          }).catch(reject);
        })
    }
    @action foo = ()=> {
        let rid = this.getRid();
        return new Promise((resolve, reject) => {
            request(``, {
                method: "GET",
                param: {
                    rid,
                }
            }).then((resp) => {
                // console.log(resp)
                resolve();
            }).catch(reject);

        });
    }

    reset = () => {
        this.loadInfo = { empty: true};
        this.loadInfo_r = {};
        this.subInfo = {};
    }

    getRid = () => {
        return new Date().getTime();
    }
}
