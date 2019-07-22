import {
  observable,
  action,
} from 'mobx'

export default class MenuStore1 {
  constructor(props) {

  };

  @observable menu = {
    code:'',
    name:'',
    type: '',
    superiorCoding:''
  }

  @action setSelectMenuNode(menuNode) {
    this.menu.type = menuNode.type;
    this.menu.name = menuNode.name;
    this.menu.code = menuNode.code;
    this.menu.superiorCoding = menuNode.superiorCoding;
    //onsole.log(this.menu)
  }

  toJson() {
    return {

    }
  }
}

