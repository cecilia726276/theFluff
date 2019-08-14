import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import * as routes from "../router/routes";
import { Button } from 'antd';
export default class Reset_Success extends Component {
    render() {
        return (
            <div style={{textAlign: "center", position: "absolute", top: "25%", left: "25%"}}>
                <p> Check your email for a link to reset your password.
                    If it doesn't appear within a few minutes, check your spam folder. </p>
                <div>
                    <Link to={routes.SIGN_IN}><Button type="primary">Return to Sign In</Button></Link>
                </div>
            </div>

        )
    }
}