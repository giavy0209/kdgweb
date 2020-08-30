import React, { useCallback, useEffect, useMemo, useState } from 'react'
import idCard from '../../assets/img/idcard.png'
import flag from '../../assets/img/flag.png'
import frontid from '../../assets/img/frontid.png'
import backid from '../../assets/img/backid.png'
import self from '../../assets/img/self.png'
import {asyncGetListContries, actChangeLoading, asyncGetUserData} from '../../store/action'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { checkLanguage } from '../../helpers'
import { message } from 'antd'
import callapi from '../../axios'
export default function App(){
    const dispatch = useDispatch()
    const listContries = useSelector(state=> state.contries)
    const language = useSelector(state=> state.lang)
    const isKYC = useSelector(state=> state && state.user && state.user.kyc)
    const [SelectedID, setSelectedID] = useState(0)
    const [SelectedContry, setSelectedContry] = useState('VN')
    const [ListContry, setListContry] = useState(null)
    const [ListContrySearch, setListContrySearch] = useState()

    const [ValidateForm , setValidateForm] = useState({name: false, id: false,img1: false, img2: false, img3: false,check: false})

    const email = useSelector(state=>state.user && state.user.email)
    
    useEffect(()=>{
        console.log(ValidateForm);
    },[ValidateForm])

    const idtype=useMemo(()=>{
        return [{value: 0, name:checkLanguage({vi: 'Chứng minh nhân dân/ Bằng lái xe ', en: "Identity Card / Driver's License"}, language)}, {value: 1, name:checkLanguage({vi: 'Hộ chiếu', en: 'Passport'}, language)}]
    },[language])

    useEffect(()=>{
        if(listContries){
            setListContry([...listContries])
        }
    },listContries)

    useEffect(()=>{
        setListContrySearch(findValueContry().name ? findValueContry().name : 'Viet Nam')
    },[SelectedContry])


    const findValueID = useCallback(()=>{
        return idtype.find(o=>SelectedID === o.value).name
    },[SelectedID])

    const findValueContry = useCallback(()=>{
        return listContries ? listContries.find(o=>SelectedContry === o.alpha2Code) : {}
    },[SelectedContry,listContries])

    useEffect(()=>{
        const selectBlock = document.querySelectorAll('.type .selected')
        selectBlock.forEach(el=>{
            el.addEventListener('click',e=>{
                if(Array.from(el.classList).includes('show')) el.classList.remove('show')
                else el.classList.add('show')
            })  
        })
    },[])

    useMemo(()=>{
        dispatch(asyncGetListContries())
    },[dispatch])

    const readURL = useCallback((input)=>{
        input.persist()
        input = input.target
        if (input.files && input.files[0]) {
            if(input.files[0].size > 2000000){
                message.error(checkLanguage({vi: 'Kích thước tệp vượt quá 2MB',en: 'File size exceeds 2MB'},language))
            }else{
                var reader = new FileReader();
                reader.onload = function(e) {
                    var label = input.nextElementSibling
                    label.querySelector('img').setAttribute('src' , e.target.result)
                    label.querySelector('p').style.display = 'none'
                }
                reader.readAsDataURL(input.files[0]); // convert to base64 string
            }
        }
    },[])

    const userId = useSelector(state=>state && state.user && state.user._id)

    const handleSubmitForm = useCallback(async(e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        var submitData = {}
        for(var pair of data.entries()) {
            submitData[pair[0]] = pair[1]
        }
        
        const arrayUpload = []
        const uploadFont = new FormData()
        uploadFont.append('file', submitData.font)
        uploadFont.append('userId' , userId)
        arrayUpload.push(callapi.post('/api/upload_kyc_image', uploadFont))

        const uploadSelf = new FormData()
        uploadSelf.append('file', submitData.self)
        uploadSelf.append('userId' , userId)
        arrayUpload.push(callapi.post('/api/upload_kyc_image', uploadSelf))

        if(SelectedID === 0){
            const uploadBack = new FormData()
            uploadBack.append('file', submitData.back)
            uploadBack.append('userId' , userId)
            arrayUpload.push(callapi.post('/api/upload_kyc_image', uploadBack))
        }
        
        dispatch(actChangeLoading(true))
        try {
            var res = await Promise.all(arrayUpload)
            var isUploadOK = true
            res.forEach(el=>{
                if(el.data.status !== 1) isUploadOK = false
            })

            if(!isUploadOK) {
                message.error(checkLanguage({vi: 'Tải hình lên không thành công, vui lòng thử lại', en: 'Upload images error, please try again'}, language))
                return
            }
            if(isUploadOK === true){
                var kycInfo = {
                    kyc_country : SelectedContry,
                    kyc_number : submitData.id,
                    kyc : '2',
                    id : userId,
                }
                const resUpdate = (await callapi.put(`/api/user`,kycInfo)).data 
                if(resUpdate.status === 1){
                    dispatch(asyncGetUserData(false))
                    dispatch(actChangeLoading(false))
                    message.success(checkLanguage({vi: 'Gửi KYC thành công, bạn vui lòng chờ xét duyệt', en: 'Send KYC info to admin success. Please wait!'},language))
                }else{
                    message.error(checkLanguage({vi: 'Gửi KYC không thành công, vui lòng thử lại', en: 'Send KYC fail, please try again!'},language))
                }
            }
        } catch (error) {
            dispatch(actChangeLoading(false))
            message.error(checkLanguage({vi: 'Tải hình lên không thành công, vui lòng thử lại', en: 'Upload images error, please try again'}, language))
            return
        }
        
    },[SelectedID,SelectedContry,userId])
    return(
        <>
        <form
        onSubmit={handleSubmitForm}
        >
            <div className="input-group haft select">
                <p className='title'>{checkLanguage({vi: 'Loại giấy tờ', en: 'Document type'}, language)}</p>  
                <div className="select-block type">
                    <img alt="" src={idCard} />
                    <div className='selected'>
                        <span><span>{findValueID()}</span> <FontAwesomeIcon icon={faCaretDown}/></span>
                        <div className="dropdown-selected">
                            {
                                idtype.map((el,idx)=>
                                <p 
                                onClick={()=>setSelectedID(idx)}
                                className={SelectedID === idx ? 'selected-value' : ''} key={idx}>{el.name}</p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="input-group haft select">
                <p className='title'>{checkLanguage({vi: 'Quốc gia', en: 'Nation'}, language)}</p>  
                <div className="select-block">
                    <img style={{width: 27}} alt="" src={flag} />
                    <div className='selected'>
                        <span className="contry"> 
                            <img className="flag" alt="" src={listContries && findValueContry().flag}/> 
                            <input 
                            autocomplete="off"
                            id="defaultvalue"
                            onFocus={e=>{
                                setListContrySearch('')
                                e.target.parentElement.parentElement.classList.add('show')
                            }}
                            onBlur={e => {
                                // setListContry([...listContries])
                            }}
                            onChange={e=>{
                                setListContrySearch(e.target.value)
                                var value = e.target.value.toLowerCase()
                                if(value !== '') {
                                    ListContry.length = 0
                                    listContries.forEach((el)=>{
                                        if(el.name.toLowerCase().includes(value)){
                                            ListContry.push(el)
                                        }
                                    })
                                    setListContry([...ListContry])
                                }
                                if(value === ''){
                                    setListContry([...listContries])
                                }
                            }}
                            value={ListContrySearch} />
                            <FontAwesomeIcon icon={faCaretDown}/>
                        </span>
                        <div className="dropdown-selected">
                            {
                                ListContry && ListContry.map((el,idx)=>
                                <p 
                                onClick={(e)=>{
                                    setSelectedContry(el.alpha2Code)
                                    setListContrySearch(findValueContry().name)
                                    console.log(findValueContry().name);
                                    e.target.parentElement.parentElement.classList.remove('show')
                                }}
                                className={SelectedContry === el.alpha2Code ? 'selected-value' : ''} key={idx}>
                                    <img className="flag" alt="" src={el.flag}/>
                                    {el.name}
                                </p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="input-group">
                <span>{checkLanguage({vi: 'Tên', en: 'Name'}, language)}</span>
                <input 
                onChange={e => e.target.value !== '' ? setValidateForm({...ValidateForm, name: true}) : setValidateForm({...ValidateForm, name: false})}
                name="name" placeholder={checkLanguage({vi: 'Tên', en: 'Name'}, language)}/>
            </div>
            <div className="input-group">
                <span> {findValueID()} </span>
                <input 
                 onChange={e => e.target.value !== '' ? setValidateForm({...ValidateForm, id: true}) : setValidateForm({...ValidateForm, id: false})}
                name="id" placeholder={findValueID()}/>
            </div>
            <div className="input-group">
                <span>Email</span>
                <input disabled defaultValue={email} name="email" placeholder="Emai"/>
            </div>
            <ul>
                <li>{checkLanguage({vi: 'Vui lòng sử dụng định dạng JPG, JPEG, PNG. Kích thước tệp tối đa = 2MB', en: 'Please use the format JPG., JPEG., PNG. Maximum file size = 2MB'}, language)}</li>
                <li>{checkLanguage({vi: 'Để đảm bảo quá trình xác minh được thuận tiện, vui lòng không che hoặc làm nhòe ảnh.', en: 'To ensure the verification process most quickly, please do not hide or blur the image'}, language)}</li>
            </ul>
            <div className="upload">
                <div className="text">{SelectedID === 0 ? checkLanguage({vi: '1. Mặt trước CMND/Bằng lái xe', en: `1. ID card / Driver's license front image`}, language) : checkLanguage({vi: '1. Ảnh chụp hộ chiếu', en: 'Passport image'}, language)}</div>
                <input 
                onChange={e=>{
                    readURL(e);
                    (e.target.files && e.target.files[0]) ? setValidateForm({...ValidateForm, img1: true}) : setValidateForm({...ValidateForm, img1: false})
                }}
                type="file" name="font" id="font" style={{display: 'none'}} />
                <label htmlFor="font" className="upload-block">
                    <img alt="" src={frontid} />
                    <p>Nhấn vào đây để tải lên ảnh mặt trước</p>
                </label>
            </div>
            {SelectedID === 0 && <div className="upload">
                <div className="text">{checkLanguage({vi: 'Mặt sau CMND/ Bằng lái xe', en: `2. ID card / Driver's license back image`}, language)}</div>
                <input 
                onChange={e=>{
                    readURL(e);
                    (e.target.files && e.target.files[0]) ? setValidateForm({...ValidateForm, img2: true}) : setValidateForm({...ValidateForm, img2: false})
                }}
                type="file" id="back" name="back" style={{display: 'none'}} />
                <label htmlFor="back" className="upload-block">
                    <img alt="" src={backid} />
                    <p>Nhấn vào đây để tải lên ảnh mặt sau</p>
                </label>
            </div>}
            <div className="upload">
                <div className="text">{SelectedID === 0 ? checkLanguage({vi: '3. Ảnh có mặt của bạn chụp chung với mặt trước CMND/Bằng lái xe và ngày tháng năm hiện tại', en: `3. Your face image with ID/Driver's license at the present time`}, language) : checkLanguage({vi: '2. Ảnh có mặt bạn chụp chung với hộ chiếu và ngày tháng năm hiện tại', en: '2. Your face image with passport at the present time'}, language)}</div>
                <input 
                onChange={e=>{
                    readURL(e);
                    (e.target.files && e.target.files[0]) ? setValidateForm({...ValidateForm, img3: true}) : setValidateForm({...ValidateForm, img3: false})
                }}
                type="file" id="self" name="self" style={{display: 'none'}} />
                <label htmlFor="self" className="upload-block">
                    <img alt="" src={self} />
                    <p>Nhấn vào đây để tải lên</p>
                </label >
            </div>
            <div className="input-group checkbox">
                <input 
                onChange={e =>setValidateForm({...ValidateForm, check: e.target.checked})}
                type="checkbox" name="confirm" id="confirm"/> 
                <label for="confirm"><span></span> <span>{checkLanguage({vi: 'Tôi xác nhận các thông tin trên là đúng sự thật', en: 'I certify that the above information is true'}, language)}</span></label>
            </div>
            
            <div className="input-group">
            <button 
            style={
                (isKYC === '0' || isKYC === '3')?(SelectedID === 0 ? 
                (
                    (ValidateForm.check && ValidateForm.id && ValidateForm.name && ValidateForm.img1 && ValidateForm.img2 && ValidateForm.img3) ?
                    {opacity: 1, pointerEvents: 'all'} : {opacity: .6, pointerEvents: 'none'}
                ) :
                (
                    (ValidateForm.check && ValidateForm.id && ValidateForm.name && ValidateForm.img1 && ValidateForm.img3) ? 
                    {opacity: 1, pointerEvents: 'all'} : {opacity: .6, pointerEvents: 'none'}
                )) : {opacity: .6, pointerEvents: 'none'}
                 
            }
            type="submit">{checkLanguage({vi: 'XÁC NHẬN', en: 'CONFIRM'}, language)}</button>
            </div>
        </form>
        </>
    )
}