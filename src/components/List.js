import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { checkLanguage, smoothscroll } from '../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
export default function App({data,...prop}){
    const language = useSelector(state=> state.lang)
    const [ListLength, setListLength] = useState(0)
    const [listFunctionWidth, setlistFunctionWidth] = useState('33.3333%')
    useEffect(()=>{
        setTimeout(() => {
            var listImgBlock = document.querySelectorAll('.function-list')
            listImgBlock.forEach(el=>{
                var listImg = el.querySelectorAll('.list')
                var heightest = 0
                listImg.forEach(img =>{
                    if(img.offsetHeight > heightest) heightest = img.offsetHeight
                })
    
                listImg.forEach(img =>{
                    img.style.height = (heightest ) + 'px'
                })
                
            }) 
        }, 2000);

        if(window.innerWidth < 767) {

            setlistFunctionWidth(document.querySelector('.function-list-track').offsetWidth)
        }
    },[])

    useEffect(()=>{
        if(data){
            setListLength(data.length)
        }
    },[data])

    const handleClick = useCallback((type)=>{
        var track = document.querySelector('.function-list-track')
        var itemWidth = track.querySelector('.item').offsetWidth
        if(type === 0){
            var targetLeft = Math.floor(track.scrollLeft / itemWidth - 0.0001) * itemWidth
            smoothscroll(track, track.scrollLeft, targetLeft , 0,0,200)
        }
        if(type === 1){
            var targetRight = Math.ceil(track.scrollLeft / itemWidth + 0.0001) * itemWidth
            smoothscroll(track, track.scrollLeft, targetRight , 0,0,200)
        }
    },[])
    return (
        <>
            <div className="block-function-list">
                <FontAwesomeIcon onClick={()=>handleClick(0)} size="2x" className="arrow-left" icon={faChevronLeft}/>
                <FontAwesomeIcon onClick={()=>handleClick(1)} size="2x" className="arrow-right" icon={faChevronRight}/>
                <div className="function-list-track">
                    <div style={{width: window.innerWidth < 767 ? listFunctionWidth * ListLength : '100%' }} {...prop} className="kdg-row kdg-column-3 function-list text-c">
                        {
                            data && data.map((o,index)=>
                            <div key={index} className="item">
                                <div className="list">
                                    <div className="block-img">
                                        <img alt="" src={o.icon} />
                                    </div>
                                    <div dangerouslySetInnerHTML={{__html: checkLanguage({title_vi : o.title_vi,title_en: o.title_en}, language)}} className="title"></div>
                                    <div className="des" dangerouslySetInnerHTML={{__html: checkLanguage({content_vi: o.content_vi, content_en: o.content_en}, language)}}></div>
                                </div>
                            </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}