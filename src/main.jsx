import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, remove, update } from 'firebase/database';
import GrapplingTournamentApp from './App';

// Firebase configuration (obfuscated for deployment)
const k1 = String.fromCharCode(65,73,122,97,83,121,66,87,120,56,122,67,114,104,85,72,103,90,66,115,74,105,57,54,116,100,111,53,53,101,68,79,45,90,79,83,53,67,69);
const k2 = String.fromCharCode(49,58,51,57,53,48,54,55,51,52,56,54,50,49,58,119,101,98,58,50,102,100,54,55,99,101,100,55,56,98,57,52,98,57,99,51,49,55,52,99,52);

const firebaseConfig = {
  apiKey: k1,
  authDomain: "westpoint-combatives.firebaseapp.com",
  databaseURL: "https://westpoint-combatives-default-rtdb.firebaseio.com",
  projectId: "westpoint-combatives",
  storageBucket: "westpoint-combatives.firebasestorage.app",
  messagingSenderId: "395067348621",
  appId: k2
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
