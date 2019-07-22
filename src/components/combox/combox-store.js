

import {
    observable,
    action,
} from 'mobx'

import request from 'utils/request.js'

export default class Combox {
    constructor () {
        
        this.selectDataSource = []
        this.selectedItem = {}
    }
    @observable selectDataSource = []
    @observable selectedItem = {}
   
    // "com.yonyou.iuapmdm.remotesysreg.web.SysregisterCombo"
    @action getCombox(fullclassname) {
        return new Promise((resolve, reject) => {
            request('/combo/getComboData', {
                method: "GET",
                param: { fullclassname }
            }).then((resp) => {
                this.selectDataSource = resp.data
                resolve()
            }).catch(reject)
        })
    }

    // this.selectDataSource = [{
    //     "i18nName" : "",
    //     "text" : "system02",
    //     "value" : "264b867c-68bf-493e-a293-75af72fef967"
    // }]
    @action setSelectedItem(item) {
        this.selectedItem = item
    }

    toJson() {
        return {

        }
    }
}
