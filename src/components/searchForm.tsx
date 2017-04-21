import * as React from 'react';
import {Button, Form, Row, Col, Checkbox, Collapse} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import {ColumnField, getFormItems, HandleFormData} from '../common/forms';
import {AlertGroup} from '../common/commons';

export interface SearchFormProps extends FormComponentProps {
    ItemsPerRow: number; // 一行包含的的输入框数量
    formOptions: ColumnField[]
    onComplete: Function
}

interface SearchFormStates {
    loading: boolean
    alerts: AlertGroup[]
    searchButtonDisabled: boolean
}

class SearchForm extends React.Component<SearchFormProps, SearchFormStates> {
    state: SearchFormStates = {
        loading: false,
        alerts: [],
        searchButtonDisabled: true,
    };

    constructor(props: SearchFormProps) {
        super(props);
    }

    handleSubmit = () => {
        this.setState({
            searchButtonDisabled: true
        });
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            HandleFormData(values, this.props.formOptions);
            this.props.onComplete(values);
        });
    };

    handleReset = (e: any) => {
        e.preventDefault();
        this.props.form.resetFields();
    };

    enableSearchButton = () => {
        this.setState({
            searchButtonDisabled: false
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        let formItemLayout = {};
        let itemOptions = {
            onChange: this.enableSearchButton
        };
        // add inputs
        let components = getFormItems(getFieldDecorator, this.props.formOptions, undefined, undefined,
            formItemLayout, itemOptions);
        let cols: JSX.Element[] = [];
        for (let i = 0; i < components.length; i++) {
            cols.push((<Col key={'col' + i}>{components[i]}</Col>));
        }

        let rows: JSX.Element[] = [];
        let rowNum = 0;
        let perRow = this.props.ItemsPerRow;
        while (rowNum * perRow < cols.length) {
            rows.push((
                <Row key={'row' + rowNum}>{cols.slice(rowNum * perRow,
                    Math.min((rowNum + 1) * perRow, cols.length))}</Row>));
            rowNum++;
        }
        const header = <h4>搜索</h4>;
        return (
            <Collapse>
                <Collapse.Panel header={header} key="1">
                    <Form
                        layout="horizontal"
                        onSubmit={this.handleSubmit}
                        className="ant-advanced-search-form"
                    >
                        {rows}
                        <Row>
                            <Col span={12} offset={12} style={{textAlign: 'right'}}>
                                <Form.Item>
                                    <Checkbox
                                        onChange={this.enableSearchButton}
                                        {...getFieldDecorator('Fuzzy', {initialValue: true})}
                                    >模糊搜索
                                    </Checkbox>
                                </Form.Item>
                                <Button
                                    type="primary"
                                    onClick={this.handleSubmit}
                                    disabled={this.state.searchButtonDisabled}
                                >搜索
                                </Button>
                                <Button onClick={(e) => this.handleReset(e)}>清空</Button>
                            </Col>
                        </Row>
                    </Form>
                </Collapse.Panel>
            </Collapse>
        );
    }
}
const Search = Form.create()(SearchForm);
export default Search;
