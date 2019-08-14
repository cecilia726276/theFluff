import React, { Component } from 'react';
import '../../styles/Header&Footer.css';
import { Layout, Menu } from 'antd';
import HeaderRightpart from './HeaderRightpart';
const { Header } = Layout;

class FluffHeader extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

  render() {
    return (
        <Header className="header">
            <div className="logo">
                <img src="http://gdurl.com/IE4m" className="Header-logo" alt="logo" />
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
            >
                <Menu.Item key="1">Features</Menu.Item>
                <Menu.Item key="2">About</Menu.Item>
                <Menu.Item key="3">Contact Us</Menu.Item>
                <HeaderRightpart authUser={this.props.authUser}/>
            </Menu>

        </Header>
        /*
        <div>
            <layout className="Header">
                <img src="http://gdurl.com/nG0G" className="Header-logo" alt="logo" />
                <div className="content">
                    <h1 className="Header-title">The Fluff
                    <a className="menu" href="features.js">Features</a>
                    <a className="menu" href="about.js">About</a>
                    <a className="menu" href="contactUs.js">Contact Us</a>
                    </h1>
                    <div className="Right-part">
                    <a className="login_menu"><Link to={routes.SIGN_UP}>Sign Up </Link></a>/
                    <a className="login_menu"><Link to={routes.SIGN_IN}>Login </Link></a>
                    </div>
                </div>

            </layout>
        </div>
*/
    );
  }
}

export default FluffHeader;
