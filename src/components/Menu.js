import React , { useEffect, useState , useCallback} from 'react';
import { useHistory, useLocation,Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkLanguage } from '../helpers';
import { atcChangeLanguage } from '../store/action'
export default function App() {
  const dispatch = useDispatch()
  const ROUTERS_LINK = useSelector(state => state.router)
  const [currentUrl, setCurrentUrl] = useState('/');
  const location = useLocation();
  const history = useHistory();
  const language = useSelector(state => state.lang)
  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location])

  const handleClick = useCallback((selectedItem,event) => {
    if(selectedItem !== ''){
      event.stopPropagation();
      setCurrentUrl(selectedItem);
      history.push(selectedItem);
    }
  },[history]);
  const logoHeader = useSelector(state=>{
    return state && state.settings && state.settings.logo && state.settings.logo.logo_header
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
      document.querySelector('.mask').addEventListener('click', ()=>{
        document.querySelector('header .bottom-header .logo-menu').classList.remove('show')
      })
    }
  },[])

  const handleChooseLang = useCallback(lang=>{
    dispatch(atcChangeLanguage(lang))
  },[dispatch])


  return (
    <>
      <span className="mask"></span>
      <ul className="menu">
        <a className="logo" href="/"><img alt="KingDomGame" src={logoHeader}/></a>
        {
          ROUTERS_LINK && ROUTERS_LINK.map(router=>{
            if(router.name && router.isShow && !router.parent){
              return ( 
                <li
                className={`${currentUrl === router.path && 'active'} hover`}
                onClick={(e)=>{handleClick(router.path,e)}}
                key={router.path}>
                  <span dangerouslySetInnerHTML={{__html: checkLanguage(router.name,language)}}></span>
                  {
                    ROUTERS_LINK && <ul>
                      {
                        ROUTERS_LINK && ROUTERS_LINK.map(submenu=>{
                          if(submenu.name && submenu){
                            if(submenu.parent === router.id){
                              return (
                                <li onClick={(e)=>{handleClick(submenu.path,e)}} key={submenu.path}><span dangerouslySetInnerHTML={{__html: checkLanguage(submenu.name,language)}}></span></li>
                              )
                            }
                            
                          }
                        })
                      }
                    </ul>
                  }
                </li>
              )
            }
          })
        }
        <li className="login"><a target="_blank" href="http://161.35.2.43:4000/login">Đăng nhập</a></li>
        <li className="reg"><a target="_blank" href="http://161.35.2.43:4000/reg">Đăng ký</a></li>
        <span className="button-mobile">
            <li className="login"><a target="_blank" href="http://161.35.2.43:4000/login">Đăng nhập</a></li>
            <li className="reg"><a target="_blank" href="http://161.35.2.43:4000/reg">Đăng ký</a></li>
        </span>
        <span className='language'>
          <li className={language === 'en' && 'active'} onClick={()=>handleChooseLang('en')}>EN</li>
          <li className={language === 'vi' && 'active'} onClick={()=>handleChooseLang('vi')}>VI</li>
        </span>
      </ul>
    </>
  );
}
