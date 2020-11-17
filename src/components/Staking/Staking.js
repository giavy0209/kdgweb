import React, { useCallback, useState } from 'react'
import block1Icon from '../../assets/img/stake/block1-icon.png'
import { checkLanguage } from '../../helpers'
import { useSelector } from 'react-redux'
import {useHistory} from 'react-router-dom'
import KDG from '../../assets/img/kdg-icon.png'
import ETH from '../../assets/img/ETH.png'
import USDT from '../../assets/img/USDT.png'
import TRX from '../../assets/img/TRX.png'
import TOMO from '../../assets/img/TOMO.png'
import KNC from '../../assets/img/KNC.png'
import MCH from '../../assets/img/MCH.png'
import '../../assets/css/staking.scss'
import { useEffect } from 'react'
import callapi from '../../axios'

const LIST_COIN = [
  {
    name : 'KDG',
    icon : KDG,
    min_lock : 30,
    profit : 48,
    can_join : true
  },
  {
    name : 'ETH',
    icon : ETH,
    min_lock : 30,
    profit : 48,
    can_join : false
  },
  {
    name : 'USDT',
    icon : USDT,
    min_lock : 30,
    profit : 48,
    can_join : false
  },
  {
    name : 'TRX',
    icon : TRX,
    min_lock : 30,
    profit : 48,
    can_join : false
  },
  {
    name : 'TOMO',
    icon : TOMO,
    min_lock : 30,
    profit : 48,
    can_join : false
  },
  {
    name : 'KNC',
    icon : KNC,
    min_lock : 30,
    profit : 48,
    can_join : false
  },
  {
    name : 'MCH',
    icon : MCH,
    min_lock : 30,
    profit : 48,
    can_join : false
  },
]

const handleBlock1Loaded = function () {
  var listBlock1 = document.querySelectorAll('.item-block1')
  var heightest = listBlock1[0].offsetHeight
  listBlock1.forEach(el => {
    if(el.offsetHeight > heightest) heightest = el.offsetHeight
  },[])
  listBlock1.forEach(el => {
    el.style.height = heightest + 'px'
  })
}

export default function App({...prop}) {
  const history = useHistory()
  const language = useSelector(state=>state.lang)

  const [Sum , setSum]  =useState(0)
  const [Profit, setProfit] = useState(0);
  
  const Level = useSelector(state => state && state.user && state.user.staking_level)

  const getStakingInfo = useCallback(async () => {
    const res = (await callapi().get('/api/user_staking_info')).data
    const stakingInfo = res.data
    setProfit(stakingInfo.totalProfit)
    setSum(stakingInfo.totalStake)
    console.log(stakingInfo);
  },[])

  useEffect(()=>{
    getStakingInfo()
  },[])


  return(
    <>
      <div className="stake">
        <div className="banner">
          <div className="content">
            <div className="text1">GIỚI THIỆU BẠN BÈ</div>
            <div className="text2">NHẬN NGAY ƯU ĐÃI</div>
            <div onClick={()=>history.push('/staking/share')} className="text3">Chia Sẻ Ngay</div>
          </div>
        </div>
      </div>
      <div className="kdg-container stake">
        <div className="block1">
          <div className="block-title">
            <h2 className="title">Kingdom Staking</h2>
            <p>mô hình kinh tế chia sẻ trong thế giới số</p>
          </div>
          <div className="des">
            Với hệ sinh thái Staking của Kingdom Game, người dùng không chỉ nắm giữ Token đơn thuần mà còn được tận hưởng thu nhập thụ động. King Wallet cung cấp dịch vụ Staking cho các loại Game Token và nhiều đồng tiền kỹ thuật số khác để hạn chế sự mất giá của Token từ lạm phát và tăng lợi tức cho người dùng.
          </div>
          <div className="kdg-row kdg-column-3 list-block1">
            <div className="item">
              <div onLoad={handleBlock1Loaded} className="item-block1">
                <img src={block1Icon} alt=""/>
                <p>Lợi tức cao lên tới <br/> 48%/năm</p>
              </div>
            </div>
              <div className="item">
                <div className="item-block1">
                  <img src={block1Icon} alt=""/>
                  <p>Hỗ trợ Game Token, ERC-20 <br/> và TRC-20 Token</p>
                </div>
              </div>
              <div className="item">
                <div className="item-block1">
                  <img src={block1Icon} alt=""/>
                  <p>Stake KDG nhận thêm <br/> Token Game khác miễn phí</p>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="stake">
        <div className="block2">
          <div className="kdg-container">
            <div className="kdg-row kdg-column-3 list-block2">
              <div className="item">
                <div className="block2-item">
                  <div className="outside-block">
                    <div className="inside-block">
                      <div className="number"> {Sum} </div>
                      <span className="name">KDG</span>
                    </div>
                  </div>
                  <div className="block-name">Tổng Stake</div>
                </div>
              </div>
              <div className="item">
                <div className="block2-item">
                  <div className="outside-block">
                    <div className="inside-block">
                      <div className="number"> {Profit} </div>
                      <span className="name">KDG</span>
                    </div>
                  </div>
                  <div className="block-name">Lợi Nhuận</div>
                </div>
              </div>
              <div className="item">
                <div className="block2-item">
                  <div className="outside-block">
                    <div className="inside-block">
                      <div className="number"> {Level ? Level : 0} </div>
                    </div>
                  </div>
                  <div className="block-name">Cấp độ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="kdg-container stake">
        <div className="history">
          <div className="link">
            <span onClick={(e)=>{
              history.push('/staking/history')
            }}>
              {checkLanguage({vi: 'Lịch sử staking', en: 'Staking history'}, language)}
            </span>
          </div>
          <table className="stacking-history">
            <thead>
              <tr>
                <th className="head-title" colSpan="4">STAKING</th>
              </tr>
              <tr>
                <th>Coin/Token</th>
                <th>{checkLanguage({vi: 'Thời gian khoá tối thiểu', en: 'Minimum locking period'}, language)}</th>
                <th>{checkLanguage({vi: 'Tỷ lệ lợi nhuận hàng năm dự kiến', en: 'Expected annual rate of return'}, language)}</th>
                <th>{checkLanguage({vi: 'Hoạt động', en: 'Operation'}, language)}</th>
              </tr>
            </thead>
            <tbody>
              {
                LIST_COIN.map(coin =><tr>
                  <td><img width="30px" src={coin.icon} alt="" /> {coin.name} </td>
                  <td> {coin.min_lock} {checkLanguage({vi: 'ngày', en: 'days'}, language)}</td>
                  <td>{coin.profit}%</td>
                  <td>
                    <button className={`enable ${coin.can_join ? 'enable' : 'disable'}`} onClick={()=> history.push('/staking/event')}>{checkLanguage({vi: 'Tham gia ngay ', en: 'Join now'}, language)}</button>
                  </td>
                </tr> )
              }
              
            </tbody>
          </table>
        </div>

      </div>
    </>
    )
    
}