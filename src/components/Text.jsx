import React from 'react'

export default function Text({ text }) {
    return (
        <h6 className='text-secondary' style={{
            marginTop: 100,
            left: "calc(50% - 48px)",
            position: "absolute",
        }}>{text}</h6>
    )
}
