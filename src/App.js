import { useState, useEffect } from 'react';
import './App.css';
//firebase dep
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import {useAuthState} from 'react-firebase-hooks/auth';
// import {useCollectionData} from 'react-firebase-hooks/firestore';

//components
import Button from './components/Button';
import Header from './components/Header.jsx';
import Channel from './components/Channel.jsx'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNgFUnzymEne5SHK6-lXxSFHkGMO7_bF4",
    authDomain: "chat-app-b8cf5.firebaseapp.com",
    projectId: "chat-app-b8cf5",
    storageBucket: "chat-app-b8cf5.appspot.com",
    messagingSenderId: "317951965735",
    appId: "1:317951965735:web:2847503ebb626b5f042c02"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
function App() {
    const [user, setUser] = useState(() => auth.currentUser);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                console.log(user)
            } else {
                setUser(null);
            }
            if (initializing) {
                setInitializing(false);
            }
        })
        return unsubscribe
    });

    const signInWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.useDeviceLanguage();

        try {
            await auth.signInWithPopup(provider)
        } catch (error) {
            console.error(error);
        }
    };

    const signOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.log(error.message);
        }
    };

    if (initializing) return (
        <h2>Loading...</h2>
    )

    return (

        <div>
            {user ? (
                <>
                    <Header signOut={signOut} />
                    <Channel auth={auth} user={user} db={db} />
                </>
            ) : (
                <Button onClick={signInWithGoogle}>Sign In with Google</Button>
            )}
        </div>
    );
}

export default App;
