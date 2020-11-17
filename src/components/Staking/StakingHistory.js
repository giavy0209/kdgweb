import React, { useState, useMemo, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { DatePicker, message } from 'antd';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import nodata from '../../assets/img/nodata.png'
import { checkLanguage } from '../../helpers';
import KDG from '../../assets/img/kdg-icon.png'
import callapi from '../../axios';
import { actChangeLoading} from '../../store/action';

const { RangePicker } = DatePicker;

const renderDate = function (date){
    var d = new Date(date)
    var day = d.getDate()
    var month = d.getMonth() + 1
    var year = d.getFullYear()

    return `${day}/${month}/${year}`
}
const stake = [
    {
        type : 1,
        profit: 0.01
    },
    {
        type : 3 ,
        profit : 0.02
    },
    {
        type : 6 ,
        profit : 0.03
    },
    {
        type : 12 ,
        profit : 0.04
    },
]
export default function App({ ...prop }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [StakingHistory, setStakingHistory] = useState([])
    const [StartDate, setStartDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);
    useMemo(async () => {
        console.log(StartDate);
        console.log(EndDate);
        dispatch(actChangeLoading(true))
        const res = (await callapi().get(`/api/staking_v2/?skip=0&take=99&start_date=${StartDate ? StartDate : 0}&end_date=${EndDate ? EndDate : 0}`)).data
        dispatch(actChangeLoading(false))
        if(res.status === 1){
            setStakingHistory([...res.data])
        }
    }, [StartDate , EndDate])

    const handleChangeDatePicker = useCallback((data)=> {
        if(data){
            var start_date = new Date(data[0]._d).getTime()
            var end_date = new Date(data[1]._d).getTime()
            setStartDate(start_date)
            setEndDate(end_date)
        }
    },[])

    const handleDoneStaking = useCallback(async(_id) => {
        var res = (await callapi().post('/api/end_staking' , {staking_id : _id})).data
        if(res.status === 1) {
            message.success(checkLanguage({vi : 'Trả staking thành công' , en : 'Pay staking succeess'}, language))
        }
    },[language])
    const handleContStaking = useCallback(async() => {

    },[])

    const language = useSelector(state => state.lang)
    return (
        <>
            <div className="staking-history">
                <div className="kdg-container">
                    <div className="block1">
                        <div
                        onClick={()=>history.goBack()}
                        className="back-button">
                            <span className="icon"><FontAwesomeIcon icon={faArrowLeft}/></span>
                            <span className="text"> {checkLanguage({vi : 'Trở về' , en : 'Back'}, language)} </span>
                        </div>
                    </div>

                    <div className="date-picker">
                        <RangePicker 
                        placeholder={[
                            checkLanguage({vi : "Ngày bắt đầu", en : 'Start date'} , language),
                            checkLanguage({vi : "Ngày kết thúc", en : 'End date'} , language)
                        ]}
                        onChange={handleChangeDatePicker}
                        />
                    </div>

                    <div className="history">
                        <table>
                            <thead>
                                <tr>
                                    <th className="head-title" colSpan="9">{checkLanguage({vi: 'LỊCH SỬ STAKING', en: 'MY STAKING RECORD'}, language)}</th>
                                </tr>
                                <tr>
                                    <th>Coin/Token</th>
                                    <th>{checkLanguage({vi: 'Ngày tạo staking', en: 'Create date'}, language)}</th>
                                    <th>{checkLanguage({vi: 'Thời gian bắt đầu trả lãi', en: 'Start date'}, language)}</th>
                                    <th>{checkLanguage({vi: 'Thời gian kết thúc trả lãi', en: 'End date'}, language)}</th>
                                    <th>{checkLanguage({vi: 'Thời gian mở khóa', en: 'Unlock date'}, language)}</th>
                                    <th>{checkLanguage({vi: 'Số tiền staking', en: 'Staking quantity'}, language)}</th>
                                    <th>{checkLanguage({vi: 'Tỷ lệ lợi nhuận hàng năm dự kiến', en: 'Estimated annual interest rate'}, language)}</th>
                                    <th>{checkLanguage({vi: 'Lợi nhuận đã nhận', en: 'Profit receive'}, language)}</th>
                                    <th>{checkLanguage({vi: 'Trạng thái', en: 'Status'}, language)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {StakingHistory.length > 0? StakingHistory.map(stake_history =>
                                <tr>
                                    <td><img width="30px" src={KDG} alt="" />  KDG</td>                  
                                    <td> {renderDate(stake_history.create_date)} </td>
                                    <td>{renderDate(stake_history.start_date)} </td>
                                    <td> {renderDate(stake_history.end_date)} </td>
                                    <td> {renderDate(stake_history.unlock_date)} </td>
                                    <td> {stake_history.kdg_coin_send} </td>
                                    <td> {stake.find(o=> o.type === stake_history.type).profit * 100 * 12}% </td>
                                    <td> {stake_history.kdg_coin_receive ? Math.round(stake_history.kdg_coin_receive * 1000)/1000 : 0} KDG</td>
                                    {
                                        stake_history.status === 0 ? 
                                        <td></td>
                                        :
                                        stake_history.status === 1 ? 
                                        <td className='green'>
                                            {checkLanguage({vi : 'Đang nhận lãi' , en : 'Receive profit'} , language)}
                                        </td>
                                        :
                                        stake_history.status === 2 ? 
                                        <td className='yellow'>
                                            <button
                                            onClick={()=>handleDoneStaking(stake_history._id)}
                                            className="done">{checkLanguage({vi : 'Xác nhận' , en : 'Confirm'} , language)}</button>
                                            <button 
                                            onClick={()=>handleContStaking(stake_history._id)}
                                            className="cont">{checkLanguage({vi : 'Gia hạn' , en : 'Extend'} , language)}</button>
                                        </td>
                                        :
                                        <td className='red'>
                                            {checkLanguage({vi : 'Đã kết thúc' , en : 'Done'} , language)}
                                        </td>
                                    }
                                </tr>
                                ):
                                <tr>
                                    <td colSpan="9">
                                    <img src={nodata} alt="" /> <br></br>
                                    {checkLanguage({vi: 'Không có dữ liệu', en: 'No data'}, language)}
                                    </td>
                                </tr>  
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}