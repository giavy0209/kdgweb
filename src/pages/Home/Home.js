import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import {Description,Ecosystem,Header,Footer,List,ListImage,RoadMap,TitleOpacity,MainChart,Tab,HightlightTitle} from '../../components'

import {checkComponent} from '../../helpers'

export default function App({components}) {
    console.log(components);
    const dispatch = useDispatch()
    
    return (
        <>
        {
        components && components.map((page,index) =>{
            const Component = checkComponent(page.type)
            return (
                Component.haveContainer ? <div className="kdg-container"><Component.component data={page.data}/></div> : <Component.component data={page.data}/>
            )
        })
        }   
        </>
    )
    
}