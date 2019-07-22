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

export default class dataProcessStore {

    @observable rowData = {}

    @action getBillBPM = ( pk_gd, pkmdm_flow) => {
        let para = {};

        return new Promise( (resolve, reject) => {
            let rid = this.getRid();
            let temp = {
                billId:`${pkmdm_flow}:${pk_gd}`
            }
            request(`/eiap-plus//process/getbillbpm`,{
                method: "POST",
                formatJSon: true,
                headers:{
                    'Content-Type':'application/json'
                },
                data:temp

            }).then(( resp ) =>{
                console.log(resp);
                resolve();
            }).catch(reject);

        })
    }

    getRid = () => {
        return new Date().getTime();
    }
}
