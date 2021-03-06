import React, { useState } from 'react'
import Text from './Text';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import CreateChat from './CreateChat';
import CreateGroup from './CreateGroup';

function Home(props) {

    const { currentUser, chats, groups, loading } = props
    const [tab, setTab] = useState('chats');

    const seesawMembers = ['sk.jaiswal1729@gmail.com']

    return (
        <div className='home'>{
            loading ? <Text text={'Loading...'} /> :
                <div className='container p-0'>
                    <div className="row header m-0 mb-1  py-2" style={{
                        position: "sticky",
                        top: 50,
                        backgroundColor: "#191919",
                        zIndex: 1
                    }}>
                        <div onClick={
                            () => setTab('chats')
                        }
                            className="col text-center mx-2 py-2"
                            role={'button'}
                            style={{
                                color: tab === 'chats' && "green",
                                borderBottom: tab === 'chats' && "2px solid green",
                                fontSize: 13
                            }}>
                            CHATS
                        </div>
                        <div onClick={
                            () => setTab('groups')
                        }
                            className="col text-center mx-2 py-2"
                            role={'button'}
                            style={{
                                color: tab === 'groups' && "green",
                                borderBottom: tab === 'groups' && "2px solid green",
                                fontSize: 13
                            }}>
                            GROUPS
                        </div>
                    </div>
                    {
                        tab === 'chats' ? <>
                            {
                                chats.length === 0 ? <Text text={'Create Chats!'} /> :
                                    chats.map(chat => {
                                        if (chat.m1UID === currentUser.uid) {
                                            return (
                                                <Link key={chat.id} to={`/chat/${chat.id}`} className='channelEl d-flex container' style={{
                                                    margin: "2px 0"
                                                }}>
                                                    <img src={chat.m2DP} className='my-auto' alt="" id='Avatar' width={40} height={40} />
                                                    <div className='ms-3 h6 my-auto'>{chat.m2Name}</div>
                                                </Link>
                                            )
                                        }
                                        else {
                                            return (
                                                <Link key={chat.id} to={`/chat/${chat.id}`} className='channelEl d-flex container' style={{
                                                    margin: "2px 0"
                                                }}>
                                                    <img src={chat.m1DP} className='my-auto' alt="" id='Avatar' width={40} height={40} />
                                                    <div className='ms-3 h6 my-auto'>{chat.m1Name}</div>
                                                </Link>
                                            )
                                        }
                                    }

                                    )
                            }
                        </>
                            :
                            <>
                                {
                                    seesawMembers.includes(currentUser.email) &&
                                    <Link to='/chat/see-saw' className='channelEl d-flex container' style={{
                                        margin: "2px 0"
                                    }}>
                                        <img src='logo.webp' className='my-auto' alt="" id='Avatar' width={40} height={40} />
                                        <div className='ms-3 h6 my-auto'>See Saw</div>
                                    </Link>
                                }
                                {
                                    groups.length === 0 ? <Text text={'Create Groups!'} /> :
                                        groups.map(grp =>
                                            <Link key={grp.id} to={`/group/${grp.id}`} className='channelEl d-flex container' style={{
                                                margin: "2px 0"
                                            }}>
                                                <img src='grp.jpg' className='my-auto' alt="" id='Avatar' width={40} height={40} />
                                                <div className='ms-3 h6 my-auto'>{grp.grpName}</div>
                                            </Link>


                                        )
                                }
                            </>
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
                <CreateGroup />
            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.user,
        chats: state.chats,
        groups: state.groups,
        allUsers: state.users,
    }
}

export default connect(mapStateToProps)(Home);