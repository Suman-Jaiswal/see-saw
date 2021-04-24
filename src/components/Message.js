import React from 'react';
import {formatRelative} from 'date-fns';


export default function Message(
  {
  createdAt = null,
  text = '',
  displayName = '',
  photoURL = ''} , 
  props) { 
  
  return (
    <>
    <div id="block">
      <div className="ID">
      {photoURL? (
        <img src={photoURL} alt="Avatar" width={45} height={45}/>
      ) : null }
      <div id="time">
      {displayName? <p id="name">{displayName}</p> : null}
      
      {createdAt?.seconds? (
        <span>
          {formatRelative(new Date(createdAt.seconds * 1000), new Date())}
        </span>
      ) : null}</div>
      </div>
      <div id="text">{text}</div> 
    
    </div>
    </>
  )
}
