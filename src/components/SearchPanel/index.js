import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react';
import { Panel} from 'tinper-bee';
import PropTypes from 'prop-types';
import './index.less';
import classnames from 'classnames';
import {Button} from 'components/tinper-bee';
import SeniorSearch from 'components/SeniorSearch';

/**
 * 部分不能通过this.props.form.resetFields()清空的组件，需要传reset方法，在reset方法中自行清空
 */
const propTypes = {
    searchOpen:PropTypes.bool,//是否默认展开，false默认关闭
    search: PropTypes.func,//查询的回调
    reset:PropTypes.func,//重置的回调
    resetName:PropTypes.string,//重置的文字
    searchName:PropTypes.string,//查询的文字
    title: PropTypes.string,
    extra : PropTypes.object,
    pk_gd : PropTypes.string,
};

const defaultProps = {
    searchOpen:false,
    search: () => {},
    reset: () => {},
    title: <FormattedMessage id="js.com.Sea1.0001" defaultMessage="查询与筛选" />,
    pk_gd : '',
    extra : {
        name : '',
        func : () => {}
    }
};


class SearchPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchOpen:this.props.searchOpen
        };
    }
    componentDidMount() {

    }

    open=()=>{
        this.setState({
            searchOpen: !this.state.searchOpen
        })
    }

    search=()=>{
        let self=this;
        this.props.form.validateFields((err, values) => {
            self.props.search(err, values);
        });
    }
    reset=()=>{
        this.props.form.resetFields();
        this.props.reset();
    }
    render() {
        const {children,className,form,resetName,searchName, extra } = this.props;
        let classes = 'search-panel';
        if(className){
            classes += ' '+className
        }
        let header = () => {
            return (
                <div className="clearfix" onClick={this.open}>
                    <span  className={'search-panel-title'}>
                        {this.props.title}
                    </span>
                    <span  className={'search-panel-icon'}>
                        {this.state.searchOpen ? <FormattedMessage id="js.com.Sea1.0002" defaultMessage="收起" /> : <FormattedMessage id="js.com.Sea1.0003" defaultMessage="展开" />}
                        <i className={classnames({
                                'uf': true,
                                'uf-arrow-down': this.state.searchOpen,
                                'uf-arrow-right': !this.state.searchOpen
                            })}/>
                    </span>
                </div>
            )
        };
        let renderExtra = () => {
            // console.log('-------------------------')
            // console.log(this.props)
            let url = '/modeling/mdmshow/list/advSearch'
            if(extra.name){
                return (
                    <SeniorSearch
                        title = { this.props.extra.name }
                        pk_gd = { this.props.pk_gd }
                        url={url}
                        getData = { this.props.extra.func }
                        needEscape = { true }
                    />

                )
            }
        }
        return (
           <Panel className={classes}  header={header()}  collapsible expanded={this.state.searchOpen}>
                {children}
                <div className='search-panel-btn'>
                    <Button size='sm' className='reset-btn' bordered onClick={this.reset}>{resetName?resetName:<FormattedMessage id="js.com.Sea1.0004" defaultMessage="清空" />}</Button>
                    <Button size='sm' className='submit-btn' onClick={this.search}>{searchName?searchName:<FormattedMessage id="js.com.Sea1.0005" defaultMessage="查询" />}</Button>
                    {renderExtra()}
                </div>
           </Panel>
        )
    }
}
SearchPanel.propTypes = propTypes;
SearchPanel.defaultProps = defaultProps;
export default SearchPanel;
