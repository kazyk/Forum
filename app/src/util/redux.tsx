import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from "react-redux"
import { store } from "../store/Store"
import { ThunkAction, Action } from "@reduxjs/toolkit"

type Store = typeof store
type State = ReturnType<Store["getState"]>

export const useSelector: TypedUseSelectorHook<State> = useReduxSelector

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, State, unknown, Action<string>>
