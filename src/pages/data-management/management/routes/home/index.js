import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './index.less'
import TableDef from '../table'
// import TableHistory from '../table/table-history'
import TreeTable from '../tree-table'
import TreeCard from '../tree_card'
import TreeCardS from '../tree_card'
import TreeCardEdit from '../tree_card/tree_card_edit'
import History from '../../../../data-maintenance/maintenance/routes/home_history'
import Process from '../../../../data-maintenance/maintenance/routes/home_process';
import ProcessDetail from '../../../../data-maintenance/maintenance/routes/home_process_detail'

class Home extends Component {
    constructor(props, context) {
        super(props, context);
        this.nodeSaveClick = this.nodeSaveClick.bind(this)
    }

    nodeSaveClick() {

    }
    callBack = (value) => {
        let condition ;
        console.log(this.props)
        window.mdmNowUrl = window.location.href;
        this.props.history.push(`${this.props.location.pathname}/condition`);
    }
    render() {
        return (
            <div className="main">
                {/* <Header title="主数据管理" /> */}
                <Switch>
                
                    <Route exact path="/process/:pk_id" component={ProcessDetail} />
                    <Route exact path="/:type/:id/process/:mdmcode" component={Process} />
                    <Route exact path="/table/:id/history/:mdmcode" component={History} />
                    <Route exact path="/tree-table/:id/history/:mdmcode" component={History} />
                    <Route exact path="/:type/:id/edit/:mdmcode" component={TreeCardEdit} />
                    <Route exact path="/tree-card/:id/history/:mdmcode" component={History} />
                    <Route exact path="/tree-card/:id/:mdmcode" component={TreeCardS} />
                    <Route exact path="/table/:id" component={TableDef} />
                    <Route exact path="/tree-table/:id" component={TreeTable} />
                    <Route exact path="/tree-card/:id" component={TreeCard} />
                    
                    {/* <Route path="/tree-table/:id" component = {TreeTableDef} />
                    <Route path="/tree-card/:id" component = {TreeCardDef} /> */}
                </Switch>
            </div>
        )
    }
}

export default Home;
