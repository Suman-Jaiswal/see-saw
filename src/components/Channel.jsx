import { useState, useEffect } from 'react';
import Message from './Message'
import '../App.css'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import Text from './Text';
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase.config';


const Channel = ({ currentUser }) => {

    const { chatId } = useParams()
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { uid, displayName, photoURL } = currentUser;


    useEffect(() => {
        if (db) {
            const unsubscribe = async () => {
                const q = query(collection(db, 'messages'), where('chatId', '==', chatId), orderBy('createdAt'), limit(1000))
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,

                }));
                setMessages(data);
                setLoading(false)

            }
            unsubscribe();
        }
    }, [chatId]);

    useEffect(() => {
        if (messages.length === 0) return
        if (!document.querySelector('.scroll')) return
        document.querySelector('.scroll').scrollIntoView()
    })

    const handleOnChange = e => {
        setNewMessage(e.target.value);
    }

    const handleOnSubmit = e => {
        e.preventDefault();
        const doc = {
            text: newMessage,
            createdAt: serverTimestamp(),
            displayName,
            uid,
            photoURL,
            chatId: chatId
        }
        if (db) {
            addDoc(collection(db, 'messages'), doc)
            setNewMessage('');
            setMessages(prev => [...prev, doc])
        }
    }

    return (

        <>{
            loading ? <Text text={'Loading...'} /> :
                <>
                    <div id="channel" className="channel">

                        {messages.length === 0 ? <>
                            <div
                                style={{
                                    color: "#555",
                                    textAlign: "center",
                                    marginTop: 50
                                }}
                            >No Messages!
                            </div>
                        </> : messages.map(message => (
                            <li className={currentUser.uid === message.uid ? "self" : "other"} key={message.id}>
                                <Message message={message} />
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
                            <i className="material-icons">send</i>
                        </button>
                    </form>
                </>
        }

        </>
    );
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.user,
        chats: state.chats
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setChats: (data) => {
            dispatch({ type: 'SET_CHATS', payload: data })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Channel);