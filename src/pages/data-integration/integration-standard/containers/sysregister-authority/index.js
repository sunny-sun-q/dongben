import React, { Component } from 'react';
import { Tabs} from 'tinper-bee';
import {Button} from 'components/tinper-bee';
import {
    withRouter
} from 'react-router-dom';

import {
    inject,
    observer
} from 'mobx-react';

import ReactJsonView from '../jsonView/ReactJsonView'
import './index.less'
import { toJS } from "mobx";
const { TabPane } = Tabs;

@withRouter
@inject((stores) => {
    return {
        treeStore: stores.treeStore,
        apiStore: stores.apiStore,
        menuStore: stores.menuStore,
        sysregisterStroe: stores.sysregisterStroe,
        ReactJsonViewStore: stores.ReactJsonViewStore,
    }
}) @observer
class Sysregister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // activeKey: "",
            json: "",
        }
        this.getAuthoritys = this.getAuthoritys.bind(this);
        this.findTheNeedRenderResult = this.findTheNeedRenderResult.bind(this);
    }

    onTabChange = (activeKey) => {
        // this.setState({
        //     activeKey,
        // });
        this.props.sysregisterStroe.authClickActive.activeKey = activeKey;
    }

    download(downloadType, paramType, systemCode) {
        let tree_id = this.props.treeStore.tree.node.id;
        let {type, code, superiorCoding}  = this.props.menuStore.menu;
        let menu_type = toJS(this.props.menuStore.menu.type);
        // console.log(this.props.menuStore.menu,menu_type);
        this.props.sysregisterStroe.download(tree_id, menu_type, code, paramType, superiorCoding, downloadType, systemCode);
    }

    componentWillMount(){
        console.log(111)
    }

    componentDidMount(){
        let pk_gd = this.props.pk_gd;
        this.getAuthoritys(pk_gd);
        this.findTheNeedRenderResult(this.props.resultType);
    }

    async getAuthoritys(pk_gd){
        // type:区分是body、result还是distribute,由Apidetails使用时传入
        let { sysregisterStroe, menuStore, resultType } = this.props;
        // 找出选中的menu节点的type
        let {type, code, superiorCoding} = menuStore.menu;

        // 将获取到的数据保存到store里的不同变量中
        await sysregisterStroe.getData(pk_gd, type, code, resultType, superiorCoding);
    }

    findTheNeedRenderResult(){
        let { sysregisterStroe, resultType } = this.props;
        let needRenderResult;
        switch (resultType) {
            case "body":
                needRenderResult = sysregisterStroe.sysregisterExcludeDistribute.queryBodyData;
                break;
            case "result":
                needRenderResult = sysregisterStroe.sysregisterExcludeDistribute.resultBodyData;
                break;
            case "distribute":
                needRenderResult = sysregisterStroe.sysregisterForDistribute.data;
                break;
            default:
                needRenderResult = '';
                break;
        }

        let activeKey = needRenderResult.length > 0 ? needRenderResult[0].systemCode : '';
        this.props.sysregisterStroe.authClickActive.activeKey = activeKey;
        // if(activeKey && activeKey != ''){
        //     this.setState({
        //         activeKey: activeKey,
        //     })
        // }
    }

    getSysregister(data, paramType, superiorCoding) {
        let returnData = []
        if (data.length > 0 && this.props.treeStore.tree.isleaf) {
            data.map((item) => {
                returnData.push(
                    <TabPane tab={item.systemCode} key={item.systemCode}>
                        <div className="buttonPadding">
                          {
                            superiorCoding !== 'rest'?
                            <Button  onClick={() => this.download("xml", paramType,item.systemCode)}>下载</Button >:''
                          }
                            { superiorCoding !== 'webservice' ?
                                <Button   onClick={() => this.download("json", paramType,item.systemCode)}>下载</Button >
                                    :
                                ""
                            }
                        </div>

                        {<ReactJsonView src={JSON.stringify(item.data)} showType={superiorCoding}/>}

                    </TabPane>
                )
            })
        }
        return returnData
    }

    render() {
        let {resultType, sysregisterStroe, menuStore} = this.props;
        let { type, superiorCoding } = menuStore.menu;
        let { activeKey } = sysregisterStroe.authClickActive;
        let needRenderResult;
        switch (resultType) {
            case "body":
                needRenderResult = sysregisterStroe.sysregisterExcludeDistribute.queryBodyData;
                break;
            case "result":
                needRenderResult = sysregisterStroe.sysregisterExcludeDistribute.resultBodyData;
                break;
            case "distribute":
                needRenderResult = sysregisterStroe.sysregisterForDistribute.data;
                break;
            default:
                needRenderResult = '';
                break;
        }
        
        return (
            <div>
                { needRenderResult.length > 0 ?
                    <Tabs
                        defaultActiveKey={activeKey}
                        activeKey={activeKey}
                        onChange={this.onTabChange}
                        tabBarStyle="primary"
                        className="demo1-tabs intergration-standard-tabs"
                    >
                        {this.getSysregister(needRenderResult, resultType, superiorCoding)}
                    </Tabs>
                    : ''
                }
            </div>
        )
    }
}

export default Sysregister;
