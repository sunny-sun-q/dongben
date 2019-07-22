import React, { Component } from 'react'
import { Message } from 'tinper-bee'
import Header from 'components/header'
import CardList from '../CardList'
import './index.less'
const CardItem = CardList.Item;
import AddModal from '../AddModal'
import DelModal from '../DelModal'

import {
  observer,
} from 'mobx-react';

@observer
class IndexView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delItem: null
    }
  }

  setDelItem = (item) => {
    this.setState({delItem: item})
  }


  testConnect = (info) => {
    const { homeStore } = this.props;
    const { testConnect } = homeStore;
    const { confModalStatus } = homeStore.toJS();
    testConnect(info)
      .then(() => {
        if (!confModalStatus) {
          Message.create({
            color: 'success',
            content: '测试连接成功'
          })
        }
      })
      .catch(() => {
        if (!confModalStatus) {
          Message.create({
            color: 'danger',
            content: '测试连接失败'
          })
        }
      })
  }

  delete = () => {
    const { delItem } = this.state;
    const { delConfInfo } = this.props.homeStore;
    delConfInfo({
      pk_obinfo: delItem.pk_obinfo
    })
    this.setDelItem(null)
  }

  createModal = (info) => {
    const { history } = this.props;
    // window.locsation.hash = `/create/${info.pk_obinfo}`
    window.mdmNowUrl = window.location.href;
    history.push({
      pathname: `/create/${info.pk_obinfo}`,
      state: {
        confInfo: info
      }
    })
  }

  render() {
    const { delItem } = this.state;
    const { homeStore } = this.props;
    const { changeConfModalStatus, saveConfInfo } = homeStore;
    const homeState = homeStore.toJS();
    const { dataList, confModalStatus, confInfo, testStatus,addModalAccountList } = homeState;
    return (
      <div>
        {/*<Header title="开箱即用"/>*/}
        <CardList>
          <CardItem
            type="add"
            onClick={changeConfModalStatus.bind(null, null)}
          />
          {dataList.map((item, index) => {
            return (
              <CardItem
                key={index}
                type="data"
                source={item}
                onEdit={changeConfModalStatus.bind(null, item)}
                onDelete={this.setDelItem.bind(null, item)}
                onTest={this.testConnect.bind(null, item)}
                onCreate={this.createModal.bind(null, item)}
              />
            )
          })}

        </CardList>

        <AddModal
          show={confModalStatus}
          confModalStatus={confModalStatus}
          confInfo={confInfo}
          homeStore={homeStore}
          testStatus={testStatus}
          onTest={this.testConnect}
          addModalAccountList = {addModalAccountList}
          onCancel={changeConfModalStatus.bind(null, null)}
          onConfirm={saveConfInfo}
        />

        <DelModal
          show={!!delItem}
          onCancel={this.setDelItem.bind(null, null)}
          onConfirm={this.delete}
        />


      </div>
    )
  }
}
export default IndexView
