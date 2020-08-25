import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux';
import { message } from 'antd';

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
    return(
        <>
        <h3>REFERRAL</h3>
        <div className="ref">
            <div>
                <span>Điểm thưởng hiện tại:</span>
                <span className="high-line">0 KDG Reward</span>
            </div>
            <div>
                <span>Liên kết giới thiệu:</span>
                <span className="link" onClick={handleCopy}>
                    http://id.kingdomgame.org/member/register_referral/?referral_code=8905850
                    <FontAwesomeIcon icon={faCopy} />    
                </span>
            </div>
            <div>
                <span>Mã giới thiệu:</span>
                <span className="code" onClick={handleCopy}> {user && user.ref_code} <FontAwesomeIcon icon={faCopy} />   </span>
            </div>
        </div>

        </>
    )
}