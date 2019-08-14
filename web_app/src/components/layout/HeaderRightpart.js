import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../router/routes';
import { Redirect } from 'react-router-dom';
import {auth} from "../../firebase/index";
import { Button } from 'antd';

class HeaderRightpart extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    componentDidMount(){
        console.log('exampleComponent mounted');
        /*auth.onAuthStateChanged((user)=> {
            if (user){
                this.setState({user});
            }
        })*/
    }


    render() {
        return (
            this.props.authUser
                ? (
                    <div className="Right-login">
                        {this.props.authUser.email}
                        <Link to={routes.LOG_OUT}>
                        <Button type="primary">Log Out</Button></Link>
                        <Link to={routes.ACCOUNT}>
                        <Button type="primary">My Account</Button></Link>
                    </div>
                )
                : (<div className="Right-part">
                        <a className="login_menu" ><Link to={routes.SIGN_UP}>Sign Up </Link></a>/
                        <a className="login_menu" ><Link to={routes.SIGN_IN}>Login </Link></a>
                    </div>)

        )
    }
}
export default HeaderRightpart;