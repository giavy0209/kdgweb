import React from 'react'
import defaultAccount from '../../assets/img/default-account.png'
import user from '../../assets/img/user.png'
import userActive from '../../assets/img/user-active.png'
import verified from '../../assets/img/verified.png'
import verifiedActive from '../../assets/img/verified-active.png'
import invite from '../../assets/img/invite.png'
import inviteActive from '../../assets/img/invite-active.png'
import kyc from '../../assets/img/kyc.png'
import kycActive from '../../assets/img/kyc-active.png'
import { useSelector } from 'react-redux'

export default function App({Tab, setTab,...prop}) {
    const username = useSelector(state=>state.user && {first_name: state.user.first_name , last_name:state.user.last_name, email: state.user.email})
    return (<div className="kdg-col-3 va-t">
        <div className="sidebar">
            <div className="top-sidebar">
                <div className="avata">
                    <div className="avata-img img img-1-1">
                        <img alt="" src={defaultAccount}/>
                    </div>
                </div>
                <h3>{ username ? `${username.first_name ? username.first_name : '' } ${username.last_name ? username.last_name : '' }` : username ? username.email : ''}</h3>
            </div>
            <div className="bottom-sidebar">
                <div className="tab">
                    <div onClick={()=>{setTab(0)}} className={`item ${Tab === 0 && 'active'}`}>
                        <img alt="" src={Tab === 0 ? userActive : user}/>
                        <div className="text">
                            <h4>Thông Tin Cá Nhân</h4>
                            <p>Xem và cập nhật thông tin</p>
                        </div>
                    </div>
                    <div onClick={()=>{setTab(1)}} className={`item ${Tab === 1 && 'active'}`}>
                        <img alt="" src={Tab === 1 ? verifiedActive : verified}/>
                        <div className="text">
                            <h4>Bảo Mật Tài Khoản</h4>
                            <p>Các tiện ích bảo mật</p>
                        </div>
                    </div>
                    <div onClick={()=>{setTab(2)}} className={`item ${Tab === 2 && 'active'}`}>
                        <img alt="" src={Tab === 2 ? inviteActive : invite}/>
                        <div className="text">
                            <h4>Referral</h4>
                            <p>Giới thiệu thành viên mới <br></br> Tích điểm thưởng</p>
                        </div>
                    </div>
                    <div onClick={()=>{setTab(3)}} className={`item ${Tab === 3 && 'active'}`}>
                        <img alt="" src={Tab === 3 ? kycActive : kyc}/>
                        <div className="text">
                            <h4>KYC</h4>
                            <p>Xác thực tài khoản</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
    
}