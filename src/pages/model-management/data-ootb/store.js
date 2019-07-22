import { Provider } from "mobx-react/index";
import OotbHomeStore from './routes/home/store'
import OotbCreateStore from './routes/create/store'
const storeMap = {
  ootbHomeStore: new OotbHomeStore(),
  ootbCreateStore: new OotbCreateStore
}

const ProviderStore = ({children}) => {
  return (
    <Provider {...storeMap}>
      {children}
    </Provider>
  )
}


export default ProviderStore
