import React, { useEffect, useCallback } from 'react'
import '../../assets/css/homewallet.scss'
import homewalleticon1 from '../../assets/img/homewalleticon1.png'
import homewalleticon2 from '../../assets/img/homewalleticon2.png'
import homewalleticon3 from '../../assets/img/homewalleticon3.png'
import homewalleticon4 from '../../assets/img/homewalleticon4.png'
import appstore from '../../assets/img/appstore.png'
import chplay from '../../assets/img/chplay.png'
import phone from '../../assets/img/phone-wallet.png'
import hightlineFunction from '../../assets/img/highline-function.png'
import hightlineFunction1 from '../../assets/img/highline-function1.png'
import { checkLanguage, smoothscroll } from '../../helpers'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
export default function App(){
    const language = useSelector(state=>state.lang)
    useEffect(()=>{
        
    },[])
    const loadedList = useCallback(()=>{
        var listTitle = document.querySelectorAll('.list-something .something .title')
        var heightest = 0
        listTitle.forEach(el =>{
            if(el.offsetHeight > heightest) heightest = el.offsetHeight
        })
        listTitle.forEach(el =>{
            el.style.height = heightest + 'px'
        })

        var list = document.querySelectorAll('.list-something .something')
        heightest = 0
        list.forEach(el =>{
            if(el.offsetHeight > heightest) heightest = el.offsetHeight
        })
        list.forEach(el =>{
            el.style.height = heightest + 'px'
        })
    })
    const handleClick = useCallback((type)=>{
        var track = document.querySelector('.list-track')
        var itemWidth = track.querySelector('.item').offsetWidth
        if(type === 0){
            var targetLeft = Math.floor(track.scrollLeft / itemWidth - 0.0001) * itemWidth
            smoothscroll(track, track.scrollLeft, targetLeft , 0,0,200)
        }
        if(type === 1){
            var targetRight = Math.ceil(track.scrollLeft / itemWidth + 0.0001) * itemWidth
            smoothscroll(track, track.scrollLeft, targetRight , 0,0,200)
        }
    },[])
    return (
        <>
        <div className="homewallet">
            <div className='kdg-row'>
                <div className="kdg-col-6 left va-t">
                    <h1 className="title">KING WALLET</h1>
                    <p className="des">{checkLanguage({vi: 'Ví đa chức năng tiên phong trong lĩnh vực Game Blockchain và lưu trữ tài sản số', en: 'Multi-function wallet pioneers in the field of Blockchain Game and Digital Asset Storage'},language)}</p>
                    <ul>
                        <li>{checkLanguage({vi: 'An toàn', en: 'Safety'},language)}</li>
                        <li>{checkLanguage({vi: 'Bảo mật cao', en: 'High security'},language)}</li>
                        <li>{checkLanguage({vi: 'Thuận tiện', en: 'Facilitation'},language)}</li>
                    </ul>
                    <div className="store">
                        <img alt="" src={appstore} />
                        <img alt="" src={chplay} />
                    </div>
                </div>
                <div className="kdg-col-6 right va-t text-c">
                    <img alt="" src={phone}/>
                </div>
            </div>
        </div>
        
        <div className="highline-function">
            <div className='top'>
                <img alt="" src={hightlineFunction1} />
                <h2>{checkLanguage({vi: 'KHÁM PHÁ TẠI SAO CHÚNG TÔI KHÁC BIỆT ', en: 'DISCOVER WHY WE ARE UNIQUE'},language)}</h2>
                <p>{checkLanguage({vi: 'King Wallet là ví đa chức năng tiên phong trong lĩnh vực Game Blockchain và lưu trữ tài sản số. Người dùng có thể gửi, nhận, hoán đổi hoặc tham gia Staking tiền điện tử của mình thuận tiện và dễ dàng! King Wallet đáp ứng tất cả nhu cầu của cộng đồng người dùng Game token cũng như các loại tiền điện tử khác.', en: 'King Wallet is a pioneering multi-function wallet in the field of Blockchain Game and Digital Asset Storage. Users can send, receive, swap or participate in their Crypto Staking conveniently and easily! King Wallet meets all the needs of the Game Token community as well as other cryptocurrencies.'},language)}</p>
            </div>
        </div>


        <div className="highline-function">
            <div className='top'>
                <img alt="" src={hightlineFunction} />
                <h2>{checkLanguage({vi: 'TÍNH NĂNG NỔI BẬT', en: 'PROMINENT FEATURES'},language)}</h2>
                <p>{checkLanguage({vi: 'Chúng tôi cung cấp cho bạn một dịch vụ ví ưu việt thế hệ tiếp theo phù hợp với nhu cầu của mọi người dùng Game cũng như cộng đồng người dùng tiền điện tử. Với King Wallet, người dùng còn được tận hưởng nhiều tính năng nổi bật như Staking, Token swap hay cổng Game Hub chuyên biệt cho Game thủ và Nhà phát triển.', en: 'We provide you with a premium next generation wallet service tailored to the needs of all Game users and the Crypto community. With King Wallet, users also enjoy many outstanding features such as Staking, Token Swap or a specialized Game Hub portal for gamers and developers.'},language)}</p>
            </div>
            <div className="block-list-track">
                <FontAwesomeIcon onClick={()=>handleClick(0)} size="2x" className="arrow left" icon={faChevronLeft} />
                <FontAwesomeIcon onClick={()=>handleClick(1)} size="2x" className="arrow right" icon={faChevronRight} />
                <div className="list-track">
                    <div onLoad={loadedList} className="kdg-row kdg-column-4 list-something">
                        <div className="item">
                            <div className="something">
                                <img alt="" src={homewalleticon1} />
                                <h3 className="title">
                                    {checkLanguage({vi: 'HỖ TRỢ GAME TOKEN, TRC-20 VÀ ERC-20 TOKEN', en: 'SUPPORT TOKEN GAME, TRC-20 AND ERC-20 TOKEN'},language)}
                                </h3>
                                <p className="des">
                                    {checkLanguage({vi: 'King Wallet sẽ hỗ trợ lưu trữ KDG, các loại Game token trên nền tảng ERC-20 và TRC-20 Token. Các loại mã token khác sẽ được bổ sung trong tương lai để cho phép người dùng đa dạng hóa danh mục lưu trữ và đầu tư của mình.', en: 'King Wallet will support KDG storage, ERC-20 and TRC-20 Token Game. More tokens will be added in the future to allow users to diversify their storage portfolio and investment.'},language)}
                                </p>
                            </div>
                        </div>
                        <div className="item">
                            <div className="something">
                                <img alt="" src={homewalleticon2} />
                                <h3 className="title">
                                    {checkLanguage({vi: 'GAME HUB', en: 'GAME HUB'},language)}
                                </h3>
                                <p className="des">
                                    {checkLanguage({vi: 'Cổng chuyên biệt về Game ứng cộng công nghệ blockchain và giải pháp thanh toán do Kingdom Game xây dựng và phát triển. GAME HUB cung cấp cho người dùng mảng Game giải trí đa dạng, cung cấp cho các Nhà phát triển một giải pháp chuyên biệt về thanh toán và phát hành sản phẩm. ', en: 'A specialized portal for the Game of Blockchain technology and payment solutions built and developed by Kingdom Game. GAME HUB provides users with a diversified type of Entertainment, providing Developers a specialized solution for payment and product distribution.'},language)}
                                </p>
                            </div>
                        </div>
                        <div className="item">
                            <div className="something">
                                <img alt="" src={homewalleticon3} />
                                <h3 className="title">
                                    {checkLanguage({vi: 'THU NHẬP THỤ ĐỘNG', en: 'PASSIVE INCOME'},language)}
                                </h3>
                                <p className="des">
                                    {checkLanguage({vi: 'Ví đầu tiền hỗ trợ Staking Game token và nhiều loại tiền kỹ thuật số khác để nhận lợi tức. King Wallet cho phép người dùng gia tăng giá trị và số lượng với các loại tiền điện tử mà người dùng đang nắm giữ một cách thuận tiện và an toàn.', en: 'The first wallet supports Staking Game Tokens and many other digital currencies to receive profits. King Wallet allows users to increase the value and quantity with the cryptocurrencies they are holding in a convenient and secure way.'},language)}
                                </p>
                            </div>
                        </div>
                        <div className="item">
                            <div className="something">
                                <img alt="" src={homewalleticon4} />
                                <h3 className="title">
                                    {checkLanguage({vi: 'HOÁN ĐỔI DỄ DÀNG', en: 'EASY TO SWAP'},language)}
                                </h3>
                                <p className="des">
                                    {checkLanguage({vi: 'King Wallet cung cấp cho bạn phương tiện nhanh chóng và dễ dàng để hoán đổi Game token, Tron token cũng như Ethereum token. Các tính năng mới sẽ được cập nhật liên tục và bổ sung thêm nhiều mã token khác trong tương lai để phục vụ nhu cầu người dùng.', en: 'King Wallet provides you with a quick and easy way of swapping Game Tokens, Tron Tokens as well as Ethereum Tokens. New features will be updated continuously and added more tokens in the future to serve the needs of users.'},language)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </>
    )
}