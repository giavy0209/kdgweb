import React from 'react'
import staking from '../../assets/img/staking-img.png'
import stakingDevelop from '../../assets/img/staking-develop.png'
import stakingDevelop1 from '../../assets/img/staking-develop1.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import {useHistory} from 'react-router-dom'
import KDG from '../../assets/img/kdg-icon.png'
import '../../assets/css/staking.scss'
import { checkLanguage } from '../../helpers'
import { useSelector } from 'react-redux'
export default function App({...prop}) {
  const history = useHistory()
  const language = useSelector(state=>state.lang)
  return(
        <>
        <div className="kdg-container account">
            <div className="kdg-row des-staking">
                <div className="kdg-col-6 va-t">
                    <h2 className="kdg-text-gardient">Kingdom Staking</h2>
                    <p className="kdg-text-description">{checkLanguage({vi: 'Mô hình kinh tế chia sẻ trong thế giới số', en: 'Sharing economy model in the digital world'}, language)}</p>

                    <p className="kdg-text-description-content">{checkLanguage({vi: 'Với hệ sinh thái Staking của Kingdom Game, người dùng không chỉ nắm giữ token đơn thuần mà còn được tận hưởng thu nhập thụ động. King Wallet cung cấp dịch vụ Staking cho các loại Game token và nhiều đồng tiền kỹ thuật số khác để hạn chế sự mất giá của token từ lạm phát và tăng lợi tức cho người dùng.', en: 'With the Kingdom Game Staking ecosystem, users not only hold tokens but also receive passive income. King Wallet provides a Staking service for Game Tokens and many other digital currencies to reduce the devaluation of tokens from inflation and increase returns for users.'}, language)}</p>
                    <ul className="kdg-text-description-list">
                        <li className="kdg-text-description-list-item"> <FontAwesomeIcon color="#f9c700" icon={faCheck} /> {checkLanguage({vi: 'Lợi tức cao lên tới 50%/năm', en: 'High income up to 50% per year'}, language)}</li>
                        <li className="kdg-text-description-list-item"> <FontAwesomeIcon color="#f9c700" icon={faCheck} /> {checkLanguage({vi: ' Hỗ trợ Game token, ERC-20 và TRC-20 token', en: 'Support for Game Token, ERC-20 and TRC-20 Token'}, language)}</li>
                        <li className="kdg-text-description-list-item"> <FontAwesomeIcon color="#f9c700" icon={faCheck} /> {checkLanguage({vi: 'Stake KDG nhận thêm token Game khác miễn phí', en: 'Stake KDG in order to receive more free Game Tokens'}, language)}</li>
                    </ul>
                </div>
                <div className="kdg-col-6 va-t">
                    <div  className="kdg-img-description top-up">
                        <img alt="" src={staking} />
                    </div> 
                </div>

            </div>
            <h2 className="kdg-h2-title">{checkLanguage({vi: 'STAKE VÀ NHẬN THU NHẬP THỤ ĐỘNG', en: 'STAKE AND RECEIVE PASSIVE INCOME'}, language)}</h2>
            <div className="kdg-row stake-des">
            <div className="kdg-col-6 va-t">
                <div className="kdg-card"> 
                    <div className="kdg-card-img">
                        <img alt="" src={stakingDevelop1} />
                    </div>
                    
                    <p className="text-card">{checkLanguage({vi: 'Tham gia Stake trên nền tảng King wallet để nhận thêm nhiều đồng coin có giá trị khác', en: 'Join Stake on King wallet platform to receive more valuable coins'}, language)}</p>
                </div>
            </div>
            <div className="kdg-col-6 va-t">
                <div className="kdg-card"> 
                    <div className="kdg-card-img">
                        <img alt="" src={stakingDevelop} />
                    </div>
                    
                    <p className="text-card">{checkLanguage({vi: 'Lãi suất tham chiếu hàng năm lên tới ', en: 'Estimated annual interest rate up to '}, language)} <span className="text-percent">50%</span></p>
                </div>
            </div>
            </div>  
              <div className="kdg-link-history">
                <a href="/" onClick={(e)=>{
                  e.preventDefault()
                  history.push('/staking/history')
                }}>
                  {checkLanguage({vi: 'Lịch sử staking', en: 'Staking history'}, language)}
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
                      <th>{checkLanguage({vi: 'Thời gian khoá tối thiểu', en: 'Minimum locking period'}, language)}</th>
                      <th>{checkLanguage({vi: 'Tỷ lệ lợi nhuận hàng năm dự kiến', en: 'Expected annual rate of return'}, language)}</th>
                      <th>{checkLanguage({vi: 'Hoạt động', en: 'Operation'}, language)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><img width="30px" src={KDG} alt="" /> KDG</td>
                      <td>60 {checkLanguage({vi: 'ngày', en: 'days'}, language)}</td>
                      <td>30%</td>
                      <td><button onClick={()=> history.push('/staking/event')}>{checkLanguage({vi: 'Tham gia ngay ', en: 'Join now'}, language)}</button></td>
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