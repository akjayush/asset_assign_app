import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAyA_bzkirptScijyB12pIPk4Uir67f6wQ",
  authDomain: "device-form.firebaseapp.com",
  projectId: "device-form",
  storageBucket: "device-form.appspot.com",
  messagingSenderId: "554415645114",
  appId: "1:554415645114:web:b3282a2ef6e984d9eafd83",
  measurementId: "G-WNQHZMVF4X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const db = getFirestore(app);

export const auth = getAuth(app);
