
import  "babel-polyfill"
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import { Provider } from 'mobx-react'

//react 国际化
import { IntlProvider, addLocaleData } from 'react-intl';
import zh_CN from 'components/language/zh_CN';//个人配置
import en_US from 'components/language/en_US';//个人配置
import zh_TW from 'components/language/zh_TW';//个人配置
import intl from 'intl';
import zh from 'react-intl/locale-data/zh';//react-intl语言包
import en from 'react-intl/locale-data/en';//react-intl语言包
import { getCookie,getContextId} from "utils";
const contextId = getContextId();
addLocaleData([...en, ...zh]);//需要放入本地数据库

import "src/app.less";

let language = (navigator.language || navigator.browserLanguage).toLowerCase();
let locale =  (getCookie('u_locale')||language.split('_')[0].replace(/-/,'_')||"en_US")
if(contextId === 'mdm'){
  locale = 'zh_CN'
}

function chooseLocale(language){
  switch(locale){
    case 'en_US':
        return en_US;
        break;
    case 'zh_CN':
        return zh_CN;
        break;
    case 'zh_TW':
        return zh_TW;
        break;
    default:
        return zh_CN;
        break;
  }
}

import App from './pages/App'
// 公共样式 & 公共组件
// import "./assets/public/css/index.less";
import { seniorSearchStore} from './stores/store'

const createUUISearch = (parentDom,params) =>{
  ReactDOM.render(
    <AppContainer >
      <IntlProvider locale={locale.replace(/_.+/ig,'')} messages={chooseLocale(locale)}>
        <Provider 
          seniorSearchStore={seniorSearchStore}
          params={params}
        >
          <App /> 
        </Provider>
      </IntlProvider>
    </AppContainer>,
    parentDom
  )
}
// alert('123')
var getDataFun = function(sa){
  debugger;
}

var closeFun = function(){
  debugger;
}

// var params = {
//   pk_gd:'59c2ff14-d97d-4e2f-8d04-edb89eafc4eb',
//   getData: getDataFun,
//   closeFun: closeFun,
//   autoShow: false,
//   appendType: true,
//   bothAll: true,
//   initCondition: "code like 123&string;"
// }

var params = {
  entitycode:"test11",
  getData: getDataFun,
  closeFun: closeFun,
  autoShow: false,
  appendType: true,
  bothAll: true,
}

// createUUISearch(document.querySelector("#app") , params)
window.createUUISearch = createUUISearch;

window.init = function(params){
  var searchInt = setInterval(function(){
    if(createUUISearch){
      clearInterval(searchInt)
      document.querySelector("#app").innerHTML = ''
      createUUISearch(document.querySelector("#app") , params) 
    }
  })
}
// export default createUUISearch
export {createUUISearch}

