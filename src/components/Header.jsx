import React from 'react'
import '../App.css'

export default function Header({ signOut, clearChat, db }) {
    return (
        <div className="header">
            <div className='logo'>
                <img src="logo.webp" alt="" width={25} height={25} />
                <span className='logoname'>
                    SEE SAW
                </span>
            </div>
            <div className="dropdown">
                <button className="dropbtn">&#10247;</button>
                <div className="dropdown-content">
                    <div className='' onClick={() => clearChat(db, 'messages', 100)} >Clear Chat</div>
                    <div className='' onClick={signOut} >Sign Out</div>
                </div>
            </div>

        </div>
    )
}
