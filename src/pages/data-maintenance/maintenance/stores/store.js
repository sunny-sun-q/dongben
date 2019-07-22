import Treestore from 'components/tree/tree-store.js'

import DataMaintainStore from './data-maintain-store'
import ComboxStore from 'components/combox/combox-store'
import SeniorSearchStore from 'components/SeniorSearch/senior-search-store'
import DataEditStore from './data-edit-store'
import DataHistoryStore from './data-history-store'
import DataProcessStore from './data-process-store'

export const treeStore = new Treestore()
export const dataMaintainStore = new DataMaintainStore()
export const comboxStore = new ComboxStore()
export const seniorSearchStore = new SeniorSearchStore()
export const dataEditStore = new DataEditStore()
export const dataHistoryStore = new DataHistoryStore()
export const dataProcessStore = new DataProcessStore()
