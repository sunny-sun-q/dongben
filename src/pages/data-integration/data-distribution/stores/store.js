import Treestore from 'components/tree/tree-store.js'
import Combox from 'components/combox/combox-store.js'
import SeniorSearchStore from 'components/SeniorSearch/senior-search-store'
import Distribute from './distribute.js'
export const treeStore = new Treestore()
export const comboxStore = new Combox()
export const distributeStore = new Distribute()
export const seniorSearchStore = new SeniorSearchStore()
