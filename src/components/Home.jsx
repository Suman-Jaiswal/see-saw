import React, { useEffect, useState } from 'react'
import Text from './Text';
import { connect } from 'react-redux'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import CreateChat from './CreateChat';
import { db } from '../firebase.config';

function Home(props) {

    const { currentUser, chats, setChats } = props
    const [loading, setLoading] = useState(true);

    const seesawMembers = ['sk.jaiswal1729@gmail.com']

    useEffect(() => {
        if (db) {
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


    // const createChat = async uid => {
    //     const creater = currentUser.uid
    //     const member = uid
    //     await db.collection('chats')
    //         .where('creater', '==', creater)
    //         .where('member', '==', member)
    //         .get()
    //         .then(res => {
    //             if (res.size === 0) {
    //                 db.collection('chats').add({
    //                     creater,
    //                     member
    //                 }).then(res => console.log(res))
    //             }
    //         })

    // }



    return (
        <div className='home'>{
            loading ? <Text text={'Loading...'} /> :
                <div className='container p-0'>
                    {
                        seesawMembers.includes(currentUser.email) &&
                        <Link to='/chat/see-saw' className='channelEl d-flex container mt-2' style={{
                            border: "2px solid #191919"
                        }}>
                            <img src='logo.webp' className='my-auto' alt="" id='Avatar' width={40} height={40} />
                            <div className='ms-3 h6 my-auto'>See Saw</div>
                        </Link>
                    }

                    {
                        chats.length === 0 ? <Text text={'Create Chats!'} /> :
                            chats.map(chat => {
                                if (chat.m1UID === currentUser.uid) {
                                    return (
                                        <Link key={chat.id} to={`/chat/${chat.id}`} className='channelEl d-flex container' style={{
                                            border: "2px solid #191919"
                                        }}>
                                            <img src={chat.m2DP} className='my-auto' alt="" id='Avatar' width={40} height={40} />
                                            <div className='ms-3 h6 my-auto'>{chat.m2Name}</div>
                                        </Link>
                                    )
                                }
                                else {
                                    return (
                                        <Link key={chat.id} to={`/chat/${chat.id}`} className='channelEl d-flex container' style={{
                                            border: "2px solid #191919"
                                        }}>
                                            <img src={chat.m1DP} className='my-auto' alt="" id='Avatar' width={40} height={40} />
                                            <div className='ms-3 h6 my-auto'>{chat.m1Name}</div>
                                        </Link>
                                    )
                                }
                            }

                            )
                    }

                </div>
        }
            <div className="footer row m-auto" style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                maxWidth: 600,
                height: 45,
            }}>
                <CreateChat />
                <div className="createBtn col-6 p-2 text-center text-secondary">
                    Create Group
                </div>
            </div>

        </div>
    )
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);