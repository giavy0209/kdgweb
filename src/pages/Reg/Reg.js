import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { asyncGetUserData, actChangeLoading, actChangeUser} from '../../store/action'
import { useHistory, useParams } from 'react-router-dom'
import {message} from 'antd'
import '../../assets/css/login-reg.scss'
import { checkLanguage, validateForm } from '../../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import callapi from '../../axios'
import { ChooseLanguage } from '../../components'

export default function App({...rest}) {
    const {ref} = useParams()
    const [CountDownSendMail, setCountDownSendMail] = useState(null)
    const [CountDownSendMailTimeOut, setCountDownSendMailTimeOut] = useState(null)
    const [ValidForm , setValidForm] = useState({email:false, password: false, repassword: false, register_code: false,})
    const [Eye, setEye] = useState({password: false , repassword: false})
    const history = useHistory()
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const JWT = useSelector(state => state.JWT)
    const language = useSelector(state => state.lang)

    useEffect(()=>{
        document.title = checkLanguage({vi: 'Đăng ký', en: 'Register'}, language)
    },[language])

    const loginURL = useSelector(state => {
        return state.settings && state.settings.login_button.url 
    })

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


    useEffect(()=>{
        if(CountDownSendMail !== null){
            if(CountDownSendMail <= 0) {
                setCountDownSendMail(null)
            }
            if(CountDownSendMail > 0){
                var timeout = setTimeout(() => {
                    setCountDownSendMail(CountDownSendMail - 1)
                }, 1000);
                setCountDownSendMailTimeOut(timeout)
            }
        }
    },[CountDownSendMail])
    
    const [check,setcheck] = useState(false)

    async function getCode(email){
        dispatch(actChangeLoading(true))
        try {
            const res = (await callapi().post('/api/create_register_code',{email})).data
            console.log(res);
            if(res.status === 1){
                setCountDownSendMail(120)
                message.success(checkLanguage({vi: 'Mã code đã được gửi vào email của bạn!', en: 'Code has just sent to your email. Please check!'}, language))
            }else{
                message.error(checkLanguage({vi: 'Email đã tồn tại trong hệ thống hoặc bạn vừa yêu cầu gửi mail, vui lòng chờ 120 giây', en: `Email is already exist or you've just requested, please wait for 120 seconds`}, language))
            }
        } catch (error) {
            console.log(error);
        }
        dispatch(actChangeLoading(false))
    }

    const handleReg = async (e) =>{
        e.preventDefault()
        const data = new FormData(e.target)
        const submitData = {}
        for(var pair of data.entries()) {
            submitData[pair[0]] = pair[1]
        }
        dispatch(actChangeLoading(true))
        const res = (await callapi().post('/api/register_user',submitData)).data
        dispatch(actChangeLoading(false))
        if(res.status === 1){
            message.success(checkLanguage({vi: "Đăng ký thành công", en: 'Register success'},language))
            dispatch(actChangeUser({email: submitData.email}))
            setTimeout(() => {
                history.push(loginURL)
            }, 1000);
        }else{
            if(res.msg === 'register code is wrong'){
                message.error(checkLanguage({vi: "Mã xác minh Email không chính xác", en: 'Incorrect verification code'},language))
            }
        }
    }


    return (
        <>
        <div className="form-block">
            <div className="left"><img alt="" src="/images/img-login.png"></img></div>
            <div className="right">
                <form onSubmit={handleReg}>
                    <ChooseLanguage />
                    <h3>{checkLanguage({vi: "Đăng ký", en: 'Register'},language)}</h3>
                    <span>{checkLanguage({vi: "Đã có tài khoản?", en: 'Already have an account?'},language)} <span onClick={()=>history.push('/login')}>{checkLanguage({vi: "Đăng nhập", en: 'Log in'},language)}</span></span>
                    <div className="form-group">
                        <p>Email</p>
                        <input 
                        onChange={e =>{
                            e.target.value = e.target.value.toLowerCase()
                            setCountDownSendMail(null)
                            clearTimeout(CountDownSendMailTimeOut)
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
                        name="email" id="email"/>
                        <span className="validate-error"></span>
                    </div>
                    <div className="form-group half va-t">
                        <p>{checkLanguage({vi: "Mật khẩu", en: 'Password'},language)}</p>
                        <div className="input-password">
                            <FontAwesomeIcon 
                            onClick={e =>{
                                setEye({...Eye , password: !Eye.password})
                            }}
                            size="1x" color="#000" className="eye" icon={Eye.password ? faEye : faEyeSlash}/>
                            <input 
                            type={Eye.password ? '' : 'password'}
                            onChange={e=>{
                                if(!e.target.value.match(validateForm.password)){
                                    e.target.nextElementSibling.classList.add('show')
                                    e.target.nextElementSibling.innerText = checkLanguage({vi: 'Password phải ít nhất 8 ký tự cả chữ và số',en: 'At least 8 digits, include word and number'},language)
                                    setValidForm({...ValidForm, password: false})
                                }else{
                                    e.target.nextElementSibling.classList.remove('show')
                                    e.target.nextElementSibling.innerText = ''
                                    setValidForm({...ValidForm, password: true})
                                }
                            }}
                            name="password" />
                            <span className="validate-error"></span>
                        </div>
                    </div>
                    <div className="form-group half va-t">
                        <p>{checkLanguage({vi: "Xác nhận mật khẩu", en: 'Repeat password'},language)}</p>
                        <div className="input-password">
                            <FontAwesomeIcon 
                            onClick={() =>{
                                setEye({...Eye , repassword: !Eye.repassword})
                            }}
                            size="1x" color="#000" className="eye" icon={Eye.repassword ? faEye : faEyeSlash}/>
                            <input 
                            type={Eye.repassword ? '' : 'password'}
                            onChange={e=>{
                                if(!e.target.value.match(validateForm.password)){
                                    e.target.nextElementSibling.classList.add('show')
                                    e.target.nextElementSibling.innerText = checkLanguage({vi: 'Password phải ít nhất 8 ký tự cả chữ và số',en: 'At least 8 digits, include word and number'},language)
                                    setValidForm({...ValidForm, repassword: false})
                                }else if(e.target.value !== document.querySelector('input[name="password"]').value){
                                    e.target.nextElementSibling.classList.add('show')
                                    e.target.nextElementSibling.innerText = checkLanguage({vi: 'Password không khớp',en: 'Password not match'},language)
                                    setValidForm({...ValidForm, repassword: false})
                                }else{
                                    e.target.nextElementSibling.classList.remove('show')
                                    e.target.nextElementSibling.innerText = ''
                                    setValidForm({...ValidForm, repassword: true})
                                }
                            }}
                            name="repassword"/>
                            <span className="validate-error"></span>
                        </div>
                    </div>
                    <div className="form-group half">
                        <p>{checkLanguage({vi: "Mã xác minh email", en: 'Sign up code'},language)}</p>
                        <input
                        onChange={e=>{
                            if(!Number(e.target.value) || e.target.value.length !== 6){
                                e.target.nextElementSibling.classList.add('show')
                                e.target.nextElementSibling.innerText = checkLanguage({vi: 'Mã xác minh Email không đúng định dạng',en: 'Sign up code is not valid'},language)
                                setValidForm({...ValidForm, register_code: false})
                            }else{
                                e.target.nextElementSibling.classList.remove('show')
                                e.target.nextElementSibling.innerText = ''
                                setValidForm({...ValidForm, register_code: true})
                            }
                        }}
                        name="register_code" />
                        <span className="validate-error"></span>
                    </div>
                    <div className="form-group half va-b">
                        <span 
                        
                        style={
                            (CountDownSendMail === null && ValidForm.email) ?
                            {
                                opacity: 1 ,
                                pointerEvents:  'all'
                            } : 
                            { 
                                opacity: .5 ,
                                pointerEvents:  'none'
                            }
                        }
                        onClick={()=>{getCode(document.getElementById('email').value)}} 
                        className="button">
                            {checkLanguage({vi: "Nhấp để nhận", en: 'Get code'},language)}
                            <span className="count-down">{CountDownSendMail !== null && CountDownSendMail}</span>
                        </span>
                    </div>
                    <div className="form-group">
                        <p>{checkLanguage({vi: "Mã mời (tuỳ chọn)", en: 'Referral code (optional)'},language)}</p>
                        <input 
                        defaultValue={ref ? ref : ''}
                        name="parent_ref_code" />
                    </div>
                    <div className="form-group checkbox">
                        <input onChange={e=>setcheck(e.target.checked)} id="confirm" type="checkbox" className="checkbox" name="confirm"/>
                        <label className="checkbox-label" htmlFor="confirm">
                            <span className="checkbox-box"></span>
                            {checkLanguage({vi: "Tôi đồng ý với ", en: 'I agree with'},language)} 
                            <a style={{display: 'inline'}} target="_blank" href="/terms-of-service/0">
                                {checkLanguage({vi: " Thỏa thuận người dùng ", en: ' User Agreement '},language)}
                            </a>
                            <a style={{display: 'inline'}} target="_blank" href="/terms-of-service/2">
                                {checkLanguage({vi: "| Chính sách bảo mật của KDG", en: '| Privacy Policy of KDG'},language)}
                            </a>
                        </label>
                    </div>
                    <div className="form-group half">
                        <button 
                        style={
                            (ValidForm.email && ValidForm.password && ValidForm.register_code && ValidForm.repassword && check) ? 
                            {opacity:  1 , pointerEvents:  'all'} :
                            {opacity: .6 , pointerEvents: 'none'} 
                        } 
                        className="button">{checkLanguage({vi: "Đăng ký", en: 'Register'},language)}</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
    
}