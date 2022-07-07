import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.config';

function CreateGroup(props) {

    const { allUsers, addGroup } = props
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [membersIds, setIds] = useState([]);
    const [grpName, setName] = useState([]);
    const navigate = useNavigate()



    const createGroup = async () => {
        const doc = {
            membersIds,
            grpName,
        }

        await
            addDoc(collection(db, 'groups'), doc)
                .then(res => {
                    setOpen(false)
                    addGroup({ ...doc, id: res.id })
                    navigate(`/group/${res.id}`)
                })
        setCreating(false)
    }

    const handleCreate = () => {
        setCreating(true);
        createGroup()
    }

    return (<>
        <div onClick={() => setOpen(true)} className="createBtn col-6 p-2 text-center" style={{ fontSize: 14 }}>
            Create Group
        </div>
        <Modal className='bg-dark h-100' show={open} onHide={() => setOpen(false)}>
            <Modal.Header style={{
                backgroundColor: "#191919",
                borderBottom: "none"
            }}>
                <div className="d-flex w-100 align-items-center  justify-content-between">
                    <input className='w-50' type="text" placeholder='Enter Group Name' onChange={(e) => setName(e.target.value)} />
                    <div role={'button'} onClick={() => setIds([])}>{membersIds.length > 0 && "Unselect All"}</div>
                </div>

            </Modal.Header>

            <Modal.Body style={{
                backgroundColor: "#191919",
                overflowY: "scroll",
            }}>
                {
                    allUsers.map(u => {
                        if (!creating) {
                            return (
                                <div onClick={() =>
                                    membersIds.includes(u.uid) ? setIds(membersIds.filter(id => id !== u.uid)) :
                                        setIds([...membersIds, u.uid])
                                }
                                    style={{
                                        backgroundColor: membersIds.includes(u.uid) ? "#202124" : "#323232",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #191919"
                                    }}
                                    className="user p-2 px-3 d-flex" key={u.id}>
                                    <img src={u.photoURL} alt="" id='Avatar' width={40} height={40} />
                                    <div className='ms-2 my-auto'>{u.displayName}</div>
                                    <div className='ms-2 my-auto'>{membersIds.includes(u.uid) &&
                                        (<>&#10003;</>)
                                    }</div>

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
            <Modal.Footer
                style={{
                    backgroundColor: "#191919",
                    borderTop: "none"
                }}><Button disabled={creating || grpName.length === 0 || membersIds.length === 0} onClick={handleCreate} >
                    {
                        creating ? <i>creating...</i> : "Create"
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    </>

    )
}
const mapStateToProps = (state) => {
    return {
        currentUser: state.user,
        groups: state.groups,
        allUsers: state.users
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addGroup: (data) => {
            dispatch({ type: 'ADD_GROUP', payload: data })
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);