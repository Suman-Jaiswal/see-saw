import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCNgFUnzymEne5SHK6-lXxSFHkGMO7_bF4",
    authDomain: "chat-app-b8cf5.firebaseapp.com",
    projectId: "chat-app-b8cf5",
    storageBucket: "chat-app-b8cf5.appspot.com",
    messagingSenderId: "317951965735",
    appId: "1:317951965735:web:2847503ebb626b5f042c02"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
