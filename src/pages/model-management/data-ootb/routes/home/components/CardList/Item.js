import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Icon, Tooltip} from 'tinper-bee'
import {Button} from 'components/tinper-bee';
import logoImg from 'images/ootb/logo.png'
import itemHearderBg1 from 'images/ootb/bg1.png'
import itemHearderBg2 from 'images/ootb/bg2.png'
import itemHearderBg3 from 'images/ootb/bg3.png'

const bgList = [
  itemHearderBg1,
  itemHearderBg2,
  itemHearderBg3
]

const layoutConfig = {
  lg: 3,
  md: 4,
  sm: 6
}

function rand(min, max){
  return parseInt(Math.random() * ( min - max )) + max - 1;
}

const InfoView = (props) => {
  const { name, value, hideBorder=false, userTooltip=false } = props;
  let toolTipProps = {
    inverse: true,
    overlay: value,
    placement: 'bottom'
  }
  if (!userTooltip) {
    toolTipProps.visible = false
  }
  return (
    <div className={`card-info-view ${hideBorder && 'hideBorder'}`}>
      <span className="info-name">{name}</span>
      <Tooltip
        {...toolTipProps}
      >
        <span className="info-value">{value}</span>
      </Tooltip>
    </div>
  )

}

class CardItem extends Component {
  constructor(props) {
    super(props)
    this.headerBg = bgList[rand(0, 3)]
  }

  static propTypes = {
    type: PropTypes.oneOf(['add', 'data'])
  }

  static defaultProps = {
    className: '',
    type: 'data'
  }

  getContent = (type, source = {}) => {
    let Content = null;
    switch (type) {
      case 'add':
        Content = (
          <div className="card-item-add">
            <div className="add-icon">
              <Icon type='uf-plus'/>
            </div>
            <p>添加配置连接</p>
          </div>
        )
        break;
      case 'data':
        const { logo, name, obVersion, conn_addr, conn_port, accountUser, dbType, des, onUse} = source;
        const { onDelete, onEdit, onTest, onCreate } = this.props;
        Content = (
          <div className="card-item-data">

            <div className='item-data-abs-btn'>
              <Icon
                className="abs-btn"
                type="uf-pencil"
                onClick={onEdit}
              />
              {!onUse ? (
                <Icon
                  className="abs-btn"
                  type="uf-del"
                  onClick={onDelete}
                />
              ) : null}

            </div>

            <div
              className="item-data-header"
              style={{
                backgroundImage: `url(${this.headerBg})`
              }}
            >
              <div className="item-data-header-logo">
                <img src={logoImg} alt=""/>
              </div>

              <div className="item-data-header-info">
                <p className="name">{name}</p>
                <p className="from">数据源 {obVersion}</p>
              </div>
            </div>

            <div className="item-data-url">
              <InfoView
                hideBorder={true}
                name="地址:"
                value={`${conn_addr}:${conn_port}`}
                userTooltip={true}
              />
            </div>

            <Row className="item-data-info">
              {/*<Col className="data-info-item" sm={6}>*/}
              {/*  <InfoView*/}
              {/*    name="用户"*/}
              {/*    value={accountUser || "-"}*/}
              {/*    userTooltip={!!accountUser}*/}
              {/*  />*/}
              {/*</Col>*/}
              <Col className="data-info-item" sm={12}>
                <InfoView
                  name="数据库"
                  value={dbType}
                />
              </Col>
              <Col className="data-info-item" sm={12}>
                <InfoView
                  name="描述"
                  value={des || '-'}
                  userTooltip={!!des}
                />
              </Col>

            </Row>

            <div className="item-data-footer">
              <Button
                className='data-footer-button'
                bordered
                onClick={onTest}
              >
                测试连接
              </Button>
              <Button
                className="data-footer-button"
                bordered
                onClick={onCreate}
              >
                创建模型
              </Button>
            </div>

          </div>
        );
        break;
      default:
        break
    }

    return Content
  }

  render() {
    const {
      className,
      type,
      source,
      onClick
    } = this.props;
    const cls = `ootb-config-card-item ${className}`;
    const CardContent = this.getContent(type, source);
    return (
      <Col
        className={cls}
        {...layoutConfig}
        onClick={onClick}
      >
        <div
          className="card-item-content"
        >
          {CardContent}
        </div>
      </Col>
    )
  }
}

export default CardItem
