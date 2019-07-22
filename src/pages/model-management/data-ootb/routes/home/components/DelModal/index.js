import React from "react"
import {Icon} from 'tinper-bee'
import Modal from 'bee-modal'
import tanhaoIcon from 'images/ootb/tanhao.png'
import './index.less'
import {Button} from 'components/tinper-bee';
const DelModal = (props) => {
  const { show, onCancel, onConfirm } = props;
  return (
    <Modal
      className='ootb-del-modal'
      show={show}
      size='sm'
      enforceFocus={false}
      onHide={onCancel}
    >
      <Modal.Header closeButton={true}/>

      <Modal.Body
        className="ootb-del-modal-body"
      >
        <img src={tanhaoIcon} alt=""/>
        <p>是否确认删除该配置信息？</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bordered
          onClick={onCancel}
        >取消</Button>
        <Button
          colors="primary"
          onClick={onConfirm}
          style={{marginLeft: '15px'}}
        >确认</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DelModal;
