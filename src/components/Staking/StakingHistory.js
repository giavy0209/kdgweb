import React, {useState, useMemo} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { DatePicker } from 'antd';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux';
import nodata from '../../assets/img/nodata.png'
import { checkLanguage } from '../../helpers';
import KDG from '../../assets/img/kdg-icon.png'
import callapi from '../../axios';

const { RangePicker } = DatePicker;
export default function App({...prop}) {
    const history = useHistory();
    const [dates, setDates] = useState([]);
    const disabledDate = current => {
      if (!dates || dates.length === 0) {
        return false;
      }
      const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
      const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
      return tooEarly || tooLate;
    };

    const user = useSelector(state => state.user)


    const [StakingHistory, setStakingHistory] = useState([])

    useMemo(async ()=>{
      if(user){
        const res = (await callapi().get(`/api/get_staking_transaction/${user._id}?skip=0&take=99`)).data
        console.log(res);
        setStakingHistory([...res.data])
      }
    },[user])

    const language = useSelector(state=>state.lang)
    return(
        <>
        <div className="kdg-container" style={{marginTop: 50}}> 
            <div className="kdg-link-back">
              <span 
              style={{cursor: 'pointer'}}
              onClick={(e)=>{
              history.push('/staking')
              }}>
                <FontAwesomeIcon color="#f9c700" icon={faArrowLeft} />  
                {checkLanguage({vi: 'Trở về', en: 'Back'}, language)}
              </span>
            </div> 
                <div className="date-time-picker-container">
                {/* <RangePicker
                disabledDate={disabledDate}
                onCalendarChange={value => {
                setDates(value);
                }}
                style={{backgroundColor: 'rgba(255,255,255, 0)'}}
                
                /> */}
            </div>
        </div>
        <div className="kdg-container account">
        </div>
        <div className="kdg-container">
          <div className="history">
            <table className="stacking-history">
              <thead>
                <tr>
                  <th style={{fontSize: 30, fontWeight:600}} colSpan="9">{checkLanguage({vi: 'LỊCH SỬ STAKING', en: 'MY STAKING RECORD'}, language)}</th>
                </tr>
                <tr>
                  <th>Coin/Token</th>
                  <th>{checkLanguage({vi: 'Thời gian bắt đầu', en: 'Start date'}, language)}</th>
                  <th>{checkLanguage({vi: 'Thời gian mở khoá', en: 'End date'}, language)}</th>
                  <th>{checkLanguage({vi: 'Số tiền staking', en: 'Staking quantity'}, language)}</th>
                  <th>{checkLanguage({vi: 'Tỷ lệ lợi nhuận hàng năm dự kiến', en: 'Estimated annual interest rate'}, language)}</th>
                  {/* <th>Tiến độ</th>
                  <th>Năng suất khóa tại thời điểm này</th>
                  <th>Tình trạng</th>
                  <th>Hoạt động</th> */}
                </tr>
              </thead>
              <tbody>
                {StakingHistory.length > 0? StakingHistory.map(stake =>
                  <tr>
                    <td><img width="30px" src={KDG} alt="" />  KDG</td>                  
                    <td> {new Date(stake.start_date).getDate()}/{new Date(stake.start_date).getMonth()+1}/{new Date(stake.start_date).getFullYear()} </td>
                    <td> <td> {new Date(stake.end_date).getDate()}/{new Date(stake.end_date).getMonth()+1}/{new Date(stake.end_date).getFullYear()} </td> </td>
                    <td> {stake.kdg_coin_send} </td>
                    <td> 30% </td>
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
        </>
    )
    
}