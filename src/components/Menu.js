import React , { useEffect, useState , useCallback} from 'react';
import { useHistory, useLocation,Link } from 'react-router-dom';
import ROUTERS_LINK from '../routers'
export default function App() {
  const [currentUrl, setCurrentUrl] = useState('/');
  const location = useLocation();
  const history = useHistory();
  
  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location])

  const handleClick = useCallback((selectedItem,event) => {
    console.log(selectedItem);
    // event.stopPropagation();
    setCurrentUrl(selectedItem);
    history.push(selectedItem);
  },[history]);

  return (
    <>
      <ul className="menu">
        {
          ROUTERS_LINK.map(router=>{
            if(router.name && router.isShow){
              return ( 
                <li
                className={`${currentUrl === router.path && 'active'} hover`}
                onClick={(e)=>{handleClick(router.path,e)}}
                key={router.path}>
                  <span>{router.name}</span>
                  {
                    router.submenu && <ul>
                      {
                        router.submenu.map(submenu=>{
                          if(submenu.name){
                            return (
                              <li onClick={(e)=>{handleClick(submenu.path,e)}} key={submenu.path}>{submenu.name}</li>
                            )
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
        <li onClick={(e)=>{handleClick('/login',e)}} className="login"><Link to='/login'>Đăng nhập</Link></li>
        <li onClick={(e)=>{handleClick('/reg',e)}} className="reg">Đăng ký</li>
      </ul>
    </>
  );
}
