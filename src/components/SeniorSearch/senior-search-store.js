

import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import {
  observable,
  action,
} from 'mobx'

import request,{ post } from 'utils/request.js'
import qs from 'querystring'
import { success } from 'utils/index.js'

export default class SeniorSearchStore {
  // 树的信息
  @observable menu = {
    info: [],
    current: 1,
    selected: {}
  }

  // 表格的信息
  @observable table = {
      dataSource: [],
      dataType:{
          //'string': {'values':[{name:<FormattedMessage id="js.com.Sen2.0020" defaultMessage="包含" />,symbol:'like'},{name:<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,symbol:'='},{name:<FormattedMessage id="js.com.Sen2.0017" defaultMessage="不等于" />,symbol:'!='}],'default':{name:<FormattedMessage id="js.com.Sen2.0020" defaultMessage="包含" />,symbol:'like'}},
          'string': {'values':[<FormattedMessage id="js.com.Sen2.0020" defaultMessage="包含" />,<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0017" defaultMessage="不等于" />],'default':<FormattedMessage id="js.com.Sen2.0020" defaultMessage="包含" />},
          'number': {'values':[<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />,<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0015" defaultMessage="大于" />,<FormattedMessage id="js.com.Sen2.0016" defaultMessage="小于" />],'default':<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />},
          'integer': {'values':[<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />,<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0015" defaultMessage="大于" />,<FormattedMessage id="js.com.Sen2.0016" defaultMessage="小于" />],'default':<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />},
          'double': {'values':[<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />,<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0015" defaultMessage="大于" />,<FormattedMessage id="js.com.Sen2.0016" defaultMessage="小于" />],'default':<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />},
          'boolean': {'values':[],'default':''},
          'date': {'values':[<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />,<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0015" defaultMessage="大于" />,<FormattedMessage id="js.com.Sen2.0016" defaultMessage="小于" />],'default':<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />},
          'datetime': {'values':[<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />,<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0015" defaultMessage="大于" />,<FormattedMessage id="js.com.Sen2.0016" defaultMessage="小于" />],'default':<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />},
          'time': {'values':[<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />,<FormattedMessage id="js.com.Sen2.0015" defaultMessage="大于" />,<FormattedMessage id="js.com.Sen2.0016" defaultMessage="小于" />],'default':<FormattedMessage id="js.com.Sen2.0021" defaultMessage="介于" />},
          'ref': {'values':[<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0017" defaultMessage="不等于" />],'default':<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />},
          'combox': {'values':[<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0017" defaultMessage="不等于" />],'default':<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />} ,
          'enum': {'values':[<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0017" defaultMessage="不等于" />],'default':<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />} ,
      },
      sql:"" ,
      //selectData: [<FormattedMessage id="js.com.Sen2.0020" defaultMessage="包含" />,<FormattedMessage id="js.com.Sen2.0014" defaultMessage="等于" />,<FormattedMessage id="js.com.Sen2.0017" defaultMessage="不等于" />],
      fieldref:{
        ifModalShow: false,
        pk_gd: "",
        pk_entityitem: "",
        header: [],
        body: [],
        selectRecord: {}
      },
      grid:{
        fullclassname:"",
        type:"",
        pk_gd:"",
        pk_entityitem:"",
        refPkGd: ""
      },
      selectDataSource: []
  }



  // 设置table数据源
  @action setSql(value){
    this.table.sql = value
  }

  @action setTableModal(value, pk_gd, pk_entityitem) {
    this.table.fieldref.ifModalShow = value
    this.table.fieldref.pk_gd = pk_gd
    this.table.fieldref.pk_entityitem = pk_entityitem
  }

  // 弹出框的信息
  @observable modal = {
    showModal: false,
  }

  // 设置选择的MenuItem
  @action setMenuSelected(currentObject){
      this.menu.selected = currentObject;
  }

  // 设置table数据源
  @action setTableData(value){
      this.table.dataSource = value
  }

   // 设置table数据源
   @action remodeLastData(){
    this.table.dataSource.splice(this.table.dataSource.length-1, 1)
}

  // modal弹框是否显示
  @action setSeniorModal(value) {
    this.modal.showModal = value
  }

  @action resetRefMsg(value) {
    this.table.fieldref.selectRecord = value
  }

  // 获取左侧菜单数据
  @action getMenuData(pk_gd, pk_category='',url) {
    url = url || '/mdmblood/advSearch'
    return new Promise((resolve, reject) => {
      //let url = url || '/modeling/mdmshow/list/advSearch'
      //TODO 暂时使用'/mdmblood/advSearch'

      request(url, {
        method: "GET",
        param: {
          pk_gd,
          pk_category
        }
      }).then((resp) => {
         this.menu.info = resp.data //|| ['用友网络科技股份有限公司']
        resolve()
      }).catch(reject)
    })
  }

   // 获取左侧菜单数据
   @action getMenuDataByEntityCode(entitycode) {
    return new Promise((resolve, reject) => {
      let url =  '/modeling/billcodecondition/getfield'
      request(url, {
        method: "GET",
        param: {
          entitycode
        }
      }).then((resp) => {
         this.menu.info = resp.data //|| ['用友网络科技股份有限公司']
        resolve()
      }).catch(reject)
    })
  }

   /**
    * getReference
    * @param {*} pk_gd
    * @param {*} pk_entityitem
    */
   @action getReference(pk_gd, pk_entityitem) {
    return new Promise((resolve, reject) => {
     let url =  '/modeling/mdmshow/card/reference'
      request(url, {
        method: "GET",
        param: {pk_gd, pk_entityitem}
      }).then((resp) => {
        this.table.grid.fullclassname = resp.data.fullclassname
        this.table.grid.type = resp.data.type
        this.table.grid.pk_gd = resp.data.params?resp.data.params.pk_gd : pk_gd
        this.table.grid.pk_entityitem = resp.data.params? resp.data.params.pk_entityitem : pk_entityitem
        this.table.grid.refPkGd = resp.data.params? resp.data.params.refPkGd : ""
        resolve()
      }).catch(reject)
    })
  }


   @action getGrid(fullclassname, type, pk_gd, pk_entityitem, refPkGd) {
    return new Promise((resolve, reject) => {
     let url =  '/reference/mdmref/grid'
      request(url, {
        method: "GET",
        param: {fullclassname, type, pk_gd, pk_entityitem, refPkGd}
      }).then((resp) => {
        function mapTableData(header=[], body=[]) {
          let arr = []
          for(let i = 0; i < body.length; i++) {
            let json = {}
            header.forEach( row => {
              json[row.fieldId] = body[i][row.fieldId]
            })
            arr.push({
              ...json,
              key: json.mdm_code
            })
          }
          return arr
        }
        this.table.fieldref.header = resp.data.header
        this.table.fieldref.body = mapTableData(resp.data.header, resp.data.data)
        resolve()
      }).catch(reject)
    })
  }

  @action getCombox(pk_gd, pk_entityitem) {
    return new Promise((resolve, reject) => {
     let url =  '/modeling/mdmshow/card/combo'
      request(url, {
        method: "GET",
        param: {pk_gd, pk_entityitem}
      }).then((resp) => {
        this.table.selectDataSource = resp.data || []
        resolve()
      }).catch(reject)
    })
  }
  @action getEnum(pk_gd, pk_entityitem) {
    return new Promise((resolve, reject) => {
     let url =  `/modeling/enum/queryEnumCombo`;
      request(url, {
        method: "GET",
        param: {pk_entityitem}
      }).then((resp) => {
        debugger
        this.table.selectDataSource = resp.data || []
        resolve()
      }).catch(reject)
    })
  }

  @action getRef(pk_gd, pk_entityitem) {
    return new Promise((resolve, reject) => {
     let url =  `/modeling/mdmshow/card/reference`;
      request(url, {
        method: "GET",
        param: {
          pk_entityitem: pk_entityitem,
          pk_gd: pk_gd,
          rid: new Date().getTime()
      }
      }).then((resp) => {
        debugger
        this.table.selectDataSource = resp.data || []
        resolve()
      }).catch(reject)
    })
  }

  toJson() {
    return {

    }
  }
}
