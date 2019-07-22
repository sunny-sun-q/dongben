import React, {Component} from 'react'
import {render, findDOMNode} from 'react-dom'
import { Alert } from 'tinper-bee'
import './index.less'
let alertWrap = null, alertList = [];

const AlertView = ({info, onClose}) => {
  const { title='请注意', message } = info;
  return (
    <Alert
      className="create-alert"
      colors="warning"
      onDismiss={onClose}
    >
      <div className="create-alert-content">
        <p className="create-alert-title">{title}</p>
        <p className="create-alert-message">{message}</p>
      </div>
    </Alert>
  )
}


const show = (info) => {
  if (!alertWrap) {
    alertWrap = document.createElement("div");
    alertWrap.setAttribute('class', 'alert-wrapper');
    document.body.appendChild(alertWrap)
  }
  const alertItemWrap = document.createElement("div");
  alertWrap.appendChild(alertItemWrap);
  let hideTimer = null;
  render(
    <AlertView
      info={info}
      onClose={() => {
        alertWrap.removeChild(alertItemWrap);
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = null;
        }
      }}
    />,
    alertItemWrap
  );
  if (info.autoHide) {
    hideTimer = setTimeout(function () {
      alertWrap.removeChild(alertItemWrap);
      clearTimeout(hideTimer)
      hideTimer = null;
    }, 3000)
  }
}



export default {
  show: show
}


