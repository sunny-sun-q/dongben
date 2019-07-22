import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from "react";
import { Button, Icon } from "tinper-bee";
import { inject, observer } from 'mobx-react';
import "./index.less";
import { BpmTaskApprovalWrap,BpmWrap } from 'yyuap-bpm';
import { toJS } from 'mobx';

@inject((stores) => {
    return {

    }
  })
class ProcessDetail extends Component {
    constructor(props) {
        super(props);
        this.mdmNowUrl = window.mdmNowUrl + '';

    }

    componentDidMount () {

    }
    onBack =() =>{
        window.location.href = this.mdmNowUrl;
    //   window.history.go(-1);
    }

    render() {
      let id = this.props.match.params.pk_id
      // let id = this.props.match.params.mdm_code+':'+this.props.match.params.pk_gd;
      let processDefinitionId = '';
      let processInstanceId = '';
        return (
            <div className="data-process-detail">
                <div className="section-wrap-r-header">
                    <div className="main-data-btn-back">
                        <Button className='head-cancel' onClick={this.onBack}>
                            <Icon type="uf-anglepointingtoleft"/>
                            <FormattedMessage id="js.rou.hom1.0001" defaultMessage="返回" />
                        </Button>
                    </div>
                    <h5 className="section-wrap-r-title">
                        <FormattedMessage id="js.rou.hom1.0002" defaultMessage="流程图详情" />
                    </h5>
                </div>
                <div className="bpm-chart">
                <BpmWrap
                    id={id}
                    processDefinitionId={processDefinitionId}
                    processInstanceId={processInstanceId}
                />
            </div>

            </div>
        )
    }



}

export default ProcessDetail;
