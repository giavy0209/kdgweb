import React from 'react';


export default function App({html,...prop}){
    return (
        <>
            <div {...prop} className="description" dangerouslySetInnerHTML={{__html: html}}></div>
        </>
    )
}