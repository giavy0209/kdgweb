import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import { checkLanguage, validateForm } from '../../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons'
import Modal from '../Modal'
import callapi from '../../axios'
import { actChangeLoading, asyncGetUserData } from '../../store/action'
import QRCode from 'qrcode'
export default function App(){
    const userID = useSelector(state => state && state.user && state.user._id)
    const userEmail = useSelector(state => state && state.user && state.user.email)
    const language = useSelector(state => state.lang)
    const dispatch = useDispatch()
    const [ValidForm , setValidForm] = useState({newpass: false, renewpass: false,oldpass: false})
    const [Token, setToken] = useState('')
    const [Visible, setVisible] = useState(false)
    const [Serect2FA, setSerect2FA] = useState('')
    const [Serect2FAQR, setSerect2FAQR] = useState('')
    const [Eye, setEye] = useState({oldpass: false , newpass: false , renewpass :false})
    const handleSubmitForm = useCallback(async (e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        const submitData = {}
        for(var pair of data.entries()) {
            submitData[pair[0]] = pair[1]
        }
        const res = (await callapi.post(`/api/change_password`,{id : userID , old_password : submitData.oldpass , new_password : submitData.newpass})).data
        console.log(res);
        if(res.status === 1){   
            message.success(checkLanguage({vi: 'Cập nhật mật khẩu thành công', en:'Change password success'},language))
        }
        if(res.status === 100){
            message.error(checkLanguage({vi: 'Mật khẩu cũ không chính xác', en:'Wrong old password'},language))
        }
    },[userID,dispatch,language])
    useEffect(()=>{
        console.log(ValidForm);
    }, [ValidForm])

    const handleCreate2FA = useCallback(async()=>{
        dispatch(actChangeLoading(true))
        const res = (await callapi.post('/api/create_2fa',{userId: userID})).data
        const img = await QRCode.toDataURL(`otpauth://totp/Kingdomgame:${userEmail}?secret=${res.gaSecret}&issuer=Kingdomgame`)
        
        setSerect2FAQR(img)
        dispatch(actChangeLoading(false))
        setSerect2FA(res.gaSecret)
        setVisible(true)
    },[])

    const handleAdd2FA = useCallback(async()=>{
        dispatch(actChangeLoading(true))
        var res = (await callapi.post('/api/verify_2fa', {userId:userID ,token: Token })).data

        if(res.status === 1){
            dispatch(asyncGetUserData())
            message.success(checkLanguage({vi: 'Cài đặt 2FA thành công', en: '2FA activate successfully'}, language))
            dispatch(actChangeLoading(false))
            setVisible(false)
        } else{
            message.success(checkLanguage({vi: 'Cài đặt 2FA không thành công', en: '2FA activate fail'}, language))
            dispatch(actChangeLoading(false))

        }
    },[Token,userID])

    const handleCopy = e=>{
        var input = document.createElement('input');
        document.querySelector('body').append(input);
        input.value = e.target.innerText;
        input.select();
        document.execCommand("copy");
        input.remove();
        message.success('Đã copy')
    }

    const is2FA = useSelector(state=> state && state.user && state.user.is2FA)
    return(
        <>
        <Modal
        isVisible={Visible}
        title={checkLanguage({vi: 'CÀI ĐẶT 2FA', en: '2FA'}, language)}
        onCancel={()=>setVisible(false)}
        >
            <div className='model-deposit'>
                <span>Scan tại đây</span>
                <div className="qr-code">
                    <span></span>
                    <img alt="qr" src={Serect2FAQR}/>
                </div>
                <span>Sao chép mã tại đây</span>
                <div onClick={handleCopy} className="deposit-address">
                    <span>{Serect2FA}</span>
                    <FontAwesomeIcon style={{pointerEvents: 'none'}} icon={faCopy}/>
                </div>
                <div className="verify">
                    <input 
                    value={Token}
                    onChange={e=>setToken(e.target.value)}
                    style={{padding: 10, width: 360}}
                    placeholder="Nhập mã 2FA trong app của bạn"/>
                    <button 
                    onClick={handleAdd2FA}
                    className="button-gradiant">
                        Xác nhận 2FA
                    </button>
                </div>
            </div>
        </Modal>
        {!is2FA &&
        <>
        <h3>{checkLanguage({vi: 'CÀI ĐẶT 2FA', en: '2FA'}, language)}</h3>
        <button 
        onClick={handleCreate2FA}
        className="button-gradiant">{checkLanguage({vi: 'CÀI ĐẶT 2FA', en: '2FA'}, language)}</button>
        </>
        }
        <h3>{checkLanguage({vi: 'THAY ĐỔI MẬT KHẨU', en: 'CHANGE PASSWORD'}, language)}</h3>
        <form onSubmit={handleSubmitForm}>
            <div className="input-group">
                <span>{checkLanguage({vi: 'Mật khẩu cũ', en: 'Old Password'}, language)}</span>
                <div className="input-password">
                    <FontAwesomeIcon 
                    onClick={e =>{
                        setEye({...Eye , oldpass: !Eye.oldpass})
                    }}
                    size="1x" color="#fff" className="eye" icon={Eye.oldpass ? faEye : faEyeSlash}/>
                    <input 
                    onChange={e=>{
                        if(!e.target.value.match(validateForm.password)){
                            e.target.nextElementSibling.classList.add('show')
                            e.target.nextElementSibling.innerText = checkLanguage({vi: 'Password phải ít nhất 8 ký tự cả chữ và số',en: 'At least 8 digits, include word and number'},language)
                            setValidForm({...ValidForm, oldpass: false})
                        }else{
                            e.target.nextElementSibling.classList.remove('show')
                            e.target.nextElementSibling.innerText = ''
                            setValidForm({...ValidForm, oldpass: true})
                        }
                    }}
                    type={Eye.oldpass ? '' : 'password'}
                    name="oldpass" placeholder={checkLanguage({vi: 'Nhập mật khẩu cũ', en: 'Enter your old password'}, language)}/>
                    <span className="validate-error"></span>
                </div>
            </div>
            <div className="input-group">
                <span>{checkLanguage({vi: 'Mật khẩu mới', en: 'New password'}, language)}</span>
                <div className="input-password">
                    <FontAwesomeIcon 
                    onClick={e =>{
                        setEye({...Eye , newpass: !Eye.newpass})
                    }}
                    size="1x" color="#fff" className="eye" icon={Eye.newpass ? faEye : faEyeSlash}/>
                    <input 
                    onChange={e=>{
                        if(!e.target.value.match(validateForm.password)){
                            e.target.nextElementSibling.classList.add('show')
                            e.target.nextElementSibling.innerText = checkLanguage({vi: 'Password phải ít nhất 8 ký tự cả chữ và số',en: 'At least 8 digits, include word and number'},language)
                            setValidForm({...ValidForm, newpass: false})
                        }else{
                            e.target.nextElementSibling.classList.remove('show')
                            e.target.nextElementSibling.innerText = ''
                            setValidForm({...ValidForm, newpass: true})
                        }
                    }}
                    type={Eye.newpass ? '' : 'password'}
                    name="newpass" placeholder={checkLanguage({vi: 'Nhập mật khẩu mới', en: 'Enter your new password'}, language)}/>
                    <span className="validate-error"></span>
                </div>
            </div>
            <div className="input-group">
                <span>{checkLanguage({vi: 'Xác nhận mật khẩu mới', en: 'Confirm new password'}, language)}</span>
                <div className="input-password">
                    <FontAwesomeIcon 
                    onClick={e =>{
                        setEye({...Eye , renewpass: !Eye.renewpass})
                    }}
                    size="1x" color="#fff" className="eye" icon={Eye.renewpass ? faEye : faEyeSlash}/>
                    <input 
                    onChange={e=>{
                        if(!e.target.value.match(validateForm.password)){
                            e.target.nextElementSibling.classList.add('show')
                            e.target.nextElementSibling.innerText = checkLanguage({vi: 'Password phải ít nhất 8 ký tự cả chữ và số',en: 'At least 8 digits, include word and number'},language)
                            setValidForm({...ValidForm, renewpass: false})
                        }else if(e.target.value !== document.querySelector('input[name="newpass"]').value){
                            e.target.nextElementSibling.classList.add('show')
                            e.target.nextElementSibling.innerText = checkLanguage({vi: 'Password không khớp',en: 'Password not match'},language)
                            setValidForm({...ValidForm, renewpass: false})
                        }else{
                            e.target.nextElementSibling.classList.remove('show')
                            e.target.nextElementSibling.innerText = ''
                            setValidForm({...ValidForm, renewpass: true})
                        }
                    }}
                    type={Eye.renewpass ? '' : 'password'}
                    name="renewpass" placeholder={checkLanguage({vi: 'Nhập lại mật khẩu mới', en: 'Enter new password'}, language)}/>
                    <span className="validate-error"></span>
                </div>
            </div>
            <div className="input-group">
            <button 
            style={
                (ValidForm.oldpass && ValidForm.newpass && ValidForm.renewpass) ? 
                {
                    opacity: 1,
                    pointerEvents: 'all'
                } :
                {
                    opacity: .5,
                    pointerEvents: 'none'
                }
            }
            type="submit">{checkLanguage({vi: 'CẬP NHẬT', en: 'UPDATE'},language)}</button>
            </div>
        </form>
        </>
    )
}