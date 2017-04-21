import {ColumnField, FieldType} from './common/forms';

export const formGroupProps: ColumnField[] = [
    {
        id: 'Text',
        type: FieldType.Text,
        label: 'Text',
        defaultValue: 'text',
        render: (val) => 'new' + val,
        submit: (val) => 'new' + val
    }, {
        id: 'PlainText',
        type: FieldType.PlainText,
        label: 'PlainText',
        hideLabel: true,
        defaultValue: 'plainText',
        render: (val) => 'new' + val,
    }, {
        id: 'Checkbox',
        type: FieldType.Checkbox,
        label: 'Checkbox',
        hideLabel: true,
        defaultValue: true,
        render: (val) => 'new' + val,
    }, {
        id: 'InputNumber',
        type: FieldType.InputNumber,
        label: 'Number',
        defaultValue: 1,
    }, {
        id: 'Data',
        type: FieldType.Date,
        label: 'Date',
        defaultValue: '2016-12-12',
    }, {
        id: 'DataTime',
        type: FieldType.DateTime,
        label: 'Date',
        defaultValue: '2016-12-12 12:12:12',
    }, {
        id: 'DataTimeRange',
        type: FieldType.DateTimeRange,
        label: 'DateTimeRange',
    }, {
        id: 'Cascader',
        type: FieldType.Cascader,
        label: 'Cascader',
        arrayData: [{
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [{
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [{
                    value: 'xihu',
                    label: 'West Lake',
                }],
            }],
        }, {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [{
                value: 'nanjing',
                label: 'Nanjing',
                children: [{
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                }],
            }],
        }]
    }, {
        id: 'TreeSelect',
        type: FieldType.TreeSelect,
        label: 'TreeSelect',
        arrayData: [{
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [{
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [{
                    value: 'xihu',
                    label: 'West Lake',
                }],
            }],
        }, {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [{
                value: 'nanjing',
                label: 'Nanjing',
                children: [{
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                }],
            }],
        }]
    }, {
        id: 'Select',
        type: FieldType.Select,
        label: 'Select',
        arrayData: [{
            value: 'zhejiang',
            title: 'Zhejiang',
        }, {
            value: 'jiangsu',
            title: 'Jiangsu',
        }]
    }, {
        id: 'MultiSelect',
        type: FieldType.MultiSelect,
        label: 'MultiSelect',
        arrayData: [{
            value: 'zhejiang',
            title: 'Zhejiang',
        }, {
            value: 'jiangsu',
            title: 'Jiangsu',
        }]
    }, {
        id: 'Password',
        type: FieldType.Password,
        label: 'Password',
    }
];