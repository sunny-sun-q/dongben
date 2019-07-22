import React,{Component} from 'react';
import { FormattedMessage,injectIntl } from 'react-intl'
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
import EditTable from '../../containers/edit-table'
import NodeInfoEdit from '../../containers/node-info-edit'
import CheckModel from '../../components/check-modal'
import {getContextId,contextBack} from 'utils';
import NoData from '../../components/noData';
const contextId = getContextId();
@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore
  }
}) @observer
class Home extends Component{
  constructor(props, context) {
    super(props, context);
    this.nodeSaveClick = this.nodeSaveClick.bind(this)
  }

  nodeSaveClick() {

  }
  render() {
    // console.log(' home render --- ')
    const { table } = this.props.entityContentStore
    const { nodeLeaf } = this.props.treeStore
    let sideBarFlag = window.location.href.indexOf("modulefrom=sidebar")>0;
    if(contextId === 'mdm'){
      sideBarFlag = true;
    }
    let backFun = function(){
      contextBack();
    }

    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    let headerText = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0018", defaultMessage:"数据模型"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0019", defaultMessage:"自定义档案建模"});
    let warpHeight = sideBarFlag? '100%': 'calc(100% - 51px)';
    let checkFun = async (item)=>{
      this.props.entityContentStore.setCheckModal(true)
      await this.props.entityContentStore.getCheckInfo(item.id)
    }
    return (
      <div className="main">
        {/* <Header title="数据模型" /> */}
        {
          sideBarFlag? '' : <Header title={headerText}  back={true} backFn={backFun}/>
        }
        <section className="section-wrap" style={{
          height: warpHeight
        }}>
          <div className="section-wrap-l">
            <Siderbartree
              checkFun={checkFun}
              root={{id: '0', name: text, isparent: true}}
              ifNoHover={false}
            />
          </div>
          <div className="section-wrap-r entity-model-content">
            <CheckModel />
            {/* {
              nodeLeaf.ifShowCreateLeaf ? (
                <NodeInfoEdit update={true}/>
              ) : null
            } */}
            {
              nodeLeaf.ifShowTable ? (
                <EditTable />
              ) : <NoData/>
            }

          </div>
        </section>
      </div>
    )
  }
}

export default injectIntl(Home, {withRef: true});;;
