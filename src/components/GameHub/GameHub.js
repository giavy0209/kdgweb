import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faEnvelope, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { checkLanguage, smoothscroll } from '../../helpers'
import { atcChangeLanguage } from '../../store/action'
import menubar from '../../assets/img/menubar.png'

import bgbanner from '../../assets/img/gamehub/bgbanner.png'
import bgdes from '../../assets/img/gamehub/bgdes.png'
import bginfo from '../../assets/img/gamehub/bginfo.png'
import bggames from '../../assets/img/gamehub/bggames.png'

import borderbottom from '../../assets/img/gamehub/borderbottom.png'
import bordertop from '../../assets/img/gamehub/bordertop.png'
import boobtop from '../../assets/img/gamehub/boobtop.png'
import boobbottom from '../../assets/img/gamehub/boobbottom.png'

import li1 from '../../assets/img/gamehub/li1.png'
import li2 from '../../assets/img/gamehub/li2.png'
import li3 from '../../assets/img/gamehub/li3.png'
import li4 from '../../assets/img/gamehub/li4.png'
import li5 from '../../assets/img/gamehub/li5.png'
import li6 from '../../assets/img/gamehub/li6.png'
import li7 from '../../assets/img/gamehub/li7.png'
import li8 from '../../assets/img/gamehub/li8.png'
import li9 from '../../assets/img/gamehub/li9.png'
import li10 from '../../assets/img/gamehub/li10.png'

import game1 from '../../assets/img/gamehub/game1.png'
import game2 from '../../assets/img/gamehub/game2.png'
import game3 from '../../assets/img/gamehub/game3.png'
import game4 from '../../assets/img/gamehub/game4.png'
import game5 from '../../assets/img/gamehub/game5.png'
import game6 from '../../assets/img/gamehub/game6.png'
import game7 from '../../assets/img/gamehub/game7.png'
import game8 from '../../assets/img/gamehub/game8.png'

import Menu from '../Menu'

import '../../assets/css/gamehub.scss'

export default function App(){

    const [Type , setType] = useState(0)
    // const [List , setList] = useState(listGame)
    const language = useSelector(state=>state && state.lang)

    const listGame = useMemo(()=>{
        var list = [
            {
                img: game1,
                title: 'QUỶ HẦU VƯƠNG',
                subTitle : 'Tây Du Ký',
                desType : 'ARPG | Điện thoại',
                desDate : checkLanguage({vi: 'Ngày phát hành: Coming soon', en: 'Release date: Coming soon'},language),
                type : 2,
            },
            {
                img: game2,
                title: 'MU KINGDOM MOBILE',
                subTitle : 'Lục Địa Tàn Trở Lại',
                desType : 'MMORPG | Điện thoại',
                desDate : checkLanguage({vi: 'Ngày phát hành: Coming soon', en: 'Release date: Coming soon'},language),
                type : 2,
            },
            {
                img: game3,
                title: 'CON ĐƯỜNG TƠ LỤA',
                subTitle : 'Vương triều báo thù',
                desType : 'MMORPG | Máy tính',
                desDate : checkLanguage({vi: 'Ngày phát hành: Coming soon', en: 'Release date: Coming soon'},language),
                type : 1,
            },
            {
                img: game4,
                title: 'MU SEASON 14',
                subTitle : 'Castel Siege',
                desType : 'MMORPG | Máy tính',
                desDate : checkLanguage({vi: 'Ngày phát hành: Coming soon', en: 'Release date: Coming soon'},language),
                type : 1,
            },
            {
                img: game5,
                title: 'MU Kingdom XV',
                subTitle : 'Hủy diệt Vương triều',
                desType : 'MMORPG | Máy tính',
                desDate : checkLanguage({vi: 'Ngày phát hành: Coming soon', en: 'Release date: Coming soon'},language),
                type : 1,
            },
            {
                img: game6,
                title: 'võ lâm truyền kỳ',
                subTitle : 'Vạn Kiếm Khai Hoa',
                desType : 'MMORPG | Điện thoại',
                desDate : checkLanguage({vi: 'Ngày phát hành: Coming soon', en: 'Release date: Coming soon'},language),
                type : 2,
            },
            {
                img: game7,
                title: 'võ lâm truyền kỳ',
                subTitle : 'Công Thành Chiến',
                desType : 'MMORPG | Điện thoại',
                desDate : checkLanguage({vi: 'Ngày phát hành: Coming soon', en: 'Release date: Coming soon'},language),
                type : 2,
            },
            {
                img: game8,
                title: 'VÕ BÁ THIÊN HẠ',
                subTitle : 'Đấu Khí Đại Lục',
                desType : 'MMO | Điện thoại',
                desDate : checkLanguage({vi: 'Ngày phát hành: Coming soon', en: 'Release date: Coming soon'},language),
                type : 2,
            },
        ]
        var arr = []
        list.forEach(o => {
            if(o.type === Type || Type === 0) arr.push(o)
        })
        return arr
    },[language,Type])

    const dispatch = useDispatch()
    const history = useHistory()
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


    const textLogo = useSelector(state => {
        return state && state.settings && state.settings.text_next_logo
    })

    const handleChooseLang = useCallback(lang=>{
        dispatch(atcChangeLanguage(lang))
        localStorage.setItem('lang', lang)
    },[dispatch])

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


    const handleScroll = useCallback(type =>{
        var track = document.querySelector('.track')
        var itemWidth = track.querySelector('.item').offsetWidth
        if(type === 0){
            var targetLeft = Math.floor(track.scrollLeft / itemWidth - 0.0001) * itemWidth
            smoothscroll(track, track.scrollLeft, targetLeft , 0,0,200)
        }else{
            var targetRight = Math.ceil(track.scrollLeft / itemWidth + 0.0001) * itemWidth
            smoothscroll(track, track.scrollLeft, targetRight , 0,0,200)
        }
    },[])

    return(
        <>
        <div className='gamehub'>
            <header style={{backgroundImage: `url(${bgbanner})`}} className="header">
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
                        <Menu type={0}/>
                    </div>
                </div>
                <div className='banner'>
                    <div className='content'>
                        <span className="top">
                            KINGDOM
                        </span><br />
                        <span className='bottom'>
                            GAME HUB
                        </span>
                    </div>
                    <img className="border bottom" alt="" src={borderbottom} />
                </div>
            </header>

            <div className='des' style={{backgroundImage: `url(${bgdes})`}}>
                {/* <img className="border top" alt="" src={bordertop} /> */}
                <div className="content">   
                    <p className="sub-title">
                    {checkLanguage({vi: 'Bạn Là Nhà Lập Trình Game Hay Game Thủ?', en: 'Are you a game developer or gamer?'},language)}
                    </p>
                    <p className="title">
                    {checkLanguage({vi: 'Chúng tôi có tất cả', en: 'WE HAVE '},language)}
                    </p>
                    <p className="title-bottom">
                    {checkLanguage({vi: 'những gì bạn cần', en: 'ALL YOU NEED'},language)}
                    </p>
                    <p className='des-content'>
                    {checkLanguage({vi: 'Kingdom Game Hub cung cấp cho những nhà phát triển game hệ sinh thái toàn diện với Ví lưu trữ, Cổng thanh toán và Nền tảng hoán đổi, có thể áp dụng vào nền tảng KDG vào game một cách tiện lợi. Đồng thời, Kingdom Game Hub cũng mang lại cho người chơi trải nghiệm game hoàn toàn mới, lựa chọn game đa dạng và đặc biệt đem lại thu nhập từ việc chơi game.', en: 'Kingdom Game Hub provides comprehensive ecosystem for game developers with a Cryto Wallet, Payment Gateway and Swap Platform, which can be conveniently applied KDG token into the game. At the same time, Kingdom Game Hub also gives players a completely new game experience, diverse game choices and especially brings income from gaming.'},language)}
                    </p>
                </div>
                <img className="border bottom" alt="" src={borderbottom} />
            </div>

            <div className='info' style={{backgroundImage: `url(${bginfo})`}}>
                <img className="border boob top" alt="" src={boobtop} />
                <div className='kdg-container'>
                    <div className='kdg-row'>
                        <div className='kdg-col-4 va-t'>
                            <div className='title'>
                            {checkLanguage({vi: 'Nhà phát triển game', en: 'GAME DEVELOPERS'},language)}
                            </div>
                            <ul>
                                <li>
                                    <span><img src={li1} alt="" /></span>
                                    <span>{checkLanguage({vi: 'Hỗ trợ gọi vốn cộng đồng để phát triển game', en: 'Support for crowdfunding to develop games'},language)}</span>
                                </li>
                                <li>
                                    <span><img src={li2} alt="" /></span>
                                    <span>{checkLanguage({vi: 'Tiếp cận nền tảng thanh toán Blockchain hoàn toàn mới', en: 'Access to a brand new Blockchain payment platform'},language)}</span>
                                </li>
                                <li>
                                    <span><img src={li3} alt="" /></span>
                                    <span>{checkLanguage({vi: 'Phát hành trò chơi với chi phí thấp, hiệu quả cao', en: 'Releasing games with low cost and high efficiency'},language)}</span>
                                </li>
                                <li>
                                    <span><img src={li4} alt="" /></span>
                                    <span>{checkLanguage({vi: 'Dễ dàng quảng bá trò chơi trong và ngoài game', en: 'Easily promote games'},language)}</span>
                                </li>
                                <li>
                                    <span><img src={li5} alt="" /></span>
                                    <span>{checkLanguage({vi: 'Giữ chân người dùng lâu dài', en: 'Long-term retention of users'},language)}</span>
                                </li>
                            </ul>
                        </div>
                        <div className='kdg-col-4'></div>
                        <div className='kdg-col-4 va-t'>
                            <div className='title'>
                            {checkLanguage({vi: '', en: ''},language)}NGƯỜI CHƠI GAME
                            </div>
                            <ul>
                                <li>
                                    <span><img src={li6} alt="" /></span>
                                    <span>
                                        {checkLanguage({vi: 'Hệ sinh thái game phong phú và đa dạng', en: 'Collective game ecosystem'},language)}
                                    </span>
                                    
                                </li>
                                <li>
                                    <span><img src={li7} alt="" /></span>
                                    <span>
                                        {checkLanguage({vi: 'Chơi game tạo ra thu nhập ổn định', en: 'Playing games generates stable income'},language)}
                                    </span>
                                    
                                </li>
                                <li>
                                    <span><img src={li8} alt="" /></span>
                                    <span>
                                        {checkLanguage({vi: 'Tích hợp ví điện tử đa năng, thanh toán dễ dàng', en: 'Integrated multi-function electronic wallet, easy payment'},language)}
                                    </span>
                                    
                                </li>
                                <li>
                                    <span><img src={li9} alt="" /></span>
                                    <span>
                                        {checkLanguage({vi: 'Chương trình hoa hồng giới thiệu người chơi hấp dẫn', en: 'Attractive commission program when inviting others for players'},language)}
                                    </span>
                                    
                                </li>
                                <li>
                                    <span><img src={li10} alt=""/></span>
                                    <span>
                                        {checkLanguage({vi: 'Hỗ trợ nhanh chóng và thân thiện', en: 'Quick and friendly support'},language)}
                                    </span>
                                    
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <img className="border boob bottom" alt="" src={boobbottom} />
            </div>

            <div className='games' style={{backgroundImage: `url(${bggames})`}}>
                <img className="border top" alt="" src={bordertop} />
                <div className='kdg-container'>
                    <p className='title'>
                    {checkLanguage({vi: 'DANH SÁCH GAME', en: 'GAME LIST'},language)}
                    </p>
                    <div className='tabs'>
                        <span 
                        onClick={(e)=>{
                            e.target.parentElement.querySelectorAll('.tab').forEach(el => el.classList.remove('active'))
                            e.target.classList.add('active')
                            setType(0)
                        }}
                        className='tab active'>{checkLanguage({vi: 'TẤT CẢ', en: 'ALL'},language)}</span>
                        <span 
                        onClick={(e)=>{
                            e.target.parentElement.querySelectorAll('.tab').forEach(el => el.classList.remove('active'))
                            e.target.classList.add('active')
                            setType(1)
                        }}
                        className='tab'>{checkLanguage({vi: 'MÁY TÍNH', en: 'DESKTOP'},language)}</span>
                        <span 
                        onClick={(e)=>{
                            e.target.parentElement.querySelectorAll('.tab').forEach(el => el.classList.remove('active'))
                            e.target.classList.add('active')
                            setType(2)
                        }}
                        className='tab'>{checkLanguage({vi: 'ĐIỆN THOẠI', en: 'MOBILE'},language)}</span>
                    </div>
                    <div className='button'>
                        <FontAwesomeIcon 
                        onClick={()=>handleScroll(0)}
                        className='left' size='2x' color='#ccc' icon={faChevronLeft} />
                        <FontAwesomeIcon
                        onClick={()=>handleScroll(1)}
                        className='right' size='2x' color='#ccc' icon={faChevronRight} />
                        <div className='track'>
                            <div style={window.innerWidth <= 768 ? {width: listGame.length * 100 + '%'} : {}} className='kdg-row kdg-column-4 list-game'>
                            {
                                listGame.map(o => 
                                (Type === o.type || Type === 0) && <div className='item'>
                                    <div className='game'>
                                        <img alt="" src={o.img} />
                                        <p className='list-game-title'>{o.title}</p>
                                        <p className='list-game-subtitle'> {o.subTitle} </p>

                                        <p className='type'> {o.desType} </p>
                                        <p className='date'> {o.desDate} </p>
                                    </div>
                                </div>    
                                )
                            }
                            </div>
                        </div>
                    </div>
                </div>
                <img className="border bottom" alt="" src={borderbottom} />
            </div>
        </div>

        </>
    )
}