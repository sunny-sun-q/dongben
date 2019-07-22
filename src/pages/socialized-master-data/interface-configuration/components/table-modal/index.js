import React, {Component} from 'react';
import { Button, Col,  Row, FormControl, Icon } from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import Modal from 'bee-modal'

import './index.less';

import {
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class RefModal extends Component {
	constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      selectedRowIndex: -1
    }
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.submit = this.submit.bind(this);
    this.rowclick = this.rowclick.bind(this);
    this.rowDoubleClick = this.rowDoubleClick.bind(this);
  }

  // 暂时缓存数据的位置，只有提交时才替换
  tempFieldObj = {
    selectedMapItemId : "",
    selectedMapItemName : "",
    selectedMapItemCode : "",
    selectedMapItemNameCode : "",
    selectedMapItemFieldType : "",
  }

  close() {
      this.props.entityContentStore.setTableModal(false, false)
  }

  open() {
      this.props.entityContentStore.setTableModal(false, true)
  }
  rowDoubleClick = (record,index,e) => {
    // debugger;
    this.tempFieldObj = Object.assign(this.tempFieldObj, {
      selectedMapItemId : record.selectedMapItemId,
      selectedMapItemName : record.selectedMapItemName,
      selectedMapItemCode : record.selectedMapItemCode,
      selectedMapItemNameCode : record.selectedMapItemNameCode,
      selectedMapItemFieldType : record.selectedMapItemFieldType,
    })
    this.setState({
      selectedRowIndex:index
    })
    this.submit(e);
  }
  submit(e) {
    // 抑制提交事件
    e.preventDefault();
    // 从store里替换其中的数据
    let entityStore = this.props.entityContentStore;
    let selectShowData = entityStore.mappingDatas.showMap[entityStore.mappingDatas.selectIndex];
    let {
      selectedMapItemId,
      selectedMapItemName,
      selectedMapItemCode,
      selectedMapItemNameCode,
      selectedMapItemFieldType,
    } = this.tempFieldObj;

    selectShowData.selectedMapItemId = selectedMapItemId;
    selectShowData.selectedMapItemName = selectedMapItemName;
    selectShowData.selectedMapItemCode = selectedMapItemCode;
    selectShowData.selectedMapItemNameCode = selectedMapItemNameCode;
    selectShowData.selectedMapItemFieldType = selectedMapItemFieldType;

    // 替换原先的展示数据，并加入新的映射数据中
    Object.assign(entityStore.mappingDatas.showMap[entityStore.mappingDatas.selectIndex], selectShowData)
    entityStore.mappingDatas.mappingMap.push(selectShowData);
    this.props.getData()
    this.close();
  }

  // 每次点击缓存数据
  rowclick = (record,index) => {
    this.tempFieldObj = Object.assign(this.tempFieldObj, {
      selectedMapItemId : record.selectedMapItemId,
      selectedMapItemName : record.selectedMapItemName,
      selectedMapItemCode : record.selectedMapItemCode,
      selectedMapItemNameCode : record.selectedMapItemNameCode,
      selectedMapItemFieldType : record.selectedMapItemFieldType,
    })
    this.setState({
      selectedRowIndex:index
    })
  }

	render() {
    const { title } = this.props;
    const { header,body } = this.props.entityContentStore.fieldref.tableList;
    const { columns, data } = this.state;
    const { entityContentStore } = this.props;
		return (
      <div>
        <Modal
          show={entityContentStore.fieldref.ifTableModalShow}
          onHide={this.close}
          style={{width: 600}}
          className="ref-modal-overflowy-hidden"
        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title style={{textAlign: 'left'}}>
              主数据实体明细字段
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="ref-modal-body">
            <Table
              columns={header}
              data={body}
              parentNodeId='parent'
              height={43}
              headerHeight={42}
              dragborder={true}
              scroll={{y: 350 ,x:550}}
              rowClassName={(record,index,indent)=>{
                if (this.state.selectedRowIndex == index) {
                    return 'selected';
                } else {
                    return '';
                }
              }}
              onRowClick={this.rowclick}
              onRowDoubleClick={this.rowDoubleClick}
            />
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button shape="border" style={{ marginRight: 15 }} onClick={this.close}>
                取消
            </Button>
            <Button colors="primary" onClick={this.submit}>
                确认
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}

export default RefModal
