import {
  configureStore,
  combineReducers,
} from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'



const reducer = combineReducers({
  auth: authReducer,
})

const store = configureStore(
  { reducer: reducer }
)

export default store
