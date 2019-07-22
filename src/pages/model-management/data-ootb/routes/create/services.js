import request from 'utils/request'

export const treeModelService = (params) => {
  return (
    request('/obInfo/getObInfo', {
      method: 'GET',
      param: params
    })
  )
}

/**
 * @method tableDataService 获取表数据
 * @param {Object} params
 * @param {String} params.pk_obinfo
 * @param {String} params.entityFullName -tree节点 fullName
 * */
export const tableDataService = (params, showLoading) => {
  return (
    request('/obInfo/getPropInfo', {
      method: 'GET',
      param: params,
      showLoading
    })
  )
}

export const verifyModelService = function (params) {
  return (
    request('/obInfo/validateObinfo', {
      method: 'POST',
      data: {
        data:  JSON.stringify(params)
      },
      showError: false
    })
  )
}


export const saveModelService = function (params) {
  return (
    request('/obInfo/save', {
      method: 'POST',
      data: {
        data:  JSON.stringify(params)
      },
      showLoading: true,
      showError: false
    })
  )
}

export const createModelService = function (params) {
  return (
    request('/obInfo/initEntityRef', {
      method: 'POST',
      data: {
        data:  JSON.stringify(params)
      },
      showLoading: false,
      showError: false
    })
  )
}


export const refTreeModelService = function (params) {
  return (
    request('/obInfo/getMdtreeInfo', {
      method: "GET",
      param: params
    })
  )
}

export const saveRefModelService = function (params) {
  return (
    request('/obInfo/saveMd', {
      method: 'POST',
      data: {
        data:  JSON.stringify(params)
      },
      showLoading: false,
    })
  )
}

export const subRefTreeModelService = function (params) {
  return (
    request('/obInfo/getSubTableInfo', {
      method: 'POST',
      param: params,
      showLoading: false
    })
  )
}






