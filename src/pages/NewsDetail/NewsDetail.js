import React, { useEffect } from 'react'
import {Header , Footer} from '../../components'
import { useParams, useHistory } from 'react-router-dom'
import '../../assets/css/news.scss'
import { checkLanguage } from '../../helpers'
import { useSelector } from 'react-redux'
const css = `
body {
    background-color: #fff
}
`
export default function App(){
    const language = useSelector(state => state.lang)
    const history = useHistory()
    const {id} = useParams()
    useEffect(()=>{
        if(!id){
            history.push('/')
        }
    },[id])
    return (
        <>
            <style>{css}</style>
            <Header type={0}/>
            <div className="kdg-container">
                <div className="news-content">
                    <div className="kdg-row">
                        <div className="kdg-col-9 va-t">
                            <div className="main-content">
                                <div className="header">
                                    <h1 className="title">aslk sadg aopgk askg eop</h1>
                                    <p className="date">17:50 - 20/10/2019</p>
                                </div>
                                <div className="body">
                                    <div className="metades">Kingdom Game 4.0, a pioneer in the of blockchain games field in Vietnamese market, becomes a strategic partner with Tron Network, the world’s leading Blockchain application ecosystem.</div>
                                </div>
                            </div>
                        </div>
                        <div className="kdg-col-3 va-t">
                            <aside>
                                <div className="block-aside">
                                    <h3 className="block-title">
                                        {checkLanguage({vi: 'Tin khác', en: 'Other news'},language)}
                                    </h3>
                                    <ul className="list-othernews">
                                        <li>            
                                            <h3 className="othernew-title">afja  wjoegj iwajg awiej oij</h3>
                                            <p className="othernew-date"></p>
                                        </li>
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}