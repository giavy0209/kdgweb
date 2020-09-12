import React, { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux';
import { message } from 'antd';
import { checkLanguage } from '../../helpers';

export default function App(){
    const user = useSelector(state=> state.user)
    const language = useSelector(state=> state.lang)
    const kdg_reward = useSelector(state=>state && state.user && state.user.kdg_reward)    

    const handleCopy = useCallback(e=>{
        var input = document.createElement('input');
        document.querySelector('body').append(input);
        input.value = e.target.innerText;
        input.select();
        document.execCommand("copy");
        input.remove();
        message.success(checkLanguage({vi: 'Đã copy', en: 'copied'}, language))
    },[])
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
                    https://www.kingdomgame.org/reg/{user && user.ref_code}
                    <FontAwesomeIcon style={{pointerEvents: 'none'}} icon={faCopy} />    
                </span>
            </div>
            <div>
                <span>{checkLanguage({vi: 'Mã giới thiệu', en: 'Referral code'}, language)}:</span>
                <span className="code" onClick={handleCopy}>{user && user.ref_code}<FontAwesomeIcon style={{pointerEvents: 'none'}}icon={faCopy}/></span>
            </div>
        </div>
        <div className='rule'>
            <p>Quy luật</p>
            <p>1. Bất kỳ ai mời một người đăng ký tài khoản thành công sẽ nhận được 1 KDG Reward. </p>
            <p>2. Bất kỳ ai mời một người đăng ký tài khoản thành công, sau đó thực hiện xác minh danh tính (KYC) thành công sẽ nhận được thêm 4 KDG Reward.</p>
            <p>3. Không giới hạn lời mời, càng mời nhiều bạn, càng nhận được nhiều KDG Reward.</p>
            <p>4. Bất kỳ ai người dùng cùng 1 thiết bị, cùng một số điện thoại sẽ được xem như một người dùng.</p>
            <p>5. Bất kỳ ai đăng nhập bất thường hoặc theo các hình thức gian lận sẽ không nhận được phần thưởng</p>
        </div>

        </>
    )
}