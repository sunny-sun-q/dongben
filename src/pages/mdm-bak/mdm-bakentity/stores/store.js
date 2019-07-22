// 该页面总的数据仓库store
// 共用的树数据仓库
import Treestore from '../../../../components/tree/tree-store'
export const treeStore = new Treestore()
// 弹出框数据仓库
import ComboxStore from '../../../../components/combox/combox-store'
export const comboxStore = new ComboxStore()
// 实体内容仓库
import BakEntityContentStore from './bakentitycontentstore'
export const bakEntityContentStore = new BakEntityContentStore()