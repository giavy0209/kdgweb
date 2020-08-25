import React, { useState, useEffect, useMemo } from 'react'
import { asyncGetUserData} from '../../store/action'
import { useHistory } from 'react-router-dom'

import {Header, Footer} from '../../components'
import Sidebar from './Sidebar'
import Tab0 from './Tab0'
import Tab1 from './Tab1'
import Tab2 from './Tab2'
import Tab3 from './Tab3'
import { useDispatch } from 'react-redux'

import '../../assets/css/account.scss'

export default function App({...prop}) {
    const [Tab, setTab] = useState(0)

    const history = useHistory()
    const dispatch = useDispatch()
    // useMemo(()=>{
    //     dispatch(asyncGetUserData())
    //     .then(res=>{
    //         if(res === false){
    //             history.push('/login')
    //         }
    //     })
    // },[dispatch,history])

    useEffect(()=>{
        if(window.innerWidth > 992){
            const main = document.querySelector('.main')
            const sidebar = document.querySelector('.sidebar')
            sidebar.style.height = null
            main.style.height = null
            const mainHeight = main.offsetHeight;
            const sidebarHeight = sidebar.offsetHeight;
            console.log(mainHeight , sidebarHeight);
            if(mainHeight > sidebarHeight) sidebar.style.height = mainHeight + 'px'
            else main.style.height = sidebarHeight + 'px'
        }
    },[Tab])
    return(
        <>
        <div className="kdg-container ">
            <div className="account">
                <div className="kdg-row">
                    <Sidebar Tab={Tab} setTab={setTab} />
                    <div className="kdg-col-9 va-t">
                        <div className="main">
                            {
                                Tab === 0 ? <Tab0 /> : 
                                Tab === 1 ? <Tab1 /> :
                                Tab === 2 ? <Tab2 /> : <Tab3 />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
    
}