import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React,{Component} from 'react';
import { Route, } from 'react-router-dom';
// import './index.less'

import Siderbartree from 'components/tree/index.js'
import Content from '../../../../data-maintenance/maintenance/routes/home_content'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
@inject((stores) => {
    return {
        cardStore: stores.cardStore,
    }
})
@withRouter
class TreeTable extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            condition : null,
            id : ''
        }
        this.cond = null;
        this.nodeSaveClick = this.nodeSaveClick.bind(this)
    }

    nodeSaveClick() {

    }

    componentWillMount() {
        this.setState({
            id : this.props.match.params.id
        })
    }
    componentWillUnmount () {
        // this.props.cardStore.treeTableMdmcode = '';
    }
    leafClickCallBack = (value,flag) => {
        // console.log(value)
        let condition = `${flag} = '${value.id}'`;
        if(value.id === '0'){
            condition = `1=1`;
        }
        
        this.cond = condition;
        
        this.setState({
            condition : value
        })

        const mdm_code = value.id;
        const id = this.props.match.params.id;
        this.props.cardStore.treeTableMdmcode = `${flag}='${mdm_code}'`;
        return true;
    }
    render() {
        return (
            <section className="section-wrap">
                <div className="section-wrap-l">
                    <Siderbartree
                        root={{id: '0', name: this.props.intl.formatMessage({id:"js.rou.tre1.0001", defaultMessage:"参照树根节点"}), isRoot: true}}
                        ifNoHover={false}
                        showIcon = {false}
                        autoSelect={true}
                        isRefTree = { false }
                        url = '/modeling/mdmshow/list/tree'
                        filterOption = {{pk_gd:this.state.id}}
                        hasClickCallBack = { true }
                        leafClickCallBack = { this.leafClickCallBack } // 点击叶子节点的回调
                    />
                </div>
                <div className="section-wrap-r">
                    <Content 
                        defaultCondition = { this.cond }
                    />
                </div>
            </section>

        )
    }
}

export default injectIntl(TreeTable, {withRef: true});
