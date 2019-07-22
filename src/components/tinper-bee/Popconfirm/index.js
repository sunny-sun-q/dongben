/**
 *
 * @title 日期选择
 * @description 日期选择,统一修改样式和处理多语
 *
 */
import React, { Component } from 'react';
import { Popconfirm } from 'tinper-bee';
import { getCookie,getContextId} from "utils";
const en_US = 	{lang: 'en-us', ok: 'ok', cancel: 'cancel'}
const zh_CN = 	{lang: 'zh-CN', ok: '确认', cancel: '取消'}
const zh_TW = 	{lang: 'zh-TW', ok: '確認', cancel: '取消'}
class MdmPopconfirm extends Component {
    constructor(props) {
        super(props);
    }
    chooseLocale = (locale) =>{
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
    
    getLocale = () => {
        let language = (navigator.language || navigator.browserLanguage).toLowerCase();
        let locale =  (getCookie('u_locale')||language.split('_')[0].replace(/-/,'_')||"en_US")
        const contextId = getContextId();
        if(contextId === 'mdm'){
            locale = 'zh_CN'    
        }
        return locale;
    }
    
    render() {
        const locale = this.getLocale();
        const language = this.chooseLocale(locale);
        return (
            <Popconfirm
                locale = { language }
                {...this.props}
            ></Popconfirm>
                
        )
    }
}
export default MdmPopconfirm;