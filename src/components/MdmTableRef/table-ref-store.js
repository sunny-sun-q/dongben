import {
    observable,
    action,
} from 'mobx'

import request,{ post } from 'utils/request.js'
import qs from 'querystring'
import { success } from 'utils/index.js'

export default class TableRefStore {
    @observable refTable = {
        isShowModal:false,
        tableList:{
            header:[],
            body:[]
        },
        fieldId:'', //字段参数变量
        info:{
            treeparentid:'',//树父ID
            treeparentid_name:'',
            treeref_foreignkey:'',//外键字段
            treeref_foreignkey_name:''
        }
    }

    @action setTableModal(value,fieldId) {
        this.refTable.isShowModal = value
        this.refTable.fieldId = fieldId
    }

    @action resetRefMsg(value){
        this.refTable.info = value;
    }

    // 实体字段
    @action getEntityValue(fullclassname, type, pk_gd, ref_boolbean) {

        return new Promise((resolve, reject) => {
            request(`/reference/mdmref/grid`, {
                method: "GET",
                param: {
                    fullclassname,
                    type,
                    pk_gd,
                    ref_boolbean
                }
            }).then((resp) => {
                let body = [];
                resp.data.data.forEach((item,index) => {
                    body.push(Object.assign(item, {
                        key:index
                        })
                    )
                });
                this.refTable.tableList.body = body
                let header = []
                resp.data.header.forEach((item) => {
                header.push({
                    title: item.text,
                    dataIndex: item.fieldId,
                    key: item.fieldId,
                    width: 100,
                    className: 'text-center'
                })
                })
                this.refTable.tableList.header = header
                resolve()
            }).catch(reject)
        })
    }

    toJson() {
        return {

        }
    }
}

