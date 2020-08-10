import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as firebase from "firebase"
import { combineEpics } from "redux-observable"
import { from, of } from "rxjs"
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from "rxjs/operators"
import { AppEpic, RootState } from "./Store"
import { ErrorInfo, Thread } from "./Types"
import { selectCurrentUid } from "./Auth"

type NewThreadParam = {
  title: string
  body: string
}

export type ThreadState = {
  ui: {
    newThread: {
      isPending?: boolean
      success?: boolean
      error?: ErrorInfo
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
    postNewThreadClear: (state) => {
      state.ui.newThread = {}
    },
  },
})

const actions = slice.actions

const postNewThreadEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(actions.postNewThread.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const data = {
        title: action.payload.title,
        body: action.payload.body,
        authorUid: selectCurrentUid(state),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }
      const threadsRef = firebase.firestore().collection("threads")
      return from(threadsRef.add(data)).pipe(
        map(() => {
          return actions.postNewThreadSuccess()
        }),
        catchError((err) => {
          return of(
            actions.postNewThreadFailed({
              message: err.message,
              detail: err.toString(),
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

export function selectPostNewThreadError(state: RootState) {
  return state.thread.ui.newThread.error
}
