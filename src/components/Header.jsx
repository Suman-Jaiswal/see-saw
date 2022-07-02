import React from 'react'
import '../App.css'

export default function Header({ signOut }) {
    return (
        <div className="header">
            <div>SEE &#9973; SAW</div>
            <button className='logout' onClick={signOut} >Sign Out</button>
        </div>
    )
}
