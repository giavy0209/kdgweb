import React , { useEffect, useState , useCallback, useMemo} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkLanguage, storage } from '../helpers';
import { atcChangeLanguage } from '../store/action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faUserEdit, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
export default function App({type}) {
  const dispatch = useDispatch()
  const ROUTERS_LINK = useSelector(state => state.router)
  const [currentUrl, setCurrentUrl] = useState('/');
  const location = useLocation();
  const history = useHistory();
  const language = useSelector(state => state.lang)
 
  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location])

  const handleClick = useCallback((selectedItem,event,isURL,havepath) => {
    var path, pathEN;
    if(havepath) {
      path = havepath.path;
      pathEN = havepath.pathEN;
    }
    if(pathEN){
      window.open(checkLanguage({vi:path, en: pathEN}, language),'_blank')
    }
    if(isURL){
      console.log(selectedItem);
      window.open(selectedItem, '_blank')
    }
    if(!isURL && !pathEN){
      if(selectedItem !== ''){
        if(selectedItem !=='null'){
          if(event) event.stopPropagation();
          setCurrentUrl(selectedItem);
          history.push(selectedItem);

        }
      }
    }
  },[history,language]);
  const logoHeader = useSelector(state=>{
    return state && state.settings && state.settings.logo && state.settings.logo.logo_header
  })

  const loginBtn = useSelector(state=>{
    return state && state.settings && state.settings.login_button
  })

  const regBtn = useSelector(state=>{
    return state && state.settings && state.settings.reg_button
  })

  useEffect(()=>{
    if(window.innerWidth < 992){
      document.querySelectorAll('.menu > li').forEach(el=>{
        var submenu = el.querySelector('ul')
        if(submenu){
          el.addEventListener('click', (e)=>{
            e.preventDefault()
            if(Array.from(el.classList).indexOf('show') === -1) el.classList.add('show')
            else el.classList.remove('show')
          })
        }
      })
      document.querySelector('.menubar').addEventListener('click',e=>{
        var menu = document.querySelector('header .bottom-header .logo-menu')
        if(Array.from(menu.classList).indexOf('show') === -1) menu.classList.add('show')
        else menu.classList.remove('show')
      })
      document.querySelector('.mask-menu').addEventListener('click', ()=>{
        document.querySelector('header .bottom-header .logo-menu').classList.remove('show')
      })
    }
  },[])

  const handleChooseLang = useCallback(lang=>{
    dispatch(atcChangeLanguage(lang))
    localStorage.setItem('lang', lang)
  },[dispatch])

  const username = useSelector(state=>{
    return state.user && {first_name: state.user.first_name , last_name:state.user.last_name, email: state.user.email}
  })

  const lastMenu = useCallback(()=>{
    if(username){
      return <li
      onClick={e=>{
        if(window.innerWidth > 992){
          var dropdown = e.currentTarget.querySelector('.drop-down-account')
          if(Array.from(dropdown.classList).includes('active')) dropdown.classList.remove('active')
          else dropdown.classList.add('active')
        }else{
          handleClick('/account', e)
        }
      }}
      className="account-menu"
      >
        <FontAwesomeIcon size="2x" color="#fac800" icon={faUserCircle} />
        <div 
        className="drop-down-account">
          <div className="top-dropdown">
            <FontAwesomeIcon style={{verticalAlign: 'middle'}} icon={faUser} size="2x"/>
            <div>
              <p>{ (username.first_name || username.last_name) && `${username.first_name ? username.first_name : '' } ${username.last_name ? username.last_name : '' }`}</p>
              <p>{username.email &&  username.email}</p>
            </div>
          </div>
          <div 
          onClick={(e)=>{handleClick('/account',e)}}
          className="bottom-dropdown">
            <FontAwesomeIcon icon={faUserEdit} color="#283349" />
            <span> {checkLanguage({vi:'Tài khoản', en: 'Account'}, language)} </span>
          </div>
          <div 
          onClick={()=>{
            storage.clearToken()
            storage.clearJWT()
            window.open('/', '_self')
          }}
          className="bottom-dropdown">
            <FontAwesomeIcon icon={faSignOutAlt} color="#283349" />
            <span> {checkLanguage({vi:'Đăng xuất', en: 'Logout'}, language)} </span>
          </div>
        </div>
      </li>
    }else{
      return <>
      <li className="login"><a target="_blank" rel="noopener noreferrer" href={loginBtn ? loginBtn.url : ''}> {checkLanguage(loginBtn, language)} </a></li>
      <li className="reg"><a target="_blank" rel="noopener noreferrer" href={loginBtn ? regBtn.url : ''}> {checkLanguage(regBtn,language)} </a></li>
      </>
    }
  },[username, handleClick, language,loginBtn, regBtn])

  return (
    <>
      <span className="mask-menu"></span>
      <ul className="menu">
        <a className="logo" href="/"><img alt="KingDomGame" src={logoHeader}/></a>
        {
          ROUTERS_LINK && ROUTERS_LINK.map(router=>
            router.name && router.isShow && !router.parent && router.type === type &&
                <li
                className={`${currentUrl === router.path && 'active'} hover`}
                onClick={(e)=>{handleClick(router.path,e, router.isURL,{path: router.path, pathEN : router.pathEN})}}
                key={router.path}>
                  <span dangerouslySetInnerHTML={{__html: checkLanguage(router.name,language)}}></span>
                  {
                    ROUTERS_LINK && <ul>
                      {
                        ROUTERS_LINK && ROUTERS_LINK.map(submenu=>
                            submenu.name && submenu.parent === router.id && 
                            <li onClick={(e)=>{handleClick(submenu.path,e,submenu.isURL,{path: submenu.path, pathEN : submenu.pathEN})}} key={submenu.path}><span dangerouslySetInnerHTML={{__html: checkLanguage(submenu.name,language)}}></span></li>
                        )
                      }
                    </ul>
                  }
                </li>
          )
        }
        
        {lastMenu()}
        {!username && <span className="button-mobile">
            <li className="login"><a target="_blank" rel="noopener noreferrer" href={loginBtn ? loginBtn.url : ''}> {checkLanguage(loginBtn, language)} </a></li>
            <li className="reg"><a target="_blank" rel="noopener noreferrer" href={loginBtn ? regBtn.url : ''}> {checkLanguage(regBtn,language)} </a></li>
        </span>}
        <span className='language'>
          <li className={language === 'en' ? 'active' : ''} onClick={()=>handleChooseLang('en')}>EN</li>
          <li className={language === 'vi' ? 'active' : ''} onClick={()=>handleChooseLang('vi')}>VI</li>
        </span>
      </ul>
    </>
  );
}
