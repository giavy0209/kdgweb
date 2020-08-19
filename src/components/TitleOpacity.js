import React from 'react';
export default function App({title}){
    return (
        <>
            <div className="title-opacity">
            <h2 className="">{title}</h2>
            <span>{title}</span>
            </div>
        </>
    )
}