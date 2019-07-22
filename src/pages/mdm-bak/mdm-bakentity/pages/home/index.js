import React,{Component} from 'react';
import { FormattedMessage } from 'react-intl'
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

import Header from 'components/header/index.js'
import Siderbartree from 'components/tree/index.js'
import ButtonGroup from '../../containers/button-group/index.js'
import MulitiTable from '../../containers/muliti-table'

class Home extends Component{
  constructor(props, context) {
    super(props, context);
    // 选中的树pk
    this.state = {
      selectId: this.props.match.params.id,
    }
    this.selectChange = this.selectChange.bind(this);
  }

  selectChange(item) {
    console.log('item', item)
  }

  render() {
    return (
      <div className="main">
        <Header title="清洗建模" />
        
        {/* 类似专用的div */}
        <section className="section-wrap">
          <div className="section-wrap-l">
          {/* 树具体的使用方法详见src\components\tree\Tree.README */}
            <Siderbartree
              root={{id: '0', name: '副本表', isparent: true}}
              url={"/mdmbak/bak-tree"}
              />
          </div>
          {/* 如果需要使用默认隐藏其他布局可以使用树中的状态 */}
          <div className="section-wrap-r">
            {/* 按钮组 */}
            <ButtonGroup />
            {/* 自定义表 */}
            <MulitiTable />
          </div>
        </section>
      </div>
    )
  }
}

export default Home;
