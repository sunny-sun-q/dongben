import React, { Component } from 'react';


import { Icon, Modal, Button } from 'tinper-bee';
import Tree from 'bee-tree'
const TreeNode = Tree.TreeNode;

import  Option from './option.js'

const defaultProps = {
    keys: ['0-0-0', '0-0-1']
}


import {
    BrowserRouter as Router,
    Route,
    Link,
    withRouter
} from 'react-router-dom';

import './index.less'
import {
    inject,
    observer
} from 'mobx-react';

@withRouter

@inject((stores) => {
    return {
        designStore: stores.designStore
    }
}) @observer




class FilterMasterModal extends Component {
    constructor(props, context) {
        super(props, context);
        const keys = this.props.keys;
        this.state = {
            alertShowModal: false,
            alertTitle: '提示信息',
            alertContent: '请选择主数据'
        };

    }

    submit = async() => {

        let { designStore } = this.props
        let { custom } = this.props.designStore
        let { checkSelectedKeys, currentShowSelectedKeys } = this.props.designStore.custom
        let { allTreeNodeKeys } = this.props.designStore.statisticsData

        if(checkSelectedKeys.length === 0 && currentShowSelectedKeys.length != 0){
            this.setState({
                alertShowModal: true
            })
        } else{
            this.props.designStore.custom.submitSelectedKeys = checkSelectedKeys.length === 0 ?  currentShowSelectedKeys : checkSelectedKeys

            designStore.custom.showModal = false

            await designStore.queryDesignCount()
            await this.props.update1()

            await this.props.designStore.queryAuthorityByPkgdAndCond()
            await this.props.update2()

            await this.props.designStore.queryDisNum('allSys')
            await this.props.designStore.queryLoadNum('allSys')
            await this.props.update3()
        }
    }

    close = () => {  
        let { currentShowSelectedKeys } =  this.props.designStore.custom       
        this.props.designStore.custom.showModal = false
        this.props.designStore.custom.submitSelectedKeys = currentShowSelectedKeys 
    }

    onSelect = (info) => {
        // console.log('selected', info);
    }

    onCheck = (info) => { 
        // debugger  // 主要调试自定义页面的全选按钮 , 全选时会将全选按钮key=0算入 
        let _info = []
        if(info.length == this.props.designStore.statisticsData.allTreeNodeKeys.length + 1){
            for(var i=0 ; i<info.length-1; i++){
                _info.push(info[i]);
            }
        } else {
            _info = info
        }
        this.props.designStore.custom.checkSelectedKeys = _info
    }

    loop = (data) => { //   参照 src\components\tree\index.js
        return data.map(item => {
            if (item.children.length > 0) {
                return (
                    <TreeNode key={item.id} title={item.name}>
                        {this.loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={item.name} />;
        });
    }

    closeAlert = () => {
        this.setState({
            alertShowModal: false
        })
    }

    render() {
        let { statisticsData, custom } = this.props.designStore
        let defaultCheckedKeys = this.props.designStore.custom.submitSelectedKeys
        const size = 'lg';
        return (
            <div className="">
                <Modal
                    show={custom.showModal}
                    onHide={this.close} >
                    <Modal.Header closeButton>
                        <Modal.Title>请选择要统计的主数据</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Tree className="myCls" checkable defaultExpandAll={true}
                            openIcon={<Icon type="uf-minus" />} closeIcon={<Icon type="uf-plus" />} //自定义展开关闭节点图标
                            // defaultExpandedKeys={this.state.defaultExpandedKeys} // 默认展开指定的节点
                            // defaultSelectedKeys={this.state.defaultSelectedKeys} // 指定选中的节点key
                            defaultCheckedKeys={defaultCheckedKeys}  // 指定默认被选中的节点key
                            onSelect={this.onSelect}  // 当用户选择树节点触发的回调函数(点击树节点时)
                            onCheck={this.onCheck} // 当选择事件发生触发的方法(点击选择框时)
                        >
                            {this.loop(statisticsData.treeData)}
                        </Tree>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.close} shape="border" style={{ marginRight: 15 }}>取消</Button>
                        <Button onClick={this.submit} colors="primary">确认</Button>
                    </Modal.Footer>
                </Modal>


                <Modal
                    show={this.state.alertShowModal}
                    onHide={this.closeAlert}
                    style={{ width: 300 }}
                    className="alertInfo"
                    >
                <Modal.Header className="text-center" closeButton>
                    <Modal.Title>
                    {this.state.alertTitle} 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.alertContent}
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button shape="border" style={{ marginRight: 20 }} onClick={this.closeAlert}>关闭</Button>
                </Modal.Footer>
                </Modal>

            </div>
        )
    }
}
FilterMasterModal.defaultProps = defaultProps;
export default FilterMasterModal; 
