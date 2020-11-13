import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../../assets/css/staking.scss'
import { checkLanguage } from '../../helpers'
import KDG from '../../assets/img/kdg-icon.png'
export default function App() {
  const history = useHistory()
  const language = useSelector(state=>state.lang)
  return(
        <>
            <div className="kdg-container">
                <div className="stake-join">
                    <div className="block1">
                        <div className="back-button">
                            <FontAwesomeIcon icon={faArrowLeft}/>
                            <span> {checkLanguage({vi : 'Trở về' , en : 'Back'}, language)} </span>
                        </div>
                        <h2 className="title">Staking</h2>
                        <div className="block-top-info">
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}