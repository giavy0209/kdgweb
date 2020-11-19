import { faArrowLeft, faCheck, faExclamationCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../../assets/css/staking.scss'
import { checkLanguage } from '../../helpers'
import KDG from '../../assets/img/kdg-icon.png'
import callapi from '../../axios'
import { message } from 'antd'
import { asyncGetBalance } from '../../store/action'

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

const calcDate = function(type) {
    var find_type = stake.find(o => o.type === type)
    var create_date = new Date()
    var day = create_date.getDate()
    var month = create_date.getMonth() + 1
    var year = create_date.getFullYear()
    var VN_8AM_TIME = new Date(`${year}-${month}-${day}T01:00:00.00Z`)
    var start_date = new Date(`${year}-${month}-${day}T01:00:00.00Z`);
    if(create_date < VN_8AM_TIME){
        start_date.setDate(start_date.getDate() + 1)
    }else{
        start_date.setDate(start_date.getDate() + 2)
    }
    var end_date = new Date(start_date)
    end_date.setDate(end_date.getDate() - 1)
    end_date.setMonth(end_date.getMonth() + find_type.type)


    var unlock_date = new Date(end_date.getTime() + 86400000)
    var confirm_date = new Date(end_date.getTime() + 86400000 * 4) 

    var total_day = (end_date - start_date) / 86400000
    var total_profit = find_type.profit * find_type.type
    var profit_per_day = total_profit/ total_day

    return {
        start_date,end_date,unlock_date , confirm_date,profit_per_day,total_profit
    }
}

const renderDate = function (date){
    var d = new Date(date)
    var day = d.getDate()
    var month = d.getMonth() + 1
    var year = d.getFullYear()

    return `${day}/${month}/${year}`
}

const style = `
body #root{
    background-color: #f1f3f4;
}
`

export default function App() {
    const history = useHistory()
    const language = useSelector(state=>state.lang)
    const [Selected, setSelected] = useState(12)
    const [Value, setValue] = useState(1000)
    const dispatch = useDispatch()
    const balance = useSelector(state=>{
        return state.allBalance
    })

    const [Validate, setValidate] = useState({check : false, min: true})
    
    const handleChangeInput = useCallback((e)=>{
        var value = Number(e.target.value)
        if(value){
            setValue(value)
            if(value >= 200){
                setValidate({...Validate , min : true})
            }else{
                setValidate({...Validate , min : false})
            }
        }
    },[Validate])

    const handleStaking = useCallback(async ()=>{
        var res = (await callapi().post('/api/create_staking_v2', {kdg_coin : Value, type : Selected})).data
        if(res.status === 1){
            message.success(checkLanguage(
                {vi : 'Staking Thành công' , en : 'Staking successfully'},
                language
            ))
            dispatch(asyncGetBalance())
        }else{
            message.error(checkLanguage(
                {vi : 'Staking không thành công, vui lòng thử lại' , en : 'Staking fail, please try again'},
                language
            ))
        }
    },[Value , Selected,language])

  return(
        <>
            <style>{style}</style>
            <div className="kdg-container">
                <div className="stake-join">
                    <div className="block1">
                        <div
                        onClick={()=>history.goBack()}
                        className="back-button">
                            <span className="icon"><FontAwesomeIcon icon={faArrowLeft}/></span>
                            <span className="text"> {checkLanguage({vi : 'Trở về' , en : 'Back'}, language)} </span>
                        </div>
                        <h2 className="title">Staking</h2>
                        <div className="block-top-info">
                            <div className="coin-info">
                                <img src={KDG} alt=""/>
                                <span className="name">KDG</span>
                            </div>
                            <div className="stake-info">
                            {checkLanguage({vi: 'Tỷ lệ lợi nhuận hằng năm tham chiếu lên tới', en: 'Expected annual rate of return up to'}, language)} <span className="percent">48%</span>
                            </div>
                        </div>
                    </div>
                    <div className="block2">
                        <div className="title">{checkLanguage({vi: 'Các Gói Stake', en: 'Lookup Options'}, language)}</div>
                        <p className="sub-title">{checkLanguage({vi: 'Chọn một trong số các gói stake dưới đây:', en: 'Choose one of the Staking packages below'}, language)}</p>

                        <div className="kdg-row kdg-column-4 list-block2">
                            {
                                stake.map( _stake => 
                                    <div className="item">
                                        <div 
                                        onClick={()=>setSelected(_stake.type)}
                                        className={`choose-stake ${Selected === _stake.type ? 'active' : ''}`}>
                                            <span className="checkbox">
                                                <div className="icon">
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </div>
                                            </span>
                                            <span className="des"> {_stake.type} {checkLanguage({vi : 'Tháng', en: 'Months'}, language)} </span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="block3">
                        <div className="kdg-row kdg-column-4">
                            <div className="item">
                                <div className="dot"></div>
                                <div className="des">
                                    <div className="text">
                                        {checkLanguage({vi: 'Thời gian bắt đầu trả lãi', en: 'Starting time'}, language)}
                                    </div>
                                    <div className="date"> {renderDate(calcDate(Selected).start_date)} </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="dot"></div>
                                <div className="des">
                                    <div className="text">
                                        {checkLanguage({vi: 'Thời gian kết thúc trả lãi', en: 'Closing time'}, language)}
                                    </div>
                                    <div className="date"> {renderDate(calcDate(Selected).end_date)} </div>
                                </div>
                            </div>

                            <div className="item">
                                <div className="dot"></div>
                                <div className="des">
                                    <div className="text">
                                        {checkLanguage({vi: 'Thời gian mở khóa', en: 'Unlocking time'}, language)}
                                    </div>
                                    <div className="date"> {renderDate(calcDate(Selected).unlock_date)} </div>
                                </div>
                            </div>

                            <div className="item">
                                <div className="dot"></div>
                                <div className="des">
                                    <div className="text">
                                        {checkLanguage({vi: 'Thời gian xác nhận kết thúc', en: 'Confirmimg time'}, language)}
                                    </div>
                                    <div className="date"> {renderDate(calcDate(Selected).confirm_date)} </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <div className="block4">
                        <div className="title">{checkLanguage({vi: 'Số Lượng Đầu Tư', en: 'Investment Amount'}, language)}</div>
                        <p className="sub-title">{checkLanguage({vi: 'Nhập số lượng bạn muốn đầu tư', en: 'Enter the amount you want to invest'}, language)}</p>
                        <div className="kdg-row group-input-calc">
                            <div className="kdg-col-8">
                                <div className="group-input-info">
                                    <div className="available">
                                        {checkLanguage({vi: 'Số dư khả dụng:', en: 'Available balance'}, language)} {balance && Math.floor(balance.kdg_balance * 1000) / 1000} KDG
                                    </div>
                                    <div className="group-input">
                                        <span className="input">
                                            <span>{checkLanguage({vi: 'Nhập số lượng đầu tư:', en: 'Enter amount to stake'}, language)}</span>
                                            <input
                                            onChange={handleChangeInput}
                                            type="text" value={Value}/>
                                        </span>
                                        <span className="coin-name">KDG</span>
                                    </div>
                                    <div className={`error ${Validate.min ? '' : 'show'}`}>
                                        <span className="error-icon"><FontAwesomeIcon icon={faTimesCircle} /></span> {checkLanguage({vi: 'Số lượng đầu tư tối thiểu là 200 KDG', en: 'Minimum stake is 200 KDG'}, language)}
                                    </div>
                                </div>
                            </div>

                            <div className="kdg-col-4">
                                <div className="calc-group">
                                    <div className="top">
                                        <div className="name">{checkLanguage({vi: 'Lợi nhuận ngày', en: 'Daily interest'}, language)}</div>
                                        <div className="data"> {(calcDate(Selected).profit_per_day * Value).toFixed(2)} KDG</div>
                                    </div>
                                    <div className="bottom">
                                        <div className="name">{checkLanguage({vi: 'Tổng gốc & lãi', en: 'Total principal & interest'}, language)}</div>
                                        <div className="data"> {Value + calcDate(Selected).total_profit * Value} KDG</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block5">
                        <div className="title">{checkLanguage({vi: 'Xác Nhận Thông Tin', en: 'Confirm information'}, language)} <div className="icon"><FontAwesomeIcon icon={faExclamationCircle}/></div> </div>
                        <p className="sub-title">{checkLanguage({vi: 'Vui lòng đọc kỹ quy tắc trước khi tham gia', en: 'Please read the rules carefully before joining'}, language)}</p>
                        <div className="block-content">
                            <div className="group-content">
                                <div className="title-content">
                                    <span className="index">(1)</span> {checkLanguage({vi: 'Stake KDG để nhận lãi: Số lượng stake tối thiểu: 200 KDG', en: 'Stake KDG to receive interest: Minimum amount of Stake is 200KDG'}, language)}
                                </div>
                                <div className="content">
                                    <p>{checkLanguage({vi: '- Có các gói stake như sau:', en: 'There are packages of Stake as follows:'}, language)}</p>
                                    <div className="row-content">
                                        <span className="bold">01 {checkLanguage({vi: 'tháng:', en: 'month'}, language)}</span> {checkLanguage({vi: 'Lãi suất là 1% / tháng', en: 'Interest rate is 1% / month'}, language)}-
                                        <span className="bold">06 {checkLanguage({vi: 'tháng:', en: 'month'}, language)}</span> {checkLanguage({vi: 'Lãi suất là 3% / tháng', en: 'Interest rate is 3% / month'}, language)}
                                    </div>
                                    <div className="row-content">
                                        <span className="bold">03 {checkLanguage({vi: 'tháng:', en: 'month'}, language)}</span> {checkLanguage({vi: 'Lãi suất là 2% / tháng', en: 'Interest rate is 2% / month'}, language)}-
                                        <span className="bold">12 {checkLanguage({vi: 'tháng:', en: 'month'}, language)}</span> {checkLanguage({vi: 'Lãi suất là 4% / tháng', en: 'Interest rate is 4% / month'}, language)}
                                    </div>
                                </div>
                            </div>
                            <div className="group-content">
                                <div className="title-content"><span className="index">(2)</span> {checkLanguage({vi: 'Lãi suất được trả lúc 8:00 hàng ngày (Tối thiểu 24 tiếng cho lần nhận lãi đầu tiên).', en: 'Interest is paid at 8:00 every day (Min 24 hours for the first interest payment)'}, language)}</div>
                            </div>
                            <div className="group-content">
                                <div className="title-content"><span className="index">(3)</span> {checkLanguage({vi: 'Kết thúc thời hạn stake, người dùng có thể rút khoản gốc đã stake trong vòng 05 ngày bằng cách nhấn xác nhận kết thúc stake. Khoản stake không được rút sẽ được tự động gia hạn.', en: 'At the end of the Stake period, users can withdraw the Stake original within 05 days by pressing the button to confirm. Stakes that are not withdrawn will be automatically renewed'}, language)}</div>
                            </div>
                        </div>
                        <div className="input-group checkbox">
                            <input 
                            className="checkbox"
                            onChange={e => setValidate({...Validate, check: e.target.checked})}
                            type="checkbox" name="confirm" id="confirm"/> 
                            <label className="checkbox-label" for="confirm">
                                <span className="checkbox-box"></span> 
                                <span>
                                    {checkLanguage({vi: 'Tôi đã đọc và hiểu rõ', en: 'I have read and understood the risk warning before participating'}, language)} <span className="link">{checkLanguage({vi: 'cảnh báo rủi ro', en: 'the risk warning'}, language)}</span> {checkLanguage({vi: 'trước khi tham gia', en: 'before participating'}, language)}
                                </span>
                            </label>

                            <button 
                            onClick={handleStaking}
                            className={(Validate.check && Validate.min) ? '' : 'disable'}>
                                {checkLanguage({vi: 'Tham gia ngay', en: 'Join now'}, language)}
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}