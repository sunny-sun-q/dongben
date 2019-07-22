import React, { Component } from 'react'
import IndexView from './components/IndexView'


import {
  inject,
  observer,
} from 'mobx-react/index';

@inject((stores) => {
  const { ootbHomeStore } = stores;
  return {
    homeStore: ootbHomeStore
  }
})
@observer
class Container extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { homeStore } = this.props;
    homeStore.getConfList()

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
