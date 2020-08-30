import React, {  useState, useCallback } from 'react'
import Wheel from '../Wheel'
import './styles.css'
import '../../assets/css/lucky-spin.scss'
import btcIcon from '../../assets/img/btc_icon.png'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetUserData } from '../../store/action'
import callapi from '../../axios'

const items = [
    {
        name: 'Ngày 1',
        active: true,
    },
    {
        name: 'Ngày 2'  ,
        active: false,
    },
    {
        name: 'Ngày 3',
        active: true,
    },
    {
        name: 'Ngày 4',
        active: true,
    },
    {
        name: 'Ngày 5',
        active: false,
    },
    {
        name: 'Ngày 6',
        active: true,
    },
    {
        name: 'Ngày 7',
        active: true,
    },
]

const totalItems = items.length;
const numberOfActiveItems = items.filter(item => item.active).length;
const progressBarWidth = totalItems > 1 ? (numberOfActiveItems - 1) / (totalItems - 1) * 100 : 0;
export default function App({ ...prop }) {
    const dispatch = useDispatch()
    

    const places = [
        { title: 'Chúc bạn may mắn lần sau', key: 0, orderNum: 2 },
        { title: '1 KDG Reward', key: 1, orderNum: 3 },
        { title: '2 KDG Reward', key: 2, orderNum: 4 },
        { title: '5 KDG Reward', key: 5, orderNum: 5 },
        { title: '25 KDG Reward', key: 25, orderNum: 6 },
        { title: '50 KDG Reward', key: 50, orderNum: 7 },
        { title: '250 KDG Reward', key: 250, orderNum: 0 },
        { title: '500 KDG Reward', key: 500, orderNum: 1 },
    ]

    const [SpinValue, setSpinValue] = useState(null);

    const user = useSelector(state => state.user)
    const Spin = useCallback(async () => {
        if(user){
            var res = (await callapi.post('/api/get_lucky_spin', { userId: user._id, token: '5f27dfdc81d58518f022b054' })).data
            setSpinValue(res.spin_value);
            setTimeout(() => {
                dispatch(asyncGetUserData())
            }, 4000);
        }
    }, [user,dispatch])

    return (
        
        <>
            <div className="kdg-container">
                <div className="container-wheel">
                    <div className="wheel-left">
                        <div className="button-row">
                            <button className="button">Danh Sách Trúng Thưởng</button>
                        </div>
                        <p className="title">VÒNG XOAY MAY MẮN</p>
                        <div className="main-content">
                            <div className="text">
                                <div className="sub-title">
                                    <p>Quay ngay bây giờ </p>
                                    <p>và chiến thắng!</p>
                                </div>
                                <div className="fee"> 
                                    <div className="fee-content">
                                        <div className="coin-img">
                                            <img src={btcIcon} alt=""/> 
                                        </div>
                                        <span>Phí: </span> 
                                        <span>2 KDG Reward/lượt</span> 
                                    </div>
                                </div>
                                <p className="total-coin"><span>Số KDG Reward:</span> <span> {user && user.kdg_reward ? user.kdg_reward : 0} </span></p>
                            </div>

                            <div className="wheel-block">
                                <Wheel items={places} keyValue={SpinValue} setSpinValue={setSpinValue} getValue={Spin} />
                            </div>
                        </div>
                    </div>
                    <div className="wheel-right">
                        <div className="sub-title">
                            <p>CÁC GIẢI THƯỞNG</p>
                            <p>CỦA THÁNG NÀY</p>
                            <p>THẮNG GIẢI</p>
                        </div>
                        <ul className="list-reward">
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                            <li>
                                <span>1 KDG Reward</span>
                                <span>10</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="attendance-container">
                    <div className="attendance-left">
                        <div style={{width: '100%', justifyContent: 'center'}}>
                            <p className="title">ĐIỂM DANH NHẬN THƯỞNG</p>
                        </div>
                        <div className="button-row">
                            <button className="button">15,300 KDG Reward</button>
                        </div>
                        <div className="main-content">
                            <div style={{justifyContent: 'center', width: '100%'}}>
                                <p className="text">Nhận Thưởng Hôm Nay</p>
                            </div>
                            <div  style={{width: '100%'}}>
                                {/* <Timeline items={items}/> */}
                                <div className="timeline">
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
                                </div>
                            </div>
                        </div>
                        <div className="receive-btn">
                            <button className="button">Nhấn để nhận ngay 2 KDG Reward</button>
                        </div>
                    </div>
                    <div className="attendance-right">
                        
                    </div>
                </div>

            </div>
        </>
    )

}