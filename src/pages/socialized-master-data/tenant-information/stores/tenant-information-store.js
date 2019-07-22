

import {
  observable,
  action
} from 'mobx'
import request from '../../../../utils/request'
import { success } from 'utils/index.js'

// 租户详情数据源
export default class TenantInformationStore {

  @observable tenant = {
    tenantInfo:{
      tenantId: '',             // 租户id
      tenantName: '',           // 租户名称
      contactPerson: '',        // 租户联系人
      tenantTel: '',            // 租户电话
      tenantAddress: '',        // 租户地址
      tenantArea: '',           // 租户地区
      tenantCode: '',           // 租户编码
      tenantEmail: '',          // 租户Email
      tenantFullname: '',       // 租户全名
      tenantIndustry: '',       // 租户企业分类
      tenantNature: '',         // 租户性质
      tenantOfficalWeb: '',     // 租户官网
      tenantStates: '',         // 租户状态
      tenantMdmStatus: '',      // 租户主数据状态
      createTime: '',           // 创建时间
      createUser: '',           // 创建用户
      updateTime: '',           // 更新时间
      updateUser: '',           // 更新用户
      token: ''
    },
  }

  // 根据token请求线上租户的详细信息
  @action getTenantInformationByToken(token) {
    return new Promise((resolve, reject) => {
      request('/socialmng/tenant/get_tenant_information_by_token', {
        method: "GET",
        param: {'token':token}
      }).then((resp) => {
        // 成功赋值
        const { obj } = resp.data;
        var successFlag = resp.data.success;
        
        if(!successFlag){
          resp.data.message = '获取租户信息失败，请检验网络和令牌是否正确'
          success(resp.data.message)
        }
        if(successFlag && obj){
          this.tenant.tenantInfo = {
            tenantId:       obj.tenantId,             // 租户id
            tenantName:     obj.tenantName,           // 租户名称
            contactPerson:  obj.contactPerson,        // 租户联系人
            tenantTel:      obj.tenantTel,            // 租户电话
            tenantAddress:  obj.tenantAddress,        // 租户地址
            tenantArea:     obj.tenantArea,           // 租户地区
            tenantCode:     obj.tenantCode,           // 租户编码
            tenantEmail:    obj.tenantEmail,          // 租户Email
            tenantFullname: obj.tenantFullname,       // 租户全名
            tenantIndustry: obj.tenantIndustry,       // 租户企业分类
            tenantNature:   obj.tenantNature,         // 租户性质
            tenantOfficalWeb: obj.tenantOfficalWeb,     // 租户官网
            tenantStates:   obj.tenantStates,         // 租户状态
            tenantMdmStatus: obj.tenantMdmStatus,      // 租户主数据状态
            createTime:     obj.createTime,           // 创建时间
            createUser:     obj.createUser,           // 创建用户
            updateTime:     obj.updateTime,           // 更新时间
            updateUser:     obj.updateUser,           // 更新用户
            token:          obj.tenantToken                 
          }
        }
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }

  // 根据token请求线上租户的详细信息
  @action getTenantInformationIfexist() {
    return new Promise((resolve, reject) => {
      request('/socialmng/tenant/get_tenant_information_ifexist', {
        method: "GET",
        param: {},
      }).then((resp) => {
        // 成功赋值
        const { obj } = resp.data;
        var successFlag = resp.data.success;
        
        if(!successFlag){
          resp.data.message = '获取租户信息失败，请检验网络和令牌是否正确'
          success(resp.data.message)
        }
        if(success && obj){
          this.tenant.tenantInfo = {
            tenantId:       obj.tenantId,             // 租户id
            tenantName:     obj.tenantName,           // 租户名称
            contactPerson:  obj.contactPerson,        // 租户联系人
            tenantTel:      obj.tenantTel,            // 租户电话
            tenantAddress:  obj.tenantAddress,        // 租户地址
            tenantArea:     obj.tenantArea,           // 租户地区
            tenantCode:     obj.tenantCode,           // 租户编码
            tenantEmail:    obj.tenantEmail,          // 租户Email
            tenantFullname: obj.tenantFullname,       // 租户全名
            tenantIndustry: obj.tenantIndustry,       // 租户企业分类
            tenantNature:   obj.tenantNature,         // 租户性质
            tenantOfficalWeb: obj.tenantOfficalWeb,     // 租户官网
            tenantStates:   obj.tenantStates,         // 租户状态
            tenantMdmStatus: obj.tenantMdmStatus,      // 租户主数据状态
            createTime:     obj.createTime,           // 创建时间
            createUser:     obj.createUser,           // 创建用户
            updateTime:     obj.updateTime,           // 更新时间
            updateUser:     obj.updateUser,            // 更新用户
            token:          obj.tenantToken
          }
        }
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }

}
