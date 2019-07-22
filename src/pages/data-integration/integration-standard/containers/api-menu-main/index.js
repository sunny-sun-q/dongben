import React, { Component } from 'react';
import ApiCategory from '../../static/json/apicategory.json';
import {Icon, Tooltip} from 'tinper-bee';
import {
    inject,
    observer
} from 'mobx-react';
import './index.less';

@inject((stores) => {
    return {
        treeStore: stores.treeStore,
        apiStore: stores.apiStore,
        menuStore: stores.menuStore,
        sysregisterStroe: stores.sysregisterStroe,
    }
})
@observer
class ApiMenu extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            code: "",
            name: "",
            type: "",
            superiorCoding:"",
            lastClickLeafTreePK:""
        };

        this.onMenuClick = this.onMenuClick.bind(this);
    }

    componentDidMount(){
        // 默认展开第一个分类
        this.setState({
            code: ApiCategory.category[0].data[0].code,
            name: ApiCategory.category[0].data[0].name,
            type: ApiCategory.category[0].data[0].type,
            superiorCoding: ApiCategory.category[0].data[0].superiorCoding,
            lastClickLeafTreePK: this.props.treeStore.tree.node.id,
        })

        this.props.menuStore.setSelectMenuNode(ApiCategory.category[0].data[0]);
        // from mdm get menuNode queryParam
        this.props.apiStore.getData(ApiCategory.category[0].data[0].code, ApiCategory.category[0].data[0].superiorCoding)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.pk_gd != this.props.pk_gd){
            this.setState({
                code: ApiCategory.category[0].data[0].code,
                name: ApiCategory.category[0].data[0].name,
                type: ApiCategory.category[0].data[0].type,
                superiorCoding: ApiCategory.category[0].data[0].superiorCoding,
                lastClickLeafTreePK: this.props.treeStore.tree.node.id,
            })

            this.props.menuStore.setSelectMenuNode(ApiCategory.category[0].data[0]);
            // from mdm get menuNode queryParam
            this.props.apiStore.getData(ApiCategory.category[0].data[0].code, ApiCategory.category[0].data[0].superiorCoding)
        }
    }

    // componentWillUpdate(){
    //     // from mdm get menuNode queryParam
    //     this.props.apiStore.getData(ApiCategory.category[0].data[0].code, ApiCategory.category[0].data[0].superiorCoding)
    // }

    onMenuClick = (item) => {
        // 在本组件中记录一份点击的按钮并在store中记录一份用于其他组件的访问
        this.setState({
            code: item.code,
            name: item.name,
            type: item.type,
            superiorCoding: item.superiorCoding,
        });
        this.props.menuStore.setSelectMenuNode(item);
        // from mdm get menuNode queryParam
        this.props.apiStore.getData(item.code, item.superiorCoding)
    }

    // api menu list
    generateMenu(apiData) {
        const { code } = this.state;
        // const overlayInfo = '下载';
        let downloadUrl = '/iuapmdm/openapi/downloadExample';
        // let downloadUrl = '/iuapmdm/modeling/mdmshow/card/file/download?saveAddr=c7e140a3-cf80-4669-b474-7e58bcfdb2aa_customer.xml&fileName=customer.xml';
        return (
            apiData.category.map((array, i) => {
                return (
                    <div key={'category' + i} className="menu-category">
                        <h3 className="menu-category-title">
                        {array.name}
                        <Tooltip inverse overlay={array.code==='rest'?'主数据rest接口下载':'主数据webservice接口下载'}  placement="bottom">
                          <a href={downloadUrl+'?protocol='+array.code} download><Icon type="uf-download" /></a>
                        </Tooltip>
                        </h3>
                        <ul>
                            {array.data.map((item, index) => {
                                return (
                                    <li href="#" key={item.code} className={code === item.code ? "selected" : ''} onClick={() => { this.onMenuClick(item) }}>
                                        <div className="name">{item.name}</div>
                                        <i className="uf uf-arrow-right"></i>
                                    </li>
                                )
                            })
                            }
                        </ul>
                    </div>
                );
            })
        )
    }

    render() {
        return (
            <div className="section-wrap-menu">
                {this.generateMenu(ApiCategory)}
            </div>
        )
    }
}

export default ApiMenu;
