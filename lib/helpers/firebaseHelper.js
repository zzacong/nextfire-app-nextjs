import firebase from 'firebase/app'
import { firestore } from '../config/firebase'

async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! Firestore timestamp NOT serialzable to JSON
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}

const fromMillis = firebase.firestore.Timestamp.fromMillis
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

export { getUserWithUsername, postToJSON, fromMillis, serverTimestamp }
