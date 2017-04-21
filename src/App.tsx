import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import User from './components/user';
import IForm from './components/form';
import {formGroupProps} from './data';
import IFormModal from './components/formModal';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import {UploadModal} from './components/upload';
import {Layout, message} from 'antd';
import {default as Header, TitleLink} from './components/header';

class App extends React.Component<{}, {}> {
    render() {
        const links: TitleLink[] = [
            {name: 'Login', link: '/user/Login', iconType: 'setting'},
            {link: '/user/ChangePass', name: 'Change Password'},
            {link: '/Form', name: 'Form'},
            {link: '/FormModal', name: 'FormModal'},
            {link: '/Upload', name: 'Upload'},
            {link: '/message', name: 'TestHeaderOnClick', onClick: () => message.success('successufl')}
        ];
        return (
            <Layout className="App">
                <Router>
                    <div>
                        <Header logoUrl="" titles={links}/>
                        <Route path="/user/Login" component={UserLogin}/>
                        <Route path="/user/ChangePass" component={UserChangePass}/>
                        <Route path="/Form" component={IFormTest}/>
                        <Route path="/FormModal" component={IFormModalTest}/>
                        <Route path="/Upload" component={UploadTest}/>
                    </div>
                </Router>
            </Layout>
        );
    }
}

class UserLogin extends React.Component<any, any> {
    render() {
        return ( <User operate="login" url="/user/login"/> );
    }
}
class UserChangePass extends React.Component<any, any> {
    render() {
        return (<User operate="changePass" url="/user/changePass"/>);
    }
}

class IFormTest extends React.Component<any, any> {
    render() {
        return (
            <Row type="flex" justify="center">
                <Col span={6}>
                    <IForm url="/form/submit" formOptions={formGroupProps}/>
                </Col>
            </Row>
        );
    }
}

class IFormModalTest extends React.Component<any, any> {
    render() {
        return ( <IFormModal show={true} title="Form Modal Test" url="/form/submit" formOptions={formGroupProps}/>);
    }
}

class UploadTest extends React.Component<any, any> {
    render() {
        return ( <UploadModal show={true} url="/upload/submit" accept=".xlsx"/>);
    }
}

export default App;
