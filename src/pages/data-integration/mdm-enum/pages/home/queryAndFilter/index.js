import React, { Component } from 'react'
import { Message, Switch, InputNumber, Col, Row, FormControl, Label, Radio } from "tinper-bee";
import Form from 'bee-form';
import 'bee-datepicker/build/DatePicker.css';
import SearchPanel from 'components/SearchPanel';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';

const FormItem = Form.FormItem;
import './index.less'



import {
    BrowserRouter as Router,
    Route,
    Link,
    withRouter
} from 'react-router-dom';

import {
    inject,
    observer
} from 'mobx-react';
@withRouter
@inject((stores) => {
    return {
        enumTablesStore: stores.enumTablesStore
    }
}) @observer
class QFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentWillMount() {

    }

    async componentDidMount() {

    }

    search = (error, values) => {
        this.props.enumTablesStore.getTables(1, 99999)
    }

    reset = () => {
        let qfilter = {
            code:'',
            name:'',
            v_range: '',
            descri: ''
        }
        this.props.enumTablesStore.qfilter = qfilter
    }

    onChange = (key) => {
        return (value) => {
            this.props.enumTablesStore.qfilter[key] = value
        }
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let { code,name,v_range,descri } = this.props.enumTablesStore.qfilter
        return (
            <SearchPanel
                className='qfilter enum-qfilter'
                searchOpen={false}
                form={this.props.form}
                reset={this.reset}
                search={this.search}>
                <Row>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0001" defaultMessage="分类编码" /></Label>
                            <FormControl
                                className="search-input"
                                value={code}
                                onChange={this.onChange("code")}
                            />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label><FormattedMessage id="js.mdm.enum.0005" defaultMessage="分类名称" /></Label>
                            <FormControl
                                className="search-input"
                                value={name}
                                onChange={this.onChange("name")}
                            />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem >
                            <Label><FormattedMessage id="js.mdm.enum.0008" defaultMessage="备注" /></Label>
                            <FormControl
                                className="search-input"
                                value={descri}
                                onChange={this.onChange("descri")}
                            />
                        </FormItem>
                    </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default injectIntl(Form.createForm()(QFilter), {withRef: true});
