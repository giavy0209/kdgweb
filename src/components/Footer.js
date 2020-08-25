import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker ,faEnvelope} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { checkLanguage } from '../helpers'
export default function App({...prop}) {
    const lang = useSelector(state => state.lang)

    const logoFooter = useSelector(state=>{
        return state && state.settings && state.settings.logo && state.settings.logo.logo_footer
    })
    const copyright = useSelector(state=>{
        return state && state.settings && state.settings.bottom_footer
    })
    const email = useSelector(state=>{
        return state.settings && state.settings.email && state.settings.email.email
    })

    const address = useSelector(state=>{
        return state.settings && state.settings.address
    })

    const titleFooter = useSelector(state=>{
        return state.settings && state.settings.title_footer
    })

    const listIcon = useSelector(state =>{
        if(state.settings && state.settings.footer_icon){
            var footer_icon = state.settings.footer_icon
            var imgStr = 'iconfooter';
            var linkStr = 'iconfooterlink';
            var returnArray = []
            for (let index = 0; true; index++) {
                const img = imgStr + index;
                const link = linkStr + index;
                if(!footer_icon[img] || !footer_icon[link]) return returnArray
                else {
                    var obj = {img: footer_icon[img], link:footer_icon[link]}
                    returnArray.push(obj)
                }
            }
        }
    }) 

    const middleFooter = useSelector(state=>{
        return state.settings && state.settings.middle_footer
    })

    const titleReciveMail = useSelector(state=>{
        return state.settings && state.settings.title_recive_mail
    })

    const placeHolderInputMail = useSelector(state=>{
        return state.settings && state.settings.place_holder_input_mail
    })
    const placeHolderInputName = useSelector(state=>{
        return state.settings && state.settings.place_holder_input_name
    })

    const submitButton = useSelector(state=>{
        return state.settings && state.settings.submit_button
    })
    return(
        <>
            <footer>
                <div className="kdg-container">
                    <div className="kdg-row top-footer">
                        <div className="kdg-col-4">
                            <a href="/"><img alt="KingDomGame" src={logoFooter} /></a>
                            <p style={{fontSize: 23, fontWeight: 600, marginTop: 30}}>{checkLanguage(titleFooter, lang)}</p>
                            <p style={{fontSize:14, marginTop: 27}}><FontAwesomeIcon color="#fac800" icon={faMapMarker}/> {checkLanguage(address, lang)} </p>
                            <p style={{fontSize:14, marginTop: 14}}><FontAwesomeIcon color="#fac800" icon={faEnvelope}/> {email} </p>
                            <div className="social">
                                {
                                    listIcon && listIcon.map((o, index)=>
                                    <a  target="_blank" rel="noopener noreferrer"  className="social-block" href={o.link} key={index}><img alt="" src={o.img}/></a>
                                    )
                                }
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{__html: checkLanguage(middleFooter, lang)}} className="kdg-col-4 cate">

                        </div>
                        <div className="kdg-col-4 recive-email">
                            <p className="title">{checkLanguage(titleReciveMail, lang)}</p>
                            <form>
                                <input placeholder={checkLanguage(placeHolderInputName, lang)}/>
                                <input placeholder={checkLanguage(placeHolderInputMail, lang)}/>
                                <button type="submit">{checkLanguage(submitButton, lang)} </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="bottom-footer">
                    {checkLanguage(copyright, lang)}
                </div>
            </footer>
        </>
    )    
}