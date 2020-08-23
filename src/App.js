import React, {useMemo}  from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetSettings, atcChangeLanguage,asyncGetListCategories} from './store/action'
import Home from './pages/Home'
function App() {
  const ROUTERS_LINK = useSelector(state => state.router)
  const dispatch = useDispatch()
  useMemo(()=>{
    dispatch(asyncGetSettings())
    dispatch(asyncGetListCategories())
    dispatch(atcChangeLanguage('en'))
  },[])
  return(
    <>
    <BrowserRouter>
      <Switch>
          {
            ROUTERS_LINK && ROUTERS_LINK.map(route => {
              console.log(route);
              if(route.path && !route.isURL && !route.pathEN){
                return (
                  <Route key={route.path} exact={true} path={route.path}>
                    <Home components={route.page.components}/>
                  </Route>
                )
              }
            })
          }
      </Switch>
    </BrowserRouter>
    </>
  )
}

export default App;
