import React, { useCallback, useEffect, useState } from 'react';
import ListChart from './ListChart'
import ListCoin from './ListCoin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux';
import { InputNumber } from 'antd';
import '../../assets/css/wallet.scss'
import nodata from '../../assets/img/nodata.png'
import { checkLanguage } from '../../helpers';
import { asyncGetHistoryTRX, asyncGetHistoryUSDT, asyncGetHistoryTOMO, asyncGetHistoryBTC, asyncGetTransactions, asyncGetBalance } from '../../store/action';



function App() {
  const dispatch = useDispatch()
  const [CurrentHistory, setCurrentHistory] =useState('KDG')
  const [Page, setPage] = useState(1)
  const [History, setHistory] = useState([])
  const language = useSelector(state=>state.lang)
  const userID = useSelector(state => state.user && state.user._id)


  useEffect(()=>{
    dispatch(asyncGetTransactions(userID, (Page - 1) * 10 , 10 , CurrentHistory))
    .then(res => {
      console.log(res);
      setHistory([...res])
    })
  },[Page,CurrentHistory,userID])

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
                setCurrentHistory('TRX')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'TRX' && 'active'}`}>
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
                setCurrentHistory('USDT-ERC20')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'USDT-ERC20' && 'active'}`}>
                <p>USDT-ERC20</p>
              </div>

              <div onClick={()=>{
                setCurrentHistory('USDT-TRC20')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'USDT-TRC20' && 'active'}`}>
                <p>USDT-TRC20</p>
              </div>

              <div onClick={()=>{
                setCurrentHistory('TOMO')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'TOMO' && 'active'}`}>
                <p>TOMO</p>
              </div>

              {/* <div onClick={()=>{
                setCurrentHistory('BTC')
                setPage(1)
              }} className={`tab ${CurrentHistory === 'BTC' && 'active'}`}>
                <p>BTC</p>
              </div> */}
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
                    (History && History.length > 0 )?  History.map(({create_date, type, value , txId},index) =>{
                      var create_date = new Date(create_date)
                      return (
                        <tr>
                        <td className="date-time">
                          <span className="date"> {create_date.getDate()} /{create_date.getMonth() + 1}/{create_date.getFullYear()}</span>
                          <span className="time">{create_date.getHours()}:{create_date.getMinutes()}:{create_date.getSeconds()}</span>
                        </td>
                        <td className={`quantity ${type === 0 ? 'red' : 'green'}`} >
                          {value}
                        </td>
                        <td>{CurrentHistory}</td>
                        <td>{type === 0 ? checkLanguage({vi : 'Rút tiền', en: 'Withdraw'}, language) : checkLanguage({vi : 'Nạp tiền', en: 'Deposit'}, language)}</td>
                        <td> {txId} </td>
                      </tr>
                      )
                    }): 
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
