

import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'
import { post } from 'utils/request.js'
import { success } from 'utils/index.js'

export default class EntityContentStore {

  // 参照
  @observable fieldref = {
    reference: {},  // 参照树
    tableList: {  // 参照树
      body: [],
      header: [
        {
          title: "字段名称",
          dataIndex: "selectedMapItemName",
          key: "selectedMapItemName",
          width: "50%"
        },
        {
          title: "字段编码",
          dataIndex: "selectedMapItemCode",
          key: "selectedMapItemCode",
          width: "50%",
        },
      ]
    },
    combodata: {}, //下拉树
    ifModalShow: false, // 参照的modal
    ifSelectDownModalShow: false, // 下拉的modal
    ifTreeModalShow: false, // 树的modal
    ifTableModalShow: false, // table的modal
    formName: '', //区分参照主数据、树父ID...
  }

  @observable tempReference = {
    ifEntitySelect : false,
    treeref_pkgd: "",
    treeref_pkgd_code: "",
    treeref_pkgd_name: ""
  }

  // 参照映射实体数据
  @observable mappingDatas = {
    selectIndex : "",
    showMap : [],
    selectedMap : [],
    mappingMap : [],
    mappingExist : false,
    item : {
      "mappingMapItemId" : "024fd7da-0f6a-44e0-83ce-d8d5467f739b",
      "showMapItemId" : "402511ff-d681-4a5c-8dc9-d9f1b80734c1",
      "showMapItemName": "省份简称",
      "showMapItemCode": "base",
      "showMapItemNameCode": "省份简称(base)",
      "showMapItemFieldType": "1",
      "selectedMapItemId" : "fa5b396b-2c1c-42f6-b533-a3099b8f6220",
      "selectedMapItemName": "base",
      "selectedMapItemCode": "base",
      "selectedMapItemNameCode": "base(base)",
      "selectedMapItemFieldType": "1",
      "fieldtype" : "1",
      "refid" : "false",
      "dr" : "0",
      "ts" : "2018-11-28 13:42:38",
    },
  }
    // 实体明细数据列
    // entityItems:[],
    // 接口对应实体明细字段
    // interfaceEntityItems:[]

  // 设置参照/下拉框
  @observable currentNode = ''

  // 参照接口
  @action getFieldref(pk_gd, pk_entityitem) {
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmdesign/fieldref1`, {
        method: "GET",
        param: {
          pk_gd,
          pk_entityitem
        }
      }).then((resp) => {
        let reference = resp.data.reference
        let combodata = resp.data.combodata
        this.fieldref.reference = reference[0] || {}
        this.fieldref.combodata = combodata[0] || {}
        resolve()
      }).catch(reject)
    })
  }

  // 获取映射的实体明细和接口的明细
  @action getMappingDatas(showEntityPK, selectEntityPK) {
    return new Promise((resolve, reject) => {
      request(`/socialmapping/getDatas`, {
        method: "GET",
        param: {
          showEntityPK : showEntityPK,
          selectEntityPK : selectEntityPK,
        }
      }).then((resp) => {
         
        let data = resp.data;
        let restDatas = data.obj;
        if(!restDatas){
          this.cleanDatas();
          return;
        }
        this.mappingDatas.showMap = restDatas.showMap;
        this.mappingDatas.selectedMap = restDatas.selectedMap;
        this.mappingDatas.mappingMap = restDatas.mappingMap;
        this.fieldref.tableList.body = restDatas.selectedMap;
        this.mappingDatas.mappingExist = true;
        success(data.message);
        resolve()
      }).catch(reject)
    })
  }

  // 获取映射的实体明细和接口的明细
  @action getMappingDatasIfExist( showEntityPK ) {
    return new Promise((resolve, reject) => {
      request(`/socialmapping/getDatasIfExist`, {
        method: "GET",
        param: {
          showEntityPK : showEntityPK,
        }
      }).then((resp) => {
        let data = resp.data;
        let restDatas = data.obj;
        if(!restDatas){
          this.cleanDatas();
          return;
        }
        this.mappingDatas.showMap = restDatas.showMap;
        this.mappingDatas.selectedMap = restDatas.selectedMap;
        this.mappingDatas.mappingMap = restDatas.mappingMap;
        this.mappingDatas.mappingExist = true;
        this.fieldref.tableList.body = restDatas.selectedMap;
        this.tempReference = {
          ifEntitySelect : true,
          treeref_pkgd : restDatas.selectedtable[0].pk_gd,
          treeref_pkgd_code : restDatas.selectedtable[0].code,
          treeref_pkgd_name : restDatas.selectedtable[0].name,
        }
        //success(data.message);
        resolve()
      }).catch(reject)
    })
  }

  @action deleteByShowTableCodeAndSelectedTableCode(showTablePK, selectedTablePK){
    return new Promise((resolve, reject) => {
      request('/socialmapping/deleteByCode', {
        method: 'GET',
        param: {
          showTablePK : showTablePK,
          selectedTablePK : selectedTablePK,
        }
      }).then((resp) => {
        // success(resp.data.msg)
        this.cleanDatas();
        resolve()
      }).catch(reject)
    })
  }

  // 参照modal框的显示
  @action cleanDatas() {
    this.mappingDatas = {
      showMap : [],
      selectedMap : [],
      mappingMap : [],
      mappingExist : false
    }
    this.tempReference = {
      ifEntitySelect : false,
      treeref_pkgd: "",
      treeref_pkgd_code: "",
      treeref_pkgd_name: ""
    }
  }

  @action getPkgdByCode(code){
    return new Promise((resolve, reject) => {
      request('/modeling/mdmdesign/fieldref/reference/save', {
        data: {
          data: JSON.stringify(data)
        },
        method: 'POST'
      }).then((resp) => {
        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
  }

  @action saveMapping(showEntityPK, selectEntityPK, data){
    return new Promise((resolve, reject) => {
      request('/socialmapping/saveDatas', {
        data: {
          submitDatas: JSON.stringify(data),
          showEntityPK : showEntityPK,
          selectEntityPK : selectEntityPK,
        },
        method: 'POST'
      }).then((resp) => {
        //success(resp.data.msg)
        // 在重新获取数据
        // this.getMappingDatas(showEntityPK, selectEntityPK);
        resolve()
      }).catch(reject)
    })
  }

  // 参照modal框的显示
  @action setRefModal(value) {
    this.fieldref.ifModalShow = value
    this.currentNode = 'ref'
  }

  // 下拉modal框的显示
  @action setSelectDownModal(value, value1, value2) {
    this.fieldref.ifSelectDownModalShow = value
    this.fieldref.ifTreeModalShow = value1
    this.fieldref.ifTableModalShow = value2
    this.currentNode = 'selectDown'
  }

  @action setResource(value,index) {
    if(value){ // 新增
      this.table.mainTableInfo.entity = value;
    }else{ // 删除
       
      let delItem =this.table.mainTableInfo.entity[index];
      delItem.status = 3;
      this.table.delItems.push(delItem);
    }
  }

  @action setTableModal(value, value1, name) {
    this.fieldref.ifModalShow = value
    this.fieldref.ifTreeModalShow = false
    this.fieldref.ifTableModalShow = value1
    this.fieldref.formName = name
    this.currentNode = 'selectDown'
  }

  @action saveReference(data){
    return new Promise((resolve, reject) => {
      request('/modeling/mdmdesign/fieldref/reference/save', {
        data: {
          data: JSON.stringify(data)
        },
        method: 'POST'
      }).then((resp) => {
        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
  }

  @action saveCombodata(data){
     
    return new Promise((resolve, reject) => {
      request('/modeling/mdmdesign/fieldref/combodata/save', {
        data: {
          data: JSON.stringify(data)
        },
        method: 'POST'
      }).then((resp) => {
        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
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
        this.fieldref.tableList.body = body
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
        this.fieldref.tableList.header = header
        resolve()
      }).catch(reject)
    })
  }

  toJson() {
    return {

    }
  }
}
