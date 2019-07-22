let graph_data =[], graph_links =[]

let data = {
    title: {
        text: '集成视图'
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series : [
        {
            color: ['#40A9FF'],
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            label: {
                normal: {
                    show: true
                }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [1, 8],
            edgeLabel: {
                normal: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            data: graph_data ,
            links:  graph_links,
            lineStyle: {
                normal: {
                    opacity: 0.9,
                    width: 1,
                    curveness: 0,
                    color: '#ccc'
                }
            }
        }
    ]
};

export default Option = data
