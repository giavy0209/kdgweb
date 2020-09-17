import React, { useCallback, useState, useEffect } from 'react'
import Menu from '../../components/Menu'
import Footer from '../../components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { atcChangeLanguage } from '../../store/action';
import menubar from '../../assets/img/menubar.png'
import bg from '../../assets/img/bg-term.png'
import { checkLanguage, smoothscroll } from '../../helpers';
import '../../assets/css/term.scss'
export default function App(){
    const dispatch = useDispatch()
    const history = useHistory()

    const language = useSelector(state=>state && state.lang)
    useEffect(()=>{
        document.title = checkLanguage({vi: 'Điều khoản dịch vụ', en: 'Terms of services'}, language)
    },[language])

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

    const {index} = useParams()


    const logoHeader = useSelector(state=>{
        return state && state.settings && state.settings.logo && state.settings.logo.logo_header
    })


    const textLogo = useSelector(state => {
        return state && state.settings && state.settings.text_next_logo
    })
    const email = useSelector(state=>{
        return state.settings && state.settings.email && state.settings.email.email
    })
    const handleChooseLang = useCallback(lang=>{
        dispatch(atcChangeLanguage(lang))
        localStorage.setItem('lang', lang)
    },[dispatch])

    const terms = useSelector(state=>{
        if(state.settings && state.settings.terms){
            var terms = state.settings.terms
            var title_vistr = 'title_vi';
            var title_enstr = 'title_en';
            var content_vistr = 'content_vi';
            var content_enstr = 'content_en';
            
            var returnArray = []
            for (let index = 0; true; index++) {
                const title_vi = title_vistr + index;
                const title_en = title_enstr + index;
                const content_vi = content_vistr + index;
                const content_en = content_enstr + index;
                if(!terms[title_vi] || !terms[title_en] || !terms[content_vi] || !terms[content_en]) return returnArray
                else {
                    var obj = {
                        title:{
                            title_vi: terms[title_vi], 
                            title_en: terms[title_en]
                        },
                        content: {
                            content_vi: terms[content_vi],
                            content_en: terms[content_en]
                        }
                    }
                    returnArray.push(obj)
                }
            }
        }
    })
    const [CurrentTerm, setCurrentTerm] = useState((index && Number(index) < terms.length) ? Number(index) : 0)

    useEffect(()=>{
        if(window.innerWidth > 768){
            setTimeout(() => {
                var windowHeight = window.innerHeight
                var headerHeight = document.querySelector('header').offsetHeight
                var sidebar = document.querySelector('.sidebar-term')
                var contentHeight = document.querySelector('.term-content')
                sidebar.style.height = (windowHeight - headerHeight - 50) + 'px'
                contentHeight.style.height = (windowHeight - headerHeight - 50) + 'px'
            }, 500);
        }else{
            var track = document.querySelector('.sidebar-term')
            var trackLeft = track.offsetLeft
            var itemLeft = track.querySelectorAll('.sidebar-term p')[CurrentTerm].offsetLeft
            smoothscroll(track, track.scrollLeft, itemLeft - trackLeft, 0,0,200)
        }

    },[CurrentTerm])
    return(
        <>
        <header style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition:'center'}} className="header">
            <div style={{backgroundColor: '#121827'}}>
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
            </div>
            <div style={{backgroundColor: 'transparent',position: 'relative'}} className="bottom-header">
                <div className="kdg-container">
                    <div className=" logo-menu" style={{borderBottom: '1px solid #fff',paddingBottom: 25, position: 'initial'}}>
                        <span className="menubar"><img src={menubar} alt="" /></span>
                        <a 
                        onClick={e=>{e.preventDefault();history.push('/')}}
                        className="logo" href="/"><img alt="KingDomGame" src={logoHeader}/></a>
                        <h1
                        onClick={e=>{e.preventDefault();history.push('/')}}
                        >{checkLanguage(textLogo, language)}</h1>
                        <Menu type={0}/>
                    </div>
                </div>
            </div>
            <div className="banner" style={{paddingTop: 10, paddingBottom: 18}}>
                <div className="kdg-container">
                    <p style={{color: '#ddd9d8', fontSize: 24, fontWeight: 600}}>{checkLanguage({vi: 'QUY TẮC', en:'RULES'},language)}</p>
                    <p style={{marginTop: 10, fontSize: 16}}>{checkLanguage({vi: 'Phần này giới thiệu cho bạn tất cả các tài liệu liên quan đến các điều khoản và điều kiện Kingdom Game. Chúng tôi cố gắng hết sức để bảo vệ quyền lợi của bạn.', en:'This part introduces you all document related to terms and provisions of Kingdom Game 4.0. We always try to protect your assets'},language)}</p>
                </div>
            </div>
        </header>

        <div className="kdg-container ">
            <div className="kdg-row term">
                <div className="kdg-col-3 va-t">
                    <div className="sidebar-term">
                        <h2>{checkLanguage({vi: 'NỘI DUNG', en:'CONTENTS'},language)}</h2>
                        {
                            terms && terms.map((o,index) =><p onClick={()=>setCurrentTerm(index)} className={CurrentTerm === index ? 'active' : ''} key={index}>{checkLanguage(o.title,language)}</p>)
                        }
                    </div>
                </div>
                <div className="kdg-col-9 va-t">
                    <div dangerouslySetInnerHTML={{__html: checkLanguage(terms[CurrentTerm].content,language)}} className="term-content">
                        
                    </div>
                </div>
            </div>
        </div>

        <Footer />
        </>
    )
}