import axios from "axios";
import { Error } from './index.js'
import qs from 'querystring'
import { Loading } from 'tinper-bee';
import Message from 'bee-message';
let prefixUrl;
prefixUrl = process.env.NODE_ENV === 'development' ? '/iuapmdm' : '/iuapmdm';// 'http://127.0.0.1:8080/iuapmdm';
// prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';// 'http://127.0.0.1:8080/iuapmdm';

/**
 * createLoading
 */
function createLoading() {
  let div = document.createElement('div');
  document.body.appendChild(div);
  let loading = React.cloneElement(<Loading
    showBackDrop={true}
    loadingType="line"
    show={true}
  />)
  return {
    show: () => {
      ReactDOM.render(loading, div);
    },
    destory: () => {
      try {
        div.parentNode.removeChild(div);
        let loadingDom = document.getElementsByClassName('u-loading-backdrop')[0];
        loadingDom.parentNode.parentNode.removeChild(loadingDom.parentNode);
        loading = null;
      }
      catch (e) {
        loading = null;
        console.log(e)
      }
    }
  }
};

function createLicenseDoc(){
  var img = "<div style='text-align: center;margin-top: 80px'><img src='../assets/images/error_02.png'/></div>"
  document.body.innerHTML = img
}

axios.defaults.timeout = 30*60*1000;  // 30分钟

export default (url, options) => {
  // if(url.indexOf('?')==-1){
  //   url+='?_r='+Math.random();
  // }else{
  //   url+='&_r='+Math.random()
  // }
  let param = options.param||{};
  //增加一个showLoading 用以控制loading 以满足不需要loading的场景
  //showError 用以控制Error 以满足不需要showError的场景
  let { showLoading=true, showError=true } = options

  param['_R']=Math.random();
  let loading = null;
  if (showLoading) {
    loading =  createLoading();
    loading.show();
  }
  return new Promise((resolve, reject) => {
    let data = {}
    if (options.formatJSon) {
      data = options.data
    } else {
      data = qs.stringify(options.data)
    }

    let locationHref = encodeURIComponent(window.location.href);
    axios({
      method: options.method,
      url: prefixUrl + url,
      data: data,
      params: param,
      headers: options.formatJSon ? options.headers : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'Location-Href': locationHref
      }
    })
      .then((resp) => {
        if (loading) {
          loading.destory();
        }

        console.log("axios res data:" + qs.stringify(resp.data));

        //license返回捕获
        if (resp.data && (resp.data.success === 'licenseError')) {
          createLicenseDoc()
          reject(resp.data);
        }
        if (resp.data && !options.notStandard && (resp.data.flag === false || resp.data.flag === 'fail' || resp.data.flag === 'failed' || resp.data.success === false)) {
          if (showError) {
            Error(resp.data.msg || resp.data.message)
          }
          reject(resp.data)
        } else {
          resolve(resp)
        }
      })
      .catch((param) => {
        if (loading) {
          loading.destory();
        }
        if (param.response.status == 306) {
          top.location.href = '/wbalone?callbackUrl=' + locationHref;
        }
        if (param.response.status == 401 && param.response.data.msg != "") {
          Error(param.response.data.msg)
        }
        // Message.create({ content: '数据返回出错：1、请确保服务运行正常；2、请确保您的前端工程代理服务正常；3、请确认您已在本地登录过应用平台', color : 'danger'});
        reject(param)
      })
  })
}

export const post = (url, options) => {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify({
      data: { ...options.data }
    }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((resp) => {
        if (resp.data && resp.data.flag === false ) {
          Error(resp.data.msg)
          reject(resp.data)
        } else {
          resolve(resp)
        }
      })
      .catch(reject)
  })
}
