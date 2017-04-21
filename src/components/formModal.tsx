import * as React from 'react';
import {Modal, Form} from 'antd';
import {FormGroupProps, default as IForm} from './form';
import {FormComponentProps} from 'antd/lib/form/Form';

export interface FormModalProps extends FormGroupProps {
    show: boolean;
    title: string;
}

interface FormModalStates {
    show: boolean;
}

interface FormModalAndAntdProps extends FormModalProps, FormComponentProps {
}

class FormModal extends React.Component<FormModalAndAntdProps, FormModalStates> {
    state: FormModalStates = {
        show: this.props.show
    };

    constructor(props: FormModalAndAntdProps) {
        super(props);
    }

    componentWillReceiveProps(nextProps: FormModalProps) {
        if (nextProps.show !== this.state.show) {
            this.setState({show: nextProps.show});
        }
    }

    Cancel = () => {
        this.setState({show: false});
    };

    render() {
        return (
            <Modal visible={this.state.show} footer="" title={this.props.title} maskClosable={true}
                   onCancel={this.Cancel}>
                <IForm {...this.props} displayCancelButton={true} onCancel={this.Cancel}/>
            </Modal>
        );
    }
}

const IFormModal = Form.create()(FormModal);
export default IFormModal;
