import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    withRouter
} from 'react-router-dom';
import classnames from 'classnames'

import './index.less'
import {
    inject,
    observer
} from 'mobx-react';
import Header from 'components/header/index.js'
import ReactEcharts from 'echarts-for-react'

import CompanyInfo from '../company-info/index.js'
import PortraitureList from '../portraiture-list/index.js'
import Option from './option.js'

@withRouter

@inject((stores) => {
    return {
        cusinfo: stores.cusinfo
    }
}) @observer
class Portraiture extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            selectedDataType: 1,
            selectedKey: '',
            corpName: this.props.match.params.name,
            title:'企业基本信息'
        }
        this.onChartClick = this.onChartClick.bind(this)
    }

    componentDidMount() {
    }

    renderPanel = () => {
        if (this.state.selectedDataType == 1)
            return <CompanyInfo corpName={this.props.match.params.name} />
        else
            return <PortraitureList corpName={this.props.match.params.name} code={this.state.selectedKey} />
    }

    onChartClick =(e) => {

        // await this.props.cusinfo.getTables(e.data.key, this.props.match.params.name, 10, 1)
        if (e.data) {
            if (e.data.dataType == 1 || e.data.dataType == 2) {
                this.setState({
                    selectedDataType: e.data.dataType,
                    selectedKey: e.data.key,
                    open: true,
                    title: e.data.name,
                })
            }
        }
    }

    closeDialog = () => {
        this.setState({
            open: false
        })
    }

    render() {

        let onEvents = {
            'click': this.onChartClick,
            //'axisareaselected' : this.testClick
        }

        return (

            <div className="main">
                <Header title="客商画像" />
                {/* <button onClick={this.testClick}>click me</button> */}
                <section className="section-wrap">
                    <div className="chartParentClicked" style={{position: 'relative'}}>
                        <ReactEcharts
                            option={Option}
                            style={{ margin: '0 auto', height: '90%', top: '20px'}}
                            
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                            onEvents={onEvents}
                        />
                    </div>
                    <div className="dawerClicked">
                        <div className="dawerHeader">
                            <span className='dawerTitle'>
                                {/* header */}
                                {this.state.title}
                            </span>
                            {/* <i className='uf uf-close-bold' onClick={this.closeDialog} /> */}
                        </div>
                        <div>
                            {this.renderPanel()}
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default Portraiture;
