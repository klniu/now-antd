import {isNullOrUndefined} from 'util';
import reqwest from 'reqwest';

export interface StringTMap<T> {
    [key: string]: T;
}
export interface NumberTMap<T> {
    [key: number]: T;
}

export interface StringAnyMap extends StringTMap<any> {
}
export interface NumberAnyMap extends NumberTMap<any> {
}

export interface StringStringMap extends StringTMap<string> {
}
export interface NumberStringMap extends NumberTMap<string> {
}

export interface StringNumberMap extends StringTMap<number> {
}
export interface NumberNumberMap extends NumberTMap<number> {
}

export interface StringBooleanMap extends StringTMap<boolean> {
}

export interface NumberBooleanMap extends NumberTMap<boolean> {
}

// golang NullString
export interface NullString {
    String: string;
    Valid: boolean;
}

// server result
export interface ServerResult {
    msg: string;
    data: any;
}

// alert
export interface AlertGroup {
    type: 'success' | 'error' | 'info' | 'warning';
    messages: string[];
}

// getArray assign the array to given variable
export function GetArray(url: string, variable: any[], callback: Function) {
    reqwest({
        method: 'post',
        url: url, success: (result) => {
            variable.splice(0, variable.length);
            Array.prototype.push.apply(variable, result.data);
            return callback(variable);
        }
    });
}

export function GetNullString(val: NullString) {
    if (!isNullOrUndefined(val)) {
        return val.String;
    }
    return '';
}

export function RandomStr() {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
