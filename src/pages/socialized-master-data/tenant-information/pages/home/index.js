import React, { Component } from 'react';
import { FormControl,  Col, Row ,Label, Message } from 'tinper-bee';
import {Button} from 'components/tinper-bee';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';
import Header from 'components/header/index.js'


@withRouter
@inject((stores) => {
  return {
    tenantInformationStore: stores.tenantInformationStore
  }
}) @observer
class Home extends Component {
  constructor(props, context) {
    super(props, context);
    const self = this;
    this.state = {
      hint: "请输入分配的Token",
      token: "",
    }
  }

  onChange = (value) => {
    this.setState({
      token:value,
    })
  }

  onHander = () => {
    let { token, hint } = this.state;
    var realtoken = token.trim();
    if( !realtoken || realtoken == '' || realtoken.trim() == hint || realtoken == '**** **** ****'){
      Message.create({ content: '请输入正确的token', color : 'warning' });
      return;
    }else{
      this.props.tenantInformationStore.getTenantInformationByToken(realtoken);
    }

  }

  async componentDidMount(){
    await this.props.tenantInformationStore.getTenantInformationIfexist();
    this.setState({
      token:this.props.tenantInformationStore.tenant.tenantInfo.token
    })
  }



  render() {
    let {
      tenantName, tenantFullname, tenantIndustry, tenantCode, tenantAddress,
      tenantEmail, tenantTel, tenantArea, tenantStates, token
    } = this.props.tenantInformationStore.tenant.tenantInfo;
    var saveButtonText = (token == '' ? '保存' : '更新');

    return (
      <div className="tenant-information">
        {/* <Header title="租户信息" /> */}
        <div className="pic-logo">
          {/* <img className="showbakpic" src={require('../../../../../assets/images/sociatenantinfoheadpic.jpg')} alt="企业图片背景" /> */}
          <img className='logo-logo' src={require('../../../../../assets/images/default-logo-2.png')} alt="logo" />
          <span className='logo-name'>{tenantFullname}</span>
        </div>
        <section className="section-wrap">
          <div className="section-wrap-inputbutton">
            <FormControl className="input" onChange={this.onChange} value={this.state.token} placeholder={this.state.hint}/>
            <Button className="button" colors="primary" onClick={this.onHander.bind(this)}>{saveButtonText}</Button>
          </div>
          <div className="section-wrap-show">
            <Row className="container">
                <Col md={12} xs={12} sm={12}>
                  <Row className="row1">
                    <Col md={4} xs={4} sm={4}>
                        <Label className="label">企业简称:</Label>
                        {tenantName?tenantName:''}
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Label className="label">企业全称:</Label>
                        {tenantFullname?tenantFullname:''}
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Label className="label">企业性质:</Label>
                        {tenantIndustry?tenantIndustry:''}
                    </Col>
                  </Row>
                  <Row className="row1">
                    <Col md={4} xs={4} sm={4}>
                        <Label className="label">企业代码:</Label>
                        {tenantCode?tenantCode:''}
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Label className="label">企业地址:</Label>
                        {tenantAddress?tenantAddress:''}
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Label className="label">企业邮箱:</Label>
                        {tenantEmail?tenantEmail:''}
                    </Col>
                  </Row>
                  <Row className="row1">
                    <Col md={4} xs={4} sm={4}>
                        <Label className="label">企业电话:</Label>
                        {tenantTel?tenantTel:''}
                    </Col>
                    <Col md={8} xs={8} sm={8}>
                        <Label className="label">企业所在地:</Label>
                        {tenantArea?tenantArea:''}
                    </Col>
                    {/* <Col md={4} xs={4} sm={4}>
                        <Label className="label">企业租户状态:</Label>
                        {tenantStates? tenantStates:''}
                    </Col> */}
                  </Row>
                </Col>
              </Row>
          </div>
        </section>
      </div>
    )
  }
}

export default Home;
