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
import Tree from 'react-d3-tree';
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

const svgSquare = {
    shape: 'rect',
    shapeProps: {
      width: 140,
      height: 60,
      x: -70,
      y: -30,
      fill : '#f1f3f4'
    }
}
export default function App () {
    const history = useHistory()
    const user = useSelector(state=> state.user)
    const language = useSelector(state => state.lang)
    const [Type, setType] = useState(1)
    const [ListChild, setListChild] = useState([])
    const [Page, setPage] = useState(1)
    const [TotalPage, setTotalPage] = useState([1])

    const [TotalRewardFromChild, setTotalRewardFromChild] = useState(0)
    const [RankingReferer, setRankingReferer] = useState([])
    const [VisiblePoster, setVisiblePoster] = useState(false)
    const [VisibleTree, setVisibleTree] = useState(false)
    const [TreeData, setTreeData] = useState([{name : ''}])
    const [CountLevel, setCountLevel] = useState({level1 : 0 , level2 : 0 , level3: 0})
    
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

    const getTreeUser = useCallback(async () => {
        var res = (await callapi().get('/api/tree_child')).data
        var level1 = 0
        var level2 = 0
        var level3 = 0
        const maptree = {
            name : res.data.email,
            nodeSvgShape: {
                shape: 'rect',
                shapeProps: {
                    width: 240,
                    height: 60,
                    x: -120,
                    y: -30,
                    fill : '#f1f3f4'
                },
            },
            children : res.data.child_user_id.map(o1=>{
                level1++
                return {
                    name : o1.email.slice(0,3) + '***' + o1.email.slice(o1.email.indexOf('@') , o1.email.length),
                    children : o1.child_user_id.map(o2 => {
                        level2++
                        return {
                            name : o2.email.slice(0,3) + '***' + o2.email.slice(o2.email.indexOf('@') , o2.email.length),
                            children : o2.child_user_id.map(o3 => {
                                level3++
                                return{
                                    name: o3.email.slice(0,3) + '***' + o3.email.slice(o3.email.indexOf('@') , o3.email.length),
                                }
                            })
                        }
                    })
                }
            })
        }
        setTreeData([{...maptree}])
        setCountLevel({level1, level2,level3})
    },[])

    const getChildUser = useCallback(async()=>{
        var url;
        if(Type === 1) url = `/api/user_child_info?page=${Page}`
        if(Type === 2) url = `/api/reward_from_child?page=${Page}`
        
        const res = (await callapi().get(url)).data
        setListChild(res.data)
        var arr = []
        for (let index = 1; index <= Math.ceil(res.total / 10); index++) {
            arr.push(index)
        }
        setTotalPage([...arr])
    },[Page,Type])

    const getTotalReward = useCallback(async () => {
        const res = (await callapi().get('/api/total_reward_from_child')).data
        setTotalRewardFromChild(res.data)
    },[])

    useMemo(()=>{
        getChildUser()
        getRankingRef()
        getTreeUser()
        getTotalReward()
    },[Page,Type])

    useEffect(() => {
        const canvas = document.querySelectorAll('canvas')
        canvas.forEach((el,index) => {
            
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
        
        <div className="staking-share background">
            <div className={`modal-tree ${VisibleTree ? 'show' : ''}`}>
                <div onClick={()=>setVisibleTree(false)} className="mask"></div>
                <div className="modal-content">
                    <Tree 
                    translate={{x : window.innerWidth / 2, y : window.innerHeight / 2}}
                    textLayout={
                        {
                            textAnchor : "middle",
                            x : 0, y : 0 , transform : undefined
                        }
                    }
                    orientation="vertical"
                    pathFunc="diagonal" data={TreeData} nodeSvgShape={svgSquare}/>
                </div>
            </div>
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
                    <div className="title">{checkLanguage({vi : 'Chia sẻ' , en : 'Share'}, language)}</div>
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
                                                <div className="value"> {CountLevel.level1} </div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="level">
                                                <div className="name">{checkLanguage({vi : 'Tầng 2' , en : 'Level 2'}, language)}</div>
                                                <div className="value"> {CountLevel.level2}</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="level">
                                                <div className="name">{checkLanguage({vi : 'Tầng 3' , en : 'Level 3'}, language)}</div>
                                                <div className="value"> {CountLevel.level3}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="title">
                                        {checkLanguage({vi : 'Tổng hoa hồng' , en : 'Reward'}, language)}
                                    </div>
                                    <div className="value">{TotalRewardFromChild} KDG</div>
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
                        {checkLanguage({vi : 'LINK/ MÃ GIỚI THIỆU' , en : 'LINK/ REFERRER CODE'}, language)}
                    </div>
                    <div className="block-url">
                        <div className="kdg-row va-t">
                            <div className="kdg-col-5 kdg-pull-1 kdg-push-1">
                                <div className="name">{checkLanguage({vi : 'Link giới thiệu' , en : 'Link referrer'}, language)}</div>
                                <div className="block-content">
                                    <div className="left">
                                        https://www.kingdomgame.org/reg/{user && user.ref_code}
                                    </div>
                                    <div 
                                    onClick={()=>handleCopy(`https://www.kingdomgame.org/reg/${user && user.ref_code}`)}
                                    className="right">
                                        {checkLanguage({vi : 'Sao chép liên kết để mời mọi người' , en : 'Copy referrer link'}, language)}
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
                                        {checkLanguage({vi : 'Sao chép mã lời mời' , en : 'Copy referrer code'}, language)}
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
                    <div className="title">{checkLanguage({vi : 'Xếp HẠNG HOA HỒNG GIỚI THIỆU' , en : 'RANKING REFERRER REWARD'}, language)}</div>
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
                    <div className="title">{checkLanguage({vi : 'HOA HỒNG GIỚI THIỆU' , en : 'REFERRER REWARD'}, language)}</div>

                    <div onClick={()=>setVisibleTree(true)} className="open-tree">{checkLanguage({vi : 'Cây hoa hồng' , en : 'Referer tree'}, language)} >></div>

                    <div className="list-tab">
                        <div onClick={()=>setType(1)} className={`tab ${Type === 1 ? 'active' : ''}`}>{checkLanguage({vi : 'Kết quả giới thiệu' , en : 'Inviting record'}, language)}</div>
                        <div onClick={()=>setType(2)} className={`tab ${Type === 2 ? 'active' : ''}`}>{checkLanguage({vi : 'Hoa hồng giới thiệu' , en : 'Earning record'}, language)}</div>
                        <div onClick={()=>setVisibleTree(true)} className="open-tree">{checkLanguage({vi : 'Cây hoa hồng' , en : 'Referer tree'}, language)} >></div>
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
                                            <td> {o.value !== 0 && o.from && o.from.email} </td>
                                            <td> {level} </td>
                                            <td> {o.value !== 0 &&  o.value } </td>
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
                {checkLanguage({vi : '' , en : ''}, language)}
                <div className="block6">
                    <div className="title">{checkLanguage({vi : 'TỶ LỆ HOA HỒNG' , en : 'INVITE REBATE RULE'}, language)}</div>
                    <div className="content">
                        <p>
                        {checkLanguage({vi: '1) Mỗi người dùng sẽ được cung cấp một link/mã giới thiệu khi đăng ký tài khoản trên kingdomgame.org. Bạn có thể sử dụng link/mã giới thiệu này để mời bạn bè cùng tham gia staking và nhận nhiều ưu đãi hấp dẫn từ KDG.', en: '1) Each user will be provided with a link / referral code when registering an account on kingdomgame.org. You can use this link / referral code to invite your friends to participate in Staking program in order to receive many attractive offers from KDG.'}, language)}
                        </p>
                        <p className="tab">
                        {checkLanguage({vi: '- Nếu một người dùng sử dụng mã giới thiệu của bạn đăng ký tài khoản và stake, người đó sẽ là thành viên cấp 1 của bạn.', en: '- If a user uses your referral code to register for an account and stake, that person will be your F1.'}, language)}
                        </p>
                        <p className="tab">
                        {checkLanguage({vi: '- Nếu một người dùng khác sử dụng mã giới thiệu của thành viên cấp 1 của bạn để đăng ký tài khoản và stake, người đó sẽ là thành viên cấp 2 của bạn.', en: "- If another user uses your F2 member's referral code, that person will be your F3."}, language)}
                        </p>
                        <p className="tab">
                        {checkLanguage({vi: '- Nếu một người dùng khác sử dụng mã giới thiệu của thành viên cấp 2 của bạn để đăng ký tài khoản và stake, người đó sẽ là thành viên cấp 3 của bạn.', en: "- If another user uses your F2 member's referral code, that person will be your F3."}, language)}
                        </p>

                        <p>
                        {checkLanguage({vi: '2) Hoa hồng stake sẽ được ghi có vào Tổng số lợi nhuận của bạn trên trang Staking và cộng trực tiếp vào số dư KDG của bạn ngay lập tức khi các thành viên kích hoạt staking.', en: '2) The staking commission will be credited to your Total Profit on the Staking page and added directly to your KDG balance immediately when the members activate staking.'}, language)}
                        </p>
                        <p>
                        {checkLanguage({vi: '3) Tỷ lệ hoa hồng giới thiệu bạn nhận được tính như sau:', en: '3) The referral commission rate you receive is calculated as follows:'}, language)}
                        </p>

                        <p className="tab">- F1: <span className="yellow">3%</span></p>
                        <p className="tab">- F2: <span className="yellow">2%</span></p>
                        <p className="tab">- F3: <span className="yellow">1%</span></p>

                        <p><span className="yellow">{checkLanguage({vi : '*** Lưu ý:' , en : '*** Note:'}, language)}</span> {checkLanguage({vi : 'Để nhận được hoa hồng stake, bạn phải có ít nhất một gói staking đang hoạt động.' , en : 'To receive the rank bonus, you must have at least one active staking package.'}, language)}</p>
                        <p>4) {checkLanguage({vi : 'Thưởng cấp bậc: Bạn sẽ được thưởng cấp bậc nếu như đạt đủ điều kiện.' , en : 'Level Reward: You will be awarded if all conditions are met.'}, language)} </p>
                        <p className="tab yellow">- Level 1: </p>
                        <p className="tab2">+ {checkLanguage({vi : 'Đủ' , en : ''}, language)} 10F1</p>
                        <p className="tab2">+ {checkLanguage({vi : 'Tổng doanh số hệ thống đạt:' , en : 'Investment amount of F1,F2,F3'}, language)} <span className="yellow">100,000 KDG</span></p>
                        <p className="tab2">
                            <FontAwesomeIcon icon={faArrowRight} />
                            <span className="underline">{checkLanguage({vi : 'Phần thưởng:' , en : 'Reward'}, language)}</span> <span className="yellow">2,000 KDG</span> {checkLanguage({vi : 'được ghi có vào Tổng số lợi nhuận của bạn trên trang Staking và cộng trực tiếp vào số dư KDG của bạn ngay lập tức khi bạn lên level.' , en : ' is credited to your Total Profits on the Staking page and added directly to your KDG balance instantly as you level up.'}, language)}
                        </p>
                        <p className="tab yellow">- Level 2: </p>
                        <p className="tab2">+ {checkLanguage({vi : 'Đủ' , en : ''}, language)} 10F2</p>
                        <p className="tab2">+ {checkLanguage({vi : 'Tổng doanh số hệ thống đạt:' , en : 'Investment amount of F1,F2,F3'}, language)} <span className="yellow">200,000 KDG</span></p>
                        <p className="tab2">
                            <FontAwesomeIcon icon={faArrowRight} />
                            <span className="underline">{checkLanguage({vi : 'Phần thưởng:' , en : 'Reward'}, language)}</span> <span className="yellow">6,000 KDG</span> {checkLanguage({vi : 'được ghi có vào Tổng số lợi nhuận của bạn trên trang Staking và cộng trực tiếp vào số dư KDG của bạn ngay lập tức khi bạn lên level.' , en : ' is credited to your Total Profits on the Staking page and added directly to your KDG balance instantly as you level up.'}, language)}
                        </p>

                        <p className="tab yellow">- Level 3: </p>
                        <p className="tab2">+ {checkLanguage({vi : 'Đủ' , en : ''}, language)} 15F2</p>
                        <p className="tab2">+ {checkLanguage({vi : 'Tổng doanh số hệ thống đạt:' , en : 'Investment amount of F1,F2,F3'}, language)} <span className="yellow">500,000 KDG</span></p>
                        <p className="tab2">
                            <FontAwesomeIcon icon={faArrowRight} />
                            <span className="underline">{checkLanguage({vi : 'Phần thưởng:' , en : 'Reward'}, language)}</span> <span className="yellow">25,000 KDG</span> {checkLanguage({vi : 'được ghi có vào Tổng số lợi nhuận của bạn trên trang Staking và cộng trực tiếp vào số dư KDG của bạn ngay lập tức khi bạn lên level.' , en : ' is credited to your Total Profits on the Staking page and added directly to your KDG balance instantly as you level up.'}, language)}
                        </p>
                        <p className="tab yellow">- {checkLanguage({vi : 'Đặc biệt' , en : 'Especially:'}, language)} </p>
                        <p className="tab2">+ {checkLanguage({vi : 'Bất cứ thành viên nào đặt được level 3 và có 3 Level 2 thì được thưởng thêm' , en : 'Anyone who reaches level 3 and has 3 Level 2 will be rewarded with an additional'}, language)} <span className="yellow">36,000 KDG</span></p>
                        <p><span className="yellow">{checkLanguage({vi : '*** Lưu ý:' , en : '*** Note:'}, language)}</span> {checkLanguage({vi : 'Để nhận được hoa hồng stake, bạn phải có ít nhất một gói staking đang hoạt động.' , en : 'To receive the rank bonus, you must have at least one active staking package.'}, language)}</p>
                        <p>{checkLanguage({vi : '5) Miễn trừ trách nhiệm:  Chúng tôi  toàn quyền quyết định các điều khoản, thỏa thuận trong chương trình KDG Staking bất kỳ thời điểm nào do các điều kiện thị trường, rủi ro gian lận, và các yếu tố khác có liên quan. ' , en : '5) Disclaimer: We reserve the right to decide the terms, agreements in the KDG Staking program at any time due to market conditions, fraud risk, and other relevant factors.'}, language)}</p>
                        <p>{checkLanguage({vi : '6) Cảnh báo rủi ro:  Đầu tư vào tài sản kỹ thuật số đi kèm với rủi ro cao do biến động thị trường. Trước khi đầu tư, hãy chắc chắn rằng bạn hiểu đầy đủ tất cả các rủi ro khi đầu tư vào tài sản kỹ thuật số và chịu mọi trách nhiệm về mọi quyết định đầu tư.' , en : '6. Risk warning: Investing in digital assets comes with high risks due to market volatility. Before investing, make sure you fully understand all the risks involved in investing in digital assets and assume all responsibility for any investment decisions.'}, language)}</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}