// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import {getFirestore} from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIB_API_KEY,
  authDomain: "house-marketplace-c097e.firebaseapp.com",
  projectId: "house-marketplace-c097e",
  storageBucket: "house-marketplace-c097e.appspot.com",
  messagingSenderId: "473651805211",
  appId: "1:473651805211:web:45581db196e9edab2f8cbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(); 