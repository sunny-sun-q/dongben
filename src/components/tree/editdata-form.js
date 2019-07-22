import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {
	Component
} from 'react';
import { Col, Row, FormControl, Label, Checkbox } from 'tinper-bee';

import Form from 'bee-form'

const FormItem = Form.FormItem;
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
  }
}) @observer
class EditDataForm extends Component {
	constructor(props) {
		super(props);
		// this.state = {
    //   showModal: false,
    // };

  }

	render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { modal } = this.props.treeStore
    const self = this;
    let initCode = '', initName = ''
    if (modal.nodeType === 'branchEdit') { // 点击树上面的编辑，修改主数据分类
      initCode = modal.nodeInfo.code
      initName = modal.nodeInfo.name
    }
		return (
      <div>
        <Row className="padding-bottom-40">
            <Col md={3} xs={3} sm={3} className="modal-l">
              <FormattedMessage id="js.com.tre2.0001" defaultMessage="上级分类" />
            </Col>
            <Col md={9} xs={9} sm={9} className="modal-r">
              {
                modal.nodeInfo.name
              }
            </Col>
        </Row>
        <Row>
          <Col md={3} xs={3} sm={3} className="modal-l">
            <div className='grayDeep'><FormattedMessage id="js.com.tre2.0002" defaultMessage="名称" /><span className="require-icon">*</span></div>
          </Col>
          <Col md={9} xs={9} sm={9} className="modal-r">
            <FormItem className='input-field'>
              <FormControl placeholder=''
                {...getFieldProps('name', {
                  validateTrigger: 'onBlur',
                  rules: [{
                    required: true, message: <FormattedMessage id="js.com.tre2.0003" defaultMessage="请输入名称" />
                  }],
                  initialValue: initName
              }) } />
              <span className='error'>
                  {getFieldError('name')}
              </span>
            </FormItem>
          </Col>
        </Row>
      </div>
		);
	}
}

export default EditDataForm
