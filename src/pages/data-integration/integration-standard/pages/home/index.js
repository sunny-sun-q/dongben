import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import SiderbarTree from '../../containers/category-tree/index.js'
import ApiMenu from '../../containers/api-menu-main/index'
import ApiDetails from '../../containers/api-details/index'
import { FormattedMessage,injectIntl } from 'react-intl'
import {getContextId} from 'utils';
const contextId = getContextId();
@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
  }
}) @observer
class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectId: ''
    }
    this.selectChange = this.selectChange.bind(this)
  }

  componentDidMount() {
  }

  selectChange(item) {
    console.log('item', item)
  }

  showApiCategory() {
    if (this.props.treeStore.tree.isleaf) {
      return (
        <div className="section-wrap-l">
          {<ApiMenu pk_gd={this.props.treeStore.tree.node.id}/>}
        </div>
      )
    }
  }

  render() {
    var node_pk_gd = this.props.treeStore.tree.node.id;
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    return (
      <div className="main">

        <section className="section-wrap">

          <div className="section-wrap-l">
            <SiderbarTree
              root={{ id: '0', name: '主数据分类' }}
              autoSelect={true}
              ifNoHover={true}
            />
          </div>

          {this.showApiCategory()}

          <div className="section-wrap-r">
            <ApiDetails pk_gd={node_pk_gd}/>
          </div>

        </section>

      </div>
    )
  }
}

export default injectIntl(Home, {withRef: true});
