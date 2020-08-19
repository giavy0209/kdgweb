import React, { useState } from 'react'
import EcosystemImage from '../assets/img/Ecosystem.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
export default function App({data,...prop}) {
    const [SlideIndex, setSlideIndex] = useState(0)

    return(
        <>
        <div className="ecosystem">
            <div className="slide">
                <div className="kdg-row kdg-column-4 list-button">
                    {
                        data && data.map((o,idx)=>
                        <div className="item">
                            <div onClick={()=>{setSlideIndex(idx)}} className="button">
                                <div className={`background ${idx === SlideIndex && 'active'}`}>
                                {o.button}
                                </div>
                            </div>
                        </div>
                        )
                    }
                </div>
                <div className="slide-content">
                    <div className="slide-track" 
                    style={{width: 100 * data.length + '%',transform: `translate( ${-(100 / data.length) * SlideIndex}%,0)`}}>
                        {
                            data && data.map((o)=>{
                                return(
                                    <div style={{width: 100 / data.length + '%',}} className="slide-block">
                                        <div className="block-text">
                                            <h3>{o.slideTitle}</h3>
                                            <div className="slide-content" dangerouslySetInnerHTML={{__html: o.slideContent}}></div>
                                        </div>
                                        <div className="block-img">
                                            <img src={o.slideImg} alt=""/>
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