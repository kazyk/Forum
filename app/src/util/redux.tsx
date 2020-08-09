import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from "react-redux"
import { store, RootState } from "../store/Store"
import { ThunkAction, Action } from "@reduxjs/toolkit"

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
