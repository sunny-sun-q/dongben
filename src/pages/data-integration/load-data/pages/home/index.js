import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  withRouter
} from 'react-router-dom';

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';


import Siderbartree from 'components/tree/index.js'
import Content from './content';
import { FormattedMessage,injectIntl } from 'react-intl'
import {getContextId} from 'utils';
const contextId = getContextId();
import imgUrl from '../../../../../assets/images/nodata_loaddata.png';
import imgUrl1 from '../../../../../assets/images/nodata_loaddata1.svg';
import imgUrl2 from '../../../../../assets/images/nodata_loaddata2.svg';
import imgUrl3 from '../../../../../assets/images/nodata_loaddata3.svg';
import imgUrl4 from '../../../../../assets/images/nodata_loaddata4.svg';
@withRouter
@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    loadDataStore: stores.loadDataStore
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
                        <FormattedMessage id="js.rou.loaddata.00221" defaultMessage="选择主数据进行数据的导入装载" />
                    </div>
                    <div className="desc">
                      <div className="desc-title">
                        <p>
                          <span style={{
                        color:'red'
                        }}>*</span>
                          数据装载流程说明
                        </p>
                      </div>
                      <div className="desc-content">
                        <div className="desc-content-div">
                          <img src={imgUrl1} className="desc-content-img"></img>
                          <span className="desc-content-span">1、选择主数据模型</span>
                        </div>
                        <div className="desc-content-div">
                          <img src={imgUrl2} className="desc-content-img"></img>
                          <span className="desc-content-span">2、选择装载系统</span>
                        </div>
                        <div className="desc-content-div">
                          <img src={imgUrl3} className="desc-content-img"></img>
                          <span className="desc-content-span">3、选择需要装载的数据</span>
                        </div>
                        <div className="desc-content-div">
                          <img src={imgUrl4} className="desc-content-img"></img>
                          <span className="desc-content-span">4、装载成功</span>
                        </div>
                      </div>
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
