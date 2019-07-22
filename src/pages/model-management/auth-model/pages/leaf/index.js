import React,{Component} from 'react';
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
@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    dataMaintainStore: stores.dataMaintainStore
  }
}) @observer
class Leaf extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: this.props.match.params.id
    }
    this.nodeSaveClick = this.nodeSaveClick.bind(this)
  }

  nodeSaveClick() {

  }

  // async componentDidMount() {
  //   await this.props.dataMaintainStore.getTableRequest(this.props.match.params.id)
  // }

  componentWillReceiveProps(nextProps) {
    const { id:prevId } = this.props.match.params;
    const { id:nextId } = nextProps.match.params;
    const { getTableRequest } = this.props.dataMaintainStore;
    if (nextId && nextId !== prevId) {
      this.setState({
        id: nextId
      })
      getTableRequest(prevId);
    }
  }

  componentDidMount() {
    // this.props.dataMaintainStore.getTableRequest(this.props.match.params.id)
  }

  render() {
    const { nodeLeaf } = this.props.treeStore
    const { id } = this.state
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    return (
      <div className="main">
        {/* <Header title="权限模型" /> */}
        <section className="section-wrap">
          <div className="section-wrap-l">
            <Siderbartree
              root={{id: '0', name: text, isparent: true}}
              expendId={id}
              ifNoHover={true}
            />
          </div>
          <div className="section-wrap-r">
            <DataMaintenanceRoot/>
          </div>
        </section>
      </div>
    )
  }
}

export default injectIntl(Leaf, {withRef: true});
