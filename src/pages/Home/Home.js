import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { asyncGetSettings, atcChangeLanguage} from '../../store/action'

import {Description,Ecosystem,Header,Footer,List,ListImage,RoadMap,TitleOpacity,MainChart,Tab,HightlightTitle} from '../../components'

import roadmap from '../../assets/img/roadmap.png'

import img from '../../assets/img/partner.png'

const listImg = [img,img,img,img,img,img,img]

const slide=[
    {
        button: 'King Wallet',
        slideTitle: 'Nền tảng ví điện tử an toàn, bảo mật cao, giao dịch nhanh chóng và thân thiện với người dùng',
        slideImg: img,
        slideContent: `<ul> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> </ul>`
    },
    {
        button: 'King Wallet',
        slideTitle: 'Nền tảng ví điện tử an toàn, bảo mật cao, giao dịch nhanh chóng và thân thiện với người dùng',
        slideImg: img,
        slideContent: `<ul> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> </ul>`
    },
    {
        button: 'King Wallet',
        slideTitle: 'Nền tảng ví điện tử an toàn, bảo mật cao, giao dịch nhanh chóng và thân thiện với người dùng',
        slideImg: img,
        slideContent: `<ul> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> </ul>`
    },
    {
        button: 'King Wallet',
        slideTitle: 'Nền tảng ví điện tử an toàn, bảo mật cao, giao dịch nhanh chóng và thân thiện với người dùng',
        slideImg: img,
        slideContent: `<ul> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> <li>Ví lưu trữ KDG token </li> </ul>`
    },
]

export default function App({...rest}) {
    const dispatch = useDispatch()
    useMemo(()=>{
        dispatch(asyncGetSettings())
        dispatch(atcChangeLanguage('en'))
    },[])
    return (
        <>
        <Header VisibleBanner={true}/>
        <div className="kdg-container">
            <TitleOpacity title="Ve chung toi"/>
            <Description html="<h1>alb</h1>"/>
            <TitleOpacity title="tinh nang"/>
            <List />
            <TitleOpacity title="lo trinh"/>
            <RoadMap  roadmap={roadmap}/>
            <Footer />
            <TitleOpacity title="market"/>
            <MainChart />
            <TitleOpacity title="doi tac"/>
            <ListImage data={listImg} />
            <Ecosystem data={slide}/>

            <HightlightTitle title="PHAT HANH TOKEN"/>
            <Tab title="PHAT HANH TOKEN" />

        </div>
        <Footer />
        </>
    )
    
}