import React, { useCallback, useEffect, useMemo, useState } from 'react'
import idCard from '../../assets/img/idcard.png'
import flag from '../../assets/img/flag.png'
import frontid from '../../assets/img/frontid.png'
import backid from '../../assets/img/backid.png'
import self from '../../assets/img/self.png'
import {asyncGetListContries} from '../../store/action'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
const idtype=[{value: 0, name:'Chứng minh nhân dân/Bằng lái xe'}, {value: 1, name:'Hộ chiếu'}]
export default function App(){
    const dispatch = useDispatch()
    const listContries = useSelector(state=> state.contries)
    console.log(listContries);
    const [SelectedID, setSelectedID] = useState(0)
    const [SelectedContry, setSelectedContry] = useState('VN')

    const findValueID = useCallback(()=>{
        return idtype.find(o=>SelectedID === o.value).name
    },[SelectedID])

    const findValueContry = useCallback(()=>{
        return listContries.find(o=>SelectedContry === o.alpha2Code)
    },[SelectedContry,listContries])

    useEffect(()=>{
        const selectBlock = document.querySelectorAll('.selected')
        selectBlock.forEach(el=>{
            el.addEventListener('click',e=>{
                if(Array.from(el.classList).includes('show')) el.classList.remove('show')
                else el.classList.add('show')
            })  
        })
    },[])

    useMemo(()=>{
        dispatch(asyncGetListContries())
    },[dispatch])
    return(
        <>
        <form>
        <div className="input-group haft select">
                <p className='title'>Loại giấy tờ</p>  
                <div className="select-block">
                    <img alt="" src={idCard} />
                    <div className='selected'>
                        <span><span>{findValueID()}</span> <FontAwesomeIcon icon={faCaretDown}/></span>
                        <div className="dropdown-selected">
                            {
                                idtype.map((el,idx)=>
                                <p 
                                onClick={()=>setSelectedID(idx)}
                                className={SelectedID === idx ? 'selected-value' : ''} key={idx}>{el.name}</p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="input-group haft select">
                <p className='title'>Quốc gia</p>  
                <div className="select-block">
                    <img style={{width: 27}} alt="" src={flag} />
                    <div className='selected'>
                        <span className="contry"> <img className="flag" alt="" src={listContries && findValueContry().flag}/> <span>{listContries && findValueContry().name}</span> <FontAwesomeIcon icon={faCaretDown}/></span>
                        <div className="dropdown-selected">
                            {
                                listContries && listContries.map((el,idx)=>
                                <p 
                                onClick={()=>setSelectedContry(el.alpha2Code)}
                                className={SelectedContry === el.alpha2Code ? 'selected-value' : ''} key={idx}>
                                    <img className="flag" alt="" src={el.flag}/>
                                    {el.name}
                                </p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="input-group">
                <span>Tên</span>
                <input name="name" placeholder="Tên"/>
            </div>
            <div className="input-group">
                <span> {findValueID()} </span>
                <input name="phone" placeholder={findValueID()}/>
            </div>
            <div className="input-group">
                <span>Email</span>
                <input name="email" placeholder="Emai"/>
            </div>
            <ul>
                <li>Vui lòng sử dụng định dạng JPG, JPEG, PNG. Kích thước tệp tối đa = 2MB</li>
                <li>Để đảm bảo quá trình xác minh được thuận tiện, vui lòng không che hoặc làm nhòe ảnh.</li>
            </ul>
            <div className="upload">
                <div className="text">{SelectedID === 0 ? '1. Mặt trước CMND/Bằng lái xe' : '1. Ảnh chụp hộ chiếu'}</div>
                <div className="upload-block">
                    <img alt="" src={frontid} />
                    <p>Nhấn vào đây để tải lên ảnh mặt trước</p>
                </div>
            </div>
            {SelectedID === 0 && <div className="upload">
                <div className="text">2. Mặt sau CMND/Bằng lái xe</div>
                <div className="upload-block">
                    <img alt="" src={backid} />
                    <p>Nhấn vào đây để tải lên ảnh mặt sau</p>
                </div>
            </div>}
            <div className="upload">
                <div className="text">{SelectedID === 0 ? '3. Ảnh có mặt của bạn chụp chung với mặt trước CMND/Bằng lái xe và ngày tháng năm hiện tại' : '2. Ảnh có mặt bạn chụp chung với hộ chiếu và ngày tháng năm hiện tại'}</div>
                <div className="upload-block">
                    <img alt="" src={self} />
                    <p>Nhấn vào đây để tải lên</p>
                </div>
            </div>
            <div className="input-group checkbox">
                <input type="checkbox" name="confirm" id="confirm"/> 
                <label for="confirm"><span></span> <span>Tôi xác nhận các thông tin trên là đúng sự thật</span></label>
            </div>
            
            <div className="input-group">
            <button type="submit">Xác nhận</button>
            </div>
        </form>
        </>
    )
}