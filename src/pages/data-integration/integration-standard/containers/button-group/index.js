import React,{Component} from 'react';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import {  Label } from 'tinper-bee'
import {Button} from 'components/tinper-bee';
// import 'bee-button/build/Button.css'
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
    const { activeType } = this.props.tree
    return (
      <div>
        <div className="button-group">
          {
            activeType == 'root' ? (
              <Button  icon="download" size='lg' onClick={this.handleAdd}>
                <i className="uf uf-add-c-o"></i>
                新增主数据分类
              </Button>
            ) : null
          }
          {/* <Button colors="primary" icon="download" size={size}>
            <i className="uf uf-pencil-s"></i>
            修改
          </Button>

          <Button colors="primary" icon="download" size={size}>
            <i className="uf uf-del"></i>
            删除
          </Button>

          <Button colors="primary" icon="download" size={size}>
            <i className="uf uf-cloud-o-down"></i>
            导出模版
          </Button> */}
        </div>
        <Modal
          show={ this.state.showModal }
          onHide={ this.close }
        >
            <Modal.Header>
                <Modal.Title>这是题目</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                这是一些描述。。。
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={ this.close } bordered style={{marginRight: 50}}>关闭</Button>
                <Button onClick={ this.close } >确认</Button>
            </Modal.Footer>
        </Modal>

      </div>
    )
  }
}

export default ButtonGroup;
