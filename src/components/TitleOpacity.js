import React from 'react';
import { useSelector } from 'react-redux';
import { checkLanguage } from '../helpers'
export default function App({data}){
    const title = data[0]
    const language = useSelector(state=> state.lang)
    
    return (
        <>
            <div className="title-opacity">
            <h2 className="">{checkLanguage(title, language)}</h2>
            <span>{checkLanguage(title, language)}</span>
            </div>
        </>
    )
}