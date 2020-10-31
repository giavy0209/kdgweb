import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {Header , Footer} from '../../components'
import { useParams, useHistory } from 'react-router-dom'
import '../../assets/css/news.scss'
import { checkLanguage } from '../../helpers'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetNewsById,asyncGetNews } from '../../store/action'
const css = `
body {
    background-color: #fff
}
`
export default function App(){
    const language = useSelector(state => state.lang)
    const dispatch = useDispatch()
    const history = useHistory()
    const news = useSelector(state => state.news)
    const {id} = useParams()
    const [News, setNews] = useState(null)

    const setFixSideBar = useCallback(()=>{
        if(window.innerWidth > 767){
            document.addEventListener('scroll', e=>{
                var blockAside = document.querySelector('aside .block-aside')
                var blockAsideHeight = blockAside.offsetHeight
                var aside = document.querySelector('aside')
                var headerHeight = document.querySelector('header .bottom-header').offsetHeight
                var mainContentHeight = document.querySelector('.news-content .main-content').offsetHeight
    
                aside.style.height = mainContentHeight + 'px'
                blockAside.style.height = window.innerHeight - headerHeight + 'px'
    
                if(window.scrollY > 200 && blockAsideHeight + window.scrollY < mainContentHeight){
                    blockAside.style.top = window.scrollY + 'px'
                }else if(window.scrollY < 200){
                    blockAside.style.top = 0 + 'px'
                }
            })
        }
    },[])
    

    useEffect(()=>{
        News && (document.title = checkLanguage({vi: News.title_vi, en: News.title_en}, language))
        News && (document.querySelector('meta[name="description"]')).setAttribute('content', checkLanguage({vi: News.meta_vi, en: News.meta_en}, language)) 
        News && (document.querySelector('meta[property="og:description"]')).setAttribute('content', checkLanguage({vi: News.meta_vi, en: News.meta_en}, language)) 
        News && (document.querySelector('meta[property="og:image"]')).setAttribute('content', checkLanguage({vi: News.thumbURL_vi, en: News.thumbURL_en}, language)) 
    },[language,News])

    useEffect(()=>{
        if(!id){
            history.push('/')
        }
    },[id])

    useEffect(()=>{
        setFixSideBar()
        document.querySelector('.maskdownload').style.display = 'none'
    },[])

    useMemo(()=>{
        dispatch(asyncGetNews(0, 50,''))
    },[])

    useEffect(()=>{
        dispatch(asyncGetNewsById(id))
        .then(res=>{
            var d = new Date (res.data.create_date)
            var h = (d.getHours() + '').length === 2 ? d.getHours() : '0' + d.getHours()
            var minute = (d.getMinutes() + '').length === 2 ? d.getMinutes() : '0' + d.getMinutes()
            var day = (d.getDate() + '').length === 2 ? d.getDate() : '0' + d.getDate()
            var month = ((d.getMonth() + 1) + '').length === 2 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1)
            var year = (d.getFullYear() + '').length === 2 ? d.getFullYear() : '0' + d.getFullYear()
            setNews({
                ...res.data,
                h,minute,day,month,year
            })
        })
    },[id])
    var checkNews = useCallback((o, lang)=>{
        var vi  = [
            'thumbURL_vi',
            'title_vi',
            'meta_vi',
            'content_vi'
        ]

        var en  = [
            'thumbURL_en',
            'title_en',
            'meta_en',
            'content_en'
        ]

        var arrNews = Object.keys(o)

        if(lang === 'vi') {
            for (let index = 0; index < vi.length; index++) {
                const element = vi[index]; 
                if(!arrNews.includes(element)){
                    return false
                }
            }
            return true
        }

        if(lang === 'en') {
            for (let index = 0; index < en.length; index++) {
                const element = en[index]; 
                if(!arrNews.includes(element)){
                    return false
                }
            }
            return true
        }
    },[])
    return (
        <>
            <style>{css}</style>
            <Header type={0}/>
            <div className="kdg-container">
                <div className="news-content">
                    <div className="kdg-row">
                        <div className="kdg-col-9 va-t">
                            <div className="main-content">
                                <div className="header">
                                    <h1 className="title">{News && checkLanguage({vi: News.title_vi , en: News.title_en}, language)}</h1>
                                    <p className="date">{News && `${News.h}:${News.minute} - ${News.day}/${News.month}/${News.year}`}</p>
                                </div>
                                <div className="body">
                                    <div className="metades">{News && checkLanguage({vi: News.meta_vi , en: News.meta_en}, language)}</div>
                                    <div className="maincontent" dangerouslySetInnerHTML={{__html: News && checkLanguage({vi: News.content_vi , en: News.content_en}, language)}}></div>
                                </div>
                            </div>
                        </div>
                        <div className="kdg-col-3 va-t">
                            <aside>
                                <div className="block-aside">
                                    <h3 className="block-title">
                                        {checkLanguage({vi: 'Tin khác', en: 'Other news'},language)}
                                    </h3>
                                    <ul className="list-othernews">
                                        {
                                            news && news.map((o , index)=>{
                                                var d = new Date(o.create_date)
                                                var h = (d.getHours() + '').length === 2 ? d.getHours() : '0' + d.getHours()
                                                var minute = (d.getMinutes() + '').length === 2 ? d.getMinutes() : '0' + d.getMinutes()
                                                var sec = (d.getSeconds() + '').length === 2 ? d.getSeconds() : '0' + d.getSeconds()
                                                var day = (d.getDate() + '').length === 2 ? d.getDate() : '0' + d.getDate()
                                                var month = ((d.getMonth() + 1) + '').length === 2 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1)
                                                var year = (d.getFullYear() + '').length === 2 ? d.getFullYear() : '0' + d.getFullYear()
                                                if(checkNews(o, language) &&  o._id !== id){
                                                    return <li
                                                    onClick={()=>history.push('/news/'+o._id)}
                                                    >            
                                                        <h3 className="othernew-title">{checkLanguage({vi: o.title_vi, en: o.title_en},language)}</h3>
                                                        <p className="othernew-date">{h}:{minute} - {day}/{month}/{year}</p>
                                                    </li>
                                                }
                                            }
                                            )
                                        }
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}