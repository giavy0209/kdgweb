import React, { useMemo, useCallback, useEffect, useState } from 'react';
import ListChart from './ListChart'
import ListCoin from './ListCoin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetUserData } from '../../store/action';
import Axios from 'axios';
import { InputNumber,Form } from 'antd';
import '../../assets/css/wallet.scss'
async function getHistoryUSDT (userWallet,skip,coin){

  const res = (await Axios.get(`http://171.244.18.130:6001/api/blockchain_transaction?coin_type=${coin.toLowerCase()}&address=${userWallet}&skip=${skip}&take=20`)).data

  if(res.status === 1){
    console.log(res);
    var result = res.data.result
    result = result.map(o=>{
      var data ={
        time: new Date(o.timeStamp * 1000),
        type: o.form === userWallet ? 0 : 1,
        value: o.value / 1e6,
        hash: o.hash
      }
      return data
    })
    console.log(result);

    return result
  }
}

async function getHistoryTRX (userWallet,skip,coin){
  const res = (await Axios.get(`http://171.244.18.130:6001/api/blockchain_transaction?coin_type=${coin.toLowerCase()}&address=${userWallet}&skip=${skip}&take=20`)).data
  if(res.status === 1){
    var result = res.data.data
    if(coin === 'KDG'){
      result = result.map(o=>{
        var data ={
          time: new Date(o.timestamp),
          type: o.transferFromAddress === userWallet ? 0 : 1,
          value: o.amount / 1e18,
          hash: o.transactionHash
        }
        return data
      })
    }
    if(coin === 'TRON'){
      result = result.map(o=>{
        var data ={
          time: new Date(o.block_timestamp),
          type: o.transferFromAddress === userWallet ? 0 : 1,
          value: o.raw_data.contract[0].parameter.value.amount / 1e6,
          hash: o.txID
        }
        return data
      })
    }
    return result
  }
}

function App() {
  const [CurrentHistory, setCurrentHistory] =useState('KDG')
  const [Page, setPage] = useState(1)
  const [History, setHistory] = useState([])
  
  const history = useHistory()
  const dispatch = useDispatch()
  useMemo(()=>{
    dispatch(asyncGetUserData())
    .then(res=>{
      if(res === false){
        history.push('/login')
      }
    })
  },[])

  const ercWallet = useSelector(state=>{
      return state.user && state.user.erc_address
  })
  const trxWallet = useSelector(state=>{
      return state.user && state.user.trx_address
  })

  useEffect(()=>{
    if(CurrentHistory === 'KDG' || CurrentHistory === 'TRON'){
      if(ercWallet) {
        getHistoryTRX(trxWallet, (Page - 1) * 20, CurrentHistory)
        .then(result=>{
          setHistory([...result])
        })
      }
    }
    if(CurrentHistory === 'ETH' || CurrentHistory === 'USDT'){
      if(trxWallet) {
        getHistoryUSDT(ercWallet, (Page - 1) * 20, CurrentHistory)
        .then(result=>{
          console.log(result);
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
            <h2 className="title">Giá thị trường</h2>
            <div className="kdg-row kdg-column-4 list-price">
              <ListChart/>
            </div>
          </section>
          <section className="section-wallet">
            <h2 className="title">thông tin số dư</h2>
            <div className="kdg-row kdg-column-2 list-coin">
              <ListCoin/>
            </div>
          </section>

          <section className="section-history">
            <h2 className="title">LỊCH SỬ GIAO DỊCH</h2>
            <div className="list-tab">
              <div onClick={()=>setCurrentHistory('KDG')} className={`tab ${CurrentHistory === 'KDG' && 'active'}`}>
                <p>KDG</p>
              </div>
              <div onClick={()=>setCurrentHistory('TRON')} className={`tab ${CurrentHistory === 'TRON' && 'active'}`}>
                <p>TRX</p>
              </div>
              <div onClick={()=>setCurrentHistory('ETH')} className={`tab ${CurrentHistory === 'ETH' && 'active'}`}>
                <p>ETH</p>
              </div>
              <div onClick={()=>setCurrentHistory('USDT')} className={`tab ${CurrentHistory === 'USDT' && 'active'}`}>
                <p>USDT</p>
              </div>
            </div>

            <div className="history">
              <table>
                <tbody>
                  <tr>
                    <th>Thời gian</th>
                    <th>Số lượng</th>
                    <th>Token</th>
                    <th>Kiểu</th>
                    <th>Hash(Txid)</th>
                  </tr>

                  {
                    History && History.map(({time, type, value , hash},index) =>
                      <tr>
                        <td className="date-time">
                          <span className="date"> {time.getDate()} /{time.getMonth()}/{time.getFullYear()}</span>
                          <span className="time">{time.getHours()}:{time.getMinutes()}:{time.getSeconds()}</span>
                        </td>
                        <td className={`quantity ${type === 0 ? 'red' : 'green'}`} >
                          {value}
                        </td>
                        <td>USDT</td>
                        <td>{type === 0 ? 'Rút tiền' : 'Nạp tiền'}</td>
                        <td> {hash} </td>
                      </tr>
                    )
                  }

                </tbody>
              </table>

            </div>
            <div className="pagination">
              <span style={{pointerEvents: Page === 1 ? 'none' : 'all'}} onClick={()=>setPage(Page - 1)} className="arrow"><FontAwesomeIcon icon={faAngleLeft}/></span>
                  <InputNumber onPressEnter={e=>setPage(Number(e.target.value))} style={{width:60}}/>
              <span style={{pointerEvents: History.length < 20 ? 'none' : 'all'}}  onClick={()=>setPage(Page + 1)} className="arrow"><FontAwesomeIcon icon={faAngleRight}/></span>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

export default App;
