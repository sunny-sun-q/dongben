import React, {
	Component
} from 'react';
import { FormControl} from 'tinper-bee';
import Modal from 'bee-modal'
import { FormattedMessage,  injectIntl } from 'react-intl';
import {Button} from 'components/tinper-bee';
import FormList from 'components/FormList';
const FormItem = FormList.Item;

import './index.less'

import {
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

import {getContextId} from 'utils';
const contextId = getContextId();

@withRouter
@inject((stores) => {
  return {
    entityContentStore: stores.entityContentStore
  }
}) @observer
class OperModelForm extends Component {
	constructor(props) {
		super(props);
      this.close = this.close.bind(this);
    }
    close() {
        this.props.entityContentStore.setCheckModal(false)
    }


    submit = (e) => {
      e.preventDefault();
      this.props.form.validateFields(async(err, values) => {
          if (err) {
              console.log('校验失败', values);
          } else {
            console.log(values)
            let params = {
              pk_validateclass: this.props.entityContentStore.checkModal.checkInfo.pk_validateclass,
              pk_gd:this.props.entityContentStore.checkModal.checkInfo.pk_gd,
              name:values.name,
              classPath:values.classPath
            }
            await this.props.entityContentStore.saveCheckModal(params);
              // console.log('提交成功', values);
          }
      })
    }

	render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { checkModal } = this.props.entityContentStore
        let initClassPath = '', initName = '', initUrl='';
        initClassPath =  checkModal.checkInfo.classPath || '';
        initName =  checkModal.checkInfo.name || '';
        initUrl = checkModal.checkInfo.url||'';
        return (
            <div>
                <Modal
                show={checkModal.showModal}
                onHide={this.close}
                style={{width: 600}}
                className="tree-modal"
                backdropClosable={false}
                >
                <Modal.Header className="text-center" closeButton>
                    <Modal.Title>
                      操作
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <FormList size="lg">
                <FormItem label={'名称:'} required>
                  <FormControl
                    {...getFieldProps('name', {
                        validateTrigger: 'onBlur',
                        initialValue: initName,
                        rules: [{
                          required: true, message: '请输入名称'
                        }]
                    }) }
                />
                <span className='error'>
                    {getFieldError('name')}
                </span>
                  </FormItem>
                  <FormItem label={'校验类:'} required>
                  <FormControl
                    {...getFieldProps('classPath', {
                        validateTrigger: 'onBlur',
                        initialValue: initClassPath,
                        rules: [{
                          required: true, message: '请输入校验类'
                        }]

                    }) }
                />
                <span className='error'>
                    {getFieldError('classPath')}
                </span>
                  </FormItem>
                  <FormItem label="" >
                    <a href="/iuapmdm_fr/assets/files/example-validateclass.docx">{'示例文档'}</a>
                  </FormItem>
                  </FormList>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                        <FormattedMessage id="js.rou.cus1.0008" defaultMessage="取消" />
                    </Button>
                    <Button colors="primary" onClick={this.submit}>
                        <FormattedMessage id="js.rou.cus1.0015" defaultMessage="确认" />
                    </Button>
                </Modal.Footer>
                </Modal>
        </div>
        );
	}
}

export default injectIntl(FormList.createForm()(OperModelForm), {withRef: true});
