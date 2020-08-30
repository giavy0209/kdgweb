import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux';
import { checkLanguage, smoothscroll } from '../helpers'
import bg from '../assets/img/background-ecosystem.png'
import bge from '../assets/img/background-english-ecosystem.png'
import bgem from '../assets/img/background-mobile-english-ecosystem.png'
import bgm from '../assets/img/background-mobile-ecosystem.png'
import { useParams } from 'react-router-dom';
export default function App({data,...prop}) {
    const {type} = useParams()
    const [SlideIndex, setSlideIndex] = useState(type === 'kingpay' ? 1 : type === 'defi' ? 2 : type === 'kingswap' ? 3 : 0)
    const [BG, setBG] = useState(bg)
    const language = useSelector(state=> state.lang)
    const [ButtonTrackWidth , setButtonTrackWidth] = useState(0)

    useEffect(()=>{
        if(type){
            var elmTop = document.querySelector('.slide').getBoundingClientRect().top
            var scrollTop = window.pageYOffset 
            smoothscroll(window, 0 ,0 ,scrollTop , scrollTop + elmTop , 300)
        }
    },[type])
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

    useEffect(()=>{
        var buttonTrack = document.querySelector('.button-track')
        var buttonWidth = buttonTrack.querySelector('.item').offsetWidth
        smoothscroll(buttonTrack,buttonTrack.scrollLeft,(SlideIndex - 1) * buttonWidth , 0 , 0 , 200)
    },[SlideIndex])
    return(
        <>
        <div className="ecosystem">
            <img alt="" className="bg" src={BG}></img>
            <div className="slide">
                <div className="button-track">
                    <div style={{width: ButtonTrackWidth}} className="kdg-row kdg-column-4 list-button">
                        {
                            data && data.map((o,idx)=>
                            <div key={idx} className="item">
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
                            data && data.map((o,idx)=>
                                <div key={idx} style={{width: 100 / data.length + '%',}} className="slide-block">
                                    <div className="block-text">
                                        <h3>{checkLanguage({vi: o.title_vi, en: o.title_en}, language)}</h3>
                                        <div className="slide-content" dangerouslySetInnerHTML={{__html:checkLanguage({vi: o.content_vi, en: o.content_en}, language)}}></div>
                                    </div>
                                    <div className="block-img">
                                        <img src={o.image_slide} alt=""/>
                                    </div>
                                </div>
                            )
                        }
                        
                    </div>

                    <div 
                    onClick={()=>setSlideIndex(SlideIndex - 1)}
                    style={{pointerEvents:SlideIndex === 0 ? 'none' :'all'}} className="controls-left">
                        <FontAwesomeIcon color={SlideIndex === 0 ? '#202634' : '#ddd9d8'} size={"lg"} icon={faAngleLeft} />
                    </div>
                    <div 
                    onClick={()=>setSlideIndex(SlideIndex + 1)}
                    style={{pointerEvents:SlideIndex === data.length -1 ? 'none' : 'all'}} className="controls-right">
                        <FontAwesomeIcon color={SlideIndex === data.length -1 ? '#202634' : '#ddd9d8'} size={"lg"} icon={faAngleRight} />
                    </div>
                </div>
            </div>
        </div>

        </>
    )
}