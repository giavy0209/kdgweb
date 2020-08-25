import React, {useState, useEffect, useMemo} from 'react'
import {Header, Footer} from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { DatePicker, Table } from 'antd';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetUserData } from '../../store/action';
import nodata from '../../assets/img/nodata.png'

const { RangePicker } = DatePicker;
export default function App({...prop}) {
    const history = useHistory();
    const dispatch = useDispatch()
    const [dates, setDates] = useState([]);
    const disabledDate = current => {
      if (!dates || dates.length === 0) {
        return false;
      }
      const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
      const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
      return tooEarly || tooLate;
    };

    useMemo(()=>{
        dispatch(asyncGetUserData())
        .then(res=>{
            if(res === false){
                history.push('/login')
            }
        })
    },[])


    const user = useSelector(state => state.user)


    const [StakingHistory, setStakingHistory] = useState([])

    useMemo(async ()=>{
      if(user){
        const res = (await axios.get(`http://171.244.18.130:6001/api/get_staking_transaction/${user._id}?skip=1&take=99`)).data
        setStakingHistory([...res.data])
      }
    },[user])

    return(
        <>
        <div className="kdg-container" style={{marginTop: 50}}> 
            <div className="kdg-link-back">
              <a onClick={(e)=>{
              e.preventDefault()
              history.push('/staking')
              }}>
                <FontAwesomeIcon color="#f9c700" icon={faArrowLeft} />  
                Trở về
              </a>
            </div> 
                <div className="date-time-picker-container">
                <RangePicker
                disabledDate={disabledDate}
                onCalendarChange={value => {
                setDates(value);
                }}
                style={{backgroundColor: 'rgba(255,255,255, 0)'}}
                
                />
            </div>
        </div>
        <div className="kdg-container account">
        </div>
        <div className="kdg-container">
          <div className="history">
            <table className="stacking-history">
              <thead>
                <tr>
                  <th style={{fontSize: 30, fontWeight:600}} colSpan="9">Lịch sử staking</th>
                </tr>
                <tr>
                  <th>Coin/Token</th>
                  <th>Thời gian bắt đầu khóa</th>
                  <th>Thời gian mở khóa</th>
                  <th>Số lượng khóa</th>
                  <th>Tỷ lệ lợi nhuận hàng năm dự kiến</th>
                  <th>Tiến độ</th>
                  <th>Năng suất khóa tại thời điểm này</th>
                  <th>Tình trạng</th>
                  <th>Hoạt động</th>
                </tr>
              </thead>
              <tbody>
                {StakingHistory.length > 0? StakingHistory.map(stake =>
                  <tr>
                    <td>KDG</td>                  
                    <td> {new Date(stake.start_date).getDate()}/{new Date(stake.start_date).getMonth()+1}/{new Date(stake.start_date).getFullYear()} </td>
                    <td> <td> {new Date(stake.end_date).getDate()}/{new Date(stake.end_date).getMonth()+1}/{new Date(stake.end_date).getFullYear()} </td> </td>
                    <td> {stake.kdg_coin_send} </td>
                    <td> 30% </td>
                  </tr>
                ):
                  <tr>
                    <td colSpan="9">
                      <img src={nodata} alt="" /> <br></br>
                      Không có dữ liệu
                    </td>
                  </tr>  
                }
              </tbody>
            </table>
          </div>
        </div>
        </>
    )
    
}