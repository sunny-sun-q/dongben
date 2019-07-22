import React, { Component } from 'react'
import { FormControl, InputNumber, Label, Row, Col,  Switch, Icon } from 'tinper-bee'
import Select from "bee-select"
const Option = Select.Option;
import Modal from 'bee-modal'
import Form from 'bee-form'
const FormItem = Form.FormItem;
import {Button} from 'components/tinper-bee';
import { getCookie } from 'utils'

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

const testMsg = {
  'testing': '测试连接中',
  'success': '测试连接成功',
  'fail': '测试连接失败'
}

class AddModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      onUse: false
    }
  }

  changeOnUseState = (checked) => {
    this.setState({onUse: checked})
  }

  onSubmit = (type) => {

    const {
      form: {validateFields},
      onConfirm,
      onTest,
      confInfo
    } = this.props;
    validateFields((err, values) => {
      if (err) {

      } else {
        if (type === 'test') {
          onTest(values)
        } else if (type === "save") {
          if (confInfo) {
            values = {
              ...confInfo,
              ...values
            }
          }
          onConfirm(values)
        }
      }
    })
  }

  initVal = (key, defVal="") => {
    const { confInfo } = this.props;
    return (
      !confInfo ? defVal : confInfo[key]
    )
  }
  selectOptions = async() => {
    let {confInfo,homeStore} =this.props;
    let obj = {
      "conn_addr":this.props.form.getFieldValue('conn_addr')||'',
      "conn_port": this.props.form.getFieldValue('conn_port')||''
    }
    await homeStore.addAccountList(obj);

  }
  portChange = (val) => {
      this.props.form.setFieldsValue({
        conn_port: val,
        accountCode: ''
      });
  }
  addrChange = (val) => {
    this.props.form.setFieldsValue({
      conn_addr: val,
      accountCode: ''
    });
  }



  render() {
    const {
      form: {
        getFieldProps,
        getFieldError,
        getFieldValue
      },
      show,
      onCancel,
      testStatus,
      confInfo,
      addModalAccountList
    } = this.props;
    const { onUse } = this.state;

    const
      connAddr = getFieldValue("conn_addr"),
      connPort = getFieldValue("conn_port");

    return (
      <Modal
        enforceFocus={false}
        className="pop_dialog"
        size="lg"
        show={show}
        onHide={onCancel}
      >

        {testStatus !== 'start' ? (
          <div className={`ootb-connect-toast ${testStatus}`}>
            <Icon type="uf-correct-2"/>
            <span>{testMsg[testStatus]}</span>
          </div>
        ) : null}

        <Modal.Header closeButton={true}>
          <Modal.Title>
            {confInfo ? '编辑' : '新增'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body  className="pop_body">
          <Form>
            <Row>
              <Col md={12}>
                <FormItem className="ootb-form-item">
                  <Label className="required">选择数据源</Label>
                  <Select
                    {...getFieldProps('obVersion', {
                      initialValue: this.initVal('obVersion','nc65'),
                      rules: [{
                        required: true,
                      }],
                    })}
                  >
                    <Option value="nc65">nc65</Option>
                    <Option value="ncc">ncc</Option>
                  </Select>

                </FormItem>
              </Col>

              <Col md={6}>
                <FormItem className="ootb-form-item">
                  <Label className="required">连接地址</Label>
                  <div className="item-content">
                    <FormControl
                      {...getFieldProps('conn_addr', {
                        initialValue: this.initVal(
                          'conn_addr',
                          // '172.20.56.43'
                          ''
                        ),
                        validateTrigger: 'onBlur',
                        rules: [{
                          required: true,
                          message: '请填写连接地址',
                        }, {
                          pattern: /^(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}$/,
                          message: '请填写正确的连接地址',

                        }],
                      })}
                      onChange={this.addrChange}
                    />
                  </div>
                  <FormErr errMsg={getFieldError('conn_addr')}/>
                </FormItem>
              </Col>


              <Col md={6}>
                <FormItem className="ootb-form-item">
                  <Label className="required">端口号</Label>
                  <div className="item-content">
                    <FormControl
                      {...getFieldProps('conn_port', {
                        initialValue: this.initVal(
                          'conn_port',
                          // '6508'
                          ''
                        ),
                        validateTrigger: 'onBlur',
                        rules: [{
                          required: true, message: '请填写端口号',
                        }, {
                          pattern: /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                          message: '请填写正确的端口号'
                        }],
                      })}
                      onChange={this.portChange}
                    />
                  </div>
                  <FormErr errMsg={getFieldError('conn_port')}/>
                </FormItem>
              </Col>

              {/*<Col md={6}>
                <FormItem className="ootb-form-item">
                  <Label className="required">数据库</Label>
                  <Select
                    {...getFieldProps('dbType', {
                      initialValue: this.initVal('dbType', 'mysql'),
                      rules: [{
                        required: true, message: '请选择数据库',
                      }],
                    })}
                  >
                    <Option value="ora11g">ora11g</Option>
                    <Option value="ora12c">ora12c</Option>
                    <Option value="mysql">mysql</Option>
                    <Option value="sqlserver">sqlserver</Option>
                  </Select>
                  <FormErr errMsg={getFieldError('dbType')}/>
                </FormItem>
              </Col>*/}

              <Col md={6}>
                <FormItem className="ootb-form-item">
                  <Label className="required">配置名称</Label>
                  <div className="item-content">
                    <FormControl
                      maxLength={10}
                      {...getFieldProps('name', {
                        initialValue: this.initVal('name'),
                        rules: [{
                          required: true, message: '请填写配置名称',
                        }],
                      })}
                    />
                  </div>
                  <FormErr errMsg={getFieldError('name')}/>
                </FormItem>
              </Col>

              <Col md={6}>
              <FormItem className="ootb-form-item">
                <Label className="required">账号编码</Label>
                <Select ref='sss'
                  {...getFieldProps('accountCode', {
                    initialValue: this.initVal('accountCode', ''),
                    rules: [{
                      required: true, message: '请选择账号编码',
                    }],
                  })}
                  onFocus={() => {this.selectOptions()}}
                >
                {
                  Array.isArray(addModalAccountList)&& addModalAccountList.length>0 ?
                      addModalAccountList.map((item) => {
                        return <Option value={item.value} key={item.id} >{item.value}</Option>;
                      }):''
                }

                </Select>
                <FormErr errMsg={getFieldError('accountCode')}/>
              </FormItem>
                {/*<FormItem className="ootb-form-item">
                 <Label>账号编码</Label>
               <div className="item-content">
                    <FormControl
                      maxLength={20}
                      {...getFieldProps('accountCode', {
                        initialValue: this.initVal('accountCode', getCookie("_A_P_userId")),
                      })}
                    />
                  </div>
                </FormItem>*/}
              </Col>

              {/*<Col md={6}>
                <FormItem className="ootb-form-item">
                <Label>集团</Label>
                  <div className="item-content">
                    <FormControl
                      maxLength={20}
                      {...getFieldProps('accountGroup', {
                        initialValue: this.initVal('accountGroup'),
                      })}
                    />
                  </div>
                </FormItem>
              </Col>*/}


              {/*<Col md={12}>
              <FormItem className="ootb-form-item">
                  <Label >用户</Label>
                  <div className="item-content">
                    <FormControl
                      maxLength={20}
                      {...getFieldProps('accountUser', {
                        initialValue: this.initVal(
                          'accountUser',
                          decodeURIComponent(getCookie("_A_P_userName"))
                        ),
                     })}
                    />
                  </div>
                </FormItem>
              </Col>*/}

              {/*<Col md={6}>*/}
                {/*<FormItem className="ootb-form-item">*/}
                  {/*<Label className="required">版本</Label>*/}
                  {/*<Select*/}
                    {/**/}
                  {/*>*/}
                    {/*<Option value="">全部</Option>*/}
                    {/*<Option value="1">成功</Option>*/}
                    {/*<Option value="2">失败</Option>*/}
                  {/*</Select>*/}
                {/*</FormItem>*/}
              {/*</Col>*/}

              <Col md={12}>
                <FormItem className="ootb-form-item">
                  <Label >描述</Label>
                  <div className="item-content">
                    <FormControl
                      componentClass="textarea"
                      style={{height: 'auto'}}
                      className='u-form-control'
                      maxLength={100}
                      rows="3"
                      {...getFieldProps('des', {
                        initialValue: this.initVal('des')
                      })}
                    />
                  </div>
                </FormItem>
              </Col>

              {/*<Col md={12} style={{marginTop: '12px'}}>*/}
              {/*  <FormItem className="ootb-form-item">*/}
              {/*    <Label className="required">开关</Label>*/}
              {/*    <div className="item-content">*/}
              {/*      <Switch*/}
              {/*        size="lg"*/}
              {/*        checkedChildren={"开"}*/}
              {/*        unCheckedChildren={"关"}*/}
              {/*        defaultChecked={Boolean(this.initVal('onUse', onUse))}*/}
              {/*        onChange={this.changeOnUseState}*/}
              {/*      />*/}

              {/*    </div>*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
            </Row>



          </Form>
        </Modal.Body>

        <Modal.Footer className="pop_footer">
          <Button
            onClick={this.onSubmit.bind(null, 'test')}
            style={{float: 'left', marginLeft: "100px"}}
            bordered
          >测试连接</Button>
          <Button
            bordered
            onClick={onCancel}
          >取消</Button>
          <Button
            colors="primary"
            onClick={this.onSubmit.bind(null, 'save')}
          >确定</Button>
        </Modal.Footer>
      </Modal>
    )
  }

}
export default Form.createForm()(AddModal)
