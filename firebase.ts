
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DIQQAT: Bu yerga o'z Firebase konsolingizdan olingan kodni qo'ying
const firebaseConfig = {
  apiKey: "AIzaSyBZvlQ7cgPkjR3JnAbQdUCgudvtkcSSIuo",
  authDomain: "eduquest-school.firebaseapp.com",
  projectId: "eduquest-school",
  storageBucket: "eduquest-school.firebasestorage.app",
  messagingSenderId: "294561114972",
  appId: "1:294561114972:web:1bd1bb9f4b1e0da7ec2f99"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
