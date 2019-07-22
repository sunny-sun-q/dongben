

import {
  observable,
  action,
} from 'mobx'
import qs from 'qs'
import request from 'utils/request.js'
import { success } from 'utils/index.js'
import { Tooltip } from 'tinper-bee';

export default class Cusinfo {
  @observable tables = {
    code:'',
    datas: [],
    columns: [],
    _columnss: [],
    pageIndex: 1,
    pageSize: 10,
    total: 1,
    totalPages: 1
  }

  @observable defaultColumns = [
    {
      title: "企业名称",
      dataIndex: "columnOne",
      key: "columnOne",
      render: (text, record, index) => {
        return (
          <Tooltip inverse overlay={text}>
            <span tootip={text} style={{
              display: "inline-block",
              width: "173px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
            }}>{text}</span>
          </Tooltip>
        );
    }
    },{
      title: "企业性质",
      dataIndex: "columnTwo",
      key: "columnTwo",
      render: (text, record, index) => {
        return (
          <Tooltip inverse overlay={text}>
            <span tootip={text} style={{
              display: "inline-block",
              width: "173px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
            }}>{text}</span>
          </Tooltip>
        );
    }
    },{
      title: "经营范围",
      dataIndex: "columnThree",
      key: "columnThree",
      render: (text, record, index) => {
        return (
          <Tooltip inverse overlay={text}>
            <span tootip={text} style={{
              display: "inline-block",
              width: "173px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
            }}>{text}</span>
          </Tooltip>
        );
    }
    },{
      title: "成立时间",
      dataIndex: "columnFour",
      key: "columnFour",
      render: (text, record, index) => {
        return (
          <Tooltip inverse overlay={text}>
            <span tootip={text} style={{
              display: "inline-block",
              width: "173px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
            }}>{text}</span>
          </Tooltip>
        );
    }
    },{
      title: "注册时间",
      dataIndex: "columnFive",
      key: "columnFive",
      render: (text, record, index) => {
        return (
          <Tooltip inverse overlay={text}>
            <span tootip={text} style={{
              display: "inline-block",
              width: "173px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
            }}>{text}</span>
          </Tooltip>
        );
    }
    },{
      title: "员工人数",
      dataIndex: "columnSix",
      key: "columnSix",
      render: (text, record, index) => {
        return (
          <Tooltip inverse overlay={text}>
            <span tootip={text} style={{
              display: "inline-block",
              width: "173px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
            }}>{text}</span>
          </Tooltip>
        );
    }
    }
  ]

  @action cleanTableConfig(){
    // 清空数据
    this.tables = {
      datas: [],
      columns: this.defaultColumns,
      _columnss: this.defaultColumns,
      pageIndex: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1
    }
  }

  @action getTables(code, corpName) {
    console.log("点击" + this.tables.pageIndex + "页")
    return new Promise((resolve, reject) => {
      request('/socialmng/clientportrait/detailforselected', {
        method: "GET",
        param: {
          code: code,
          corpName: corpName,
          pageSize: this.tables.pageSize,
          pageIndex: this.tables.pageIndex
        }
      }).then((resp) => {

        if(resp.data.obj){
          let result = resp.data.obj
          let config = result.config[0]
          let _columnss = []
          if(null != result.columns && result.columns.length > 0){
            result.columns.map((item) => {
              if(item.column_name !== "pk_id"){
                if(item.column_desc !== "logo"){
                  _columnss.push(
                    {
                      title: item.column_desc,
                      dataIndex: item.column_name,
                      key: item.column_name,
                      width:200,
                      render: (text, record, index) => {
                        return (
                          <Tooltip inverse overlay={text}>
                            <span tootip={text} style={{
                              display: "inline-block",
                              width: "173px",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              verticalAlign: "middle",
                            }}>{text}</span>
                          </Tooltip>
                        );
                      }
                    }
                  )
                }else{
                  _columnss.push(
                    {
                      title: item.column_desc,
                      dataIndex: item.column_name,
                      key: item.column_name,
                      width:200,
                      render: (text, record, index) => {
                        return (
                          <img src={text} className="image" />
                        )
                      }
                    }
                  )
                }
              }
            })
          }else{
            this.cleanTableConfig()
          }

          let datas = []
          datas = result.tables || [],
          datas.forEach((item) => {
            item.key = item.pk_id
          });

          this.tables = {
            datas: datas,
            columns : result.columns, // 后台返回结果
            _columnss: _columnss ? _columnss : this.defaultColumns, // 转换为前端页面需要的列头
            pageIndex: config.number,
            pageSize: config.size,
            total: config.totalElements,
            totalPages: config.totalPages
          }
        }else{
          // 使用默认列并清空数据

          this.cleanTableConfig()
        }
          resolve()
      }).catch((e) => {
        this.cleanTableConfig();
      })
    })
  }

  toJson() {
    return {

    }
  }
}
