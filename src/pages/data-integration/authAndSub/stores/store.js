import Treestore from 'components/tree/tree-store.js'

import DataMaintainStore from './data-maintain-store'
import ComboxStore from 'components/combox/combox-store'
import SeniorSearchStore from 'components/SeniorSearch/senior-search-store'
export const treeStore = new Treestore()
export const dataMaintainStore = new DataMaintainStore()
export const comboxStore = new ComboxStore()
export const seniorSearchStore = new SeniorSearchStore()
