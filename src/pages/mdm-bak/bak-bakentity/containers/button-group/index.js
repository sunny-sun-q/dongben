import React,{Component} from 'react';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import { Button, Label } from 'tinper-bee'

import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
  }
}) @observer
class ButtonGroup extends Component{
  constructor(props, context) {
    super(props, context);
    this.handleAdd = this.handleAdd.bind(this)
  }

  handleAdd() {

  }

  render() {
    const size = 'lg';

    return (
      <div>
        <div className="button-group">
          <Button colors="primary" icon="download" size={size}>
            <i className="uf uf-plus"></i>
            新增
          </Button>

          <Button colors="primary" icon="download" size={size}>
            <i className="uf uf-files-o"></i>
            复制实体
          </Button>

          <Button colors="primary" icon="download" size={size}>
            <i className="uf uf-setting"></i>
            修改
          </Button>

          <Button colors="primary" icon="download" size={size}>
            <i className="uf uf-del"></i>
            删除
          </Button>

          <Button colors="primary" icon="download" size={size}>
            <i className="uf uf-cloud-o-down"></i>
            导出Excel模版
          </Button>
        </div>
      </div>
    )
  }
}

export default ButtonGroup;
