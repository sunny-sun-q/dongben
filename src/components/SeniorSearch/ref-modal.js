import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {Component} from 'react';
import {  Col,  Row, FormControl, Icon } from 'tinper-bee';
import {Table} from 'components/tinper-bee';
import Modal from 'bee-modal'
import Tree from 'components/tree'
import PropTypes from 'prop-types';
import './index.less';
import {Button} from 'components/tinper-bee';

const propTypes = {
  title: PropTypes.string,//模态框标题
};

const defaultProps = {
  title: <FormattedMessage id="js.com.Sen1.0001" defaultMessage="实体字段" />
};

import {
  withRouter
} from 'react-router-dom';

import {
  inject,
  observer
} from 'mobx-react';

@withRouter
@inject((stores) => {
  return {
    seniorSearchStore: stores.seniorSearchStore,
  }
}) @observer
class RefModal extends Component {
	constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      selectedRowIndex: -1,
      selectedRecord:{}
    }
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.submit = this.submit.bind(this);
    this.rowclick = this.rowclick.bind(this);
  }
  tempRefObj = {
    treelistlabelfield_name:'',
    treelistlabelfield:'',
    treeparentid:'',
    treeparentid_name:'',
    treelabelfield:'',
    treelabelfield_name:'',
    treeref_foreignkey:'',
    treeref_foreignkey_name:''
  }

  tempCombObj = {
    treelabelfield_name:'',
    treelabelfield:''
  }

  close() {
    this.props.seniorSearchStore.setTableModal(false)
  }

  open() {
    this.props.seniorSearchStore.setTableModal(true)
  }

  submit(e) {
    e.preventDefault();
    // let {
    //   table: {
    //     fieldref:{
    //       reference,
    //   }},
    //   currentNode
    //  } = this.props.seniorSearchStore;

     this.props.seniorSearchStore.resetRefMsg(this.state.selectedRecord)
     this.props.callBack(this.state.selectedRecord)

    this.close();
    this.setState({
      selectedRowIndex: -1
    });
  }

  rowclick = (record,index) => {
    this.setState({
      selectedRowIndex: index,
      selectedRecord: record
    });
  }

  mapTableHeader(header) {
    if(header)
    {
      const temparr = header.map((item) => {
        return {
            title: item.text,
            dataIndex: item.fieldId,
            key: item.fieldId,
            width: "200px",
          }
      })
      return temparr
    }
    return []
  }

	render() {
    const { title } = this.props;
    let body = this.props.body
    let header = this.mapTableHeader(this.props.header)
    // body = this.props.seniorSearchStore.fieldref? this.props.seniorSearchStore.fieldref.body: [];
    // header = this.props.seniorSearchStore.fieldref? this.props.seniorSearchStore.fieldref.header: [];
    const { columns, data } = this.state;
    const { seniorSearchStore } = this.props;
    console.log('body888',seniorSearchStore.table.fieldref.ifModalShow)
		return (
      <div>
        <Modal
          show={seniorSearchStore.table.fieldref.ifModalShow}
          onHide={this.close}
          style={{width: 300}}
          className="ref-modal"
        >
          <Modal.Header className="text-center" closeButton>
            <Modal.Title style={{textAlign: 'left'}}>
              <FormattedMessage id="js.com.Sen1.0002" defaultMessage="高级查询" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="ref-modal-body">
            <Table
              columns={header}
              data={body}
              parentNodeId='parent'
              height={43}
              headerHeight={42}
              rowClassName={(record,index,indent)=>{
                if (this.state.selectedRowIndex == index) {
                    return 'selected';
                } else {
                    return '';
                }
              }}
              onRowClick={this.rowclick}
            />
          </Modal.Body>
          <Modal.Footer className="text-center">
            <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                <FormattedMessage id="js.com.Sen1.0003" defaultMessage="取消" />
            </Button>
            <Button  onClick={this.submit}>
                <FormattedMessage id="js.com.Sen1.0004" defaultMessage="确认" />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}

export default RefModal
