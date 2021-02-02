import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { checkLanguage } from '../helpers'
export default function App({data,...prop}){
    const language = useSelector(state=> state.lang)
    const [html ,sethtml] = useState(checkLanguage({vi: data[0].content_vi , en: data[0].content_en}, language))
    useEffect(()=>{
        const obj = data[0]     
        if(obj.content_mobile_en && obj.content_mobile_vi){
            if(window.innerWidth < 767) sethtml(checkLanguage({vi: data[0].content_mobile_vi , en: data[0].content_mobile_en}, language))
            else sethtml(checkLanguage({vi: data[0].content_vi , en: data[0].content_en}, language))
        }
        else sethtml(checkLanguage({vi: data[0].content_vi , en: data[0].content_en}, language))
    },[language,data])
    return (
        <>
            <div {...prop} className="description" dangerouslySetInnerHTML={{__html: html}}></div>
        </>
    )
}