import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import { checkLanguage, validateForm } from '../../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons'
import Modal from '../Modal'
import callapi from '../../axios'
import { actChangeLoading } from '../../store/action'
import QRCode from 'qrcode'
export default function App(){
    const userID = useSelector(state => state && state.user && state.user._id)
    const userEmail = useSelector(state => state && state.user && state.user.email)
    const language = useSelector(state => state.lang)
    const dispatch = useDispatch()
    const [ValidForm , setValidForm] = useState({newpass: false, renewpass: false,oldpass: true})
    const [Token, setToken] = useState('')
    const [Password, setPassword] = useState('')
    const [Visible, setVisible] = useState(false)
    const [VisibleDisable, setVisibleDisable] = useState(false)
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
        const res = (await callapi().post(`/api/change_password`,{id : userID , old_password : submitData.oldpass , new_password : submitData.newpass})).data
        if(res.status === 1){   
            message.success(checkLanguage({vi: 'Cập nhật mật khẩu thành công', en:'Change password success'},language))
        }
        if(res.status === 100){
            message.error(checkLanguage({vi: 'Mật khẩu cũ không chính xác', en:'Wrong old password'},language))
        }
    },[userID,language])
    useEffect(()=>{
    }, [ValidForm])

    const handleCreate2FA = useCallback(async()=>{
        dispatch(actChangeLoading(true))
        const res = (await callapi().post('/api/create_2fa',{userId: userID})).data
        const img = await QRCode.toDataURL(`otpauth://totp/Kingdomgame:${userEmail}?secret=${res.gaSecret}&issuer=Kingdomgame`)
        
        setSerect2FAQR(img)
        dispatch(actChangeLoading(false))
        setSerect2FA(res.gaSecret)
        setVisible(true)
    },[dispatch,userID,userEmail])

    const handleAdd2FA = useCallback(async()=>{
        dispatch(actChangeLoading(true))
        var res = (await callapi().post('/api/verify_2fa', {userId:userID ,token: Token })).data

        if(res.status === 1){
            message.success(checkLanguage({vi: 'Cài đặt 2FA thành công', en: '2FA activate successfully'}, language))
            dispatch(actChangeLoading(false))
            setVisible(false)
        } else{
            message.error(checkLanguage({vi: 'Cài đặt 2FA không thành công', en: '2FA activate fail'}, language))
            dispatch(actChangeLoading(false))

        }
    },[Token,userID,dispatch,language])

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

    const handleDisable2FA = useCallback(async ()=>{
        dispatch(actChangeLoading(true))
        var res = (await callapi().post('/api/disable_2fa', {userId:userID ,token: Token , password : Password})).data
        if(res.status === 1){
            message.success(checkLanguage({vi: 'Hủy 2FA thành công', en: 'Disable 2FA successfully'}, language))
            dispatch(actChangeLoading(false))
            setVisibleDisable(false)
        } else{
            message.error(checkLanguage({vi: 'Hủy 2FA không thành công', en: 'Disable 2FA fail'}, language))
            dispatch(actChangeLoading(false))

        }
    },[Token,userID, Password,language, dispatch])
    return(
        <>
        <Modal
        isVisible={Visible}
        title={checkLanguage({vi: 'CÀI ĐẶT 2FA', en: '2FA'}, language)}
        onCancel={()=>setVisible(false)}
        >
            <div className='model-deposit'>
                <span> {checkLanguage({vi: 'Scan tại đây', en: 'Scan here'},language)} </span>
                <div className="qr-code">
                    <span></span>
                    <img alt="qr" src={Serect2FAQR}/>
                </div>
                <span>{checkLanguage({vi: 'Sao chép mã tại đây ', en: 'Copy code here'},language)}</span>
                <div onClick={handleCopy} className="deposit-address">
                    <span>{Serect2FA}</span>
                    <FontAwesomeIcon style={{pointerEvents: 'none'}} icon={faCopy}/>
                </div>
                <div className="verify">
                    <input 
                    value={Token}
                    onChange={e=>setToken(e.target.value)}
                    style={{padding: 10, width: 360}}
                    onKeyPress={e=>{
                        if(e.key === 'Enter'){
                            handleAdd2FA()
                        }
                    }}
                    placeholder="Nhập mã 2FA trong app của bạn"/>
                    <button 
                    onClick={handleAdd2FA}
                    className="button-gradiant">
                        {checkLanguage({vi: 'Xác nhận 2FA', en: 'Confirm 2FA'},language)}
                    </button>
                </div>
            </div>
        </Modal>

        <Modal
        isVisible={VisibleDisable}
        title={checkLanguage({vi: 'HỦY 2FA', en: 'DISABLE 2FA'}, language)}
        onCancel={()=>setVisibleDisable(false)}
        >
            <div className='model-deposit'>
                <div style={{margin : 0}} className="verify">
                    <input 
                    value={Token}
                    onChange={e=>setToken(e.target.value)}
                    style={{padding: 10, width: '100%'}}
                    onKeyPress={e=>{
                        if(e.key === 'Enter'){
                            handleDisable2FA()
                        }
                    }}
                    placeholder={checkLanguage({vi: "Nhập mã 2FA trong app của bạn", en: '2FA Code'},language)}/>
                    <input 
                    value={Password}
                    onChange={e=>setPassword(e.target.value)}
                    style={{padding: 10, width: '100%', marginTop: 10}}
                    onKeyPress={e=>{
                        if(e.key === 'Enter'){
                            handleDisable2FA()
                        }
                    }}
                    placeholder={checkLanguage({vi: 'Nhập mật khẩu', en: 'Password'},language)}/>
                    <button 
                    style={{marginTop : 10}}
                    onClick={handleDisable2FA}
                    className="button-gradiant">
                        {checkLanguage({vi: 'Xác nhận hủy 2FA', en: 'Confirm disable 2FA'},language)}
                    </button>
                </div>
            </div>
        </Modal>
        <>
        <h3>{checkLanguage({vi: 'CÀI ĐẶT 2FA', en: '2FA'}, language)}</h3>
        <button 
        onClick={()=>{
            is2FA ? setVisibleDisable(true) : handleCreate2FA()
        }}
        className="button-gradiant">{is2FA ? checkLanguage({vi: 'HỦY 2FA', en: 'DISABLE 2FA'}, language) : checkLanguage({vi: 'CÀI ĐẶT 2FA', en: '2FA'}, language)}</button>
        </>
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