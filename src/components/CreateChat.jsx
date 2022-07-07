import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.config'

function CreateChat(props) {

    const { currentUser, allUsers, addChat, chats } = props
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate()

    const createChat = async m2 => {
        const doc = {
            bothIds: [currentUser.uid, m2.uid],
            m1UID: currentUser.uid,
            m2UID: m2.uid,
            m1Name: currentUser.displayName,
            m2Name: m2.displayName,
            m1Email: currentUser.email,
            m2Email: m2.email,
            m1DP: currentUser.photoURL,
            m2DP: m2.photoURL,
        }

        await
            addDoc(collection(db, 'chats'), doc)
                .then(res => {
                    setOpen(false)
                    addChat({ ...doc, id: res.id })
                    navigate(`/chat/${res.id}`)
                })
        setCreating(false)
    }

    const handleCreate = (u) => {
        setCreating(true);
        createChat(u)
    }

    return (<>
        <div onClick={() => setOpen(true)} className="createBtn col-6 p-2 text-center" style={{ fontSize: 14 }}>
            Create Chat
        </div>
        <Modal className='bg-dark' show={open} onHide={() => setOpen(false)}>
            <Modal.Header style={{
                backgroundColor: "#191919",
                borderBottom: "none"
            }}>USERS</Modal.Header>



            <Modal.Body style={{
                backgroundColor: "#191919"
            }}>
                {
                    allUsers.map(u => {
                        const c = chats.filter(c => c.bothIds.includes(u.uid))
                        if (c.length === 0 && !creating) {
                            return (
                                <div onClick={() => handleCreate(u)}
                                    style={{
                                        backgroundColor: "#323232",
                                        cursor: "pointer"
                                    }}
                                    className="user p-2 px-3 d-flex" key={u.id}>
                                    <img src={u.photoURL} alt="" id='Avatar' width={40} height={40} />
                                    <div className='ms-2 my-auto'>{u.displayName}</div>
                                </div>
                            )
                        }
                        else return <div
                            style={{
                                backgroundColor: "#323232",
                                cursor: "pointer",
                                filter: "grayscale(1)"
                            }}
                            className="user p-2 px-3 d-flex" key={u.id}>
                            <img src={u.photoURL} alt="" id='Avatar' width={40} height={40} />
                            <div className='ms-2 my-auto'>{u.displayName}</div>
                        </div>
                    })
                }
            </Modal.Body>
        </Modal>
    </>

    )
}
const mapStateToProps = (state) => {
    return {
        currentUser: state.user,
        allUsers: state.users,
        chats: state.chats
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addChat: (data) => {
            dispatch({ type: 'ADD_CHAT', payload: data })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChat);