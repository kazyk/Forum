import { firestore } from "firebase"
import { formatISO, parseISO } from "date-fns"

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

export const threadConverter = {
  toFirestore(th: Thread): firestore.DocumentData {
    return {
      title: th.title,
      body: th.body,
      authorUid: th.authorUid,
      createdAt: firestore.Timestamp.fromDate(parseISO(th.createdAt)),
    }
  },
  fromFirestore(snapshot: firestore.QueryDocumentSnapshot): Thread {
    const data = snapshot.data()
    return {
      key: snapshot.id,
      title: data?.title,
      body: data?.body,
      authorUid: data?.author,
      createdAt: formatISO(data?.createdAt.toDate()),
    }
  },
}
