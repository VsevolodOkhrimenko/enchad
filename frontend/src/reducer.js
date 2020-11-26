import { combineReducers } from 'redux'
import authReducer from 'utils/auth/authReducer'
import messagingReducer from 'utils/messaging/messagingReducer'
import commonReducer from 'utils/common/commonReducer'
import encryptionReducer from 'utils/encryption/encryptionReducer'


const reducer = combineReducers({
  auth: authReducer,
  messaging: messagingReducer,
  common: commonReducer,
  encryption: encryptionReducer
})

export default reducer
