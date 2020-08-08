import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as firebase from "firebase"

export type AuthState = {
  initialized: boolean
  currentUid: string | null
}

const initialState: AuthState = {
  initialized: false,
  currentUid: null,
}

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initialize: {
      reducer: (state, action: PayloadAction<string | null>) => {
        state.currentUid = action.payload
        state.initialized = true
      },
      prepare() {
        return {
          payload: firebase.auth().currentUser?.uid ?? null,
        }
      },
    },
  },
})

export const authReducer = slice.reducer
export const auth = slice.actions
