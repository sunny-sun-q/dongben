import React,{Component} from 'react';
import { Route, Switch} from 'react-router-dom';
import './index.less'
import {FormattedMessage,  injectIntl} from 'react-intl';
import Content from '../home_content'
import { Button, Label } from 'tinper-bee'
import Header from 'components/header/index.js'
import Siderbartree from 'components/tree/index.js'
import {getContextId,contextBack} from 'utils';
const contextId = getContextId();
import imgUrl from '../../../../../assets/images/nodata_maintenance.png';

import {
  inject,
  observer
} from 'mobx-react';

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
    let sideBarFlag = window.location.href.indexOf("modulefrom=sidebar")>0;
    if(contextId === 'mdm'){
      sideBarFlag = true;
    }
    // let a  = this.props.intl.formatMessage({id: 'intl.name',defaultMessage:"默认名称"})
    // console.log('第一种方式:' , a);
    let backFun = function(){
      contextBack();
    }
    let headerText = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0085", defaultMessage:"数据维护"}) : this.props.intl.formatMessage({id:"js.rou.hom3.0001", defaultMessage:"自定义档案维护"});
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    let warpHeight = sideBarFlag? '100%': 'calc(100% - 51px)';
    let length = this.props.treeStore.tree.selectedKeys.length;

    return (
      <div className="main">
        {
          sideBarFlag? '' : <Header title={headerText}  back={true} backFn={backFun}/>
        }
        {/* <FormattedMessage
　　      id="intl.title"
          defaultMessage="默认title"
        /> */}
        <section className="section-wrap" style={{
          height: warpHeight
        }}>
          <div className="section-wrap-l">
            <Siderbartree
              root={{id: '0', name: text, isparent: true}}
              ifNoHover={false}
              showIcon = {false}
              autoSelect={true}
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
                        <FormattedMessage id="js.rou.hom.00221" defaultMessage="请选择具体主数据进行数据维护" />
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

export default injectIntl(Home, {withRef: true});
