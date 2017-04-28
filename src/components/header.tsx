import * as React from 'react';
import {Row, Col, Menu, Icon, Layout} from 'antd';
import {Link} from 'react-router-dom';
const SubMenu = Menu.SubMenu;
import '../styles/header.css';

export interface TitleLink {
    name: string;
    link: string;
    iconType?: string;
    onClick?: () => void;
    children?: TitleLink[];
}
export interface HeaderProps {
    logoUrl: string;
    titles: TitleLink[];
}

export interface HeaderStates {
    currentKey: string;
}

export default class Header extends React.Component<HeaderProps, HeaderStates> {
    state: HeaderStates = {
        currentKey: ''
    };

    // get one level items
    static getMenuItem(title: TitleLink): JSX.Element {
        if (title.iconType) {
            return (
                <Menu.Item key={title.name}>
                    <Link to={title.link}><Icon type={title.iconType}/>{title.name}</Link>
                </Menu.Item>
            );
        } else {
            return (
                <Menu.Item key={title.name}>
                    <Link to={title.link}>{title.name}</Link>
                </Menu.Item>
            );
        }
    }

    constructor(props: HeaderProps) {
        super(props);
    }

    handleClick = (e: any) => {
        this.setState({currentKey: e.key});
        let click = (title) => {
            if (e.key === title.name && title.onClick) {
                title.onClick();
            }
            if (title.children) {title.children.forEach(click); }
        };
        this.props.titles.forEach(click);
    };

    render() {
        let items: JSX.Element[] = [];
        for (let title of this.props.titles) {
            // has child
            if (title.children) {
                let children: JSX.Element[] = [];
                for (let childTitle of title.children) {
                    children.push(Header.getMenuItem(childTitle));
                }
                let titleElem = title.iconType ? (<span><Icon type={title.iconType}/>{title.name}</span>) : title.name;
                items.push((
                    <SubMenu key={title.name} title={titleElem}>{children}</SubMenu>));
            } else {
                items.push(Header.getMenuItem(title));
            }
        }
        return (
            <Layout.Header id="header">
                <Row>
                    <Col lg={4} md={6} sm={7} xs={24}>
                        <Link to="/" className="logo">
                            <img alt="logo" src={this.props.logoUrl}/>
                        </Link>
                    </Col>
                    <Col lg={20} md={18} sm={17} xs={0} style={{display: 'block'}}>
                        <Menu mode="horizontal" theme="light" style={{lineHeight: '64px', fontSize: '16px'}}
                              onClick={this.handleClick} selectedKeys={[this.state.currentKey]}
                              defaultSelectedKeys={['ldar3']} className="nav">
                            {items}
                        </Menu>
                    </Col>
                </Row>
            </Layout.Header>
        );
    }
}
