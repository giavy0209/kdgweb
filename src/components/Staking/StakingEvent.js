import React, { useState, useCallback, useEffect} from 'react'
import kdgIcon from '../../assets/img/kdg-icon.png'
import timeline from '../../assets/img/timeline.png'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { Slider, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import '../../assets/css/staking.scss'
import callapi from '../../axios'
import { actChangeLoading } from '../../store/action'
import { checkLanguage } from '../../helpers'
import popupspin from '../../assets/img/popupspin.png'

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
const [ValueSlider, setValueSlider] = useState(10000);
const [Min] = useState(200)
const [Max] = useState(50000)

const dispatch = useDispatch()

const formatter = useCallback((value) => {
  if(value < Min){
    setValueSlider(Min)
    return
  }
  if(value > Max){
    setValueSlider(Max)
    return
  }
  setValueSlider(value);
},[Min, Max])

const user = useSelector(state=>state.user)
const language = useSelector(state=>state.lang)

const balance = useSelector(state=>{
  return state.allBalance
})

const handleStaking = useCallback( async ()=>{
    dispatch(actChangeLoading(true))
    try {
      const res = (await callapi().post('/api/create_staking',{userId: user._id, kdg_coin: ValueSlider})).data
      if(res.status === 1){
        message.success(checkLanguage({vi: 'Staking thành công', en: 'Staking success'},language))
        document.querySelector('.maskspin').style.display = 'block'
        document.querySelector('.popupspin').style.display = 'block'
        setchecked(false)
      }else if(res.statue === 104){
        message.error(checkLanguage({vi: 'Bạn cần ít nhất 0.5 TRX để staking', en: 'You need minimum 0.5 TRX to staking'},language))
      }else if(res.statue === 103){
        message.error(checkLanguage({vi: 'Bạn không đủ KDG', en: `You don't have enough KDG`},language))
      }else if(res.statue === 101){
        message.error(checkLanguage({vi: 'Staking tối thiểu 200KDG', en: `Min KDG staking is 200`},language))
      }else if(res.statue === 102){
        message.error(checkLanguage({vi: 'Staking tối đa 50000KDG', en: `Max KDG staking is 50000`},language))
      }else{
        message.error(checkLanguage({vi: 'Staking không thành công', en: 'Staking fail'},language))
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(actChangeLoading(false))
    
},[user,ValueSlider,language,dispatch])

useEffect(()=>{
  document.getElementById('inputValue').value = ValueSlider

},[ValueSlider])

const history = useHistory();
    return(
        <>
          <style>{css}</style>
          <div className="staking-event-body">
            <div className="kdg-container">
              <div className="staking-link-back">
                <span
                className='back'
                style={{
                  cursor:'pointer'
                }}
                onClick={(e)=>{
                e.preventDefault()
                history.goBack()
                }}>
                  <FontAwesomeIcon className='arrow' color="#f9c700" icon={faArrowLeft} />  
                  <span >{checkLanguage({vi : 'Trở về', en: 'Back'}, language)}</span>
                </span>
                <img alt="" style={{marginLeft: 80}} src={kdgIcon} width="40" height="40" />
                <div className='info'>
                  <p>
                    <span>KDG</span>
                    <span>60 {checkLanguage({vi : 'ngày', en: 'days'}, language)} Staking</span>
                  </p>
                  <p>
                    <span className="staking-span-text">30%</span><span>{checkLanguage({vi : 'Lãi suất tham chiếu năm', en: 'Estimated annual interest'}, language)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="kdg-container">
            <div>
              <img alt="" src={timeline} width="100%" height="100%" />
              <div className="kdg-row timeline-container">
                 <div className="kdg-col-4 staking-timeline-title l1 text-l">
                  <h3>{checkLanguage({vi : 'Thời gian bắt đầu', en: 'Locking start time'}, language)}</h3>
                  <h4> {addDate(new Date(), 2).getDate()}/{addDate(new Date(), 2).getMonth() + 1}/{addDate(new Date(), 2).getFullYear()} </h4>
                 </div>
                 <div className="kdg-col-4 staking-timeline-title l2 text-c">
                 <h3>{checkLanguage({vi : 'Thời gian mở khóa', en: 'Unlocking time'}, language)}</h3>
                 <h4><h4> {addDate(new Date(), 63).getDate()}/{addDate(new Date(), 63).getMonth() + 1}/{addDate(new Date(), 63).getFullYear()} </h4></h4>
                   </div>
                   <div className="kdg-col-4 staking-timeline-title l3 text-r">
                   <h3>{checkLanguage({vi : 'Thời gian phân bố gốc và lãi', en: 'Time to allocate principal and interest'}, language)}</h3>
                   <h4>{addDate(new Date(), 65).getDate()}/{addDate(new Date(), 65).getMonth() + 1}/{addDate(new Date(), 65).getFullYear()}</h4>
                   </div>
                  
              </div>
            </div>
            <div className="coin-number">
              <h3>{checkLanguage({vi : 'Số dư khả dụng', en: 'Available balances'}, language)}: <span>  {balance && balance.kdg_balance} </span></h3>
            </div>
            <div className="kdg-row">
              <div className="kdg-col-8 number-staking-container va-m">
                <span className="list-number">
                  <h4>
                    1
                  </h4>
                  <h3>
                  {checkLanguage({vi : 'Số tiền staking', en: 'Staking quantity'}, language)}
                  </h3>
                  <input id="inputValue" defaultValue={ValueSlider}
                  onChange={e=>{
                    var value = e.target.value !== '' ? Number(e.target.value) : ''
                    if(!isNaN(value)){
                      e.target.value = value
                    }else{
                      e.target.value = ValueSlider
                    }
                  }}
                  onBlur={(e)=>{
                    var value = Number(e.target.value)
                    if(value){
                      if(value < Min) {
                        e.target.value = Min
                        setValueSlider(Min)
                        return
                      }
                      if(value > Max){
                        e.target.value = Max
                        setValueSlider(Max)
                        return
                      }
                      e.target.value = value
                      setValueSlider(value)
                    }else{
                      e.target.value = ValueSlider
                    }
                  }} className="dash"></input>
                  <span className="coin">KDG</span>
                </span>
                <div className="range">
                    <div className="min va-m">
                        <p style={{color: 'rgba(0,0,0, 0.5)'}}>200 KDG</p>
                    </div>
                    <div className="chooserange va-m">
                    <Slider defaultValue={ValueSlider} min={Min} max={Max} value={ValueSlider} onChange={formatter} />
                    </div>
                    <div className="max va-m">
                      <p style={{color: 'rgba(0,0,0, 0.5)'}}>50,000 KDG</p>
                    </div>
                </div>
                <span className="list-number"><h4>2</h4><span className="percent">{checkLanguage({vi : 'Lãi suất tham chiếu', en: 'Estimated annual interest '}, language)} <span>30%</span></span></span>
              </div>
              <div className="kdg-col-4 amount-per-year va-m">
                <div className=" number-staking-receive"> 
                  <div className="number-staking-title"> 
                    <h3>{checkLanguage({vi : 'Tổng số tiền lãi và gốc được nhận', en: 'Total amount of interest and principal received'}, language)}</h3>
                    <h3  className="kdg-number">{ValueSlider + (ValueSlider * 0.3 / 12 * 2)} KDG</h3>
                  </div>
                </div>
              </div> 
            </div>
            <div className="term-container">
            <FontAwesomeIcon color="#ff0000" icon={faInfoCircle} />
            <span >{checkLanguage({vi : 'Vui lòng đọc kỹ quy tắc trước khi tham gia', en: 'Please read the following Staking rules carefully before joining.'}, language)}</span>
            <ul>
              <li>{checkLanguage({vi : '(1) Số lượng tham gia Staking tối thiểu là 200 KDG, thời hạn khóa tối thiểu là 60 ngày', en: '(1) Minimum investment amount is 200KDG, Minimum locked days is 60days.'}, language)}</li>
              <li>{checkLanguage({vi : '(2) Lãi suất sẽ được tính sau 2 ngày kể từ khi bạn tham gia Staking', en: '(2) The yield starts to be counted from the next 2 days after you participate in Staking'}, language)}</li>
              <li>{checkLanguage({vi : '(3) Bạn không thể rút, giao dịch hay sử dụng số lượng KDG trong khoảng thời gian tham gia Staking', en: '(3) Trade, withdrawal and pre-unlocking are unavailable during the locking period'}, language)}</li>
              <li>{checkLanguage({vi : '(4) Khi thời gian tham gia Staking kết thúc, cả gốc và lãi sẽ được mở khóa vào tài khoản của bạn', en: '(4) When the Staking period ends, both principal and interest will be unlocked to your account'}, language)}</li>
            </ul>
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={checked}
                className="checkbox"
              />
              <label
                onClick={()=>setchecked(!checked)}
               className="checkbox-label" 
              >
                <span className="checkbox-box"></span>
                <span className="title-checkbox">{checkLanguage({vi : 'Tôi đã đọc và hiểu rõ', en: 'I have read and understood'}, language)}
                <a 
                href="/terms-of-service/1"
                target="_blank"
                style={{display: 'inline' , cursor: 'pointer', textDecoration:'underline', padding: 0, fontStyle: 'italic', marginLeft: 3}}>
                  {checkLanguage({vi : 'cảnh báo rủi ro', en: 'the risk warning'}, language)}</a> {checkLanguage({vi : 'trước khi tham gia', en: 'before joining'}, language)}</span>
              </label>
            </div>
          </div>
          <div className="checkbox-container">
              <button
              style={
                checked ? {opacity: 1, pointerEvents: 'all'} : {opacity : .6 , pointerEvents: "none"}
              }
              onClick={handleStaking}>{checkLanguage({vi : 'Tham gia ngay', en: 'Join now'}, language)}</button>
          </div>
          </div>

          <div 
            onClick={e =>{
                e.target.style.display = 'none'
                document.querySelector('.popupspin').style.display = 'none'
            }}
            style={{position: 'fixed', top: 0 , left: 0 , width: '100%', height: '100%', display : 'none', backgroundColor: 'rgba(0,0,0,.3)'}} className='maskspin'></div>
            <div
            style={{display: 'none',paddingBottom: 26,width: 360, position: 'fixed', top: '50%' , left: '50%', transform: 'translate(-50% , -50%)', zIndex : 99, backgroundColor : '#fff', borderRadius: 5}}
            className='popupspin'>
                <span
                onClick={e=>{
                  document.querySelector('.maskspin').style.display = 'none'
                  e.target.parentElement.style.display = 'none'
                }}
                style={{position: 'absolute', top: 5, right: 5, fontSize: 20, width: 25, height: 25, borderRadius: '50%', color: '#fff' , backgroundColor : '#8a8c8e', textAlign : 'center', cursor: 'pointer'}}
                >x</span>
                <img src={popupspin} alt="" />
                <p
                style={{fontSize: 20, color : '#283349', textAlign : 'center',fontWeight: 500}}
                > {checkLanguage({vi: 'Staking Thành Công!', en: 'Staking Success!'},language)} </p>
                <p
                style={{color : '#414042', fontSize: 16 , textAlign: 'center', width: 260, margin: '0 auto', marginTop: 15, marginBottom: 20}}
                > {checkLanguage({vi: `Bạn đã đăng ký tham gia Staking KDG thành công`, en: `KDG staking successfully`},language)} </p>
                <p
                onClick={e=>{
                    e.target.parentElement.style.display = 'none'
                }}
                style={{cursor: 'pointer',width: 130, borderRadius: 50, textAlign: 'center', margin: '0 auto' , padding: '10px 0', fontSize: 16, color : '#ffffff', backgroundImage: 'linear-gradient(to bottom , #e9c259 ,#e4cf7c , #aa8411 , #c59700)'}}
                >OK</p>
            </div>

        </>
    )
    
}