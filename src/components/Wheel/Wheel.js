import React, {useState, useEffect, useCallback} from 'react'
import './index.css'
import SpinButton from './spinButton';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { asyncGetUserData } from '../../store/action';
function Wheel({keyValue, setSpinValue,getValue, items}) {
  const dispatch = useDispatch()
  const [selectedItem, setSelectedItem] = useState(null);

  const [IsCanClick, setIsCanClick] = useState(true);

  const [ButtonName, setButtonName] = useState('START');
  const arrPlaces = items.find((item) => item.key === keyValue )
  const user = useSelector(state => state.user)

  const selectItem = async () => {
    if(user && user.kdg_reward > 1){
      await getValue();
      setButtonName('')
      setIsCanClick(false)
      setTimeout(() => {
        setIsCanClick(true)
        setButtonName('RESET')
        document.querySelector('.popupspin').style.display  = 'block'
        document.querySelector('.maskspin').style.display  = 'block'
        dispatch(asyncGetUserData())
      }, 4000);
    }else{
      message.error('Bạn không đủ KDG Reward')
    }
  }

  useEffect(()=>{
    if(keyValue !== null){
      setSelectedItem(arrPlaces.orderNum)
      setSpinValue(null)
    }
  },[keyValue,arrPlaces,setSpinValue])

  const reset = useCallback(()=>{
    if(selectedItem !== null){
      setButtonName('START')
      setIsCanClick(true)
      setSelectedItem(null)
    }
  },[selectedItem])
   
    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
      // '--nb-item': 0,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';


  return (
    <div style={{width : '100%'}} className={"wheel-container wheel-container-effect"}>
      <div style={{
      pointerEvents: IsCanClick ? 'all' : 'none',
      cursor: IsCanClick ? 'pointer': 'not-allowed',
      position: 'absolute', top: '50%', left: '50%', transform : 'translate(-50% ,-50%)', zIndex: 5
      }}>
        <SpinButton buttonText={ButtonName} toClick={selectedItem === null ? selectItem : reset}/>
      </div>
      <div className={`wheel ${spinning}`} style={{...wheelVars, width: '100%'}}>
        {items.map((item, index) => (
          <div className="wheel-item" key={index} style={{ '--item-nb': index}}>
            <p className={`title-place-lucky-spin color-${index}`}>{item.title}</p>
          </div>
          
        ))}
      </div>
  </div>
  )
}

export default Wheel
