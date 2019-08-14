import React, { Component } from 'react';
import FluffHeader from '../components/layout/FluffHeader.js';
import SignUp from '../components/account/SignUp.js';
import Footer from '../components/layout/footer.js';
import * as routes from '../router/routes.js';
import { Link, withRouter,} from 'react-router-dom';
import { Button } from 'antd';
import '../styles/SignupPage.css'

class SignupPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            content : '',
        }
    }

    render() {
        return (
            <div>
                <FluffHeader authUser={this.props.authUser}/>
                <div className="Fluff-content" align="center">
                <div className="Fluff-container">
                <div className="Fluff-insidecontainer">
                    <div className="Fluff-introduction">
                    <p><img src="http://gdurl.com/01bZ"/*"http://gdurl.com/nG0G"*/ className="Header-logo" alt="logo" style={{width:100, height:"auto"}}/></p>
                    <h3 className="Fluff-title">Create your Fluff Account</h3>
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
                    <Link to={routes.SIGN_IN}>
                        <Button variant="raised" color="primary"
                        id="getStarted"
                        label="Get-Started"
                        value="Get-Started"
                        marginTop="normal"
                        >
                            Sign in Instead
                        </Button>
                    </Link>
                    </div>
                    <div className="App-signUpElements">
                        <div className="SignUpPart">
                            <SignUp/>
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
export default SignupPage;
