import React, { Component } from 'react'
import IndexView from './components/IndexView'


import {
  inject,
  observer,
} from 'mobx-react';

@inject((stores) => {
  const { ootbCreateStore } = stores;
  const createState = ootbCreateStore.toJS();
  return {
    createStore: ootbCreateStore,
    createState: createState
  }
})
@observer
class Container extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {
      createStore: { getTreeModel },
      match: { params }
    } = this.props;
    getTreeModel({
      pk_obinfo: params.pk
    })
  }

  componentWillUnmount() {
    const { createStore: {initStore} } = this.props;
    initStore()
  }

  render() {

    return (
      <IndexView
        {...this.props}
      />
    )
  }
}
export default Container
