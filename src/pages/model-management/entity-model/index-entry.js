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
import { treeStore, entityContentStore, comboxStore, treeRefStore, treeRefTreeStore,treeEntryStore,tableRefStore } from './stores/store'
const render = (Component) => {
  ReactDOM.render(
    <AppContainer >
      <IntlProvider locale={locale.replace(/_.+/ig,'')} messages={chooseLocale(locale)}>
        <Provider treeStore={treeStore} entityContentStore={entityContentStore} comboxStore={comboxStore} treeEntryStore={treeEntryStore} treeRefStore={treeRefStore} treeRefTreeStore={treeRefTreeStore} tableRefStore={tableRefStore}>
          <Component />
        </Provider>
      </IntlProvider>
    </AppContainer>,
    document.querySelector("#app")
  )
}

render(App)
// if (module.hot) {
//   module.hot.accept('./pages/App', () => {
//     const NextApp = App.default // eslint-disable-line
//     render(NextApp)
//   })
// }
