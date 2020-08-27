import React, {useMemo, useCallback}  from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetSettings, atcChangeLanguage,asyncGetListCategories, actChangeLoading} from './store/action'
import Home from './pages/Home'
import Login from './pages/Login'
import Reg from './pages/Reg'
import Loading from './pages/Loading'
function App() {
  const dispatch = useDispatch()
  const ROUTERS_LINK = useSelector(state => state.router)
  const isLoading = useSelector(state=>state.loading)
  useMemo(()=>{
    dispatch(actChangeLoading(true));
    Promise.all([
      dispatch(asyncGetSettings(false)),
      dispatch(asyncGetListCategories(false)),
      dispatch(atcChangeLanguage('en'))
    ]).then(() => {
      dispatch(actChangeLoading(false));
    })
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
    {isLoading && <Loading />}
    <BrowserRouter>
      <Switch>
        {ListRoute()}
        {settings &&
        <>
        <Route exact={true} path={`${settings.login}/:email?`}>
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
