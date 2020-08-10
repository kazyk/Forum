import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as firebase from "firebase"
import { combineEpics } from "redux-observable"
import { from, Observable, of } from "rxjs"
import { catchError, filter, map, switchMap } from "rxjs/operators"
import { RootState } from "./Store"
import { ErrorInfo } from "./Types"

type NewThreadParam = {
  title: string
  body: string
}

export type ThreadState = {
  ui: {
    newThread: {
      isPending?: boolean
      success?: boolean
      error?: ErrorInfo | null
    }
  }
}

const initialState: ThreadState = {
  ui: {
    newThread: {},
  },
}

const slice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    postNewThread: (state, action: PayloadAction<NewThreadParam>) => {
      state.ui.newThread.isPending = true
    },
    postNewThreadSuccess: (state) => {
      state.ui.newThread.isPending = false
      state.ui.newThread.success = true
    },
    postNewThreadFailed: (state, action: PayloadAction<ErrorInfo>) => {
      state.ui.newThread.isPending = false
      state.ui.newThread.error = action.payload
    },
    newThreadClosed: (state) => {
      state.ui.newThread = {}
    },
  },
})

const actions = slice.actions

const postNewThreadEpic = (action$: Observable<Action>) =>
  action$.pipe(
    filter(actions.postNewThread.match),
    switchMap((action) => {
      const collection = firebase.firestore().collection("threads")
      return from(collection.add(action.payload)).pipe(
        map((docRef) => {
          return actions.postNewThreadSuccess()
        }),
        catchError((err) => {
          return of(
            actions.postNewThreadFailed({
              message: err.message,
              error: err,
            })
          )
        })
      )
    })
  )

export const threadEpic = combineEpics(postNewThreadEpic)

export const threadReducer = slice.reducer
export const threadActions = slice.actions

export function selectPostNewThreadSucceeded(state: RootState) {
  return !!state.thread.ui.newThread.success
}
