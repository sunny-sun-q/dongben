import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React,{Component} from 'react';
import { ButtonGroup, Icon, Button, Dropdown, Menu } from 'tinper-bee';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import MainTable from '../components/MainTable';
import SubTable from '../components/SubTable';
import { toJS } from 'mobx';


@withRouter
@inject((stores) => {
    return {
        cardStore: stores.cardStore,
    }
})
@observer class Card extends Component{
    constructor(props) {
        super(props);
        this.state = {
            seal : 0,
        }
        this.approvalList = []
    }

    componentWillMount = () => {
        // 调用model以获取渲染样式
        let pk_gd = this.props.match.params.id;
        this.props.cardStore.reset();
        this.props.cardStore.getModel(pk_gd);

        let mdmcode = this.props.match.params.mdmcode;
        if(mdmcode){
          if(mdmcode.indexOf('&')!== -1) {
            mdmcode = mdmcode.substr(0,mdmcode.indexOf('&'));
            this.props.cardStore.getLoadInfo(pk_gd,mdmcode);
          }else {
            this.props.cardStore.getLoadInfo(pk_gd,mdmcode);
          }

        }
        else{
            this.props.cardStore.getLoadInfo(pk_gd);
        }
    }

    componentDidMount = () => {

    }

    componentWillReceiveProps = (nextProps) => {
        let mdm_code = nextProps.match.params.mdmcode;
        let pk_gd = nextProps.match.params.id;
        if(mdm_code !== this.props.match.params.mdmcode){
            this.props.cardStore.reset();
            this.props.cardStore.getLoadInfo(pk_gd,mdm_code);
        }
    }

    

    // 修改列表顺序 普通-文件-文本区域
    changeHeader = ( arr ) => {
        if(arr){
            let tempFile = [];
            let tempTextArea = [];
            let tempOther = [];
            let res = [];
            arr.map( (item ) => {
                switch(item.fieldtype){
                    case 9:
                    case 10:
                    {
                        tempFile.push(item);
                        break;
                    }
                    case 11:
                    {
                        tempTextArea.push(item);
                        break;
                    }
                    default:{
                        tempOther.push(item);
                        break;
                    }
                }
            })
            return res.concat(tempOther,tempTextArea,tempFile);
        }
        return [];
    }

    


    render() {

        let header = ( this.props.cardStore.modelInfo.entitys && this.props.cardStore.modelInfo.entitys[0] )|| {};
        let mainTableHeader = this.changeHeader(header.body);
        if(!this.props.cardStore.modelInfo.designInfo) {
            return null;
        }
        let stopWriteBtn = this.props.cardStore.modelInfo.designInfo && this.props.cardStore.modelInfo.designInfo.stopWriteBtn;
        let disabled = false;
        if(stopWriteBtn) {
            disabled = true;
        }
        const menu = (
            <ul className='u-dropdown-ul'>
                <li className='u-dropdown-li' key="1" disabled={disabled} onClick = {this.submit}><FormattedMessage id="js.tre.car.0001" defaultMessage="提交" /></li>
                <li className='u-dropdown-li' key="2" disabled={disabled}  onClick = {this.goProcess}><FormattedMessage id="js.tre.car.0002" defaultMessage="查看流程" /></li>
                <li className='u-dropdown-li' key="3" disabled={disabled}  onClick = {this.goHistory}><FormattedMessage id="js.tre.car.0003" defaultMessage="历史记录" /></li>
            </ul>
        );
        return (
            <div className='card-area'>
                {/* 主表区域 */}
                <MainTable
                    header={mainTableHeader}
                    pk_gd={this.props.match.params.id}
                    selectionData={this.props.cardStore.selectionData}
                    store={this.props.cardStore}
                    showStatus = {this.props.cardStore.loadInfo.mdm_datastatus}
                    status={0}
                />

                {/* 子表区域 */}

                <SubTable
                    navInfo={this.props.cardStore.modelInfo}
                    status={1}
                />

            </div>
        )
    }
}

export default Card;
