import React from 'react'
import Home from '../pages/Home'

const ROUTERS = [
    {
        path : '/',
        exact : true,
        name: 'Menu',
        isShow: true,
        render : ()=> <Home/>
    },
]

export default ROUTERS