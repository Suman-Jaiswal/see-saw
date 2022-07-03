import { useState, useEffect } from 'react';
import './App.css';
//firebase dep
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import {useAuthState} from 'react-firebase-hooks/auth';
// import {useCollectionData} from 'react-firebase-hooks/firestore';

//components
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


    async function clearChat(db, collectionPath, batchSize) {
        const collectionRef = db.collection(collectionPath);
        const query = collectionRef.orderBy('__name__').limit(batchSize);

        return new Promise((resolve, reject) => {
            deleteQueryBatch(db, query, resolve).catch(reject);
        });
    }

    async function deleteQueryBatch(db, query, resolve) {
        const snapshot = await query.get();

        const batchSize = snapshot.size;
        if (batchSize === 0) {
            // When there are no documents left, we are done
            resolve();
            return;
        }

        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, resolve);
        });
    }


    if (initializing) return (
        <h4 style={{
            marginTop: 100,
            textAlign: "center"
        }}>Loading...</h4>
    )

    return (

        <div className='app'>
            {user ? (
                <>
                    <Header signOut={signOut} clearChat={clearChat} db={db} />
                    <Channel auth={auth} user={user} db={db} />
                </>
            ) : (
                <div className='home'>
                    <div>
                        <img src="logo.webp" alt="" width={200} height={200} />
                        <h1 style={{
                            textAlign: "center"
                        }}>See Saw</h1>
                    </div>

                    <button className='login' onClick={signInWithGoogle}>Sign In with Google</button>
                </div>

            )}
        </div>
    );
}

export default App;
