import React, {useMemo, useCallback}  from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetSettings, atcChangeLanguage,asyncGetListCategories} from './store/action'
import Home from './pages/Home'
import Login from './pages/Login'
import Reg from './pages/Reg'
function App() {
  const ROUTERS_LINK = useSelector(state => state.router)
  const dispatch = useDispatch()
  useMemo(()=>{
    dispatch(asyncGetSettings())
    dispatch(asyncGetListCategories())
    dispatch(atcChangeLanguage('en'))
  },[dispatch])

  const settings = useSelector(state => {
    return state.settings && {login: state.settings.login_button.url , reg: state.settings.reg_button.url}
  })

  const ListRoute = useCallback(()=>{
    return ROUTERS_LINK && ROUTERS_LINK.map(route => 
      route.path && !route.isURL && !route.pathEN && <Route key={route.path} exact={true} path={route.path}>
        <Home type={route.type} reqLogin={route.reqLogin} components={route.page.components}/>
      </Route>
    )
  },[ROUTERS_LINK])
  return(
    <>
    <BrowserRouter>
      <Switch>
        {ListRoute()}
        {settings &&
        <>
        <Route exact={true} path={settings.login}>
          <Login/>
        </Route>
        <Route exact={true} path={settings.reg}>
          <Reg/>
        </Route>
        </>
        }
      </Switch>
    </BrowserRouter>
    </>
  )
}

export default App;
