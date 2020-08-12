import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from "@reduxjs/toolkit"
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux"
import logger from "redux-logger"
import { combineEpics, createEpicMiddleware, Epic } from "redux-observable"
import { authEpic, authReducer } from "./Auth"
import { threadEpic, threadReducer } from "./Thread"
import { userEpic, userReducer } from "./User"

const rootEpic: Epic = combineEpics(authEpic, userEpic, threadEpic)
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
    user: userReducer,
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
