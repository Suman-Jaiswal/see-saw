import { useState, useEffect } from 'react';
import './App.css'
import Header from './components/Header.jsx';
import Channel from './components/Channel.jsx'
import Text from './components/Text';
import { connect } from 'react-redux'
import {
    Routes,
    Route,
} from "react-router-dom"
import Home from './components/Home';
import { auth, db } from './firebase.config';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

function App(props) {
    const { authorised, setUser, clearUser } = props
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, async user => {
            if (user) {
                const usersRef = collection(db, 'users')
                const q = query(usersRef, where('uid', '==', user.uid));
                const userInst = await getDocs(q);
                if (userInst.size) {
                    const data = userInst.docs[0].data()
                    setUser({
                        uid: data.uid,
                        displayName: data.displayName,
                        photoURL: data.photoURL,
                        email: data.email,
                        admin: data.admin,
                    })
                    setInitializing(false)
                }
                else {
                    addDoc(usersRef, {
                        displayName: user.displayName,
                        email: user.email,
                        uid: user.uid,
                        photoURL: user.photoURL,
                        admin: false
                    })
                        .then(res => {
                            console.log('user created')
                            const data = user
                            setUser({
                                uid: data.uid,
                                displayName: data.displayName,
                                photoURL: data.photoURL,
                                email: data.email,
                                admin: data.admin,
                            })
                            setInitializing(false)
                        })
                }
            } else {
                clearUser()
                setInitializing(false)
            }
        })
    }, [clearUser, setUser]);

    const signInWithGoogle = async () => {

        const provider = new GoogleAuthProvider()
        auth.useDeviceLanguage();

        try {
            await signInWithPopup(auth, provider)
        } catch (error) {
            console.error(error);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            clearUser()
        } catch (error) {
            console.log(error.message);
        }
    };


    async function clearChat(db, collectionPath, batchSize) {
        const collectionRef = collectionPath(collectionPath)
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
        <Text text={'Initialising...'} />
    )

    return (

        <div className='app'>
            {authorised ? (
                <>

                    <Routes>
                        <Route path="/" exact element={
                            <>
                                <Header signOut={logOut} clearChat={clearChat} />
                                <Home />
                            </>
                        } />
                        <Route path="/chat/:chatId" exact element={
                            <>
                                <Header signOut={logOut} clearChat={clearChat} />
                                <Channel />
                            </>
                        } />
                    </Routes>
                </>
            ) : (
                <div className='landing'>
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

const mapStateToProps = (state) => {
    return {
        currentUser: state.user,
        authorised: state.authorised
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (data) => {
            dispatch({ type: 'SET_USER', payload: data })
        },
        clearUser: () => {
            dispatch({ type: 'CLEAR_USER' })
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
