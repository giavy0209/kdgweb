import React from 'react';
import bgRoadmap from '../assets/img/vongxoay.jpg'
export default function App({roadmap}){
    return (
        <>
            <div className="roadmap-img">
                <img alt="Road Map" src={roadmap} />
            </div>
        </>
    )
}