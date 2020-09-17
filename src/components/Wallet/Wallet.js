import React, { useEffect, useState } from 'react';
import ListChart from './ListChart'
import ListCoin from './ListCoin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux';
import { InputNumber } from 'antd';
import '../../assets/css/wallet.scss'
import nodata from '../../assets/img/nodata.png'
import { checkLanguage } from '../../helpers';
import { asyncGetHistoryTRX, asyncGetHistoryUSDT } from '../../store/action';

function App() {
  const dispatch = useDispatch()
  const [CurrentHistory, setCurrentHistory] =useState('KDG')
  const [Page, setPage] = useState(1)
  const [History, setHistory] = useState([])
  const language = useSelector(state=>state.lang)
  const ercWallet = useSelector(state=>{
      return state.user && state.user.erc_address
  })
  const trxWallet = useSelector(state=>{
      return state.user && state.user.trx_address
  })

  useEffect(()=>{
    console.log(CurrentHistory);
    setHistory([...[]])
    if(CurrentHistory === 'KDG' || CurrentHistory === 'TRON'){
      if(ercWallet) {
        dispatch(asyncGetHistoryTRX(trxWallet, (Page - 1) * 10, CurrentHistory))
        .then(result=>{
          result = result.slice((Page - 1) * 10,(Page - 1) * 10 + 10)
          setHistory([...result])
        })
      }
    }
    if(CurrentHistory === 'ETH' || CurrentHistory === 'USDT' || CurrentHistory === 'KNC' || CurrentHistory === 'MCH'){
      if(trxWallet) {
        dispatch(asyncGetHistoryUSDT(ercWallet, (Page - 1) * 10, CurrentHistory))
        .then(result=>{
          setHistory([...result])
        })
      }
    }
  },[ercWallet,trxWallet,Page,CurrentHistory])

  return (
    <>
      
      <main>
        <div className="kdg-container">
          <section className="section-prices">
            <h2 className="title"> {checkLanguage({vi : 'Giá thị trường', en: 'MARKET'}, language)}</h2>
            <div className="kdg-row kdg-column-4 list-price">
              <ListChart/>
            </div>
          </section>
          <section className="section-wallet">
            <h2 className="title">{checkLanguage({vi : 'thông tin số dư', en: 'BALANCE INFORMATION'}, language)}</h2>
            <div className="kdg-row kdg-column-2 list-coin">
              <ListCoin/>
            </div>
          </section>

          <section className="section-history">
            <h2 className="title">{checkLanguage({vi : 'LỊCH SỬ GIAO DỊCH', en: 'HISTORY'}, language)}</h2>
            <div className="list-tab">

              <div onClick={()=>{
                setCurrentHistory('KDG')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'KDG' && 'active'}`}>
                <p>KDG</p>
              </div>

              <div onClick={()=>{
                setCurrentHistory('TRON')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'TRON' && 'active'}`}>
                <p>TRX</p>
              </div>

              <div onClick={()=>{
                setCurrentHistory('KNC')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'KNC' && 'active'}`}>
                <p>KNC</p>
              </div>

              <div onClick={()=>{
                setCurrentHistory('MCH')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'MCH' && 'active'}`}>
                <p>MCH</p>
              </div>

              <div onClick={()=>{
                setCurrentHistory('ETH')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'ETH' && 'active'}`}>
                <p>ETH</p>
              </div>

              <div onClick={()=>{
                setCurrentHistory('USDT')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'USDT' && 'active'}`}>
                <p>USDT</p>
              </div>
            </div>

            <div className="history">
              <table>
                <tbody>
                  <tr>
                    <th>{checkLanguage({vi : 'Thời gian', en: 'Date'}, language)}</th>
                    <th>{checkLanguage({vi : 'Số lượng', en: 'Volume'}, language)}</th>
                    <th>Token</th>
                    <th>{checkLanguage({vi : 'Kiểu', en: 'Type'}, language)}</th>
                    <th>Hash(Txid)</th>
                  </tr>

                  {
                    (History && History.length > 0 )?  History.map(({time, type, value , hash},index) =>
                      <tr>
                        <td className="date-time">
                          <span className="date"> {time.getDate()} /{time.getMonth() + 1}/{time.getFullYear()}</span>
                          <span className="time">{time.getHours()}:{time.getMinutes()}:{time.getSeconds()}</span>
                        </td>
                        <td className={`quantity ${type === 0 ? 'red' : 'green'}`} >
                          {value}
                        </td>
                        <td>{CurrentHistory}</td>
                        <td>{type === 0 ? checkLanguage({vi : 'Rút tiền', en: 'Withdraw'}, language) : checkLanguage({vi : 'Nạp tiền', en: 'Deposit'}, language)}</td>
                        <td> {hash} </td>
                      </tr>
                    ): 
                    <tr>
                    <td colSpan="5">
                      <img src={nodata} alt="" /> <br></br>
                      {checkLanguage({vi: 'Không có dữ liệu', en: 'No data'}, language)}
                    </td>
                  </tr>  
                  }

                </tbody>
              </table>

            </div>
            <div className="pagination">
              <span style={{pointerEvents: Page === 1 ? 'none' : 'all'}} onClick={()=>setPage(Page - 1)} className="arrow"><FontAwesomeIcon icon={faAngleLeft}/></span>
                  <InputNumber onPressEnter={e=>{
                    setPage(Number(e.target.value))
                  }} value={Page} style={{width:60}}/>
              <span style={{pointerEvents: History.length < 10 ? 'none' : 'all'}}  onClick={()=>{
                setPage(Page + 1)
                console.log('Page + 1');
              }} className="arrow"><FontAwesomeIcon icon={faAngleRight}/></span>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

export default App;
