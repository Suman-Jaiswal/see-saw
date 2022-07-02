import React from 'react';


export default function Message(
    {
        createdAt = null,
        text = '',
        displayName = '',
        photoURL = '' },
    props) {

    return (
        <>
            <div className="block">
                <div className="dp">
                    {photoURL ? (<>
                        <img src={photoURL} id="Avatar" alt="Avatar" width={30} height={30} />
                        <div className="id">
                            {/* {displayName ? <div className="name">{displayName.split(' ')[0]}</div> : null} */}
                        </div>
                    </>
                    ) : null}
                </div>
                <div className="text-box">


                    <div className="msg">{text}</div>

                    {/* {createdAt?.seconds ?
                        <div className='time'>
                            {formatRelative(new Date(createdAt.seconds * 1000), new Date())}
                        </div>
                        : null
                    } */}
                </div>



            </div>
        </>
    )
}
