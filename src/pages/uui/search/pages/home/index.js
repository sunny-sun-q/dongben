import React,{Component} from 'react';
import { FormattedMessage,injectIntl } from 'react-intl'
import {
  withRouter
} from 'react-router-dom';
import {
  inject,
  observer
} from 'mobx-react';

import { ButtonGroup } from 'tinper-bee';
import SeniorSearch from 'components/SeniorSearch';
@withRouter

@inject((stores) => {
  return {
    seniorSearchStore: stores.seniorSearchStore,
    params: stores.params,
  }
}) @observer
class Home extends Component{
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <ButtonGroup className='header-btn-group'>
        <SeniorSearch
            title='生效规则'
            // pk_gd={this.props.params.pk_gd}
            // getData={this.props.params.getDataFun}
            // closeFun={this.props.params.closeFun}
            // autoShow={this.props.params.autoShow}
            // initCondition={this.props.params.initCondition}
            // appendType={this.props.params.appendType}
            // bothAll={this.props.params.bothAll}
            {
              ...this.props.params
            }
            className='header-btn btn-download'
        />
      </ButtonGroup>
    )
  }
}

export default injectIntl(Home, {withRef: true});;;
