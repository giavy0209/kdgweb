import React, { useMemo, useEffect } from 'react'
import {checkComponent} from '../../helpers'
import { useHistory } from 'react-router-dom';
import {storage} from '../../helpers'
import { useDispatch } from 'react-redux';
import { asyncGetUserData } from '../../store/action';
export default function App({components,reqLogin,type}) {
    const history = useHistory()
    const dispatch = useDispatch()

    useMemo(()=>{
        if(reqLogin){
            var token = storage.getToken()
            if(token){
                dispatch(asyncGetUserData())
                .catch(e=>{
                    history.replace('/login')
                })
            }else{
                history.replace('/login')
            }
        }
    },[history,dispatch,reqLogin])
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