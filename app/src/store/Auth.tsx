import { createSlice, PayloadAction, Action } from "@reduxjs/toolkit"
import * as firebase from "firebase"
import { Observable } from "rxjs/Rx"
import { filter, switchMap, map, take, catchError } from "rxjs/operators"
import { combineEpics } from "redux-observable"
import { from } from "rxjs/observable/from"
import { of } from "rxjs/observable/of"
import { ErrorInfo } from "./Types"
import { RootState } from "./Store"

type AuthUser = {
  uid: string
  displayName: string | null
  isAnonymous: boolean
}

function authUser(user: firebase.User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    isAnonymous: user.isAnonymous,
  }
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
    initialize() {},
    initializeCompleted(state, action: PayloadAction<AuthUser | null>) {
      state.currentUser = action.payload
      state.initialized = true
    },
    signInAnonymous(state) {
      state.ui.signIn.isPending = true
    },
    signInAnonymousSuccess(state, action: PayloadAction<AuthUser>) {
      state.currentUser = action.payload
      state.ui.signIn.isPending = false
    },
    signInAnonymousFailed(state, action: PayloadAction<ErrorInfo>) {
      state.ui.signIn.isPending = false
      state.ui.signIn.error = action.payload
    },
  },
})

const actions = slice.actions

const initializeEpic = (action$: Observable<Action>) =>
  action$.pipe(
    filter(actions.initialize.match),
    switchMap(() => {
      const user$ = new Observable<firebase.User | null>((subscriber) => {
        return firebase.auth().onAuthStateChanged(subscriber)
      })
      return user$.pipe(
        map((val) => actions.initializeCompleted(val ? authUser(val) : null)),
        take(1)
      )
    })
  )

const signInAnonymousEpic = (action$: Observable<Action>) =>
  action$.pipe(
    filter(actions.signInAnonymous.match),
    switchMap(() => {
      return from(firebase.auth().signInAnonymously()).pipe(
        map((cred) => {
          if (cred.user) {
            return actions.signInAnonymousSuccess(authUser(cred.user))
          } else {
            return actions.signInAnonymousFailed({
              message: "unexpected",
            })
          }
        }),
        catchError((err) => {
          return of(
            actions.signInAnonymousFailed({
              message: err.message,
              detail: err.toString(),
            })
          )
        })
      )
    })
  )

export const authEpic = combineEpics(initializeEpic, signInAnonymousEpic)
export const authReducer = slice.reducer
export const authActions = slice.actions

export function selectIsPendingSignIn(state: RootState): boolean {
  return !!state.auth.ui.signIn.isPending
}

export function selectCurrentUid(state: RootState): string | null {
  return state.auth.currentUser?.uid ?? null
}
