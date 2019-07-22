import request from 'utils/request'

export const ootbConfInfoService = function (params) {
  return (
    request('/obConfInfo/getConfInfo', {
      method: 'GET',
      param: params
    })
  )
}

export const ootbConfInfoListService = function (params) {
  return (
    request('/obConfInfo/getAllInfos', {
        method: 'GET',
        param: params
    })
  )
}

export const ootbConfSaveInfoServiece = function (params) {
  return (
    request('/obConfInfo/save', {
      method: 'POST',
      formatJSon: true,
      data: params,
      header: {
        'Content-Type':'application/json'
      }
    })
  )
}

export const ootbConfDelService = function (params) {
  return (
    request('/obConfInfo/delete', {
      method: "GET",
      param: params
    })
  )
}

export const ootbConfTestConnectService = function (params) {
  return (
    request('/obConfInfo/testConn', {
      method: 'POST',
      data: {
        data:  JSON.stringify(params)
      },
      showError: false
    })
  )
}
export const ootbAddAccountList = function (params) {
  return (
    request('/obConfInfo/getAccountList', {
      method: 'POST',
      data: {
        data:  JSON.stringify(params)
      },
      showError: false
    })
  )
}
