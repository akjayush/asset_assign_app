import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDes2Zkgirkk0tXSoT1R4iaEIZl-cCUqMA",
  authDomain: "inventory-management-939b3.firebaseapp.com",
  projectId: "inventory-management-939b3",
  storageBucket: "inventory-management-939b3.appspot.com",
  messagingSenderId: "207321633039",
  appId: "1:207321633039:web:dd028ae68c7e7ea020ee7a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const db = getFirestore(app);

export const auth = getAuth(app);
