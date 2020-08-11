import { firestore } from "firebase"

export type ErrorInfo = {
  message: string
  detail?: string
}

export interface Thread {
  key: string
  title: string
  body: string
  authorUid: string
  createdAt: string
}

export function toThread(doc: firestore.DocumentSnapshot): Thread {
  const data = doc.data()
  return {
    key: doc.id,
    title: data?.title,
    body: data?.body,
    authorUid: data?.author,
    createdAt: data?.createdAt.toDate().toString(),
  }
}
