import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  withRouter
} from 'react-router-dom';
import { FormattedMessage,injectIntl } from 'react-intl'
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';


import Siderbartree from 'components/tree/index.js'
import Content from './content';
import {getContextId} from 'utils';
const contextId = getContextId();
import imgUrl from '../../../../../assets/images/nodata_authandsub.png';

@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    dataMaintainStore: stores.dataMaintainStore
  }
}) @observer
class Home extends Component {
  constructor(props, context) {

    super(props, context);
    this.nodeSaveClick = this.nodeSaveClick.bind(this)
  }

  nodeSaveClick() {

  }
  render() {
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    let length = this.props.treeStore.tree.selectedKeys.length;
    return (
      <div className="main">
        <section className="section-wrap">
          <div className="section-wrap-l">
            <Siderbartree
              root={{ id: '0', name: text, isparent: true }}
              ifNoHover={true}
              autoSelect={true}
              url = '/modeling/category/start-tree'
            />
          </div>
          <div className="section-wrap-r">
          {
              length<1?
              <div className="no-data-display">
                    <div>
                        <img src={imgUrl} className="pic"></img>
                    </div>
                    <div className="word">
                        <FormattedMessage id="js.rou.authandsub.00221" defaultMessage="请选择具体主数据，对生产系统进行授权，为消费系统进行按需订阅" />
                    </div>
                </div>: null
            }
            <Route path="/leaf/:id" component={Content} />
          </div>
        </section>
      </div>
    )
  }
}

export default injectIntl(Home, {withRef: true});;;
