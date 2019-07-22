import Treestore from 'components/tree/tree-store.js'
import Combox from 'components/combox/combox-store.js'
import CardStore from './card-stroe'
import Loaddata from './loaddata.js'
export const treeStore = new Treestore()
export const cardStore = new CardStore()
export const loadDataStore = new Loaddata()
export const comboxStore = new Combox()
