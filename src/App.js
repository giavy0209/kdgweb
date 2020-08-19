import React  from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ROUTERS_LINK from './routers';
function App() {
  return(
    <>
    <BrowserRouter>
      <Switch>
          {
            ROUTERS_LINK.map(route => {
              return (
                <Route key={route.path} exact={route.exact} path={route.path}>
                  {route.render()}
                </Route>
              )
            })
          }
      </Switch>
    </BrowserRouter>
    </>
  )
}

export default App;
