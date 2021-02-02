import React, { useCallback, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faEnvelope } from '@fortawesome/free-solid-svg-icons'

import rotate1 from '../assets/img/rotate-1.png'
import token from '../assets/img/token.png'

import Menu from './Menu'
import { useSelector, useDispatch } from 'react-redux'
import { checkLanguage } from '../helpers'
import { atcChangeLanguage } from '../store/action'
import menubar from '../assets/img/menubar.png'
import { useHistory } from 'react-router-dom'
import { useRef } from 'react'

const calcTime = (sec)=>{
    if(sec <= 0) {
        return{
            d: 0,
            h: 0,
            m: 0,
            s: 0
        }
    }
    if(sec / 60 < 1){
        sec = Math.floor(sec)
        if((sec + '').length === 1){
            sec = '0' + sec
        }
        return {
            d : '00',
            h: '00',
            m: '00',
            s : sec
        }
    }else{
        var minus = Math.floor(sec / 60)
        sec = Math.floor(sec % 60)
        if(minus / 60 < 1){
            if((minus + '').length === 1){
                minus = '0' + minus
            }
            if((sec + '').length === 1){
                sec = '0' + sec
            }
            return {
                d : '00',
                h: '00',
                m: minus,
                s : sec
            }

        }else{
            var h = Math.floor(minus / 60)
            minus = Math.floor(minus % 60)
            if((h + '').length === 1){
                h = '0' + h
            }
            if((minus + '').length === 1){
                minus = '0' + minus
            }
            if((sec + '').length === 1){
                sec = '0' + sec
            }

            return {
                d : '00',
                h: h,
                m: minus,
                s : sec
            }
        }

    }
}

var targetDate = new Date('Sep 29 2020 14:00:00 GMT+0700')
export default function App({data,type}){
    const VisibleBanner = data && data[0] ? data[0].visible_banner : false
    const dispatch = useDispatch()
    const history = useHistory()
    const [html, sethtml] = useState('')

    const refH = useRef()
    const refM = useRef()
    const refS = useRef()

    useEffect(()=>{
        var interval = setInterval(() => {
            var currDate = new Date()
            var secToTarget = Math.round((targetDate - currDate) / 1000)
            var time = calcTime(secToTarget)
            if(secToTarget >0){
                refH.current.innerText = time.h
                refM.current.innerText = time.m
                refS.current.innerText = time.s
            }
        }, 100);
        return () => clearInterval(interval)
    },[])

    const email = useSelector(state=>{
        return state.settings && state.settings.email && state.settings.email.email
    })
    const listIcon = useSelector(state =>{
        if(state.settings && state.settings.top_icon){
            var top_icon = state.settings.top_icon
            var imgStr = 'icontop';
            var linkStr = 'icontoplink';
            var returnArray = []
            for (let index = 0; true; index++) {
                const img = imgStr + index;
                const link = linkStr + index;
                if(!top_icon[img] || !top_icon[link]) return returnArray
                else {
                    var obj = {img: top_icon[img], link:top_icon[link]}
                    returnArray.push(obj)
                }
            }
        }
    }) 
    
    const logoHeader = useSelector(state=>{
        return state && state.settings && state.settings.logo && state.settings.logo.logo_header
    })

    const language = useSelector(state=>state && state.lang)

    const textLogo = useSelector(state => {
        return state && state.settings && state.settings.text_next_logo
    })

    const bannerContent = useSelector(state => {
        return state && state.settings && state.settings.banner_content
    })

    const handleChooseLang = useCallback(lang=>{
        dispatch(atcChangeLanguage(lang))
        localStorage.setItem('lang', lang)
    },[dispatch])

    const listIcoinRotate = useSelector(state =>{
        if(state.settings && state.settings.rotate_banner){
            var rotate_banner = state.settings.rotate_banner
            var imgStr = 'ic';
            var linkStr = 'icurl';
            var returnArray = []
            for (let index = 1; true; index++) {
                const img = imgStr + index;
                const link = linkStr + index;
                if(!rotate_banner[img] || !rotate_banner[link]) {
                    return returnArray
                }
                else {
                    var obj = {img: rotate_banner[img], link:rotate_banner[link]}
                    returnArray.push(obj)
                }
            }
        }
    })

    useEffect(()=>{
        if(bannerContent){
            if(window.innerWidth <767){
                sethtml(checkLanguage({vi:bannerContent.text_mobile_vi , en: bannerContent.text_mobile_en},language))
            }else sethtml(checkLanguage({vi:bannerContent.text_vi , en: bannerContent.text_en},language))
        }
    },[language,bannerContent])

    const setFixMenu = useCallback(()=>{
        
        var menu = document.querySelector('.header .bottom-header')
        document.addEventListener('scroll', e=>{
            if(window.scrollY > 200){
                menu.classList.add('fixed')
            }else{
                menu.classList.remove('fixed')
            }
        })
    },[])

    return(
        <>
        <header style={VisibleBanner ? {backgroundImage: 'url(/images/backgroundtop.png)'} : {}} className="header">
            <div className="kdg-container">
                <div className="top-header">
                    <div className="social">
                        {
                            listIcon && listIcon.map((o, index)=>
                            <a target="_blank" rel="noopener noreferrer" href={o.link} key={index}><img alt="" src={ o.img}/></a>
                            )
                        }
                    </div>
                    <div>  
                        <FontAwesomeIcon color="#fac800" icon={faEnvelope}/>
                        <span className="mail">{email}</span>
                    </div>
                    <div className="lang">
                        <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                        <FontAwesomeIcon icon={faCaretDown}/>
                        
                        <ul className="dropdown">
                            <li onClick={()=>handleChooseLang('en')}>EN</li>
                            <li onClick={()=>handleChooseLang('vi')}>VI</li>
                        </ul>
                    </div>
                </div>

            </div>
            <div 
            onLoad={setFixMenu}
            className="bottom-header">
                <div className="kdg-container logo-menu">
                    <span className="menubar"><img src={menubar} alt="" /></span>
                    <a 
                    onClick={e=>{e.preventDefault();history.push('/')}}
                    className="logo" href="/"><img alt="KingDomGame" src={logoHeader}/></a>
                    <h1
                    onClick={e=>{e.preventDefault();history.push('/')}}
                    >{checkLanguage(textLogo, language)}</h1>
                    <Menu type={type}/>
                </div>
            </div>
            {VisibleBanner && <div className="banner">
                <div className="kdg-container">
                    <div className="kdg-row">
                        <div className="kdg-col-6 va-m">
                            <div dangerouslySetInnerHTML={{__html:html}}></div>
                        </div>
                        <div className="kdg-col-6 va-m">
                            {
                                targetDate - new Date() <= 0 ? 
                                <div className="rotate-block">
                                    <img className="rotate-left" src={rotate1} alt=""/>
                                    <img className="middle" src={token} alt=""/>
                                    <div className="icon">
                                        {
                                            listIcoinRotate && 
                                            listIcoinRotate.map((o,index)=><a key={index} href={o.link} rel="noopener noreferrer" target="_blank" className='icon-container'><img className="" src={o.img} alt=""/> </a>)
                                        }
                                    </div>
                                </div>
                                :
                                <div className="countdown">
                                    <p className="title"> {checkLanguage({vi: 'KING WALLET DỰ KIẾN RA MẮT', en :' KING WALLET WILL BE RELEASED SOON'}, language)}</p>
                                    <div className="time">
                                        <span className="hours">
                                            <p ref={ref => refH.current = ref} className="top">23</p>
                                            <p className="bottom">{checkLanguage({vi: 'Giờ', en :'Hours'}, language)} </p>
                                        </span>
                                        <span className="minutes">
                                            <p ref={ref=>refM.current =ref} className="top">23</p>
                                            <p className="bottom">{checkLanguage({vi: 'Phút', en :'Minutes'}, language)}</p>
                                        </span>
                                        <span className="second">
                                            <p ref={ref=>refS.current = ref} className="top">23</p>
                                            <p className="bottom">{checkLanguage({vi: 'Giây', en :'Seconds'}, language)}</p>
                                        </span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>}
        </header>
        </>
    )
}