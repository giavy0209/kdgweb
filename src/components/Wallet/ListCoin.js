import React ,{useState, useCallback} from 'react'
import symbal from '../../assets/img/symbal.png'
import TRX from '../../assets/img/TRX.png'
import BTC from '../../assets/img/btc_icon.png'
import ETH from '../../assets/img/ETH.png'
import USDT from '../../assets/img/USDT.png'
import KNC from '../../assets/img/KNC.png'
import MCH from '../../assets/img/MCH.png'
import TOMO from '../../assets/img/TOMO.png'
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
    const [Balance, setBalance] = useState(0)
    const [Address, setAddress] = useState('')
    const [AddressQR, setAddressQR] = useState('')


    const ercWallet = useSelector(state=>{
        return state.user && state.user.erc_address
    })
    const trxWallet = useSelector(state=>{
        return state.user && state.user.trx_address
    })
    const tomoWallet = useSelector(state=>{
        return state.user && state.user.tomo_address
    })
    const btcWallet = useSelector(state=>{
        return state.user && state.user.btc_address
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
    const kdg_lock = useSelector(state=> state && state.user && state.user.kdg_lock)

    const handleWithdraw = useCallback((e)=>{
        e.preventDefault()
        var target = e.target
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
                    target.reset()
                    setVisibleWithdraw(false)
                }else{
                    message.error(checkLanguage({vi: 'Giao dịch không thành công', en: 'Transaction fail'},language))
                }
                dispatch(actChangeLoading(false))
            })
            .catch(er=>{
                console.log(er);
                message.error(checkLanguage({vi: 'Giao dịch không thành công', en: 'Transaction fail'},language))
                dispatch(actChangeLoading(false))
            })
        }
    },[ercWallet,trxWallet,Coin,dispatch,id])

    const is2FA = useSelector(state=> state && state.user && state.user.is2FA)
    const isKYC = useSelector(state=> state && state.user && state.user.kyc_success)

    const handleSwap = useCallback(async()=>{
        if(SwapValue > 0){
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
        }
    },[SwapValue, id])
    
    return(
        <>
        <div 
        onClick={e => {
            e.target.style.display = 'none'
            document.querySelector('.popupswap').style.display = 'none'
        }}
        className="popupswapmask" style={{display: 'none',width: '100%' , height: '100%', position: 'fixed', top: 0, left: 0 , backgroundColor: 'rgba(0, 0, 0 , .3)'}}></div>
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
                        setSwapValue(Number(e.target.value / 2))
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
                style={{opacity : SwapValue ,cursor: 'pointer',width: 130, borderRadius: 50, textAlign: 'center', margin: '0 auto' ,marginTop: 20, padding: '10px 0', fontSize: 16, color : '#ffffff', backgroundImage: 'linear-gradient(to bottom , #e9c259 ,#e4cf7c , #aa8411 , #c59700)'}}
                >{checkLanguage({vi: 'XÁC NHẬN', en: 'CONFIRM'},language)}</p>
                <p style={{color :'#283349', textDecoration : 'underline', fontSize : 16}}> {checkLanguage({vi : 'Lưu ý', en: 'Notice'},language)} </p>
                <p style={{color : '#8a8c8e', fontSize : 14, marginTop : 10}}>{checkLanguage({vi: 'Tài khoản đăng ký trước ngày 1/9 sẽ được đổi tối đa 20KDG Reward / ngày, tối đa 1 lần/ngày. 2KDG Reward = 1KDG', en: 'Account registration before 1/9/2020 are able to swap the reward. Maximum 20KDG / day, only 1 time / day. 2 KDG reward = 1 KDG.'}, language)}</p>
                <p style={{color : '#8a8c8e', fontSize : 14, marginTop : 10}}>{checkLanguage({vi: 'Tài khoản đăng ký sau ngày 1/9 sẽ được quy đổi thành KDG Token khi bạn có đủ 25KDG Reward, tối đa 50 KDG Reward,quy đổi mỗi ngày 1 lần. 2 KDG Reward = 1KDG', en: 'Account registration after 1/9/2020 are able to swap the reward when being enough 25KDG / day, maximum 50KDG / day, only 1 time / day. 2 KDG reward = 1 KDG.'}, language)}</p>
                <p style={{color : '#8a8c8e', fontSize : 14, marginTop : 10}}>{checkLanguage({vi: 'Vui lòng hoàn thành xác minh danh tính (KYC) trước khi swap', en: 'Please complete KYC before swap'}, language)}</p>
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
        onCancel={()=>{setVisibleWithdraw(false);document.getElementById('withdraw-form').reset()}}
        >
            <div className="model-withdraw">
                {!is2FA ? 
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
                :
                !isKYC ? 
                <span
                onClick={()=>{
                    history.push('/account?tab=3')
                }}
                style={{
                    cursor:'pointer',
                    width: '100%',
                    textAlign: 'center',
                    textDecoration: 'underline'
                }}
                >
                    {checkLanguage({vi:'Vui lòng KYC trước khi rút tiền', en: 'Please KYC before withdraw'}, language)}
                </span>
                :
                <form id='withdraw-form' onSubmit={handleWithdraw}>
                    <div className="input-group">
                        <span>{checkLanguage({vi: 'Địa chỉ ví nhận' , en: 'Receive address'},language)}</span>
                        <input placeholder={checkLanguage({vi: 'Địa chỉ ví nhận' , en: 'Receive address'},language)} name="toAddress" />
                    </div>
                    <div className="input-group">
                        <span>{checkLanguage({vi: 'Số lượng' , en: 'Value'},language)} {Coin}</span>
                        <div style={{position : 'relative'}}>
                            <input style={{width : '100%'}} placeholder={`${checkLanguage({vi: 'Số lượng' , en: 'Value'},language)} ${Coin}`} name="value"/>
                            <span 
                            onClick={e => {
                                e.currentTarget.previousElementSibling.value = Balance
                            }}
                            style={{position : 'absolute', top : '50%' , right: 5, transform : 'translate(0 , -50%)', cursor : 'pointer'}}> {checkLanguage({vi : 'Tối đa', en: 'Max'}, language)} </span>
                        </div>
                    </div>
                    <div className="input-group ">
                        <span>{checkLanguage({vi: 'Mã 2FA' , en: '2FA CODE'},language)}</span>
                        <input name="token" />
                    </div>
                    <button>{checkLanguage({vi: 'Rút tiền' , en: 'Withdraw'},language)}</button>
                </form> 
                    
                    
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
                    <p><span>Locked: </span><span>{kdg_lock ? kdg_lock : 0}</span></p>
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
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('KDG');setBalance(balance.kdg_balance)}} className='button'>
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
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('TRON');setBalance(balance.trx_balance)}} className='button'>
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
                    <img src={KNC} alt="coin"/>
                    <span className="name">KNC</span>
                </div>
                <div className='balance'>
                    <p><span></span><span> {balance && balance.knc_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async()=>{
                        setVisibleDeposit(true); 
                        setCoin('KNC'); 
                        setAddress(ercWallet)
                        const img = await QRCode.toDataURL(ercWallet)
                        setAddressQR(img)
                        
                    }} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('KNC');setBalance(balance.knc_balance)}} className='button'>
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
                    <img src={MCH} alt="coin"/>
                    <span className="name">MCH</span>
                </div>
                <div className='balance'>
                    <p><span></span><span> {balance && balance.mch_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async()=>{
                        setVisibleDeposit(true); 
                        setCoin('MCH'); 
                        setAddress(ercWallet)
                        const img = await QRCode.toDataURL(ercWallet)
                        setAddressQR(img)
                        
                    }} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('MCH');setBalance(balance.mch_balance)}} className='button'>
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
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('ETH');setBalance(balance.eth_balance)}} className='button'>
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
                    <span className="name">USDT-ERC20</span>
                </div>
                <div className='balance'>
                    <p><span> </span><span> {balance && balance.usdt_erc20_balance} </span></p>
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
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('USDT');setBalance(balance.usdt_erc20_balance)}} className='button'>
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
                    <span className="name">USDT-TRC20</span>
                </div>
                <div className='balance'>
                    <p><span> </span><span> {balance && balance.usdt_trc20_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async()=>{
                        setVisibleDeposit(true); 
                        setCoin('USDT'); 
                        setAddress(trxWallet)
                        const img = await QRCode.toDataURL(trxWallet)
                        setAddressQR(img)
                        
                    }} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('USDT');setBalance(balance.usdt_trc20_balance)}} className='button'>
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
                    <p><span></span><span> {(balance && balance.btc_balance) ? balance.btc_balance : 0 } </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async()=>{
                        setVisibleDeposit(true); 
                        setCoin('BTC'); 
                        setAddress(btcWallet)
                        const img = await QRCode.toDataURL(btcWallet)
                        setAddressQR(img)
                    }} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('BTC')}} className='button'>
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
                    <img src={TOMO} alt="coin"/>
                    <span className="name">TOMO</span>
                </div>
                <div className='balance'>
                    <p><span> </span><span> {balance && balance.tomo_balance} </span></p>
                </div>
                </div>
                <div className="button-group">
                <div className="kdg-row kdg-column-4 list-button text-c va-m">
                    <div className="item">
                    <div onClick={async()=>{
                        setVisibleDeposit(true); 
                        setCoin('TOMO'); 
                        setAddress(tomoWallet)
                        const img = await QRCode.toDataURL(tomoWallet)
                        setAddressQR(img)
                        
                    }} className='button'>
                        <img alt="deposit" src={deposit}/>
                        <p> {checkLanguage({vi: 'Nạp', en: 'Deposit'}, language)} </p>
                    </div>
                    </div>
                    <div className="item">
                    <div onClick={()=>{setVisibleWithdraw(true); setCoin('TOMO');setBalance(balance.tomo_balance)}} className='button'>
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