import React, { useState, useMemo, useCallback} from 'react'
import staking from '../../assets/img/staking-img.png'
import stakingDevelop from '../../assets/img/staking-develop.png'
import stakingDevelop1 from '../../assets/img/staking-develop1.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import {useHistory} from 'react-router-dom'
import KDG from '../../assets/img/kdg-icon.png'
import '../../assets/css/staking.scss'
export default function App({...prop}) {
  const history = useHistory()

  return(
        <>
        <div className="kdg-container account">
            <div className="kdg-row des-staking">
                <div className="kdg-col-6 va-t">
                    <h2 className="kdg-text-gardient">Kingdom Staking</h2>
                    <p className="kdg-text-description">MÔ HÌNH KINH DOANH TRONG THẾ GIỚI SỐ</p>

                    <p className="kdg-text-description-content">Với hệ sinh thái Staking của Kingdom Game, người dùng không chỉ nắm giữ Token đơn thuần mà còn được tận hưởng thu nhập thụ động. King Wallet cung cấp dịch vụ cho các loại game Token và nhiều đồng tiền kỹ thuật số khác để hạn chế sự mất giá của Token từ lạm phát và tăng lợi tức cho người dùng</p>
                    <ul className="kdg-text-description-list">
                        <li className="kdg-text-description-list-item"> <FontAwesomeIcon color="#f9c700" icon={faCheck} /> Lợi tức cao tới 50%/năm</li>
                        <li className="kdg-text-description-list-item"> <FontAwesomeIcon color="#f9c700" icon={faCheck} /> Hỗ trợ game Token, ERC-20 và TRC-20 Token</li>
                        <li className="kdg-text-description-list-item"> <FontAwesomeIcon color="#f9c700" icon={faCheck} /> Stake KDG nhận thêm Token Game khác miễn phí</li>
                    </ul>
                </div>
                <div className="kdg-col-6 va-t">
                    <div  className="kdg-img-description top-up">
                        <img src={staking} />
                    </div> 
                </div>

            </div>
            <h2 className="kdg-h2-title">STAKE VÀ NHẬN THU NHẬP THỤ ĐỘNG</h2>
            <div className="kdg-row stake-des">
            <div className="kdg-col-6 va-t">
                <div className="kdg-card"> 
                    <div className="kdg-card-img">
                        <img src={stakingDevelop1} />
                    </div>
                    
                    <p className="text-card">Tham gia Stake trên nên tảng King wallet để nhận thêm nhiều đồng coin giá trị khác</p>
                </div>
            </div>
            <div className="kdg-col-6 va-t">
                <div className="kdg-card"> 
                    <div className="kdg-card-img">
                        <img src={stakingDevelop} />
                    </div>
                    
                    <p className="text-card">Lãi suất tham chiếu hàng năm lên tới <span className="text-percent">50%</span></p>
                </div>
            </div>
            </div>  
              <div className="kdg-link-history">
                <a onClick={(e)=>{
                  e.preventDefault()
                  history.push('/staking/history')
                }}>
                  Lịch sử Staking
                </a>
              </div>
              <div className="history">
                <table className="stacking-history">
                  <thead>
                    <tr>
                      <th style={{fontSize: 30, fontWeight:600}} colSpan="4">STAKING</th>
                      {/* <th style={{textAlign: 'right'}} colSpan="2"><input  placeholder="Tìm kiếm"/></th> */}
                    </tr>
                    <tr>
                      <th>Coin/Token</th>
                      <th>Thời gian khóa tối thiểu</th>
                      <th>Tỷ lệ lợi nhuận hàng năm dự kiến</th>
                      <th>Hoạt động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><img width="30px" src={KDG} alt="" /> KDG</td>
                      <td>60 ngày</td>
                      <td>30%</td>
                      <td><button onClick={()=> history.push('/staking/event')}>Tham gia ngay</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            <div>
            </div>
        </div>
        </>
    )
    
}