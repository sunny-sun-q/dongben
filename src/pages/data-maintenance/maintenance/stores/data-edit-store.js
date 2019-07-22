import {
    observable,
    action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { success } from 'utils/index.js'
import { timingSafeEqual } from 'crypto';
import { reject } from 'q';
import { toJS } from "mobx";

export default class DataEditStore {

    // 下拉信息存储
    @observable editHeader = [];

    @observable selectionData = {
        // name : []
        // name: 1
    }
    // 外部使用 类似全局变量
    @observable modelInfo = {}

    @observable editInfo = {}

    @observable edifFlag = 0;

    @observable uploadInfo = [];

    @observable recordInfo = {};

    @observable subInfo = {};

    @observable subInfoDel = {};

    @observable loadInfo = {};

    @observable _loadInfo = {};

    @observable socialItems = []; // 社会化配置下拉信息
    // 获取下拉列表信息
    @action getSelectionData(pk_gd, pk_entityitem, id){
        let rid = this.getRid();

        return new Promise( (resolve, rejecet) => {
            request(`/modeling/mdmshow/card/combo`,{
                method: "GET",
                param: {
                    pk_gd,
                    pk_entityitem,
                    rid
                }

            }).then(( resp ) =>{
                this.selectionData[id] = resp.data;
                // this.selectionData[id] = this.arryDeepClone(resp.data);
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
                }
            }).then(( resp ) =>{
                this.selectionData[id] = resp.data;
                resolve();
            }).catch(reject);
        })
    }
    @action getModel(pk_gd ){
        let rid = this.getRid();

        return new Promise( (resolve, reject) => {
            request(`/modeling/mdmshow/list/model`,{
                method: "GET",
                param: {
                    pk_gd,
                    rid
                }
            }).then(( resp ) =>{
                this.modelInfo = resp.data;
                let editHeader = [];
                let tempFile = [];
                let tempPic = [];
                let tempTextArea = [];
                resp.data.entitys[0].body.map( (item, value, arr) => {
                    // console.log(item.fieldtype);
                    // if(item.fieldtype) {
                        let temp = {};
                        temp = item;
                        temp.fieldId = item.code;
                        temp.fieldType = item.fieldtype;
                        temp.text = item.name;
                        // temp.pk_entityitem = item.pk_entityitem;
                        // temp.rwauth = item.rwauth;
                        // temp.rwauth = 1;
                        if(item.fieldtype === 9 ){
                            tempPic.push(temp);
                            this.uploadInfo.push(item.code);
                        }
                        else if(item.fieldtype === 10 ){
                            tempFile.push(temp);
                            this.uploadInfo.push(item.code);
                        }
                        else if(item.fieldtype === 11) {
                            tempTextArea.push(temp);
                        }
                        else {
                            editHeader.push(temp);
                        }
                    // }
                })
                editHeader = editHeader.concat(tempTextArea, tempPic, tempFile);
                
                for(var i = 0 ; i < editHeader.length;i++){
                    let editItem = editHeader[i];
                    if(editItem.fieldType === 7){
                        editItem.pk_gd = pk_gd;
                    }
                }
                this.editHeader = [].concat(editHeader)
                
                resolve();
            }).catch(reject);
        });
    }

    @action save(pk_gd ,main={}, sub={} ,approver_status ,old_main={}, old_sub={}){
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
                    old_sub
                }
            }).then(( resp ) =>{
                
                resolve();
            }).catch(reject);
        });
    }

    @action getLoadInfo = ( pk_gd, mdm_code) => {
        let rid = this.getRid();
        return new Promise( (resolve, reject) => {
            request(`/modeling/mdmshow/card/load`,{
                method: "GET",
                param: {
                    pk_gd,
                    mdm_code,
                    rid
                }
            }).then(( resp ) =>{
                // console.log(this.loadInfo)
                if(resp.data.success === "fail_global"){
                    this.loadInfo = {}; // 加入 key
                    this._loadInfo = {};
                }
                else{
                    this.loadInfo = resp.data; // 加入 key
                    this._loadInfo = {...resp.data};
                    for(let item in this.loadInfo) {
                        if(typeof(this.loadInfo[item])==='object'){
                            this.subInfo = Object.assign({},toJS(this.subInfo),{[item]:toJS(this.loadInfo[item])});
                            if(this.loadInfo[item]){
                                this.loadInfo[item].map( (i) => {
                                    i.key = i.key || i.pk_mdm;
                                })
                            }
                            
                        }
                    }
                }
                resolve();
            }).catch(reject);
        });
        
    }

    
    
      
    @action getSocialSearchItem = (pk_gd, requestParam) => {
        return new Promise((resolve, reject) => {
          request(`/socialMaintenance/searchEnterprise`,{
            method: "POST",
            param: {
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
            param: {
              pk_gd,
              requestParam
            }
          }).then((resp) => {
            // get resp.data.obj[0]
            this.loadInfo = resp.data.obj[0];
            this._loadInfo = {...resp.data.obj[0]};
                    for(let item in this.loadInfo) {
                        if(typeof(this.loadInfo[item])==='object'){
                            this.subInfo = Object.assign({},toJS(this.subInfo),{[item]:toJS(this.loadInfo[item])});
                            if(this.loadInfo[item]){
                                this.loadInfo[item].map( (i) => {
                                    i.key = i.key || i.pk_mdm;
                                })
                            }
                            
                        }
                    }
            resolve();
          }).catch(reject);
        })
    }

    getRid = () => {
        return new Date().getTime();
    }
    arryDeepClone = (array)=>{
        let result = [];
        if(array){
            array.map((item)=>{
                let temp = Object.assign([],item);
                result.push(temp);
            })
        }
        return result;
    }
    
    sortHeader = (arr) => {
        
        arr.map( (item) => {
           
        })
    }
}