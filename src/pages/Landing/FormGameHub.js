import '../../assets/css/form-gamehub.scss';
import React from 'react';

import { Modal, Form, Input, Select, Checkbox, Button, message } from 'antd';
import callapi from '../../axios';
import { useDispatch, useSelector } from 'react-redux';
import { checkLanguage } from '../../helpers';
import { actChangeLoading } from '../../store/action';

const { Option } = Select;

const device = [
    { value: 'laptop', display: 'Desktop/Laptop' },
    { value: 'mobile', display: 'Smartphone' },
    { value: 'headphone', display: 'Headphones' },
    { value: 'micro', display: 'Micro' },
    { value: 'other', display: 'Khác' },
];
const publicStore = [
    { value: 'ios', display: 'iOS' },
    { value: 'chplay', display: 'CHplay' },
    { value: 'no', display: 'Không' },
];
const typeGame = [
    { value: 'adventure', display: 'Hành động/Phiêu lưu' },
    { value: 'rolePlaying', display: 'Nhập vai' },
    { value: 'simulation', display: 'Mô phỏng' },
    { value: 'tactic', display: 'Chiến thuật' },
    { value: 'sport', display: 'Thể thao' },
    { value: 'boardGame', display: 'Board game' },
    { value: 'puzzle', display: 'Puzzle' },
    { value: 'education', display: 'Giáo dục' },
    { value: 'other', display: 'Khác' },
];
const platform = [
    { value: 'pc', display: 'PC' },
    { value: 'mobile', display: 'Mobile' },
    { value: 'web', display: 'Webgame' },
    { value: 'console', display: 'Console' },
    { value: 'h5', display: 'H5' },
    { value: 'other', display: 'Khác' },
];
const old = [
    { value: 'under18', display: 'Dưới 18 tuổi' },
    { value: '18to25', display: 'Từ 18 đến 25 tuổi' },
    { value: '26to35', display: 'Từ 26 đến 35 tuổi' },
    { value: 'above35', display: 'Trên 35 tuổi' },
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
        return lists.map(list => <Option key={list.value} value={list.value}>{list.display}</Option>)
    }

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={1088}
            className="modal-form-gamehub"
        >
            <p className="title">ĐĂNG KÝ</p>
            <p className="desc">Bây giờ bạn đã sẵn sàng để điền vào biểu mẫu gửi!</p>
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
                                    message: 'Tên không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Tên (*)" />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Địa chỉ không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Địa chỉ (*)" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mô tả Game không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Mô tả Game (*)" />
                        </Form.Item>

                        <Form.Item
                            name="mechanics"
                            rules={[
                                {
                                    required: true,
                                    message: 'Cơ chế Game không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Cơ chế Game (*)" />
                        </Form.Item>

                        <Form.Item
                            name="device"
                            rules={[
                                {
                                    required: true,
                                    message: 'Game phổ biến không được để trống!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Game bạn giống Game nào phổ biến? (*)"
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
                                    message: 'Thích phần nào nhất trong Game không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Bạn thích phần nào nhất trong Game của mình? (*)" />
                        </Form.Item>

                        <Form.Item
                            name="publicStore"
                            rules={[
                                {
                                    required: true,
                                    message: 'Game phổ biến không được để trống!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Game của bạn đã có trên CHplay hoặc iOS chưa? (*)"
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                            >
                                {renderOption(publicStore)}
                            </Select>
                        </Form.Item>

                        <Form.Item name="note">
                            <Input type="text" placeholder="Ghi chú" />
                        </Form.Item>
                    </div>
                    <div className="right">
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Email không được để trống!',
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
                                    message: 'Tên Game không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Tên Game (*)" />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Loại Game không được để trống!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Loại Game (*)"
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
                                    message: 'Game chơi trên nền tảng nào không được để trống!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Game chơi trên nền tảng nào? (*)"
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
                                    message: 'Tuổi và nhóm khách hàng hướng tới là ai không được để trống!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Tuổi và nhóm khách hàng hướng tới là ai? (*)"
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
                                    message: 'Game của bạn có gì nổi bật không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Game của bạn có gì nổi bật? (*)" />
                        </Form.Item>

                        <Form.Item
                            name="different"
                            rules={[
                                {
                                    required: true,
                                    message: 'Sự khác biệt của Game không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Sự khác biệt của Game bạn với những Game khác là gì? (*)" />
                        </Form.Item>

                        <Form.Item
                            name="link"
                            rules={[
                                {
                                    required: true,
                                    message: 'Link video giới thiệu Game không được để trống!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Link video giới thiệu Game (*)" />
                        </Form.Item>
                    </div>
                </div>

                <Checkbox checked>Tôi đồng ý với các điều khoản và điều kiện được nêu trong <a className="link-confirm">Chính sách bảo mật</a>.</Checkbox>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button onClick={onSubmit} className="formgamehub-button">GỬI</Button>
                </div>
            </Form>
        </Modal>
    );
}

export default FormGameHub;