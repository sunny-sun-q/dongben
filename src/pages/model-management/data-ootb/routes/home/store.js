import { observable, action, toJS } from 'mobx/lib/mobx'

import {
  ootbConfInfoService,
  ootbConfInfoListService,
  ootbConfSaveInfoServiece,
  ootbConfDelService,
  ootbConfTestConnectService,
  ootbAddAccountList

} from './services'

class Store {

  @observable
  state = {
    dataList: [],
    confInfo: null,
    confModalStatus: false,
    pageLoading: false,
    testStatus: 'start', //testing|success|fail
    testErrMsg: '',
    addModalAccountList: []
  }

  @action
  changeConfModalStatus = (confInfo) => {
    const oldStatus = this.state.confModalStatus;
    this.state.confInfo = confInfo || null;
    this.state.confModalStatus = !oldStatus;

  }

  @action
  getConfInfo = (params) => {
    ootbConfInfoService(params)
  }

  @action
  getConfList = (params) => {
    ootbConfInfoListService(params)
      .then(({data: resData}) => {
        this.state.dataList = resData.data;
      })
  }

  @action
  delConfInfo = (params) => {
    ootbConfDelService(params)
      .then(() => {
        this.getConfList();
      })
  }

  @action
  saveConfInfo = (params) => {
    ootbConfSaveInfoServiece(params)
      .then(() => {
        this.changeConfModalStatus();
        this.getConfList()
      })
  }

  @action
  initTestStatus = (time=1500) => {
    const self = this;
    this.timer = setTimeout(function () {
      self.state.testStatus = 'start';
      clearTimeout(self.timer);
      self.timer = null;
    }, time)
  }

  @action
  testConnect = (params) => {
    // this.state.testStatus = 'testing';
    return (
      new Promise((resolve, reject) => {
        ootbConfTestConnectService(params)
        .then(() => {
          if (this.state.confModalStatus) {
            this.state.testStatus = "success";
            this.initTestStatus()
          }else {
            resolve()
          }
        })
        .catch(err => {
          if (this.state.confModalStatus) {
            this.state.testStatus = 'fail';
            this.initTestStatus()
          }else {
            reject()
          }
        })
      })
    )
  }
  @action
  addAccountList = (params) => {
    ootbAddAccountList(params).
    then(({data: resData}) => {
      if(resData.flag === 'success') {
        let list = [];
        let obj = {};
        if(resData.data) {
          for (var key in resData.data) {
            let obj = {
              "id":key,
              "value":resData.data[key]
            }
            list.push(obj);
          }
          this.state.addModalAccountList = list;
        }

      }

    })
  }


  toJS = () => {
    return toJS(this.state)
  }
}

export default Store;
