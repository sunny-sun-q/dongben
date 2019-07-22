import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import { ButtonGroup, Checkbox, Message, Modal, Loading } from 'tinper-bee';
import Select from 'bee-select';
import moment from "moment/moment";
import SeniorSearch from 'components/SeniorSearch';
import multiSelect from "bee-table/build/lib/multiSelect.js";
import Table from 'bee-table';
// 就是将选择框和表进行合并
let MultiSelectTable = multiSelect(Table, Checkbox);
import { Button } from 'components/tinper-bee';
import {
    withRouter
} from 'react-router-dom';
import {
    inject,
    observer
} from 'mobx-react';

import './index.less'
import { tableRefStore } from '../../../entity-model/stores/store';

@withRouter

@inject((stores) => {
    return {
        treeStore: stores.treeStore,
        dataMaintainStore: stores.dataMaintainStore,
        seniorSearchStore: stores.seniorSearchStore,
    }
}) @observer
export default class DataMaintenanceRoot extends Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            id: '',
            // 表格中所选中的数据，拿到后可以去进行增删改查
            selectData: [],
            selectPks: [],
            step: 10,
            showModal: false,
            delState: true,
            modifyState: true,
            sigleDel: false, //是否是单行删除
            singlePk: [], //单行删除的pk也放到数组中，和批量删除调用一个方法
        }
        this.columns = [
            {
                title: "序号",
                dataIndex: "wflowseq",
                key: "wflowseq",
                width: '15%',
            },
            {
                title: "权限名称",
                dataIndex: "name",
                key: "name",
                width: '15%',
            },
            {
                title: "角色名称",
                dataIndex: "roleName",
                key: "roleName",
                width: '15%',
            },
            {
                title: "数据范围",
                dataIndex: "ext_condition",
                key: "ext_condition",
                width: '25%',
            },

            {
                title: "操作",
                dataIndex: "done",
                key: "done",
                width: '15%',
                // fixed: "right",
                render(text, record, index) {
                    return (
                        <ul className="display-flex handle-btn-group">
                            <li onClick={() => {
                                self.viewItem(text, record, index)
                            }}>
                                查看
                        </li>
                            <li onClick={() => {
                                self.editItem(text, record, index)
                            }}>
                                修改
                        </li>
                            {
                                <li onClick={() => {
                                    self.deleteItem(text, record, index)
                                }}>
                                    删除
                        </li>
                            }
                        </ul >
                    );
                }
            }
        ];

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id && nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({
                id: nextProps.match.params.id
            })
            this.getRequestTable(nextProps.match.params.id)
        }
        // if(nextProps.match.url !== this.props.match.url){
        //     this.getRequestTable(nextProps.match.params.id)
        // }
    }

    componentDidMount() {
        this.getRequestTable()
    }

    /**
     * 请求表格数据
     * @param id
     */
    getRequestTable(id) {
        let gdCode = id || this.props.match.params.id
        this.props.dataMaintainStore.getTableRequest(gdCode)
        // this.props.dataMaintainStore.getTableRequest("b0bac400-35fb-49d3-95bf-fe111e13f2c3")
    }

    /**
     * 新增
     */
    addAuthClick = async () => {
        await this.props.dataMaintainStore.createDataAuth(this.props.match.params.id);
        let { mainAuthInfo } = this.props.dataMaintainStore.table;
        if (mainAuthInfo == undefined || mainAuthInfo.length == 0) {
            Message.create({ content: '该实体模型没有字段，不能添加权限模型！', color: 'danger' });
            return;
        }
        const { table } = this.props.dataMaintainStore;
        table.editState = 0;
        table.info.name = '';
        table.info.wflowseq = '';
        table.info.role = '';
        table.info.pk_role = '';
        table.info.filterCon = '';
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/edit/${this.props.match.params.id}`);
    }

    //行操作的三个方法
    //单行查看
    viewItem(text, record, index) {
        const { table } = this.props.dataMaintainStore;
        let data = record;
        table.mainAuthInfo = data["itemVOs"];
        table.editState = 2;
        table.info.name = data.name;
        table.info.wflowseq = data.wflowseq;
        table.info.role = data.roleName;
        table.info.pk_role = data.pk_role;
        table.info.filterCon = data.ext_condition;
        table.subAuthInfo = data["subItemVOs"];
        let flag = 1;
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/edit/${this.props.match.params.id}`);
    }
    //单行编辑
    editItem = (text, record, index) => {
        const { table } = this.props.dataMaintainStore;
        let data = record;
        table.mainAuthInfo = data["itemVOs"];
        table.editState = 1;
        table.info.pk_authority = data.pk_authority;
        table.info.name = data.name;
        table.info.wflowseq = data.wflowseq;
        table.info.role = data.roleName;
        table.info.pk_role = data.pk_role;
        table.info.filterCon = data.ext_condition;
        table.subAuthInfo = data["subItemVOs"];
        let flag = 1;
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/edit/${this.props.match.params.id}`);
    }

    //单条删除弹框
    deleteItem = (text, record, index) => {
        let pk_authority = record["pk_authority"];
        let singlePks = [];
        singlePks.push(pk_authority);
        this.setState({
            showModal: true, sigleDel: true,
            singlePk: singlePks
        });
    }
    //单条删除确认
    deleteItemConfirm = async () => {
        let { delData } = this.state;
        await this.props.dataMaintainStore.delDataAuths(this.state.singlePk);
        this.props.dataMaintainStore.getTableRequest(this.props.match.params.id);
        this.setState({
            showModal: false,
            sigleDel: false
        })
    }

    // 删除操作
    // delItem = (record, index) => {
    //     this.setState({
    //         showModal: true,
    //         delData: [{ id: record.id, ts: record.ts }]
    //     });

    // }

    //批量删除弹框
    delDataAuth = () => {
        this.setState({ showModal: true, sigleDel: false });
    }


    tabelSelect = (data) => {//tabel选中数据
        this.setState({
            selectPks: data
        })
    }

    // 流程提交成功后回调函数
    onSubmitSuc = async () => {
        await actions.DemoOrder.loadList();
        actions.DemoOrder.updateState({ showLoading: false });
        Message.create({ content: '单据提交成功', color: 'success' });

    }

    // 提交操作初始执行操作
    onSubmitStart = () => {
        actions.DemoOrder.updateState({ showLoading: true });

    }
    // 提交失败回调函数
    onSubmitFail = (error) => {
        actions.DemoOrder.updateState({ showLoading: false });
        Message.create({ content: error.msg, color: 'danger' });

    }
    // 撤回操作执行起始函数,通常用于设置滚动条
    onRecallStart = () => {
        actions.DemoOrder.updateState({ showLoading: true });
    }

    // 模态框确认删除
    onModalDel = async (delFlag) => {
        let { delData } = this.state;
        if (delFlag) {
            await this.props.dataMaintainStore.delDataAuths(this.state.selectPks);
            this.props.dataMaintainStore.getTableRequest(this.props.match.params.id);
        }
        this.setState({
            showModal: false,
            sigleDel: false
        })

    }


    onTableSelectedData = (data, record, index) => {
        let select_pks = data.map((item) => { return item["pk_authority"]; }
        );
        debugger;
        let delState = select_pks.length == 0 ? true : false;
        let modifyState = select_pks.length == 1 ? false : true;
        const allChecked = select_pks.length == 0 ? false : true;

        if (!record) {
            this.props.dataMaintainStore.table.allAuthInfo.forEach(item => {
                item._checked = allChecked;
            })
        } else {
            this.props.dataMaintainStore.table.allAuthInfo[index]['_checked'] = record._checked;
        }

        this.setState({
            selectPks: select_pks,
            selectData: data,
            delState,
            modifyState,
        })
    }

    render() {
        const self = this;
        let { selectPks, showModal } = this.state;
        return (

            <div className='DemoOrder-root'>
                <div className='table-header mt25'>
                    <Button colors="primary" onClick={this.addAuthClick}>
                        新增
                    </Button>
                    {/* <Button disabled={this.state.modifyState} colors="primary" size='sm' onClick={this.editAuthClick} >
                        修改
                        </Button> */}
                    <Button disabled={this.state.delState} colors="primary" onClick={this.delDataAuth}>
                        批量删除
                    </Button>
                </div>
                <MultiSelectTable
                    data={this.props.dataMaintainStore.table.allAuthInfo}
                    columns={this.columns}
                    getSelectedDataFunc={this.onTableSelectedData}
                />
                <Modal
                    show={showModal}
                    onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>确认删除</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        您确定要删除选中内容吗?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => this.onModalDel(false)} bordered style={{ marginRight: 15 }}>取消</Button>
                        {
                            this.state.sigleDel ? <Button onClick={() => this.deleteItemConfirm()} colors="primary">确认</Button> : <Button onClick={() => this.onModalDel(true)} colors="primary">确认</Button>
                        }

                    </Modal.Footer>
                </Modal>
            </div>
        )

    }
}
