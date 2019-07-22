import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {
	Component
} from 'react';
import {  Col, Row, FormControl, Icon, Message } from 'tinper-bee';
import Select from 'bee-select'
import {Button} from 'components/tinper-bee';
import Form from 'bee-form'

import Modal from 'bee-modal'

const FormItem = Form.FormItem;
const Option = Select.Option;
import './index.less'

import {
  withRouter
} from 'react-router-dom';

import TreeModal from '../../components/tree-modal/index'
import TableModal from '../../components/table-modal/index'
import MdmTreeRef from 'components/MdmTreeRef';

import {
  inject,
  observer
} from 'mobx-react';
import { debug } from 'util';

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore,
  }
}) @observer
class FieldtypeModal extends Component {
	constructor(props) {
    super(props);
    this.state = {
      title:'',
      isRest: false // 是否重制参照中的table数据
    }
    this.close = this.close.bind(this);
    this.cancel = this.cancel.bind(this);
    this.submit = this.submit.bind(this);
    this.ShowRefTreeModal = this.ShowRefTreeModal.bind(this);
    this.ShowRefTableModal = this.ShowRefTableModal.bind(this);
    this.style = [
      {'text':'表形','value':"1"},
      {'text':'树形','value':"2"},
      {'text':'树表形','value':"3"}
    ]
  }

  close() {
    this.props.entityContentStore.setRefModal(false)
  }

  cancel() {
    this.props.entityContentStore.setRefModal(false)
    let reference = this.props.entityContentStore.fieldref.reference;
    let referenceBase = this.props.entityContentStore.fieldref.referenceBase;
    for(let key in referenceBase){
      reference[key] = referenceBase[key]
    }

    let reference2 = this.props.entityContentStore.fieldref.reference2;
    let reference2Base = this.props.entityContentStore.fieldref.reference2Base;
    for(let key in reference2Base){
      reference2[key] = reference2Base[key]
    }

  }

  /**
   * 树参照模态框
   * @param {*} name 标识字段名称
   */
  ShowRefTreeModal(name) {
    this.props.entityContentStore.setRefModal(false, true, false, name)
    switch(name){
      case 'ref_pkgd':
        this.setState({
          title:this.props.intl.formatMessage({id:"js.con.fie.0004", defaultMessage:"参照主数据"})
        });
        break;
      case 'treeref_pkgd':
        this.setState({
          title:this.props.intl.formatMessage({id:"js.con.fie.0005", defaultMessage:"树主数据"})
        });
        break;
      default:
        break;
    }
  }

  /**
   * 表格参照模态框
   * @param {*} name 标识字段名称
   */
  ShowRefTableModal(name) {
    const { reftype,ref_pkgd,treeref_pkgd } = this.props.entityContentStore.fieldref.reference;
    let refType = Number(reftype);//1：表形 2：树形 3：树表形
    this.props.entityContentStore.setTableModal(false, true, name)
    // fullclassname, type, pk_gd, ref_boolbean
    let fullclassname = 'com.yonyou.iuapmdm.modeling.mdmdesign.ref.MdmEntityFieldRefData'
    let type = 'grid'
    let pk_gd, ref_boolbean, isTreelistlabelfield, isTreelabelfield,isTreeListForeignkeyField;
    // pk_gd 取得是 table的行中的ref_pkgd
    // 因为接口只会返回一行数据，所以取第一条的ref_pkgd
    switch(name){
      case 'treelistlabelfield': //列表显示字段
        pk_gd = ref_pkgd
        ref_boolbean = false
        this.setState({
          title:this.props.intl.formatMessage({id:"js.con.fie.0006", defaultMessage:"列表显示字段"})
        });
        isTreelistlabelfield = true
        break;
      case 'treeparentid': //树父ID
        pk_gd = refType === 3 ? treeref_pkgd:ref_pkgd
        ref_boolbean = true
        type = 'tree' //树父id，查询的参照必须是自参照类型，type作为标识
        this.setState({
          title:this.props.intl.formatMessage({id:"js.con.fie.0007", defaultMessage:"树父ID"})
        });
        break;
      case 'treelabelfield': //树节点显示字段
        pk_gd = refType === 3 ? treeref_pkgd:ref_pkgd
        ref_boolbean = false
        this.setState({
          title:this.props.intl.formatMessage({id:"js.con.fie.0008", defaultMessage:"树节点显示字段"})
        });
        isTreelabelfield = true
        break;
      case 'treeref_foreignkey': //外键字段
        pk_gd = ref_pkgd
        ref_boolbean = true
        isTreeListForeignkeyField = true;
        this.setState({
          title:this.props.intl.formatMessage({id:"js.con.fie.0009", defaultMessage:"外键字段"})
        });
        break;
      default:
        break;
    }


    let { entity } = this.props.entityContentStore.table.mainTableInfo;
    let tempEntity = []
    const { activeTabs } = this.props.entityContentStore.tableStatus
    const { isRefSelf } = this.props.entityContentStore.fieldref.reference;
    // 主表时，自参照，table选用默认的字符, 并且是 树表型列表显示字段需要， 树型时
    if (activeTabs === 'father' && isRefSelf === '1') {
      if(refType === 3 && isTreeListForeignkeyField){
        entity.forEach((li) => {
          if (parseInt(li.fieldtype) == 7 ) {
            tempEntity.push(li)
          }
        })
        if (true) {
          if (tempEntity.length === 0) {
            Message.create({ content: this.props.intl.formatMessage({id:"js.con.fie.0010", defaultMessage:"请先新增一条字段名称"}), color: 'danger'})
            this.props.entityContentStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean, tempEntity )
            return
          }
          this.props.entityContentStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean, tempEntity )
          return
        }
      }
      if ((refType === 1 || refType === 3 && isTreelistlabelfield) || (refType === 2 && isTreelabelfield) ) {
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
        // 不管什么情况的选择当前的
        if (true) {
          if (tempEntity.length === 0) {
            Message.create({ content: this.props.intl.formatMessage({id:"js.con.fie.0010", defaultMessage:"请先新增一条字段名称"}), color: 'danger'})
            this.props.entityContentStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean, tempEntity )
            return
          }
          this.props.entityContentStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean, tempEntity )
          return
        }
      }
    }
    // const this.props.entityContentStore.mainTableInfo
    this.props.entityContentStore.getEntityValue(fullclassname, type, pk_gd, ref_boolbean )
  }

  HandRefPkgbChange = (value) => {
    let reference = this.props.entityContentStore.fieldref.reference
    // 如果是树形，参照自身，需要设置树父ID 不可编辑
    let { id } = this.props.match.params
    if (reference.ref_pkgd === id) {
      reference.isRefSelf = '1'
    } else {
      reference.isRefSelf = ''
    }
    this.props.entityContentStore.resetRefMsg(reference)
  }

  handleChange = (value) => {
    let reference = this.props.entityContentStore.fieldref.reference
    reference = Object.assign(reference, {
      reftype: Number(value)
    })

    // 如果是树形，参照自身，需要设置树父ID 不可编辑
    let { id } = this.props.match.params
    const { activeTabs } = this.props.entityContentStore.tableStatus

    if (reference.ref_pkgd === id && activeTabs === 'father') {
      reference.isRefSelf = '1';
    } else {
      reference.isRefSelf = ''
    }
    this.props.entityContentStore.resetRefMsg(reference)
  }

  submit(e) {
    e.preventDefault();
    const { info } = this.props.treeStore.nodeLeaf
    const { tempNode } = this.props.entityContentStore.dataModal;
    let pk_mdentity_name = info.name || tempNode.name;
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
      treeref_foreignkey_code,
      treeref_foreignkey_name,
      treelistlabelfield,
      isRefSelf,
      searchId
    } = this.props.entityContentStore.fieldref.reference;
    let pk_gd = this.props.match.params.id;
    this.props.form.validateFields((err, values) => {
        if (err) {
            // console.log('校验失败', values);
        } else {
            // console.log('校验成功', values);
            let obj = {
              pk_fieldref, //新增时为空，修改时从返回字段获取
              pk_gd,
              pk_mdentity,
              pk_mdentity_name, //实体
              pk_entityitem,
              code,
              name,
              reftype, //参照显示风格
              ref_pkgd,
              ref_pkgd_name,
              treeref_pkgd,
              treeref_pkgd_name,
              treeparentid,
              treeparentid_name,
              treelabelfield,
              treelabelfield_name,
              treeref_foreignkey,
              treeref_foreignkey_code,
              treeref_foreignkey_name,
              treelistlabelfield_name,//被参照字段的name
              treelistlabelfield,//被参照字段的pk_entityitem
              isRefSelf,
              searchId
            }

              switch(Number(obj.reftype)){
                case 1: //表型
                  obj = Object.assign(obj,{
                    treeparentid:'',
                    treeparentid_name:'',
                    treelabelfield:'',
                    treelabelfield_name:'',
                    treeref_foreignkey:'',
                    treeref_foreignkey_name:'',
                    treeref_pkgd_name: '',
                    treeref_pkgd: '',
                  });
                  break;
                case 2: //树型
                  obj = Object.assign(obj,{
                    treelistlabelfield_name:'',
                    treelistlabelfield:'',
                    treeref_foreignkey:'',
                    treeref_foreignkey_name:'',
                    treeref_pkgd_name: '',
                    treeref_pkgd: ''
                  });
                  break;
                default:
                  break;
              }

              // this.props.entityContentStore.resetRefMsg(obj)

            this.close();
            this.setState({
              selectedRowIndex: -1
            });
            // let flag = this.ifRefBlank(obj);
            // if(!flag){ return }
            this.props.entityContentStore.saveReference(obj,reftype);
            this.close()
        }
    });

  }

	render() {
    const self = this;
    const { getFieldProps, getFieldError } = this.props.form;
    let id = this.props.match.params.id;
    const { modal } = this.props.treeStore
    const { ifModalShow, formName } = this.props.entityContentStore.fieldref;
    const {
      reftype,
      ref_pkgd_name,
      treelistlabelfield_name,
      treeref_pkgd_name,
      treeparentid_name,
      treelabelfield_name,
      treeref_foreignkey_name,
      isRefSelf,
      ref_pkgd,
      treeref_pkgd
    } = this.props.entityContentStore.fieldref.reference;

    // 参照主数据
    // ref_pkgd
    // 树主数据 treeref_pkgd
    let filterId = '';

    // 只有在 树主ID，数表型，tree上不显示自己
    if (Number(reftype) === 3) {
      if (this.state.title === this.props.intl.formatMessage({id:"js.con.fie.0004", defaultMessage:"参照主数据"})) {
        filterId = treeref_pkgd
      } else if (this.state.title === this.props.intl.formatMessage({id:"js.con.fie.0005", defaultMessage:"树主数据"})) {
        filterId = ref_pkgd
      }
    }
    const { state } = this.props.treeStore.nodeLeaf.info;
		return (
      <div>
        <Modal
          show={ifModalShow}
          onHide={this.cancel}
          style={{width: 700}}
          className="ref-modal"
          backdropClosable={false}
        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title style={{textAlign: 'left'}}>
              <FormattedMessage id="js.con.fie.0011" defaultMessage="设置参照" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Row>
              <Col md={4} xs={4} sm={4} className="modal-l">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0012" defaultMessage="字段编码" /></div>
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
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0013" defaultMessage="字段名称" /></div>
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
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0014" defaultMessage="所属实体" /></div>
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
              <Col md={6} xs={6} sm={6} className="modal-l">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0015" defaultMessage="参照主数据" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        disabled={state === 1}
                        // value={ref_pkgd_name || ''}
                        {...getFieldProps('ref_pkgd_name', {
                          // validateTrigger: 'onBlur',
                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.fie.0016", defaultMessage:"请选择参照主数据"})
                          }],
                          initialValue: ref_pkgd_name || '',
                          onChange: this.HandRefPkgbChange,
                          getValueProps: (value) =>{
                            return {
                              value: ref_pkgd_name
                            }
                          },
                        }) }
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={state !== 1?() => this.ShowRefTreeModal('ref_pkgd'): null} />
                      <span className='error'>
                        {getFieldError('ref_pkgd_name')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={6} xs={6} sm={6} className="modal-r">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0017" defaultMessage="参照显示风格" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <Select
                      disabled={state === 1}
                        // defaultValue={String(reftype) || ''}
                        // style={{ width: 100, marginRight: 6 }}
                        autofocus
                        // onChange={this.handleChange}
                        {...getFieldProps('reftype', {
                          // validateTrigger: 'onBlur',
                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.fie.0018", defaultMessage:"请选择参照显示风格"})
                          }],
                          initialValue: String(reftype) || '',
                          onChange: this.handleChange,
                          getValueProps: (value) =>{
                            return {
                              value: String(reftype)
                            }
                          },
                        }) }
                      >
                        {
                          this.style.map(item => (
                            <Option value={item.value} key={item.value}>
                              {item.text}
                            </Option>
                          ))
                        }
                      </Select>
                      <span className='error'>
                        {getFieldError('reftype')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={6} xs={6} sm={6} className="modal-r">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0019" defaultMessage="列表显示字段" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        // value={ treelistlabelfield_name || '' }
                        disabled={state === 1 || !(Number(reftype) === 1 || Number(reftype) === 3)}
                        {...getFieldProps('treelistlabelfield_name', {
                          // validateTrigger: 'onBlur',
                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.fie.0020", defaultMessage:"请选择列表显示字段"})
                          }],
                          hidden: !(Number(reftype) === 1 || Number(reftype) === 3),
                          getValueProps: (value) =>{
                            return {
                              value: treelistlabelfield_name
                            }
                          },
                          initialValue: treelistlabelfield_name || ''
                        }) }
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={!(state === 1 || !(Number(reftype) === 1 || Number(reftype) === 3)) ? ()=>this.ShowRefTableModal("treelistlabelfield") : null} />
                      <span className='error'>
                        {getFieldError('treelistlabelfield_name')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6} xs={6} sm={6} className="modal-l">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0021" defaultMessage="树主数据" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        // value={ treeref_pkgd_name || '' }
                        disabled={state === 1 || !(Number(reftype) === 3)}
                        {...getFieldProps('treeref_pkgd_name', {
                          // validateTrigger: 'onBlur',
                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.fie.0022", defaultMessage:"请选择树主数据"})
                          }],
                          hidden: !(Number(reftype) === 3),
                          getValueProps: (value) =>{
                            return {
                              value: treeref_pkgd_name
                            }
                          },
                          initialValue: treeref_pkgd_name || ''
                        }) }
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={!(state === 1 || !(Number(reftype) === 3)) ? () => this.ShowRefTreeModal('treeref_pkgd') : null} />
                      <span className='error'>
                        {getFieldError('treeref_pkgd_name')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={6} xs={6} sm={6} className="modal-r">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0023" defaultMessage="树父ID" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        // value={ treeparentid_name || '' }
                        disabled={state === 1 || (!(Number(reftype) === 2 || Number(reftype) === 3) || (Number(reftype) === 2 && isRefSelf === '1'))}
                        {...getFieldProps('treeparentid_name', {
                          // validateTrigger: 'onBlur',
                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.fie.0024", defaultMessage:"请选择树父ID"})
                          }],
                          hidden: !(Number(reftype) === 2 || Number(reftype) === 3) || (Number(reftype) === 2 && isRefSelf === '1'),
                          getValueProps: (value) => {
                            return {
                              value: treeparentid_name
                            }
                          },
                          initialValue: treeparentid_name || ''
                        }) }
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={!(state === 1 || (!(Number(reftype) === 2 || Number(reftype) === 3) || (Number(reftype) === 2 && isRefSelf === '1'))) ? ()=>this.ShowRefTableModal("treeparentid") : null} />
                      <span className='error'>
                        {getFieldError('treeparentid_name')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={6} xs={6} sm={6} className="modal-r">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0025" defaultMessage="树节点显示字段" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        // value={ treelabelfield_name || ''}
                        disabled={state === 1 || !(Number(reftype) === 2 || Number(reftype) === 3)}
                        {...getFieldProps('treelabelfield_name', {
                          // validateTrigger: 'onBlur',

                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.fie.0026", defaultMessage:"请选择树节点显示字段"})
                          }],
                          hidden: !(Number(reftype) === 2 || Number(reftype) === 3),
                          getValueProps: (value) =>{
                            return {
                              value: treelabelfield_name
                            }
                          },
                          initialValue: treelabelfield_name || ''
                        }) }
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={!(state === 1 || !(Number(reftype) === 2 || Number(reftype) === 3))? ()=>this.ShowRefTableModal("treelabelfield") : null} />
                      <span className='error'>
                        {getFieldError('treelabelfield_name')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={6} xs={6} sm={6} className="modal-l">
                <Row>
                  <Col md={4} xs={4} sm={4} className="line-height-30">
                    <div className='grayDeep'><FormattedMessage id="js.con.fie.0027" defaultMessage="外键字段" /></div>
                  </Col>
                  <Col md={8} xs={8} sm={8}>
                    <FormItem className='input-field ref-tree-input'>
                      <FormControl placeholder=''
                        disabled={state === 1 || !(Number(reftype) === 3)}
                        {...getFieldProps('treeref_foreignkey_name', {
                          validateTrigger: 'onBlur',
                          hidden: !(Number(reftype) === 3),
                          rules: [{
                            required: true, message: this.props.intl.formatMessage({id:"js.con.fie.0028", defaultMessage:"请选择外键字段"})
                          }],

                          getValueProps: (value) =>{
                            return {
                              value: treeref_foreignkey_name
                            }
                          },
                          initialValue: treeref_foreignkey_name || ''
                        }) }
                      />
                      <Icon type="uf-symlist ref-icon-btn" onClick={!(state === 1 || !(Number(reftype) === 3)) ? ()=>this.ShowRefTableModal("treeref_foreignkey") : null } />
                      <span className='error'>
                        {getFieldError('treeref_foreignkey_name')}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* <Row>
              <Col md={8} xs={8} sm={8} className="modal-r">

              </Col>
            </Row> */}
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button bordered style={{ marginRight: 20 }} onClick={this.cancel}>
                <FormattedMessage id="js.con.fie.0029" defaultMessage="取消" />
            </Button>
            <Button colors="primary" onClick={this.submit}>
                <FormattedMessage id="js.con.fie.0030" defaultMessage="确认" />
            </Button>
          </Modal.Footer>
        </Modal>
        <TreeModal currentNode={'ref'} filterById={{filterId}} title={this.state.title}/>
        <TableModal currentNode={'ref'} ifReset={this.props.entityContentStore.ifReset} title={this.state.title}/>
      </div>
		);
	}
}

export default injectIntl(Form.createForm()(FieldtypeModal), {withRef: true});
