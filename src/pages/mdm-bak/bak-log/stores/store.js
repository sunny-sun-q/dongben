// 该页面总的数据仓库store
// 弹出框数据仓库
import ComboxStore from '../../../../components/combox/combox-store'
export const comboxStore = new ComboxStore()
// 副本日志加载仓库
import BaklogStore from './baklogstore'
export const bakLogStore = new BaklogStore()