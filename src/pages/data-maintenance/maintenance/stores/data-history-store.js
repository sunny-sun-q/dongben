import {
    observable,
    action,
} from 'mobx'
import qs from 'qs'
import { toJS} from 'mobx'
import request from 'utils/request.js'
import { success } from 'utils/index.js'
import { timingSafeEqual } from 'crypto';
import { reject } from 'q';
import { resolve } from 'path';

export default class dataHistoryStore {
    @observable historyData = []

    @observable historyHeader = []

    @observable _historyHeader = []

    @observable historyMdmcode = '';

    @observable historyOld = {};

    @action getHistoryData = (pk_gd, mdmcode) => {
        let condition = `mdm_code = '${mdmcode}'`;
        return new Promise( (resolve, reject) => {
            let rid = this.getRid();
            request(`/modeling/mdmshow/list/hisQuery`,{
                method: "GET",
                param: {
                    pk_gd,
                    condition,
                    rid
                }

            }).then(( resp ) =>{
                resp.data.header.map( (item) => {
                    let temp = {};
                    temp.title = item.text;
                    temp.dataIndex = item.fieldId;
                    temp.key = item.fieldId;
                    temp.width = item.width;
                    if(item.fieldType && (item.fieldType === 7 || item.fieldType === 8 || item.fieldType === 13 )) {
                        temp.dataIndex = `${temp.dataIndex}_name`;
                    }
                    this.historyHeader.push(temp);
                    
                })
                // console.log(this.historyHeader);
                
                // debugger;
                resp.data.data.map( (item) => {
                    let temp = {};
                    temp = Object.assign(temp, item);
                    temp.key = item.pk_mdm_h;
                    // temp
                    this.historyData.push(temp);
                })
                resolve();
            }).catch(reject);

        })
    }

    @action saveHistoryData = ( pk_gd, main, old_main) => {
        let sub = {};
        let old_sub = {};
        return new Promise( (resolve, reject) => {
            let rid = this.getRid();
            request(`/modeling/mdmshow/card/save`,{
                method: "POST",
                param: {
                    pk_gd,
                    main,
                    old_main,
                    sub,
                    old_sub
                }

            }).then(( resp ) =>{
                
                resolve();
            }).catch(reject);

        })
    }

    getRid = () => {
        return new Date().getTime();
    }
}