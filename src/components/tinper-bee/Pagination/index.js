/**
 *
 * @title 表格参照带有input
 * @description 表格参照带有input
 *
 */
import React, {
	Component
} from 'react';
import Pagination from 'bee-pagination';
import 'bee-pagination/build/Pagination.css';
class MDMPagination extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        
        
        return (
          <Pagination
          {...this.props}
          >
          </Pagination>
            
        )
    }
}
export default MDMPagination;
