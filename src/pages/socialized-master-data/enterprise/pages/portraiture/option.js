const count = 5

const data = [{
    name: '概况',
    itemStyle: {
        color: '#1E88E5'
    },
    children: [{
        name: '工商信息',
        itemStyle: {
            color: '#42A5F5'
        },
        children: [{
            name: '企业基本信息',
            value: 1,
            dataType: 1, 
            key: 'baseinfo',
            // label:{
            //     formatter: [
            //         '{b|{b}}'
            //     ].join('\n'),
            //     backgroundColor: '#ccc',
            //     borderColor: '#aaa',
            //     borderWidth: 1,
            //     borderRadius: 4,
            //     distance:15,
            //     color:"#000",
            //     rich:{
            //         b: {
            //             width:80,
            //             lineHeight: 22,
            //             align: 'center'
            //         },
            //     },
            // },
            itemStyle: {
                color: '#90CAF9'
            }
        },
        //{
            // name: '主要人员',
            // value: 1,
            // dataType: 2, 
            // key: 'baseinfo',
            // itemStyle: {
            //     color: '#f99e1c'
            // }
        //}
        {
            // name: '股东信息\n    ' + count + '条',
            name: '股东信息',
            value: 1,
            dataType: 2, 
            key: 'holder',
            itemStyle: {
                color: '#90CAF9'
            }
        },
        //{
            // name: '对外投资',
            // value: 1,
            // dataType: 2, 
            // key: 'holder',
            // itemStyle: {
            //     color: '#f99e1c'
            // }
        //}
        {
            name: '变更记录',
            value: 1,
            dataType: 2, 
            key: 'changeRecord',
            itemStyle: {
                color: '#90CAF9'
            }
        }
        // {
        //     name: '实际控制权',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#f99e1c'
        //     }
        // },
        // {
        //     name: '最终控制人',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#f99e1c'
        //     }
        // }
        ]
    }, {
        name: '企业发展',
        itemStyle: {
            color: '#42A5F5'
        },
        children: [{
            name: '融资历史',
            value: 1,
            dataType: 2, 
            key: 'financingHistory',
            itemStyle: {
                color: '#90CAF9'
            }
        }, 
        // {
        //     name: '核心团队',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#ef5a78'
        //     }
        // }
        {
            name: '投资事件',
            value: 1,
            dataType: 2, 
            key: 'investmentEvent',
            itemStyle: {
                color: '#90CAF9'
            }
        }
        ]
    }, {
        name: '经营状况',
        itemStyle: {
            color: '#42A5F5'
        },
        children: [
        // {
        //     name: '行政许可',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#f99e1c'
        //     }
        // }
        {
            name: '税务评级',
            value: 1,
            dataType: 2, 
            key: 'taxcredit',
            itemStyle: {
                color: '#90CAF9'
            }
        }
        // {
        //     name: '资质证书',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#f7f1bd'
        //     }
        // }
        ]
    }]
}, {
    name: '风控',
    itemStyle: {
        color: '#13C2C2'
    },
    label: {
        color: '#000'
    },
    children: [{
        name: '司法风险',
        itemStyle: {
            color: '#5CDBD3'
        },
        label: {
            color: '#000'
        },
        children: [
        // {
        //     name: '开庭公告',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#3e0317'
        //     }
        // }, 
        // {
        //     name: '判决文书',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#e62969'
        //     }
        // },
        {
            name: '被执行人',
            value: 1,
            dataType: 2, 
            key: 'zhixinginfo',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        }, 
        {
            name: '失信执行人',
            value: 1,
            dataType: 2, 
            key: 'dishonest',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        }, 
        {
            name: '法院公告',
            value: 1,
            dataType: 2, 
            key: 'courtAnnouncement',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        }
        ]
    }, {
        name: '经营风险',
        itemStyle: {
            color: '#5CDBD3'
        },
        label: {
            color: '#000'
        },
        children: [
        // {
        //     name: '司法协助',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#b53b54'
        //     }
        // }, 
        {
            name: '经营异常',
            value: 1,
            dataType: 2, 
            key: 'abnormal',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        }, 
        {
            name: '行政处罚',
            value: 1,
            dataType: 2, 
            key: 'punishment',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        }, 
        {
            name: '严重违法',
            value: 1,
            dataType: 2, 
            key: 'illegalinfo',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        }, 
        {
            name: '股权出质',
            value: 1,
            dataType: 2, 
            key: 'equityinfo',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        }, 
        {
            name: '动产抵押',
            value: 1,
            dataType: 2, 
            key: 'mortgageinfo',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        }, 
        {
            name: '欠税公告',
            value: 1,
            dataType: 2, 
            key: 'owntax',
            itemStyle: {
                color: '#87E8DE'
            },
            label: {
                color: '#13C2C2'
            },
        } 
        // {
        //     name: '司法拍卖',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#ba9232'
        //     }
        // }, 
        // {
        //     name: '清算信息',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#8eb646'
        //     }
        // }, 
        // {
        //     name: '知识产权处出质',
        //     value: 1,
        //     dataType: 2, 
        //     key: 'holder',
        //     itemStyle: {
        //         color: '#d0b24f'
        //     }
        // }
        ]
    }
    // {
    //     name: '“友”风险',
    //     itemStyle: {
    //         color: '#94a76f'
    //     },
    //     children: [{
    //         name: '风险信息',
    //         value: 1,
    //         dataType: 2, 
    //         key: 'holder',
    //         itemStyle: {
    //             color: '#9ea718'
    //         }
    //     }, {
    //         name: '企业风险',
    //         value: 1,
    //         dataType: 2, 
    //         key: 'holder',
    //         itemStyle: {
    //             color: '#e1c315'
    //         }
    //     }]
    // }
    ]
}]

export default Option = {
        series: {
            type: 'sunburst',
            highlightPolicy: 'ancestor',
            data: data,
            radius: [0, '95%'],
            sort: null,
            levels: [{}, {
                r0: '15%',
                r: '45%',
                itemStyle: {
                    borderWidth: 2
                },
                label: {
                    // rotate: 'tangential'
                }
            }, {
                r0: '45%',
                r: '70%',
                label: {
                    align: 'center'
                }
            }, {
                r0: '70%',
                r: '72%',
                label: {
                    position: 'outside',
                    padding: 3,
                    silent: false,
                    // rotate:0,
                    color:"#1E7BE2",
                    silent: false,
                    fontStyle:"normal",
                    fontSize:14
                },
                itemStyle: {
                    borderWidth: 3
                }
            }]
        } 
}