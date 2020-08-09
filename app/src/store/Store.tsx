import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { authReducer } from "./Auth"
import logger from "redux-logger"

const middleware = getDefaultMiddleware()
if (__DEV__) {
  middleware.push(logger)
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware,
})

type Store = typeof store
export type RootState = ReturnType<Store["getState"]>
