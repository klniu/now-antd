import * as React from 'react';
import {Alert, Form, message, Button, Row, Col} from 'antd';
import reqwest from 'reqwest';
import {FormComponentProps} from 'antd/lib/form/Form';
import {ColumnField, getFormItems, HandleFormData} from '../common/forms';
import {StringAnyMap, ServerResult} from '../common/commons';
import isEqual from 'lodash/isEqual';

export interface FormGroupProps {
    url: string;
    formOptions: ColumnField[];
    onComplete?: (params?: StringAnyMap) => void;
    displayCancelButton?: boolean;
    onCancel?: (params?: StringAnyMap) => void;
    initData?: StringAnyMap;
    parentData?: StringAnyMap;
}

interface FormGroupStates {
    loading: boolean;
    alertShow: boolean;
    alertMsg: string;
}

interface FormGroupAndAntdProps extends FormGroupProps, FormComponentProps {}

class FormGroup extends React.Component<FormGroupAndAntdProps, FormGroupStates> {
    state: FormGroupStates = {
        loading: false,
        alertShow: false,
        alertMsg: ''
    };

    constructor(props: FormGroupAndAntdProps) {
        super(props);
    }

    componentWillMount() {
        // reset fields when first loads
        this.props.form.resetFields();
        this.setState({
            loading: false,
            alertShow: false
        });
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFieldsAndScroll();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors: any, values: Object) => {
            if (!!errors) {
                return;
            }
            if (isEqual(values, this.props.initData)) {
                return;
            }
            values = HandleFormData(values, this.props.formOptions);
            this.sendRequest(this.props.url, values);
        });
    };

    sendRequest = (url: string, params: Object) => {
        // when there is no url, call onComplete with value
        if (!url || url === '' || url === '#') {
            if (this.props.onComplete) {
                this.props.onComplete(params);
            }
            return;
        }
        this.setState({
            loading: true
        });
        reqwest({
            url: url,
            method: 'POST',
            data: params,
            error: (err) => message.error('网络错误，请稍后重试'),
            success: (result: ServerResult) => {
                if (result.msg !== '') {
                    this.setState({
                        alertMsg: result.msg,
                        alertShow: true
                    });
                } else if (this.props.onComplete) {
                    this.props.onComplete();
                }
                this.setState({
                    loading: false,
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 6,
                offset: 2
            },
            wrapperCol: {
                span: 14,
            },
        };
        // add inputs
        let components = getFormItems(getFieldDecorator, this.props.formOptions,
            this.props.parentData, this.props.initData, formItemLayout);
        let submitButtons: JSX.Element[] = [];
        submitButtons.push((
            <Col key="submit" span={6} offset={9}>
                <Form.Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Col>));
        if (this.props.displayCancelButton) {
            submitButtons.push((
                <Col key="cancel" span={6} offset={3}>
                    <Form.Item>
                        <Button onClick={this.props.onCancel}>提交</Button>
                    </Form.Item>
                </Col>));
        }
        submitButtons.push((<Col key="empty" span={2}/>));
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    {components}
                    <Row type="flex" justify="center">
                        {submitButtons}
                    </Row>
                </Form>
                <div style={{display: this.state.alertShow ? 'block' : 'none'}}>
                    <Alert message={this.state.alertMsg} type="error" showIcon={true}/>
                </div>
            </div>
        );
    }
}

const IForm = Form.create()(FormGroup);
export default IForm;
