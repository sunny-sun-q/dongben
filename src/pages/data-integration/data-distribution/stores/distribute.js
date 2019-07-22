

import {
    observable,
    action,
  } from 'mobx'
  import request from 'utils/request.js'
  import { success,Error } from 'utils/index.js'
  
  export default class Distribute {
    @observable distribute = {
      table: {
        // header : [ {
        //   dataIndex: "mdm_code",
        //   width: 100,
        //   title: "MDMCODE",
        //   key: "mdm_code"
        // }],
        header:[],
        body:[],
        total:0,
        pageCount:0
      }
    }

    @action reset(){ // 不建议用方法设置值
      this.distribute = {
        table: {
          header:[],
          body:[],
          total:0,
          pageCount:1
        }
      }
    }
  
    @action getHeaderByNodeID(nodeId) {
      return new Promise((resolve, reject) => {
        request('/distributeThirdPartService/getMasterDataSchema', {
          method: "GET",
          param: {
            gdCode: nodeId
          }
        }).then((resp) => {
    
          let header = resp.data.header
          header.map((item, index)=>{
            if("7" == item.fieldType || "8" == item.fieldType || "13" == item.fieldType){
              item.dataIndex =  item.dataIndex + "_name",
              item.key =  item.key + "_name"
            }
          })
          this.distribute.table.header = header 
          resolve()  
        }).catch((e) => {
 
          this.distribute.table = {
            header: []
          }
        })
      })
    }

    @action getDistributeData(pk_sys, pk_gd, condition, pageIndex, pageSize) {
      return new Promise((resolve, reject) => {
        request('/distributeThirdPartService/getMasterDatas1', {
          method: "GET",
          param: {pk_sys, pk_gd, condition, pageIndex, pageSize}
        }).then((resp) => {
          let header = this.distribute.table.header;
          let gridData = resp.data.data;
          header.map( (value, index, arr) => {
            let item = value.key;
            // debugger;
            if(value.fieldType && value.fieldType===3) {
              gridData.map( (value, index, arr) => {
                gridData[index][item] = gridData[index][item] === 1 || gridData[index][item] === true? '是' : gridData[index][item] === 0 || gridData[index][item] === false?'否': '';
              });
            }
            else if(value.fieldType && value.fieldType===9 ) {
              gridData.map( (value, index, arr) => {
                gridData[index][`${item}_fullPicName_`] = gridData[index][item];
                gridData[index][`${item}_picAddress_`]= gridData[index][item]?gridData[index][item].split("#")[0]: '';
                gridData[index][`${item}_picName_`] = gridData[index][item]?gridData[index][item].split("#")[1]: '';
              });
            }
            else if(value.fieldType && value.fieldType === 10) {
              gridData.map( (value, index, arr) => {
                gridData[index][`${item}_fullFileName_`] = gridData[index][item];
                gridData[index][`${item}_fileAddress_`]= gridData[index][item]?gridData[index][item].split("#")[0]: '';
                gridData[index][`${item}_fileName_`] = gridData[index][item]?gridData[index][item].split("#")[1]:'';
              });
            }
          })
          this.distribute.table.body = gridData || [],

          this.distribute.table.total = resp.data.total || 0,
          this.distribute.table.pageCount = resp.data.pageCount || 1
          resolve()
        }).catch((e) => {
        
          this.distribute.table.body = []
          console.log("e", e)
        })
      })
    }

    @action resetDistributeData() {
      // this.distribute.table.data = []
    }
    @action distributeMD(values) {
      return new Promise((resolve, reject) => {
        request('/distributeThirdPartService/distributeMdManul', {
          method: "POST",
          data: values
        }).then((resp) => {
         
          success("分发成功！")
          resolve()
        }).catch((e) => {
         
          console.log("e", e)
        })
      })
    }

  
    toJson() {
      return {
  
      }
    }
  }
  