import InterfaceConfigurationStore from './interface-configuration-store'     // 社会化配置数据源
import EntityContentStore from './entity-content-store'
import ComboxStore from 'components/combox/combox-store'
import Treestore from 'components/tree/tree-store.js'

export const interfaceConfigurationStore = new InterfaceConfigurationStore()
export const treeStore = new Treestore()
export const entityContentStore = new EntityContentStore()
export const comboxStore = new ComboxStore()
