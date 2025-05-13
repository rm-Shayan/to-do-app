import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
   GoogleAuthProvider,
   signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAyl49QJtA6jMXluObD3LhE4vERqab1clA",
  authDomain: "to-do-app-ea448.firebaseapp.com",
  projectId: "to-do-app-ea448",
  storageBucket: "to-do-app-ea448.appspot.com", // ✅ Corrected
  messagingSenderId: "563290533291",
  appId: "1:563290533291:web:9269fb6ac15fa578e676ee",
  measurementId: "G-THS9662S03"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const gogleService=new GoogleAuthProvider()

// ✅ Export modules
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  gogleService,
  GoogleAuthProvider,
  db,
  addDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where
};
