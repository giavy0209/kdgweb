import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import Axios from 'axios'
import { asyncGetUserData } from '../../store/action'

export default function App(){
    const userID = useSelector(state => state.user && state.user._id)
    const dispatch = useDispatch()
    const handleSubmitForm = useCallback(async (e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        const submitData = {}
        for(var pair of data.entries()) {
            submitData[pair[0]] = pair[1]
        }
        submitData.id = userID
        if(submitData.newpass ===  submitData.renewpass){
            const res = (await Axios.put(`http://171.244.18.130:6001/api/user`,submitData)).data
            console.log(res);
            dispatch(asyncGetUserData())
            message.success('Cập nhật mật khẩu thành công')
        }else{
            message.error('Nhập lại mật khẩu không chính xác')
        }
        
    },[userID,dispatch])
    return(
        <>
        <h3>THAY ĐỔI MẬT KHẨU</h3>
        <form onSubmit={handleSubmitForm}>
            <div className="input-group">
                <span>Mật khẩu cũ</span>
                <input name="oldpass" type="password" placeholder="Nhập mật khẩu cũ"/>
            </div>
            <div className="input-group">
                <span>Mật khẩu mới</span>
                <input name="newpass" type="password" placeholder="Nhập mật khẩu mới"/>
            </div>
            <div className="input-group">
                <span>Xác nhận mật khẩu mới</span>
                <input name="renewpass" type="password" placeholder="Nhập lại mật khẩu mới"/>
            </div>
            <div className="input-group">
            <button type="submit">Cập nhật</button>
            </div>
        </form>
        </>
    )
}