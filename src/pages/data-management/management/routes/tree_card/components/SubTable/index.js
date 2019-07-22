import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from "react";
import { FormControl , Checkbox, Icon, Tooltip, Animate, Navbar, Upload, Tabs, Modal, Message } from 'tinper-bee';
import { Table } from 'components/tinper-bee';
import BigData from 'bee-table/build/lib/bigData';
const BigTable = BigData(Table);
import Select from 'bee-select';
import { DatePicker } from 'components/tinper-bee';
import TimePicker from "tinper-bee/lib/Timepicker";
import multiSelect from "tinper-bee/lib/multiSelect.js";
import Form from 'bee-form';
import { inject, observer } from 'mobx-react';
import { toJS } from "mobx";
import { Error, success, Warning } from 'utils/index';
import './index.less';
import moment from "moment";
import MdmRefComp from 'components/mdmRef';
import { withRouter } from 'react-router-dom';
const { TabPane } = Tabs;
const Option = Select.Option;   //下拉选项
const regInt = /^-?(([1-9]\d*)|0)$/;
const regFloat = /^-?(([1-9]\d*)|0)(\.\d*)?$/;
const regPicture = /(\.png$)|(\.jpg$)|(\.gif$)/;
import {Button} from 'components/tinper-bee';
import { loadDataStore } from '../../../../stores/store'

const modalInfo = {
  '': {
    title: ``,
    desc: ``,
    confirm: ``,
  },
  'file': {
    title: <FormattedMessage id="js.rou.hom.00366" defaultMessage="文件下载" />,
    desc: <FormattedMessage id="js.rou.hom.00367" defaultMessage="是否下载文件" />,
    confirm: <FormattedMessage id="js.com.Car.0010" defaultMessage="下载" />,
  },
  'picture': {
    title: <FormattedMessage id="js.rou.hom.00369" defaultMessage="图片预览/下载" />,
    desc: <FormattedMessage id="js.rou.hom.00368" defaultMessage="是否下载图片" />,
    confirm: <FormattedMessage id="js.com.Car.0010" defaultMessage="下载" />,
  }
}

const prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : '/iuapmdm';// 

let MultiSelectTable = multiSelect(BigTable, Checkbox);
const NavItem = Navbar.NavItem;
@withRouter
@inject((stores) => {
  return {
    cardStore: stores.cardStore,
    comboxStore: stores.comboxStore,
  }
})
@observer class SubTable extends Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
      tableIndex: 0,
      selectedkey: 1,
      navInfo: [],
      dataHeader: {},
      dataSource: {},
      count: 0,
      key: -1,
      cacheInfo: {}, // 修改子表某条时暂存信息
      selection: {}, // 下拉框信息
      selectedData: [],
      editStatus: 0, // 编辑状态 0 展示 1 编辑不显示提示  2 编辑显示提示
      showTips: false,
      downloadUrl: ``, // 用于图片的modal
      finalUrl: ``, // 最终下载文件的url,用于iframe,
      modalType: ``,
      delCount : 0,
      loadInfoName: ''
      // status: props.status
    };
    this.mdmUpload = {
      name: 'file', //文件名
      action: `/iuapmdm/loadingThirdPartService/upload`, // 上传的服务器地址
      accept: '.xls,.xlsx', //设置文件接收类型
      showUploadList: false, // 是否显示上传列表
      headers: { // 设置请求的头部信息
        authorization: 'authorization-text',
      },
      onChange(info) {// 当文件正在上传，上传成功和上传失败触发的回调函数。 当上传状态发生变化，返回下列参数。
        // self.setState({
          // isShowUploadLoading: true
        // })
        console.log(info)
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          // self.setState({
            // isShowUploadLoading: false
          // })
          self.setState({
            fileName: info.file.response.fileName //服务器返回的参数
          })
          // self.props.
          // console.log(self.props.comboxStore)
          loadDataStore.getExcelData( // 获取上传后返回的excel数据
            "CMDM",
            // self.props.comboxStore.selectedItem.values,
            // "386f2594-8b99-4b68-9e36-0dd44085498d",
            self.props.match.params.id,
            info.file.response.fileName,
            1,
            10
          ).then((res) => {
            // self.props.cardStore.loadInfo = res[0];
            self.props.cardStore.loadInfo.sub_carrier = res[0].sub_carrier;
            self.props.cardStore.loadInfo.sub_carrierfull = res[0].sub_carrierfull;
            self.props.cardStore.loadInfo.sub_carrierproduction = res[0].sub_carrierproduction;
          })

          console.log(`${info.file.name} file uploaded successfully`);
          // this.props.cardStore.loadInfo[name]
        } else if (info.file.status === 'error') {
          // self.setState({
            // isShowUploadLoading: false
          // })
          console.log(`${info.file.name} file upload failed.`);
        }
      },
    }
    this.temp = {};
    this.editLegal = {};
    this.option = [{
      title: this.props.intl.formatMessage({ id: "js.com.Sub.0001", defaultMessage: "操作" }),
      dataIndex: "done",
      key: "done",
      width: 210,
      fixed: "right",
      render: (text, record, index) => (
        <div className="table-option">
          {
            this.props.status === 1 && this.state.key === index ?
              (
                <div>
                  <Button className="table-option-btn"  size="sm" bordered onClick={() => { this.cancelChange(text, record, index) }}><FormattedMessage id="js.com.Sub.0002" defaultMessage="取消" /></Button>
                  <Button className="table-option-btn" size="sm"  onClick={() => { this.confirmChange(text, record, index) }}><FormattedMessage id="js.com.Sub.0003" defaultMessage="确认" /></Button>
                </div>
              ) :
              (<div className="table-option-change" onClick={() => { this.changeData(text, record, index) }}><FormattedMessage id="js.com.Sub.0004" defaultMessage="修改" /></div>)
          }
        </div>
      )
    }];
    this.errorTips = {
      required:  this.props.intl.formatMessage({ id: "js.com.Mai.0022", defaultMessage: "该项是必填项" }) ,
      errorInteger: this.props.intl.formatMessage({ id: "js.com.Mai.0013", defaultMessage: "请输入整数" }) ,
      errorFloat: this.props.intl.formatMessage({ id: "js.com.Mai.0014", defaultMessage: "请输入浮点数" }) ,
      errorReg: this.props.intl.formatMessage({ id: "js.com.Mai.0023", defaultMessage: "不符合匹配规则,提示:" }) ,
      errorPic: this.props.intl.formatMessage({ id: "js.com.Mai.0020", defaultMessage: "请上传png,jpg或gif格式的图片" }) ,
      errorFile: this.props.intl.formatMessage({ id: "js.com.Mai.0021", defaultMessage: "请上传非png,jpg和gif格式的文件" }) ,
    }

  }

  componentDidMount() {
    this.setState({
      dataSource: this.props.cardStore.loadInfo
    })
  }
  componentWillMount() {

  }
  // 切换子表
  handleSelectKey = (index) => {
    let key = this.state.key
    if(key > -1){
      Message.create({ content: this.props.intl.formatMessage({id:"js.rou.cus1.0086", defaultMessage:"编辑未完成，请确认或取消"}), color : 'danger'});
    }else{
      this.setState({
        selectedkey: index,
        key: -1
      });
    }
  }
  // 点击修改数据按钮
  changeData = (text, record, index) => {
    this.setState({
      cacheInfo: record,
      key: index
    })
  }
  // 取消修改
  cancelChange = (text, record, index) => {
    if (record.$new$) {
      this.update(5);
    }
    else {
      this.update(2, this.state.cacheInfo, index);
    }
    this.setState({
      key: -1,
      cacheInfo: {},
      editStatus: 0
    })
  }

  //确认修改
  confirmChange = (text, record, index) => {
    let msg = ``;
    for (let item in this.editLegal) {
      if (this.editLegal[item]) {

        msg += this.editLegal[item] + '; ';
      };
    }
    if (msg) {
      msg = this.props.intl.formatMessage({ id: "js.tre.tre.0004", defaultMessage: "数据填写错误" }) + ' : ' + msg;
      Error(msg);
      this.setState({
        showTips: true,
      })
      return false;
    }
    this.update(1, false, index, '$new$')
    this.resetKey();
    return true;
  }
  resetKey = () => {
    this.setState({
      key: -1,
      editStatus: 0,
      showTips: false,
    })
  }

  // 请求下拉数据
  async getSelectionInfo(index, code, pk_entityitem) {
    // if (!this.state.selection[pk_entityitem + code]) {
      const { navInfo } = this.props;
      await this.props.cardStore.getSelectionData(navInfo.designInfo.pk_gd, pk_entityitem, code);
      this.setState({
        selection: this.props.cardStore.selectionData,
      })
    // }
  }
  // 请求枚举数据
  async getEnumInfo(index, code, pk_entityitem) {
    // if (!this.state.selection[pk_entityitem + code]) {
      await this.props.cardStore.getEnumData(pk_entityitem, code);
      this.setState({
        selection: this.props.cardStore.selectionData,
      })
    // }
  }
  // 新增行
  addData = (navInfo, dataHeader) => {
    this.resetKey();
    const key = this.state.selectedkey;
    let val = dataHeader[key] || [];
    let temp = {};
    val.map((item) => {
      temp[item.dataIndex] = item.defaultValue || '';
    })
    temp.key = new Date().getTime();
    temp._checked = false;  // 默认不勾选,删除时用
    temp.$new$ = true;
    this.update(0, temp);
    const name = `sub_${navInfo.entitys[key].head.code}`;
    const data = this.props.cardStore.loadInfo[name] || [];
    this.setState({
      key: data.length - 1,
      editStatus: 1,
      // status: 1
    })
  }

  // 删除信息   ---删除_check字段为true的信息
  delData = (i) => {
    this.update(4);
  }

  //下载按钮
  download = async() => {
    let condition = `cond=mdm_code in ('${this.props.cardStore.loadInfo.mdm_code}')`;
    let pk_gd = `pk_gd=${this.props.match.params.id}`;
    const url = `${GLOBAL_HTTP_CTX}/modeling/mdmshow/list/download?${pk_gd}&${condition}`;
    this.setState({
      finalUrl : ``,
      downloadUrl: url,
      modalType : 'file',
    })
  }
  
  getSelectedDataFunc = (data, item, index) => {
    const { navInfo } = this.props;
    let name = `sub_${navInfo.entitys[this.state.selectedkey].head.code}`;
    if (item) {
      let flag = !this.props.cardStore.loadInfo[name][index]._checked;
      this.update(1, flag, index, '_checked')
      if(flag) {
        this.setState({
          delCount : this.state.delCount+1,
        })
      }
      else {
        this.setState({
          delCount : this.state.delCount-1,
        })
      }
    }
    else if (data.length > 0) { // 全选
      this.update(3, true, index, '_checked')
      this.setState({
        delCount : this.props.cardStore.loadInfo[name].length,
      })
    }
    else {  // 全不选
      this.update(3, false, index, '_checked')
      this.setState({
        delCount : 0,
      })
    }
  };
  /**
     * 检查文件大小是否符合要求
     */
  checkFile = (file, MAX = 10240, item) => {
    const reg = new RegExp(item.regexvalidateclass.toLowerCase());
    if (item.fieldtype === 9) {
      if (!regPicture.test(file.name.toLowerCase())) {
        Error(this.errorTips.errorPic);
        return false;
      }
    }
    else {
      if (regPicture.test(file.name.toLowerCase())) {
        Error(this.errorTips.errorFile);
        return false;
      }
    }
    if (!reg.test(file.name.toLowerCase())) {
      Error(this.errorTips.errorReg + item.validateprompt);
      return false;
    }
    let text = this.props.intl.formatMessage({ id: "js.com.Sub.0006", defaultMessage: "文件大于" }) + (MAX / 1024) + 'MB'
    if ((file.size / 1024) >= MAX) {
      Error(text)
      return false;
    }
    return true;
  }
  getHeader = (arr) => {
    let self = this;
    let res = {};
    if (arr) {
      arr.map((item, index) => {
        if (index === 0) {
          return null;
        }
        res[index] = [];
        res[index].push({
          key: 'mdm_code',
          dataIndex: "mdm_code",
          title: 'mdm_code',
          width: 130,
          render: (text, record, index) => (
            <div style={{ width: 130 }}>
              <Tooltip inverse
                overlay={text}
                placement="bottom" >
                <span tootip={text} className='header-tooltips'>
                  {text}
                </span>
              </Tooltip>
            </div>
          )
        })
        const { stopWriteBtn } = item.head;
        item.body.map((item2, index2) => {
          let temp = {};
          temp.title = item2.required ? (
            <span style={{ maxWidth: 100, display: `inline-block` }}><span className='star-icon-red'>*</span>{item2.name}</span>
          ) : (
              <span style={{ maxWidth: 100, display: `inline-block` }}>{item2.name}</span>
            )
          temp.key = item2.code;
          temp.dataIndex = item2.code;
          temp.width = 150;
          temp.defaultValue = item2.defaultvalue;
          temp.render = (text, record, index) => (self.renderHelper(text, record, index, item2.fieldtype, item2.code, item2.pk_entityitem, item2, stopWriteBtn))
          res[index].push(temp);
        })
      })
    }
    return res;
  }

  check = (code, required, reg = false, regInt = false, regFloat = false, regInfo = '') => {
    if (required) {
      this.editLegal[code] = '[' + code + ']' + this.errorTips.required;
      return true;
    }
    else if (regInt) {
      this.editLegal[code] = '[' + code + ']' + this.errorTips.errorInteger;
      return true;
    }
    else if (regFloat) {
      this.editLegal[code] = '[' + code + ']' + this.errorTips.errorFloat;
      return true;
    }
    else if (reg) {
      this.editLegal[code] = '[' + code + ']' + this.errorTips.errorReg + regInfo;
      return true;
    }
    this.editLegal[code] = '';
    return false;
  }

  // 渲染不同类型的项
  renderHelper = (text, record, index, type, code, pk_entityitem, item) => {
    const required = item.required;
    const reg = new RegExp(item.regexvalidateclass);
    const placeholder = ``;
    const { showTips } = this.state;
    switch (type) {
      case 1:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text);
          }
          const notLegal = this.check(code, (required && !text), (text && !reg.test(text)), false, false, item.validateprompt)
          return (
            <div style={{ width: 100 }}>
              <FormControl
                value={text}
                onChange={this.onCellChange(index, code)}
                disabled={item.rwauth === 1}
                className={notLegal && showTips ? 'border-red' : ''}
                placeholder={placeholder}
                maxLength={item.fieldlength}
              />
            </div>
          )
        }
      case 2: // 整型
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text);
          }
          const notLegal = this.check(code, (required && !text), (text && !reg.test(text)), (text && !regInt.test(text)), false, item.validateprompt)
          return (
            <div style={{ width: 100 }}>
              <FormControl
                value={text}
                placeholder={placeholder}
                onChange={this.onCellChange(index, code)}
                disabled={item.rwauth === 1}
                className={notLegal && showTips ? 'border-red' : ''}
                maxLength={item.fieldlength}
              />
            </div>
          )
        }
      case 3:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text, 2);
          }
          let v = text == '1' || text == true || text == 'true';
          return (
            <div style={{ width: 100 }}>
              <Select
                onSelect={this.onCheckChange(index, code)}
                value={v ? `1` : '0'}
                disabled={!(index === this.state.key) || item.rwauth === 1}
              >
                <Option key='0' value="1"><FormattedMessage id="js.com.Sub.0007" defaultMessage="是" /></Option>
                <Option key='1' value='0'><FormattedMessage id="js.com.Sub.0008" defaultMessage="否" /></Option>
              </Select>
            </div>
          )
        }
      case 4:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text);
          }
          const notLegal = this.check(code, (required && !text), (text && !reg.test(text)), false, (text && !regFloat.test(text)), item.validateprompt)
          return (
            <div style={{ width: 100 }}>
              <FormControl
                placeholder={placeholder}
                value={text}
                onChange={this.onCellChange(index, code)}
                disabled={item.rwauth === 1}
                className={notLegal && showTips ? 'border-red' : ''}
                maxLength={item.fieldlength}
              />
            </div>
          )
        }
      case 5:     // 日期
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text);
          }
          const notLegal = this.check(code, (required && !text))
          return (
            <div style={{ width: 130 }}>
              <DatePicker
                format="YYYY-MM-DD"
                placeholder={text || placeholder}
                onChange={this.onDateChange(index, code, "YYYY-MM-DD")}
                disabled={item.rwauth === 1}
                className={notLegal && showTips ? 'border-red-f' : ''}
              />
            </div>
          )
        }
      case 6:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text);
          }
          else {
            const notLegal = this.check(code, (required && !text));
            return (
              <div style={{ width: 130 }}>
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={text || placeholder}
                  showTime={true}
                  onChange={this.onDateChange(index, code, "YYYY-MM-DD HH:mm:ss")}
                  disabled={item.rwauth === 1}
                  className={notLegal && showTips ? 'border-red-f' : ''}
                />
              </div>
            )
          }
        }

      case 7:
        {
          let init = '';
          if (record[code]) {
            init = JSON.stringify({
              refname: record[`${code}_name`],
              refpk: record[code]
            })
          }
          if (!(index === this.state.key)) {
            return this.renderTooltip(record[`${code}_name`]);
          }

          const notLegal = this.check(code, (required && !record[code]));
          return (
            <div className={notLegal && showTips ? 'border-red-f' : ''} style={{ width: 130 }}>
              <MdmRefComp
                value={init}
                placeholder={placeholder}
                pk_entityitem={pk_entityitem}
                pk_gd={this.props.match.params.id}
                authfilter={true}
                onChange={this.onRefChange(index, code)}
                disabled={!(index === this.state.key) || item.rwauth === 1}
              />
            </div>
          )
        }
      case 12:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text);
          }
          else {
            const notLegal = this.check(code, (required && !text))
            return (
              <div style={{ width: 130 }}>
                <TimePicker
                  format="HH:mm:ss"
                  placeholder={text || placeholder}
                  onChange={this.onDateChange(index, code, "HH:mm:ss")}
                  disabled={item.rwauth === 1}
                  className={(required && !text) ? 'border-red-f' : ''}
                />
              </div>
            )
          }
        }

      case 8:
        {
          {
            if (!(index === this.state.key)) {
              return this.renderTooltip(record[`${code}_name`]);
            }
            const notLegal = this.check(code, (required && !text))
            return (
              <div style={{ width: 100 }}>
                <Select
                  onFocus={() => { this.getSelectionInfo(index, code, pk_entityitem) }}
                  onChange={this.onSelectChange(index, code)}
                  defaultValue={text}
                  disabled={!(index === this.state.key) || item.rwauth === 1}
                  className={notLegal && showTips ? 'border-red-f' : ''}
                >
                  {
                    !this.state.selection[pk_entityitem + code] ?
                      <Option key="-1" value={text} > {record[`${code}_name`]}</Option> : null
                  }
                  {
                    this.renderSelection(pk_entityitem,code)
                  }
                </Select>
              </div>
            )
          }
        }
      case 13:
        {
          {
            if (!(index === this.state.key)) {
              return this.renderTooltip(record[`${code}_name`]);
            }
            const notLegal = this.check(code, (required && !text))
            return (
              <div style={{ width: 100 }}>
                <Select
                  onFocus={() => { this.getEnumInfo(index, code, pk_entityitem) }}
                  onChange={this.onSelectChange(index, code)}
                  defaultValue={text}
                  disabled={!(index === this.state.key) || item.rwauth === 1}
                  className={notLegal && showTips ? 'border-red-f' : ''}
                >
                  {
                    !this.state.selection[pk_entityitem + code] ?
                      <Option key="-1" value={text} > {record[`${code}_name`]}</Option> : null
                  }
                  {
                    this.renderSelection(pk_entityitem,code)
                  }
                </Select>
              </div>
            )
          }
        }
      case 9:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text, 0);
          }
          if (text) {
            let t = text.split('#').pop();
            let showUrl = `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/download?saveAddr=${text}`;
            return (
              <div style={{ width: 130 }}>
                <img src={showUrl} className='sub-pic' onClick={() => { this.downloadFile(text, 'picture') }} />
                <Icon type='uf-del' className='sub-file-del' onClick={() => { this.onRemoveFile(null, index, code) }}></Icon>
              </div>
            )
          }
          const notLegal = this.check(code, required)
          return (
            <div style={{ width: 50 }}>
              <Upload
                {...{
                  action: `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/upload`,
                  listType: 'picture',
                  accept: "image/*",
                  size: 10485760,   // 10485760 Byte === 10MB
                  onChange: (info) => { this.handleChangeFile(info, index, code) },
                  multiple: false,
                  onRemove: (info) => { this.onRemoveFile(info, index, code) },
                  beforeUpload: (file) => (this.checkFile(file, 10240, item)),
                }}
              >
                <Icon type='uf-upload' className='sub-file-upload'></Icon>
              </Upload>
            </div>
          )
        }
      case 10:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text, 1);
          }
          if (text) {

            return (
              <div style={{ width: 130 }}>
                <span className='sub-file' onClick={() => { this.downloadFile(text) }}>{text.split('#')[1]}</span>
                <Icon type='uf-del' className='sub-file-del' onClick={() => { this.onRemoveFile(null, index, code) }}></Icon>
              </div>
            )
          }
          const notLegal = this.check(code, required)
          return (
            <div style={{ width: 50 }}>
              <Upload
                {...{
                  action: `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/upload`,
                  size: 10485760,   // 10485760 Byte === 10MB
                  onChange: (info) => { this.handleChangeFile(info, index, code) },
                  multiple: false,
                  beforeUpload: (file) => (this.checkFile(file, 10240, item)),
                }}
              >
                <Icon type='uf-upload' className='sub-file-upload'></Icon>
              </Upload>
            </div>
          )
        }
      case 11:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text);
          }
          const notLegal = this.check(code, (required && !text), (text && !reg.test(text)), false, false, item.validateprompt)
          return (
            <div style={{ width: 130 }}>
              <FormControl
                value={text}
                onChange={this.onCellChange(index, code)}
                disabled={item.rwauth === 1}
                className={notLegal && showTips ? 'border-red' : ''}
                placeholder={placeholder}
                maxLength={item.fieldlength}
              />
            </div>
          )
        }
      default:
        {
          if (!(index === this.state.key)) {
            return this.renderTooltip(text);
          }
          return (
            <FormControl
              value={text}
              onChange={this.onCellChange(index, code)}
              placeholder=''
            />
          )
        }
    }
  }

  // 渲染下拉
  renderSelection = (pk_entityitem,code) => {
    if (this.state.selection[pk_entityitem + code]) {
      return this.state.selection[pk_entityitem + code].map((item) => {
        if(item.text == null) {return null}
        return (
          <Option key={item.value} value={item.value}>{item.text}</Option>
        )
      })
    }
  }

  downloadFile = (text, type = 'file') => {
    const addr = text.split('#')[0];
    const fileName = text.split('#')[1];
    const url = `${GLOBAL_HTTP_CTX}/modeling/mdmshow/card/file/download?saveAddr=${addr}&fileName=${fileName}`;
    this.setState({
      finalUrl : ``,
      downloadUrl: url,
      modalType : type,
    })
  }
  renderTooltip = (text, flag) => {
    let fileName;
    let overlay;
    let classNames = `header-tooltips `;
    let onClick = () => { };
    if (flag === 0 && text) {
      fileName = text.split('#')[1];
      overlay = modalInfo.picture.title;
      classNames += `cursor-pointer`;
      onClick = () => { this.downloadFile(text, 'picture') };
    }
    else if (flag === 1 && text) {
      fileName = text.split('#')[1];
      overlay = modalInfo.file.title;
      classNames += `cursor-pointer`;
      onClick = () => { this.downloadFile(text) };
    }
    else if (flag === 2 && text != null) {
      fileName = text === 1 || text === true || text === 'true' ? this.props.intl.formatMessage({ id: "js.com.Sub.0009", defaultMessage: "是" }) : this.props.intl.formatMessage({ id: "js.com.Sub.0010", defaultMessage: "否" });
      overlay = fileName;
    }
    else {
      fileName = text;
      overlay = fileName;
    }
    return (
      <Tooltip inverse
        overlay={overlay}
        placement="bottom" >
        <span tootip={overlay}
          className = { classNames }
          style={{width:100}}
          onClick={onClick}>
          {fileName}
        </span>
      </Tooltip>
    )
  }

  onCellChange = (index, code) => {
    let self = this;
    return (value) => {
      self.update(1, value, index, code);
    }
  }
  onCheckChange = (index, code) => {
    return (value) => {
      if (value === '1') {
        this.update(1, 1, index, code);
      }
      else {
        this.update(1, 0, index, code);
      }
    }
  }

  onDateChange = (index, code, format) => {
    return (value) => {
      let info = value ? moment(value).format(format) : '';
      this.update(1, info, index, code);
    }
  }
  onSelectChange = (index, code) => {
    return (value,item) => {
      this.update(1, value, index, code);
      this.update(1, item.props.children, index, `${code}_name`);
    }
  }
  onRefChange = (index, code) => {
    return (value) => {
      let obj = JSON.parse(value);
      this.update(1, obj.refpk, index, code);
      this.update(1, obj.refname, index, `${code}_name`);
    }
  }

  handleChangeFile = (info, index, code) => {
    if (info.file.status === 'done') {
      this.update(1, info.file.response.file, index, code);
    }
  }

  onRemoveFile = (info, index, code) => {
    this.update(1, '', index, code);
  }
  // flag 0 新增一条 1 修改单个 2 取消修改 3 批量修改某字段(_checked) 4 删除
  update = (flag, param, index, code) => {
    const { navInfo } = this.props;
    let name = `sub_${navInfo.entitys[this.state.selectedkey].head.code}`;
    let dt = toJS(this.props.cardStore.loadInfo[name]);
    let _dt = [];
    let delArr = [];
    if (!dt) {
      dt = [];
    }
    if (flag === 0) {
      _dt = dt.concat([param]);
    }
    else if (flag === 1) {
      dt[index][code] = param;
      _dt = [].concat(dt);
    }
    else if (flag === 2) {
      dt[index] = param;
      _dt = [].concat(dt);
    }
    else if (flag === 3) {
      dt.map((item) => {
        item[code] = param;
      })
      _dt = [].concat(dt);
    }
    else if (flag === 4) {
      dt.map((item) => {
        if (item._checked) {
          if (item.pk_mdm) {
            delArr = delArr.concat([item])
            item.dr = '1';
          }
        } else {
          _dt = _dt.concat([item]);
        }
      })
      this.setState({
        key: -1
      });
    }
    else if (flag === 5) {
      _dt = dt.slice(0, dt.length - 1);
    }
    this.setState({
      dataSource: Object.assign({}, this.state.dataSource, { [name]: _dt }),
    })
    this.props.cardStore.subInfo = Object.assign({}, this.props.cardStore.subInfo, { [name]: _dt });
    this.props.cardStore.loadInfo = Object.assign({}, this.props.cardStore.loadInfo, { [name]: _dt });
    this.props.cardStore.subInfoDel = Object.assign({}, { [name]: delArr });
  }
  renderTableNav = (arr) => {
    if (arr) {
      return arr.map((item, index) => {
        if (index === 0) {
          return null;
        }
        return (
          <NavItem eventKey={index}>
            {item.head.name}
          </NavItem>
        )
      })
    }
  }
  renderTab = (arr, columns, data, navInfo, dataHeader) => {
    if (arr) {
      return arr.map((item, index) => {
        if (index === 0) {
          return null;
        }
        const disabled = this.state.key === -1;
        return (
          <TabPane
            tab={
              <span>{item.head.name}</span>
            }
            key={index}>
            <div className="sub-table-btn-area">
              <Button
                style={{marginRight:'20px'}}
                onClick={() => { this.addData(navInfo, dataHeader) }}
              >
                <FormattedMessage id="js.com.Sub.0011" defaultMessage="添加行" />
              </Button>
              <Button
                bordered
                style={{marginRight:'20px'}}
                onClick={() => { this.delData(navInfo) }}
                disabled={(!disabled && this.state.delCount === 0) || disabled}
              >
                <FormattedMessage id="js.com.Sub.0012" defaultMessage="删除" />
              </Button> 
              <Upload {...this.mdmUpload} >
                <Button>
                  上传
                </Button>
              </Upload>
              <Button
                style={{marginLeft:'20px',verticalAlign: 'bottom'}}
                onClick={() => { this.download() }}
              >
                <FormattedMessage id="js.com.Car.0010" defaultMessage="下载" />
              </Button>
            </div>
            <MultiSelectTable
              className="sub-table-content"
              columns={columns} //dataHeader[self.state.selectedkey]
              data={data} // self.state.dataSource[self.state.selectedkey]
              multiSelect={{ type: "checkbox" }}
              getSelectedDataFunc={this.getSelectedDataFunc}
              syncHover = { false}
              scroll= {{y:500}}
            />
          </TabPane>
        )
      })
    }
  }
  closeModal = () => {
    this.setState({
      downloadUrl: ``,
      modalType: ''
    })
  }
  confirmModal = () => {
    this.setState({
      finalUrl: this.state.downloadUrl,
    })
    this.closeModal();
  }
  render() {
    console.log(this.props)
    const { navInfo, style } = this.props;
    const self = this;
    if (!navInfo || !navInfo.entitys || navInfo.entitys.length === 1) {
      return null;
    }
    const { modalType, downloadUrl } = this.state;
    let dataHeader = self.getHeader(toJS(navInfo.entitys));
    let columns = dataHeader[self.state.selectedkey];
    if (this.props.status !== 0 && !navInfo.entitys[self.state.selectedkey].head.stopWriteBtn) {
      columns = columns.concat(this.option);
    }
    let name = `sub_${navInfo.entitys[this.state.selectedkey].head.code}`;
    let data = this.props.cardStore.loadInfo[name] || [];
    return (
      <div className="sub-table" style = {style}>
        <Tabs
          activeKey={self.state.selectedkey + ''}
          onChange={this.handleSelectKey}
        >
          {self.renderTab(navInfo.entitys, columns, data, navInfo, dataHeader)}
        </Tabs>
        <Modal
          show={modalType !== ''}
        >
          <Modal.Header>
            <Modal.Title>{modalInfo[modalType].title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              modalType === 'file' ?
                <span>{modalInfo[modalType].desc}</span>
                :
                <div>
                  <img className='img-download-tips' src={downloadUrl} />
                </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.closeModal()} bordered style={{ marginRight: 15 }}><FormattedMessage id="js.rou.hom.0035" defaultMessage="关闭" /></Button>
            <Button onClick={() => this.confirmModal()} ><FormattedMessage id="js.rou.hom.0031" defaultMessage="下载" /></Button>
          </Modal.Footer>
        </Modal>
        <iframe src={this.state.finalUrl} style={{ display: 'none' }}></iframe>
      </div>
    )
  }
}
// export default injectIntl(Form.createForm()(SubTable), { withRef: true });

export default injectIntl(SubTable, { withRef: true });
