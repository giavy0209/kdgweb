import React, { useState, useCallback} from 'react'
import kdgIcon from '../../assets/img/kdg-icon.png'
import timeline from '../../assets/img/timeline.png'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { Slider, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'
import '../../assets/css/staking.scss'
import callapi from '../../axios'

var addDate = function(date,days){
  date.setDate(date.getDate() + days);
  return date
}



const css = `

body {
  font-size: 14px;
  font-family: 'Roboto';
  line-height: 1.285;

  color: #fff;
  background-color: #f1f3f4;
  font-weight: 400;
  /* min-height: 2000px; */
  overflow-x: hidden;
  // background-image: url(../images/bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
}
`

export default function App({...prop}) {
const [checked, setchecked] = useState(false);
const [ValueSlider, setValueSlider] = useState();


function formatter(value) {
  setValueSlider(value);
  return `${value}`
}

const user = useSelector(state=>state.user)

const handleStaking = useCallback( async ()=>{
  if(checked){
    const res = (await callapi.post('/api/create_staking',{userId: user._id, kdg_coin: ValueSlider})).data
    console.log(res);
    if(res.status !== 1){
      message.error('Không đủ KDG')
    } 
    if(res.status === 1){
      console.log(res);
    }
  
  }else{
    message.error('Bạn phải đồng ý với cảnh báo rủi ro')
  }
},[user,checked,ValueSlider])


const history = useHistory();
    return(
        <>
          <style>{css}</style>
          <div className="staking-event-body">
            <div className="kdg-container">
              <div className="staking-link-back">
                <span
                style={{
                  cursor:'pointer'
                }}
                onClick={(e)=>{
                e.preventDefault()
                history.push('/staking')
                }}>
                  <FontAwesomeIcon color="#f9c700"  icon={faArrowLeft} />  
                  <span>Trở về</span>
                </span>
                <span className="header-mobile">Tham gia staking</span>
                <img alt="" style={{marginLeft: 80}} src={kdgIcon} width="40" height="40" />
                <span>KDG</span>
                <p>
                  <span className="staking-span-text">30%</span>Lãi suất tham chiếu năm
                </p>
              </div>
            </div>
          </div>
          <div className="kdg-container">
            <div>
              <img alt="" src={timeline} width="100%" height="100%" />
              <div className="kdg-row timeline-container">
                 <div className="kdg-col-4 staking-timeline-title l1 text-l">
                  <h3>Thời gian bắt đầu</h3>
                  <h4> {addDate(new Date(), 2).getDate()}/{addDate(new Date(), 2).getMonth() + 1}/{addDate(new Date(), 2).getFullYear()} </h4>
                 </div>
                 <div className="kdg-col-4 staking-timeline-title l2 text-c">
                 <h3>Thời gian mở khóa</h3>
                 <h4><h4> {addDate(new Date(), 60).getDate()}/{addDate(new Date(), 2).getMonth() + 1}/{addDate(new Date(), 2).getFullYear()} </h4></h4>
                   </div>
                   <div className="kdg-col-4 staking-timeline-title l3 text-r">
                   <h3>Thời gian phân bố gốc và lãi</h3>
                   <h4>{addDate(new Date(), 62).getDate()}/{addDate(new Date(), 62).getMonth() + 1}/{addDate(new Date(), 62).getFullYear()}</h4>
                   </div>
                  
              </div>
            </div>
            <div className="coin-number">
              <h3>Số dư khả dụng: <span> {user && user.kdg_reward ? user.kdg_reward : 0} </span></h3>
            </div>
            <div className="kdg-row">
              <div className="kdg-col-8 number-staking-container va-m">
                <span className="list-number">
                  <h4>
                    1
                  </h4>
                  <h3>
                    Số tiền staking
                  </h3>
                  <input value={ValueSlider} className="dash"></input>
                  <span className="coin">KDG</span>
                </span>
                <div className="kdg-row range">
                    <div className="kdg-col-2 va-m">
                        <p style={{color: 'rgba(0,0,0, 0.5)'}}>200 KDG</p>
                    </div>
                    <div className="kdg-col-8 va-m">
                    <Slider defaultValue={10000} min={1} max={20} tipFormatter={formatter} />
                    </div>
                    <div className="kdg-col-2 va-m">
                      <p style={{color: 'rgba(0,0,0, 0.5)'}}>50,000 KDG</p>
                    </div>
                </div>
                <span className="list-number"><h4>2</h4><span className="percent">Lãi suất tham chiếu <span>30%</span></span></span>
              </div>
              <div className="kdg-col-4 amount-per-year va-m">
                <div className=" number-staking-receive"> 
                  <div className="number-staking-title"> 
                    <h3>Số tiền lãi nhận được</h3>
                    <h3  className="kdg-number">{parseFloat(ValueSlider*0.3).toFixed(2)} KDG</h3>
                  </div>
                </div>
              </div> 
            </div>
            <div className="term-container">
            <FontAwesomeIcon color="#ff0000" icon={faInfoCircle} />
            <span >Vui lòng đọc kỹ quy tắc trước khi tham gia</span>
            <ul>
              <li>(1) Số lượng tham gia Staking tối thiểu là 100 KDG, thời hạn khóa tối thiểu là 60 ngày</li>
              <li>(2) Lãi suất sẽ được tính vào ngày tiếp theo khi bạn tham gia Staking</li>
              <li>(3) Bạn không thể rút, giao dịch hay sử dụng số lượng KDG trong khoảng thời gian tham gia Staking</li>
              <li>(4) Khi thời gian tham gia Staking kết thúc, cả gốc và lãi sẽ được mở khóa vào tài khoản của bạn</li>
            </ul>
            <div className="checkbox-container">
              <label>
                <input
                  onClick={()=>setchecked(!checked)}
                  className="staking-input"
                  type="checkbox"
                  checked={checked}
                />
              </label>
              <span className="title-checkbox">Tôi đã đọc và hiểu rõ <span 
              
              style={{display: 'inline' , cursor: 'pointer', textDecoration:'underline', padding: 0, fontStyle: 'italic'}}>
                cảnh báo rủi ro</span> trước khi tham gia</span>
            </div>
          </div>
          <div className="checkbox-container">
              <button
              style={
                checked ? {opacity: 1, pointerEvents: 'all'} : {opacity : .6 , pointerEvents: "none"}
              }
              onClick={handleStaking}>Tham gia ngay</button>
          </div>
          </div>

        </>
    )
    
}