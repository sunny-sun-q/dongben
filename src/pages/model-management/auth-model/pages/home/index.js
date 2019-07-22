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

import {  Label } from 'tinper-bee'
import Header from 'components/header/index.js'
import Siderbartree from 'components/tree/index.js'
import DataMaintenanceRoot from '../../containers/DataMaintenance-root';
import { FormattedMessage,injectIntl } from 'react-intl'
import {getContextId,contextBack} from 'utils';
import {Button} from 'components/tinper-bee';
const contextId = getContextId();
import imgUrl from '../../../../../assets/images/nodata_auth.png';
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
    // const { table } = this.props.dataMaintainStore
    const { nodeLeaf } = this.props.treeStore
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    // console.log("Home->reftree", nodeLeaf.ifShowTable)
    return (
      <div className="main">
        {/* <Header title="权限模型" /> */}
        <section className="section-wrap">
          <div className="section-wrap-l">
            <Siderbartree
              root={{ id: '0', name: text, isparent: true }}
              ifNoHover={true}
            />
          </div>
          <div className="section-wrap-r">
            {
              nodeLeaf.ifShowTable ? (
                <DataMaintenanceRoot />
              ) : <div className="no-data-display">
              <div>
                  <img src={imgUrl} className="pic"></img>
              </div>
              <div className="word">
                  <FormattedMessage id="js.rou.auth.00221" defaultMessage="通过权限模型的设置，可指定不同角色的数据权限； " />
                  <FormattedMessage id="js.rou.auth.00222" defaultMessage="矩阵权限来管理主数据行级、列级的查看及编辑权限； " />
                  
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
