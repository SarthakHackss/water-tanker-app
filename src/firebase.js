import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcvlyAyznO9Fiq8D6_SDCSSLCVddJN5Aw",
  authDomain: "water-tanker-app-eacd3.firebaseapp.com",
  projectId: "water-tanker-app-eacd3",
  storageBucket: "water-tanker-app-eacd3.firebasestorage.app",
  messagingSenderId: "518620837314",
  appId: "1:518620837314:web:1be6035e6a6777825dd25b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
