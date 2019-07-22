import React,{ Component } from 'react';
import Dnd from 'bee-dnd'
import './index.less';
import 'bee-pagination/build/Pagination.css'
import Header from 'components/header'
import {
  inject,
  observer
} from 'mobx-react';

@inject((stores) => {
  return {
    enterpriseBusinessStore:stores.enterpriseBusinessStore
  }
}) @observer
export default class Relation extends Component{
  constructor(props) {
    super(props);
    this.state = {
      corpName: this.props.match.params.name,
    }
    this.showMoreUp = this.showMoreUp.bind(this)
  }

  componentDidMount(){
    var name = this.props.match.params.name;
    this.props.enterpriseBusinessStore.resetSearchValue(name, name)
    this.props.enterpriseBusinessStore.getHodler(name, 0, true)
    this.props.enterpriseBusinessStore.getRelationship(name, 0, true)
  }

  componentDidUpdate() {
    const { ifMoveCenter } = this.props.enterpriseBusinessStore
    if(ifMoveCenter) {
        //document.getElementById('invest_tree_company_name').scrollIntoView()
    }
  }

  getComputedPosition(position, index, len) {
    if(len%2 === 0) {
      let center = len/2
      return (index-center)*190+95+position
    } else {
      let center = (len-1)/2
      return (index-center)*190+position
    }
  }
  // 请求更多
  showMoreUp(holderName, position, index, len, isDown, arr_index) {
    if(isDown) {
      this.props.enterpriseBusinessStore.splitRelationship(arr_index)
      let newPosition = this.getComputedPosition(position, index, len)
      this.props.enterpriseBusinessStore.getRelationship(holderName,newPosition)
    } else {
      this.props.enterpriseBusinessStore.splitHodler(arr_index)
      let newPosition = this.getComputedPosition(position, index, len)
      this.props.enterpriseBusinessStore.getHodler(holderName,newPosition)
    }
  }

  computedSymbol(arr, position, isDown) {
    return (
      <ul className="invest_tree_more_group">
        {
          arr.map((item, index) => <li className={!item.hasChildren?'has_no_more':'dnd-cancel'} key={`symbol-up-${item.id}`} onClick={ item.hasChildren?() => this.showMoreUp(item.holderName, position, index, arr.length, isDown, item.arrIndex):null}></li>)
        }
      </ul>
    )
  }

  computedContent(arr) {
    return (
      <ul className="invest_tree_content">
        {
          arr.map(item => (
            <li key={`holder-up-${item.id}`}>
              <div className="invest_tree_content-inner">
                <p>
                  {item.holderName}
                </p>
                <p className="invest_tree_p">
                  <span>
                    持股数：
                  </span>
                    {item.amomon}
                </p>
                <p>
                  <span>
                    持股：
                  </span>
                    {item.moneyPercent}
                </p>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }

  computedArrow(arr) {
    return arr.length > 1 ?
      (<ul className="invest_tree_arrow-up">
        {
          arr.map((item) => {
            return (<li key={`holder-arrow-${item.id}`}>
              <p className="invest_tree_border-bottom"></p>
            </li>)
          })
        }
      </ul>
    ) : null
  }

  computedArrowDown(){
    return (
      <div className="invest_tree_arrow-down">

      </div>
    )
  }

  computedHolder(arr, position, random) {

    return (
      <div key={random} style={{position:'relative',left:position+'px'}}>
        {
          this.computedSymbol(arr, position, false)
        }
        {
          this.computedContent(arr)
        }
        {
          this.computedArrow(arr, false)
        }
        {
          this.computedArrowDown()
        }
      </div>
    )
  }

  computedDashed(arr) {
    return arr.length > 1 ? (
      <ul className="invest_tree_arrow">
        {
          arr.map((item) => {
            return (<li key={`holder-arrow-${item.id}`}>
              <p className="invest_tree_border-top"></p>
            </li>)
          })
        }
      </ul>
    ) : null
  }

  computedRelationship(arr, position, index, len) {
    return (
      <div key={index} style={{position:'relative',left:position+'px'}}>

        {
          this.computedArrowDown()
        }

          {
            this.computedDashed(arr)
          }

          {
            this.computedContent(arr)
          }

          {
            this.computedSymbol(arr, position, true)
          }

      </div>
    )
  }

  render(){
    const enterpriseBusinessStore = this.props.enterpriseBusinessStore
    const { investTreeData } = enterpriseBusinessStore
    const holders = investTreeData.holders
    const relationships = investTreeData.relationships
    let width;
    if(holders.length>0&&relationships.length>0){
      width = Math.max(holders[0].content.length, relationships[0].content.length)*190
      const ele = document.documentElement || document.body
      const bodywidth = ele.clientWidth
      width = Math.max(bodywidth, width)
    }
    return (
      // <div className="main_enterprise">
      <div className="height100">
        <Header title="股权结构" back="true" />
        <section className="section_wrap height100">
            <div className="width-wrap height100">
              <div className="section_social_bottom section_invest_tree height100">
                <Dnd cancel=".dnd-cancel">
                  <div className="section_social_wrap" style={{width: width}}>
                    {
                      holders.map((item) => {
                        return this.computedHolder(item.content, item.position, item.mathRandom)
                      })
                    }
                    <div className="invest_tree_company_name" id="invest_tree_company_name">
                      {
                        holders.length>0||relationships.length>0?enterpriseBusinessStore.enterpriseSearch.realValue:null
                      }
                    </div>
                    {
                      relationships.map((item, index) => {
                        return this.computedRelationship(item.content, item.position, index, relationships.length-1)
                      })
                    }
                  </div>
                </Dnd>
              </div>
            </div>
          </section>
      </div>
      // </div>
    )
  }
}
