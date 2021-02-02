import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkLanguage } from '../../helpers';
import { atcChangeLanguage } from '../../store/action';

import menubar from '../../assets/img/menubar.png';
import bgbannerlanding1 from '../../assets/img/gamehub/bgbannerlanding1.png';
import bgbannerlanding2 from '../../assets/img/gamehub/bgbannerlanding2.png';
import bgbannerlanding3 from '../../assets/img/gamehub/bgbannerlanding3.png';
import bgbannerpart2 from '../../assets/img/gamehub/bgbannerpart2.png';
import bgbannerpart5 from '../../assets/img/gamehub/bgbannerpart5.png';
import controlarrowleft from '../../assets/img/gamehub/controlarrowleft.svg';
import controlarrowright from '../../assets/img/gamehub/controlarrowright.svg';
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
    const [indexBanner, setIndexBanner] = useState(1);
    const [visible, setVisible] = useState(false);
    const language = useSelector(state => state && state.lang);
    const dispatch = useDispatch();
    const history = useHistory();
    const email = useSelector(state => {
        return state.settings && state.settings.email && state.settings.email.email;
    });

    useEffect(()=>{ 
        window.scroll(0 , 0)
    },[])

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

    const openForm = () => setVisible(true);

    const changeBanner = i => setIndexBanner(i);

    return(
        <>
            <FormGameHub visible={visible} onCancel={() => setVisible(false)} />
            <div className="gamehub-landing">
                <header className="header" style={{backgroundImage: `url(${indexBanner === 1 ? bgbannerlanding1 : indexBanner === 2 ? bgbannerlanding2 : bgbannerlanding3})`}}>
                    <div className="control-dot">
                        <div className={`control-dot__dot ${indexBanner === 1 ? 'active' : ''}`} onClick={() => changeBanner(1)}></div>
                        <div className={`control-dot__dot ${indexBanner === 2 ? 'active' : ''}`} onClick={() => changeBanner(2)}></div>
                        <div className={`control-dot__dot ${indexBanner === 3 ? 'active' : ''}`} onClick={() => changeBanner(3)}></div>
                    </div>
                    <img alt="" className="control-arrow-left" src={controlarrowleft} onClick={() => {indexBanner === 1 ? setIndexBanner(3) : setIndexBanner(indexBanner - 1)}}></img>
                    <img alt="" className="control-arrow-right" src={controlarrowright} onClick={() => {indexBanner === 3 ? setIndexBanner(1) : setIndexBanner(indexBanner + 1)}}></img>
                    <div className="top-header-header">
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
                                <p>{checkLanguage({vi : 'Cơ Hội Mang Sản Phẩm Game Của Bạn Ra Mắt Công Chúng' , en : 'Opportunity To Bring Your Game Product To The Public' } , language)}</p>
                                <p>{checkLanguage({vi : 'ĐĂNG KÝ LÀM ĐỐI TÁC KINGDOM GAME' , en : 'REGISTERED AS PARTNER OF KINGDOM GAME 4.0' } , language)}</p>
                            </div>
                            <div className="banner-text__bottom">
                                <p>{checkLanguage({vi : 'Bạn là lập trình viên Game sở hữu những tác phẩm Game tuyệt vời?' , en : 'Are you a programmer and own great games? ' } , language)}</p>
                                <p>{checkLanguage({vi : 'Vậy bạn có thắc mắc tại sao nên hợp tác với chúng tôi không? Cùng tìm câu trả lời nào!' , en : "Why are we your perfect partner? Let's find the answer!" } , language)}</p>
                            </div>
                            <button className="button-action" onClick={openForm}>{checkLanguage({vi : "ĐĂNG KÝ NGAY" , en : "REGISTER NOW" } , language)}</button>
                        </div>
                    </div>
                </header>

                <div className="part1">
                    <div className="kdg-container">
                        <div className="general-title">
                            <h2>{checkLanguage({vi : "HỢP TÁC VỚI CHÚNG TÔI" , en : "COOPERATION WITH US" } , language)}</h2>
                        </div>
                        <div className="part1__body">
                            <div className="part1__body__left">
                                <div className="title">
                                    <span className="title__number">1</span>
                                    <span className="title__text">{checkLanguage({vi : "Chúng tôi sẽ đưa tác phẩm Game của bạn tới tay người dùng cùng với bạn" , en : "WE WILL BRING YOUR GAMES TO THE USER'S HANDS BY THE BEST WAY" } , language)}</span>
                                </div>
                                <p className="dot"
                                dangerouslySetInnerHTML={{
                                    __html : checkLanguage({vi : `
                                    Nếu bạn đang có ý định tự <span>xuất bản trò chơi</span> hoặc <span>xây dựng một doanh nghiệp</span> cho riêng mình, đây là một ý tưởng tốt. Bạn có <span>toàn quyền kiểm soát</span> sáng tạo và bạn sẽ kiếm được rất <span>nhiều tiền</span> nếu trò chơi thành công… nhưng nó sẽ đòi hỏi rất nhiều công sức của bạn.
                                    ` , en : `
                                    If you're thinking of publishing your own game or building your own business, this is a good idea. You have full creative control and you'll make a lot of money if your games succeed ... but it will take a lot of effort and time ... 
                                    ` } , language)
                                }}
                                >
                                </p>
                                <p className="dot"
                                dangerouslySetInnerHTML={{
                                    __html : checkLanguage({vi : `
                                    Còn nếu bạn chỉ muốn thiết kế trò chơi, gửi đến một nhà xuất bản thì Kingdom Game Hub là lựa chọn đúng đắn với bạn. Bởi vì chúng tôi đã có cộng đồng người chơi Game đông đảo trên toàn quốc với hơn 26 nghìn người đăng ký tài khoản, hơn 1200 thành viên tích cực mỗi tháng, mục tiêu 300 nghìn người dùng hết năm 2020.
                                    ` , en : `
                                    Or If you just want to design a game, then send it to a publisher, the Kingdom Game Hub is a great choice for you. Because we already have a large national community of gamers with over 26,000 players, more than 1,200 active members per month, our goal is to reach 300,000 by 2020.
                                    ` } , language)
                                }}
                                >
                                </p>
                                <div className="title">
                                    <span className="title__number">2</span>
                                    <span className="title__text">{checkLanguage({vi : "Chúng tôi sẽ giúp Game của bạn tiếp cận với công nghệ thanh toán mới - Công nghệ Blockchain" , en : "WE WILL MAKE YOUR GAME ACCESS TO NEW PAYMENT TECHNOLOGY - BLOCKCHAIN ​​TECHNOLOGY" } , language)}</span>
                                </div>
                                <p className="dot"
                                dangerouslySetInnerHTML={{
                                    __html : checkLanguage({vi : `
                                    Chúng tôi sở hữu <span>nền tảng Game tiến bộ</span> và đi theo <span>xu thế công nghệ Blockchain</span>. Chúng tôi đã thử nghiệm và áp dụng thành công vào các sản phẩm do chúng tôi phát hành và nhận được sự ủng hộ của cộng đồng.
                                    ` , en : `
                                    We own a progressive Game platform and follow the trend of Blockchain technology. We have tested and successfully applied the products which we published and have received the support of the community.
                                    ` } , language)
                                }}
                                >
                                </p>
                                <div className="title">
                                    <span className="title__number">3</span>
                                    <span className="title__text">{checkLanguage({vi : "Người chơi của bạn có thể kiếm thêm thu nhập trong lúc chơi Game" , en : "YOUR PLAYERS CAN MAKE ADDITIONAL INCOME IN THE GAME" } , language)}</span>
                                </div>
                                <p className="dot"
                                dangerouslySetInnerHTML={{
                                    __html : checkLanguage({vi : `
                                    Đây chính là <span>giá trị lớn nhất</span> chúng tôi cam kết đem lại với bạn. Việc <span>áp dụng Token vào thanh toán</span> trong Game và lợi ích của người chơi là đem chiến lợi phẩm quy đổi thành Token và bán. Chúng tôi đảm bảo sự thanh khoản đó.
                                    ` , en : `
                                    This is the greatest value we commit to bring to you. The application of Token to payment in the Game and the player's benefit is to convert the rewards into tokens and sell them. We guarantee that liquidity.
                                    ` } , language)
                                }}
                                >
                                </p>
                            </div>
                            <div className="part1__body__right">
                                <div className="title">
                                    <span className="title__number">4</span>
                                    <span className="title__text">{checkLanguage({vi : "Chúng tôi đam mê Game" , en : "WE LOVE GAME" } , language)}</span>
                                </div>
                                <p className="dot"
                                dangerouslySetInnerHTML={{
                                    __html : checkLanguage({vi : `
                                    Chúng tôi không cố gắng tung ra những trò chơi mà chúng tôi hầu như không biết hoặc không quan tâm. Thay vào đó, chúng tôi tập trung rất nhiều thời gian, năng lượng và tiền bạc vào những trò chơi mà chúng tôi thực sự <span>yêu thích</span>, những trò chơi mà chúng tôi rất vui khi được chia sẻ với thế giới như thể chúng là của riêng chúng tôi. Nếu bạn muốn có <span>niềm đam mê</span> đó và <span>dẫn đầu cuộc chơi</span> của mình, bạn đã đến đúng nơi.
                                    ` , en : `
                                    We don't try to roll out games that we hardly know or care about. Instead, we focus a lot of time, energy, and money on games we really love, games that we are happy to share with the world as if they were our own. If you want to have that passion and stay ahead of your game, you've come to the right place.
                                    ` } , language)
                                }}
                                >
                                </p>
                                <div className="title">
                                    <span className="title__number">5</span>
                                    <span className="title__text">{checkLanguage({vi : "Chúng ta là đối tác, không phải vai trò nhà tuyển dụng - ứng viên" , en : "WE ARE A PARTNER, NOT RECRUITMENT - CANDIDATE ROLE" } , language)}</span>
                                </div>
                                <p className="dot"
                                dangerouslySetInnerHTML={{
                                    __html : checkLanguage({vi : `
                                    Chúng tôi muốn tạo ra <span>phiên bản tốt nhất</span> cho trò chơi của bạn. Điều đó có nghĩa là cộng tác với bạn để đảm bảo chúng tôi luôn <span>đúng với tầm nhìn</span> của bạn đồng thời <span>cải thiện và nâng cao</span> các khía cạnh khác nhau của trò chơi. Chúng tôi sẽ hỏi ý kiến, suy nghĩ và sự cho phép của bạn trong suốt quá trình.
                                    ` , en : `
                                    We want to create the best version of your game. That means working with you to ensure we stay true to your vision, while improving and enhancing various aspects of the game. We will ask for your opinion, thoughts and permission throughout the process.
                                    ` } , language)
                                }}
                                >
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="part2" style={{backgroundImage: `url(${bgbannerpart2})`}}>
                    <div className="kdg-container">
                        <div className="part2__container">
                            <div className="part2__container__text">
                                <p>{checkLanguage({vi : "Bạn còn chần chờ gì nữa?" , en : "WHAT ARE YOU WAITING FOR?" } , language)}</p>
                                <p>{checkLanguage({vi : "Trở thành đối tác của " , en : "Become a partner of " } , language)} <br /> Kingdome Game {checkLanguage({vi : "ngay" , en : "now" } , language)}</p>
                            </div>
                            <div className="part2__container__action">
                                <p>{checkLanguage({vi : "Chỉ tốn 1 phút để đăng ký" , en : "It only takes 1 minute to register" } , language)}</p>
                                <button className="button-action" onClick={openForm}>{checkLanguage({vi : "ĐĂNG KÝ NGAY" , en : "REGISTER NOW" } , language)}</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="part3">
                    <div className="kdg-container">
                        <div className="general-title">
                            <h2>{checkLanguage({vi : "YÊU CẦU VỀ GAME" , en : "GAME REQUIREMENTS" } , language)}</h2>
                        </div>
                        <div className="part3__body">
                            <div className="part3__body__box">
                                <p className="title1">{checkLanguage({vi : "Các loại trò chơi mà chúng tôi quan tâm" , en : "THE TYPES OF GAMES WE ARE INTERESTED" } , language)}</p>
                                <p className="title2">{checkLanguage({vi : "Nội dung bạn gửi phải đáp ứng tất cả hoặc hầu hết các tiêu chí sau:" , en : "The content you submit must meet all or most of the following:" } , language)}</p>
                                <div className="required">
                                    <img alt="" src={remotecontrolgame} />
                                    <p>{checkLanguage({vi : "Độ tuổi:" , en : "Age:" } , language)}</p>
                                    <p>{checkLanguage({vi : "8 - 18 tuổi trở lên" , en : "8 - 18 years old and up" } , language)}</p>
                                </div>
                                <div className="required">
                                    <img alt="" src={remotecontrolgame} />
                                    <p>{checkLanguage({vi : "Thể loại:" , en : "Category: " } , language)}</p>
                                    <p>{checkLanguage({vi : "Đố vui, Mô phỏng, Thể thao, Nhập Vai,..." , en : "Quiz, Simulation, Sports Game, Role-playing Games,..." } , language)}</p>
                                </div>
                            </div>
                            <div className="part3__body__box">
                                <p className="title1">{checkLanguage({vi : "Các loại trò chơi mà chúng tôi Không quan tâm" , en : "TYPES OF GAME WE ARE NOT INTERESTED" } , language)}</p>
                                <p className="title2">{checkLanguage({vi : "Vui lòng không gửi trò chơi từ các danh mục này:" , en : "Please do not submit games from these categories:" } , language)}</p>
                                <div className="required">
                                    <img alt="" src={remotecontrolgame} />
                                    <p>{checkLanguage({vi : "Thể loại:" , en : "Category:" } , language)}</p>
                                    <p>{checkLanguage({vi : "- Trò chơi không thân thiện: máu, kinh dị, thây ma, bạo lực, chiến tranh,..." , en : "- Unfriendly games: blood, horror, zombies, violence, war, ..." } , language)}</p>
                                </div>
                                <div className="required">
                                    <img alt="" src={remotecontrolgame} style={{ opacity: '0' }} />
                                    <p style={{ opacity: '0' }}>Thể loại:</p>
                                    <p>{checkLanguage({vi : "- Game bài bạc" , en : "- Gamble" } , language)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="part4">
                    <div className="kdg-container">
                        <div className="general-title">
                            <h2>{checkLanguage({vi : "QUY TRÌNH" , en : "LISTING PROCEDURE" } , language)}</h2>
                        </div>
                        <div className="part4__body">
                            <div className="part4__body__step">
                                <img alt="" src={step1} />
                                <p>{checkLanguage({vi : "Bước 1" , en : "Step 1" } , language)}</p>
                                <p>{checkLanguage({vi : "Cung Cấp Thông Tin Tại Đây" , en : "Information Providing" } , language)}</p>
                                <p>{checkLanguage({vi : "Cơ hội để trở thành đối tác của Kingdome Game chỉ khi bạn hoàn thành form đăng ký của chúng tôi. Vì vậy hay nhanh tay đăng ký" , en : "The opportunity to become a partner of Kingdome Game 4.0 is only when you complete our registration form." } , language)}C <span className="register" onClick={openForm}>{checkLanguage({vi : "tại đây" , en : "here" } , language)}</span> {checkLanguage({vi : "để qua bước 2." , en : "" } , language)}</p>
                            </div>
                            <div className="part4__body__step">
                                <img alt="" src={step2} />
                                <p>{checkLanguage({vi : "Bước 2" , en : "Step 2" } , language)}</p>
                                <p>{checkLanguage({vi : "Kiểm Tra Chất Lượng" , en : "Quality Cheking" } , language)}</p>
                                <p>{checkLanguage({vi : "Chúng tôi sẽ kiểm tra tác phẩm của bạn tuyệt vời như thế nào. Sau đó sẽ có người liên hệ với bạn nếu cần làm rõ thêm thông tin. Bước này sẽ" , en : "We will check out how wonderful your work is." } , language)} <span>{checkLanguage({vi : "kéo dài trong vòng 2 tuần" , en : "This step will last for 2 weeks" } , language)}</span>. {checkLanguage({vi : "Bạn vui lòng kiểm tra email sau thời gian này để xem kết quả duyệt." , en : " Please check your email after this time to see the results." } , language)}</p>
                            </div>
                            <div className="part4__body__step">
                                <img alt="" src={step3} />
                                <p>{checkLanguage({vi : "Bước 3" , en : "Step 3" } , language)}</p>
                                <p>{checkLanguage({vi : "Hỗ Trợ Kỹ Thuật" , en : "Technical Support" } , language)}</p>
                                <p>{checkLanguage({vi : "Đội kỹ thuật sẽ liên hệ để hỗ trợ kỹ thuật " , en : "Technical team will be in touch to assist with the " } , language)} <span>{checkLanguage({vi : "tích hợp phương thức thanh toán " , en : " integration of payment methods" } , language)}</span> {checkLanguage({vi : "vào Game nếu Game của bạn vượt qua bước 2." , en : " into the Game when you pass the Quality Cheking round." } , language)}</p>
                            </div>
                            <div className="part4__body__step">
                                <img alt="" src={step4} />
                                <p>{checkLanguage({vi : "Bước 4" , en : "Step 4" } , language)}</p>
                                <p>{checkLanguage({vi : "Hoàn Thành" , en : "Finish" } , language)}</p>
                                <p>{checkLanguage({vi : "Bạn đã trở thành đối tác của KDG và truy cập" , en : "Congratulation! You became our KDG partner. Going to" } , language)} <a href="https://kingdomgame.org/" rel="noopener noreferrer" target="_blank"><span>kingdomgame.org</span></a> {checkLanguage({vi : "để xem hiển thị Game của bạn trên giao diện người dùng." , en : "to view your Game in our website and enjoy." } , language)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="part5" style={{backgroundImage: `url(${bgbannerpart5})`}}>
                    <div className="kdg-container">
                        <div className="part5__header">
                            <p>{checkLanguage({vi : "Trước khi gửi thông tin, vui lòng:" , en : "BEFORE SEND INFORMATION, PLEASE:" } , language)}</p>
                            <p>{checkLanguage({vi : "Chúng tôi sẽ không xem xét các trò chơi mà không có bộ quy tắc được viết rõ ràng!" , en : "Check out the game types which we are interested to see if your game is suitable for our platform." } , language)}</p>
                        </div>
                        <div className="part5__body">
                            <div className="part5__body__note">
                                <img alt="" src={check} />
                                <p>{checkLanguage({vi : "Kiểm tra các loại trò chơi của chúng tôi quan tâm nhất để biết được trò chơi của bạn có phù hợp với nền tảng Game của chúng tôi hay không." , en : "Submit a brief description of your game idea, game instructions, rules, and one or more Game photos in PDF format." } , language)}</p>
                            </div>
                            <div className="part5__body__note">
                                <img alt="" src={check} />
                                <p>{checkLanguage({vi : "Gửi mô tả ngắn gọn về ý tưởng trò chơi, hướng dẫn trò chơi, quy tắc và một hoặc nhiều ảnh Game của bạn dưới định dạng PDF." , en : "Submit a brief description of your game idea, game instructions, rules, and one or more Game photos in PDF format." } , language)}</p>
                            </div>
                            <div className="part5__body__note">
                                <img alt="" src={check} />
                                <p>{checkLanguage({vi : "Vui lòng đảm bảo rằng các quy tắc rõ ràng và dễ hiểu và tốt nhất là có một số ví dụ và hình ảnh minh họa." , en : "Please make sure the rules are clear and easy to understand and best of all when there are some examples and illustrations." } , language)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    )
}

export default Landing