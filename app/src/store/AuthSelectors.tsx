import { RootState } from "./Store"

export function selectIsPendingSignIn(state: RootState) {
  return !!state.auth.ui.signIn.isPending
}
