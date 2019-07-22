import Treestore from 'components/tree/tree-store.js'
import TreeEntrystore from 'components/treeEntry/tree-store.js'
import TreeRefTreestore from 'components/MdmTreeRef/tree/tree-store.js'
import TreeRefStore from 'components/MdmTreeRef/tree-ref-store.js'
import TableRefStore from 'components/MdmTableRef/table-ref-store.js'

import EntityContentStore from './entity-content-store'
import ComboxStore from 'components/combox/combox-store'
export const treeStore = new Treestore()
export const treeEntryStore = new TreeEntrystore()
export const treeRefTreeStore = new TreeRefTreestore()
export const entityContentStore = new EntityContentStore()
export const comboxStore = new ComboxStore()
export const treeRefStore = new TreeRefStore()
export const tableRefStore = new TableRefStore()

