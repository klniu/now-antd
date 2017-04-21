import * as React from 'react';
import {Form, Icon, Input, Button, Checkbox, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import reqwest from 'reqwest';
import sha1 from 'sha1';
import {ServerResult} from '../common/commons';
import {FormEvent} from 'react';
import '../styles/user.css';

export interface LoginAndPasswordFormProps extends FormComponentProps {
    operate: 'login' | 'changePass';
    url: string; // url to send request
    jumpUrl: string; // url jumping when successful
}

class LoginAndPasswordForm extends React.Component<LoginAndPasswordFormProps, void> {
    constructor(props: LoginAndPasswordFormProps) {
        super(props);
    }

    handleSubmit = (e: FormEvent<{}>) => {
        e.preventDefault();
        this.props.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            values.password = sha1(values.password);
            this.setState({
                loading: true,
            });
            if (this.props.operate === 'changePass') {
                values.newPass1 = sha1(values.newPass1);
                values.newPass2 = sha1(values.newPass2);
            }
            reqwest({
                url: this.props.url,
                method: 'POST',
                data: values,
                error: (err) => message.error('网络错误，请稍后重试'),
                success: (result: ServerResult) => {
                    if (result.msg !== '') {
                        message.error(result.msg, 7);
                    } else {
                        if (this.props.operate === 'login') {
                            window.location.href = this.props.jumpUrl;
                        } else {
                            message.success('操作成功,3秒后进入主界面', 3);
                            setTimeout(() => {
                                window.location.href = this.props.jumpUrl;
                            }, 3000);
                        }
                    }
                    this.setState({
                        loading: false,
                    });
                }
            });
        });
    };

    checkPass2 = (_rule: Array<any>, value: string, callback: Function) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPass1')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        let components: JSX.Element[] = [];
        if (this.props.operate === 'login') {
            const userNameItem = (
                <Form.Item key="userName">
                    {getFieldDecorator('userName', {
                        rules: [{required: true, min: 2, message: '请输入用户名!'}],
                    })(
                        <Input prefix={<Icon type="user"/>} placeholder="用户名"/>
                    )}
                </Form.Item>);
            const passwordItem = (
                <Form.Item key="password">
                    {getFieldDecorator('password', {
                        rules: [{required: true, min: 6, message: '请输入至少6位长度的密码!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            type="password"
                            placeholder="密码"
                        />
                    )}
                </Form.Item>
            );
            const loginItem = (
                <Form.Item key="loginButton">
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>记住我</Checkbox>
                    )}
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登陆
                    </Button>
                </Form.Item>
            );
            components.push(userNameItem, passwordItem, loginItem);
        } else if (this.props.operate === 'changePass') {
            const originPasswordItem = (
                <Form.Item key="originPass">
                    {getFieldDecorator('password', {
                        rules: [{required: true, min: 6, message: '请输入至少6位长度的原密码!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            type="password"
                            placeholder="原密码"
                        />
                    )}
                </Form.Item>
            );
            const newPassItem1 = (
                <Form.Item key="newPass1">
                    {getFieldDecorator('newPass1', {
                        rules: [{required: true, min: 6, message: '请输入至少6位长度的新密码!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            type="password"
                            placeholder="新密码"
                        />
                    )}
                </Form.Item>
            );
            const newPassItem2 = (
                <Form.Item key="newPass2">
                    {getFieldDecorator('newPass2', {
                        rules: [{required: true, message: '请再次输入至少6位长度的新密码!'}, {validator: this.checkPass2}],
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            type="password"
                            placeholder="新密码"
                        />
                    )}
                </Form.Item>
            );
            const changePassSubmit = (
                <Form.Item key="changePassButton">
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        修改密码
                    </Button>
                </Form.Item>
            );
            components.push(originPasswordItem, newPassItem1, newPassItem2, changePassSubmit);
        }
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                {components}
            </Form>
        );
    }
}

const User = Form.create()(LoginAndPasswordForm);
export default User;