import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { firestore } from "firebase"
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
import { User, userConverter } from "./Types"

export type UserState = {
  me: User | null
}

const initialState: UserState = {
  me: null,
}

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchMe() {},
    fetchMeSuccess(state, action: PayloadAction<User | null>) {
      state.me = action.payload
    },
    fetchMeFailed() {},
  },
})

const actions = slice.actions

const fetchMeEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(actions.fetchMe.match),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const uid = selectCurrentUid(state)
      if (!uid) {
        return of(actions.fetchMeFailed())
      }
      const query = firestore()
        .collection("users")
        .doc(uid)
        .withConverter(userConverter)
      return from(query.get()).pipe(
        map((snapshot) => {
          return actions.fetchMeSuccess(snapshot.data() ?? null)
        }),
        catchError(() => of(actions.fetchMeFailed()))
      )
    })
  )

export const userEpic = combineEpics(fetchMeEpic)
export const userReducer = slice.reducer
export const userActions = slice.actions

export function selectMe(state: RootState) {
  return state.user.me
}
