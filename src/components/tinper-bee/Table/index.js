/**
 *
 * @title 表格参照带有input
 * @description 表格参照带有input
 *
 */
import React, {
	Component
} from 'react';
import Table from 'bee-table';
import 'bee-table/build/Table.css';
import './Table.less'; // 升级tinper-bee.css之后考虑去掉此文件中的样式
class MDMTable extends Component {
    constructor(props) {
        super(props);
    }
    render() {


        return (
          <Table
          className="mdm-table"
          headerDisplayInRow={true}
          bodyDisplayInRow={true}
          headerScroll={true}
          {...this.props}
          >
          </Table>

        )
    }
}
export default MDMTable;
