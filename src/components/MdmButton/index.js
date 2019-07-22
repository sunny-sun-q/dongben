import React, { Component } from 'react';
import {Button} from 'components/tinper-bee';
import PropTypes from 'prop-types';
import './index.less';
const propTypes = {
  colors: PropTypes.string,
  disabled: PropTypes.bool
}
const defaultProps = {
  colors: 'primary',
  disabled: false,
  bordered: false
}
class MdmButton  extends Component {
    constructor(props) {
      super(props)
      this.state = {
        color: ''
      }
    }
    getColors = () => {
      let color = this.state.color;
      let colorStr = '';
      let {colors,disabled,bordered} = this.props;
      if(disabled) {
        colorStr = ''
      } else {
        colorStr = colors
      }
      if(bordered && colors==='primary') {
        colorStr = ''
      } else {
        colorStr = colors
      }
      this.setState({
        color: colorStr
      })
    }
    componentWillMount() {
      this.getColors();
    }
    componentDidMount (){
    }
    render() {
      let {disabled,bordered} = this.props;
      let {color} = this.state;
      return (
        <Button
        disabled={disabled}
        bordered={bordered}
        {...this.props}
        colors={color}
        >
        </Button>
      )
    }
}
MdmButton.propTypes = propTypes;
MdmButton.defaultProps = defaultProps;
export default MdmButton;
