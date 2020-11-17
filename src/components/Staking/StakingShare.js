import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { checkLanguage } from '../../helpers'
import img_poster from '../../assets/img/stake/img-poster.png'
import poster1 from '../../assets/img/stake/poster1.jpg'
import poster2 from '../../assets/img/stake/poster2.jpg'
import poster3 from '../../assets/img/stake/poster3.jpg'
import { message } from 'antd'
import callapi from '../../axios'
import QRCode from 'qrcode'

const arrPoster = [
    poster1,
    poster2,
    poster3
]
const renderDate = function (date){
    var d = new Date(date)
    var day = d.getDate()
    var month = d.getMonth() + 1
    var year = d.getFullYear()
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var sec = d.getSeconds()

    return `${day}/${month}/${year} ${hours}:${minutes}:${sec}`
}
export default function App () {
    const history = useHistory()
    const user = useSelector(state=> state.user)
    const language = useSelector(state => state.lang)
    const [Type, setType] = useState(1)
    const [ListChild, setListChild] = useState([])
    const [Page, setPage] = useState(1)
    const [TotalPage, setTotalPage] = useState([1])

    const [RankingReferer, setRankingReferer] = useState([])
    const [VisiblePoster, setVisiblePoster] = useState(false)
    
    const handleCopy = useCallback(value=>{
        var input = document.createElement('input');
        document.querySelector('body').append(input);
        input.value = value;
        input.select();
        document.execCommand("copy");
        input.remove();
        message.success(checkLanguage({vi: 'Đã copy', en: 'copied'}, language))
    },[])

    const getRankingRef = useCallback(async () => {
        var res = (await callapi().get('/api/ranking_ref')).data
        setRankingReferer([...res.data])
    },[])

    const getChildUser = useCallback(async()=>{
        var url;
        if(Type === 1) url = `/api/user_child_info?page=${Page}`
        if(Type === 2) url = `/api/reward_from_child?page=${Page}`
        
        const res = (await callapi().get(url)).data
        console.log(res);
        setListChild(res.data)
        var arr = []
        for (let index = 1; index <= Math.ceil(res.total / 10); index++) {
            arr.push(index)
        }
        setTotalPage([...arr])
    },[Page,Type])

    useMemo(()=>{
        getChildUser()
        getRankingRef()
    },[Page,Type])

    useEffect(() => {
        const canvas = document.querySelectorAll('canvas')
        canvas.forEach((el,index) => {
            
            console.log(arrPoster[index]);
            const img = new Image()
            img.src = arrPoster[index]
            img.onload = async () => {
                var ctx = el.getContext('2d')
                el.width = img.width
                el.height = img.height 
                
                ctx.drawImage(
                    img,
                    0 , 0,
                    img.width, img.height,
                    0 , 0,
                    img.width, img.height,
                )

                const imgQR = await QRCode.toDataURL(`https://www.kingdomgame.org/reg/${user && user.ref_code}`)

                const loadImgQr = new Image
                loadImgQr.src = imgQR

                loadImgQr.onload = () => {
                    ctx.drawImage (
                        loadImgQr,
                        loadImgQr.width * 0.09 ,loadImgQr.height * 0.09,
                        img.width * 0.16, img.width * 0.16,
                        img.width - loadImgQr.width ,
                        img.height - loadImgQr.height,
                        img.width * 0.15, img.width * 0.15,
                    )
                }

            }
        })
    }, [user]);

    const handleDownload = useCallback((e) => {
        var link = document.createElement('a');
        link.download = 'poster.png';
        link.href = e.target.previousElementSibling.toDataURL()
        link.click()
    },[])
    return (
        <>
        {checkLanguage({vi : '' , en : ''}, language)}
        <div className="staking-share background">
            <div className={`modal ${VisiblePoster ? 'show' : ''}`}>
                <div onClick={()=>setVisiblePoster(false)} className="mask"></div>
                <div className="modal-content">
                    <div className="header">
                        {checkLanguage({vi : 'Chọn Poster Bạn Muốn Chia Sẻ' , en : 'Choose Poster For Share'}, language)}
                    </div>
                    <div className="body">
                        <div className="kdg-row kdg-column-3 list-poster">
                            <div className="item">
                                <div className="poster">
                                    <canvas></canvas>
                                    <div onClick={handleDownload} className="dl-button">
                                        {checkLanguage({vi : 'Tải xuống ngay' , en : 'Download now'}, language)}
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="poster">
                                    <canvas></canvas>
                                    <div onClick={handleDownload} className="dl-button">
                                        {checkLanguage({vi : 'Tải xuống ngay' , en : 'Download now'}, language)}
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="poster">
                                    <canvas></canvas>
                                    <div onClick={handleDownload} className="dl-button">
                                        {checkLanguage({vi : 'Tải xuống ngay' , en : 'Download now'}, language)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="kdg-container">
                <div className="block1">
                    <div
                    onClick={()=>history.goBack()}
                    className="back-button">
                        <span className="icon"><FontAwesomeIcon icon={faArrowLeft}/></span>
                        <span className="text"> {checkLanguage({vi : 'Trở về' , en : 'Back'}, language)} </span>
                    </div>
                </div>

                <div className="block2">
                    <div className="title">{checkLanguage({vi : 'Chia sẽ' , en : 'Share'}, language)}</div>
                    <div className="kdg-row">
                        <div className="kdg-col-6">
                            <div className="analytic-child">
                                <div className="left">
                                    <div className="title">
                                        {checkLanguage({vi : 'Tổng Thành Viên' , en : 'Members'}, language)}
                                    </div>
                                    <div className="kdg-row kdg-column-3">
                                        <div className="item">
                                            <div className="level">
                                                <div className="name">{checkLanguage({vi : 'Tầng 1' , en : 'Level 1'}, language)}</div>
                                                <div className="value">10</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="level">
                                                <div className="name">{checkLanguage({vi : 'Tầng 2' , en : 'Level 2'}, language)}</div>
                                                <div className="value">10</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="level">
                                                <div className="name">{checkLanguage({vi : 'Tầng 3' , en : 'Level 3'}, language)}</div>
                                                <div className="value">10</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="title">
                                        {checkLanguage({vi : 'Tổng hoa hồng' , en : 'Reward'}, language)}
                                    </div>
                                    <div className="value">10 KDG</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="staking-share">
            <div className="kdg-container">
                <div className="block3">
                    <div className="title">
                        {checkLanguage({vi : 'LINK/ MÃ GIỚI THIỆU' , en : 'LINK/ REFFERER CODE'}, language)}
                    </div>
                    <div className="block-url">
                        <div className="kdg-row va-t">
                            <div className="kdg-col-5 kdg-pull-1 kdg-push-1">
                                <div className="name">{checkLanguage({vi : 'Link giới thiệu' , en : 'Link refferer'}, language)}</div>
                                <div className="block-content">
                                    <div className="left">
                                        https://www.kingdomgame.org/reg/{user && user.ref_code}
                                    </div>
                                    <div 
                                    onClick={()=>handleCopy(`https://www.kingdomgame.org/reg/${user && user.ref_code}`)}
                                    className="right">
                                        {checkLanguage({vi : 'Sao chép liên kết để mời mọi người' , en : 'Copy refferer link'}, language)}
                                    </div>
                                </div>
                            </div>
                            <div className="kdg-col-4 kdg-push-1">
                                <div className="name">{checkLanguage({vi : 'Mã giới thiệu' , en : 'Refferer code'}, language)}</div>
                                <div className="block-content">
                                    <div className="left">
                                        {user && user.ref_code}
                                    </div>
                                    <div 
                                    onClick={()=>handleCopy(user && user.ref_code)}
                                    className="right">
                                        {checkLanguage({vi : 'Sao chép mã lời mời' , en : 'Copy refferer code'}, language)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div onClick={()=>setVisiblePoster(true)} className="choose-poster">
                            <img src={img_poster} alt=""/>
                            {checkLanguage({vi : 'Chọn poster chia sẻ độc quyền' , en : 'Get sharing poster'}, language)}
                        </div>

                    </div>
                </div>

                <div className="block5">
                    <div className="title">{checkLanguage({vi : 'Xếp HẠNG HOA HỒNG GIỚI THIỆU' , en : 'RANKING REFFERER REWARD'}, language)}</div>
                    <div className="block5-data">
                        <table>
                            <thead>
                                <tr>
                                    <th>{checkLanguage({vi : 'Xếp Hạng' , en : 'Rank'}, language)}</th>
                                    <th>Email</th>
                                    <th>{checkLanguage({vi : 'Số Lời Mời' , en : 'Total Ref'}, language)}</th>
                                    <th>{checkLanguage({vi : 'Tổng hoa hồng' , en : 'Reward'}, language)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    RankingReferer.map((o, index) => {
                                        return <tr>
                                            <td> {checkLanguage({vi : 'Hạng' , en : 'Top'}, language)} {index + 1}</td>
                                            <td> {o.email} </td>
                                            <td> {o.child_user_id.length} </td>
                                            <td> { o.reward } KDG</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="block4">
                    <div className="title">{checkLanguage({vi : 'HOA HỒNG GIỚI THIỆU' , en : 'REFFERER REWARD'}, language)}</div>
                    <div className="list-tab">
                        <div onClick={()=>setType(1)} className={`tab ${Type === 1 ? 'active' : ''}`}>{checkLanguage({vi : 'Kết quả giới thiệu' , en : 'Kết quả giới thiệu'}, language)}</div>
                        <div onClick={()=>setType(2)} className={`tab ${Type === 2 ? 'active' : ''}`}>{checkLanguage({vi : 'Hoa hồng giới thiệu' , en : 'Hoa hồng giới thiệu'}, language)}</div>
                    </div>
                    <div className="block4-data">
                        <table>
                            <thead>
                                {
                                    Type === 1 ? 
                                    <tr>
                                        <th>Email</th>
                                        <th>{checkLanguage({vi : 'Thời gian' , en : 'Time'}, language)}</th>
                                        <th>{checkLanguage({vi : 'Tổng hoa hồng' , en : 'Reward'}, language)}</th>
                                    </tr>
                                    : 
                                    <tr>
                                        <th>{checkLanguage({vi : 'Ngày' , en : 'Date'}, language)}</th>
                                        <th>Email</th>
                                        <th>{checkLanguage({vi : 'Tầng' , en : 'Level'}, language)}</th>
                                        <th>{checkLanguage({vi : 'Tổng hoa hồng' , en : 'Reward'}, language)}</th>
                                    </tr>
                                }
                            </thead>
                            <tbody>
                                {
                                    Type === 1 ? ListChild.map(o => <tr>
                                        <td> {o.email} </td>
                                        <td> {renderDate(o.create_date)} </td>
                                        <td> {o.total * 3 / 100} </td>
                                    </tr>)
                                    : 
                                    ListChild.map(o => {
                                        
                                        var level = o.type ? o.type.replace('ref-staking-level-' , '') : 1
                                        return <tr>
                                            <td> {renderDate(o.create_date)} </td>
                                            <td> {o.from && o.from.email} </td>
                                            <td> {level} </td>
                                            <td> { o.value } </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>

                    </div>
                    <div className="pagination">
                        {
                            Page !== 1 && <span onClick={()=>setPage(Page - 1)}>{checkLanguage({vi : 'Trước' , en : 'Pre'}, language)}</span>
                        }
                        {
                            TotalPage.map( o => <span onClick={()=>setPage(o)} className={Page === o ? 'active' : ''}> {o} </span>)
                        }
                        {
                            Page !== TotalPage[TotalPage.length - 1] && TotalPage.length > 0 && <span onClick={()=>setPage(Page + 1)}>{checkLanguage({vi : 'Sau' , en : 'Next'}, language)}</span>
                        }
                    </div>
                </div>

                <div className="block6">
                    <div className="title">{checkLanguage({vi : 'TỶ LỆ HOA HỒNG' , en : 'REFERER REWARD'}, language)}</div>
                    <div className="content">
                        <p>
                        1) Mỗi người dùng sẽ được cung cấp một link/mã giới thiệu khi đăng ký tài khoản trên kingdomgame.org. Bạn có thể sử dụng link/mã giới thiệu này để mời bạn bè cùng tham gia staking và nhận nhiều ưu đãi hấp dẫn từ KDG.
                        </p>
                        <p className="tab">
                        - Nếu một người dùng sử dụng mã giới thiệu của bạn đăng ký tài khoản và stake, người đó sẽ là thành viên cấp 1 của bạn.
                        </p>
                        <p className="tab">
                        - Nếu một người dùng khác sử dụng mã giới thiệu của thành viên cấp 1 của bạn để đăng ký tài khoản và stake, người đó sẽ là thành viên cấp 2 của bạn.
                        </p>
                        <p className="tab">
                        - Nếu một người dùng khác sử dụng mã giới thiệu của thành viên cấp 2 của bạn để đăng ký tài khoản và stake, người đó sẽ là thành viên cấp 3 của bạn.
                        </p>

                        <p>
                        2) Hoa hồng stake sẽ được ghi có vào Tổng số lợi nhuận của bạn trên trang Staking và cộng trực tiếp vào số dư KDG của bạn ngay lập tức khi các thành viên kích hoạt staking.
                        </p>
                        <p>
                        3) Tỷ lệ hoa hồng giới thiệu bạn nhận được tính như sau:
                        </p>

                        <p className="tab">- F1: <span className="yellow">3%</span></p>
                        <p className="tab">- F2: <span className="yellow">2%</span></p>
                        <p className="tab">- F3: <span className="yellow">1%</span></p>

                        <p><span className="yellow">*** Lưu ý:</span> Để nhận được hoa hồng stake, bạn phải có ít nhất một gói staking đang hoạt động.</p>
                        <p>4) Thưởng cấp bậc: Bạn sẽ được thưởng cấp bậc nếu như đạt đủ điều kiện. </p>
                        <p className="tab yellow">- Level 1: </p>
                        <p className="tab2">+ Đủ 10F1</p>
                        <p className="tab2">+ Tổng doanh số hệ thống đạt: <span className="yellow">100,000 KDG</span></p>
                        <p className="tab2">
                            <FontAwesomeIcon icon={faArrowRight} />
                            <span className="underline">Phần thưởng:</span> <span className="yellow">2,000 KDG</span> được ghi có vào Tổng số lợi nhuận của bạn trên trang Staking và cộng trực tiếp vào số dư KDG của bạn ngay lập tức khi bạn lên level.
                        </p>
                        <p className="tab yellow">- Level 2: </p>
                        <p className="tab2">+ Đủ 10F2</p>
                        <p className="tab2">+ Tổng doanh số hệ thống đạt: <span className="yellow">200,000 KDG</span></p>
                        <p className="tab2">
                            <FontAwesomeIcon icon={faArrowRight} />
                            <span className="underline">Phần thưởng:</span> <span className="yellow">6,000 KDG</span> được ghi có vào Tổng số lợi nhuận của bạn trên trang Staking và cộng trực tiếp vào số dư KDG của bạn ngay lập tức khi bạn lên level.
                        </p>

                        <p className="tab yellow">- Level 3: </p>
                        <p className="tab2">+ Đủ 15F2</p>
                        <p className="tab2">+ Tổng doanh số hệ thống đạt: <span className="yellow">500,000 KDG</span></p>
                        <p className="tab2">
                            <FontAwesomeIcon icon={faArrowRight} />
                            <span className="underline">Phần thưởng:</span> <span className="yellow">25,000 KDG</span> được ghi có vào Tổng số lợi nhuận của bạn trên trang Staking và cộng trực tiếp vào số dư KDG của bạn ngay lập tức khi bạn lên level.
                        </p>
                        <p className="tab yellow">- Đặc biệt </p>
                        <p className="tab2">+ Bất cứ thành viên nào đặt được level 3 và có 3 Level 2 thì được thưởng thêm <span className="yellow">36,000 KDG</span></p>
                        <p><span className="yellow">*** Lưu ý:</span> Để nhận được hoa hồng stake, bạn phải có ít nhất một gói staking đang hoạt động.</p>
                        <p>5) Miễn trừ trách nhiệm:  Chúng tôi  toàn quyền quyết định các điều khoản, thỏa thuận trong chương trình KDG Staking bất kỳ thời điểm nào do các điều kiện thị trường, rủi ro gian lận, và các yếu tố khác có liên quan. </p>
                        <p>6) Cảnh báo rủi ro:  Đầu tư vào tài sản kỹ thuật số đi kèm với rủi ro cao do biến động thị trường. Trước khi đầu tư, hãy chắc chắn rằng bạn hiểu đầy đủ tất cả các rủi ro khi đầu tư vào tài sản kỹ thuật số và chịu mọi trách nhiệm về mọi quyết định đầu tư.</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}