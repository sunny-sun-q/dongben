/**
 *
 * @title 日期选择
 * @description 日期选择,统一修改样式和处理多语
 *
 */
import React, { Component } from 'react';
import DatePicker from 'bee-datepicker';
import 'bee-datepicker/build/DatePicker.css';
import zh_CN from "components/language/datePicker/zh_CN.js";
import zh_TW from "components/language/datePicker/zh_TW.js";
import en_US from "components/language/datePicker/en_US.js";
import { getCookie,getContextId} from "utils";
import './index.less'
class MdmDatePicker extends Component {
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
        const dateLanguage = this.chooseLocale(locale);
        return (
          <DatePicker
          locale = { dateLanguage}
          {...this.props}
          />
            
        )
    }
}
export default MdmDatePicker;