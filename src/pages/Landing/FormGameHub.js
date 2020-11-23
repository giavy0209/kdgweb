import '../../assets/css/form-gamehub.scss';
import React from 'react';

import { Modal, Form, Input, Select, Checkbox, Button, message } from 'antd';
import callapi from '../../axios';
import { useDispatch, useSelector } from 'react-redux';
import { checkLanguage } from '../../helpers';
import { actChangeLoading } from '../../store/action';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const device = [
    { value: 'laptop', display: {
        vi : 'Desktop/Laptop' ,
        en : 'Desktop/Laptop' 
    }},
    { value: 'mobile', display: {
        vi : 'Smartphone' ,
        en : 'Smartphone' 
    }},
    { value: 'headphone', display: {
        vi : 'Headphones' ,
        en : 'Headphones' 
    }},
    { value: 'micro', display: {
        vi : 'Micro' ,
        en : 'Micro' 
    }},
    { value: 'other', display: {
        vi : 'Khác' ,
        en : 'Other' 
    }},
];
const publicStore = [
    { value: 'ios', display: {
        vi : 'iOS' ,
        en : 'iOS' 
    }},
    { value: 'chplay', display: {
        vi : 'CHplay' ,
        en : 'CHplay' 
    }},
    { value: 'no', display: {
        vi : 'Không' ,
        en : 'No' 
    }},
];
const typeGame = [
    { value: 'adventure', display: {
        vi : 'Hành động/Phiêu lưu' ,
        en : 'Hành động/Phiêu lưu' 
    }},
    { value: 'rolePlaying', display: {
        vi : 'Nhập vai' ,
        en : 'Nhập vai' 
    }},
    { value: 'simulation', display: {
        vi : 'Mô phỏng' ,
        en : 'Mô phỏng' 
    }},
    { value: 'tactic', display: {
        vi : 'Chiến thuật' ,
        en : 'Chiến thuật' 
    }},
    { value: 'sport', display: {
        vi : 'Thể thao' ,
        en : 'Thể thao' 
    }},
    { value: 'boardGame', display: {
        vi : 'Board game' ,
        en : 'Board game' 
    }},
    { value: 'puzzle', display: {
        vi : 'Puzzle' ,
        en : 'Puzzle' 
    }},
    { value: 'education', display: {
        vi : 'Giáo dục' ,
        en : 'Giáo dục' 
    }},
    { value: 'other', display: {
        vi : 'Khác' ,
        en : 'Khác' 
    }},
];
const platform = [
    { value: 'pc', display: {
        vi : 'PC' ,
        en : 'PC' 
    }},
    { value: 'mobile', display: {
        vi : 'Mobile' ,
        en : 'Mobile' 
    }},
    { value: 'web', display: {
        vi : 'Webgame' ,
        en : 'Webgame' 
    }},
    { value: 'console', display: {
        vi : 'Console' ,
        en : 'Console' 
    }},
    { value: 'h5', display: {
        vi : 'H5' ,
        en : 'H5' 
    }},
    { value: 'other', display: {
        vi : 'Khác' ,
        en : 'Khác' 
    }},
];
const old = [
    { value: 'under18', display: {
        vi : 'Dưới 18 tuổi' ,
        en : 'Dưới 18 tuổi' 
    }},
    { value: '18to25', display: {
        vi : 'Từ 18 đến 25 tuổi' ,
        en : 'Từ 18 đến 25 tuổi' 
    }},
    { value: '26to35', display: {
        vi : 'Từ 26 đến 35 tuổi' ,
        en : 'Từ 26 đến 35 tuổi' 
    }},
    { value: 'above35', display: {
        vi : 'Trên 35 tuổi' ,
        en : 'Trên 35 tuổi' 
    }},
];

const FormGameHub = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const language = useSelector(state => state.lang)
    const onSubmit = () => {
        form.validateFields()
        .then(async (values) => {
            dispatch(actChangeLoading(true))
            try {
                const res = (await callapi().post('/api/gamehub',values)).data
                if(res.status === 1) {
                    form.resetFields();
                    onCancel();
                    message.success(checkLanguage({
                        vi : 'Gửi thông tin thành công, vui lòng chờ nhân viên liên hệ',
                        en : 'Submit info successfully, please wait for contact from our staff'
                    }, language))
                }else{
                    message.error(checkLanguage({
                        vi : 'Gửi thông tin không thành công, vui lòng kiểm tra lại thông tin',
                        en : 'Submit info fail, please check your info and submit again'
                    }, language))
                }

                
            } catch (error) {
                message.error(checkLanguage({
                    vi : 'Gửi thông tin không thành công, vui lòng kiểm tra lại thông tin',
                    en : 'Submit info fail, please check your info and submit again'
                }, language))
            }
            dispatch(actChangeLoading(false))
        })
        .catch((info) => {
            console.log('Validate Failed:', info);
        });
    }

    const renderOption = lists => {
        return lists.map(list => <Option key={list.value} value={list.value}>{checkLanguage(list.display , language)}</Option>)
    }

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={1088}
            className="modal-form-gamehub"
        >
            {checkLanguage({vi : "" , en : "" } , language)}
            <p className="title">{checkLanguage({vi : "ĐĂNG KÝ" , en : "REGISTRATION" } , language)}</p>
            <p className="desc">{checkLanguage({vi : "Bây giờ bạn đã sẵn sàng để điền vào biểu mẫu gửi!" , en : "Now you are ready to fill out the submission form!" } , language)}</p>
            <Form
                form={form}
                name="form-game-hub"
            >
                <div className="form-container">
                    <div className="left">
                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Tên không được để trống!" , en : "Name cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Tên (*)" , en : "Name"}, language)} />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Địa chỉ không được để trống!" , en : "Address cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Địa chỉ (*)" , en : "Address"}, language)} />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Mô tả Game không được để trống!" , en : "Game description cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Mô tả Game (*)" , en : "Game Description"}, language)} />
                        </Form.Item>

                        <Form.Item
                            name="mechanics"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Cơ chế Game không được để trống!" , en : "Game mechanism cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Cơ chế Game (*)" , en : "Game Mechanism"}, language)} />
                        </Form.Item>

                        <Form.Item
                            name="device"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Bạn phải chọn 1 trường" , en : "You have to select"}, language)
                                },
                            ]}
                        >
                            <Select
                                placeholder={checkLanguage({vi : "Game bạn giống Game nào phổ biến? (*)" , en : "Which popular games does your game like?"},language)}
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                            >
                                {renderOption(device)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="favorite"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Thích phần nào nhất trong Game không được để trống!" , en : "The part of your Game do you like best cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Bạn thích phần nào nhất trong Game của mình? (*)" , en : "Which part of your Game do you like best?"}, language)} />
                        </Form.Item>

                        <Form.Item
                            name="publicStore"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Bạn phải chọn ít nhất 1 trường" , en : "You have to choose one"}, language)
                                },
                            ]}
                        >
                            <Select
                                placeholder={checkLanguage({vi : "Game của bạn đã có trên CHplay hoặc iOS chưa? (*)" , en : "Is your game available on CHplay or iOS yet?"},language)}
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                            >
                                {renderOption(publicStore)}
                            </Select>
                        </Form.Item>

                        <Form.Item name="note">
                            <Input type="text" placeholder={checkLanguage({vi : "Ghi chú" , en : "Note"}, language)} />
                        </Form.Item>
                    </div>
                    <div className="right">
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Email không được để trống!" , en : "Email cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="email" placeholder="Email (*)" />
                        </Form.Item>

                        <Form.Item
                            name="nameGame"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Tên Game không được để trống!" , en : "Game's name cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Tên Game (*)" , en : "Your Game's Name"}, language)} />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Loại Game không được để trống!" , en : "Game type cannot empty"}, language)
                                },
                            ]}
                        >
                            <Select
                                placeholder={checkLanguage({vi : "Loại Game (*)" , en : "Game Type"},language)}
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                            >
                                {renderOption(typeGame)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="platform"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Game chơi trên nền tảng nào không được để trống!" , en : "Platform cannot empty"}, language)
                                },
                            ]}
                        >
                            <Select
                                placeholder={checkLanguage({vi : "Game chơi trên nền tảng nào? (*)" , en : "Which platform is the game played on?"},language)}
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                            >
                                {renderOption(platform)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="old"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Tuổi và nhóm khách hàng hướng tới là ai không được để trống!" , en : "Target cannot empty"}, language)
                                },
                            ]}
                        >
                            <Select
                                placeholder={checkLanguage({vi : "Tuổi và nhóm khách hàng hướng tới là ai? (*)" , en : "Who is your target players?"},language)}
                                allowClear
                                style={{ width: '100%' }}
                            >
                                {renderOption(old)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="highlight"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Game của bạn có gì nổi bật không được để trống!" , en : "Outstanding about your game cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Game của bạn có gì nổi bật? (*)" , en : "What's outstanding about your game?"}, language)} />
                        </Form.Item>

                        <Form.Item
                            name="different"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Sự khác biệt của Game không được để trống!" , en : "Your difference cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Sự khác biệt của Game bạn với những Game khác là gì? (*)" , en : "What is the difference of your Game from others?"}, language)} />
                        </Form.Item>

                        <Form.Item
                            name="link"
                            rules={[
                                {
                                    required: true,
                                    message: checkLanguage({vi : "Link video giới thiệu Game không được để trống!" , en : "Link video cannot empty"}, language)
                                },
                            ]}
                        >
                            <Input type="text" placeholder={checkLanguage({vi : "Link video giới thiệu Game (*)" , en : "Link video introduces Game"}, language)} />
                        </Form.Item>
                    </div>
                </div>

                <Checkbox checked>{checkLanguage({vi : "Tôi đồng ý với các điều khoản và điều kiện được nêu trong " , en : "I agree to the "}, language)}<a href="/terms-of-service/2" target="_blank" className="link-confirm">{checkLanguage({vi : "Chính sách bảo mật" , en : "terms and conditions in the Privacy Policy."}, language)}</a>.</Checkbox>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button onClick={onSubmit} className="formgamehub-button">{checkLanguage({vi : 'GỬI' , en : 'SEND'}, language)} </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default FormGameHub;