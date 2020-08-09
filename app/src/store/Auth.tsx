import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as firebase from "firebase"
import { AppThunk } from "../util/redux"

type AuthUser = {
  uid: string
  isAnonymous: boolean
}

type ErrorInfo = {
  message: string
  error: Error
}

export type AuthState = {
  initialized: boolean
  currentUser: AuthUser | null
  ui: {
    signIn: {
      isPending?: boolean
      error?: ErrorInfo
    }
  }
}

const initialState: AuthState = {
  initialized: false,
  currentUser: null,
  ui: {
    signIn: {},
  },
}

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initialize: {
      reducer: (state, action: PayloadAction<AuthUser | null>) => {
        state.currentUser = action.payload
        state.initialized = true
      },
      prepare() {
        const user = firebase.auth().currentUser
        return {
          payload: user
            ? { uid: user.uid, isAnonymous: user.isAnonymous }
            : null,
        }
      },
    },
    signInAnonymousStart: (state, action: PayloadAction<void>) => {
      state.ui.signIn.isPending = true
    },
    signInAnonymousSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.currentUser = action.payload
      state.ui.signIn.isPending = false
    },
    signInAnonymousFailed: (state, action: PayloadAction<ErrorInfo>) => {
      state.ui.signIn.isPending = false
      state.ui.signIn.error = action.payload
    },
  },
})

export const authReducer = slice.reducer

const { initialize } = slice.actions
export const authActions = {
  initialize,
  signInAnonymous: (): AppThunk => async (dispatch) => {
    dispatch(slice.actions.signInAnonymousStart())
    try {
      const { user } = await firebase.auth().signInAnonymously()
      if (!user) {
        dispatch(
          slice.actions.signInAnonymousFailed({
            message: "unexpected error",
            error: new Error("unexpected"),
          })
        )
        return
      }

      dispatch(
        slice.actions.signInAnonymousSuccess({
          uid: user.uid,
          isAnonymous: user.isAnonymous,
        })
      )
    } catch (err) {
      dispatch(
        slice.actions.signInAnonymousFailed({
          message: err.message,
          error: err,
        })
      )
    }
  },
}
