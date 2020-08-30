import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux';
import { message } from 'antd';
import { checkLanguage } from '../../helpers';

const handleCopy = e=>{
    var input = document.createElement('input');
    document.querySelector('body').append(input);
    input.value = e.target.innerText;
    input.select();
    document.execCommand("copy");
    input.remove();
    message.success('Đã copy')
}
export default function App(){
    const user = useSelector(state=> state.user)
    const language = useSelector(state=> state.lang)
    const kdg_reward = useSelector(state=>state && state.user && state.user.kdg_reward)    
    return(
        <>
        <h3>REFERRAL</h3>
        <div className="ref">
            <div>
                <span>{checkLanguage({vi: 'Điểm thưởng hiện tại', en: 'Current reward points'}, language)}:</span>
                <span className="high-line">{kdg_reward} KDG Reward</span>
            </div>
            <div>
                <span>{checkLanguage({vi: 'Liên kết giới thiệu', en: 'Referral link'}, language)}:</span>
                <span className="link" onClick={handleCopy}>
                    https://kingdomgame.co/reg/{user && user.ref_code}
                    <FontAwesomeIcon style={{pointerEvents: 'none'}} icon={faCopy} />    
                </span>
            </div>
            <div>
                <span>{checkLanguage({vi: 'Mã giới thiệu', en: 'Referral code'}, language)}:</span>
                <span className="code" onClick={handleCopy}>{user && user.ref_code}<FontAwesomeIcon style={{pointerEvents: 'none'}}icon={faCopy}/></span>
            </div>
        </div>

        </>
    )
}