import React, {
	Component
} from 'react';
import './index.less';
import {Col, Row} from 'tinper-bee';
import leftImg from '../../../../../assets/images/entityModel/data-left.png';
import dataDriven from '../../../../../assets/images/entityModel/data-driven.svg';
import enterStandard from '../../../../../assets/images/entityModel/enterprise-standard.svg';
import dynamicExtend from '../../../../../assets/images/entityModel/dynamic-extend.svg';
import manage from '../../../../../assets/images/entityModel/manage.svg';
import publish from '../../../../../assets/images/entityModel/publish.svg';
class NoData extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
        <Row className="entity-model-no-data">
          <Col md={6} xs={6} sm={6} className="entity-model-no-data-left">
              <div className='entity-model-no-data-left-img'><img src={leftImg}/></div>
          </Col>
          <Col md={6} xs={6} sm={6} className="entity-model-no-data-right">
              <Row className='entity-model-no-data-right-wrap'>
              <Col md={6} xs={12} sm={12} className="entity-model-no-data-right-info">
                  <div className='entity-model-no-data-right-img entity-model-no-data-right-img-first' >
                    <img src={dataDriven}/>
                    <span>数据驱动主数据全生命 周期的管理</span>
                  </div>
              </Col>
              <Col md={6} xs={12} sm={12} className="entity-model-no-data-right-info">
                  <div className='entity-model-no-data-right-img entity-model-no-data-right-img-first'>
                    <img src={enterStandard}/>
                    <span>根据企业标准落地信息 分类及主数据模型</span>
                  </div>
              </Col>
              <Col md={6} xs={12} sm={12} className="entity-model-no-data-right-info">
                  <div className='entity-model-no-data-right-img'>
                    <img src={dynamicExtend}/>
                    <span>运行态下动态扩展主数 据或主数据属性</span>
                  </div>
              </Col>
              <Col md={6} xs={12} sm={12} className="entity-model-no-data-right-info">
                  <div className='entity-model-no-data-right-img'>
                    <img src={manage}/>
                    <span>多维度属性管理，提升 主数据的数据质量</span>
                  </div>
              </Col>
              <Col md={6} xs={12} sm={12} className="entity-model-no-data-right-info">
                  <div className='entity-model-no-data-right-img'>
                    <img src={publish}/>
                    <span>灵活发布，多形态来组 织管理主数据；</span>
                  </div>
              </Col>
              </Row>
          </Col>
        </Row>
    )
  }

}
export default NoData;
