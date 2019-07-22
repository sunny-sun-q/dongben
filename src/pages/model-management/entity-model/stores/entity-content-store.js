//import axios from "axios";

import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'
//import qs from 'querystring'
import { success, Error } from 'utils/index.js'
import {
  sideBarLoadList
} from 'utils'
// import mockJson from './mock.json' // 对接开箱即用数据的mock数据

export default class EntityContentStore {
  @observable table = {
    info: [],
    mainTableInfo: {
      cacheEntity: [], // 缓存数据信息
      entity: [],
      entity_items: {}
    }, // 主表信息
    secondTableInfo: [], // 子表信息
    configEntityItems: { // 配置项信息
      all_reference:[],
      ref_1_entity_items:[],
      ref_2_entity_items:[],
      ref_3_entity_items:[],
      enum_4_entity_items: [], // 记录所有的枚举选择项
      enum_4_entity_items_del: [], // 记录删除的枚举选择项，提交的时候和enum_4_entity_items拼接发送给后台
      combo_0_entity_items:[],
      validrule_entity_items:[]
    },
    ifShowMainNode: false, // 点击新增主数据
    ifShowMainTable: false, // 新增完主数据之后 主表显示
    fieldLengthMap:{
      "1":100,
      "2":11,
      "3":1,
      "4": '25,8',
      "5":19,
      "6":19,
      "7":64,
      "8":64,
      "9":255,
      "10":255,
      "11":255,
      "12":19,
      "13":100
    },
    ifEditFlag:false, //判断表格内容是否修改
    editIndex:-1,
    ifSaveSuccess: false, //判断保存操作是否成功
  }

  // @observable selectDataSource = []

  @observable codeRulesTable = {
    info: [],
    selectDataSource: [],
    flag:false,
    entity: [],
    entity_items: {},
    codeModel:""
  }


  // 参照
  @observable fieldref = {
    reference: {},  // 参照树
    referenceBase: {},  // 参照树
    reference2:{},  // 修改未保存的参照
    reference2Base:{},  // 修改未保存的参照
    tableList: {  // 参照树
      body: [],
      header: []
    },
    combodata: {}, //下拉树
    combodataBase: {},
    ifModalShow: false, // 参照的modal
    ifSelectDownModalShow: false, // 下拉的modal
    operateIndex: -1,
    NCIndex: -1,
    isNCModalShow: false,
    NCAllData: [], // NCModal中的所有数据
    NCSelectedData: [], // 已经选择的NC数据
    NCShowData: [], // NCModal中的显示数据
    nowNCObj: {}, // 当前操作行的NC数据
    isEnumModalShow: false, // 枚举的modal
    enumSaveData: {}, // 修改过程中的临时保存，确认的时候再放到enum_4_entity_items中
    enumData: [], // 枚举弹框数据
    enumSubData: [], // 枚举弹框子表数据
    ifTreeModalShow: false, // 树的modal
    ifTableModalShow: false, // table的modal
    formName: '', //区分参照主数据、树父ID...
  }

  // 参照切换时改变table中保存的数据
  @observable ifReset = false

  // 点击返回按钮时设置标记
  @observable backFlag = false

  // table切换
  @observable tableStatus = {
    activeTabs: 'father',
    sonActiveTab: -1
  }


  // 复制模型弹出框的信息
  @observable dataModal = {
    showModal: false,
    nodeInfo: {},
    nodeType: '',
    tempNode: {},
  }

  @observable checkModal ={
    showModal: false,
    checkInfo:{
      pk_gd: '',
      pk_validateclass: '',
      name: '',
      classPath: '',
    }
  }

  //校验规则
  @observable validateModal = {
    showModal: false,
    info: {}
  }

  //发布
  @observable publishModal = {
    showModal: false,
    isPublish: false,
    uistyle: {} , //界面风格
  }

  // 设置参照/下拉框
  @observable currentNode = ''

  // 切换主子表
  @action changeActiveTabs(value, tabs = 0) {

    this.tableStatus.activeTabs = value
    if(tabs > -1){
      this.tableStatus.sonActiveTab = tabs
    }
  }

  @action resetMainTable(){
    this.table.mainTableInfo.entity = this.table.mainTableInfo.cacheEntity
  }

  @action setIfRestTable(){
    this.ifReset = !this.ifReset
  }

  @action setBackFlag(backFlag){
    this.backFlag = backFlag
  }

  // 编码规则
  @action setTableInfo(value){
    this.codeRulesTable.info = value
  }

  @action resetCodeRulesTable(){
    this.codeRulesTable.info = []
    this.codeRulesTable.selectDataSource = []
    this.codeRulesTable.flag = false
    this.codeRulesTable.entity = []
    this.codeRulesTable.entity_items = {}
    this.codeRulesTable.codeModel = ""
  }
  checkDelete(entityCode,itemcode){
    return new Promise((resolve, reject) => {
      request(`/modeling/entity/item/deleteColumn?entityCode=${entityCode}&itemCode=${itemcode}`, {
        method: "GET",
        data: {}
      }).then((resp) => {
        resolve(resp.data)
      }).catch(reject)
    })
  }
    /**
   * 获取实体信息（主表+子表）
   * @param {*} pk_gd
   */
  @action getTableRequest(pk_gd) {
    return new Promise((resolve, reject) => {
      request(`/modeling/entity/getEntitys?pk_gd=${pk_gd}`, {
        method: "GET",
        data: {}
      }).then((resp) => {
        // console.log(resp.data)
        this.table.info = []
        this.table.info = resp.data
        var arr = []
        this.table.mainTableInfo = {
          cacheEntity: [], // 缓存数据信息
          entity: [],
          entity_items: {}
        }
        this.table.secondTableInfo = []
        if (resp.data.length === 1) {
          arr = resp.data.slice(0,1)
          let body = arr[0].body
          this.fieldref.NCSelectedData = [];
          body.map(item => {
            item.key = item.orderno
            item.searchId = item.pk_entityitem
            if(item.ob_code){
              this.fieldref.NCSelectedData.push({
                fieldName:item.ob_code,
                displayname:item.ob_column
              })
            }
          })
          this.table.mainTableInfo = {
            cacheEntity: body, // 缓存数据信息
            entity: body,
            entity_items: arr[0].head
          }
        } else if (resp.data.length > 1){
          arr = resp.data.slice(0,1)
          let body = arr[0].body
          if( body!== [] ){
            body.map(item => {item.key = item.orderno;item.searchId = item.pk_entityitem;})
            this.table.mainTableInfo = {
              cacheEntity: body, // 缓存数据信息
              entity: body,
              entity_items: arr[0].head
            }
          }
          // pk_mdentity
          const secondTableInfo = resp.data.slice(1)
          let tempSecondeTable = secondTableInfo.map(item => {
            let tempBody = item.body
            tempBody.map(da => {da.key = da.orderno;da.searchId = da.pk_entityitem})
            return {
              entity: tempBody,
              cacheEntity: tempBody,
              entity_items: item.head,
            }
          })
          this.table.secondTableInfo = tempSecondeTable
        } else if (resp.data.length === 0) {
          this.table.mainTableInfo = {
            cacheEntity: [], // 缓存数据信息
            entity: [],
            entity_items: {}
          }
          this.table.secondTableInfo = []
        }
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 更改标志位
   * @param {*} value  true:有修改未保存  false:没有修改
   */
  @action changeEditFlag(value){
    this.table.ifEditFlag = value;
  }
  @action changeEditIndex(index){
    this.table.editIndex = index;
  }


  /**
   * 配置信息复位
   */
  @action clearConfigEntityItems() {
    this.table.configEntityItems = { // 配置项信息
      all_reference:[],
      ref_1_entity_items:[],
      ref_2_entity_items:[],
      ref_3_entity_items:[],
      enum_4_entity_items:[],
      enum_4_entity_items_del:[],
      combo_0_entity_items:[],
      validrule_entity_items:[]
    }
  }
  /**
   * 下拉缓存复位，将已存库的下拉类型字段改为其他类型时调用
   * @param pk_entityitem
   */
  @action resetComboEntityItems(pk_entityitem) {
    let delIndex = -1;
    this.table.configEntityItems.combo_0_entity_items.find((item,index)=>{
      if( item.pk_entityitem === pk_entityitem ) {
        delIndex = index;
      }
    })
    this.table.configEntityItems.combo_0_entity_items.splice(delIndex,1);
  }

  /**
   * 复制模型弹框是否显示
   * @param {*} value
   */
  @action setCopyModal(value) {
    this.dataModal.showModal = value
  }


  @action setCheckModal(value) {
    this.checkModal.showModal = value
  }

  /**
   * 获取主数据完整信息
   * @param {*} pk_gd
   */
  @action getCheckInfo(pk_gd){
    return new Promise((resolve, reject) => {
      request("/modeling/designInfo/get/validateclass", {
        method: "GET",
        param: {
          pk_gd
        }
      }).then((resp) => {
        this.checkModal.checkInfo={
          pk_gd: pk_gd,
          pk_validateclass: '',
          name: '',
          classPath: '',
        }
        this.checkModal.checkInfo.pk_validateclass = resp.data.data.pk_validateclass || ''
        this.checkModal.checkInfo.name = resp.data.data.name || ''
        this.checkModal.checkInfo.classPath = resp.data.data.classPath || ''
        resolve()
      }).catch(reject)
    })
  }

  @action saveCheckModal(params){
    return new Promise((resolve, reject) => {
      request(`/modeling/designInfo/save/validateclass`, {
        method: "POST",
        data: {
          data: JSON.stringify(params)
        }
      }).then((resp) => {
        if(resp.data.flag){ //保存成功
          this.setCheckModal(false); //是否编辑标志位改为false
          success(resp.data.msg)
        }
        resolve()
      }).catch(reject)
    })
  }
  /**
   * 复制模型弹框info
   * @param {*} node
   */
  @action editNodeBranch(node) {
    this.dataModal.nodeInfo = node.info
  }

  /**
   * 发布模型弹框是否显示
   * @param {*} value
   */
  @action setPublishModal(value) {
    this.publishModal.showModal = value
  }

  /**
   * 配置字段校验规则
   * @param {*} value
   * @param {*} record
   */
  @action setValidateModal(value){
    this.validateModal.showModal = value;
  }

  /**
   * 获取主数据完整信息
   * @param {*} pk_gd
   */
  @action getDesignInfo(pk_gd){
    return new Promise((resolve, reject) => {
      request("/modeling/mdmdesign/getDesignInfo", {
        method: "GET",
        param: {
          pk_gd,
        }
      }).then((resp) => {
        this.dataModal.tempNode = resp.data;
        resolve()
      }).catch(reject)
    })
  }

  // 保存修改的主数据信息
  // @action submitLeafRequest(data, id) {
  //   data = Object.assign(data, {
  //     pk_category: this.dataModal.nodeInfo.pid,
  //     pk_gd : id
  //   })
  //   return new Promise((resolve, reject) => {
  //     request('/modeling/mdmdesign/save', {
  //       data: {
  //         data: JSON.stringify(data)
  //       },
  //       method: 'POST'
  //     }).then((resp) => {
  //       if (!id) {
  //         this.nodeLeaf.info = resp.data.data
  //       }
  //       success(resp.data.msg)
  //       resolve()
  //     }).catch(reject)
  //   })
  // }

  /**
   * 添加子表
   */
  @action addSecondTableList() {
    const secondTableInfo = this.table.secondTableInfo
    secondTableInfo.push({
      entity: [],
      cacheEntity: [],
      entity_items: {}
    })
    this.table.configEntityItems.enum_4_entity_items = []
    this.table.configEntityItems.enum_4_entity_items_del = []
  }

  /**
   * 删除子表
   * @param {*} pk_mdentity
   */
  @action deleteSecondTableList(pk_mdentity) {
    return new Promise((resolve, reject) => {
      request(`/modeling/entity/delete/${pk_mdentity}`, {
        method: "DELETE",
      }).then((resp) => {
        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
  }


  /**
   * 主子表保存
   * @param {*} entity_items
   * @param {*} entity
   */
  @action saveTableRequest(entity_items, entity) {
    let {
      ref_1_entity_items,
      ref_2_entity_items,
      ref_3_entity_items,
      enum_4_entity_items,
      enum_4_entity_items_del,
      combo_0_entity_items,
      validrule_entity_items
    } = this.table.configEntityItems;
    let enumL = enum_4_entity_items.length;
    let real_enum_4_entity_items = [];
    for(let i = 0; i < enumL; i++){
      let nowEnum = enum_4_entity_items[i];
      if(nowEnum.ref_pkgd){
        nowEnum.code = entity_items[i].code;
        nowEnum.name = entity_items[i].name;
        real_enum_4_entity_items.push(nowEnum)
      }
    }
    for(let i = 0; i < enum_4_entity_items_del.length;i++){
      let nowDelItem = enum_4_entity_items_del[i];
      if(nowDelItem.pk_fieldref){
        nowDelItem.status = 3;
        real_enum_4_entity_items.push(nowDelItem);
      }
    }
    return new Promise((resolve, reject) => {
      request(`/mdmdeficonf/save`, {
        method: "POST",
        data: {
          entity_items: JSON.stringify(entity_items),
          entity: JSON.stringify(entity),
          ref_1_entity_items : ref_1_entity_items.length ? JSON.stringify(ref_1_entity_items):'',
          ref_2_entity_items : ref_2_entity_items.length ? JSON.stringify(ref_2_entity_items):'',
          ref_3_entity_items : ref_3_entity_items.length ? JSON.stringify(ref_3_entity_items):'',
          enum_4_entity_items: real_enum_4_entity_items.length? JSON.stringify(real_enum_4_entity_items):'',
          combo_0_entity_items : combo_0_entity_items.length ? JSON.stringify(combo_0_entity_items):'',
          validrule_entity_items : validrule_entity_items.length ? JSON.stringify(validrule_entity_items):'',
        }
      }).then((resp) => {

        this.table.delItems = [];
        this.table.ifSaveSuccess = resp.data.flag;
        if(resp.data.flag){ //保存成功
          this.table.ifEditFlag = false; //是否编辑标志位改为false
        }
        // 先清空参照
    //     reference: {},  // 参照树
    // reference2:{},  // 修改未保存的参照
    // tableList: {  // 参照树
    //   body: [],
    //   header: []
    // },
    // combodata: {}, //下拉树

        success(resp.data.msg)
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 获取参照、下拉、界面风格信息
   * @param {*} pk_gd
   * @param {*} pk_mdentity
   */
  @action getFieldref(pk_gd,pk_mdentity,sonActiveTab) {
    return new Promise((resolve, reject) => {
      this.fieldref.reference = {}
      this.fieldref.reference2 = {}
      this.fieldref.combodata = {}
      request(`/modeling/mdmdesign/fieldref3`, {
        method: "GET",
        param: {
          pk_gd,
          pk_mdentity
        }
      }).then((resp) => {
        let reference = resp.data.reference || []; //参照数组
        for(let j = 0; j < reference.length; j++){
          let nowReference = reference[j];
          nowReference.searchId = nowReference.pk_entityitem
        }
        let resCombodata = resp.data.combodata || []; //下拉数组
        let combodata = []
        for(let i = 0; i < resCombodata.length; i++){
          let nowComboData = resCombodata[i];
          nowComboData.searchId = nowComboData.pk_entityitem
          if(nowComboData.ref_pkgd){
            combodata.push(nowComboData);
          }
        }
        let validrule = resp.data.validrule || []; //校验规则
        let e_enum = resp.data.e_enum || []
        let style = resp.data.style; //界面风格
        let ref_1_entity_items = [];
        let ref_2_entity_items = [];
        let ref_3_entity_items = [];
        let enum_4_entity_items = [];
        reference.forEach((item,index)=>{
          let reftype = Number(item.reftype);
          switch(reftype){
            case 1:
              ref_1_entity_items.push(item);
              break;
            case 2:
              ref_2_entity_items.push(item);
              break;
            case 3:
              ref_3_entity_items.push(item);
              break;
            default:
              break;
          }
        })
        let entity = this.table.mainTableInfo.entity;
        if(typeof sonActiveTab != 'undefined'){
          entity = this.table.secondTableInfo[sonActiveTab].entity;
        }
        for(let i = 0; i < e_enum.length; i++){
          let nowEnum = e_enum[i];
          let code = nowEnum.code;
          for(let j = 0; j < entity.length; j++){
            if(code === entity[j].code){
              let l = enum_4_entity_items.length;
              if(l < (j + 1)){
                let pl = j + 1 - l;
                for(let k =0; k < pl; k++){
                  enum_4_entity_items.push({})
                }
              }
              enum_4_entity_items[j] = nowEnum;
            }
          }
        }
        this.table.configEntityItems = {
          all_reference:reference,
          ref_1_entity_items,
          ref_2_entity_items,
          ref_3_entity_items,
          enum_4_entity_items,
          enum_4_entity_items_del:[],
          combo_0_entity_items:combodata,
          validrule_entity_items:validrule
        }
        this.publishModal.uistyle = style;
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 配置参照模态框是否显示
   * @param {*} value  配置参照弹框
   * @param {*} value1 树参照弹框
   * @param {*} value2 表参照弹框
   * @param {*} name   表单字段名称
   */
  @action setRefModal(value, value1, value2, name) {

    this.fieldref.ifModalShow = value
    this.fieldref.ifTreeModalShow = value1
    this.fieldref.ifTableModalShow = value2
    this.fieldref.formName = name
    this.currentNode = 'ref'
  }

  /**
   * 根据唯一标识code，查询缓存中的参照配置
   * @param {*} code   字段编码
   * @param {*} name   字段名称
   * @param {*} status 标识位(1:修改 2:新增 3:删除)
   */
  @action findRefByCode(code,name,status,index,record){
    let flag = true;  // true:新增  false:修改/删除
    let delItem = {};
    let delIndex = -1;
    this.fieldref.reference = {};
    if(status == 3){
      flag = false;
      for(let i = 1; i < 4; i++){
        let reftype = i;  //删除项的reftype
        let ref_entity_items = reftype? `ref_${reftype}_entity_items` : '';
        if(!ref_entity_items){ return }
        // 根据reftype，去ref1/ref2/ref3中找到该删除项，添加标志位status:3
        this.table.configEntityItems[ref_entity_items].find((item,index)=>{
          delItem = item;
          if(item.searchId === record.searchId){
            delIndex = index;
            item.status = status
            return ;
          }
        })
        // 若删除项的pk_entityitem为空，说明该字段未存库，直接从ref1/ref2/ref3中删除该项
        if(delIndex > -1 && !delItem.pk_entityitem){
          this.table.configEntityItems[ref_entity_items].splice(delIndex,1);
        }
      }

    }else{
      this.table.configEntityItems.all_reference.find((item)=>{
        if(item.searchId === record.searchId){
          if(status != 3){
            if(item.ref_pkgd){
              status = 1
            }else{
              status = 2
            }
          }
          switch(status){
            case 1: //修改
              flag = false;
              this.fieldref.reference = item;  //回显
              this.fieldref.referenceBase = JSON.parse(JSON.stringify(item));  //回显
              this.fieldref.reference2.reftype = item.reftype; //修改前的reftype
              this.fieldref.reference2Base.reftype = item.reftype; //修改前的reftype
              break;
            // case 3: //删除
            //   flag = false;
            //   delItem = item;
            //   let reftype = delItem.reftype;  //删除项的reftype
            //   let ref_entity_items = reftype? `ref_${reftype}_entity_items` : '';
            //   if(!ref_entity_items){ return }
            //   debugger;
            //   // 根据reftype，去ref1/ref2/ref3中找到该删除项，添加标志位status:3
            //   this.table.configEntityItems[ref_entity_items].find((item,index)=>{
            //     if(item.searchId === record.searchId){
            //       delIndex = index;
            //       item.status = status
            //       return ;
            //     }
            //   })
            //   // 若删除项的pk_entityitem为空，说明该字段未存库，直接从ref1/ref2/ref3中删除该项
            //   if(delIndex > -1 && !item.pk_entityitem){
            //     this.table.configEntityItems[ref_entity_items].splice(delIndex,1);
            //   }
            //   break;
            default:

              break;
          }
          return;
        }
      })
    }
    // 新增
    if(flag){
      this.fieldref.referenceBase = {
        pk_fieldref:'',
        pk_mdentity:'',
        pk_mdentity_name:'',
        pk_entityitem:'',
        code:code,
        name:name,
        reftype:'',
        ref_pkgd:'',
        ref_pkgd_name:'',
        treeref_pkgd:'',
        treeref_pkgd_name:'',
        treeparentid:'',
        treeparentid_name:'',
        treelabelfield:'',
        treelabelfield_name:'',
        treeref_foreignkey:'',
        treeref_foreignkey_name:'',
        treelistlabelfield:'',
        treelistlabelfield_name:'',
        status: '2',
        searchId:record.searchId
      }
      this.fieldref.reference = {
        pk_fieldref:'',
        pk_mdentity:'',
        pk_mdentity_name:'',
        pk_entityitem:'',
        code:code,
        name:name,
        reftype:'',
        ref_pkgd:'',
        ref_pkgd_name:'',
        treeref_pkgd:'',
        treeref_pkgd_name:'',
        treeparentid:'',
        treeparentid_name:'',
        treelabelfield:'',
        treelabelfield_name:'',
        treeref_foreignkey:'',
        treeref_foreignkey_name:'',
        treelistlabelfield:'',
        treelistlabelfield_name:'',
        status: '2',
        searchId:record.searchId
      }
    }
  }

  /**
   * 根据唯一标识code，查询缓存中的下拉配置
   * @param {*} code
   * @param {*} name
   * @param {*} status 标识位(1:修改 2:新增 3:删除)
   */
  @action findComboByCode(code,name,status,index,record){
    let flag = true;  // true:新增  false:修改/删除
    let delIndex = -1;
    this.table.configEntityItems.combo_0_entity_items.find((item,index)=>{
      if(item.searchId === record.searchId){
        if(status != 3){
          if(item.ref_pkgd){
            status = 1
          }else{
            status = 2
          }
        }
        delIndex = index;
        switch(status){
          case 1: //修改
            flag = false;
            this.fieldref.combodata = item;
            this.fieldref.combodataBase = JSON.parse(JSON.stringify(item));
            break;
          case 3: //删除
            flag = false;
            // 给删除的下拉字段，添加标志位status:3
            item.status = status;
            // 若删除项的pk_entityitem为空，说明该字段未存库，直接从combo_0_entity_items中删除该项
            if(delIndex > -1 && !item.pk_entityitem){
              this.table.configEntityItems.combo_0_entity_items.splice(delIndex,1);
            }
            break;
          default:
            break;
        }
      }
    })
    // 新增
    if(flag){
      this.fieldref.combodataBase = {
        pk_fieldref:'',
        pk_mdentity:'',
        pk_mdentity_name:'',
        pk_entityitem:'',
        code:code,
        name:name,
        reftype:0,
        ref_pkgd:'',
        ref_pkgd_name:'',
        treeref_pkgd:'',
        treeref_pkgd_name:'',
        treeparentid:'',
        treeparentid_name:'',
        treelabelfield:'',
        treelabelfield_name:'',
        treelistlabelfield_name:'',
        treeref_foreignkey:'',
        treeref_foreignkey_name:'',
        treelistlabelfield:'',
        searchId:record.searchId
      }
      this.fieldref.combodata = {
        pk_fieldref:'',
        pk_mdentity:'',
        pk_mdentity_name:'',
        pk_entityitem:'',
        code:code,
        name:name,
        reftype:0,
        ref_pkgd:'',
        ref_pkgd_name:'',
        treeref_pkgd:'',
        treeref_pkgd_name:'',
        treeparentid:'',
        treeparentid_name:'',
        treelabelfield:'',
        treelabelfield_name:'',
        treelistlabelfield_name:'',
        treeref_foreignkey:'',
        treeref_foreignkey_name:'',
        treelistlabelfield:'',
        searchId:record.searchId
      }
    }
  }

  /**
   * 配置下拉模态框是否显示
   * @param {*} value  配置下拉弹框
   * @param {*} value1 树参照弹框
   * @param {*} value2 表参照弹框
   */
  @action setSelectDownModal(value, value1, value2) {

    this.fieldref.ifSelectDownModalShow = value
    this.fieldref.ifTreeModalShow = value1
    this.fieldref.ifTableModalShow = value2
    this.currentNode = 'selectDown'
  }
  // 设置下拉选项当前的选中行
  @action setOperateIndex(index){
    this.fieldref.operateIndex = index;
  }

  // 设置NC当前的选中行
  @action setNCIndex(index,record){
    this.fieldref.NCIndex = index;
  }

  // 设置NCModal是否显示
  @action setNCModal(value) {
    this.fieldref.isNCModalShow = value
  }

  /**
   * 获取NCModal中的数据
   * @param {*} code
   * @param {*} name
   * @param {*} status 标识位(1:修改 2:新增 3:删除)
   */
  @action findNCAllData(pk_obinfo,entityId){
    return new Promise((resolve, reject) => {
      let params = {
        pk_obinfo,
        entityId
      }
      request(`/obInfo/getPropInfoById`, {
        method: "GET",
        param: params
      }).then((resp) => {
        // let resp = {}
        // resp.data = mockJson
        let showData = []
        if(resp.data.flag === 'success'){
          // pk_obid对应顶层id字段
          // ob_column_id对应每一行propertylist中的id
          // pk_obinfo 对应传入的pk_obinfo
          // ob_table 对应顶层的tableName
          let id = resp.data.data.id
          let tableName = resp.data.data.tableName;
          this.fieldref.NCAllData = resp.data.data.propertyList;
          for(let i = 0;i < this.fieldref.NCAllData.length; i++){
            let nowData = this.fieldref.NCAllData[i];
            nowData.pk_obid = id;
            nowData.ob_column_id = nowData.id;
            nowData.pk_obinfo = pk_obinfo;
            nowData.ob_table = tableName;
            let flag = true;
            for(let j = 0; j < this.fieldref.NCSelectedData.length; j++){
              let nowSelectData = this.fieldref.NCSelectedData[j]
              if(nowData.fieldName === nowSelectData.fieldName){
                flag = false;
              }
            }
            if(flag){
              showData.push(nowData);
            }
          }
          this.fieldref.NCShowData = showData;
        }else{
          Error(resp.data.msg)
        }
        resolve()
      }).catch(reject)
    })
  }
  /**
   * 获取枚举值
   * @param {*} code
   * @param {*} name
   * @param {*} status 标识位(1:修改 2:新增 3:删除)
   */
  @action findEnumByCode(code,name,status,index){
      return new Promise((resolve, reject) => {
        this.fieldref.enumData = []
        this.fieldref.enumSubData = []
        this.fieldref.enumCode = code;
        this.fieldref.enumName = name;
        let params = {
          pageIndex: 1,
          pageSize: 9999,
          complexCond:''
        }
        request(`/modeling/enum/fuzzyInquiryOfComplex`, {
          method: "GET",
          param: params
        }).then((resp) => {
          // let resp = {}
          // resp.data = {
          //   "msg" : "查询数据成功!",
          //   "pageCount" : 1,
          //   "total" : 4,
          //   "flag" : "success",
          //   "data" : [ {
          //     "metaDefinedName" : "MDEnumTypeVO",
          //     "namespace" : "com.yonyou.iuapmdm.modeling",
          //     "status" : 0,
          //     "changedPropertyNames" : null,
          //     "pk_enumtype" : "96f15c20-0cc6-449b-a6bd-5ccab1e63b67",
          //     "code" : "rr", // 分类编码
          //     "name" : "rr", // 分类名称
          //     "v_range" : "rr",  // 值域
          //     "descri" : "rr", // 备注
          //     "orderno" : 4,
          //     "dr" : 0,
          //     "ts" : "28-3月 -19 04.16.23.619000000 下午",
          //     "primaryKeyValue" : "96f15c20-0cc6-449b-a6bd-5ccab1e63b67",
          //     "tablename" : "uapmdm_enumtype",
          //     "primaryKey" : "pk_enumtype"
          //   }, {
          //     "metaDefinedName" : "MDEnumTypeVO",
          //     "namespace" : "com.yonyou.iuapmdm.modeling",
          //     "status" : 0,
          //     "changedPropertyNames" : null,
          //     "pk_enumtype" : "15dc3b99-e64c-4757-bea0-daa664e949af",
          //     "code" : "ee",
          //     "name" : "ee",
          //     "v_range" : "ee",
          //     "descri" : "ee",
          //     "orderno" : 3,
          //     "dr" : 0,
          //     "ts" : "28-3月 -19 02.59.35.354000000 下午",
          //     "primaryKeyValue" : "15dc3b99-e64c-4757-bea0-daa664e949af",
          //     "tablename" : "uapmdm_enumtype",
          //     "primaryKey" : "pk_enumtype"
          //   }, {
          //     "metaDefinedName" : "MDEnumTypeVO",
          //     "namespace" : "com.yonyou.iuapmdm.modeling",
          //     "status" : 0,
          //     "changedPropertyNames" : null,
          //     "pk_enumtype" : "75c7ad06-096a-4636-9a43-8b3b49606791",
          //     "code" : "ww",
          //     "name" : "ww",
          //     "v_range" : "ww",
          //     "descri" : "ww",
          //     "orderno" : 2,
          //     "dr" : 0,
          //     "ts" : "28-3月 -19 02.59.30.046000000 下午",
          //     "primaryKeyValue" : "75c7ad06-096a-4636-9a43-8b3b49606791",
          //     "tablename" : "uapmdm_enumtype",
          //     "primaryKey" : "pk_enumtype"
          //   }, {
          //     "metaDefinedName" : "MDEnumTypeVO",
          //     "namespace" : "com.yonyou.iuapmdm.modeling",
          //     "status" : 0,
          //     "changedPropertyNames" : null,
          //     "pk_enumtype" : "ab858149-3064-4eb1-bcb8-069ed0971d16",
          //     "code" : "qq1",
          //     "name" : "qq1",
          //     "v_range" : "qq1",
          //     "descri" : "qq1",
          //     "orderno" : 1,
          //     "dr" : 0,
          //     "ts" : "28-3月 -19 08.09.35.215000000 下午",
          //     "primaryKeyValue" : "ab858149-3064-4eb1-bcb8-069ed0971d16",
          //     "tablename" : "uapmdm_enumtype",
          //     "primaryKey" : "pk_enumtype"
          //   } ]
          // }
          if(resp.data.flag === 'success'){
            let datas = resp.data.data;
            let nowEnumItem = {};
            // 设置选中状态
            if(status === 1){
              nowEnumItem = this.table.configEntityItems.enum_4_entity_items[this.fieldref.operateIndex]
            }
            for(let i = 0; i < datas.length; i++){
              datas[i].key = datas[i].pk_enumtype
              if(datas[i].pk_enumtype === nowEnumItem.ref_pkgd){
                datas[i]._checked = true;
              }
            }
            this.fieldref.enumSaveData = resp.data.data[index] || {}
            this.fieldref.enumData = resp.data.data;
          }else{
            Error(resp.data.msg)
          }

          resolve()
        }).catch(reject)
      })

  }

  /**
   * 获取枚举子表值
   * @param {*} code
   * @param {*} name
   * @param {*} status 标识位(1:修改 2:新增 3:删除)
   */
  @action findEnumSubData(pk_enumtype,index){
    // console.log(pk_enumtype)
    // let pk_enumtype = '75c7ad06-096a-4636-9a43-8b3b49606791';
    return new Promise((resolve, reject) => {
      this.fieldref.enumSubData = []
      let params = {"pk_enumtype":pk_enumtype, "selectType": "0"}
      request(`/modeling/enum/queryEnumValue`, {
        method: "GET",
        param: params
      }).then((resp) => {
        // let resp = {}
        // resp.data = {
        //   "msg" : "查询数据成功!",
        //   "flag" : "success",
        //   "data" : [ {
        //     "metaDefinedName" : "MDEnumValueVO",
        //     "namespace" : "com.yonyou.iuapmdm.modeling",
        //     "status" : 0,
        //     "changedPropertyNames" : null,
        //     "pk_enumvalue" : "bfcf901a-6bd4-427a-afd5-f9cc3b594503",
        //     "pk_enumtype" : "75c7ad06-096a-4636-9a43-8b3b49606791",
        //     "category_code" : "w11", // 分类编码
        //     "code" : "w11", // 编码
        //     "name" : "w11", // 名称
        //     "enum_value" : "w11", // 值
        //     "descri" : "w11", // 备注
        //     "orderno" : 1,
        //     "dr" : 0,
        //     "ts" : "28-3月 -19 08.09.46.637000000 下午             "
        //   } ]
        // }
        if(resp.data.flag === 'success'){
          this.fieldref.enumData[index].innerData = resp.data.data;
        }else{
          Error(resp.data.msg)
        }
        resolve()
      }).catch(reject)
    })

  }


  /**
   * 配置枚举模态框是否显示
   * @param {*} value  配置枚举框
   * @param {*} value1 树参照弹框
   * @param {*} value2 表参照弹框
   */
  @action setEnumModal(value, value1, value2) {
    this.fieldref.isEnumModalShow = value
    // this.fieldref.ifTreeModalShow = value1
    // this.fieldref.ifTableModalShow = value2
    this.currentNode = 'enum'
  }

  @action okEnum(){
    let data = this.fieldref.enumSaveData;
    let index = this.fieldref.operateIndex;
    let enum_4_entity_itemsArr = this.table.configEntityItems.enum_4_entity_items;
    let oldLength = enum_4_entity_itemsArr.length;
    if(oldLength < (index + 1)){
      let l = (index + 1) - oldLength;
      for(let i = 0; i < l; i++){
        enum_4_entity_itemsArr.push({});
      }
    }
    enum_4_entity_itemsArr[index] = data;
  }

  @action setTableModal(value, value1, name) {
    this.fieldref.ifModalShow = value
    this.fieldref.ifTreeModalShow = false
    this.fieldref.ifTableModalShow = value1
    this.fieldref.formName = name
  }

  @action resetRefMsg(value) {
    this.fieldref.reference = value
  }

  @action resetCombodata(value) {
    this.fieldref.combodata = value

  }

  @action setResource(value, index) {
    if(value){ // 新增
      this.table.mainTableInfo.entity = value;
    }else{ // 删除
      let delItem =this.table.mainTableInfo.entity[index];
      delItem.status = 3;
      this.table.delItems.push(delItem);
    }
  }

  @action setSecondResource(value, index) {

    if(value){ // 新增
      this.table.secondTableInfo[this.tableStatus.sonActiveTab].entity = value;
    }else{ // 删除
      let delItem =this.table.secondTableInfo.entity[index];
      delItem.status = 3;
      this.table.delItems.push(delItem);
    }
  }

  /**
   * 保存参照配置到缓存中
   * @param {*} data     配置项
   * @param {*} reftype  参照显示风格
   */
  @action saveReference(data,reftype){
    let code1 = this.fieldref.reference.code; //修改参照前
    let code2 = data.code; //修改参照后
    let flag = true;
    let reftype1 = this.fieldref.reference2.reftype;
    let reftype2 = data.reftype;
    let index1 = -1; // 修改前元素所在数组的下标
    let index2 = -1;
    let ref_entity_items1 = `ref_${reftype1}_entity_items`; //修改前
    let ref_entity_items2 = `ref_${reftype2}_entity_items`; //修改后
    if(reftype1){
      index1 = this.table.configEntityItems[ref_entity_items1].findIndex((item,index)=>{
        return item.searchId === data.searchId;
        // if(item.searchId === data.searchId){
        //   flag = false;
        //   return index;
        // }
      })
      if (index1 > -1) {
        this.table.configEntityItems[ref_entity_items1].splice(index1,1);
      }
      index2 = this.table.configEntityItems.all_reference.findIndex((item,index)=>{
        return item.searchId === data.searchId;
        // if(item.searchId === data.searchId){
        //   flag = false;
        //   return index;
        // }
      })
      if(index2 > -1){
        this.table.configEntityItems.all_reference.splice(index2,1);
      }
    }

    this.table.configEntityItems[ref_entity_items2].push(data);
    this.table.configEntityItems.all_reference.push(data);



    // if(reftype1 && code1 === code2){ //修改同一参照
    //   index1 = this.table.configEntityItems[ref_entity_items1].findIndex((item,index)=>{
    //     if(item.code === code2){
    //       flag = false;
    //       return index;
    //     }
    //   })
    //   if (index1 > -1) {
    //     if(reftype1 && reftype1 != reftype2){ //修改了类型reftype

    //       this.table.configEntityItems[ref_entity_items1].splice(index1,1);

    //       this.table.configEntityItems[ref_entity_items2].push(data);
    //     }else{ //没有修改参照显示风格reftype
    //       this.table.configEntityItems[ref_entity_items1].splice(index1,1,data);
    //       // console.log(this.table.configEntityItems[ref_entity_items1])
    //     }
    //   }
    // }

    // //todo:是否同步到all_reference？
    // if((!reftype1 && flag) || index1 === -1){ //新增
    //   // data.status = '0' // 新增参照
    //   this.table.configEntityItems[ref_entity_items2].push(data);
    //   this.table.configEntityItems.all_reference.push(data);
    // }
  }

  @action resetConfigEntityItems(record){
    let configEntityItems = this.table.configEntityItems;
    let searchId = record.searchId
    let code = record.code;
    let name = record.name;

    let all_reference = configEntityItems.all_reference;
    for(let i = 0; i < all_reference.length; i++){
      let nowall_reference = all_reference[i];
      if(nowall_reference.searchId === searchId){
        nowall_reference.code = code;
        nowall_reference.name = name;
      }
    }
    let ref_1_entity_items = configEntityItems.ref_1_entity_items;
    for(let i = 0; i < ref_1_entity_items.length; i++){
      let nowref_1_entity_items = ref_1_entity_items[i];
      if(nowref_1_entity_items.searchId === searchId){
        nowref_1_entity_items.code = code;
        nowref_1_entity_items.name = name;
      }
    }
    let ref_2_entity_items = configEntityItems.ref_2_entity_items;
    for(let i = 0; i < ref_2_entity_items.length; i++){
      let nowref_2_entity_items = ref_2_entity_items[i];
      if(nowref_2_entity_items.searchId === searchId){
        nowref_2_entity_items.code = code;
        nowref_2_entity_items.name = name;
      }
    }
    let ref_3_entity_items = configEntityItems.ref_3_entity_items;
    for(let i = 0; i < ref_3_entity_items.length; i++){
      let nowref_3_entity_items = ref_3_entity_items[i];
      if(nowref_3_entity_items.searchId === searchId){
        nowref_3_entity_items.code = code;
        nowref_3_entity_items.name = name;
      }
    }

    let enum_4_entity_items = configEntityItems.enum_4_entity_items;
    for(let i = 0; i < enum_4_entity_items.length; i++){
      let nowenum_4_entity_items = enum_4_entity_items[i];
      if(nowenum_4_entity_items.searchId === searchId){
        nowenum_4_entity_items.code = code;
        nowenum_4_entity_items.name = name;
      }
    }
    let enum_4_entity_items_del = configEntityItems.enum_4_entity_items_del;
    for(let i = 0; i < enum_4_entity_items_del.length; i++){
      let nowenum_4_entity_items_del = enum_4_entity_items_del[i];
      if(nowenum_4_entity_items_del.searchId === searchId){
        nowenum_4_entity_items_del.code = code;
        nowenum_4_entity_items_del.name = name;
      }
    }
    let combo_0_entity_items = configEntityItems.combo_0_entity_items;
    for(let i = 0; i < combo_0_entity_items.length; i++){
      let nowcombo_0_entity_items = combo_0_entity_items[i];
      if(nowcombo_0_entity_items.searchId === searchId){
        nowcombo_0_entity_items.code = code;
        nowcombo_0_entity_items.name = name;
      }
    }
  }

  /**
   * 保存下拉配置到缓存中
   * @param {*} data
   */
  @action saveCombodata(data){
    let flag = true;
    let oThis = this;
    this.table.configEntityItems.combo_0_entity_items.find((item,index)=>{
      if(item.searchId === data.searchId){
        item = data; // 修改
        oThis.table.configEntityItems.combo_0_entity_items[index] = data;
        flag = false;
        return ;
      }
    })

    // 新增
    if(flag){
      this.table.configEntityItems.combo_0_entity_items.push(data);
      this.fieldref.combodata = data;
    }
    // return new Promise((resolve, reject) => {
    //   request('/modeling/mdmdesign/fieldref/combodata/save', {
    //     data: {
    //       data: JSON.stringify(data)
    //     },
    //     method: 'POST'
    //   }).then((resp) => {
    //     success(resp.data.msg)
    //     resolve()
    //   }).catch(reject)
    // })
  }

  /**
   * 保存枚举到缓存中
   * @param {*} data
   */
  @action saveEnumdata(data){
    this.fieldref.enumSaveData = data;
    this.okEnum();
  }

  /**
   * 表参照请求，实体字段
   * @param {*} fullclassname
   * @param {*} type
   * @param {*} pk_gd
   * @param {*} ref_boolbean
   */
  @action getEntityValue(fullclassname, type, pk_gd, ref_boolbean, entity) {
    return new Promise((resolve, reject) => {
      this.fieldref.tableList.body = []
      this.fieldref.tableList.header = []
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
        resp.data.data && resp.data.data.forEach((item,index) => {
          body.push(Object.assign(item, {
              key:index
            })
          )
        });
        if (entity) body = entity
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

  /**
   * 获取校验规则
   * @param {*} code
   * @param {*} name
   * @param {*} status
   */
  @action getValidateRule(code,name,status){

    let flag = true;
    let delIndex = -1;
    this.table.configEntityItems.validrule_entity_items.find((item,index)=>{
      if(item.code === code){
        delIndex = index;
        switch(status){
          case 1: //修改
            flag = false;
            this.validateModal.info = item;
            break;
          case 3: //删除
            flag = false;
            // 给删除的下拉字段，添加标志位status:3
            item.status = status;
            // 若删除项的pk_entityitem为空，说明该字段未存库，直接从validrule_entity_items中删除该项
            if(delIndex > -1 && !item.pk_entityitem){
              this.table.configEntityItems.validrule_entity_items.splice(delIndex,1);
            }
            break;
          default:
            flag = false;
            this.validateModal.info = item;
            break;
        }
      }
    })
    // 新增
    if(flag){
      this.validateModal.info = {
        "code":code,
        "def1":0,
        "defaultvalue":"",
        "dr":0,
        "fieldlength":"",
        "fieldtype":1,
        "isarray":false,
        "isunique":false,
        "isvisible":true,
        "isvisibleonreflist":false,
        "metaDefinedName":"MDEntityItemsVO",
        "name":name,
        "namespace":"",
        "orderno":0,
        "pk_entityitem":"",
        "pk_mdentity":"",
        "pk_validate_rule":"",
        "primaryKey":"",
        "primaryKeyValue":"",
        "queryatt":false,
        "ref_pkgd":"",
        "regexvalidateclass":"",
        "required":false,
        "selfdefineheight":0,
        "selfdefinename":"",
        "selfdefinewidth":0,
        "status":0,
        "validateprompt":"",
        "validatetype":0
      }
    }
    // return new Promise((resolve, reject) => {
    //   request('/modeling/validaterule/getdata1', {
    //     method: 'GET',
    //     param: {
    //       pk_mdentity,
    //       pk_entityitem
    //     }
    //   }).then((resp) => {
    //     this.validateModal.info = resp.data.gridData[0] || {}
    //     resolve()
    //   }).catch(reject)
    // })
  }

  /**
   * 保存校验规则
   * @param {*} data
   */
  @action saveValidateRule(data){

    let flag = true;
    if(this.table.configEntityItems.validrule_entity_items.length>0){
      data = Object.assign(this.table.configEntityItems.validrule_entity_items[0],data)
    }
    this.table.configEntityItems.validrule_entity_items.find((item)=>{
      if(item.code === data.code){
        item = data; // 修改
        flag = false;
        return ;
      }
    })

    // 新增
    if(flag){
      this.table.configEntityItems.validrule_entity_items.push(data);
      this.validateModal.info = data;
    }
    // let data = [];
    // data.push(entity_items);
    //
    // return new Promise((resolve, reject) => {
    //   request('/modeling/validaterule/save', {
    //     data: {
    //       entity_items:JSON.stringify(data)
    //     },
    //     method: 'POST'
    //   }).then((resp) => {
    //     success(resp.data.msg)
    //     resolve()
    //   }).catch(reject)
    // })
  }

  /**
   * 节点发布
   * @param {*} pk_gd
   * @param {*} data
   */
  @action publishNode(pk_gd,data){
    return new Promise((resolve, reject) => {
      request('/modeling/mdmdesign/fieldref/style/save', {
        data: {
          pk_gd:pk_gd,
          data:JSON.stringify(data),
          isPublish:true
        },
        method: 'POST'
      }).then((resp) => {
        success(resp.data.msg)
        sideBarLoadList();
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 查看节点发布内容回显
   * @param {*} pk_gd
   * @param {*} data
   */
  @action getPublishMsg(pk_gd){
    return new Promise((resolve, reject) => {
      request('/modeling/mdmdesign/fieldref', {
        param: {
          pk_gd
        },
        method: 'GET'
      }).then((resp) => {
        // console.log(resp.data)
        resolve(resp.data.style)
      }).catch(reject)
    })
  }

  /**
   * 查询节点是否已发布
   * @param {*} pk_gd
   */
  @action queryPublish(pk_gd){
    return new Promise((resolve, reject) => {
      request('/modeling/mdmdesign/publish/nodes', {
        method: 'GET',
        param: {
          pk_gd
        }
      }).then((resp) => {
        this.publishModal.isPublish = resp.data
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 反发布
   * @param {*} pk_gd
   */
  @action unPublish(pk_gd){
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmdesign/unpublish/${pk_gd}`, {
        method: 'POST',
      }).then((resp) => {
        success(resp.data.msg)
        sideBarLoadList();
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 获取主数据下的entity
   * @param {*} pk_mdentity
   */
  @action getEntity(pk_mdentity){
    return new Promise((resolve, reject) => {
      request('/modeling/entity/getEntity', {
        method: 'GET',
        param: {
          pk_mdentity
        }
      }).then((resp) => {
        this.codeRulesTable.entity = resp.data.entity || []
        this.codeRulesTable.entity_items = resp.data.entity_items || {}
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 判断是否启用编码规则
   * @param {*} pk_mdentity
   */
  @action hasUseBillCode(pk_mdentity){
    return new Promise((resolve, reject) => {
      request('/modeling/entity/hasUseBillCode', {
        method: 'GET',
        param: {
          pk_mdentity
        }
      }).then((resp) => {
        this.codeRulesTable.flag = resp.data.data || false
        resolve()
      }).catch(reject)
    })
  }

  /**
     *保存平台提供的编码规则接口
     * @param {*} postData
     * @returns
     * @memberof addPubBcrInfo
     */
    @action addPubBcrInfo(postData,isExistBillCode) {
      return new Promise((resolve, reject) => {
        request('/modeling/billcode/addPubBcrInfo', {
          method: "POST",
          //data: postData
          data: {
            data: JSON.stringify(postData)
          },
        }).then((resp) => {
          if(resp.data.data)
          {
            let { entity,info, entity_items } = this.codeRulesTable
            entity_items.map((item) => {
              info.map((i) => {
                if(item.code == i.code){
                  item.billcodetype = i.billcodetype
                }
              })
            })
            const items = isExistBillCode? entity_items : []
            entity.usebillcode = true
            this.updateEntity(entity, items, isExistBillCode)
            if(!isExistBillCode){
              success("启用编码成功！请建立编码规则后再进行配置")
            }
          }else{
            Error("启用编码失败")
          }
          //resp.data.billcode
        resolve()
        }).catch(reject)
      })
    }

     /**
     *addPubBcrInfo后更新主数据编码规则
     *
     * @param {*} postData
     * @returns
     * @memberof updateEntity
     */
    @action updateEntity(entity, entity_items, isExistBillCode) {
      return new Promise((resolve, reject) => {
        request(`/modeling/entity/save`, {
          method: "POST",
          data: {
            entity: JSON.stringify(entity),
            entity_items: JSON.stringify(entity_items)
          },
        }).then((resp) => {
          //resp.data.billcode
          if(isExistBillCode)
            success("保存成功！")
        resolve()
        }).catch(reject)
      })
    }

  /**
   * 获取下拉表名
   * @param {*} pk_gd
   */
  @action getTables(pk_gd){
    return new Promise((resolve, reject) => {
      request('/modeling/billcode/combo', {
        method: 'GET',
        param: {
          pk_gd
        }
      }).then((resp) => {
        this.codeRulesTable.selectDataSource = resp.data
        resolve()
      }).catch(reject)
    })
  }

  /**
     *获取编码规则
     *
     * @param {*} postData
     * @returns
     * @memberof getBillCodeType
     */
    @action getBillCodeType(postData) {
      return new Promise((resolve, reject) => {
        request('/modeling/billcode/getBillCodeType', {
          method: "POST",
          data: {
            data: JSON.stringify(postData)
          },

        }).then((resp) => {
          if(resp.data)
            this.codeRulesTable.codeModel = JSON.parse(resp.data.data).codeMode
        resolve()
        }).catch(reject)
      })
    }

   /**
   * 获取编码表格数据
   * @param {*} pk_mdentity
   */
  @action getTableData(pk_mdentity){
    return new Promise((resolve, reject) => {
      request('/modeling/billcode/getdata', {
        method: 'GET',
        param: {
          pk_mdentity
        }
      }).then((resp) => {
        this.codeRulesTable.info = resp.data.gridData || []
        resolve()
      }).catch(reject)
    })
  }

  /**
   * 复制模型
   * @param {*} value
   */
  @action copyDesign(value){
    value.publish = 0
    value.state = 0
    return new Promise((resolve, reject) => {
      request(`/modeling/mdmdesign/copyDesign`, {
        method: 'POST',
        data: {
          data:JSON.stringify(value)
        },
      }).then((resp) => {
        // 复制之后 清空 上级分类
        // console.log('info[fieldName]', fieldName, info[fieldName]) treeref_pkgd_name

        success(resp.data.msg)
        resolve(resp.data)
      }).catch(reject)
    })
  }

  toJson() {
    return {

    }
  }
}
