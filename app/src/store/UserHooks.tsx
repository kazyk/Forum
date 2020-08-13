import { useSelector } from "./Store"
import { selectMe, userActions } from "./User"
import { useDispatch } from "react-redux"

export function useMe(params: { navigateToRegistration: () => void }) {
  const dispatch = useDispatch()
  const me = useSelector(selectMe)
  if (!me.user && !me.isFetching) {
    if (me.lastError === undefined || me.lastError != null) {
      dispatch(userActions.fetchMe())
    } else if (me.lastError === null) {
      params.navigateToRegistration()
    }
  }
  return me.user
}
