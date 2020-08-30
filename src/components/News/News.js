import React, { useEffect } from 'react'
import {checkLanguage} from '../../helpers'
import '../../assets/css/news.scss'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
const css = `
body {
    background-color: #fff
}
`
export default function App(){
    const language = useSelector(state => state.lang)
    
    return (
        <>
        <style>{css}</style>
        <div className="top-news">
            <div className="left">
                <h1 className="title">
                    {checkLanguage({vi: 'TIN TỨC', en: 'NEWS'},language)}
                </h1>
            </div>
            <div className="right">
                <div className="search">
                    <input placeholder={checkLanguage({vi: 'Tìm kiếm', en: 'Search'},language)}/>
                    <FontAwesomeIcon className="icon" color="#8a8c8e" icon={faSearch} />
                </div>
            </div>
        </div>
        <div className="kdg-row kdg-column-3 list-news">
            <div className="item">
                <div className="news">
                    <a className="img img-3-2" href="/news/123">
                        <img />
                    </a>
                    <h3 className="title">
                        <a href="/news/123">{checkLanguage({vi: 'test', en: 'test'},language)}</a>
                    </h3>
                    <p className="des">
                        {checkLanguage({vi: '', en: ''},language)}
                    </p>
                    <a className="viewmore" href='/' >{checkLanguage({vi: 'Xem thêm', en: 'View more'},language)}</a>
                </div>
            </div>
        </div>
        <div className="pagination">
            <span>
                {checkLanguage({vi: 'Trang', en: 'Page'},language)}
            </span>
            <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>5</li>
            </ul>

        </div>

        </>
    )
}