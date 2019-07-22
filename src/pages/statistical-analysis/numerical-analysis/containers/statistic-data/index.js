import React, { Component } from 'react';

import ReactEcharts from 'echarts-for-react';

import { Col, Row, Button, Tile  } from 'tinper-bee';

import FilterMasterModal from '../filterMasterDataByTree'
// import MasterNum from '../masterNum'
// import DataFlowChart from '../dataFlowChart'
// import LoadAndDistriTrendGraph from '../loadAndDistriTrendGraph'


import Option1 from './option1.js'
import Option2 from './option2.js'
import Option3 from './option3.js'
import Option3_1 from './option3_1.js'
import Option3_2 from './option3_2.js'



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

@withRouter

@inject((stores) => {
  return {
    designStore: stores.designStore
  }
}) @observer

class StatisticData extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    };
    this.echarts_react1 = null;
    this.echarts_react2 = null;
    this.echarts_react3 = null;
  }

  async componentDidMount() {

    let { designStore } = this.props
    let { currentShowSelectedKeys } = designStore.custom

    if (currentShowSelectedKeys.length === 0) {
      await designStore.canStatisticsMdm()
    }
    await designStore.queryDesignCount() // 查第一副图数据

    await this.update1()

    await this.props.designStore.queryAuthorityByPkgdAndCond()
    await this.update2()

    await this.props.designStore.queryDisNum("allSys")
    await this.props.designStore.queryLoadNum("allSys")
    await this.update3()
  }

  update1 = () => {
    let { designStore } = this.props
    let { xyDatas } = designStore.custom
    let datas = xyDatas

    let yData = [];
    let seriesData = [];
    for (let i = 0; i < datas.length; i++) {
      yData.push(datas[i].name);
      seriesData.push(datas[i].count);
    }

    if (this.echarts_react1) {
      // this. echarts_react1   .getEchartsInstance() 获取echarts实例对象，然后可以使用任何echarts API
      let echarts_instance1 = this.echarts_react1.getEchartsInstance()
      Option1.yAxis[0].data = yData
      Option1.series[0].data = seriesData

      echarts_instance1.setOption(Option1)
      this.props.designStore.custom.echarts_instance1 = echarts_instance1
    }
  }

  update2 = () => {

    let {
      load_sysregisters,
      dis_sysregisters
    } = this.props.designStore.twoPictureClick

    let { data } = this.props.designStore.onePictureClick

    let graph_data = [], graph_links = []
    graph_data.push({ // 主数据节点
      type: 'mdm',
      pk_gd: data.pk_gd,
      code: data.code,
      name: data.name + "主数据",
      x: 550,
      y: 300
    });

    if ( undefined != load_sysregisters) {
      for (var i = 0; i < load_sysregisters.length; i++) {
        if (load_sysregisters.length == 1) {
          graph_data.push({
            type: 'load',
            pk_sysregister: load_sysregisters[i].pk_sysregister,
            code: load_sysregisters[i].code,
            name: load_sysregisters[i].name + "来源系统",
            x: 550 + i * 100,
            y: 100
          });
        } else {
          if (i % 2 == 0) {
            graph_data.push({
              type: 'load',
              pk_sysregister: load_sysregisters[i].pk_sysregister,
              code: load_sysregisters[i].code,
              name: load_sysregisters[i].name + "来源系统",
              x: 550 - (i / 2 + 1) * 200,
              y: 100
            });
          } else {
            graph_data.push({
              type: 'load',
              pk_sysregister: load_sysregisters[i].pk_sysregister,
              code: load_sysregisters[i].code,
              name: load_sysregisters[i].name + "来源系统",
              x: 550 + (i / 2) * 200,
              y: 100
            });
          }
        }
        graph_links.push({
          type: 'load',
          pk_sysregister: load_sysregisters[i].pk_sysregister,
          code: load_sysregisters[i].code, // 系统向主数据 code为系统code
          source: load_sysregisters[i].name + "来源系统",
          target: data.name + "主数据"
        });
      }
    }

    if (undefined != dis_sysregisters) {
      for (var i = 0; i < dis_sysregisters.length; i++) {
        
        if (dis_sysregisters.length == 1) {
          graph_data.push({
            type: 'dis',
            pk_sysregister: dis_sysregisters[i].pk_sysregister,
            code: dis_sysregisters[i].code,
            name: dis_sysregisters[i].name + "分发系统",
            x: 550 + i * 100,
            y: 500
          });
        } else {
          if (i % 2 == 0) {
            graph_data.push({
              type: 'dis',
              pk_sysregister: dis_sysregisters[i].pk_sysregister,
              code: dis_sysregisters[i].code,
              name: dis_sysregisters[i].name + "分发系统",
              x: 550 - (i / 2 + 1) * 200,
              y: 500
            });
          } else {
            graph_data.push({
              type: 'dis',
              pk_sysregister: dis_sysregisters[i].pk_sysregister,
              code: dis_sysregisters[i].code,
              name: dis_sysregisters[i].name + "分发系统",
              x: 550 + (i / 2) * 200,
              y: 500
            });
          }
        }
        graph_links.push({
          type: 'dis',
          pk_sysregister: dis_sysregisters[i].pk_sysregister,
          code: dis_sysregisters[i].code,// 主数据向系统  code为系统code
          source: data.name + "主数据",
          target: dis_sysregisters[i].name + "分发系统"
        });
      }
    }

    if (this.echarts_react2) {
      // this.echarts_react.getEchartsInstance() 获取echarts实例对象，然后可以使用任何echarts API
      let echarts_instance2 = this.echarts_react2.getEchartsInstance()

      Option2.series[0].data = graph_data
      Option2.series[0].links = graph_links

      echarts_instance2.setOption(Option2)
      this.props.designStore.custom.echarts_instance2 = echarts_instance2
    }

  }

  update3 = () => {// 所有系统装载和分发总量图三更新
 
    let { disDatas, loadDatas } = this.props.designStore.threePictureClick

    let date1 = disDatas.date
    let date = [], tempDate
    for(let i=0; i<date1.length; i++){
      tempDate = date1[i]
      date.push(tempDate.substr(2,tempDate.length-1))
    }

    let series_data1 = loadDatas.series[0]  
    let series_data2 = disDatas.series[0]

    let legend_data = [];
    let xAxis_data = [];
    for(let i=0; i<date.length; i++){
      xAxis_data.push( i%2 != 0 ? date[i] : '\n' + date[i] )
    }

   
    legend_data.push(series_data1.name + '装载量', series_data2.name + '分发量');
    series_data1.name = legend_data[0]
    series_data1.type = 'bar'
    series_data1.markPoint = {
      data: [
        { type: 'max', name: '最大值' },
        { type: 'min', name: '最小值' }
      ]
    };
    series_data1.markLine = {
      data: [
        { type: 'average', name: '平均值' }
      ]
    };
    
   
    series_data2.name = legend_data[1]
    series_data2.type = 'line'
    series_data2.markPoint = {
      data: [
        { type: 'max', name: '最大值' },
        { type: 'min', name: '最小值' }
      ]
    }
    series_data2.markLine = {
      data: [
        { type: 'average', name: '平均值' }
      ]
    }
   
    let series_data = []
    series_data.push(series_data1)
    series_data.push(series_data2)

    if (this.echarts_react3) {
      // this.echarts_react.getEchartsInstance() 获取echarts实例对象，然后可以使用任何echarts API
      let echarts_instance3 = this.echarts_react3.getEchartsInstance()

      Option3.legend.data = legend_data
      Option3.xAxis[0].data = xAxis_data
      Option3.series = series_data

      echarts_instance3.setOption(Option3)
      this.props.designStore.custom.echarts_instance3 = echarts_instance3
    }
  }

  update3_1 = () => {// 刷新图三为单个主数据单个系统的装载图
    let { loadDatas } = this.props.designStore.threePictureClick
    let date1 = loadDatas.date
    let date = [], tempDate
    for(let i=0; i<date1.length; i++){
      tempDate = date1[i]
      date.push(tempDate.substr(2,tempDate.length-1))
    }

    let series_data1 = loadDatas.series[0]

    let legend_data = [];
    let xAxis_data = [];
    for(let i=0; i<date.length; i++){
      xAxis_data.push( i%2 != 0 ? date[i] : '\n' + date[i] )
    }
  
    legend_data.push(series_data1.name + '装载量');
    series_data1.name = legend_data[0]
    series_data1.type = 'bar'
    series_data1.markPoint = {
      data: [
        { type: 'max', name: '最大值' },
        { type: 'min', name: '最小值' }
      ]
    }
    series_data1.markLine = {
      data: [    
        { type: 'average', name: '平均值' }
      ]
    }
   
    let series_data = []
    series_data.push(series_data1)

    if (this.echarts_react3) {
      // this.echarts_react.getEchartsInstance() 获取echarts实例对象，然后可以使用任何echarts API
      let echarts_instance3 = this.echarts_react3.getEchartsInstance()

      Option3_1.legend.data = legend_data
      Option3_1.xAxis[0].data = xAxis_data
      Option3_1.series = series_data

      echarts_instance3.clear()
      echarts_instance3.setOption(Option3_1)
      this.props.designStore.custom.echarts_instance3 = echarts_instance3
    }
  }

  update3_2 = () => {// 刷新图三为单个主数据单个系统的分发图
    let { disDatas } = this.props.designStore.threePictureClick
    let date1 = disDatas.date
    let date = [], tempDate
    for(let i=0; i<date1.length; i++){
      tempDate = date1[i]
      date.push(tempDate.substr(2,tempDate.length-1))
    }

    let series_data2 = disDatas.series[0]

    let legend_data = [];
    let xAxis_data = [];
    for(let i=0; i<date.length; i++){
      xAxis_data.push( i%2 != 0 ? date[i] : '\n' + date[i] )
    }
   
    legend_data.push(series_data2.name + '分发量');
    series_data2.name = legend_data[0]
    series_data2.type = 'line'
    series_data2.markPoint = {
      data: [
        { type: 'max', name: '最大值' },
        { type: 'min', name: '最小值' }
      ]
    };
    series_data2.markLine = {
      data: [
        { type: 'average', name: '平均值' }
      ]
    };
    
    let series_data = []
    series_data.push(series_data2)

    if (this.echarts_react3) {
      // this.echarts_react.getEchartsInstance() 获取echarts实例对象，然后可以使用任何echarts API
      let echarts_instance3 = this.echarts_react3.getEchartsInstance()

      Option3_2.legend.data = legend_data
      Option3_2.xAxis[0].data = xAxis_data
      Option3_2.series = series_data

      echarts_instance3.clear()
      echarts_instance3.setOption(Option3_2)
      this.props.designStore.custom.echarts_instance3 = echarts_instance3
    }
  }

  update31 = () => {// 相当于多个系统同时显示各自数量
    // threePictureClick.disDatas
    let { disDatas, loadDatas } = this.props.designStore.threePictureClick
    let date1 = disDatas.date
    let date = [], tempDate
    for(let i=0; i<date1.length; i++){
      tempDate = date1[i]
      date.push(tempDate.substr(2,tempDate.length-1))
    }

    let series_data1 = disDatas.series
    let series_data2 = loadDatas.series

    let legend_data = ['分发量', '装载量'];
    let xAxis_data = [];
    for(let i=0; i<date.length; i++){
      xAxis_data.push( i%2 != 0 ? date[i] : '\n' + date[i] )
    }

    for (let i = 0; i < series_data1.length; i++) {
      legend_data.push(series_data1[i].name + '分发量', series_data2[i].name + '装载量');
      series_data1[i].name = legend_data[0]
      series_data1[i].type = 'bar'
      series_data1[i].markPoint = {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      };
      series_data1[i].markLine = {
        data: [
          { type: 'average', name: '平均值' }
        ]
      };
    }
    for (let i = 0; i < series_data2.length; i++) {
      series_data2[i].name = legend_data[1]
      series_data2[i].type = 'line'
      series_data2[i].markPoint = {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      }
      series_data2[i].markLine = {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    }
    let series_data = series_data1.concat(series_data2)

    if (this.echarts_react3) {
      // this.echarts_react.getEchartsInstance() 获取echarts实例对象，然后可以使用任何echarts API
      let echarts_instance3 = this.echarts_react3.getEchartsInstance()

      Option3.legend.data = legend_data
      Option3.xAxis[0].data = xAxis_data
      Option3.series = series_data

      echarts_instance3.setOption(Option3)
      this.props.designStore.custom.echarts_instance3 = echarts_instance3
    }
  }

  handleClick = () => {
    this.props.designStore.custom.showModal = true
    // this.props.designStore.custom.checkSelectedKeys = []
  }

  onChartClick1 = async (param, echarts) => { // 

    this.props.designStore.onePictureClick.index = param.dataIndex
    this.props.designStore.onePictureClick.pk_gd = this.props.designStore.custom.xyDatas[param.dataIndex].pk_gd
    this.props.designStore.onePictureClick.data = this.props.designStore.custom.xyDatas[param.dataIndex]

    await this.props.designStore.queryAuthorityByPkgdAndCond()
    await this.update2()

    await this.props.designStore.queryDisNum("allSys")
    await this.props.designStore.queryLoadNum("allSys")
    await this.update3()
  }

  onChartClick2 = async (param, echarts) => { 

    let { designStore } =  this.props
    if('load' === param.data.type){
      designStore.twoPictureClick.load_pk_sysregisters = param.data.pk_sysregister
      designStore.twoPictureClick.dis_pk_sysregisters = ''
      await designStore.queryLoadNum('oneSys')
      // await designStore.queryDisNum('oneSys')
      await this.update3_1();
    }
    if('dis' === param.data.type){
      designStore.twoPictureClick.dis_pk_sysregisters = param.data.pk_sysregister
      designStore.twoPictureClick.load_pk_sysregisters = ''
      await designStore.queryDisNum('oneSys')
      // await designStore.queryLoadNum('oneSys')
      await this.update3_2();
    }     
  }

  onChartClick3 = (param, echarts) => { //     
  }

  render() {
    let onEvents1 = {
      'click': this.onChartClick1,
    }

    let onEvents2 = {
      'click': this.onChartClick2,
    }

    let onEvents3 = {
      'click': this.onChartClick3,
    }

    let { showModal } = this.props.designStore.custom

    return (
      <Row className="tile_panel" >
          <Col md={7} xs={7} sm={7} className='left_p'
            >        
            <Tile border={false}>
                <FilterMasterModal showModal={showModal} update1={this.update1} update2={this.update2} update3={this.update3} />
                <div className="button-group">
                  <Button colors="primary" 
                    // icon="download" 
                    onClick={this.handleClick}>
                    自定义
                </Button>
                </div>
                <ReactEcharts
                  ref={(e) => { this.echarts_react1 = e; }}
                  option={Option1}
                  style={{ height: '604px'}}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={"theme_name"}
                  onEvents={onEvents1}
                />
            </Tile>  
          </Col>
          <Col md={5} xs={5} sm={5} className='right_p' style={{width: '40%'}}>
              <Tile border={false}>
                <ReactEcharts
                    ref={(e) => { this.echarts_react2 = e; }}
                    option={Option2}
                    // style={{ height: '600px', left: '-100px' }}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"}
                    onEvents={onEvents2}
                  />
              </Tile>
            
              <Tile className='right_p_bottom' border={false}>
                  <ReactEcharts
                    ref={(e) => { this.echarts_react3 = e; }}
                    option={Option3}
                    // style={{ height: '600px', left: '-100px' }}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"}
                    onEvents={onEvents3}
                  />
              </Tile>
          </Col>
      </Row>
    )
  }
}

export default StatisticData; 
