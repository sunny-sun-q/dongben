import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {
	Component
} from 'react';
// import { Button } from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import {Button} from 'components/tinper-bee';
import Form from 'bee-form'
import Modal from 'bee-modal'
import './index.less'

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
class NCModal extends Component {
	constructor(props) {
		super(props);
    this.close = this.close.bind(this);
    this.submit = this.submit.bind(this);
    let self = this;
    this.outColumns = [{
      title: " ",
      dataIndex: "a",
      key: "a",
      width: 70,
      render(text, record, index) {
        return <div className={`nc-table-radio ${record._checked ? 'nc-table-radio-on' : ''}`} />
      }
    },{
      title: this.props.intl.formatMessage({id:"js.con.nc-.0001", defaultMessage:"编码"}),
      dataIndex: "fieldName",
      key: "fieldName",
      width: 150,
    },
    {
      title: this.props.intl.formatMessage({id:"js.con.nc-.0002", defaultMessage:"显示名称"}),
      dataIndex: "displayname",
      key: "displayname",
      width: 150,
    },
    {
      title: this.props.intl.formatMessage({id:"js.con.nc-.0003", defaultMessage:"数据类型"}),
      dataIndex: "fieldType",
      key: "fieldType",
      width: 188,
    },
    ]

  }

  close() {
    this.props.entityContentStore.setNCModal(false)
  }

  submit(e) {
    e.preventDefault();
    let selectedRecord = {};
    for(let i = 0; i < this.props.entityContentStore.fieldref.NCShowData.length; i++){
      let nowData = this.props.entityContentStore.fieldref.NCShowData[i];
      if(nowData._checked){
        selectedRecord = nowData;
      }
    }
    if(selectedRecord.fieldName){
      this.props.updateNC(selectedRecord)
      if(this.props.entityContentStore.fieldref.nowNCObj.fieldName){
        for(let i = 0; i < this.props.entityContentStore.fieldref.NCSelectedData.length; i++){
          let nowSelectedData = this.props.entityContentStore.fieldref.NCSelectedData[i];
          if(nowSelectedData.fieldName === this.props.entityContentStore.fieldref.nowNCObj.fieldName){
            this.props.entityContentStore.fieldref.NCSelectedData.splice(i,1)
          }
        }
      }
      this.props.entityContentStore.fieldref.NCSelectedData.push({
        fieldName:selectedRecord.fieldName,
        displayname:selectedRecord.displayname
      })
    }
    this.close()
  }


  rowClick =(record,index,indent)=>{
    for(let i = 0; i < this.props.entityContentStore.fieldref.NCShowData.length; i++){
      this.props.entityContentStore.fieldref.NCShowData[i]._checked = false;
    }
    record._checked = true;
    this.forceUpdate();
  }
	render() {
    const {
      isNCModalShow,
      NCShowData,
    } = this.props.entityContentStore.fieldref;
		return (
      <div>
        <Modal
          show={isNCModalShow}
          onHide={this.close}
          // style={{width: 500}}
          className="ref-modal lg"
          backdropClosable={false}
        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title style={{textAlign: 'left'}}>
              <FormattedMessage id="js.con.nc-.0004" defaultMessage="配置源编码" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table
              columns={this.outColumns}
              data={NCShowData}
              scroll={{ x: true ,y: 300}}
              dragborder={true}
              draggable={true}
              onRowClick={this.rowClick}
            />
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                <FormattedMessage id="js.con.nc-.0005" defaultMessage="取消" />
            </Button>
            <Button colors="primary" onClick={this.submit}>
                <FormattedMessage id="js.con.nc-.0006" defaultMessage="确认" />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}

export default injectIntl(Form.createForm()(NCModal), {withRef: true});
