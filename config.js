import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyAUe2vTgFwghOIRm5BO5g7DjBVd8VML5C8",
  authDomain: "book-santa-3a0d5.firebaseapp.com",
  projectId: "book-santa-3a0d5",
  storageBucket: "book-santa-3a0d5.appspot.com",
  messagingSenderId: "279729884307",
  appId: "1:279729884307:web:875cd4c3b76c3919d45166"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
