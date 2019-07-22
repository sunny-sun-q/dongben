import {
  observable,
  action,
} from 'mobx'
import request from 'utils/request.js'




export default class EnterpriseBusinessStore {
  @observable enterpriseSearch = {
    searchList: [],
    selectValue: '用友网络科技股份有限公司',  // 搜索框value
    realValue: '用友网络科技股份有限公司',   // 真实搜索的value,点击下拉和搜索按钮改变
    infoTypeKey: '',
    infoTypeValue: '企业基本信息',
    searchErrorMsg: ''
  }

  // 存放企业基本信息
  @observable baseinfo = {}
  // 存放股东信息
  @observable holder = []
  // 存放变更记录信息
  @observable changeRecord = []
  // 存放融资历史信息
  @observable financeHistory = []
  // 存放投资事件
  @observable investmentEvent = []
  // 存放法律诉讼
  @observable actionAtLaw = []
  // 存放行政处罚
  @observable punishmentData = {
    punishmentByPage: [], // 当前列表
    totalPages: 0 // 总页数
  }
  // 存放法院公告
  @observable courtAnnouncement = []
  // 存放失信人
  @observable dishonest = []
  // 存放执行人
  @observable zhixingren = []
  // 存税务评级
  @observable taxCredit = []
  // 经营异常
  @observable abnormal = []
  // 严重违法
  @observable illegalInfo = []
  // 股权出质
  @observable equityInfo = []
  // 动产抵押
  @observable mortgageInfo = []
  // 欠税公告
  @observable ownTax = []

  // 股东和子公司
  @observable investTreeData = {
    holders: [], // 股东
    relationships: [],  // 子公司
    randomNumber: 0
  }

  // 是否让客户关系移动到中间
  @observable ifMoveCenter = false


  @action setMoveCenter(value) {
    this.ifMoveCenter = value
  }

  // 股东信息
  @action getHodler(corpName, nextPosition, ifFirst) {
    return new Promise((resolve, reject) => {
      if(ifFirst) {
        this.investTreeData.holders = []
        this.ifMoveCenter = true
      } else {
        this.ifMoveCenter = false
      }
      request('/socialmng/clientportrait/detailforselected', {
        method: "GET",
        param: {
          code:"ownership",
          corpName,
          // pageIndex:"1",
          // pageSize:"10"
        }
      }).then((resp) => {
        let holders = resp.data.obj.tables
        let len = this.investTreeData.holders.length
        const content = holders.map((holder) => {
          return {
            holderName: holder.parent_name, // 股东名称
            id: holder.pk_id,   // 唯一标示
            amomon: holder.amount||'未公开', // 持股金额
            moneyPercent: holder.amount_percent||'未公开', // 持股比例
            hasChildren: holder.has_children === '1',   // 是否有子集
            arrIndex: len,
          }
        })
        this.investTreeData.holders.unshift({
          content,
          position: nextPosition || 0,
          sortId: len,
          mathRandom: this.investTreeData.randomNumber++  // 作为股东key，防止刷新
        })
        resolve()
      }).catch((e) => {
        console.log('error')
      })
    })
  }

  // 子公司信息
  @action getRelationship(corpName, nextPosition, ifFirst) {
    return new Promise((resolve, reject) => {
      if(ifFirst) {
        this.investTreeData.relationships = []
        this.ifMoveCenter = true
      } else {
        this.ifMoveCenter = false
      }
      request('/socialmng/clientportrait/detailforselected', {
        method: "GET",
        param: {
          code:"investtree",
          corpName,
          // pageIndex:"1",
          // pageSize:"10"
        }
      }).then((resp) => {
        let relationships = (resp.data.obj.tables)
        let len = this.investTreeData.relationships.length
        const content = [];
        relationships.map((relationship) => {
          if(relationship.parentCorpId != '') {
            content.push({
              holderName: relationship.name, // 分公司名称
              id: relationship.pk_id,   // 唯一标示
              amomon: relationship.amomon || '未知', // 持股金额
              moneyPercent: relationship.moneyPercent || '未知', // 持股比例
              hasChildren:relationship.open_ == 'true',  // 是否有子集
              arrIndex: len
            })
          }
        })
       this.investTreeData.relationships.push({
          content,
          position: nextPosition || 0,
          sortId: len
        })
        resolve()
      }).catch(reject)
    })
  }

  // 搜索框
  @action getSearchList(keyWord) {
    return new Promise((resolve, reject) => {
      if(keyWord===''){
        this.enterpriseSearch.searchErrorMsg = ''
        return
      }
      get('/tyc/tycSearch', { keyWord }).then((resp) => {
        this.enterpriseSearch.searchList = resp.data
        this.enterpriseSearch.searchErrorMsg = ''
        resolve()
      }).catch(() => {
        this.enterpriseSearch.searchErrorMsg = '未找到该企业，请重新输入。'
        resolve()
      })
    })
  }

  // 股东信息接口
  @action getHolder() {
    return new Promise((resolve, reject) => {
      get('/tyc/holder', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.holder = resp.data
        resolve()
      }).catch((e) => {
        this.holder = []
      })
    })
  }

  // 变更记录接口
  @action getChangeRecord() {
    return new Promise((resolve, reject) => {
      get('/tyc/changeRecord', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.changeRecord = resp.data
        resolve()
      }).catch((e) => {
        this.changeRecord = []
      })
    })
  }

  // 融资历史接口
  @action getFinanceHistory() {
    return new Promise((resolve, reject) => {
      get('/tyc/financingHistory', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.financeHistory = resp.data
        resolve()
      }).catch((e) => {
        this.financeHistory = []
      })
    })
  }

  // 投资事件接口
  @action getInvestmentEvent() {
    return new Promise((resolve, reject) => {
      get('/tyc/investmentEvent', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.investmentEvent = resp.data
        resolve()
      }).catch((e) => {
        this.investmentEvent = []
      })
    })
  }

  // 法律诉讼接口
  @action getActionAtLaw() {
    return new Promise((resolve, reject) => {

      get('/tyc/actionAtLaw', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.actionAtLaw = resp.data
        resolve()
      }).catch((e) => {
        this.actionAtLaw = []
      })
    })
  }

  // 行政处罚接口
  @action getPunishmentByPage(pageIndex = 0, pageSize = 5) {
    return new Promise((resolve, reject) => {
      get('/tyc/punishmentByPage', { corpName: this.enterpriseSearch.realValue, pageIndex, pageSize }).then((resp) => {
        this.punishmentData.punishmentByPage = resp.data.content
        this.punishmentData.totalPages = resp.data.totalPages
        resolve()
      }).catch((e) => {
        this.punishmentData = {
          punishmentByPage: [], // 当前列表
          totalPages: 0 // 总页数
        }
      })
    })
  }

  // 法院公告接口
  @action getCourtAnnouncement() {
    return new Promise((resolve, reject) => {
      get('/tyc/courtAnnouncement', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.courtAnnouncement = resp.data
        resolve()
      }).catch((e) => {
        this.courtAnnouncement = []
      })
    })
  }

  // 失信人接口
  @action getDishonest() {
    return new Promise((resolve, reject) => {
      get('/tyc/riskInformation/dishonest', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.dishonest = resp.data
        resolve()
      }).catch((e) => {
        this.dishonest = []
      })
    })
  }

  // 执行人接口
  @action getZhixingren() {
    return new Promise((resolve, reject) => {
      get('/tyc/riskInformation/zhixinginfo', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.zhixingren = resp.data
        resolve()
      }).catch((e) => {
        this.zhixingren = []
      })
    })
  }
  // 税务评级接口
  @action getTaxCredit() {
    return new Promise((resolve, reject) => {
      get('/tyc/taxcredit', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.taxCredit = resp.data
        resolve()
      }).catch((e) => {
        this.taxCredit = []
      })
    })
  }
  // 经营异常接口
  @action getAbnormal() {
    return new Promise((resolve, reject) => {
      get('/tyc/riskInformation/abnormal', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.abnormal = resp.data
        resolve()
      }).catch((e) => {
        this.abnormal = []
      })
    })
  }
  // 严重违法接口
  @action getIllegalInfo() {
    return new Promise((resolve, reject) => {
      get('/tyc/riskInformation/illegalinfo', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.illegalInfo = resp.data
        resolve()
      }).catch((e) => {
        this.illegalInfo = []
      })
    })
  }
  // 股权出质接口
  @action getEquityInfo() {
    return new Promise((resolve, reject) => {
      get('/tyc/equityinfo', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.equityInfo = resp.data
        resolve()
      }).catch((e) => {
        this.equityInfo = []
      })
    })
  }
  // 动产抵押接口
  @action getMortgageInfo() {
    return new Promise((resolve, reject) => {
      get('/tyc/mortgageinfo', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.mortgageInfo = resp.data
        resolve()
      }).catch((e) => {
        this.mortgageInfo = []
      })
    })
  }
  // 欠税公告接口
  @action getOwnTax() {
    return new Promise((resolve, reject) => {
      get('/tyc/owntax', { corpName: this.enterpriseSearch.realValue }).then((resp) => {
        this.ownTax = resp.data
        resolve()
      }).catch((e) => {
        this.ownTax = []
      })
    })
  }

  // 搜索框值
  @action changeSelectValue(value) {
    this.enterpriseSearch.selectValue = value
  }

  // 真实搜索框值
  @action changeRealValue(value) {
    this.enterpriseSearch.realValue = value
  }

  // 重置搜索框值
  @action resetSearchValue(selectValue, realValue) {
    this.enterpriseSearch.selectValue = selectValue || '用友网络科技股份有限公司'
    this.enterpriseSearch.realValue = realValue || '用友网络科技股份有限公司'
  }
  // 重置智能数据
  @action resetSaveBusiness() {
    this.baseinfo = []
  }

  // 搜索框值
  @action changeInfoValue(value, key) {
    this.enterpriseSearch.infoTypeValue = value
    this.enterpriseSearch.infoTypeKey = key
  }

  // 股东切割
  @action splitHodler(index) {
    let len = this.investTreeData.holders.length
    this.investTreeData.holders = this.investTreeData.holders.slice(len-index-1)
    // this.enterpriseSearch.infoTypeValue = value
  }

  // 子公司切割
  @action splitRelationship(index) {
    let len = this.investTreeData.relationships.length
    this.investTreeData.relationships = this.investTreeData.relationships.slice(0,index+1)
    // this.enterpriseSearch.infoTypeValue = value
  }

  // 客户画像页重置
  @action resetCompanyMsg() {
     // 存放企业基本信息
    this.baseinfo = {}
    // 存放股东信息
    this.holder = []
    // 存放变更记录信息
    this.changeRecord = []
    // 存放融资历史信息
    this.financeHistory = []
    // 存放投资事件
    this.investmentEvent = []
    // 存放法律诉讼
    this.actionAtLaw = []
    // 存放行政处罚
    this.punishmentData = {
      punishmentByPage: [], // 当前列表
      totalPages: 0 // 总页数
    }
    // 存放法院公告
    this.courtAnnouncement = []
    // 存放失信人
    this.dishonest = []
    // 存放执行人
    this.zhixingren = []
    // 存税务评级
    this.taxCredit = []
    // 经营异常
    this.abnormal = []
    // 严重违法
    this.illegalInfo = []
    // 股权出质
    this.equityInfo = []
    // 动产抵押
    this.mortgageInfo = []
    // 欠税公告
    this.ownTax = []
  }

  // 客户画像页重置
  @action resetSearchErrorMsg() {
    this.enterpriseSearch.searchErrorMsg = ''
  }

  toJson() {
    return {

    }
  }
}
