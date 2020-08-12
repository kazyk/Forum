import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as firebase from "firebase"
import _ from "lodash"
import { combineEpics } from "redux-observable"
import { from, of } from "rxjs"
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from "rxjs/operators"
import { selectCurrentUid } from "./Auth"
import { AppEpic, RootState } from "./Store"
import { ErrorInfo, Thread, threadConverter } from "./Types"

type NewThreadParam = {
  title: string
  body: string
}

type ThreadFetchResult = {
  list: string[]
  threads: Record<string, Thread>
}

export type ThreadState = {
  byId: Record<string, Thread>
  ui: {
    home: {
      list?: string[]
      isFetching?: boolean
      isRefreshing?: boolean
    }
    newThread: {
      isPending?: boolean
      success?: boolean
      error?: ErrorInfo
    }
  }
}

const initialState: ThreadState = {
  byId: {},
  ui: {
    home: {},
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
    fetchHomeThreadList: (state) => {
      state.ui.home.isFetching = true
    },
    fetchHomeThreadListSuccess: (
      state,
      action: PayloadAction<ThreadFetchResult>
    ) => {
      state.ui.home.isFetching = false
      state.ui.home.list = action.payload.list
      state.byId = action.payload.threads
    },
    fetchHomeThreadListFailed: (state, action: PayloadAction<ErrorInfo>) => {},
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
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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

const fetchHomeThreadListEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(actions.fetchHomeThreadList.match),
    switchMap((action) => {
      const threadsRef = firebase
        .firestore()
        .collection("threads")
        .withConverter(threadConverter)
      const query = threadsRef.orderBy("createdAt", "desc").limit(20)
      return from(query.get()).pipe(
        map((snapshot) => {
          const threads = snapshot.docs.map((doc) => doc.data())
          return actions.fetchHomeThreadListSuccess({
            list: threads.map((th) => th.key),
            threads: _.keyBy(threads, (th) => th.key),
          })
        }),
        catchError((err) => {
          return of(
            actions.fetchHomeThreadListFailed({
              message: err.message,
              detail: err.toString(),
            })
          )
        })
      )
    })
  )

export const threadEpic = combineEpics(
  postNewThreadEpic,
  fetchHomeThreadListEpic
)
export const threadReducer = slice.reducer
export const threadActions = slice.actions

export function selectPostNewThreadSucceeded(state: RootState) {
  return !!state.thread.ui.newThread.success
}

export function selectPostNewThreadError(state: RootState) {
  return state.thread.ui.newThread.error
}

export const selectHomeThreadList = createSelector(
  (state: RootState) => state.thread.byId,
  (state) => state.thread.ui.home.list,
  (threads, list) => {
    return list?.map((id) => threads[id]) ?? null
  }
)
