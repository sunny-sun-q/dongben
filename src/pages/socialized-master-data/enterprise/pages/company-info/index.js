import React,{Component} from 'react';
import { Col, Row ,Label} from 'tinper-bee';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import imgurl from 'images/logo.svg'
@withRouter
@inject((stores) => {
  return {
    socialDataStore: stores.socialDataStore
  }
}) @observer
class CompanyInfo extends Component{
  constructor(props, context) {
    super(props, context);
    this.setState = {
      data:{}
    }
    this.spliceTime = this.spliceTime.bind(this);
  }

  async componentDidMount() {
    await this.props.socialDataStore.getCompanyInfo("baseinfo",this.props.match.params.name)

  }

  spliceTime(start, end){
    var showTimeScope = '';
    if(start && end){
      showTimeScope = start + ' ~ ' + end;
    }else if(start){
      showTimeScope = start + ' ~ 无固定期';
    }else{
      showTimeScope = '未知';
    }
    return showTimeScope;
  }

  render() {
    var self = this;
    let corpInfo = this.props.socialDataStore.socialData.corpInfo;

    return (
      <Row className="container">
        <Col style={{'text-align': 'center'}} md={2} xs={3} sm={3} >
            {/* <div className='image'></div> */}
            <img src={imgurl} />
        </Col>
        <Col md={10} xs={9} sm={9}>
          <Row>
            <Col md={12} xs={12} sm={12}>
                <h2 className='companyName'>{corpInfo?corpInfo.name:''}</h2>
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">法人:</Label>
                {corpInfo?corpInfo.legalPersonName:''}
            </Col>
            <Col md={6} xs={6} sm={6}>
                <Label className="label">注册资本:</Label>
                {corpInfo?corpInfo.regCapital:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">注册时间:</Label>
                {corpInfo?corpInfo.estiblishTime:''}
            </Col>
            <Col md={6} xs={6} sm={6}>
                <Label className="label">企业状态:</Label>
                {corpInfo?corpInfo.regStatus:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">企业类型:</Label>
                {corpInfo?corpInfo.companyOrgType:''}
            </Col>
            <Col md={6} xs={6} sm={6}>
                <Label className="label">工商注册号:</Label>
                {corpInfo?corpInfo.regNumber:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">纳税人识别号:</Label>
                {corpInfo?corpInfo.taxNumber:''}
            </Col>
            <Col md={6} xs={6} sm={6}>
                <Label className="label">统一信用代码:</Label>
                {corpInfo?corpInfo.creditCode:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">企业评分:</Label>
                {corpInfo?corpInfo.percentileScore:''}
            </Col>
            <Col md={6} xs={6} sm={6}>
                <Label className="label">组织机构代码:</Label>
                {corpInfo?corpInfo.orgNumber:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">行业:</Label>
                {corpInfo?corpInfo.industry:''}
            </Col>
            <Col md={6} xs={6} sm={6}>
                <Label className="label">营业期限:</Label>
                {corpInfo?self.spliceTime( corpInfo.fromTime, corpInfo.toTime):''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">核准日期:</Label>
                {corpInfo?corpInfo.approvedTime:''}
            </Col>
            {/* <Col md={6} xs={6} sm={6}>
                <Label className="label">纳税人资质:</Label>
                {corpInfo?corpInfo.taxNumber:''}
            </Col> */}
            <Col md={6} xs={6} sm={6}>
                <Label className="label">注册地址:</Label>
                {corpInfo?corpInfo.regLocation:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">实缴资本:</Label>
                {corpInfo?corpInfo.actualCapital:''}
            </Col>
            <Col md={6} xs={6} sm={6}>
                <Label className="label">登记机关:</Label>
                {corpInfo?corpInfo.regInstitute:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">人员规模:</Label>
                {corpInfo?corpInfo.staffNumRange:''}
            </Col>
            <Col md={6} xs={6} sm={6}>
                <Label className="label">参保人数:</Label>
                {corpInfo?corpInfo.socialStaffNum:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={6} xs={6} sm={6}>
                <Label className="label">英文名称:</Label>
                {corpInfo?corpInfo.property3:''}
            </Col>
          </Row>
          <Row className="row1">
            <Col md={12} xs={12} sm={12}>
                <Label className="label">经营范围:</Label>
                {corpInfo?corpInfo.businessScope:''}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
export default CompanyInfo;
