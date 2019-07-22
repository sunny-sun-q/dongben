import React,{Component} from 'react';
import {

  Route,
} from 'react-router-dom';
import './index.less'

import Content from '../../../../data-maintenance/maintenance/routes/home_content'

class TableDef extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="section-wrap">
          {/* <div className="section-wrap-l">
            <Siderbartree
              root={{id: '0', name: '主数据分类', isparent: true}}
              ifNoHover={false}
              showIcon = {false}
              autoSelect={true}
            />
          </div> */}
          <div className="section-wrap-r">
            <Content />
          </div>
        </section>
      
    )
  }
}

export default TableDef;
