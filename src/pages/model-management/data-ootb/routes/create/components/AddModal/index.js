import React, { Component } from 'react'
import { FormControl, InputNumber, Label, Row, Col, Switch, Icon } from 'tinper-bee'
import Select from "bee-select"
const Option = Select.Option;
import Modal from 'bee-modal'
import Form from 'bee-form'
const FormItem = Form.FormItem;
import {Button} from 'components/tinper-bee';

import './index.less'

const FormErr = ({errMsg}) => {
  if (errMsg) {
    return (
      <p className="form-err">
        <Icon type="uf-exc-c-2"/>
        <span>{errMsg}</span>
      </p>
    )
  } else {
    return null
  }

}

class AddModal extends Component{
  constructor(props) {
    super(props);
  }


  onSubmit = () => {
    const {
      form: {validateFields},
      onConfirm,
    } = this.props;
    validateFields((err, values) => {
      !err && onConfirm(values)
    })
  }



  render() {
    const {
      form: {
        getFieldProps,
        getFieldError,
      },
      info,
      onCancel
    } = this.props;
    const hasInfo = !!info;
    return (
      <Modal
        enforceFocus={false}
        className="pop_dialog"
        size="lg"
        show={hasInfo}
        onHide={onCancel}
        backdropClosable={false}
      >

        <Modal.Header closeButton={true}>
          <Modal.Title>
            新增预置分类
          </Modal.Title>
        </Modal.Header>

        <Modal.Body  className="pop_body">
          <Form>
            <Row>
              <Col md={12}>
                <FormItem className="ootb-form-item">
                  <Label>上级分类</Label>
                  <div className="item-content">
                    <p >{hasInfo ? info.name : ''}</p>
                  </div>
                  <FormErr errMsg={getFieldError('conn_addr')}/>
                </FormItem>
              </Col>



              <Col md={9}>
                <FormItem className="ootb-form-item">
                  <Label className="required">名称</Label>
                  <div className="item-content">
                    <FormControl
                      {...getFieldProps('name', {
                        initialValue: "",
                        rules: [{
                          required: true, message: '请填写名称',
                        }],
                      })}
                    />
                  </div>
                  <FormErr errMsg={getFieldError('name')}/>
                </FormItem>
              </Col>
              <Col md={3}/>

            </Row>



          </Form>
        </Modal.Body>

        <Modal.Footer className="pop_footer">
          <Button
            bordered
            onClick={onCancel}
          >取消</Button>
          <Button
            colors="primary"
            onClick={this.onSubmit}
          >确定</Button>
        </Modal.Footer>
      </Modal>
    )
  }

}
export default Form.createForm()(AddModal)
