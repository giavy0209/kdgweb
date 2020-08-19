import React, { useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faEnvelope } from '@fortawesome/free-solid-svg-icons'

import rotate1 from '../assets/img/rotate-1.png'
import token from '../assets/img/token.png'

import {API_DOMAIN} from '../constant'
import Menu from './Menu'
import { useSelector, useDispatch } from 'react-redux'
import { checkLanguage } from '../helpers'
import { atcChangeLanguage } from '../store/action'
export default function App({VisibleBanner}){
    const dispatch = useDispatch()

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
                    console.log(returnArray);
                    return returnArray
                }
                else {
                    var obj = {img: rotate_banner[img], link:rotate_banner[link]}
                    returnArray.push(obj)
                }
            }
        }
    })
    return(
        <>
        <header style={VisibleBanner ? {backgroundImage: 'url(/images/backgroundtop.png)'} : {}} className="header">
            <div className="kdg-container">
                <div className="top-header">
                    <div className="social">
                        {
                            listIcon && listIcon.map((o, index)=>
                            <a href={o.link} key={index}><img alt="" src={API_DOMAIN + o.img}/></a>
                            )
                        }
                    </div>
                    <div>  
                        <FontAwesomeIcon color="#fac800" icon={faEnvelope}/>
                        <span className="mail">{email}</span>
                    </div>
                    <div className="lang">
                        <span>VI</span>
                        <FontAwesomeIcon icon={faCaretDown}/>
                        
                        <ul className="dropdown">
                            <li onClick={()=>handleChooseLang('en')}>EN</li>
                            <li onClick={()=>handleChooseLang('vi')}>VI</li>
                        </ul>
                    </div>
                </div>

            </div>
            <div className="bottom-header">
                <div className="kdg-container logo-menu">
                    <a href="/"><img alt="KingDomGame" src={API_DOMAIN + logoHeader}/></a>
                    <h1>{checkLanguage(textLogo, language)}</h1>
                    <Menu />
                </div>
            </div>
            {VisibleBanner && <div className="banner">
                <div className="kdg-container">
                    <div className="kdg-row">
                        <div className="kdg-col-6 va-m">
                            <div dangerouslySetInnerHTML={{__html:checkLanguage(bannerContent, language)}}>

                            </div>
                        </div>
                        <div className="kdg-col-6 va-m">
                            <div className="rotate-block">
                                <img className="rotate-left" src={rotate1} alt=""/>
                                <img className="middle" src={token} alt=""/>
                                <div className="icon">
                                    {
                                        listIcoinRotate && 
                                        listIcoinRotate.map(o=><a href={o.link} target="_blank" className='icon-container'><img className="" src={API_DOMAIN +o.img} alt=""/> </a>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </header>
        </>
    )
}