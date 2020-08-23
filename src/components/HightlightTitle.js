import React from 'react';
import { useSelector } from 'react-redux';
import { checkLanguage } from '../helpers'
export default function App({data}){
    const language = useSelector(state=> state.lang)
    return (
        <>
            <div className="titlehightlight">
                <h2 className="">{checkLanguage(data[0], language)}</h2>
            </div>
        </>
    )
}