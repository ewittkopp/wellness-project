import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyC6a2AV0uzI9_pAxQfF1elrShXqmiLUCmo",
    authDomain: "wellness-tracking-app.firebaseapp.com",
    projectId: "wellness-tracking-app",
    storageBucket: "wellness-tracking-app.firebasestorage.app",
    messagingSenderId: "947082404419",
    appId: "1:947082404419:web:10e092c64f958d4cd82af6"
  };



const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);
export const auth = getAuth(firebase_app); 