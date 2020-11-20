import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyAOJiPAGeZVNXIjxCMzv5D7x3Pb7ZD0RmU",
  authDomain: "book-santa-app-fca7a.firebaseapp.com",
  databaseURL: "https://book-santa-app-fca7a.firebaseio.com",
  projectId: "book-santa-app-fca7a",
  storageBucket: "book-santa-app-fca7a.appspot.com",
  messagingSenderId: "842810914864",
  appId: "1:842810914864:web:e6ffc518d576834fcfd5f5"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
