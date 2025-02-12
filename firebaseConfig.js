import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzasyD3WLy0K8hNSR...",
    authDomain: "loveseek-chat.firebaseapp.com",
    projectId: "loveseek-chat",
    storageBucket: "loveseek-chat.appspot.com",
    messagingSenderId: "1056941258879",
    appId: "1:1056941258879:web:381f2d40f8bf15bf8ea74a",
    measurementId: "G-MNQ5ST16KF"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
