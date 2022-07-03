import { useState, useEffect } from 'react';
//firebase dep
import firebase from 'firebase/app';
import Message from './Message'
import '../App.css'



const Channel = ({ user = null, db = null }, props) => {
    const auth = props.auth;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { uid, displayName, photoURL } = user;

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
                    setLoading(false)
                    document.querySelector('.scroll').scrollIntoView()
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
    }


    return (

        <>{
            loading ? <div
                style={{
                    color: "#555",
                    textAlign: "center",
                    marginTop: 50
                }}
            >Loading...</div> :
                <>
                    <div id="channel" className="channel">

                        {messages.length === 0 ? <div
                            style={{
                                color: "#555",
                                textAlign: "center",
                                marginTop: 50
                            }}
                        >No Messages!</div> : messages.map(message => (
                            <li className={user.uid === message.uid ? "self" : "other"} key={message.id}>
                                <Message auth={auth}  {...message} />
                            </li>
                        ))}

                    </div>

                    <div className="scroll"></div>


                    <form autoComplete='off' onSubmit={handleOnSubmit}>
                        <input type="text"
                            value={newMessage}
                            onChange={handleOnChange}
                            placeholder="Type a message"
                            id="placeholder"
                        />
                        <button className='submit' type="submit" disabled={newMessage === ''}>
                            <i class="material-icons">send</i>
                        </button>
                    </form>
                </>
        }




        </>
    );
};

export default Channel;