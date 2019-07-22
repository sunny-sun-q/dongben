import React,{Component} from 'react';
import { FormattedMessage } from 'react-intl'
import { Button, Label, Upload, Icon } from 'tinper-bee'
import Form from 'bee-form'
const FormItem = Form.FormItem;

import Combox from 'components/combox/index.js';
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
import EditTable from '../../containers/muliti-table'
import { FormattedMessage,injectIntl } from 'react-intl'
import {getContextId,contextBack} from 'utils';
const contextId = getContextId();
const props = {
  name: 'file',
  action: '/api/loadingThirdPartService/upload',
  accept:"", 
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      //TODO
      this.props.uploadStore.getExcelData(
        "408ed254-6d83-4815-b364-95db3386ce57",
        "1d00ae33-3a08-4195-98be-bd7ffc2f5557",
        "",
        "",
        "1d00ae33-3a08-4195-98be-bd7ffc2f5557"
        )
        this.props.uploadStore.upload.info
      console.log(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      console.log(`${info.file.name} file upload failed.`);
    }
  },
};
@withRouter


@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    uploadStore:  stores.uploadStore
  }
}) @observer
class Leaf extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectId: ''
    }
    this.selectChange = this.selectChange.bind(this)
  }


  componentDidMount() {
    // this.props.sysComboxStore.getSysCombox()
  }
  selectChange(item) {
    console.log('item', item)
  }
  render() {
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    return (
      <div className="main">
        <Header title="数据分发" />
        <section className="section-wrap">
          <div className="section-wrap-l">
            <Siderbartree
              root={{id: 'entity-model', name: text}}
              // url="/genericmodel/category/md-tree"
            />
          </div>
          <div className="section-wrap-r">
            <div>
                  <div className="section-wrap-r">
                    { <EditTable /> }
                  </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default injectIntl(Leaf, {withRef: true});
