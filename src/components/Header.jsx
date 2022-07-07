import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../App.css'
import { connect } from 'react-redux'

function Header({ signOut, currentUser, chats, groups }) {

    const { id } = useParams()
    const [chat, setChat] = useState(null)
    const [group, setGroup] = useState([])

    console.log(group)

    useEffect(() => {
        setChat(chats.filter(c => c.id === id)[0])
        setGroup(groups.filter(c => c.id === id))
    }, [id, chats, groups])

    return (
        <div className="header">
            {group.length > 0 ?
                <div className='logo'>
                    <img src='/grp.jpg' alt="" id='Avatar' width={30} height={30} />
                    <span className='logoname ms-2'>
                        {group[0].grpName}
                    </span>
                </div> :
                <>
                    {
                        chat ? chat.m1UID === currentUser.uid ?

                            <div className='logo'>
                                <img src={chat.m2DP} alt="" id='Avatar' width={30} height={30} />
                                <span className='logoname ms-2'>
                                    {chat.m2Name.split(' ')[0]}
                                </span>
                            </div>

                            :
                            <div className='logo'>
                                <img src={chat.m1DP} alt="" id='Avatar' width={30} height={30} />
                                <span className='logoname ms-2'>
                                    {chat.m1Name.split(' ')[0]}
                                </span>
                            </div>

                            :
                            <div className='logo'>
                                <img src='logo.webp' alt="" id='Avatar' width={30} height={30} />
                                <span className='logoname ms-2'>
                                    See Saw
                                </span>
                            </div>
                    }
                </>
            }


            <div className="dropdown">
                <button className="dropbtn">&#10247;</button>
                <div className="dropdown-content">
                    {/* <div className='' onClick={() => clearChat(db, 'messages', 100)} >Clear Chat</div> */}
                    <div className='text-danger' onClick={signOut} >Sign Out</div>
                </div>
            </div>

        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        currentUser: state.user,
        chats: state.chats,
        groups: state.groups
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addChat: (data) => {
            dispatch({ type: 'ADD_CHAT', payload: data })
        },
        setUsers: (data) => {
            dispatch({ type: 'SET_USERS', payload: data })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);