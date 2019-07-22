import React,{Component} from 'react';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';
import './index.less'
import {
  inject,
  observer
} from 'mobx-react';

import Header from 'components/header/index.js'
import SocializedMasterDataRoot from '../../containers/SocializedMasterData-root'

@withRouter
/////start///////////
@inject((stores) => {
  return {
    // socialDataStore: stores.socialDataStore,
  }
}) @observer
class Home extends Component{
  constructor(props, context) {
    super(props, context);

    this.linkToPortraiture = this.linkToPortraiture.bind(this)
    this.linkToEquityStructure = this.linkToEquityStructure.bind(this)
  }

  linkToPortraiture() {
    // this.props.enterpriseBusinessStore.resetSearchValue()
    window.mdmNowUrl = window.location.href;
    this.props.history.push('/Portraiture');
  }

  linkToEquityStructure() {
    // this.props.enterpriseBusinessStore.resetSearchValue()
    window.mdmNowUrl = window.location.href;
    this.props.history.push('/relation');
  }
  
  async componentDidMount(){
    
  }

  render() {
    return (
      <div className="enterprise">
        {/* <Header title="客商列表" /> */}
        <section className="section-wrap">
          <div className="section-wrap-r">
            {/* <ul>
              <li onClick={this.linkToPortraiture}>客商画像</li>
              <li onClick={this.linkToEquityStructure}>股权结构</li>
            </ul> */}
            <SocializedMasterDataRoot /> 
          </div>
        </section>
      </div>
    )
  }
}

export default Home;
