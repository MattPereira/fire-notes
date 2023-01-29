import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// From firbase console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBRr_DJIzjnwCKipvu14DDOok3F-xu3XAI",
  authDomain: "firenotes-eee87.firebaseapp.com",
  projectId: "firenotes-eee87",
  storageBucket: "firenotes-eee87.appspot.com",
  messagingSenderId: "843312473322",
  appId: "1:843312473322:web:cda1e6998ff8992e00e393",
  measurementId: "G-5Y2FBFL8FX",
};

// Special initialization to prevent multiple instances of firebase with next.js
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export const storage = firebase.storage();
// special firebase event to listen for the progress of the file upload
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function noteToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis() || 0,
    updatedAt: data.updatedAt.toMillis() || 0,
  };
}
