import React, { useMemo, useEffect } from 'react'
import {checkComponent, checkLanguage} from '../../helpers'
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
        console.log(language);
        var title = checkLanguage(name,language) ? checkLanguage(name,language).replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim() : '';
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
    return (
        <>
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