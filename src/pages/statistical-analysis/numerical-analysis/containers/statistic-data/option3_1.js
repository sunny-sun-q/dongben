let legend_data = [ 'Forest', 'Steppe' ], xAxis_data =[], series_data = []


let data ={
    color: ['#40A9FF'],
    title : {
        text: '数据详情'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data: legend_data
    },
    // toolbox: {
    //     show : true,
    //     feature : {
    //         mark : {show: true},
    //         dataView : {show: true, readOnly: false},
    //         magicType : {show: true, type: ['line', 'bar']},
    //         restore : {show: true},
    //         saveAsImage : {show: true}
    //     }
    // },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : xAxis_data,
            axisLabel:{
                interval: 0
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : series_data
};

export default Option = data