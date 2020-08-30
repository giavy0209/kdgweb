import React ,{useState, useCallback} from 'react'
import symbal from '../../assets/img/symbal.png'
import TRX from '../../assets/img/TRX.png'
import BTC from '../../assets/img/btc_icon.png'
import ETH from '../../assets/img/ETH.png'
import USDT from '../../assets/img/USDT.png'
import swap from '../../assets/img/swap.png'
import deposit from '../../assets/img/deposit.png'
import withdraw from '../../assets/img/withdraw.png'
import trade from '../../assets/img/trade.png'
import stake from '../../assets/img/stake.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy} from '@fortawesome/free-solid-svg-icons'

import QRCode from 'qrcode'
import Modal from '../Modal'
import { useSelector, useDispatch } from 'react-redux'
import { asyncWithdraw } from '../../store/action'
import { message } from 'antd'
import { useHistory } from 'react-router-dom'
import { checkLanguage } from '../../helpers'
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
    const history = useHistory()
    const [VisibleDeposit, setVisibleDeposit] = useState(false)
    const [VisibleWithdraw, setVisibleWithdraw] = useState(false)
    const [Coin, setCoin] = useState('KDG')
    const [Address, setAddress] = useState('')
    const [AddressQR, setAddressQR] = useState('')
    const ercWallet = useSelector(state=>{
        return state.user && state.user.erc_address
    })
    const trxWallet = useSelector(state=>{
        return state.user && state.user.trx_address
    })

    const balance = useSelector(state=>{
        return state.allBalance
    })

    const language = useSelector(state => state.lang)

    const kdg_reward = useSelector(state=>state && state.user && state.user.kdg_reward)    
    const id = useSelector(state=> state && state.user && state.user._id)
    const handleWithdraw = useCallback((e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        const rawSubmitData = {}
        for(var pair of data.entries()) {
            rawSubmitData[pair[0]] = pair[1]
        }
        const submitData = {toAddress: rawSubmitData.toAddress, value: rawSubmitData.value, token: rawSubmitData.token}
        submitData.deposit_type = Coin.toLowerCase();
        submitData.userId = id
        const r = window.confirm(checkLanguage({vi: 'Xác nhận đúng địa chỉ ví cần gửi?', en: 'Confirm correct deposit address?'},language))
        if(r){
            dispatch(asyncWithdraw(submitData))
            .then(res=>{
                console.log(res);
                if(res.status === 1){
                    message.success(checkLanguage({vi: 'Rút tiền thành công', en: 'Withdraw successfully'},language))
                    setVisibleWithdraw(false)
                }else{
                    message.error(checkLanguage({vi: 'Giao dịch không thành công', en: 'Transaction fail'},language))
                }
            })
            .catch(e=>{
                message.error(checkLanguage({vi: 'Giao dịch không thành công', en: 'Transaction fail'},language))
            })
        }
    },[ercWallet,trxWallet,Coin,dispatch,id])
    const is2FA = useSelector(state=> state && state.user && state.user.is2FA)
    return(
        <>
        <Modal
        isVisible={VisibleDeposit}
        title={`Nạp ${Coin}`}
        onCancel={()=>setVisibleDeposit(false)}
        >
            <div className='model-deposit'>
                <span>Scan tại đây để nạp</span>
                <div className="qr-code">
                    <span></span>
                    <img alt="qr" src={AddressQR}/>
                </div>
                <span>Sao chép mã tại đây</span>
                <div onClick={handleCopy} className="deposit-address">
                    <span>{Address}</span>
                    <FontAwesomeIcon style={{pointerEvents: 'none'}} icon={faCopy}/>
                </div>
            </div>
        </Modal>

        <Modal
        isVisible={VisibleWithdraw}
        title={`Rút ${Coin}`}
        onCancel={()=>setVisibleWithdraw(false)}
        >
            <div className="model-withdraw">
                {is2FA ? 
                    <form onSubmit={handleWithdraw}>
                        <div className="input-group">
                            <span>Địa chỉ ví nhận</span>
                            <input placeholder="Địa chỉ ví nhận" name="toAddress" />
                        </div>
                        <div className="input-group">
                            <span>Số lượng {Coin}</span>
                            <input placeholder={`Số lượng ${Coin}`} name="value"/>
                        </div>
                        <div className="input-group ">
                            <span>Mã Google Authen</span>
                            <input name="token" />
                        </div>
                        <button>Rút tiền</button>
                    </form> :
                    <span
                    onClick={()=>{
                        history.push('/account')
                    }}
                    style={{
                        cursor:'pointer',
                        width: '100%',
                        textAlign: 'center',
                        textDecoration: 'underline'
                    }}
                    >
                        {checkLanguage({vi:'Vui lòng bật 2FA trước khi rút tiền', en: 'Please activate 2FA'}, language)}
                    </span>
                }
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
                    <div onClick={async ()=>{
                        setVisibleDeposit(true); 
                        setCoin('KDG'); 
                        setAddress(trxWallet);
                        const img = await QRCode.toDataURL(trxWallet)
                        setAddressQR(img)
                    }} className='button'>
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
                    <div onClick={()=>history.push('/staking/event')} className='button'>
                        <img alt="staking" src={stake}/>
                        <p>staking</p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>window.open('https://www.mxc.com/trade/easy#KDG_USDT' , '_blank')} className='button'>
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
                    <p><span></span><span> {balance && balance.trx_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async()=>{
                        setVisibleDeposit(true); 
                        setCoin('TRX'); 
                        setAddress(trxWallet)
                        const img = await QRCode.toDataURL(trxWallet)
                        setAddressQR(img)
                    }} className='button'>
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
                    <p><span></span><span> {balance && balance.eth_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async ()=>{
                        setVisibleDeposit(true);
                        setCoin('ETH'); 
                        setAddress(ercWallet)
                        const img = await QRCode.toDataURL(ercWallet)
                        setAddressQR(img)
                    }} className='button'>
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
                    <p><span> </span><span> {balance && balance.eth_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async()=>{
                        setVisibleDeposit(true); 
                        setCoin('USDT'); 
                        setAddress(ercWallet)
                        const img = await QRCode.toDataURL(ercWallet)
                        setAddressQR(img)
                    }} className='button'>
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
                    <img src={BTC} alt="coin"/>
                    <span className="name">BTC</span>
                </div>
                <div className='balance'>
                    <p><span></span><span> {balance && balance.trx_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async()=>{
                        setVisibleDeposit(true); 
                        setCoin('BTC'); 
                        setAddress(trxWallet)
                        const img = await QRCode.toDataURL(trxWallet)
                        setAddressQR(img)
                    }} className='button'>
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
                    <img src={symbal} alt="coin"/>
                    <span className="name">KDG Reward</span>
                </div>
                <div className='balance'>
                    <p><span></span><span> {kdg_reward ? kdg_reward : '0'} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div 
                    // onClick={}
                    className='button'>
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