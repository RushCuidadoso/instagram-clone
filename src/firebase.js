import firebase from 'firebase/compat';

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyA3_k3LoqSn4FkQqe17TtUoPvtqadHVbgs",
  authDomain: "instagram-clone-curso-cd8e1.firebaseapp.com",
  projectId: "instagram-clone-curso-cd8e1",
  storageBucket: "instagram-clone-curso-cd8e1.appspot.com",
  messagingSenderId: "236638985418",
  appId: "1:236638985418:web:d6b4bfeebad3d90664e833",
  measurementId: "G-XSX5TBG611"
});

// Initialize Firebase
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export {db, auth, storage, functions};