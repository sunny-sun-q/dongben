import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
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
import Select from 'bee-select'
import {  Label , Row } from 'tinper-bee'
import {Button} from 'components/tinper-bee';
import {Table} from 'components/tinper-bee';
import Header from 'components/header/index.js'
import Siderbartree from 'components/tree/index.js'
import Modal from 'bee-modal'
import { debug } from 'util';
const Option = Select.Option

@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    entityContentStore: stores.entityContentStore
  }
}) @observer
class EncodeRule extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: this.props.match.params.id,
      selectedRowIndex: -1,
      showModal:false,
    }
    this.changeTable = this.changeTable.bind(this)
    this.addPubBcrInfoAndUpdate = this.addPubBcrInfoAndUpdate.bind(this)
    this.mdmNowUrl = window.mdmNowUrl + '';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id && nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({
        id: nextProps.match.params.id
      })
    }
  }

  onBack = async() => {
    window.location.href = this.mdmNowUrl;
    // window.history.go(-1);
  }

  componentDidMount() {
    this.props.entityContentStore.resetCodeRulesTable()
    this.props.entityContentStore.getTables(this.props.match.params.id)
  }

  onSelect = (value, { props: { item } }) => {
    this.changeTable(item)
  };

  async changeTable(item) {
    await this.props.entityContentStore.getEntity(item.value)
    const { entity } = this.props.entityContentStore.codeRulesTable
    await this.props.entityContentStore.hasUseBillCode(entity.pk_mdentity)
    const { flag } = this.props.entityContentStore.codeRulesTable
    if(flag)
    {
      const postData={
        "pkAssign":"",
        "billObjCode":entity.code//实际是code 实体的code
      };
      await this.props.entityContentStore.getBillCodeType(postData)
      await this.props.entityContentStore.getTableData(item.value)
    }else{
      this.setState({
        showModal: true
      })
    }
  }

  close =() =>{
    this.setState({
      showModal: false
    })
  }

  saveModel =() => {
    this.addPubBcrInfoAndUpdate(false)
    this.setState({
      showModal: false
    })
  }

  save =() => {
    this.addPubBcrInfoAndUpdate(true)
  }

  // 渲染下拉框
  renderColumnsSelect = (text, record, index) => {
    const { codeModel } = this.props.entityContentStore.codeRulesTable
    const codeType = codeModel == "preCode"? 1 : codeModel == "behCode"? 2 :0
    let _options = []
    const { billcodetype } = record
    let billCodeText = ""
    const defaultModelText = <FormattedMessage id="jjs.rou.cus1.0001" defaultMessage="默认无编码" />
    if(codeModel == "preCode"){
      billCodeText = <FormattedMessage id="js.rou.cus1.0002" defaultMessage="前编码" />
    }else if(codeModel == "behCode"){
      billCodeText = <FormattedMessage id="js.rou.cus1.0003" defaultMessage="后编码" />
    }
    if(billcodetype == 1 || billcodetype == 2){
      _options.push(<Option value={billcodetype} item={record} key={billcodetype}>{billCodeText}</Option>)
      _options.push(<Option value={0}>{defaultModelText}</Option>)
    }else{
      _options.push(<Option value={0} key={0}>{defaultModelText}</Option>)
      if(codeType !=0 )
        _options.push(<Option value={codeType} item={record} key={codeType}>{billCodeText}</Option>)
    }
    return <Select
              // value = {billcodetype}
              value={(billcodetype == 1 || billcodetype == 2)?codeType:0}
              defaultValue={(billcodetype == 1 || billcodetype == 2)?codeType:0}
              onSelect={this.onSelectChange(index, record)}
            >
            {_options}
            </Select>
}

  getCodeModel =(codeModel) => {

  }

  // 下拉选择
  onSelectChange = (index, record) => {
    return (value, {props:{item}}) => {
        const { info } = this.props.entityContentStore.codeRulesTable
        info.map((item, i) => {
          if(i == index){
            item.billcodetype = value
          }else{
            item.billcodetype = 0
          }
        });
        this.props.entityContentStore.setTableInfo(JSON.parse(JSON.stringify(info)))
    };
  };

  async addPubBcrInfoAndUpdate(isExistBillCode){
    let { entity,entity_items,info } = this.props.entityContentStore.codeRulesTable
    let attributeList = []
    entity_items.map((item) =>{
      attributeList.push({
        code: item.code,
        name: item.name
      })
    })
    let postData = {
      code: entity.code,
      name: entity.name,
      attributeList: attributeList

    }
    await this.props.entityContentStore.addPubBcrInfo(postData,isExistBillCode)
    //entity.usebillcode = true
  }

  render() {
    const { id,showModal } = this.state
    const { selectDataSource } = this.props.entityContentStore.codeRulesTable
    let body = this.props.entityContentStore.codeRulesTable.info;
    let columns = [
      {
        title: <FormattedMessage id="js.rou.cus1.0004" defaultMessage="字段编码" />,
        dataIndex: "code",
        key: "code",
        width: "250px",
      },
      {
        title: <FormattedMessage id="js.rou.cus1.0005" defaultMessage="字段名称" />,
        dataIndex: "name",
        key: "name",
        width: "250px",
      },
      {
        title: <FormattedMessage id="js.rou.cus1.0006" defaultMessage="编码类型" />,
        dataIndex: "billcodetype",
        key: "billcodetype",
        width: "250px",
        render: (text, record, index) => this.renderColumnsSelect(text, record, index)
      }
    ];
    return (
      <div className="main">
        <Header title={this.props.intl.formatMessage({id:"js.rou.cus1.0007", defaultMessage:"配置业务编码规则"})} back={true}>
          <span className="main-data-btn">
            <Button size={"sm"} bordered className='thirdlevel-btn' onClick={this.onBack}><FormattedMessage id="js.rou.cus1.0008" defaultMessage="取消" /></Button>
            <Button colors="primary" size={"sm"} className='head-save' onClick={this.save}><FormattedMessage id="js.rou.cus1.0009" defaultMessage="保存" /></Button>
          </span>
        </Header>
        <div className="section-wrap">
          {/* <div className="section-wrap-l">
            <Siderbartree
              root={{id: '0', name: '主数据分类', isparent: true}}
              expendId={id}
            />
          </div> */}
          <div className="section-wrap-r encode-rule">
            {/* <div className="section-wrap-r-header">
              <h5 className="section-wrap-r-title">
                配置业务编码规则
              </h5>
              <div className="main-data-btn">
                  <Button colors="primary" size={"sm"} className='head-cancel' onClick={this.onBack}>返回</Button>
                  <Button colors="primary" size={"sm"} className='head-save' onClick={this.save}>保存</Button>
              </div>
            </div> */}
            <div className="left-button-group">
              <Label>{<FormattedMessage id="js.rou.cus1.0011" defaultMessage="主子表：" />}</Label>
              <Select
                style={{ width: 200,marginRight:16+'px' }}
                placeholder={this.props.intl.formatMessage({id:"js.rou.cus1.0010", defaultMessage:"请选择"})}
                onSelect={this.onSelect}
                >
                {
                    selectDataSource.map(da => <Option key={da.value} value={da.text} item={da} >{da.text}</Option>)
                }
            </Select>
              <Label>{<FormattedMessage id="js.rou.cus1.0012" defaultMessage="(说明：第一个为主表，其他为子表)" />}(说明：第一个为主表，其他为子表)</Label>
          </div>
          <Table
              columns={columns}
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
              //onRowClick={this.rowclick}
            />
          </div>
        </div>
        <Modal
            show={showModal}
            onHide={this.close}
            style={{width: 500}}
            className="publish-modal"
            backdropClosable={false}
            >
            <Modal.Header className="text-center" closeButton>
                <Modal.Title style={{textAlign: 'left'}}>
                <FormattedMessage id="js.rou.cus1.0013" defaultMessage="启用业务编码" />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="ref-modal-body">
                <Row><FormattedMessage id="js.rou.cus1.0014" defaultMessage="是否启用业务编码？" /></Row>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <Button bordered style={{ marginRight: 20 }} onClick={this.close}>
                    <FormattedMessage id="js.rou.cus1.0008" defaultMessage="取消" />
                </Button>
                <Button colors="primary" onClick={this.saveModel}>
                    <FormattedMessage id="js.rou.cus1.0015" defaultMessage="确认" />
                </Button>
            </Modal.Footer>
            </Modal>
      </div>
    )
  }
}

export default EncodeRule;
