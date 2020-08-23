import React, { useState, useEffect } from 'react'

import { useSelector } from 'react-redux';
import { checkLanguage } from '../helpers'

export default function App({data}){
    const [TabIndex, setTabIndex] = useState(0)
    const [IsMultiTab, setIsMultiTab] = useState(true)
    useEffect(()=>{
        if(
            data[0].title_tab2_vi == '' &&
            data[0].title_tab2_en == '' &&
            data[0].content2_vi == '' &&
            data[0].content2_en == ''
        ) {
            setIsMultiTab(false)
        }
    },[data])
    const language = useSelector(state=> state.lang)
    const title_tab1 = {vi:data[0].title_tab1_vi, en: data[0].title_tab1_en}
    const title_tab2 = {vi:data[0].title_tab2_vi, en: data[0].title_tab2_en}
    const content1 = {vi:data[0].content1_vi, en: data[0].content1_en}
    const content2 = {vi:data[0].content2_vi, en: data[0].content2_en}
    const url_img = data[0].url_img
    return(
        <>
        <div className='tab-title'>
            <div className="kdg-row">
                <div className="kdg-col-6 tab-content va-t">
                    <div style={{display: IsMultiTab ? 'block' : 'none'}} className="group-tab">
                        <div onClick={()=>setTabIndex(0)} className={`tab ${TabIndex === 0 ? 'active' : ''}`}>{checkLanguage(title_tab1, language)}</div>
                        <div onClick={()=>setTabIndex(1)} className={`tab ${TabIndex === 1 ? 'active' : ''}`}> {checkLanguage(title_tab2, language)} </div>
                    </div>
                    <div style={{display: TabIndex === 0 ? 'block' : 'none'}} className="des" dangerouslySetInnerHTML={{__html: checkLanguage(content1, language)}}></div>
                    <div style={{display: (TabIndex === 1 || !IsMultiTab)? 'block' : 'none'}} className="des" dangerouslySetInnerHTML={{__html: checkLanguage(content2, language)}}></div>
                </div>
                <div className="kdg-col-6 tab-img va-t">
                    <img alt="" src={url_img} />
                </div>
            </div>
        </div>
        </>
    )
}