import React ,{useState, useCallback, useMemo} from 'react'
import symbal from '../../assets/img/symbal.png'
import TRX from '../../assets/img/TRX.png'
import ETH from '../../assets/img/ETH.png'
import USDT from '../../assets/img/USDT.png'
import swap from '../../assets/img/swap.png'
import deposit from '../../assets/img/deposit.png'
import withdraw from '../../assets/img/withdraw.png'
import trade from '../../assets/img/trade.png'
import stake from '../../assets/img/stake.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy} from '@fortawesome/free-solid-svg-icons'
import qr from '../../assets/img/qrcode.jpg'

import Modal from '../Modal'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetBalance, asyncWithdraw } from '../../store/action'
import { message } from 'antd'
const handleCopy = e=>{
    var input = document.createElement('input');
    document.querySelector('body').append(input);
    input.value = e.target.innerText;
    input.select();
    document.execCommand("copy");
    input.remove();
    message.success('Đã copy')
}
export default function ListCoin(){
    const dispatch = useDispatch()
    const [VisibleDeposit, setVisibleDeposit] = useState(false)
    const [VisibleWithdraw, setVisibleWithdraw] = useState(false)
    const [Coin, setCoin] = useState('KDG')
    const [Address, setAddress] = useState('')
    const ercWallet = useSelector(state=>{
        return state.user && state.user.erc_address
    })
    const trxWallet = useSelector(state=>{
        return state.user && state.user.trx_address
    })

    const balance = useSelector(state=>{
        return state.allBalance
    })

    const handleWithdraw = useCallback((e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        const rawSubmitData = {}
        for(var pair of data.entries()) {
            rawSubmitData[pair[0]] = pair[1]
        }
        const submitData = {toAddress: rawSubmitData.toAddress, value: rawSubmitData.value}
        submitData.deposit_type = Coin;
        if(Coin === 'KDG' || Coin === 'TRON') submitData.fromAddress = trxWallet
        if(Coin === 'ETH' || Coin === 'USDT') submitData.fromAddress = ercWallet
        console.log(submitData);
        const r = window.confirm('Xác nhận đúng ví cần gửi?')
        if(r){
            dispatch(asyncWithdraw(submitData))
            .then(res=>{
                alert(`${res.msg} ${res.error && res.error}`)
            })
        }
    },[ercWallet,trxWallet,Coin])

    return(
        <>
        <Modal
        isVisible={VisibleDeposit}
        title={`Nạp ${Coin}`}
        onCancel={()=>setVisibleDeposit(false)}
        >
            <div className='model-deposit'>
                {/* <span>Scan tại đây để nạp</span>
                <div className="qr-code">
                    <span></span>
                    <img alt="qr" src={qr}/>
                </div> */}
                <span>Sao chép mã tại đây</span>
                <div onClick={handleCopy} className="deposit-address">
                    <span>{Address}</span>
                    <FontAwesomeIcon icon={faCopy}/>
                </div>
            </div>
        </Modal>

        <Modal
        isVisible={VisibleWithdraw}
        title={`Rút ${Coin}`}
        onCancel={()=>setVisibleWithdraw(false)}
        >
            <div className="model-withdraw">
                <form onSubmit={handleWithdraw}>
                    <div className="input-group">
                        <span>Địa chỉ ví nhận</span>
                        <input placeholder="Địa chỉ ví nhận" name="toAddress" />
                    </div>
                    <div className="input-group">
                        <span>Số lượng {Coin}</span>
                        <input placeholder={`Số lượng ${Coin}`} name="value"/>
                    </div>
                    {/* <div className="input-group google-authen">
                        <span>Mã Google Authen</span>
                        <input />
                        <input />
                        <input />
                        <input />
                        <input />
                        <input />
                    </div> */}
                    <button>Rút tiền</button>
                </form>
            </div>

        </Modal>
        <div className="item">
            <div className="coin">
                <div className="top-info">
                <div className="coin-image-name">
                    <img src={symbal} alt="coin"/>
                    <span className="name">KDG</span>
                </div>
                <div className='balance'>
                    <p><span>Available: </span><span> {balance && balance.kdg_balance} </span></p>
                    <p><span>Locked: </span><span>0</span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={()=>{setVisibleDeposit(true); setCoin('KDG'); setAddress(trxWallet)}} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p>nạp</p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('KDG')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p>rút</p>
                    </div>
                    </div>
                    <div className="item">
                    <div className='button'>
                        <img alt="staking" src={stake}/>
                        <p>staking</p>
                    </div>
                    </div>
                    <div className="item">
                    <div className='button'>
                        <img alt='trade' src={trade}/>
                        <p>giao dịch</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div className="item">
            <div className="coin">
                <div className="top-info">
                <div className="coin-image-name">
                    <img src={TRX} alt="coin"/>
                    <span className="name">TRX</span>
                </div>
                <div className='balance'>
                    <p><span>Available: </span><span> {balance && balance.trx_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={()=>{setVisibleDeposit(true); setCoin('TRX'); setAddress(trxWallet)}} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p>nạp</p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('TRX')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p>rút</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div className="item">
            <div className="coin">
                <div className="top-info">
                <div className="coin-image-name">
                    <img src={ETH} alt="coin"/>
                    <span className="name">ETH</span>
                </div>
                <div className='balance'>
                    <p><span>Available: </span><span> {balance && balance.eth_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={()=>{setVisibleDeposit(true); setCoin('ETH'); setAddress(ercWallet)}} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p>nạp</p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('ETH')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p>rút</p>
                    </div>
                    
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div className="item">
            <div className="coin">
                <div className="top-info">
                <div className="coin-image-name">
                    <img src={USDT} alt="coin"/>
                    <span className="name">USDT</span>
                </div>
                <div className='balance'>
                    <p><span>Available: </span><span> {balance && balance.eth_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={()=>{setVisibleDeposit(true); setCoin('USDT'); setAddress(ercWallet)}} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p>nạp</p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('USDT')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p>rút</p>
                    </div>
                    </div>
                    
                </div>
                </div>
            </div>
        </div>

        <div className="item">
            <div className="coin">
                <div className="top-info">
                <div className="coin-image-name">
                    <img src={symbal} alt="coin"/>
                    <span className="name">KDG Reward</span>
                </div>
                <div className='balance'>
                    <p><span>Available: </span><span> {balance && balance.kdg_balance} </span></p>
                    <p><span>Locked: </span><span>0</span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div className='button'>
                        <img alt="deposit" src={swap}/>
                        <p>Swap</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
       </>
    )
}