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

import { Button, Label } from 'tinper-bee'
import Siderbartree from 'components/tree/index.js'

import { FormattedMessage,injectIntl } from 'react-intl'
import {getContextId} from 'utils';
const contextId = getContextId();
import imgUrl from '../../../../../assets/images/nodata_flow.png';
@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    flowModelStore: stores.flowModelStore
  }
}) @observer
class Home extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { nodeLeaf } = this.props.treeStore
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    return (
      <div className="main">
        <section className="section-wrap">
          <div className="section-wrap-l">
            <Siderbartree
              root={{ id: '0', name: text, isparent: true }}
              ifNoHover={true}
              filterOption={{publishedFlow:true}}
            />
          </div>
          <div className="section-wrap-r">
            {
              nodeLeaf.ifShowTable ? null : <div className="no-data-display">
              <div>
                  <img src={imgUrl} className="pic"></img>
              </div>
              <div className="word">
                  <FormattedMessage id="js.rou.flow.00221" defaultMessage="根据主数据管理规范，为主数据配置、设计合适的审批流程； " />
                  
              </div>
          </div>
            }

          </div>
        </section>
      </div>
    )
  }
}

export default injectIntl(Home, {withRef: true});
