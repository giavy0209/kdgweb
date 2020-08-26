import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { asyncGetUserData, actChangeLoading} from '../../store/action'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import {message} from 'antd'
import '../../assets/css/login-reg.scss'
import { checkLanguage } from '../../helpers'

export default function App({...rest}) {
    const history = useHistory()
    const dispatch = useDispatch()
    useMemo(()=>{
        dispatch(asyncGetUserData())
        .then(res=>{
            if(res === true){
                history.push('/wallet')
            }
        })
    },[])
    
    const language = useSelector(state => state.lang)
    const [check,setcheck] = useState(false)

    async function getCode(email){
        if(email === ''){
            message.error(checkLanguage({vi: 'Bạn cần nhập Email', en: 'Email is empty'}, language))
            return
        }
        dispatch(actChangeLoading(true))
        try {
            console.log(email);

            const res = (await axios.post('http://171.244.18.130:6001/api/create_register_code',{email})).data
            console.log(res);
            if(res.status === 1){
                message.success(checkLanguage({vi: 'Mã code đã được gửi vào email của bạn!', en: 'Code has just sent to your email. Please check!'}, language))
            }else{
    
            }
        } catch (error) {
            console.log(error.response.data);
            if(error.response.data.err === 'email is empty'){
                message.error("Email không được để trống")
            }
        }
        dispatch(actChangeLoading(false))
    }

    const handleReg = async (e) =>{
        e.preventDefault()
        if(check){
            const data = new FormData(e.target)
            const submitData = {}
            for(var pair of data.entries()) {
                submitData[pair[0]] = pair[1]
            }
            dispatch(actChangeLoading(true))
            const res = (await axios.post('http://171.244.18.130:6001/api/register_user',submitData)).data
            dispatch(actChangeLoading(false))
            if(res.status === 1){
                message.success(checkLanguage({vi: "Đăng ký thành công", en: 'Register success'},language))
                setTimeout(() => {
                    history.push('/login')
                }, 1000);
            }else{
                alert(res.msg)
            }
        }
    }


    return (
        <>
        <div className="form-block">
            <div className="left"><img alt="" src="/images/img-login.png"></img></div>
            <div className="right">
                <form onSubmit={handleReg}>
                    <h3>{checkLanguage({vi: "Đăng ký", en: 'Register'},language)}</h3>
                    <span>{checkLanguage({vi: "Đã có tài khoản?", en: 'Had account?'},language)} <span onClick={()=>history.push('/login')}>{checkLanguage({vi: "Đăng nhập", en: 'Log in'},language)}</span></span>
                    <div className="form-group">
                        <p>Email</p>
                        <input name="email" id="email"/>
                    </div>
                    <div className="form-group half">
                        <p>{checkLanguage({vi: "Mật khẩu", en: 'Password'},language)}</p>
                        <input name="password" placeholder={checkLanguage({vi: "Ít nhất 8 ký tự, bao gồm cả chữ và số", en: 'At least 8 digits, include word and number'},language)}/>
                    </div>
                    <div className="form-group half">
                        <p>{checkLanguage({vi: "Xác nhận mật khẩu", en: 'Repeat password'},language)}</p>
                        <input name="repassword" placeholder={checkLanguage({vi: "Ít nhất 8 ký tự, bao gồm cả chữ và số", en: 'At least 8 digits, include word and number'},language)}/>
                    </div>
                    <div className="form-group half">
                        <p>{checkLanguage({vi: "Mã xác minh email", en: 'Sign up code'},language)}</p>
                        <input name="register_code" />
                    </div>
                    <div className="form-group half">
                        <span onClick={()=>{getCode(document.getElementById('email').value)}} className="button">{checkLanguage({vi: "Nhấp để nhận", en: 'Get code'},language)}</span>
                    </div>
                    <div className="form-group">
                        <p>{checkLanguage({vi: "Mã mời (tuỳ chọn)", en: 'Referral code (optional)'},language)}</p>
                        <input name="parent_ref_code" />
                    </div>
                    <div className="form-group checkbox">
                        <input onChange={e=>setcheck(e.target.checked)} id="confirm" type="checkbox" name="confirm"/>
                        <label for="confirm">{checkLanguage({vi: "Tôi đồng ý với ", en: 'I agree with'},language)} <a style={{display: 'inline'}} href="/">{checkLanguage({vi: "Thỏa thuận người dùng | Chính sách bảo mật của KDG", en: 'provisions of User Agreement | Privacy Policy of KDG'},language)}</a></label>
                    </div>
                    <div className="form-group half">
                        <button style={{opacity: check ? 1 : .6 , pointerEvents: check ? 'all' : 'none'}} className="button">{checkLanguage({vi: "Đăng ký", en: 'Register'},language)}</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
    
}