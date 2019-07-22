import React, { Component} from 'react';
import Button from 'bee-button';
import 'bee-button/build/Button.css';
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
class MdmButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color:'',
      classNames:['mdm-button']
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
  render() {
    let {className} = this.props;
    let {disabled,bordered} = this.props;
    let {color,classNames} = this.state;
    let classNamess = '';
    if(!className) {
      classNamess = '';
    } else {
      classNamess = className;
    }
    let copyClassName = JSON.parse(JSON.stringify(classNames))|| [];
    copyClassName.push(classNamess);
    return (
      <Button
      disabled={disabled}
      bordered={bordered}
      {...this.props}
      className={copyClassName.join(' ')}
      colors={color}
      >
      </Button>
    )
  }
}
MdmButton.propTypes = propTypes;
MdmButton.defaultProps = defaultProps;
export default MdmButton;
