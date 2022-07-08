import React from 'react'

export default function Text({ text }) {
    return (
        <div className='text-secondary' style={{
            marginTop: "100px",
            position: "absolute",
            width: "100%",
            maxWidth: 600,
            textAlign: "center"
        }}>{text}</div>
    )
}
