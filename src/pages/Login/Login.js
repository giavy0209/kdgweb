import React, { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { asyncGetUserData,asyncLogin, actChangeLoading} from '../../store/action'
import { useHistory } from 'react-router-dom'
import {message} from 'antd'
import '../../assets/css/login-reg.scss'
export default function App({...rest}) {
    const history = useHistory()
    const dispatch = useDispatch()
    useMemo(()=>{
        dispatch(actChangeLoading(true))
        dispatch(asyncGetUserData())
        .then(res=>{
            dispatch(actChangeLoading(false))
            if(res === !false){
                history.push('/kdg-wallet')
            }
        })
    },[dispatch,history])

    const email = useSelector(state => state.user && state.user.email)

    const handleLogin = useCallback( async(e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        const submitData = {}
        for(var pair of data.entries()) {
            submitData[pair[0]] = pair[1]
        }
        dispatch(asyncLogin(submitData))
        .then(res=>{
            if(res.ok){
                history.push('/account')
            }else{
                message.error('Sai email nhập hoặc mật khẩu')
            }
        })
        .catch(res=>{
            console.log(res);
        })
    },[dispatch,history])



    return (
        <>
        <div className="form-block">
            <div className="left"><img alt="" src="/images/img-login2.png"></img></div>
            <div className="right">
                <form onSubmit={handleLogin}>
                    <h3>Đăng nhập</h3>
                    <span>Bạn chưa có tài khoản? <span onClick={()=>history.push('/reg')}>Đăng ký</span></span>
                    <div className="form-group">
                        <p>Email</p>
                        <input 
                        defaultValue = {email ? email : ''}
                        name="email"/>
                    </div>
                    <div className="form-group">
                        <p>Mật khẩu</p>
                        <input placeholder="Ít nhất 8 ký tự, bao gồm cả chữ và số" name="password"/>
                    </div>
                    <div className="form-group half">
                        <button className="button">Đăng nhập</button>
                    </div>
                    <div>
                        <span onClick={()=>history.push('/forgot-password')}>Quên mật khẩu</span>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
    
}