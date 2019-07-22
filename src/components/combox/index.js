import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react';
import Select from 'bee-select'
const Option = Select.Option;
import {
    withRouter
} from 'react-router-dom';
import './index.less'
import {
    inject,
    observer
} from 'mobx-react';

const propTypes = {
    fullclassname: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.string,
    getSelectItem: PropTypes.func
}

const defaultProps = {
    fullclassname: 'com.yonyou.iuapmdm.remotesysreg.web.SysregisterCombo',
    disabled: false,
    defaultValue: '',
    getSelectItem: (item) => {  }
}

@withRouter
@inject((stores) => {
    return {
        comboxStore: stores.comboxStore
    }
}) @observer
class Combox extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectId: ''
        }
    }

    onSelect = (value, { props: { item } }) => {
        this.setState({
            selectId: item.text
        })
        this.props.comboxStore.setSelectedItem(item)
        this.props.getSelectItem(item);
    };

    componentWillReceiveProps(nextProps) {
        // TODO
        console.log("nextProps", nextProps)
        const nodeId = nextProps.match.params.id
        if (nodeId && nodeId !== this.props.match.params.id) {
            this.props.comboxStore.setSelectedItem({})
            this.setState({
                selectId: ''
            })
            const { fullclassname } = nextProps
            this.props.comboxStore.getCombox(fullclassname)
        }
      }

    componentDidMount() {
        const { fullclassname, defaultValue } = this.props
        this.props.comboxStore.getCombox(fullclassname)
        this.setState({
            selectId: defaultValue ? defaultValue : defaultProps.defaultValue
        })
    }

    // selectDataSource = [{
    //     "i18nName" : "",
    //     "text" : "system02",
    //     "value" : "264b867c-68bf-493e-a293-75af72fef967"
    // }]
    render() {
        const { selectDataSource } = this.props.comboxStore
        const { disabled } = this.props
        if(!selectDataSource){
            return null
        }
        return (
            <Select

                placeholder={this.props.intl.formatMessage({id:"js.com.com1.0001", defaultMessage:"请选择"})}
                onSelect={this.onSelect}
                value = {this.state.selectId}
                disabled={disabled}
                {...this.props}
                >
                {
                    selectDataSource.map(da => <Option key={da.value} value={da.text} item={da} >{da.text}</Option>)
                }

            </Select>
        )
    }
}
Combox.propTypes = propTypes;
Combox.defaultProps = defaultProps;

export default injectIntl(Combox, {withRef: true});
