import {
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit"
import logger from "redux-logger"
import { createEpicMiddleware, combineEpics, Epic } from "redux-observable"
import { authReducer, authEpic } from "./Auth"
import { threadEpic, threadReducer } from "./Thread"
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from "react-redux"

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

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export type AppEpic = Epic<Action<string>, Action<string>, RootState, any>
