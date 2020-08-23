import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { checkLanguage } from '../helpers'
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
    },data)
    return (
        <>
            <div className="function-list-track">
                <div style={{width: listFunctionWidth * ListLength }} {...prop} className="kdg-row kdg-column-3 function-list text-c">
                    {
                        data && data.map(o=>
                        <div  className="item">
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
        </>
    )
}