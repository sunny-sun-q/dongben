
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react';
import { ButtonGroup, Dropdown, Loading } from 'tinper-bee';
import {BpmButtonSubmit, BpmButtonRecall} from 'yyuap-bpm';
import {success,Error} from 'utils';
import './index.less'
import {Button} from 'components/tinper-bee';

class CardBtnGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading : false,
        }
    }

    /**
     *
     * @description 提交初始执行函数
     * @param {string, string} operation为submit recall type 为start、success
     */
    bpmStart = (operation, type) => async () => {
        if (type == 'start') {
            this.setState({
                showLoading: true
            })
        } else {
          let msg = operation == 'submit' && this.props.intl.formatMessage({id:"js.com.Car.0001", defaultMessage:"单据提交成功"}) || this.props.intl.formatMessage({id:"js.com.Car.0002", defaultMessage:"单据撤回成功"});
            success(msg);
            // this.getRequestTable(this.props.match.params.id);
            this.setState({
                showLoading: false
            })
        }

    }
    /**
   *
   * @description 提交失败和结束执行的函数
   * @param {string,string} operation为submit recall type 为error、end
   */
    bpmEnd = (operation, type) => async (error) => {
        if (type == 'error') {
            Error(error.msg);
        }
        this.setState({
            showLoading: false
        })
    }


    submit = (v) => {
        console.log(v)
    }
    goProcess = () => {

    }

    getMain = () => {
        let res = {};
        if(this.props.loadInfo) {
            for( let item in this.props.loadInfo ) {
                const reg = /^sub_/;
                if(!reg.test(item)){
                    res[item] = this.props.loadInfo[item];
                }
            }
        }
        return res;
    }
    renderMenu = () => {
        const obj = {
            pk_gd : this.props.info.id,
            main : this.getMain(),
            sub : ``,
        }
        const objRecall = {
            pk_gd : this.props.info.id,
            mdm_code : this.props.info.mdm_code,
        }
        const menu = (
            <ul className='u-dropdown-ul'>
                {
                    this.props.disabled.submitBtn ? null :
                    <li className='u-dropdown-li' key="1" >
                        <BpmButtonSubmit
                            funccode={this.props.info.id}
                            nodekey="003"
                            url={`/iuapmdm/modeling/mdmshow/flowdata/submit`}
                            urlAssignSubmit={`/iuapmdm/modeling/mdmshow/flowdata/assignSubmit`}
                            params={obj}                        // url={`${GROBAL_HTTP_CTX}/purchase_order/submit`}
                            // urlAssignSubmit={`${GROBAL_HTTP_CTX}/purchase_order/assignSubmit`}
                            onStart={this.bpmStart('submit', 'start')}
                            onSuccess={this.bpmStart('submit', 'success')}
                            onError={this.bpmEnd('submit', 'error')}
                            onEnd={this.bpmEnd('submit', 'end')}
                            >
                            <span >
                                <FormattedMessage id="js.com.Car.0003" defaultMessage="提交" />
                            </span>
                        </BpmButtonSubmit>
                    </li>
                }
                {
                    this.props.disabled.unsubmitBtn ? null :
                    <li className='u-dropdown-li' key="2" >
                        <BpmButtonRecall
                            params={objRecall}
                            url={`/iuapmdm/modeling/mdmshow/flowdata/unsubmit`}
                            onStart={this.bpmStart('recall', 'start')}
                            onSuccess={this.bpmStart('recall', 'success')}
                            onError={this.bpmEnd('recall', 'error')}
                            onEnd={this.bpmEnd('recall', 'end')}
                        >
                            <span>
                                <FormattedMessage id="js.com.Car.0004" defaultMessage="收回" />
                            </span>
                        </BpmButtonRecall>
                    </li>
                }
                <li className='u-dropdown-li' key="3" disabled={false}  onClick = {()=> {this.props.func.processBtn(this.getMain())}}><FormattedMessage id="js.com.Car.0005" defaultMessage="查看流程" /></li>
                <li className='u-dropdown-li' key="4" disabled={this.props.disabled.historyBtn}  onClick={this.props.func.historyBtn }><FormattedMessage id="js.com.Car.0006" defaultMessage="历史记录" /></li>
            </ul>
        );
        return menu;
    }

    render() {
        const menu = this.renderMenu();
        return (
            <div className='card-btn-group'>
                <ButtonGroup className='btn-group'>
                    <Button
                        className ='btn-group-btn'
                        onClick={this.props.func.copyBtn}
                        disabled={ this.props.disabled.copyBtn }
                    ><FormattedMessage id="js.com.Car.0007" defaultMessage="复制" /></Button>
                </ButtonGroup>
                <ButtonGroup className='btn-group'>
                    <Button
                        className ='btn-group-btn'
                        disabled={ this.props.disabled.sealBtn }
                        onClick={() => { this.props.func.sealBtn(0) }}>
                        <FormattedMessage id="js.com.Car.0008" defaultMessage="封存" />
                    </Button>
                    <Button
                        className ='btn-group-btn'
                        disabled={ this.props.disabled.unsealBtn }
                        onClick={() => { this.props.func.unsealBtn(1) }}>
                        <FormattedMessage id="js.com.Car.0009" defaultMessage="解封" />
                    </Button>
                    <Button

                        className ='btn-group-btn'
                        onClick={this.props.func.downloadBtn}
                    >
                        <FormattedMessage id="js.com.Car.0010" defaultMessage="下载" />
                    </Button>
                </ButtonGroup>

                <ButtonGroup className='btn-group'>

                    {
                        this.props.disabled.isWorkFlow ?
                        // 1 ?
                        <Dropdown
                            trigger={['hover']}
                            overlay={menu}
                            animation="slide-up"
                        >
                            <Button bordered colors='#BDBDBD'><FormattedMessage id="js.com.Car.0011" defaultMessage="审批中心" /></Button>
                        </Dropdown> :
                            <Button 
                                onClick={this.props.func.historyBtn}
                                disabled={this.props.disabled.historyBtn}>
                                <FormattedMessage id="js.com.Car.0012" defaultMessage="历史记录" />
                            </Button>
                    }
                </ButtonGroup>
                <Loading show={ this.state.showLoading } loadingType="line" />
            </div>
        )
    }
}
export default injectIntl(CardBtnGroup, {withRef: true});
