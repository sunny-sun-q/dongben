import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {
	Component
} from 'react';
import { FormControl} from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import dragColumn from "tinper-bee/lib/dragColumn";;
const DragColumnTable = dragColumn(Table);
import {Button} from 'components/tinper-bee';
import Form from 'bee-form'
import Modal from 'bee-modal'
import './index.less'
import nodataImage from 'images/nodata.png'

import {
  withRouter
} from 'react-router-dom';


import {
  inject,
  observer
} from 'mobx-react';

import {
  createTab
} from 'utils'

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class EnumModal extends Component {
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
        return <div className={`enum-table-radio ${record._checked ? 'enum-table-radio-on' : ''}`} />
      }
    },{
      title: this.props.intl.formatMessage({id:"js.con.enu.0001", defaultMessage:"分类编码"}),
      dataIndex: "code",
      key: "code",
      width: 157,

    },
    {
      title: this.props.intl.formatMessage({id:"js.con.enu.0002", defaultMessage:"名称"}),
      dataIndex: "name",
      key: "name",
      width: 157,

    },
    {
      title:this.props.intl.formatMessage({id:"js.con.enu.0004", defaultMessage:"备注"}),
      dataIndex: "descri",
      key: "descri",
      width: 157,

    },
    ]
    this.innerColumns = [
      {
        title: this.props.intl.formatMessage({id:"js.con.enu.0001", defaultMessage:"分类编码"}),
        dataIndex: "category_code",
        key: "category_code",
        width: 130,

      },
      {
        title: this.props.intl.formatMessage({id:"js.con.enu.0005", defaultMessage:"编码"}),
        dataIndex: "code",
        key: "code",
        width: 130,

      },
      {
        title: this.props.intl.formatMessage({id:"js.con.enu.0002", defaultMessage:"名称"}),
        dataIndex: "name",
        key: "name",
        width: 130,

      },
      {
        title: this.props.intl.formatMessage({id:"js.con.enu.0004", defaultMessage:"备注"}),
        dataIndex: "descri",
        key: "descri",
        width: 130,

      },
    ]
  }

  close() {
    this.props.entityContentStore.setEnumModal(false)
  }

  submit(e) {
    let selectedRecord = {};
    for(let i = 0; i < this.props.entityContentStore.fieldref.enumData.length; i++){
      let nowEnum = this.props.entityContentStore.fieldref.enumData[i];
      if(nowEnum._checked){
        selectedRecord = nowEnum;
      }
    }
    if(!selectedRecord.name){
      this.close();
      return;
    }
    const { info } = this.props.treeStore.nodeLeaf
    const { tempNode } = this.props.entityContentStore.dataModal;
    let pk_mdentity_name = info.name || tempNode.name;
    let pk_gd = this.props.match.params.id;
    e.preventDefault();

    let pk_fieldref = '';
    let enum_4_entity_items = this.props.entityContentStore.table.configEntityItems.enum_4_entity_items;
    let operateIndex = this.props.entityContentStore.fieldref.operateIndex;
    if(enum_4_entity_items && operateIndex > -1){
      pk_fieldref = enum_4_entity_items &&  enum_4_entity_items[operateIndex] && enum_4_entity_items[operateIndex].pk_fieldref;
    }
    pk_fieldref = pk_fieldref || '';
    let obj = {
      pk_fieldref:pk_fieldref, //新增时为空，修改时从返回字段获取,右侧表中的字段
      pk_gd, // 树节点
      pk_mdentity:'', //
      pk_mdentity_name, //实体
      pk_entityitem:'',
      code:'',
      name:'',
      reftype:4,
      ref_pkgd: selectedRecord.pk_enumtype,
      ref_pkgd_name: selectedRecord.name,
      treeref_pkgd:'',
      treeref_pkgd_name:'',
      treeparentid:'',
      treeparentid_name:'',
      treelabelfield:'',
      treeref_foreignkey:'',
      treeref_foreignkey_name:'',
      treelabelfield_name:'',// 被参照字段的name
      treelabelfield:'', //被参照字段的pk_entityitem
      treelistlabelfield_name:'',
      treelistlabelfield:'',
      isRefSelf:''
    }
    this.props.entityContentStore.saveEnumdata(obj);
    this.close()
  }

  getData = async (expanded, record) => {
    if(expanded){
      let index = -1;
      let enumData = this.props.entityContentStore.fieldref.enumData;
      for(let i = 0; i < enumData.length; i++){
        if(record === enumData[i]){
          index = i;
          break;
        }
      }
      await this.props.entityContentStore.findEnumSubData(record.pk_enumtype, index)
      this.forceUpdate();
    }
  }

  expandedRowRender = (record, index, indent) => {
    let innerDatas = this.props.entityContentStore.fieldref.enumData[index].innerData;
    // console.log("innerDatas",innerDatas)
    let height = 300
    return (
      <Table
        columns={this.innerColumns}
        scroll={{ y: height }}
        data={innerDatas}
      />
    );
  };

  haveExpandIcon = (record, index) => {
    return false
  }

  setEnum = () =>{
    createTab({
      id: "mdm_enum_mng",
      router: "/iuapmdm_fr/data-integration/mdm-enum.html?modulefrom=sidebar",
      title: '枚举管理',
      title2: `Enum. Mgmt`,
      title3: `枚舉管理`,
      title4: ``,
      title5: ``,
      title6: ``,
    })
  }

  rowClick =(record,index,indent)=>{
    const { state } = this.props.treeStore.nodeLeaf.info;
    if(state === 1){

    }else{
      for(let i = 0; i < this.props.entityContentStore.fieldref.enumData.length; i++){
        this.props.entityContentStore.fieldref.enumData[i]._checked = false;
      }
      record._checked = true;
      this.forceUpdate();
    }
    
  }
	render() {
    const {
      isEnumModalShow,
      enumData,
    } = this.props.entityContentStore.fieldref;
    let size = enumData.length>0? '': '';
		return (
      <div>
        <Modal
          show={isEnumModalShow}
          onHide={this.close}
          // style={{width: 500}}
          className="enum-modal"
          size={size}
          backdropClosable={false}
        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title style={{textAlign: 'left'}}>
              <FormattedMessage id="js.con.enu.0008" defaultMessage="枚举" />
            </Modal.Title>
            {/* <FormControl
            className="create-modal-search"
            size="sm"
            type="search"
            onSearch={this.onSearch}
            onChange={this.onChange}
          /> */}
          </Modal.Header>
          <Modal.Body style={{
            height: '400px',
            overflow: 'auto'
          }}>
            {
              enumData.length > 0?<DragColumnTable
              columns={this.outColumns}
              data={enumData}
              onExpand={this.getData}
              expandedRowRender={this.expandedRowRender}
              scroll={{ x: true }}
              dragborder={true}
              draggable={true}
              onRowClick={this.rowClick}
              haveExpandIcon={this.haveExpandIcon}
            />:<div className="modal-no-data-div">
              <img src={nodataImage} alt=""/>
              <span><FormattedMessage id="js.con.enu.0009" defaultMessage="主数据管理中还没有枚举，赶紧去设置吧" /></span>
              <Button
              colors="primary"
              style={{
                top: '25px'
              }}
                onClick={this.setEnum}
              >
                {this.props.intl.formatMessage({id:"js.con.enu.0008", defaultMessage:"设置枚举"})}
              </Button>
            </div>
            }

          </Modal.Body>
          <Modal.Footer className="text-center">
          {
            enumData.length>0?
            <span class="modal-footer-span" onClick={this.setEnum}><FormattedMessage id="js.con.enu.0010" defaultMessage="管理枚举" /></span>: ''
          }
          {
            enumData.length>0?
            <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                <FormattedMessage id="js.con.enu.0011" defaultMessage="取消" />
            </Button>: ''
          }
          {
            enumData.length>0?
            <Button colors="primary" onClick={this.submit}>
            <FormattedMessage id="js.con.enu.0012" defaultMessage="确认" />
            </Button>: ''
          }
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}

export default injectIntl(Form.createForm()(EnumModal), {withRef: true});
