import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import logger from "redux-logger"
import { createEpicMiddleware, combineEpics, Epic } from "redux-observable"
import { authReducer, authEpic } from "./Auth"
import { threadEpic, threadReducer } from "./Thread"

const rootEpic: Epic = combineEpics(authEpic, threadEpic)
const epicMiddleware = createEpicMiddleware()

const middleware = (() => {
  const middleware = getDefaultMiddleware()
  if (__DEV__) {
    return [...middleware, epicMiddleware, logger]
  } else {
    return [...middleware, epicMiddleware]
  }
})()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
  },
  middleware,
})
epicMiddleware.run(rootEpic)

type Store = typeof store
export type RootState = ReturnType<Store["getState"]>
