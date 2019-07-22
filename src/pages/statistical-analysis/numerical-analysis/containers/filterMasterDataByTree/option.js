/**
 *  竖版柱状图
 */
// let xData = ["demo001", "test102401", "test102402(主子表)", "部门", "字段校验规则测试", "demo002", "民族", "性别", "组织结构"]
// let yData = ["110", "6", "2", "3", "4", "130", "57", "2", "4"] 
let xData = [], yData = []

let data = {
    title: {
        text: '主数据数量统计图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['数据量']
    },
    // grid: {
    //     top: 80,
    //     bottom: 30
    // },
    //   toolbox: {
    //       show : true,
    //       feature : {
    //           mark : {show: true},
    //           orient: 'vertical',
    //           left: 'right',
    //           top: 'center',
    //           dataView : {show: true, readOnly: false},
    //           magicType : {show: true, type: ['line', 'bar']},
    //           restore : {show: true},
    //           saveAsImage : {show: true}
    //       }
    //   },
    calculable: true,
    xAxis: [
        {
            type: 'value',
            splitArea: { show: true }
        }

    ],
    yAxis: [
        {
            type: 'category',
            data: xData,
            axisLabel: {
                interval: 0
            }
        }
    ],
    series: [
        {
            name: '数据量',
            type: 'bar',
            data: yData
        }
    ]
}

export default Option = data