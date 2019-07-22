import EnterpriseBusinessStore from './enterprise_business_store'
import SocialDataStore from './social_data_store'
import ComboxStore from 'components/combox/combox-store'
import EntityContentStore from './entity-content-store'     // 社会化企业基本信息数据源
import SeniorSearchStore from 'components/SeniorSearch/senior-search-store'

import Cusinfo from './cusinfo' // 客商资信信息列表

export const cusinfo = new Cusinfo()

export const enterpriseBusinessStore = new EnterpriseBusinessStore()
export const socialDataStore = new SocialDataStore()
export const comboxStore = new ComboxStore()
export const entityContentStore = new EntityContentStore()
export const seniorSearchStore = new SeniorSearchStore()
