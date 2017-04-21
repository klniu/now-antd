import * as React from 'react';
import {Input, Form, InputNumber, Select, DatePicker, Cascader, TreeSelect, Checkbox} from 'antd';
import moment from 'moment';
import {CascaderOptionType} from 'antd/lib/cascader';
import {TreeData} from 'antd/lib/tree-select/interface';
import {isArray} from 'util';
import update from 'immutability-helper';
import {StringAnyMap} from './commons';
import {FormItemLabelColOption} from 'antd/lib/form/FormItem';

export interface OptionData {
    title: string;
    value: string | number;
}

// used in form item
export interface ItemLayout {
    labelCol?: FormItemLabelColOption;
    wrapperCol?: FormItemLabelColOption;
}

export interface ColumnField {
    id: string;                     // the id of the input
    type: FieldType;
    label?: string; // the name of the field
    hideLabel?: boolean; // if the label is hidden
    hide?: boolean; // the whole field will be hidden
    defaultValue?: number | string | boolean | moment.Moment[]; // the defaultValue value of the field
    props?: Object;  // the props of input element
    fieldOptions?: StringAnyMap; // ones of getFieldDecorator using.
    // if the data from parent, using with refField, the data need to use from parent, using with refField
    isRefData?: boolean;
    refField?: string; // using with isRefData
    // used as array, object, will expanded according the input element type;
    // if it is a function, it will be executed to get the values.
    // only used in Tree, Cascader, Select, multiSelect
    arrayData?: CascaderOptionType[] | TreeData[] | OptionData[] | (() => CascaderOptionType[] | TreeData[] |
        OptionData[]) ;
    // a function to render defaultData, the first param is the default value,
    // the second is the all form fields
    // the third is the initialData of all form fields
    render?: (val: any, formOptions?: ColumnField[], Data?: StringAnyMap) => any;
    // a function to handle the submit data, the first param is the value of the field
    // the second is the all form fields
    submit?: (val: any, formsOptions?: ColumnField[], Data?: StringAnyMap) => any;
}

export enum FieldType {
    Text, Radio, Select, MultiSelect, Number, Date, DateTime, PlainText, Cascader, TreeSelect, InputNumber,
    DateTimeRange, Password, Checkbox
}

// getFormItems return FormItems according the item config.
// getFieldDecorator is the getFieldDecorator function,
// formOptions is the collection of item configs,
// refData is the parent data of items,
// initData is for initializing the items
// itemOptions is the item options for all the items.
export function getFormItems(getFieldDecorator: Function, formOptions: ColumnField[], refData?: StringAnyMap,
                             initData?: StringAnyMap, formItemLayout?: ItemLayout, itemOptions?: StringAnyMap): any[] {
    let components: any[] = [];
    for (let i = 0, len = formOptions.length; i < len; i++) {
        let v = formOptions[i];
        let element;
        let defaultData;
        // init Data if has
        if (initData && initData[v.id]) {
            defaultData = initData[v.id];
        }
        // for refField, if there are no initData, using referenceData instead,
        // this always happens when adding but not editing
        if (defaultData && v.isRefData && refData && v.refField && refData[v.refField]) {
            defaultData = refData[v.refField];
        }
        // using default data if there is no valid initial data
        if (!defaultData && v.defaultValue) {
            defaultData = v.defaultValue;
        }
        // if there is render function, render it
        if (v.render && typeof v.render === 'function') {
            defaultData = v.render(defaultData, formOptions, initData);
        }

        // handle arrayValues for select, multipleSelect, cascade
        let arrayValues;
        if (v.arrayData && typeof v.arrayData === 'function') {
            arrayValues = v.arrayData();
        } else {
            arrayValues = v.arrayData;
        }

        switch (v.type) {
            case FieldType.Text:
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <Input size="default" {...v.props} />);
                break;
            // input number is the Input element using a type number,not InputNumber,
            // because antd can't trigger OnChange for changing instantly in InputNumber
            case FieldType.InputNumber:
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <Input type="number" size="default" style={{width: '100%'}} {...v.props} />
                );
                break;
            case FieldType.Number:
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <InputNumber size="default" style={{width: '100%'}} {...v.props}/>);
                break;
            case FieldType.PlainText :
                element = <span className="ant-form-text">{defaultData}</span>;
                break;
            case FieldType.Select :
                let options: JSX.Element[] = [];

                if (arrayValues) {
                    let data = arrayValues as OptionData[];
                    for (let opt of data) {
                        options.push((
                            <Select.Option value={opt.value} key={opt.value}>
                                {opt.title}
                            </Select.Option>));
                    }
                }
                // set defaultData "" if not set
                if (!defaultData) {
                    defaultData = '';
                } else {
                    // set to string
                    defaultData += '';
                }
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <Select size="default" {...v.props} >{options}</Select>);
                break;
            case FieldType.MultiSelect:
                let mOptions: JSX.Element[] = [];

                if (arrayValues) {
                    let data = arrayValues as OptionData[];
                    for (let opt of data) {
                        mOptions.push((
                            <Select.Option value={opt.value} key={opt.value}>
                                {opt.title}
                            </Select.Option>));
                    }
                }
                // set defaultData to string[]
                if (isArray(defaultData)) {
                    defaultData = defaultData.map((item: string | number) => '' + item);
                }
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <Select size="default" multiple={true} {...v.props}>
                        {mOptions}
                    </Select>);
                break;
            case FieldType.Date :
                defaultData = defaultData && moment(defaultData);
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <DatePicker size="default" style={{width: '100%'}} {...v.props} />);
                break;
            case FieldType.DateTime :
                defaultData = defaultData && moment(defaultData);
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <DatePicker
                        showTime={true}
                        size="default"
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{width: '100%'}}
                        {...v.props}
                    />);
                break;
            case FieldType.DateTimeRange:
                defaultData = defaultData && moment(defaultData);
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <DatePicker.RangePicker
                        showTime={true}
                        size="default"
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{width: '100%'}}
                        {...v.props}
                    />);
                break;
            case FieldType.Cascader :
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <Cascader
                        style={{width: '100%'}}
                        size="default"
                        {...v.props}
                        options={arrayValues as CascaderOptionType[]}
                    />);
                break;
            case FieldType.TreeSelect :
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <TreeSelect dropdownMatchSelectWidth={false} {...v.props} treeData={arrayValues as TreeData[]}/>);
                break;
            case FieldType.Password :
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <Input type="password" {...v.props}  />);
                break;
            case FieldType.Checkbox :
                element = getFieldDecorator(v.id, {...v.fieldOptions, ...itemOptions, initialValue: defaultData})(
                    <Checkbox> {v.label} </Checkbox>);
                break;
            default:
                break;
        }
        if (v.hideLabel) {
            components.push(
                // set key more unique because sometime the id is same when there are reference data
                <Form.Item key={v.id + v.type} style={v.hide ? {display: 'none'} : {}} {...formItemLayout}>
                    {element}
                </Form.Item>
            );
        } else {
            components.push(
                // set key more unique because sometime the id is same when there are reference data
                <Form.Item
                    key={v.id + v.type}
                    style={v.hide ? {display: 'none'} : {}}
                    {...formItemLayout}
                    label={v.label}
                >
                    {element}
                </Form.Item>
            );
        }
    }
    return components;
}

// execute the submit for every field, convert date to utc
// formOptions is like
export function HandleFormData(values: StringAnyMap, formOptions: ColumnField[]): StringAnyMap {
    // make a new object to include new value
    let params: StringAnyMap = {};
    for (let i = 0, len = formOptions.length; i < len; i++) {
        let v = formOptions[i];
        let value = values[v.id];
        if (v.submit && v.hasOwnProperty('submit')) {
            params[v.id] = v.submit(value, formOptions, values);
        }
    }
    return update(values, {$merge: params});
}
