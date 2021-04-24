import { useRef, useState, useEffect } from 'react';
//firebase dep
import firebase from 'firebase/app';
import Message from './Message'
import '../App.css'



const Channel = ({ user = null, db = null }, props) => {
  const auth = props.auth;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const {  uid , displayName, photoURL } = user;
  const dummy = useRef();


  useEffect(() => {
    if (db) {
      const unsubscribe = db
        .collection('messages')
        .orderBy('createdAt')
        .limit(100)
        .onSnapshot(querySnapshot => {
          const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,

          }));
          setMessages(data);
        });
      return unsubscribe;
    }
  }, [db]);

  const handleOnChange = e => {
    setNewMessage(e.target.value);
  }

  const handleOnSubmit = e => {
    e.preventDefault();
     
    if (db) {
      db.collection('messages').add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName,
        uid,
        photoURL
      })
      setNewMessage('');

    }
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  
  
  return (

    <>
      <ul>
        {messages.map(message => (
          <li key={message.id}>
            <Message auth={auth} msg = {message} {...message} />
            <span ref={dummy}></span>
          </li>

        ))}
      </ul>



      <form onSubmit={handleOnSubmit}>
        <input type="text"
          value={newMessage}
          onChange={handleOnChange}
          placeholder="Type a message"
          id="placeholder"
        />
        <button type="submit" disabled={!newMessage}>
          &#128640;
        </button>
      </form>
    </>
  );
};

export default Channel;