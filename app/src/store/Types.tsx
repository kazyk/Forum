import { firestore } from "firebase"
import { formatISO, parseISO } from "date-fns"

export type ErrorInfo = {
  message: string
  detail?: string
}

export function toErrorInfo(err: Error): ErrorInfo {
  return {
    message: err.message,
    detail: err.toString(),
  }
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
      title: data.title,
      body: data.body,
      authorUid: data.authorUid,
      createdAt: formatISO(data.createdAt.toDate()),
    }
  },
}

export interface User {
  uid: string
  displayName: string
  createdAt?: string
}

export const userConverter = {
  toFirestore(u: User): firestore.DocumentData {
    return {
      displayName: u.displayName,
      createdAt: u.createdAt ?? firestore.FieldValue.serverTimestamp(),
    }
  },
  fromFirestore(snapshot: firestore.QueryDocumentSnapshot): User {
    const data = snapshot.data()
    return {
      uid: snapshot.id,
      displayName: data.displayName,
      createdAt: formatISO(data.createdAt.toDate()),
    }
  },
}
