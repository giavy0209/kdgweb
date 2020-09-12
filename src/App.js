import React, {useMemo, useCallback, useEffect, useState}  from 'react';
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetSettings, atcChangeLanguage,asyncGetListCategories, actChangeLoading, asyncGetUserData, asyncLogin} from './store/action'
import Home from './pages/Home'
import Term from './pages/Term'
import Login from './pages/Login'
import Reg from './pages/Reg'
import ForgotPassword from './pages/ForgotPassword'
import Loading from './pages/Loading'
import NewsDetail from './pages/NewsDetail'

import backtop from './assets/img/back-top.svg'
import { smoothscroll, storage } from './helpers';
function App() {
  const dispatch = useDispatch()
  const [ShowScrollTop, setShowScrollTop] = useState(false)
  const ROUTERS_LINK = useSelector(state => state.router)
  const isLoading = useSelector(state=>state.loading)
  const settings = useSelector(state => {
    return state.settings && {login: state.settings.login_button.url , reg: state.settings.reg_button.url}
  })
  

  useMemo(()=>{
    
    var lang = localStorage.getItem('lang')
    if(lang){
      dispatch(atcChangeLanguage(lang))
    }else{
      dispatch(atcChangeLanguage('en'))
    }
    dispatch(actChangeLoading(true));
    Promise.all([
      dispatch(asyncGetSettings(false)),
      dispatch(asyncGetListCategories(false)),
      dispatch(asyncGetUserData())
    ]).then(() => {
      console.log(123);
      dispatch(actChangeLoading(false));
    })
  },[dispatch])

  useEffect(()=>{
    document.addEventListener('scroll', e=>{
      if(window.scrollY > 400){
        setShowScrollTop(true)
      }else{
        setShowScrollTop(false)
      }
    })
    var logintime = localStorage.getItem('login_time')
    if(logintime){
      var loginDate = new Date(logintime)
      var timeFromLastLogin = (new Date().getTime()) - loginDate.getTime()
      if(timeFromLastLogin >= 1800000){
        console.log(timeFromLastLogin);
        var email = localStorage.getItem('email')
        var password = localStorage.getItem('password')
        dispatch(asyncLogin({email, password}))
      }else{
      }
    }
    var id = setInterval(() => {
      var logintime = localStorage.getItem('login_time')
      if(logintime){
        var loginDate = new Date(logintime)
        var timeFromLastLogin = (new Date().getTime()) - loginDate.getTime()
        if(timeFromLastLogin >= 1800000){
          var email = localStorage.getItem('email')
          var password = localStorage.getItem('password')
          dispatch(asyncLogin({email, password}))
        }else{
        }
      }else{
        clearInterval(id)
      }
    }, 5000);

    setInterval(() => {
      dispatch(asyncGetUserData())
    }, 5000);
  },[])


  
  const ListRoute = useCallback(()=>{
    return ROUTERS_LINK && ROUTERS_LINK.map(route => 
      route.path && !route.isURL && !route.pathEN && <Route key={route.path} exact={true} path={route.path}>
        <Home name={route.name} type={route.type} reqLogin={route.reqLogin} components={route.page.components}/>
      </Route>
    )
  },[ROUTERS_LINK])
  return(
    <>
    <img
    onClick={()=>smoothscroll(window, 0 , 0 , 0 , 0 , 300)}
    style={ShowScrollTop ? {opacity: 1, pointerEvents: 'all'} : {opacity: 0 , pointerEvents: 'none'}}
    className="back-top" src={backtop} alt="" />
    {isLoading && <Loading />}
    <BrowserRouter>
      <Switch>
        {ListRoute()}
        {settings &&
        <>
        <Route exact={true} path={`${settings.login}`}>
          <Login/>
        </Route>
        <Route exact={true} path={`${settings.reg}/:ref?`}>
          <Reg/>
        </Route>
        <Route exact={true} path='/forgot-password'>
          <ForgotPassword/>
        </Route>
        <Route exact={true} path='/terms-of-service/:index?'>
          <Term/>
        </Route>
        <Route exact={true} path='/news/:id?'>
          <NewsDetail/>
        </Route>
        
        </>
        }
      </Switch>
    </BrowserRouter>
    </>
  )
}

export default App;
