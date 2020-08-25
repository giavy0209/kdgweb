import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { asyncGetSettings} from '../../store/action'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import {message} from 'antd'
import '../../assets/css/login-reg.scss'

async function getCode(email){
    try {
        const res = (await axios.post('http://171.244.18.130:6001/api/send_email',{toAddress: email,subject: "Register Code",textBody: '123'})).data
        console.log(res);
        if(res){}
        message.success(`Mã code đã được gửi vào email của bạn!`)
    } catch (error) {
        if(error.response.data.err === 'email is empty'){
            message.error("Email không được để trống")
        }
    }
}



export default function App({...rest}) {
    const history = useHistory()
    const dispatch = useDispatch()
    const [check,setcheck] = useState(false)
    useMemo(()=>{
        dispatch(asyncGetSettings())
    },[dispatch])

    const handleReg = async (e) =>{
        e.preventDefault()
        if(check){
            const data = new FormData(e.target)
            const submitData = {}
            for(var pair of data.entries()) {
                submitData[pair[0]] = pair[1]
            }
            const res = (await axios.post('http://171.244.18.130:6001/api/register_user',submitData)).data
            if(res.status === 1){
                message.success(`Đăng ký thành công`)
                setTimeout(() => {
                    history.push('/login')
                }, 1000);
            }else{
                alert(res.msg)
            }
        }else{
            message.error('Bạn phải đồng ý với Thỏa thuận người dùng và Chính sách bảo mật của KDG')
        }
    }


    return (
        <>
        <div className="form-block">
            <div className="left"><img alt="" src="/images/img-login.png"></img></div>
            <div className="right">
                <form onSubmit={handleReg}>
                    <h3>Đăng ký</h3>
                    <span>Đã có tài khoản? <span onClick={()=>history.push('/login')}>Đăng nhập</span></span>
                    <div className="form-group">
                        <p>Email</p>
                        <input name="email" id="email"/>
                    </div>
                    <div className="form-group half">
                        <p>Mật khẩu</p>
                        <input name="password" placeholder="Ít nhất 8 ký tự, bao gồm cả chữ và số"/>
                    </div>
                    <div className="form-group half">
                        <p>Xác nhận mật khẩu</p>
                        <input name="repassword" placeholder="Ít nhất 8 ký tự, bao gồm cả chữ và số"/>
                    </div>
                    <div className="form-group half">
                        <p>Mã xác minh email</p>
                        <input name="register_code" />
                    </div>
                    <div className="form-group half">
                        <span onClick={()=>{getCode(document.getElementById('email').value)}} className="button">Nhấp để nhận</span>
                    </div>
                    <div className="form-group">
                        <p >Mã mời (tùy chọn)</p>
                        <input name="parent_ref_code" />
                    </div>
                    <div className="form-group checkbox">
                        <input onChange={e=>setcheck(e.target.checked)} id="confirm" type="checkbox" name="confirm"/>
                        <label for="confirm">Tôi đồng ý với <a style={{display: 'inline'}} href="/">Thỏa thuận người dùng | Chính sách bảo mật của KDG</a></label>
                    </div>
                    <div className="form-group half">
                        <button className="button">Đăng ký</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
    
}