import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import { Button, Label, Checkbox, Col, Row, Radio, Select, FormControl } from 'tinper-bee';
import Form from 'bee-form';
import zhCN from "tinper-bee/locale/zh_CN.js";
import enUS from "tinper-bee/locale/en_US.js";
const FormItem = Form.FormItem;
const Option = Select.Option;
import {DatePicker} from 'components/tinper-bee';
import moment from "moment";
const format = "YYYY-MM-DD HH:mm:ss";

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores => {
  return {
    bakLogStore: stores.bakLogStore,
  }
})) @observer
class BaklogLeftForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.onChangeToState = this.onChangeToState.bind(this);
    this.generateQueryConditions = this.generateQueryConditions.bind(this);
    this.submit= this.submit.bind(this)
    this.state = {
      pk_user: '',              // 表单中的操作用户
      pk_mdentity_name: '',     // 实体名称
      moduleTypeCode: 0,        // 操作模块编码
      operitemtypeCode: 0,      // 操作类型编码
      operstateCode: 0,         // 操作状态编码
      strstartTime: '',         // 起始时间
      startTime: {},            // 起始时间
      strendTime: '',           // 结束时间
      endTime: {},              // 结束时间
      moduleTypes: [            // 模块类型
        {
          'code': '1',
          'name': '副本建模模块'
        },
        {
          'code': '2',
          'name': '副本映射模块'
        },
        {
          'code': '3',
          'name': '数据相关模块'
        },
        {
          'code': '4',
          'name': '清洗补全模块'
        },
      ],
      operitemTypes: [      // 操作类型
        {
          'code': '1',
          'name': '新增'
        },
        {
          'code': '2',
          'name': '修改'
        },
        {
          'code': '3',
          'name': '删除'
        },
      ],
      operstates: [         // 操作状态
        {
          'code': '1',
          'name': '成功'
        },
        {
          'code': '2',
          'name': '失败'
        },
      ],
    };
  }

  // 根据自身的state来生成对应的查询条件
  generateQueryConditions() {
    var cond = "1=1";
    const pk_user = this.state.pk_user;
    const pk_mdentity_name = this.state.pk_mdentity_name;
    const moduleTypeCode = this.state.moduleTypeCode;
    const operitemtypeCode = this.state.operitemtypeCode;
    const operstateCode = this.state.operstateCode;
    const strstartTime = this.state.strstartTime;
    const strendTime = this.state.strendTime;

    if (pk_user && pk_user != '')
      cond += " and $.username='" + pk_user + "'";
    if (pk_mdentity_name && pk_mdentity_name != '')
      cond += " and $.pk_mdentity_name='" + pk_mdentity_name + "'";
    if (moduleTypeCode && moduleTypeCode != 0)
      cond += " and $.opertype=" + moduleTypeCode;
    if (operitemtypeCode && operitemtypeCode != 0)
      cond += " and $.operitemtype=" + operitemtypeCode;
    if (operstateCode != '')
      cond += " and $.operstate=" + operstateCode;
    if (strstartTime != '')
      cond += " and $.opertime>='" + strstartTime + "'";
    if (strendTime != '')
      cond += " and $.opertime<='" + strendTime + "'";

    return cond;
  }

  // tinper表单提交方法
  submit () {
    let self = this;
    this.props.form.validateFields((err, values) => {
      // 表单中值没有校验通过
      if (err) {
        console.log('校验失败', values);
        // 成功提交
      } else {
        // 日期时间和下拉框有各自的设置值得方法，提交时对用户和实体进行设置值
        // const pk_user = values.pk_user;
        // const pk_mdentity_name = values.pk_mdentity_name;
        // if(pk_user != ''){
        //   //this.onChangeToState(pk_user,'pk_user');
        //   this.setState({
        //     pk_user: pk_user,
        //   });
        // }
        // if(pk_mdentity_name != ''){
        //   //this.onChangeToState(pk_mdentity_name,'pk_mdentity_name');
        // }
        self.setState({
          pk_user: '123'
          
        })
        const queryCond = self.generateQueryConditions();
        self.props.bakLogStore.getBaklogGrid(queryCond);
      }
    });
  }

  // 清空按钮绑定方法
  reset = () => {
    this.props.form.resetFields();
    //部分表单元素无法通过this.props.form.resetFields重置，需要手动重置，如下
    this.setState({
      pk_user: '',
      pk_mdentity_name: '',
      moduleTypeCode: '',
      operitemtypeCode: '',
      operstateCode: '',
      stateTime: '',
      endTime: '',
    })
  }

  pkuserSelect = (v) => {
    this.setState({value: v});
  }

  // 日历组件返回的是一个moment组件
  selectStartTime = value => {
    const strtime = value.format(format);
    //console.log(strtime);   //2018-11-21 18:27:37
    this.onChangeToState(strtime, 'strstartTime');
    this.onChangeToState(value, 'startTime');
  }

  selectEndTime = value => {
    const strtime = value.format(format);
    this.onChangeToState(strtime, 'strendTime');
    this.onChangeToState(value, 'endTime');
  }

  moduleTypeSelect = value => {
    if(value && value != 0){
      this.onChangeToState(value, 'moduleTypeCode');
    }
  }

  operitemTypeSelect = value => {
    if(value && value != 0){
      this.onChangeToState(value, 'operitemtypeCode');
    }
  }

  operstateSelect = value => {
    if(value && value != 0){
      this.onChangeToState(value, 'operstateCode');
    }
  }

  onChangeToState(value, key) {
    this.setState({
      [key]: value,
    });
  }

  render() {
    // 默认的宽度
    const size = 'lg';
    const { getFieldProps, getFieldError } = this.props.form;

    return (
      <div>
        <Form className='FormAll'>
          <FormItem >
            <Label>操作用户：</Label>
            <FormControl placeholder="请输入操作用户"
              // ref={(input) => {this.textInput = input}}
              // value={this.state.value01}
              // onChange={this.pkuserSelect}
              {...getFieldProps('pk_user', {
                initialValue: this.state.pk_user != '' ? this.state.pk_user : '',
                validateTrigger: 'onBlur',
                rules: [{
                  required: false, message: '请输入操作用户',
                }],
              })}
            />
            <span className='error'>
              {getFieldError('pk_user')}
            </span>
          </FormItem>

          <FormItem>
            <Label >清洗实体名称：</Label>
            <FormControl placeholder="请输入清洗实体名称"
              {...getFieldProps('pk_mdentity_name', {
                initialValue: this.state.pk_mdentity_name != '' ? this.state.pk_mdentity_name : '',
                validateTrigger: 'onBlur',
                rules: [{
                  required: false, message: '请输入清洗实体名称',
                }],
              })}
            />
            <span className='error'>
              {getFieldError('pk_mdentity_name')}
            </span>
          </FormItem>

          <FormItem>
            <Label>操作模块：</Label>
            <Select placeholder="请选择操作模块"
              defaultValue={this.state.moduleTypeCode != '' ? this.state.moduleTypeCode : ''}
              onSelect={this.moduleTypeSelect}
              {
              ...getFieldProps('moduleType', {
                rules: [{ required: false }]
              })
              }
            >
              {
                this.state.moduleTypes.map((item, index) => {
                  return (
                    <Option key={index} value={item.code}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </FormItem>

          <FormItem>
            <Label>操作类型：</Label>
            <Select placeholder="请选择操作类型"
              defaultValue={this.state.operitemtypeCode != '' ? this.state.operitemtypeCode : ''}
              onSelect={this.operitemTypeSelect}
              {
              ...getFieldProps('operitemtype', {
                rules: [{ required: false }]
              })
              }
            >
              {
                this.state.operitemTypes.map((item, index) => {
                  return (
                    <Option key={index} value={item.code}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </FormItem>

          <FormItem>
            <Label>操作状态：</Label>
            <Select placeholder="请选择操作状态"
              defaultValue={this.state.operstateCode != '' ? this.state.operstateCode : ''}
              onSelect={this.se}
              {
              ...getFieldProps('operstate', {
                rules: [{ required: false }]
              })
              }
            >
              {
                this.state.operstates.map((item, index) => {
                  return (
                    <Option key={index} value={item.code}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </FormItem>

          <FormItem className='time'>
            <Label>起始时间：</Label>
            <DatePicker
              format={format}
              showTime={true}
              onSelect={this.operstateSelect}
              // onChange={this.onChangeStartTime}
              defaultValue={this.state.strstartTime != '' ? this.state.startTime : moment()}
              placeholder={'请选择起始时间'}
              {...getFieldProps('starttime', {
                validateTrigger: 'onBlur',
                rules: [{
                  required: false, message: '请输入起始时间',
                }],
              })}
            />
          </FormItem>

          {/* <FormItem className='time'>
            <Label>结束时间：</Label>
            <DatePicker
              format={format}
              showTime={true}
              locale={zhCN}
              onSelect={this.selectEndTime}
              // onChange={this.onChangeEndTime}
              defaultValue={this.state.endTime != {} ? this.state.endTime : {}}
              placeholder={'请选择结束时间'}
              {...getFieldProps('endtime', {
                validateTrigger: 'onBlur',
                rules: [{
                  required: true, message: '请输入结束时间',
                }],
              })}
            />
          </FormItem> */}

          <div className='submit'>
            {/* 按钮绑定组建中的提交方法 */}
            <Button colors="primary" className="login" onClick={this.submit}>查询</Button>
            <Button shape="border" className="reset" onClick={this.reset}>清除</Button>
          </div>

        </Form>
      </div>
    )
  }
}

export default Form.createForm()(BaklogLeftForm);
