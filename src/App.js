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
import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';

function App(props) {
    const {
        currentUser,
        authorised,
        setUser,
        clearUser,
        setChats,
        setGroups,
        setUsers,
    } = props

    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);


    // sign in a user
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
                        })
                }
                setInitializing(false)
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


    // get all chats for current user
    useEffect(() => {
        if (db) {
            setLoading(true)
            const unsubscribe = async () => {
                const chatsRef = collection(db, 'chats');
                const q = query(chatsRef, where('bothIds', 'array-contains', currentUser.uid))
                const snapshot = await getDocs(q)

                const data = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,

                }));
                setChats(data);
                setLoading(false)

            }
            unsubscribe();
        }
    }, [currentUser.uid, setChats])


    // get all groups of current user
    useEffect(() => {
        if (db) {
            setLoading(true)
            const unsubscribe = async () => {
                const grpsRef = collection(db, 'groups');
                const q = query(grpsRef, where('membersIds', 'array-contains', currentUser.uid))
                const snapshot = await getDocs(q)

                const data = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,

                }));
                setGroups(data);
                setLoading(false)

            }
            unsubscribe();
        }
    }, [currentUser.uid, setGroups])


    //  get all users
    useEffect(() => {
        if (db) {
            setLoading(true)
            const unsubscribe = async () => {
                const q = query(collection(db, 'users'), orderBy('displayName'))
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,

                }));
                setUsers(data)
            }
            unsubscribe()
        }
    }, [setUsers])


    return (
        <div className='app'>
            {
                initializing ? <Text text={'Initialising...'} /> :
                    authorised ?
                        <Routes>
                            <Route path="/" exact element={
                                <>
                                    <Header signOut={logOut} />
                                    <Home loading={loading} />
                                </>
                            } />
                            <Route path="/chat/:id" exact element={
                                <>
                                    <Header signOut={logOut} />
                                    <Channel />
                                </>
                            } />
                            <Route path="/group/:id" exact element={
                                <>
                                    <Header signOut={logOut} />
                                    <Channel />
                                </>
                            } />
                        </Routes>
                        :
                        <div className='landing'>
                            <div>
                                <img src="logo.webp" alt="" width={200} height={200} />
                                <h1 style={{
                                    textAlign: "center"
                                }}>See Saw</h1>
                            </div>

                            <button className='login' onClick={signInWithGoogle}>Sign In with Google</button>
                        </div>

            }
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
        setChats: (data) => {
            dispatch({ type: 'SET_CHATS', payload: data })
        },
        setGroups: (data) => {
            dispatch({ type: 'SET_GROUPS', payload: data })
        },
        setUsers: (data) => {
            dispatch({ type: 'SET_USERS', payload: data })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
