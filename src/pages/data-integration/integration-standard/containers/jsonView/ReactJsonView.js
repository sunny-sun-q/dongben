import React from 'react'

import ReactJson from 'react-json-view'
import { Panel } from 'tinper-bee';
//import './App.css'

import {
    inject,
    observer
} from 'mobx-react';

@inject((stores) => {
    return {
        ReactJsonViewStore: stores.ReactJsonViewStore,
    }
}) @observer
export default class ReactJsonView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mockJson: this.props.ReactJsonViewStore.jsonData.mockJson
        }

        this.handleChange = this.handleChange.bind(this)
    }

    //改变textarea内容
    handleChange(e) {
        this.setState({
            mockJson: e.target.value,
        })
    }

    render() {
        let { src: mockJson, showType: superiorCoding } = this.props;
        // var xmlDocument;
        if (superiorCoding === "webservice") {
            mockJson = mockJson.substring(1,mockJson.length-1)
            mockJson = mockJson.replace(/\\n/g,'\n')
            mockJson = mockJson.replace(/\\"/g,'"')
        }
        
        return (
            <div style={{ marginTop: 15 }}>
                <div className="modal">
                    {superiorCoding == "rest" ?
                        <ReactJson name={null} src={mockJson.length > 0 ? JSON.parse(mockJson) : ''} />
                        :
                        <Panel copyable>
                            <pre>
                                <code className="hljs javascript">
                                    {mockJson}
                                </code>
                            </pre>
                        </Panel>
                    }

                </div>
            </div>
        )
    }
}