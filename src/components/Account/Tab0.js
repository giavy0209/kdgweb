import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetUserData } from '../../store/action'
import { message } from 'antd'
import { checkLanguage } from '../../helpers'
import callapi from '../../axios'
function isValidDate(dateString) {
    var regEx = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var [date, month, year] = dateString.split('/')
    var d = new Date(year, month - 1,0);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return true
}
export default function App(){
    const language = useSelector(state=>state.lang)
    const [gioi_tinh, setgioi_tinh] = useState(0)
    const dispatch = useDispatch()
    const userID = useSelector(state => state.user && state.user._id)
    const handleSubmitForm = useCallback(async (e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        const submitData = {}
        for(var pair of data.entries()) {
            submitData[pair[0]] = pair[1]
        }
        submitData.gioi_tinh_id = Number(submitData.gioi_tinh_id)
        submitData.id = userID

        var [day, month, year] = submitData.birth_day.split('/')

        submitData.birth_day = `${month}/${day}/${year}`
        
        const res = (await callapi().put(`/api/user`,submitData)).data
        if(res){}
        dispatch(asyncGetUserData())
        message.success('Cập nhật thông tin thành công')
    },[userID,dispatch])
    const user = useSelector(state=> state.user)
    useEffect(()=>{
        user && setgioi_tinh(user.gioi_tinh_id)
    },[user])
    return(
        <>
        <h3>{checkLanguage({vi: 'THÔNG TIN CÁ NHÂN', en: 'ACCOUNT'}, language)}</h3>
        <form onSubmit={handleSubmitForm}>
            <div className="input-group haft">
                <span>{checkLanguage({vi: 'Họ', en: 'Surname'}, language)}</span>
                <input defaultValue={(user && user.first_name) ? user.first_name : '' } name="first_name"/>
            </div>
            <div className="input-group haft">
                <span>{checkLanguage({vi: 'Tên', en: 'Last Name'}, language)}</span>
                <input defaultValue={(user && user.last_name) ? user.last_name : '' } name="last_name"/>
            </div>
            <div className="input-group">
                <span>Email</span>
                <input defaultValue={(user && user.email) ? user.email : '' } name="email"/>
            </div>
            <div className="input-group">
                <span>{checkLanguage({vi: 'Số điện thoại', en: 'Phone Number'}, language)}</span>
                <input defaultValue={(user && user.phone) ? user.phone : '' } name="phone"/>
            </div>
            <div className="input-group">
                <span>{checkLanguage({vi: 'Giới tính', en: 'Gender'}, language)}</span>
                <div className="radio-group">
                    <div className="group-label">
                        <input id="gender-m" checked={gioi_tinh === 0} value={0} type="radio" name='gioi_tinh_id' />
                        <label for="gender-m" onClick={()=>setgioi_tinh(0)} ></label>
                        <span>{checkLanguage({vi: 'Nam', en: 'Male'}, language)}</span>
                    </div>
                    <div className="group-label">
                        <input id="gender-f" checked={gioi_tinh === 1} value={1} type="radio" name='gioi_tinh_id' />
                        <label for="gender-f" onClick={()=>setgioi_tinh(1)} ></label>
                        <span>{checkLanguage({vi: 'Nữ', en: 'Female'}, language)}</span>
                    </div>
                </div>
            </div>
            <div className="input-group">
                <span>{checkLanguage({vi: 'Ngày sinh', en: 'Date of Birth'}, language)}</span>
                <div className="input-password">
                    <input 
                    onChange={e=>{
                        var value = e.target.value
                        if(!isValidDate(value)){
                            e.target.nextElementSibling.classList.add('show')
                            e.target.nextElementSibling.innerText = checkLanguage({vi: 'Ngày sinh phải đúng định dạng DD/MM/YYYY',en: 'Date is invalid'},language)
                        }else{
                            e.target.nextElementSibling.classList.remove('show')
                            e.target.nextElementSibling.innerText = ''
                        }
                    }}
                    placeholder="DD/MM/YYYY" 
                    defaultValue={
                        (user && user.birth_day) ? 
                        `${new Date(user.birth_day).getDate()}/${new Date(user.birth_day).getMonth() + 1}/${new Date(user.birth_day).getFullYear()}`   
                        : '' 

                    }
                    name="birth_day"/>
                    <span className="validate-error"></span>
                </div>
            </div>
            <div className="input-group">
                <span>{checkLanguage({vi: 'Địa chỉ', en: 'Address'}, language)}</span>
                <input defaultValue={(user && user.address) ? user.address : '' } name="address"/>
            </div>
            <div className="input-group">
            <button type="submit">{checkLanguage({vi: 'Cập nhật', en: 'Update'}, language)}</button>
            </div>
        </form>
        </>
    )
}