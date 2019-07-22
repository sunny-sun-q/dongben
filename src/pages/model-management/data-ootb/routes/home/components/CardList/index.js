import React, { Component } from 'react'
import Item from './Item'

import { Row } from 'tinper-bee'




import './index.less'
class CardList extends Component {
  constructor(props) {
    super(props)
  }

  static Item = Item;

  render() {
    const {
      className="",
      style = {},
      children,
      ...otherProps
    } = this.props;
    const cls = `ootb-config-card-list ${className}`
    const _style = Object.assign({}, style);
    return (
      <Row
        className={cls}
        style={_style}
        {...otherProps}
      >
        {children}
      </Row>
    )
  }
}
export default CardList
