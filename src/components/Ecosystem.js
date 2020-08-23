import React, { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux';
import { checkLanguage } from '../helpers'
import bg from '../assets/img/background-ecosystem.png'
import bge from '../assets/img/background-english-ecosystem.png'
import bgem from '../assets/img/background-mobile-english-ecosystem.png'
import bgm from '../assets/img/background-mobile-ecosystem.png'
import eco from '../assets/img/Ecosystem.png'
export default function App({data,...prop}) {
    const [SlideIndex, setSlideIndex] = useState(0)
    const [BG, setBG] = useState(bg)
    const language = useSelector(state=> state.lang)
    const [ButtonTrackWidth , setButtonTrackWidth] = useState(0)
     useEffect((e)=>{
        // setTimeout(() => {
        //     var imgHeight = document.querySelector('.ecosystem .bg').offsetHeight
        //     var contentHeight = document.querySelector('.ecosystem').offsetHeight
        //     document.querySelector('.ecosystem').style.marginTop = (imgHeight - contentHeight) + 'px'
        // }, 1000);
        

    },[])
    useEffect(()=>{
        if(window.innerWidth > 767){
            setButtonTrackWidth('100%')
        }else{
            setButtonTrackWidth(((100 * data.length)/3) + '%')
        }
    },[data])
    
    useEffect(()=>{
        if(window.innerWidth > 767){
            if(language === 'en') setBG(bge)
            if(language === 'vi') setBG(bg)
        }else{
            if(language === 'en') setBG(bgem)
            if(language === 'vi') setBG(bgm)
        }
    },[language])
    return(
        <>
        <div className="ecosystem">
            <img alt="" className="bg" src={BG}></img>
            {/* <img alt="" className="eco" src={eco}></img> */}
            <div className="slide">
                <div className="button-track">
                    <div style={{width: ButtonTrackWidth}} className="kdg-row kdg-column-4 list-button">
                        {
                            data && data.map((o,idx)=>
                            <div className="item">
                                <div onClick={()=>{setSlideIndex(idx)}} className="button">
                                    <div className={`background ${idx === SlideIndex && 'active'}`}>
                                    {checkLanguage({vi: o.button_vi, en: o.button_en}, language)}
                                    </div>
                                </div>
                            </div>
                            )
                        }
                    </div>
                </div>
                <div className="slide-content">
                    <div className="slide-track" 
                    style={{width: 100 * data.length + '%',transform: `translate( ${-(100 / data.length) * SlideIndex}%,0)`}}>
                        {
                            data && data.map((o)=>{
                                return(
                                    <div style={{width: 100 / data.length + '%',}} className="slide-block">
                                        <div className="block-text">
                                            <h3>{checkLanguage({vi: o.title_vi, en: o.title_en}, language)}</h3>
                                            <div className="slide-content" dangerouslySetInnerHTML={{__html:checkLanguage({vi: o.content_vi, en: o.content_en}, language)}}></div>
                                        </div>
                                        <div className="block-img">
                                            <img src={o.image_slide} alt=""/>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        
                    </div>

                    <div 
                    onClick={()=>setSlideIndex(SlideIndex - 1)}
                    style={{pointerEvents:SlideIndex === 0 ? 'none' :'all'}} className="controls-left">
                        <FontAwesomeIcon color={SlideIndex === 0 ? '#202634' : '#ddd9d8'} size={50} icon={faAngleLeft} />
                    </div>
                    <div 
                    onClick={()=>setSlideIndex(SlideIndex + 1)}
                    style={{pointerEvents:SlideIndex === data.length -1 ? 'none' : 'all'}} className="controls-right">
                        <FontAwesomeIcon color={SlideIndex === data.length -1 ? '#202634' : '#ddd9d8'} size={50} icon={faAngleRight} />
                    </div>
                </div>
            </div>
        </div>

        </>
    )
}