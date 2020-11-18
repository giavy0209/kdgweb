import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkLanguage, smoothscroll } from '../../helpers';
import { atcChangeLanguage } from '../../store/action';

import menubar from '../../assets/img/menubar.png';
import bgbannerlanding from '../../assets/img/gamehub/bgbannerlanding.png';
import bgbannerpart2 from '../../assets/img/gamehub/bgbannerpart2.png';
import bgbannerpart4 from '../../assets/img/gamehub/bgbannerpart4.png';
import part1 from '../../assets/img/gamehub/part1.png';
import envelop from '../../assets/img/gamehub/envelop.svg';
import check from '../../assets/img/gamehub/check.svg';
import remotecontrolgame from '../../assets/img/gamehub/remotecontrolgame.svg';
import step1 from '../../assets/img/gamehub/step1.svg';
import step2 from '../../assets/img/gamehub/step2.svg';
import step3 from '../../assets/img/gamehub/step3.svg';
import step4 from '../../assets/img/gamehub/step4.svg';

import Menu from '../../components/Menu';
import Footer from '../../components/Footer';
import FormGameHub from './FormGameHub';

import '../../assets/css/gamehub-landing.scss';

const Landing = () => {

    const [visible, setIsvisible] = useState(false);

    const [Type , setType] = useState(0);
    const language = useSelector(state => state && state.lang);

    const dispatch = useDispatch();
    const history = useHistory();
    const email = useSelector(state => {
        return state.settings && state.settings.email && state.settings.email.email;
    });
    const listIcon = useSelector(state => {
        if (state.settings && state.settings.top_icon) {
            var top_icon = state.settings.top_icon;
            var imgStr = 'icontop';
            var linkStr = 'icontoplink';
            var returnArray = [];
            for (let index = 0; true; index++) {
                const img = imgStr + index;
                const link = linkStr + index;
                if (!top_icon[img] || !top_icon[link]) return returnArray;
                else {
                    var obj = {img: top_icon[img], link: top_icon[link]};
                    returnArray.push(obj);
                }
            }
        }
    });

    const logoHeader = useSelector(state => {
        return state && state.settings && state.settings.logo && state.settings.logo.logo_header;
    });


    const textLogo = useSelector(state => {
        return state && state.settings && state.settings.text_next_logo;
    })

    const handleChooseLang = useCallback( lang => {
        dispatch(atcChangeLanguage(lang));
        localStorage.setItem('lang', lang);
    }, [dispatch])

    const setFixMenu = useCallback(() => {
        var menu = document.querySelector('.header .bottom-header');
        document.addEventListener('scroll', e => {
            if (window.scrollY > 200) {
                menu.classList.add('fixed');
            } else {
                menu.classList.remove('fixed');
            }
        });
    }, []);

    const handleScroll = useCallback(type => {
        var track = document.querySelector('.track');
        var itemWidth = track.querySelector('.item').offsetWidth;
        if (type === 0) {
            var targetLeft = Math.floor(track.scrollLeft / itemWidth - 0.0001) * itemWidth;
            smoothscroll(track, track.scrollLeft, targetLeft , 0,0,200);
        } else {
            var targetRight = Math.ceil(track.scrollLeft / itemWidth + 0.0001) * itemWidth;
            smoothscroll(track, track.scrollLeft, targetRight , 0,0,200);
        }
    }, []);

    const openForm = () => setIsvisible(true);

    return(
        <>
            <FormGameHub visible={visible} onCancel={() => setIsvisible(false)} />
            <div className="gamehub-landing">
                <header className="header" style={{backgroundImage: `url(${bgbannerlanding})`}}>
                    <div className="kdg-container">
                        <div className="top-header">
                            <div className="social">
                                {
                                    listIcon && listIcon.map((o, index) =>
                                        (<a target="_blank" rel="noopener noreferrer" href={o.link} key={index}>
                                            <img alt="" src={o.img} />
                                        </a>)
                                    )
                                }
                            </div>
                            <div>
                                <FontAwesomeIcon color="#fac800" icon={faEnvelope}/>
                                <span className="mail">{email}</span>
                            </div>
                            <div className="lang">
                                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                                <FontAwesomeIcon icon={faCaretDown}/>
                                <ul className="dropdown">
                                    <li onClick={()=>handleChooseLang('en')}>EN</li>
                                    <li onClick={()=>handleChooseLang('vi')}>VI</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div onLoad={setFixMenu} className="bottom-header">
                        <div className="kdg-container logo-menu">
                            <span className="menubar"><img src={menubar} alt="" /></span>
                            <a
                                onClick={e => {e.preventDefault();history.push('/')}}
                                className="logo"
                                href="/"
                            >
                                <img alt="KingDomGame" src={logoHeader} />
                            </a>
                            <h1 onClick={e => {e.preventDefault();history.push('/')}}>
                                {checkLanguage(textLogo, language)}
                            </h1>
                            <Menu type={0} />
                        </div>
                    </div>
                    <div className="banner-text">
                        <div className="kdg-container">
                            <div className="banner-text__top">
                                <p>Cơ Hội Mang Sản Phẩm Game Của Bạn Ra Mắt Công Chúng</p>
                                <p>ĐĂNG KÝ LÀM ĐỐI TÁC KINGDOM GAME</p>
                            </div>
                            <div className="banner-text__bottom">
                                <p>Bạn là lập trình viên Game sở hữu những tác phẩm Game tuyệt vời?</p>
                                <p>Vậy bạn có thắc mắc tại sao nên hợp tác với chúng tôi không? Cùng tìm câu trả lời nào!</p>
                            </div>
                        </div>
                    </div>
                    <div className="action">
                        <div className="action__register">
                            <span>Trở thành đối tác của Kingdom Game 4.0</span>
                            <button onClick={openForm}>ĐĂNG KÝ NGAY</button>
                        </div>
                        <div className="action__contact">
                            <div>
                                <p>Liên hệ nhận tư vấn</p>
                                <p>
                                    <img src={envelop} />
                                    <span>contact@kingdomgame.co</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="part1">
                    <div className="kdg-container">
                        <div className="general-title">
                            <h2>HỢP TÁC VỚI CHÚNG TÔI</h2>
                        </div>
                        <div className="part1__body">
                            <div className="part1__body__left">
                                <div className="title">
                                    <span className="title__number">1</span>
                                    <span className="title__text">Chúng tôi sẽ đưa tác phẩm Game của bạn tới tay người dùng cùng với bạn</span>
                                </div>
                                <p className="dot">
                                    Nếu bạn đang có ý định tự <span>xuất bản trò chơi</span> hoặc <span>xây dựng một doanh nghiệp</span> cho riêng mình, đây là một ý tưởng tốt. Bạn có <span>toàn quyền kiểm soát</span> sáng tạo và bạn sẽ kiếm được rất <span>nhiều tiền</span> nếu trò chơi thành công… nhưng nó sẽ đòi hỏi rất nhiều công sức của bạn.
                                </p>
                                <p className="dot">
                                    Còn nếu bạn chỉ muốn thiết kế trò chơi, gửi đến một nhà xuất bản thì Kingdom Game Hub là lựa chọn đúng đắn với bạn. Bởi vì chúng tôi đã có cộng đồng người chơi Game đông đảo trên toàn quốc với hơn 26 nghìn người đăng ký tài khoản, hơn 1200 thành viên tích cực mỗi tháng, mục tiêu 300 nghìn người dùng hết năm 2020.
                                </p>
                                <div className="title">
                                    <span className="title__number">2</span>
                                    <span className="title__text">Chúng tôi sẽ giúp Game của bạn tiếp cận với công nghệ thanh toán mới - Công nghệ Blockchain</span>
                                </div>
                                <p className="dot">
                                    Chúng tôi sở hữu <span>nền tảng Game tiến bộ</span> và đi theo <span>xu thế công nghệ Blockchain</span>. Chúng tôi đã thử nghiệm và áp dụng thành công vào các sản phẩm do chúng tôi phát hành và nhận được sự ủng hộ của cộng đồng.
                                </p>
                                <div className="title">
                                    <span className="title__number">3</span>
                                    <span className="title__text">Người chơi của bạn có thể kiếm thêm thu nhập trong lúc chơi Game</span>
                                </div>
                                <p className="dot">
                                    Đây chính là <span>giá trị lớn nhất</span> chúng tôi cam kết đem lại với bạn. Việc <span>áp dụng Token vào thanh toán</span> trong Game và lợi ích của người chơi là đem chiến lợi phẩm quy đổi thành Token và bán. Chúng tôi đảm bảo sự thanh khoản đó.
                                </p>
                                <div className="title">
                                    <span className="title__number">4</span>
                                    <span className="title__text">Chúng tôi đam mê Game</span>
                                </div>
                                <p className="dot">
                                    Chúng tôi không cố gắng tung ra những trò chơi mà chúng tôi hầu như không biết hoặc không quan tâm. Thay vào đó, chúng tôi tập trung rất nhiều thời gian, năng lượng và tiền bạc vào những trò chơi mà chúng tôi thực sự <span>yêu thích</span>, những trò chơi mà chúng tôi rất vui khi được chia sẻ với thế giới như thể chúng là của riêng chúng tôi. Nếu bạn muốn có <span>niềm đam mê</span> đó và <span>dẫn đầu cuộc chơi</span> của mình, bạn đã đến đúng nơi.
                                </p>
                                <div className="title">
                                    <span className="title__number">5</span>
                                    <span className="title__text">Chúng ta là đối tác, không phải vai trò nhà tuyển dụng - ứng viên</span>
                                </div>
                                <p className="dot">
                                    Chúng tôi muốn tạo ra <span>phiên bản tốt nhất</span> cho trò chơi của bạn. Điều đó có nghĩa là cộng tác với bạn để đảm bảo chúng tôi luôn <span>đúng với tầm nhìn</span> của bạn đồng thời <span>cải thiện và nâng cao</span> các khía cạnh khác nhau của trò chơi. Chúng tôi sẽ hỏi ý kiến, suy nghĩ và sự cho phép của bạn trong suốt quá trình.
                                </p>
                            </div>
                            <div className="part1__body__right">
                                <img src={part1} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="part2">
                    <div className="kdg-container">
                        <div className="general-title">
                            <h2>YÊU CẦU VỀ GAME</h2>
                        </div>
                        <div className="part2__body">
                            <div className="part2__body__box mr-15">
                                <p className="title1">Các loại trò chơi mà chúng tôi quan tâm</p>
                                <p className="title2">Nội dung bạn gửi phải đáp ứng tất cả hoặc hầu hết các tiêu chí sau:</p>
                                <div className="required">
                                    <img src={remotecontrolgame} />
                                    <p>Độ tuổi:</p>
                                    <p>8 - 18 tuổi trở lên</p>
                                </div>
                                <div className="required">
                                    <img src={remotecontrolgame} />
                                    <p>Thể loại:</p>
                                    <p>Đố vui, Mô phỏng thể thao, Đóng Vai,...</p>
                                </div>
                            </div>
                            <div className="part2__body__box">
                                <p className="title1">Các loại trò chơi mà chúng tôi <span>Không</span> quan tâm</p>
                                <p className="title2">Vui lòng không gửi trò chơi từ các danh mục này:</p>
                                <div className="required">
                                    <img src={remotecontrolgame} />
                                    <p>Thể loại:</p>
                                    <p>- Trò chơi không thân thiện: máu, kinh dị, thây ma, bạo lực, chiến tranh,...</p>
                                </div>
                                <div className="required">
                                    <img src={remotecontrolgame} style={{ opacity: '0' }} />
                                    <p style={{ opacity: '0' }}>Thể loại:</p>
                                    <p>- Game bài bạc</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="part2__banner" style={{backgroundImage: `url(${bgbannerpart2})`}}>
                        <div className="kdg-container">
                            <div className="part2__banner__container">
                                <div className="part2__banner__container__text">
                                    <p>Bạn còn chần chờ gì nữa?</p>
                                    <p>Trở thành đối tác của Kingdome Game ngay</p>
                                </div>
                                <div className="part2__banner__container__action">
                                    <button onClick={openForm}>ĐĂNG KÝ NGAY</button>
                                    <p>Chỉ tốn 1 phút để đăng ký</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="part3">
                    <div className="kdg-container">
                        <div className="general-title">
                            <h2>QUY TRÌNH</h2>
                        </div>
                        <div className="part3__body">
                            <div className="part3__body__step mr-50">
                                <img src={step1} />
                                <p>Bước 1</p>
                                <p>Cung Cấp Thông Tin Tại Đây</p>
                                <p>Cơ hội để trở thành đối tác của Kingdome Game chỉ khi bạn hoàn thành form đăng ký của chúng tôi. Vì vậy hay nhanh tay đăng ký <span className="register" onClick={openForm}>tại đây</span> để qua bước 2.</p>
                            </div>
                            <div className="part3__body__step mr-50">
                                <img src={step2} />
                                <p>Bước 2</p>
                                <p>Kiểm Tra Chất Lượng</p>
                                <p>Chúng tôi sẽ kiểm tra tác phẩm của bạn tuyệt vời như thế nào. Sau đó sẽ có người liên hệ với bạn nếu cần làm rõ thêm thông tin. Bước này sẽ <span>kéo dài trong vòng 2 tuần</span>. Bạn vui lòng kiểm tra email sau thời gian này để xem kết quả duyệt.</p>
                            </div>
                            <div className="part3__body__step mr-50">
                                <img src={step3} />
                                <p>Bước 3</p>
                                <p>Hỗ Trợ Kỹ Thuật</p>
                                <p>Đội kỹ thuật sẽ liên hệ để hỗ trợ kỹ thuật <span>tích hợp phương thức thanh toán</span> vào Game nếu Game của bạn vượt qua bước 2.</p>
                            </div>
                            <div className="part3__body__step">
                                <img src={step4} />
                                <p>Bước 4</p>
                                <p>Hoàn Thành</p>
                                <p>Bạn đã trở thành đối tác của KDG và truy cập <a href="https://kingdomgame.org/" target="_blank"><span>kingdomgame.org</span></a> để xem hiển thị Game của bạn trên giao diện người dùng.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="part4" style={{backgroundImage: `url(${bgbannerpart4})`}}>
                    <div className="kdg-container">
                        <div className="part4__header">
                            <p>Trước khi gửi thông tin, vui lòng:</p>
                            <p>Chúng tôi sẽ không xem xét các trò chơi mà không có bộ quy tắc được viết rõ ràng!</p>
                        </div>
                        <div className="part4__body">
                            <div className="part4__body__note mr-30">
                                <img src={check} />
                                <p>Kiểm tra các loại trò chơi của chúng tôi quan tâm nhất để biết được trò chơi của bạn có phù hợp với nền tảng Game của chúng tôi hay không.</p>
                            </div>
                            <div className="part4__body__note mr-30">
                                <img src={check} />
                                <p>Gửi mô tả ngắn gọn về ý tưởng trò chơi, hướng dẫn trò chơi, quy tắc và một hoặc nhiều ảnh Game của bạn dưới định dạng PDF.</p>
                            </div>
                            <div className="part4__body__note">
                                <img src={check} />
                                <p>Vui lòng đảm bảo rằng các quy tắc rõ ràng và dễ hiểu và tốt nhất là có một số ví dụ và hình ảnh minh họa.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    )
}

export default Landing