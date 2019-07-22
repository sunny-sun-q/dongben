import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import { Button, Message, Tooltip, Table, Loading, Pagination } from 'tinper-bee';
import Select from 'bee-select';
import moment from "moment/moment";
import SocializedMasterDataQueryForm from '../SocializedMasterDataQuery-form';
import SeniorSearch from 'components/SeniorSearch';
import {
    withRouter
} from 'react-router-dom';
import {
    inject,
    observer
} from 'mobx-react';

import './index.less'

@withRouter
@inject((stores) => {
    return {
        socialDataStore: stores.socialDataStore,
        entityContentStore: stores.entityContentStore,
        seniorSearchStore: stores.seniorSearchStore,
    }
}) @observer
export default class SocializedMasterDataRoot extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            showLoading: false,      // 是否显示加载遮罩
            selectData: [],         // 选中的数据
            //分页默认的配置
            activePage: 1,
            pageIndex: 1,
            pageSize: 10,
        };

        // 默认操作列
        this.dcolumn = [
            {
                title: "操作",
                dataIndex: "d",
                key: "d",
                width: 200,
                fixed: "right",
                render(text, record, index) {
                    return (
                        <ul className="display-flex handle-btn-group">
                            <li onClick={() => { self.cellClick(record, 'enterpriseImage') }}>
                                企业画像
                            </li>
                            <li onClick={() => { self.cellClick(record, 'Investment') }}>
                                股权结构
                            </li>
                            {/* <li onClick={() => { self.cellClick(record, 'relationship') }}>
                                客商关系
                            </li> */}
                        </ul>
                    )
                }
            }
        ]
    }

    defaultColumns = [
        {
            text: "企业名称",
            fieldId: "columnOne",
            key: "columnOne",
            width: 200,
        },{
            text: "企业性质",
            fieldId: "columnTwo",
            key: "columnTwo",
            width: 200,
        },{
            text: "经营范围",
            fieldId: "columnThree",
            key: "columnThree",
            width: 200,
        },{
            text: "成立时间",
            fieldId: "columnFour",
            key: "columnFour",
            width: 200,
        },{
            text: "注册时间",
            fieldId: "columnFive",
            key: "columnFive",
            width: 200,
        },{
            text: "员工人数",
            fieldId: "columnSix",
            key: "columnSix",
            width: 200,
        }
    ]

    /**
     * 按钮跳转到不同的页面
     */
    cellClick = (record, type) => {
        console.log('666', record)
        var code = this.props.socialDataStore.queryItemColumnByItfPK.queryCode;
        var name = record[code];
        switch (type) {
            case 'enterpriseImage':
                    window.mdmNowUrl = window.location.href;
                this.props.history.push(`/portraiture/${name}`)
                break;
            case 'Investment':
                    window.mdmNowUrl = window.location.href;
                this.props.history.push(`/Relation/${name}`)
                break;
            case 'relationship':
                    window.mdmNowUrl = window.location.href;
                this.props.history.push(`/relationship/${name}`)
                break;
            default:
        }
    }

    // 第一次加载时获取表的列和数据
    async componentDidMount() {
        
        // 第一次加载时需要加载对应基本信息接口的配置和对应实体
        await this.props.socialDataStore.getBaseInfoURL(1,2);
        // 根据接口配置来获取表数据
        this.getRequestTable()
        // 根据实体来获取对应的查询项
        this.props.socialDataStore.getQueryItemColumnByItfPK(this.props.socialDataStore.BaseInfoURL.confInfo.pk_interfaceinfo)
        // 根据接口配置的实体查询对应的查询项
        this.props.socialDataStore.getRequestQueryItems(this.props.socialDataStore.BaseInfoURL.confInfo.designated_entity)

    }

    getRequestTable(id) {
        var { pageIndex, pageSize} = this.state;
        this.props.entityContentStore.reset()
        let pk_sys = ""
        let gdCode = id || this.props.socialDataStore.BaseInfoURL.confInfo.designated_entity
        let categoryCode = ''
        let condition = ''
        this.props.entityContentStore.getTableDataRequest(pk_sys, gdCode, categoryCode, condition, pageIndex, pageSize)
    }

    /**
     * 合成表头数组
     * @param header
     */
    mapTableHeader(header) {
        const temparr = header.map((item) => {
            if(item.fieldId === "mdm_version") return;
            return {
                title: item.fieldId === "mdm_code"?"MDMCODE":item.text,
                dataIndex: item.fieldId === "mdm_code"?"mdm_code":item.fieldId,
                key: item.fieldId === "mdm_code"?"mdm_code":item.fieldId,
                width: "150px",
                height: "40px",
                render: (text, record, index) => {
                    return (
                      <Tooltip inverse overlay={text}>
                        <span tootip={text} style={{
                          display: "inline-block",
                          width: "120px",
                        //   height: "40px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          verticalAlign: "middle",
                        }}>{text}</span>
                      </Tooltip>
                    );
                }
            }
        })
        console.log(temparr)
        return temparr
    }

    tabelSelect = (data) => {//tabel选中数据
        this.setState({
            selectData: data
        })
    }

    // 表格勾选回调函数，返回选中数据
    onTableSelectedData = data => {
        this.setState({
            selectData: data
        })
    }

    // 分页单页数据条数选择函数
    onPageSizeSelect = async(index, value) => {
        await this.setState({
            pageIndex : 1,
            activePage : 1,
            pageSize : value,
        })
        // 根据接口配置的实体查询对应的查询项
        await this.getRequestTable()
    }

    // 分页组件点击页面数字索引执行函数
    onPageIndexSelect = async(value) => {
        await this.setState({
            pageIndex : value,
            activePage : value
        })
        // 根据接口配置的实体查询对应的查询项
        await this.getRequestTable()
    }

    handleSelect(eventKey) {
		console.log(eventKey);
	    this.setState({
	      activePage: eventKey
	    });
    }

    dataNumSelect = async(index,value) =>{
        await this.setState({
            pageIndex : value,
            activePage : value
        })
        // 根据接口配置的实体查询对应的查询项
        await this.getRequestTable()
    }

    render() {
        // let oldColumn = this.dcolumn();
        let { showLoading, activePage, pageIndex, pageSize } = this.state;
        let { columns, datas, total, pageCount} = this.props.entityContentStore.tableDatas;
        this.columns = this.mapTableHeader(columns.length > 0 ? columns : this.defaultColumns).concat(this.dcolumn);
        this.tableDataSource = datas;

        
        return (
            <div className='DemoOrder-root'>
                {/* 查询表单 */}
                <SocializedMasterDataQueryForm {...this.props} />
                {/* <div className='table-header mt25'> */}
                    {/* 高级查询 */}
                    {/* <SeniorSearch /> */}
                {/* </div> */}
                {/* 表带分页 */}
                <PaginationTable
                    needMultiSelect={false}
                    data={this.tableDataSource}
                    activePage={activePage}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    activePage={activePage}
                    totalPages={pageCount}
                    total={total}
                    columns={this.columns}
                    checkMinSize={6}
                    getSelectedDataFunc={this.tabelSelect}
                    scroll={{x: true, y: 450}}
                    // onTableSelectedData={this.onTableSelectedData}
                    onPageSizeSelect={this.onPageSizeSelect}
                    onPageIndexSelect={this.onPageIndexSelect}
                />

                {/* 加载页面过程 */}
                <Loading show={showLoading} loadingType="line" />
            </div>

        )

    }
}
