import { useState , useEffect} from 'react';
import './App.css';
//firebase dep
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import {useAuthState} from 'react-firebase-hooks/auth';
// import {useCollectionData} from 'react-firebase-hooks/firestore';

//components
import Button from './components/Button';
import Header from './components/Header';
import Channel from './components/Channel'


firebase.initializeApp({
    apiKey: "AIzaSyDxijJU9Z0r9_PEmBd8OOcZ7hdE0JGqv6Y",
    authDomain: "see-saw-1c068.firebaseapp.com",
    projectId: "see-saw-1c068",
    storageBucket: "see-saw-1c068.appspot.com",
    messagingSenderId: "216833997490",
    appId: "1:216833997490:web:a613b781360d99625ba7ab"

})
const auth = firebase.auth(); 
const db = firebase.firestore(); 
function App() {
  const [user, setUser] = useState(()=> auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
   const unsubscribe =  auth.onAuthStateChanged(user => {
      if (user){
        setUser(user);
      }else {
        setUser(null);
      }
      if (initializing){
        setInitializing(false);
      }
    })
    return unsubscribe
  });

  const signInWithGoogle = async()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();

    try {
      await auth.signInWithPopup(provider)
    } catch (error) {
      console.error(error);
    }
  };
   
    const signOut = async () =>{
      try {
        await firebase.auth().signOut();
      }catch (error) {
        console.log(error.message);
      }
    };

  if (initializing) return (
    <h2>Loading...</h2>
    )
  
  return (
    
    <div>
     {user? (
       <>
       <div id="top">
       <Header/>
       <Button onClick = {signOut} >Sign Out</Button>
       </div> <hr id="hr"/>
       <Channel auth= {auth} user={user} db={db} />
       </>
     ): (
     <Button onClick = {signInWithGoogle}>Sign In with Google</Button> 
     )}
    </div>
  );
}

export default App;
