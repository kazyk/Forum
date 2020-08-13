import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { firestore } from "firebase"
import { combineEpics } from "redux-observable"
import { from, of, EMPTY } from "rxjs"
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
  startWith,
} from "rxjs/operators"
import { selectCurrentUid } from "./Auth"
import { AppEpic, RootState } from "./Store"
import { User, userConverter, ErrorInfo, toErrorInfo } from "./Types"

export type UserState = {
  me: {
    user: User | null
    isFetching?: boolean
    lastError?: ErrorInfo | null
  }
  ui: {
    registration: {
      isPending?: boolean
      success?: boolean
      error?: ErrorInfo | null
    }
  }
}

const initialState: UserState = {
  me: {
    user: null,
  },
  ui: {
    registration: {},
  },
}

type RegisterParams = {
  displayName: string
}

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchMe() {},
    fetchMeStarted(state) {
      state.me.isFetching = true
    },
    fetchMeSuccess(state, action: PayloadAction<User | null>) {
      state.me.user = action.payload
      state.me.isFetching = false
      state.me.lastError = null
    },
    fetchMeFailed(state, action: PayloadAction<ErrorInfo>) {
      state.me.isFetching = false
      state.me.lastError = action.payload
    },
    register(state, action: PayloadAction<RegisterParams>) {
      state.ui.registration.isPending = true
    },
    registerSuccess(state, action: PayloadAction<User>) {
      state.ui.registration.isPending = false
      state.ui.registration.success = true
      state.ui.registration.error = null
      state.me.user = action.payload
    },
    registerFailed(state, action: PayloadAction<ErrorInfo>) {
      state.ui.registration.isPending = false
      state.ui.registration.error = action.payload
    },
    registrationClear(state) {
      state.ui.registration = {}
    },
  },
})

const actions = slice.actions

const fetchMeEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(actions.fetchMe.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      if (state.user.me.isFetching) {
        return EMPTY
      }
      const uid = selectCurrentUid(state)
      if (!uid) {
        return of(
          actions.fetchMeFailed({
            message: "",
          })
        )
      }

      const query = firestore()
        .collection("users")
        .doc(uid)
        .withConverter(userConverter)
      return from(query.get()).pipe(
        map((snapshot) => {
          return actions.fetchMeSuccess(snapshot.data() ?? null)
        }),
        catchError((err) => of(actions.fetchMeFailed(toErrorInfo(err)))),
        startWith(actions.fetchMeStarted())
      )
    })
  )

const registerEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(actions.register.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const uid = selectCurrentUid(state)
      if (!uid) {
        return of(actions.registerFailed({ message: "" }))
      }
      const docRef = firestore()
        .collection("users")
        .doc(uid)
        .withConverter(userConverter)
      const query = docRef
        .set({
          uid,
          displayName: action.payload.displayName,
        })
        .then(() => docRef.get())
      return from(query).pipe(
        map((doc) => {
          return actions.registerSuccess(doc.data()!)
        }),
        catchError((err) => of(actions.registerFailed(toErrorInfo(err))))
      )
    })
  )

export const userEpic = combineEpics(fetchMeEpic, registerEpic)
export const userReducer = slice.reducer
export const userActions = slice.actions

export function selectMe(state: RootState) {
  return state.user.me
}

export function selectRegisterUserIsPending(state: RootState) {
  return !!state.user.ui.registration.isPending
}

export function selectRegistrationUserSuccess(state: RootState) {
  return !!state.user.ui.registration.success
}
