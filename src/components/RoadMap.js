import React from 'react';
export default function App({roadmap}){
    return (
        <>
            <div className="roadmap-img">
                <img alt="Road Map" src={roadmap} />
            </div>
        </>
    )
}