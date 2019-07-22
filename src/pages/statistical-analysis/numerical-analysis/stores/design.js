

import {
    observable,
    action,
  } from 'mobx'
import qs from 'qs'
  import request from 'utils/request.js'
  import { success } from 'utils/index.js'

  export default class Design {
    @observable statisticsData = {  // 第一副图与自定义弹出框所用
      desiList: [],
      treeData: [{
        "id": 0,
        "pid": '',
        "name": "所有可统计的主数据",
        "children": []
      }],
      allTreeNodeKeys: [],// 'a123,b456'
    }

    @observable custom = {  // 第一副图与自定义弹出框所用
      showModal: false,
      xyDatas: [],
      submitSelectedKeys: [],      // 确定提交时的
      checkSelectedKeys: [],       // 选择框选中的
      currentShowSelectedKeys: [], // 当前展示的
      echarts_instance1: {},
      echarts_instance2: {},
      echarts_instance3: {},
    }

    @observable onePictureClick = { // 图一
      index: 0,
      pk_gd: '',
      data: {}
    }

    @observable twoPictureClick = {  // 图二
      load_sysregisters: [],
      load_pk_sysregisters: '',
      dis_sysregisters: [],
      dis_pk_sysregisters: ''
    }

    @observable threePictureClick = { // 图三
      // 单主数据单系统的分发量
      dis_url1 : '/distributeThirdPartService/queryDisNum3', 
      // 单主数据所有系统分发量
      dis_url2 : '/distributeThirdPartService/queryDisNum3',  
      disDatas: {
        date: [],
        series: [{
          name: '',
          data: []
        }]
      },
      // 单主数据单系统的装载量
      load_url1 : '/loadingThirdPartService/queryLoadNum3',  
      // 单主数据所有系统装载量
      load_url2 : '/loadingThirdPartService/queryLoadNum3', 
      loadDatas: {
        date: [],
        series: [{
          name: '',
          data: []
        }]
      }
    }

    @action canStatisticsMdm() {
       
      return new Promise((resolve, reject) => {
        request('/modeling/mdmdesign/canStatisticsMdm', {
          method: "GET",
          param: {}
        }).then((resp) => {
           
          this.statisticsData.desiList = resp.data.desiList
          let children = [], pk_gds = []
          for(let i=0; i< resp.data.desiList.length; i++){
            pk_gds.push(resp.data.desiList[i].pk_gd)
            let treeNode = {
              "id": resp.data.desiList[i].pk_gd,
              "pid":  resp.data.desiList[i].pk_category,
              "name": resp.data.desiList[i].name,
              "children": []
            }
            children.push(treeNode)
          } 
          this.statisticsData.treeData[0].children = children
          this.statisticsData.allTreeNodeKeys = pk_gds
          this.custom.checkSelectedKeys = pk_gds
          this.custom.submitSelectedKeys = pk_gds
          resolve()
        }).catch(reject)
      })
    }

    @action queryDesignCount() {
       
      let pk_gdss = ''
      for(let i=0; i<this.custom.submitSelectedKeys.length; i++){
        pk_gdss = pk_gdss + this.custom.submitSelectedKeys[i] + ","
      }
      pk_gdss = pk_gdss.substr(0, pk_gdss.length-1)

      return new Promise((resolve, reject) => {
        request(`/modeling/mdmdesign/queryDesignCount`, {
          method: "GET",
          param: {
            pk_gds: pk_gdss,
            mdm_categorys: ''
          }
        }).then((resp) => {
           
          this.custom.xyDatas = resp.data.data
          this.custom.currentShowSelectedKeys = this.custom.submitSelectedKeys

          this.onePictureClick.index = 0
          this.onePictureClick.pk_gd = this.custom.xyDatas[0].pk_gd
          this.onePictureClick.data = this.custom.xyDatas[0]


        resolve()
        }).catch(reject)
      })
    }

    // 查询主数据对应的写入系统集合和分发系统集合pk_category
    @action queryAuthorityByPkgdAndCond() {

      return new Promise((resolve, reject) => {
        request(`/sysAuthority/queryAuthorityByPkgdAndCond`, {
          method: "GET",
          param: {
            pk_gd: this.onePictureClick.pk_gd,
            pk_category: ''
          }
        }).then((resp) => {

          let _load_pk_sysregisters = '', _dis_pk_sysregisters = ''
          let _load_sysregisters = [], _dis_sysregisters=[]
          if(resp.data.data1.length > 0){
            _load_sysregisters = resp.data.data1
            for(let i=0; i<resp.data.data1.length; i++){
              _load_pk_sysregisters += resp.data.data1[i].pk_sysregister + ","
            }
            _load_pk_sysregisters = _load_pk_sysregisters.substr(0, _load_pk_sysregisters.length-1)
          }
          if(resp.data.data2.length > 0){
            _dis_sysregisters = resp.data.data2
            for(let i=0; i<resp.data.data2.length; i++){
              _dis_pk_sysregisters += resp.data.data2[i].pk_sysregister + ","
            }
            _dis_pk_sysregisters = _dis_pk_sysregisters.substr(0, _dis_pk_sysregisters.length-1)
          }

          let _twoPictureClick = {
            load_sysregisters: _load_sysregisters,
            load_pk_sysregisters: _load_pk_sysregisters,
            dis_sysregisters: _dis_sysregisters,
            dis_pk_sysregisters: _dis_pk_sysregisters
          }

          this.twoPictureClick = _twoPictureClick
          console.log("this.twoPictureClick", this.twoPictureClick)

        resolve()
        }).catch(reject)
      })
    }

    @action queryDisNum(type) {
      if(undefined == this.twoPictureClick.dis_pk_sysregisters || '' == this.twoPictureClick.dis_pk_sysregisters){
        let _disDatas= {
          date: [],
          series: [{
            name: '',
            data: []
          }]
        }
        this.threePictureClick.disDatas = _disDatas
        return 
      }
      let url = ''
      if('allSys' === type){
        url = this.threePictureClick.dis_url2
      }
      if('oneSys' === type ){
        url = this.threePictureClick.dis_url1
      }
      return new Promise((resolve, reject) => {
        request(url, {
          method: "GET",
          param: {
						pk_gd : this.onePictureClick.pk_gd,
						pk_sysregisters : this.twoPictureClick.dis_pk_sysregisters
          }
        }).then((resp) => {
      
          this.threePictureClick.disDatas = resp.data

          resolve()
        }).catch(reject)
      })
    }

    @action queryLoadNum(type) {
      if(undefined == this.twoPictureClick.load_pk_sysregisters || '' == this.twoPictureClick.load_pk_sysregisters){
        let _loadDatas = {
          date: [],
          series: [{
            name: '',
            data: []
          }]
        }
        this.threePictureClick.loadDatas = _loadDatas
        return 
      }
      let url = ''
      if('allSys' === type){
        url = this.threePictureClick.load_url2
      }
      if('oneSys' == type){
        url = this.threePictureClick.load_url1
      }
      return new Promise((resolve, reject) => {
        request( url, {
          method: "GET",
          param: {
						pk_gd : this.onePictureClick.pk_gd,
						pk_sysregisters : this.twoPictureClick.load_pk_sysregisters
          }
        }).then((resp) => {

          this.threePictureClick.loadDatas = resp.data
           
          resolve()
        }).catch(reject)
      })
    }


    toJson() {
      return {

      }
    }
  }
