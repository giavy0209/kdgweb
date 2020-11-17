import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { asyncGetUserData,asyncLogin, actChangeLoading} from '../../store/action'
import { useHistory } from 'react-router-dom'
import {message} from 'antd'
import '../../assets/css/login-reg.scss'
import { checkLanguage, validateForm } from '../../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { ChooseLanguage } from '../../components'
export default function App({...rest}) {
    const history = useHistory()
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const JWT = useSelector(state => state.JWT)
    const language = useSelector(state => state.lang)

    const [ValidForm , setValidForm] = useState({email:false, password: true})
    const [Eye, setEye] = useState({password: false})

    useEffect(()=>{
        document.title = checkLanguage({vi: 'Đăng nhập', en: 'Login'}, language)
    },[language])

    useMemo(()=>{
        dispatch(actChangeLoading(true))
        if(token && JWT) {
            dispatch(asyncGetUserData(token))
            .then(res=>{
                dispatch(actChangeLoading(false))
                if(res !== false){
                    history.push('/home-wallet')
                }
            })
        }
        dispatch(actChangeLoading(false))

    },[dispatch,history,token,JWT])

    const email = useSelector(state => state.user && state.user.email)
    useEffect(()=>{
        if(email) setValidForm({...ValidForm , email :true})
    },[email])
    const handleLogin = useCallback( async(e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        const submitData = {}
        for(var pair of data.entries()) {
            submitData[pair[0]] = pair[1]
        }
        dispatch(asyncLogin(submitData))
        .then(res=>{
            console.log(res);
            if(res.ok){
                history.push('/home-wallet')
            }else{
                if(res.res.data.status === 103){
                    message.error(checkLanguage({vi: 'Email không tồn tại', en: 'Email is not exist'},language))
                }else if(res.res.data.status === 104){
                    message.error(checkLanguage({vi: 'Sai mật khẩu', en: 'Wrong password'},language))
                }
            }
        })
        .catch(res=>{
        })
    },[dispatch,history])
    return (
        <>
        <div className="form-block">
            <div className="left"><img alt="" src="/images/img-login2.png"></img></div>
            <div className="right">
                <form onSubmit={handleLogin}>
                    <ChooseLanguage />
                    <h3>{checkLanguage({vi: 'ĐĂNG NHẬP', en: 'LOG IN'}, language)}</h3>
                    <span>{checkLanguage({vi: 'Bạn chưa có tài khoản?', en: 'Have not account yet?'}, language)} <span onClick={()=>history.push('/reg')}>{checkLanguage({vi: 'Đăng ký', en: 'Register now'}, language)}</span></span>
                    <div className="form-group">
                        <p>Email</p>
                        <input 
                        onChange={e =>{
                            e.target.value = e.target.value.toLowerCase()
                            if(!e.target.value.match(validateForm.email)){
                                e.target.nextElementSibling.classList.add('show')
                                e.target.nextElementSibling.innerText = checkLanguage({vi: 'Email không đúng định dạng',en: 'Email is not valid'},language)
                                setValidForm({...ValidForm, email: false})
                            }else{
                                e.target.nextElementSibling.classList.remove('show')
                                e.target.nextElementSibling.innerText = ''
                                setValidForm({...ValidForm, email: true})
                            }
                        }}
                        defaultValue={email}
                        name="email" id="email"/>
                        <span className="validate-error"></span>
                    </div>
                    <div className="form-group">
                        <p>{checkLanguage({vi: 'Mật khẩu', en: 'Password'}, language)}</p>
                        <div className="input-password">
                            <FontAwesomeIcon 
                            onClick={e =>{
                                setEye({...Eye , password: !Eye.password})
                            }}
                            size="1x" color="#000" className="eye" icon={Eye.password ? faEye : faEyeSlash}/>
                            <input 
                            type={Eye.password ? '' : 'password'}
                            // onChange={e=>{
                            //     if(!e.target.value.match(validateForm.password)){
                            //         e.target.nextElementSibling.classList.add('show')
                            //         e.target.nextElementSibling.innerText = checkLanguage({vi: 'Password phải ít nhất 8 ký tự cả chữ và số',en: 'At least 8 digits, include word and number'},language)
                            //         setValidForm({...ValidForm, password: false})
                            //     }else{
                            //         e.target.nextElementSibling.classList.remove('show')
                            //         e.target.nextElementSibling.innerText = ''
                            //         setValidForm({...ValidForm, password: true})
                            //     }
                            // }}
                            placeholder={ checkLanguage({vi: 'Mật khẩu phải ít nhất 8 ký tự cả chữ và số',en: 'At least 8 digits, include word and number'},language)}
                            name="password" />
                            <span className="validate-error"></span>
                        </div>
                    </div>
                    <div className="form-group half">
                        <button 
                        style={
                            (ValidForm.email && ValidForm.password) ? 
                            {opacity:  1 , pointerEvents:  'all'} :
                            {opacity: .6 , pointerEvents: 'none'} 
                        } 
                        className="button">{checkLanguage({vi: 'Đăng nhập', en: 'Log in'}, language)}</button>
                    </div>
                    <div>
                        <span style={{fontSize: 14, cursor: 'pointer', color: "#fac800", paddingLeft: 8}} onClick={()=>history.push('/forgot-password')}>{checkLanguage({vi: 'Quên mật khẩu', en: 'Forgot password?'}, language)}</span>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}