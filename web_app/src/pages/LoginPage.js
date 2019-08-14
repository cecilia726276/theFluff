import React, { Component } from 'react';
import FluffHeader from '../components/layout/FluffHeader.js';
import Footer from '../components/layout/footer.js';
import Login from '../components/account/Login.js';
import * as routes from '../router/routes.js';
import { Link, withRouter,} from 'react-router-dom';
import { Button } from 'antd';
import '../styles/SignupPage.css'


class LoginPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            content : '',
        }
    }
//I have no idea if inherit "authenticated" work here, because this page is called by router.
    render() {
        return (
            <div>
                <FluffHeader authUser={this.props.authUser}/>
                <div className="Fluff-content" align="center">
                <div className="Fluff-container">
                <div className="Fluff-insidecontainer">
                    <div className="Fluff-introduction">
                    <p><img src="http://gdurl.com/01bZ"/*"http://gdurl.com/nG0G"*/ className="Header-logo" alt="logo" style={{width:100, height:"auto"}}/></p>
                    <p></p>
                    <h3 className="Fluff-title">Sign in to The Fluff</h3>
                    <div className="logo">
                        <img src="http://gdurl.com/e_S5"/*"http://gdurl.com/nG0G"*/ className="Header-logo" alt="logo" style={{width:230, height:"auto"}}/>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>

                    </div><span style={{fontFamily: 'sans-serif'}} className="Signcontent">
                    Collaboration, coursework discussion and study groups amongst likeminded people
                    </span>
                    <p></p>
                    <Link to={routes.SIGN_UP}>
                        <Button variant="raised" color="primary"
                        id="getStarted"
                        label="Get-Started"
                        value="Get-Started"
                        marginTop="normal"
                        >
                            Sign up Instead
                        </Button>
                    </Link>
                    </div>
                    <div className="App-signUpElements">
                        <div className="SignUpPart">
                        <div className="LogInalign">
                            <Login/>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
                <Footer/>
            </div>
        )
    }
}
export default LoginPage;