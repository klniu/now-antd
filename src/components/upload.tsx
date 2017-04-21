import * as React from 'react';
import {Modal, Alert, Upload, Icon, message} from 'antd';
import {AlertGroup, StringAnyMap, RandomStr} from '../common/commons';
import update from 'immutability-helper';

export interface UploadModalProps {
  url: string;
  show: boolean;
  accept: string;
  mainTip?: string;
  secondaryTip?: string;
  params?: StringAnyMap; // the parameters to request or a function to generate parameters
  multiple?: boolean;
  maxSize?: number;
  onComplete?: () => void;
}

export interface UploadModalStates {
  alertShow: boolean;
  alerts: AlertGroup[];
  parameters: StringAnyMap;
}

export class UploadModal extends React.Component<UploadModalProps, UploadModalStates> {
  state: UploadModalStates = {
    alertShow: false,
    alerts: [],
    parameters: {}
  };

  constructor(props: UploadModalProps) {
    super(props);
  }

  handleChange = (info: StringAnyMap) => {
    let fileList = info.fileList;
    // 读取远程路径并显示链接
    let alerts: AlertGroup[] = [];
    fileList.map((file: StringAnyMap) => {
      let res = file.response;
      if (res) {
        let alert: AlertGroup = {type: 'success', messages: []};
        alert.messages.push('文件：' + file.name, '----------------------------------------');
        // response body is {data: object, msg:""}
        // failure
        if (!res.data) {
          alert.type = 'error';
          // only one msg, display instantly
          if (res.msg.length === 1) {
            alert.messages.push(res.msg[0]);
          } else {
            res.msg.map((text: string) => alert.messages.push(text));
          }
        } else {
          alert.messages.push(res.msg);
        }
        alerts.push(alert);
      }
    });
    if (alerts.length > 0) {
      this.setState({alertShow: true, alerts: alerts});
    }
  };

  handleBeforeUpload = (file: StringAnyMap) => {
    let ext = file.name.split('.').pop().toLowerCase();
    if (!this.props.accept.includes(ext)) {
      message.error('无效的文件类型，文件类型应为：' + this.props.accept, 3);
      return false;
    }
    if (this.props.maxSize && file.size > this.props.maxSize * 1024 * 1024) {
      message.error('文件超过限定大小: ' + this.props.maxSize + 'M', 3);
      return false;
    }
    // add size to the parameter
    let params = this.props.params ? this.props.params : {};
    this.setState({parameters: update(params, {$merge: {size: file.size}})});
    return true;
  };

  onClose = () => {
    this.setState({alertShow: false});
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  };

  render() {
    // progress area style
    let style = {
      width: '100%',
      height: 'auto',
      borderWidth: 1,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5,
      padding: 10,
      display: this.state.alertShow ? 'block' : 'none'
    };
    let alertComponents: JSX.Element[] = [];
    for (let alert of this.state.alerts) {
      let texts: JSX.Element[] = [];
      alert.messages.map((msg) => texts.push(<p key={'alert-text' + msg}>{msg}</p>));
      alertComponents.push((
        <Alert key={'alert' + RandomStr()} type={alert.type} message={texts} closable={true}/>));
    }
    let mainTip = this.props.mainTip ? '点击或将文件拖拽到此区域上传' : this.props.mainTip;
    let secondaryTip = this.props.secondaryTip ? '支持单个或批量上传' : this.props.secondaryTip;
    return (
      <Modal
        visible={this.props.show}
        title="上传文件"
        footer={false}
        onCancel={this.onClose}
        maskClosable={false}
        closable={true}
      >
        <Upload.Dragger
          key={this.props.url}
          action={this.props.url}
          multiple={this.props.multiple}
          data={this.state.parameters}
          accept={this.props.accept}
          onChange={this.handleChange}
          beforeUpload={this.handleBeforeUpload}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox"/>
          </p>
          <p className="ant-upload-text">
            {mainTip}
          </p>
          <p className="ant-upload-hint">
            {secondaryTip}
          </p>
        </Upload.Dragger>
        <div style={style}>
          {alertComponents}
        </div>
      </Modal>
    );
  }
}
