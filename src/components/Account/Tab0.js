import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { asyncGetUserData } from '../../store/action'
import { message } from 'antd'
export default function App(){
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
        
        const res = (await axios.put(`http://171.244.18.130:6001/api/user`,submitData)).data
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
        <h3>THÔNG TIN CÁ NHÂN</h3>
        <form onSubmit={handleSubmitForm}>
            <div className="input-group haft">
                <span>Họ</span>
                <input defaultValue={(user && user.first_name) ? user.first_name : '' } name="first_name"/>
            </div>
            <div className="input-group haft">
                <span>Tên</span>
                <input defaultValue={(user && user.last_name) ? user.last_name : '' } name="last_name"/>
            </div>
            <div className="input-group">
                <span>Email</span>
                <input defaultValue={(user && user.email) ? user.email : '' } name="email"/>
            </div>
            <div className="input-group">
                <span>Số điện thoại</span>
                <input defaultValue={(user && user.phone) ? user.phone : '' } name="phone"/>
            </div>
            <div className="input-group">
                <span>Giới tính</span>
                <div className="radio-group">
                    <div className="group-label">
                        <input id="gender-m" checked={gioi_tinh === 0} value={0} type="radio" name='gioi_tinh_id' />
                        <label for="gender-m" onClick={()=>setgioi_tinh(0)} ></label>
                        <span>Nam</span>
                    </div>
                    <div className="group-label">
                        <input id="gender-f" checked={gioi_tinh === 1} value={1} type="radio" name='gioi_tinh_id' />
                        <label for="gender-f" onClick={()=>setgioi_tinh(1)} ></label>
                        <span>Nữ</span>
                    </div>
                </div>
            </div>
            <div className="input-group">
                <span>Ngày sinh</span>
                <input  defaultValue={(user && user.birth_day) ? (new Date(user.birth_day)).getDate()   : '' } name="birth_day"/>
            </div>
            <div className="input-group">
                <span>Địa chỉ</span>
                <input defaultValue={(user && user.address) ? user.address : '' } name="address"/>
            </div>
            <div className="input-group">
            <button type="submit">Cập nhật</button>
            </div>
        </form>
        </>
    )
}