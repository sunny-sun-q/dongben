import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {
	Component
} from 'react';
import {  Col, Row, FormControl, Icon } from 'tinper-bee';
import Select from 'bee-select'
import {Button} from 'components/tinper-bee';
import Form from 'bee-form'

const FormItem = Form.FormItem;

import Modal from 'bee-modal'
import './index.less'

import {
  withRouter
} from 'react-router-dom';

import TreeModal from '../../components/tree-modal'
import TableModal from '../../components/table-modal'

import './index.less'

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
class SelectDownModal extends Component {
	constructor(props) {
		super(props);
    this.close = this.close.bind(this);
    this.cancel = this.cancel.bind(this);
    this.open = this.open.bind(this);
    this.submit = this.submit.bind(this);
    this.ShowRefTreeModal = this.ShowRefTreeModal.bind(this);
    this.ShowRefTableModal = this.ShowRefTableModal.bind(this);
    this.style = [
      {'text':'表形','value':1},
      {'text':'树形','value':2},
      {'text':'树表形','value':3}
    ]
  }

  close() {
    this.props.entityContentStore.setSelectDownModal(false)
  }
  cancel() {
    this.props.entityContentStore.setSelectDownModal(false)
    let combodata = this.props.entityContentStore.fieldref.combodata;
    let combodataBase = this.props.entityContentStore.fieldref.combodataBase;
    for(let key in combodataBase){
      combodata[key] = combodataBase[key]
    }
  }

  open() {
    this.props.entityContentStore.setSelectDownModal(true)
  }

  ShowRefTreeModal() {
    this.props.entityContentStore.setSelectDownModal(false, true)
  }

  /**
   * 表格下拉模态框
   * @param {*} name 标识字段名称
   */
  ShowRefTableModal(name) {
    this.props.entityContentStore.setTableModal(true, true, name)
    // fullclassname, type, pk_gd, ref_boolbean
    let fullclassname = 'com.yonyou.iuapmdm.modeling.mdmdesign.ref.MdmEntityFieldRefData'
    let type = 'grid'
    // pk_gd 取得是 table的行中的ref_pkgd
    // 因为接口只会返回一行数据，所以取第一条的ref_pkgd
    let pk_gd = this.props.entityContentStore.fieldref.combodata.ref_pkgd
    let ref_boolbean = false

    let { entity } = this.props.entityContentStore.table.mainTableInfo;
    let tempEntity = []
    const { activeTabs } = this.props.entityContentStore.tableStatus
    const { isRefSelf } = this.props.entityContentStore.fieldref.combodata;
    // 主表时，自参照，table选用默认的字符
    if (activeTabs === 'father' && isRefSelf === '1') {
      let flag
      entity.forEach((li) => {
        if (li.fieldtype != 7 && li.fieldtype != 8) {
          tempEntity.push(li)
        }
        if (li.pk_entityitem) {
          flag = true
        }
      })
      // 只有一开始查询没有一条数据的时候，才进行判断
      if (!flag) {
        if (tempEntity.length === 0) {
          Message.create({ content: this.props.intl.formatMessage({id:"js.con.sel.0004", defaultMessage:"请先新增一条字段名称"}), color: 'danger'})
          return
        }
        this.props.entityContentStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean, tempEntity )
        this.props.entityContentStore.setSelectDownModal(false, false, true)
        return
      }
    }

    this.props.entityContentStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean)
    this.props.entityContentStore.setSelectDownModal(false, false, true)

  }

  submit(e) {
    // const { name } = this.props.treeStore.nodeLeaf.info;
    const { tempNode } = this.props.entityContentStore.dataModal;
    let pk_mdentity_name = this.props.treeStore.nodeLeaf.info.name || tempNode.name;
    let pk_gd = this.props.match.params.id;
    e.preventDefault();
    const {
      pk_fieldref,
      pk_mdentity,
      // pk_mdentity_name,
      pk_entityitem,
      code,
      name,
      reftype,
      ref_pkgd,
      ref_pkgd_name,
      treeref_pkgd,
      treeref_pkgd_name,
      treeparentid,
      treeparentid_name,
      treelabelfield,
      treelabelfield_name,
      treelistlabelfield_name,
      treeref_foreignkey,
      treeref_foreignkey_name,
      treelistlabelfield,
      isRefSelf,
      searchId
    } = this.props.entityContentStore.fieldref.combodata;
    this.props.form.validateFields((err, values) => {
        if (err) {
            // console.log('校验失败', values);
        } else {
            // console.log('提交成功', values);
            let obj = {
              pk_fieldref, //新增时为空，修改时从返回字段获取
              pk_gd,
              pk_mdentity,
              pk_mdentity_name, //实体
              pk_entityitem,
              code,
              name,
              reftype:0,
              ref_pkgd,
              ref_pkgd_name,
              treeref_pkgd,
              treeref_pkgd_name,
              treeparentid,
              treeparentid_name,
              treelabelfield,
              treeref_foreignkey,
              treeref_foreignkey_name,
              treelabelfield_name,// 被参照字段的name
              treelabelfield, //被参照字段的pk_entityitem
              treelistlabelfield_name,
              treelistlabelfield,
              reftype: 0,
              isRefSelf,
              searchId
            }
            this.props.entityContentStore.saveCombodata(obj);
            this.close()

        }
    });
  }

	render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { modal } = this.props.treeStore
    const {
      combodata,
      combodata:{
        ref_pkgd_name,
        treelabelfield_name
      },
      ifSelectDownModalShow
    } = this.props.entityContentStore.fieldref;
    const { state } = this.props.treeStore.nodeLeaf.info;
		return (
      <div>
        <Modal
          show={ifSelectDownModalShow}
          onHide={this.cancel}
          style={{width: 500}}
          className="ref-modal"
          backdropClosable={false}
        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title style={{textAlign: 'left'}}>
              <FormattedMessage id="js.con.sel.0005" defaultMessage="设置下拉" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Row>
              <Col md={4} xs={4} sm={4} className="modal-l">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.sel.0006" defaultMessage="字段编码" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8} className="line-height-30-right">
                    <FormItem className='input-field'>
                      {
                        entityContentStore.fieldref.reference.code
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={4} xs={4} sm={4} className="modal-r">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.sel.0007" defaultMessage="字段名称" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8} className="line-height-30-right">
                    <FormItem className='input-field'>
                      {
                        entityContentStore.fieldref.reference.name
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={4} xs={4} sm={4} className="modal-r">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.sel.0008" defaultMessage="所属实体" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8} className="line-height-30-right">
                    <FormItem className='input-field'>
                      {
                        entityContentStore.fieldref.reference.pk_mdentity_name
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row> */}

            <Row>
              <Col md={12} xs={12} sm={12} className="modal-l">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.sel.0009" defaultMessage="参照主数据" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        // value={this.props.entityContentStore.fieldref.combodata.ref_pkgd_name}
                        disabled={state === 1}
                        {...getFieldProps('ref_pkgd_name', {
                          validateTrigger: 'onBlur',
                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.sel.0010", defaultMessage:"请输入参照主数据"})
                          }],
                          initialValue: this.props.entityContentStore.fieldref.combodata.ref_pkgd_name || '',
                          getValueProps: (value) =>{
                            return {
                              value: this.props.entityContentStore.fieldref.combodata.ref_pkgd_name
                            }
                          },
                        }) }
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={state !== 1?()=>this.ShowRefTreeModal("ref_pkgd"): null} />
                      <span className='error'>
                        {getFieldError('ref_pkgd_name')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={12} xs={12} sm={12} className="modal-r">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.sel.0011" defaultMessage="列表显示字段" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        // value={treelabelfield_name}
                        disabled={state === 1}
                        {...getFieldProps('treelabelfield_name', {
                          validateTrigger: 'onBlur',
                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.sel.0012", defaultMessage:"请输入列表显示字段"})
                          }],
                          initialValue: treelabelfield_name || '',
                          getValueProps: (value) =>{
                            return {
                              value: treelabelfield_name
                            }
                          },
                      }) }
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={state !== 1?()=>this.ShowRefTableModal("treelabelfield"):null} />
                      <span className='error'>
                        {getFieldError('treelabelfield_name')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button bordered style={{ marginRight: 20 }} onClick={this.cancel}>
                <FormattedMessage id="js.con.sel.0013" defaultMessage="取消" />
            </Button>
            <Button colors="primary" onClick={this.submit}>
                <FormattedMessage id="js.con.sel.0014" defaultMessage="确认" />
            </Button>
          </Modal.Footer>
        </Modal>
        <TreeModal currentNode={'selectDown'}/>
        <TableModal currentNode={'selectDown'}/>
      </div>
		);
	}
}

export default injectIntl(Form.createForm()(SelectDownModal), {withRef: true});
