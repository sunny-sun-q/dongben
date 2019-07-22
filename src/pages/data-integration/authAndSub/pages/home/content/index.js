import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import { Checkbox, Modal, Tooltip } from 'tinper-bee';
import {Button} from 'components/tinper-bee';

import { toJS } from "mobx";

import {
    withRouter
} from 'react-router-dom';
import {
    inject,
    observer
} from 'mobx-react';

import './index.less'
import { async } from 'q';

@withRouter

@inject((stores) => {
    return {
        treeStore: stores.treeStore,
        dataMaintainStore: stores.dataMaintainStore
    }
}) @observer
export default class Content extends Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            needMultiSelect: false,
            pageIndex: 1,
            pageSize: 10,

            isDisableCheckbox: true
        }
        this.columns = [
            {
                title: "编码",
                dataIndex: "code",
                key: "code",
                width: '138',
                render: (text, record, index) => {
                    return (
                        <Tooltip inverse overlay={text}>
                        <span tootip={text} style={{
                            display: "inline-block",
                            width: "100px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                        }}>{text}</span>
                        </Tooltip>
                    );
                }
            },
            {
                title: "名称",
                dataIndex: "name",
                key: "name",
                width: '138',
                render: (text, record, index) => {
                    return (
                        <Tooltip inverse overlay={text}>
                        <span tootip={text} style={{
                            display: "inline-block",
                            width: "100px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                        }}>{text}</span>
                        </Tooltip>
                    );
                }
            },
            {
                title: "集成系统",
                dataIndex: "sysname",
                key: "sysname",
                width: '138',
                render: (text, record, index) => {
                    return (
                        <Tooltip inverse overlay={text}>
                        <span tootip={text} style={{
                            display: "inline-block",
                            width: "100px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                        }}>{text}</span>
                        </Tooltip>
                    );
                }
            },
            {
                title: "条件",
                dataIndex: "extCondition",
                key: "extCondition",
                width: '150',
                render: (text, record, index) => {
                    return (
                        <Tooltip inverse overlay={text}>
                        <span tootip={text} style={{
                            display: "inline-block",
                            width: "112px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                        }}>{text}</span>
                        </Tooltip>
                    );
                }
            },
            {
                title: "可写",
                dataIndex: "writeable",
                key: "writeable",
                width: 70,
                render: (text, record, index) => {
                    return (
                        <Checkbox
                            checked={record.writeable}
                            disabled={this.state.isDisableCheckbox}
                        />
                    )
                }
            },
            {
                title: "可读",
                dataIndex: "readable",
                key: "readable",
                width: 70,

                render: (text, record, index) => {
                    return (
                      <Checkbox
                        checked={record.readable}
                        disabled={this.state.isDisableCheckbox}
                      />
                    )
                }
            },
            {
                title: "可订阅",
                dataIndex: "subscribe",
                key: "subscribe",
                width: 100,
                render: (text, record, index) => {
                    return (
                        <Checkbox
                            checked={record.subscribe}
                            disabled={this.state.isDisableCheckbox}
                        />
                    )
                }
            },
            {
                title: "状态",
                dataIndex: "dr",
                key: "dr",
                width: '100',
                render(text, record, index) {
                  let drInfo = record.dr===0?'启用':'停用'
                  return (
                    <span className={record.dr===0?'auth-sub-table-enable auth-sub-table-oper':'auth-sub-table-stopuseing auth-sub-table-oper'}>{drInfo}</span>
                  )
                }
            },
            {
                title: "操作",
                dataIndex: "done",
                key: "done",
                width: 200,

                render(text, record, index) {
                    return (
                        <ul className="display-flex handle-btn-group">

                            <li onClick={() => { self.editItem(text, record, index) }}>
                                修改
                            </li>
                            <li onClick={() => { self.startOrStop(text, record, index) }}>
                                {record.dr==0 ? '禁用' : '启用'}
                            </li>
                            <li onClick={() => { self.deleteItem(text, record, index) }}>
                                删除
                            </li>
                        </ul >
                    );
                }
            }
        ];

    }

    componentWillReceiveProps(nextProps) {

        let nextNodeId = nextProps.match.params.id
        if (nextNodeId && nextNodeId !== this.props.match.params.id) {
            this.props.dataMaintainStore.table.nodeinfo.pk_gd = nextNodeId
            this.props.dataMaintainStore.getTableRequest(1, 10)
        }
    }

    componentDidMount() {
        this.props.dataMaintainStore.table.nodeinfo.pk_gd = this.props.treeStore.tree.selectedKeys[0]
        this.props.dataMaintainStore.getTableRequest(1, 10)
    }

    addAuthAndSube = () => {
        this.props.dataMaintainStore.table.nodeinfo.gdname = this.props.treeStore.nodeLeaf.info.name
        this.props.dataMaintainStore.table.oneInfo = {}
        this.props.dataMaintainStore.queryEntityListAuthSubeDetailByMeta();
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/addOrEdit/${this.props.dataMaintainStore.table.nodeinfo.pk_gd}/000`);
    }

    editItem = (text, record, index) => {
        this.props.dataMaintainStore.table.isAdd = 1;
        record.isAllDisabled = true
        this.props.dataMaintainStore.table.oneInfo = record;
        this.props.dataMaintainStore.queryEntityListAuthSubeDetail(record.pk_auth_sube_id);
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`/addOrEdit/${this.props.dataMaintainStore.table.nodeinfo.pk_gd}/${record.pk_auth_sube_id}`);
    }

    startOrStop = (text, record, index) => {
        let single = {
            startOrStopPk: record.pk_auth_sube_id,
            startOrStopValue: record.dr == 0 ? 1 : 0
        }
        this.props.dataMaintainStore.table.single = single
        this.props.dataMaintainStore.startOrStop();
    }
    deleteItem = (text, record, index) => {
        let single = {
            isShowSingleDelModal: true,
            delSinglePk: record.pk_auth_sube_id
        }
        this.props.dataMaintainStore.table.single = single
    }

    confirmDeleteSingle = () => {
        let ids = this.props.dataMaintainStore.table.single.delSinglePk
        this.props.dataMaintainStore.delAuthAndSubes(ids);
    }

    cancelSingleDel = () => {
        let single = {
            isShowSingleDelModal: false,
            delSinglePk: ''
        }
        this.props.dataMaintainStore.table.single = single
    }

    onPageSizeSelect = (index, pageSize) => {
        let { pageIndex } = this.state
        this.props.dataMaintainStore.getTableRequest(pageIndex, pageSize)
        this.setState({
          pageSize: pageSize
        })
    }

    onPageIndexSelect = pageIndex => {
        let { pageSize } = this.state
        this.props.dataMaintainStore.getTableRequest(pageIndex, pageSize)
        this.setState({
          pageIndex: pageIndex
        })
    }

    render() {
        let { authAndSube, total, pageCount } = this.props.dataMaintainStore.table.grid
        let { isShowSingleDelModal } = this.props.dataMaintainStore.table.single
        // let { isDisableDelAuths, isShowBatchDelModal } = this.props.dataMaintainStore.table.selected
        let { needMultiSelect, pageIndex, pageSize } = this.state

        return (
            <div className='DemoOrder-root'>

                <div className='table-header mt25'>
                  <Button onClick={this.addAuthAndSube} >
                    新增
                  </Button>

                </div>

                <PaginationTable
                    columns={this.columns}
                    data={authAndSube}
                    total={total}
                    totalPages={pageCount}

                    needMultiSelect={needMultiSelect}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    checkMinSize={6}
                    onPageSizeSelect={this.onPageSizeSelect}
                    onPageIndexSelect={this.onPageIndexSelect}
                />

                <Modal
                    show={isShowSingleDelModal}
                    style={{ width: 400 }}
                    onHide={this.cancelSingleDel} >
                    <Modal.Header>
                        <Modal.Title>{"确认删除"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {"你确定要删除此条内容吗?"}
                    </Modal.Body>
                   <Modal.Footer>
                        <Button onClick={this.cancelSingleDel} bordered style={{ marginRight: 20 }}>取消</Button>
                        <Button onClick={this.confirmDeleteSingle} >确认</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
