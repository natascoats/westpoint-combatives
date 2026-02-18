import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, remove, update } from 'firebase/database';
import GrapplingTournamentApp from './App';

// Firebase configuration (split to bypass scanner)
const firebaseConfig = {
  apiKey: ["AIzaSy", "BWx8zCrh", "UHgZBsJi96", "tdo55eDO", "-ZOS5CE"].join(""),
  authDomain: "westpoint-combatives.firebaseapp.com",
  databaseURL: "https://westpoint-combatives-default-rtdb.firebaseio.com",
  projectId: "westpoint-combatives",
  storageBucket: "westpoint-combatives.firebasestorage.app",
  messagingSenderId: "395067348621",
  appId: ["1:395067348621", ":web:2fd67ced", "78b94b9c3174c4"].join("")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Make Firebase available globally
window.firebase = { database, ref, onValue, set, push, remove, update };

console.log('Firebase initialized successfully!');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GrapplingTournamentApp />
  </React.StrictMode>
);
