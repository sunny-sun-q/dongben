import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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

import {  Label } from 'tinper-bee'
import {Button} from 'components/tinper-bee';
import Siderbartree from 'components/tree/index.js'
import flowEmptyUrl from 'src/assets/images/entityModel/no-process.png'
import { FormattedMessage,injectIntl } from 'react-intl'
import {getContextId} from 'utils';
const contextId = getContextId();
@withRouter

@inject((stores) => {
  return {
    treeStore: stores.treeStore,
    flowModelStore: stores.flowModelStore
  }
}) @observer
class Leaf extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: this.props.match.params.id,
      code: this.props.match.params.code,
      iframeSrc: "",
      iFrameHeight: '100%'
    }
    this.processDesign = this.processDesign.bind(this)
    this.processPush = this.processPush.bind(this)
    this.getIframeSrc =  this.getIframeSrc.bind(this)
  }

  async getIframeSrc(code){
    const baseSrc = "../../../eiap-plus/vendor/diagram-viewer/index.html?processDefinitionId="
    await this.props.flowModelStore.getProcessDefinitionId(code || this.state.code)
    const { processDefinitionId } = this.props.flowModelStore.flowModelata
    if(processDefinitionId){
      this.setState({
        iframeSrc: baseSrc + processDefinitionId
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id && nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({
        id: nextProps.match.params.id,
        code: nextProps.match.params.code
      })
      this.getIframeSrc(nextProps.match.params.code)
    }
  }

  componentDidMount() {
    const { id } = this.state
    if(id && id != ""){
      this.getIframeSrc()
    }
  }

  async processDesign() {
    await this.props.flowModelStore.processDesigner(this.state.code)
    let url = "../../../ubpm-web-process-designer/process-designer/index.html#/processDesigner?modelId=" + this.props.flowModelStore.flowModelata.modelId + "&tokn=token&source=iuap"
    window.open(url)
  }

  async processPush() {
    await this.props.flowModelStore.publishProcess(this.state.code)

    this.getIframeSrc(this.state.code)
  }

  componentWillUnmount() {
    this.timeInterval && clearInterval(this.timeInterval)
  }

  render() {
    const { nodeLeaf } = this.props.treeStore
    const { id, iframeSrc } = this.state
    const { processDefinitionId } = this.props.flowModelStore.flowModelata
    let self = this
    console.log('this.state.iFrameHeight', this.state.iFrameHeight)
    let text = contextId === 'mdm'? this.props.intl.formatMessage({id:"js.rou.cus1.0016", defaultMessage:"主数据分类"}) : this.props.intl.formatMessage({id:"js.rou.cus1.0017", defaultMessage:"自定义档案"});
    return (
      <div className="main">
        <section className="section-wrap">
          <div className="section-wrap-l">
            <Siderbartree
              root={{ id: '0', name: text, isparent: true }}
              expendId={id}
              ifNoHover={true}
              filterOption={{publishedFlow:true}}
            />
          </div>
          <div className="section-wrap-r">
            <div className="button-group">
              <Button colors="primary" onClick={() => this.processDesign()}>
                流程设计
              </Button>
              <Button colors="primary" onClick={() => this.processPush()}>
                流程发布
              </Button>
            </div>
            <div className = "flow-model" style={{
              height: 'calc(100% - 43px)'
            }}>
            {
              processDefinitionId ? (
                <iframe
                  style={{width:'100%', minHeight:this.state.iFrameHeight, overflow:'auto'}}
                  style={{width:'100%', overflow:'auto'}}
                  onLoad={() => {

                      // const obj = ReactDOM.findDOMNode(this);
                      if (self._iframe) {
                        this.timeInterval = setInterval(() => {
                          this.setState({
                            // iFrameHeight: self._iframe.contentWindow.document.documentElement.scrollHeight +'px'
                          })
                        }, 1500)
                      }
                  }}
                  ref={ (iframe) => this._iframe = iframe}
                  src={ iframeSrc }
                  width="100%"
                  height={this.state.iFrameHeight}
                  frameBorder="0"
                />
              ) : <div className="no-data-display">
              <div>
                  <img src={flowEmptyUrl} className="pic"></img>
              </div>
              <div className="word">
                  <FormattedMessage id="js.rou.flow.00222" defaultMessage="您还没有进行流程设计,赶紧去设计吧!" />

              </div>
          </div>
            }

            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default injectIntl(Leaf, {withRef: true});
