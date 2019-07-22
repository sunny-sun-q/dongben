import {
  observable,
  action,
} from 'mobx'

import request from 'utils/request.js'

export default class ReactJsonViewStore1 {
  constructor(props) {

  };

  @observable jsonData = {
    mockJson: ""
  }

  toJson() {
    return {

    }
  }
}

