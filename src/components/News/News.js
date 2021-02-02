import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {checkLanguage} from '../../helpers'
import '../../assets/css/news.scss'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { asyncGetNews} from '../../store/action'
import { useHistory } from 'react-router-dom'
const css = `
body {
    background-color: #fff
}
`
export default function App(){
    const dispatch = useDispatch()
    const history = useHistory()
    const language = useSelector(state => state.lang)
    const [prelang, setprelang] = useState(language)
    const [Page, setPage] = useState(1)
    const [news , setnews] = useState([])
    const [TotalPage , setTotalPage] = useState(0)
    const [Search , setSearch] = useState('')
    const [PreSearch , setPreSearch] = useState('')

    useEffect(()=>{
        document.onscroll = () => {
            var scrollY = window.pageYOffset
            var scrollHeight = document.body.scrollHeight - document.body.offsetHeight
            var footerHeight = document.querySelector('footer').offsetHeight

            var startLoadScrollHeight = scrollHeight - footerHeight - 200
            console.log(Page,news.length);
            if(scrollY >= startLoadScrollHeight && Page <= TotalPage && news.length === Page * 6) {
                setPage(Page + 1)
            }

        }
    },[TotalPage,Page,news])

    // useEffect(()=>{
    //     const arr = []
    //     if(Page > 1){
    //         arr.push(1)
    //     }
    //     for (let index = Page; index < Page + 5 && index <= TotalPage ; index++) {
    //         arr.push(index)           
    //     }
    //     if(Page + 5 < TotalPage){
    //         arr.push(TotalPage)
    //     }

    //     setArrayPage([...arr])
    // },[Page,TotalPage])

    const handleGetNews = useCallback(async ()=>{
        dispatch(asyncGetNews((Page - 1) * 6, 6,Search,language))
        .then(res=>{
            setTotalPage(Math.ceil(res.totalPost / 6))
            console.log(res.totalPost,Math.ceil(res.totalPost / 6));
            setnews([...news,...res.data])
        })
        .catch(res=>{
        })
    },[Page,dispatch,Search,news,language])

    useMemo(()=>{
        if(prelang !== language || PreSearch !== Search){
            setprelang(language)
            setPreSearch(Search)
            setnews([...[]])
            setPage(1)
        }
    },[language,prelang,Search,PreSearch])

    useMemo(handleGetNews,[Page,prelang,PreSearch])

    

    return (
        <>
        <style>{css}</style>
        <div className="top-news">
            <div className="left">
                <h1 className="title">
                    {checkLanguage({vi: 'TIN TỨC', en: 'NEWS'},language)}
                </h1>
            </div>
            <div className="right">
                <div className="search">
                    <input 
                    onKeyPress={e=>{
                        if(e.key === 'Enter'){
                            const value = e.target.value
                            setSearch(value)
                        }
                    }}
                    onBlur={(e)=>{
                        const value = e.target.value
                        setSearch(value)
                    }}
                    onClick={(e)=>{
                        const value = e.target.value
                        setSearch(value)
                    }}
                    placeholder={checkLanguage({vi: 'Tìm kiếm', en: 'Search'},language)}/>
                    <FontAwesomeIcon style={{cursor: 'pointer'}} className="icon" color="#8a8c8e" icon={faSearch} />
                </div>
            </div>
        </div>
        <div className="kdg-row kdg-column-3 list-news">
            {
                news && news.map((o,index) =>{
                   
                        return <div 
                        className="item va-t">
                            <div className="news">
                                <div 
                                style={{cursor: 'pointer'}}
                                onClick={()=>history.push(`/news/${o._id}`)}
                                className="img img-3-2" >
                                    <img alt="" src={checkLanguage({vi: o.thumbURL_vi, en: o.thumbURL_en},language)}/>
                                </div>
                                <h3 
                                style={{cursor: 'pointer'}}
                                onClick={()=>history.push(`/news/${o._id}`)}
                                className="title">
                                    {checkLanguage({vi: o.title_vi, en: o.title_en},language)}
                                </h3>
                                <p className="des">
                                    {checkLanguage({vi: o.meta_vi, en: o.meta_en},language)}
                                </p>
                                <span 
                                onClick={()=>history.push(`/news/${o._id}`)}
                                className="viewmore" href='/' >{checkLanguage({vi: 'Xem thêm', en: 'View more'},language)}</span>
                            </div>
                        </div>
                })
            }
            
        </div>
        </>
    )
}