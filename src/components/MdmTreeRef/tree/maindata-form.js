import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {
	Component
} from 'react';
import { Col, Row, FormControl, Label, Checkbox } from 'tinper-bee';
import Form from 'bee-form'
import MdmTreeRef from 'components/MdmTreeRef';

const FormItem = Form.FormItem;
import './index.less'

import {
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';
import { debug } from 'util';

import {getContextId} from 'utils';
const contextId = getContextId();

@withRouter
@inject((stores) => {
  return {
    treeRefTreeStore: stores.treeRefTreeStore,
  }
}) @observer
class AddMainDataForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
      isstatistics:false,
      isworkflow:false
    };
  }

  componentDidMount(){
    const { isstatistics,isworkflow } = this.props.treeRefTreeStore.nodeLeaf.tempNode;
    this.setState({
      isstatistics: isstatistics || false,
      isworkflow: isworkflow || false
    })
  }

  onRefChange = (value) => {
    // debugger
    this.props.treeRefTreeStore.setEditInfo(value)
    // modal.nodeInfo
  }

	render() {
    const self = this;
    const { getFieldProps, getFieldError } = this.props.form;
    const {
      modal,
      modal:{
        nodeType
      },
      nodeLeaf:{
        info:{state}
      },
      modal:{
        nodeInfo:{
          pid,id,parent_name,isparent
        }
      }
    } = this.props.treeRefTreeStore
    const { isstatistics, isworkflow } = this.state;
    let initCode = '', initName = '';
    let category_name;
    let isbranchAdd = modal.nodeType === 'branchAdd' ? true : false; //添加主数据
    let flag = modal.nodeType === 'leafEdit' ? true : false; // 修改主数据
    let isCategory = modal.nodeType === 'rootFolder' || modal.nodeType === 'branchFolder' || modal.nodeType === 'branchEdit' ;
    if (modal.nodeType === 'branchEdit' || modal.nodeType === 'leafEdit') { // 点击树上面的编辑，修改主数据分类
      initCode = modal.nodeInfo.code
      initName = modal.nodeInfo.name
    }
    // debugger
    if( pid === "0" || id === "0" ){ //主数据和一级分类
      category_name = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
      if(modal.nodeType !== "branchEdit" && !flag){  //添加
        category_name = modal.nodeInfo.name
      }
    }else{
      console.log('modal.editInfo.treeref_pkgd_name', modal.editInfo.treeref_pkgd_name)
      modal.editInfo.treeref_pkgd_name ? category_name = modal.editInfo.treeref_pkgd_name : category_name = modal.nodeInfo.parent_name; //其他分类和叶子节点
      if(modal.nodeType !== "branchEdit" && !flag){ //添加
        category_name = modal.nodeInfo.name
      }
    }
    console.log('===---===', state)
    let checkboxDisplay = contextId === 'mdm'? 'block' : 'none';
		return (
      <div>
        <Row className="maindata-form-row">
          <Col md={12} xs={12} sm={12} className="modal-r">
            <MdmTreeRef
              disabled={ !isbranchAdd && (id === '0' || state === 1) ? true : false }
              defaultValue={category_name}
              label={<FormattedMessage id="js.com.tre5.0002" defaultMessage="上级分类" />}
              fieldId="treeref_pkgd"
              fieldName="treeref_pkgd_name"
              url="/modeling/category/cat-tree"
              onChange={this.onRefChange}
            />
          </Col>
        </Row>
        <Row className="maindata-form-row">
          <Col md={3} xs={3} sm={3} className="modal-l">
            <div className='grayDeep'><FormattedMessage id="js.com.tre5.0003" defaultMessage="编码" /><span className="require-icon">*</span></div>
          </Col>
          <Col md={9} xs={9} sm={9} className="modal-r">
            <FormItem className='input-field'>
              <FormControl placeholder=''
                disabled={flag && (state === 1 || state === 2) ? true:false}
                {...getFieldProps('code', {
                  validateTrigger: 'onBlur',
                  rules: [{
                    required: true, message: <FormattedMessage id="js.com.tre5.0004" defaultMessage="请输入编码" />
                  },{
                    pattern:  /^[a-zA-Z]\w*$/ , message: '编码只能以字母开头，可以由字母数字下划线组成',
                  },{
                    max: 20, message: <FormattedMessage id="js.com.tre5.0005" defaultMessage="长度最长为20" />
                  }],
                  initialValue: initCode
              }) } />
              <span className='error'>
                {getFieldError('code')}
              </span>
            </FormItem>
          </Col>
        </Row>

        <Row className="maindata-form-row">
          <Col md={3} xs={3} sm={3} className="modal-l">
            <div className='grayDeep'><FormattedMessage id="js.com.tre5.0006" defaultMessage="名称" /><span className="require-icon">*</span></div>
          </Col>
          <Col md={9} xs={9} sm={9} className="modal-r">
            <FormItem className='input-field'>
              <FormControl placeholder=''
                disabled={ flag && state === 1? true:false}
                {...getFieldProps('name', {
                  validateTrigger: 'onBlur',
                  rules: [{
                    required: true, message: <FormattedMessage id="js.com.tre5.0007" defaultMessage="请输入名称" />
                  }],
                  initialValue: initName,
              }) } />
              <span className='error'>
                  {getFieldError('name')}
              </span>
            </FormItem>
          </Col>
        </Row>
        {
          nodeType === 'branchAdd' || nodeType === 'leafEdit' ? (
            <Row className="checkbox-row" style={{
              'display': checkboxDisplay
              }
              }>
              <Col lg={6} md={6} xs={6} className="text-center">
                  <FormItem>
                      {/* <Label>{<FormattedMessage id="js.com.tre5.0010" defaultMessage="<FormattedMessage id="js.com.tre5.0008" defaultMessage="启用统计" />：" />}</Label> */}
                      <Checkbox
                        colors="primary"
                        disabled={ flag && state === 1? true:false}
                        checked={isstatistics}
                        {
                          ...getFieldProps('isstatistics', {
                            getValueProps: (value) =>{
                              return {
                                value: isstatistics
                              }
                            },
                            initialValue: isstatistics || '',
                            onChange(value) {
                              self.setState({ isstatistics: value });
                            },
                          })
                        }
                      >
                      <FormattedMessage id="js.com.tre5.0008" defaultMessage="启用统计" />
                      </Checkbox>
                  </FormItem>
              </Col>
              <Col lg={6} md={6} xs={6}>
                  <FormItem>
                      {/* <Label>启用流程特性：</Label> */}
                      <Checkbox
                        colors="primary"
                        disabled={ flag && state === 1? true:false}
                        checked={isworkflow}
                        {
                          ...getFieldProps('isworkflow', {
                            initialValue: isworkflow,
                            getValueProps: (value) =>{
                              return {
                                value: isworkflow
                              }
                            },
                            onChange(value) {
                              self.setState({ isworkflow: value });
                            },
                          })
                        }

                      ><FormattedMessage id="js.com.tre5.0009" defaultMessage="启用流程特性" /></Checkbox>
                  </FormItem>
              </Col>
              {/* <Col lg={4} md={4} xs={4}>
                  <FormItem>
                      <Label>{<FormattedMessage id="js.com.tre5.0010" defaultMessage="<FormattedMessage id="js.com.tre5.0008" defaultMessage="启用统计" />：" />}</Label>
                      <Checkbox colors="primary"></Checkbox>
                  </FormItem>
              </Col> */}
            </Row>
          ) : null
        }
      </div>
		);
	}
}

export default injectIntl(AddMainDataForm, {withRef: true});
