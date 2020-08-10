export type ErrorInfo = {
  message: string
  detail?: string
}

export interface Thread {
  title: string
  body: string
  authorUid: string | null
}
