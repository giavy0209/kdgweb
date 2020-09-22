import React, {  useState, useCallback, useMemo } from 'react'
import Wheel from '../Wheel'
import './styles.css'
import '../../assets/css/lucky-spin.scss'
import btcIcon from '../../assets/img/symbal.png'
import { useSelector, useDispatch } from 'react-redux'
import { actChangeLoading, asyncGetUserData } from '../../store/action'
import callapi from '../../axios'
import { checkLanguage } from '../../helpers'
import popupspin from '../../assets/img/popupspin.png'
import { message } from 'antd'
export default function App({ ...prop }) {
    const dispatch = useDispatch()  
    const language = useSelector(state => state.lang)

    const userid = useSelector(state => state.user && state.user._id)

    const [IsRewardToday, setIsRewardToday] = useState(true)
    const [ListMostKDGReward , setListMostKDGReward] = useState([])

    const getTransaction = useCallback(async()=>{
        const res = (await callapi().get(`/api/get_transaction?id=${userid}&skip=0&take=7&type=lucky-spin-daily`)).data 
        
        if(res.data[0]){
            if(res.data[0].create_date){
                var lastd = new Date(res.data[0].create_date)
                var d = new Date()
                if(lastd.getFullYear() < d.getFullYear){
                    setIsRewardToday(false)
                }
                if(lastd.getFullYear() === d.getFullYear()){
                    if(lastd.getMonth() < d.getMonth()){
                        setIsRewardToday(false)
                    }
                    if(lastd.getMonth() === d.getMonth() && lastd.getDate() < d.getDate()){
                        setIsRewardToday(false)
                    }
                }
            }
        }else{  
            setIsRewardToday(false)
        }
    },[userid])

    const getMostKDGReward = useCallback(async ()=>{
        const res = (await callapi().get(`/api/user?skip=${1}&take=${5}&sort=${1}`)).data
        setListMostKDGReward([...res.data])
    },[])

    const handleGetRewardDaily = useCallback(async ()=>{
        dispatch(actChangeLoading(true))
        const res = (await callapi().post('/api/create_transaction' , {from : 'admin' , to: userid, userId : userid, type : 'lucky-spin-daily'})).data
        if(res.status === 1){
            message.success(checkLanguage({vi: 'Chúc mừng bạn nhận được 2 KDG Reward', en: 'You receive 2 KDG Reward'},language))
            getTransaction()
            dispatch(asyncGetUserData())
        }
        if(res.status === 0 ){
            message.error(checkLanguage({vi: 'Bạn đã nhận thưởng hôm nay rồi', en: 'Already got reward'},language))
        }
        
        if(res.status === 101 ){
            message.error(checkLanguage({vi: 'Bạn phải KYC để nhận thưởng', en: 'You have to KYC to get reward'},language))
        }
        setIsRewardToday(true)
        dispatch(actChangeLoading(false))
    },[userid,dispatch])

    useMemo(()=>{
        getTransaction()
        getMostKDGReward()
    },[userid,getTransaction])

    const places = [
        { title: checkLanguage({vi: 'Thêm lượt', en: 'One more turn'}, language), key: 2, orderNum: 2 },
        { title: '1 KDG Reward', key: 1, orderNum: 3 },
        { title: '3 KDG Reward', key: 3, orderNum: 4 },
        { title: '5 KDG Reward', key: 5, orderNum: 5 },
        { title: '25 KDG Reward', key: 25, orderNum: 6 },
        { title: '50 KDG Reward', key: 50, orderNum: 7 },
        { title: '250 KDG Reward', key: 250, orderNum: 0 },
        { title: '500 KDG Reward', key: 500, orderNum: 1 },
    ]

    const [SpinValue, setSpinValue] = useState(null);
    const [RewardValue, setRewardValue] = useState('');

    const user = useSelector(state => state.user)
    const Spin = useCallback(async () => {
        if(user){
            var res = (await callapi().post('/api/get_lucky_spin', { userId: user._id, token: '5f27dfdc81d58518f022b054' })).data
            setSpinValue(res.spin_value);
            var rewardvalue = places.find( o => o.key === res.spin_value)
            setRewardValue(rewardvalue.title)
        }
    }, [user,dispatch])
    return (
        <>
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
                    e.target.parentElement.style.display = 'none'
                }}
                style={{position: 'absolute', top: 5, right: 5, fontSize: 20, width: 25, height: 25, borderRadius: '50%', color: '#fff' , backgroundColor : '#8a8c8e', textAlign : 'center', cursor: 'pointer'}}
                >x</span>
                <img src={popupspin} alt="" />
                <p
                style={{fontSize: 20, color : '#283349', textAlign : 'center',fontWeight: 500}}
                > {checkLanguage({vi: 'Chúc Mừng Bạn!', en: 'Congrats!'},language)} </p>
                <p
                style={{color : '#414042', fontSize: 16 , textAlign: 'center', width: 260, margin: '0 auto', marginTop: 15, marginBottom: 20}}
                > {checkLanguage({vi: `Bạn đã nhận được ${RewardValue} cho lượt quay này`, en: `You got ${RewardValue} for this spin`},language)} </p>
                <p
                onClick={e=>{
                    e.target.parentElement.style.display = 'none'
                }}
                style={{cursor: 'pointer',width: 130, borderRadius: 50, textAlign: 'center', margin: '0 auto' , padding: '10px 0', fontSize: 16, color : '#ffffff', backgroundImage: 'linear-gradient(to bottom , #e9c259 ,#e4cf7c , #aa8411 , #c59700)'}}
                >{checkLanguage({vi: 'Tiếp tục', en: 'Continue'},language)}</p>
            </div>
            <div className="kdg-container">
                <div className="container-wheel">
                    <div className="wheel-left">
                        <div className="button-row">
                            {/* <button className="button">Danh Sách Trúng Thưởng</button> */}
                        </div>
                        <p className="title"> {checkLanguage({vi: 'VÒNG XOAY MAY MẮN', en:'LUCKY SPIN'},language)} </p>
                        <div className="main-content">
                            <div className="text">
                                <div className="sub-title">
                                    
                                    <p>{checkLanguage({vi: 'Quay ngay bây giờ ', en: 'Join now '},language)}</p>
                                    <p>{checkLanguage({vi: 'và chiến thắng!', en: 'and win!'},language)}</p>
                                </div>
                                <p className="total-coin">
                                    <span>
                                        {checkLanguage({vi: 'Số', en: 'Total'},language)} KDG Reward:</span> <span> {user && user.kdg_reward ? user.kdg_reward : 0} 
                                    </span>
                                </p>
                                <div className="fee"> 
                                    <div className="fee-content">
                                        <div className="coin-img">
                                            <img src={btcIcon} alt=""/> 
                                        </div>
                                        <span>{checkLanguage({vi: 'Phí', en: 'Fee'},language)}: </span> 
                                        <span>2 KDG Reward/{checkLanguage({vi: 'lượt', en: 'turn'},language)}</span> 
                                    </div>
                                </div>
                            </div>

                            <div className="wheel-block">
                                <Wheel items={places} keyValue={SpinValue} setSpinValue={setSpinValue} getValue={Spin} />
                            </div>
                        </div>
                    </div>
                    <div className="wheel-right">
                        <div className="sub-title">
                            <p>{checkLanguage({vi: 'CÁC GIẢI THƯỞNG', en: 'WINNER'},language)}</p>
                            <p>{checkLanguage({vi: 'CỦA THÁNG NÀY', en: 'OF THIS MONTH'},language)}</p>
                            <p>{checkLanguage({vi: 'THẮNG GIẢI', en: 'WIN THE PRIZE'},language)}</p>
                        </div>
                        <ul className="list-reward">
                            {
                                ListMostKDGReward.map(user =>
                                    <li>
                                        <span> {user.last_name} {user.first_name} </span>
                                        <span> {user.kdg_reward} KDG Reward</span>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>

                <div className="attendance-container">
                    <div className="attendance-left">
                        <div style={{width: '100%', justifyContent: 'center'}}>
                            <p className="title">{checkLanguage({vi: 'ĐIỂM DANH NHẬN THƯỞNG', en: 'CHECK IN TODAY TO GET KDG REWARD'},language)}</p>
                        </div>
                        <div className="button-row">
                            <div className="receive-btn">
                                <button 
                                onClick={handleGetRewardDaily}
                                style={
                                    IsRewardToday ? {opacity: .5 , pointerEvents :'none'} : {opacity: 1 , pointerEvents :'all'}
                                }
                                className="button">{checkLanguage({vi: 'Nhấn để nhận ngay 2 KDG Reward', en: 'Click here to get 2 KDG Reward'},language)}</button>
                            </div>
                        </div>
                        <div className="main-content">
                            <div  style={{width: '100%'}}>
                                {/* <Timeline items={items}/> */}
                                {/* <div className="timeline">
                                    <div className="timeline-progress" style={{ width: `${progressBarWidth}%`}}></div>
                                    <div className="timeline-items">
                                        {items.map((item, i) => (
                                            <div key={i} className={"timeline-item" + (item.active ? ' active' : '')}>
                                                <div className="timeline-content">
                                                    {item.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        
                    </div>
                    <div className="attendance-right">
                        
                    </div>
                </div>

            </div>
        </>
    )

}