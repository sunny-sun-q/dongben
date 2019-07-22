import React from 'react'
import Header from 'components/header'
// import {Button} from "tinper-bee";
import {Button} from 'components/tinper-bee';

export default (props) => {
  const { onCancel, onOk, okDisable } = props;
  return (
    <Header
      title='开箱即用'
      back
      backFn={onCancel}
    >
      <div
        style={{float: 'right'}}
      >
        <Button
          bordered
          style={{marginRight: '15px'}}
          onClick={onCancel}
        >
          取消
        </Button>
        <Button
          disabled={okDisable}
          colors="primary"
          onClick={onOk}
        >
          下一步
        </Button>
      </div>
    </Header>
  )
}
