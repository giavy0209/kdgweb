import React ,{useState, useCallback, useEffect} from 'react'
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
import { asyncWithdraw, actChangeLoading } from '../../store/action'
import { message } from 'antd'
import { useHistory } from 'react-router-dom'
import { checkLanguage } from '../../helpers'
import callapi from '../../axios'

export default function ListCoin(){
    const dispatch = useDispatch()
    const history = useHistory()
    const [SwapValue, setSwapValue] = useState(0)
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

    const handleCopy = useCallback( e=>{
        var input = document.createElement('input');
        document.querySelector('body').append(input);
        input.value = e.target.innerText;
        input.select();
        document.execCommand("copy");
        input.remove();
        message.success(checkLanguage({vi: 'Đã copy', en: 'copied'},language))
    },[language])

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
            dispatch(actChangeLoading(true))
            dispatch(asyncWithdraw(submitData))
            .then(res=>{
                if(res.status === 1){
                    message.success(checkLanguage({vi: 'Rút tiền thành công', en: 'Withdraw successfully'},language))
                    setVisibleWithdraw(false)
                }else{
                    message.error(checkLanguage({vi: 'Giao dịch không thành công', en: 'Transaction fail'},language))
                }
                dispatch(actChangeLoading(false))
            })
            .catch(e=>{
                message.error(checkLanguage({vi: 'Giao dịch không thành công', en: 'Transaction fail'},language))
                dispatch(actChangeLoading(false))
            })
        }
    },[ercWallet,trxWallet,Coin,dispatch,id])

    const is2FA = useSelector(state=> state && state.user && state.user.is2FA)

    const handleSwap = useCallback(async()=>{
        dispatch(actChangeLoading(true))
        const res = (await callapi().post('/api/convert_kdg_reward',{userId: id , value : SwapValue})).data
        dispatch(actChangeLoading(false))
        console.log(res);
        if(res.status === 1){
            message.success(checkLanguage({vi: 'Chuyển đổi KDG thành công', en: 'Swap KDG successfully'},language))
        }else{
            message.error(checkLanguage({vi: 'Chuyển đổi thất bại', en: 'Swap KDG fail'},language))
        }
        document.querySelector('.popupswap').style.display = 'none'
        document.querySelector('.popupswapmask').style.display = 'none'
    },[SwapValue, id])
    
    return(
        <>
        <div className="popupswapmask" style={{display: 'none',width: '100%' , height: '100%', position: 'fixed', top: 0, left: 0 , backgroundColor: 'rgba(0, 0, 0 , .3)'}}></div>
        <div
        className='popupswap'
        style={{display:'none',paddingBottom: 26,width: 600, maxWidth: '90%', position: 'fixed', top: '50%' , left: '50%', transform: 'translate(-50% , -50%)', zIndex : 9999, backgroundColor : '#f1f3f4', borderRadius: 2}}
        >
            <span
            onClick={e=>{
                e.target.parentElement.style.display = 'none'
                document.querySelector('.popupswapmask').style.display = 'none'
            }}
            style={{position: 'absolute', top: 5, right: 5, fontSize: 20, width: 25, height: 25, borderRadius: '50%', color: '#d4af37' , backgroundColor : '#fff', textAlign : 'center', cursor: 'pointer'}}
            >x</span>
            <div
            style={{ backgroundImage: 'linear-gradient(to bottom right , #e9c259 ,#e4cf7c , #aa8411 , #c59700)', padding: '19px 0'}}
            >
                <p
                style={{color : "#283349" , fontSize: 22, textAlign: 'center'}}
                ><img src={swap} alt="" /> SWAP</p>
                <p style={{fontSize: 18, color : '#fff', fontStyle: 'italic', textAlign: 'center', marginTop: 10, fontWeight: 600}}> {kdg_reward} KDG Reward </p>
            </div>
            <div
            style={{padding: '20px'}}
            >
                <div
                style={{width: 'calc(50% - 25px)', display: 'inline-block'}}
                >
                    <p
                    style={{textAlign: 'center', color: '#fff', fontSize: 16, padding: '10px 0', backgroundColor: '#283349'}}
                    >
                        <img src={symbal} style={{width: 28, marginRight: 20}}/>
                        KDG Reward
                    </p>
                    <input 
                    defaultValue={SwapValue}
                    onChange={e=>{
                        var value = Number(e.target.value)
                        if(value){
                            if(value <= kdg_reward){
                                e.target.value = value
                            }else{
                                e.target.value = kdg_reward
                            }
                        }else{
                            e.target.value = e.target.value.slice(0 , e.target.value.length - 1)
                        }
                        setSwapValue(Number(e.target.value))
                    }}
                    style={{width: '100%', border: 'none', backgroundColor: '#fff', color: '#283349', fontSize: 35,textAlign: 'center', fontWeight: 400, height: 95}}
                    />
                </div>
                <div style={{width: 50, display: 'inline-block'}}>

                </div>
                <div
                style={{width: 'calc(50% - 25px)', display: 'inline-block'}}
                >
                    <p
                    style={{textAlign: 'center', color: '#fff', fontSize: 16, padding: '10px 0', backgroundColor: '#283349'}}
                    >
                        <img src={symbal} style={{width: 28, marginRight: 20}}/>
                        KDG
                    </p>
                    <input 
                    value={SwapValue}
                    disabled
                    style={{width: '100%', border: 'none', backgroundColor: '#fff', color: '#283349', fontSize: 35,textAlign: 'center', fontWeight: 400, height: 95}} />
                </div>

                <p
                onClick={handleSwap}
                style={{cursor: 'pointer',width: 130, borderRadius: 50, textAlign: 'center', margin: '0 auto' ,marginTop: 20, padding: '10px 0', fontSize: 16, color : '#ffffff', backgroundImage: 'linear-gradient(to bottom , #e9c259 ,#e4cf7c , #aa8411 , #c59700)'}}
                >{checkLanguage({vi: 'XÁC NHẬN', en: 'CONFIRM'},language)}</p>
                <p style={{color :'#283349', textDecoration : 'underline', fontSize : 16}}>Lưu ý</p>
                <p style={{color : '#8a8c8e', fontSize : 14, marginTop : 10}}>Tài khoản đăng ký trước ngày 1/9 sẽ được đổi tối đa 20KDG Reward / ngày, tối đa 1 lần/ngày. 1KDG Reward = 1KDG</p>
                <p style={{color : '#8a8c8e', fontSize : 14, marginTop : 10}}>Tài khoản đăng ký sau ngày 1/9 sẽ được quy đổi thành KDG Token khi bạn có đủ 25KDG Reward, quy đổi mỗi ngày 1 lần. 1KDG Reward = 1KDG</p>
            </div>
        </div>

        <Modal
        isVisible={VisibleDeposit}
        title={`${checkLanguage({vi: 'Nạp' , en: 'Deposit'},language)} ${Coin}`}
        onCancel={()=>setVisibleDeposit(false)}
        >
            <div className='model-deposit'>
                <span>{checkLanguage({vi: 'Scan tại đây để nạp' , en: 'Scan here to deposit'},language)}</span>
                <div className="qr-code">
                    <span></span>
                    <img alt="qr" src={AddressQR}/>
                </div>
                <span>{checkLanguage({vi: 'Sao chép mã tại đây' , en: 'Copy address here'},language)}</span>
                <div onClick={handleCopy} className="deposit-address">
                    <span>{Address}</span>
                    <FontAwesomeIcon style={{pointerEvents: 'none'}} icon={faCopy}/>
                </div>
            </div>
        </Modal>

        <Modal
        isVisible={VisibleWithdraw}
        title={`${checkLanguage({vi: 'Rút' , en: 'Withdraw'},language)} ${Coin}`}
        onCancel={()=>setVisibleWithdraw(false)}
        >
            <div className="model-withdraw">
                {is2FA ? 
                    <form onSubmit={handleWithdraw}>
                        <div className="input-group">
                            <span>{checkLanguage({vi: 'Địa chỉ ví nhận' , en: 'Receive address'},language)}</span>
                            <input placeholder={checkLanguage({vi: 'Địa chỉ ví nhận' , en: 'Receive address'},language)} name="toAddress" />
                        </div>
                        <div className="input-group">
                            <span>{checkLanguage({vi: 'Số lượng' , en: 'Value'},language)} {Coin}</span>
                            <input placeholder={`${checkLanguage({vi: 'Số lượng' , en: 'Value'},language)} ${Coin}`} name="value"/>
                        </div>
                        <div className="input-group ">
                            <span>{checkLanguage({vi: 'Mã 2FA' , en: '2FA CODE'},language)}</span>
                            <input name="token" />
                        </div>
                        <button>{checkLanguage({vi: 'Rút tiền' , en: 'Withdraw'},language)}</button>
                    </form> :
                    <span
                    onClick={()=>{
                        history.push('/account?tab=1')
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
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('KDG')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p> {checkLanguage({vi: 'Rút', en: 'Withdraw'}, language)} </p>
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
                        <p> {checkLanguage({vi: 'Giao dịch', en: 'Trade'}, language)} </p>
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
                        setCoin('TRON'); 
                        setAddress(trxWallet)
                        const img = await QRCode.toDataURL(trxWallet)
                        setAddressQR(img)
                    }} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('TRON')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p> {checkLanguage({vi: 'Rút', en: 'Withdraw'}, language)} </p>
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
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('ETH')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p> {checkLanguage({vi: 'Rút', en: 'Withdraw'}, language)} </p>
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
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('USDT')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p> {checkLanguage({vi: 'Rút', en: 'Withdraw'}, language)} </p>
                    </div>
                    </div>
                    
                </div>
                </div>
            </div>
        </div>

        {/* <div className="item">
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
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('TRX')}} className='button'>
                        <img alt="withdraw" src={withdraw}/>
                        <p> {checkLanguage({vi: 'Rút', en: 'Withdraw'}, language)} </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div> */}

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
                    onClick={()=>{document.querySelector('.popupswap').style.display = 'block';document.querySelector('.popupswapmask').style.display = 'block'}}
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