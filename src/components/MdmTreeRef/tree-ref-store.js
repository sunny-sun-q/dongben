import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import {
    observable,
    action,
} from 'mobx'

import request,{ post } from 'utils/request.js'
import qs from 'querystring'
import { success } from 'utils/index.js'

import {getContextId,getCookie} from 'utils';
const contextId = getContextId();
let language = (navigator.language || navigator.browserLanguage).toLowerCase();
let locale =  (getCookie('u_locale')||language.split('_')[0].replace(/-/,'_')||"en_US")
let text;
if(contextId === 'mdm'){
    text = '主数据分类'
}else{
    if(locale === 'en_US'){
        text = 'Custom Files'
    }else if(locale === 'zh_TW'){
        text = '自定義檔案'
    }else{
        text = '自定义档案'
    }
}

export default class TreeRefStore {
    @observable refTree = {
        isShowModal:false,
        info: {
            treeref_pkgd:'',//树主数据
            treeref_pkgd_name:'',
        },
        treeData: [{
            "id": 0,
            "pid": '',
            "name": text,
            "children": []
        }],
    }

    @action setTreeModal(value) {
        this.refTree.isShowModal = value
    }

    @action resetRefMsg(value){
        this.refTree.info = value;
    }

    @action getTree(url) {
        return new Promise((resolve, reject) => {
          url = url || '/modeling/category/md-tree'
          request(url, {
            method: "GET",
            data: {}
          }).then((resp) => {
            this.refTree.treeData[0].children = resp.data || []
            resolve()
          }).catch(reject)
        })
      }

    toJson() {
        return {

        }
    }
}
  
  
