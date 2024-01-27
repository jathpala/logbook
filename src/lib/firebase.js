import { dev } from "$app/environment"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUVYR6uKA-dXzCWaYGcyjdOaFyw1IBppg",
    authDomain: "logbook-md.firebaseapp.com",
    projectId: "logbook-md",
    storageBucket: "logbook-md.appspot.com",
    messagingSenderId: "748267480433",
    appId: "1:748267480433:web:51eeba6b79ea052a0a82d0"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Configure for development
if (dev) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099")
    connectFirestoreEmulator(db, "127.0.0.1", 9098)
}
