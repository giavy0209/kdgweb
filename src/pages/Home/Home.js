import React, { useMemo, useEffect } from 'react'
import {checkComponent, checkLanguage} from '../../helpers'
import { useHistory, useLocation } from 'react-router-dom';
import {storage} from '../../helpers'
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetUserData, actChangeUser, actChangeToken } from '../../store/action';
import bg from '../../assets/img/home.png'
export default function App({components,reqLogin,type,name}) {
    const history = useHistory()
    const dispatch = useDispatch()
    const language = useSelector(state => state.lang)
    const token = useSelector(state => state.token)
    const JWT = useSelector(state => state.JWT)
    const location = useLocation();

    React.useEffect(() => {
      window.scroll(0,0)
    }, [location]);

    useEffect(()=>{
        var title = checkLanguage(name,language).replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
        document.title = title
    },[language,name])

    useEffect(()=>{
        document.querySelectorAll('a').forEach(el=>{
            el.addEventListener('click', e=>{
                if(!el.getAttribute('href').includes('http')){
                    if(e.target.getAttribute('target') && e.target.getAttribute('target') !== '_blank'){
                        e.preventDefault()
                        history.push(el.getAttribute('href'))
                    }
                }
            })
        })
    },[history])

    useMemo(()=>{
        if(reqLogin){
            if(token && JWT){
                dispatch(asyncGetUserData(token))
                .catch(e=>{
                    history.replace('/login')
                })
            }else{
                history.replace('/login')
            }
        }
    },[history,dispatch,reqLogin,token,JWT])
    return (
        <>
        {/* <div className="kdg-container">
            <img id="background" src={bg} />
        </div> */}
        {
        components && components.map((page,index) =>{
            const Component = checkComponent(page.type)

            return (
                Component.haveContainer ? 
                <div key={index} type={type} className="kdg-container"><Component.component data={page.data}/></div> : 
                <Component.component type={type} key={index} data={page.data}/>
            )
        })
        }   
        </>
    )
    
}