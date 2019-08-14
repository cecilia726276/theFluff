import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../../styles/application.css';
import Input from './Input.js';
import _ from "underscore";
import {Redirect} from 'react-router-dom';
import { SignUpLink } from './SignUp';
import { auth } from '../../firebase/firebase';
import * as routes from '../../router/routes';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

/*
    ***************************************************************************************
    *    Reference
    *    Title: Get Started with Firebase Authentication on Websites
    *    Author: Firebase Documentation
    *    Access Date: 2018
    *    Availability: https://firebase.google.com/docs/auth/web/start
    ***************************************************************************************
*/
//
const LogInPage = ({ history }) =>
  <div>
    <h3>
    </h3>
    <span>
    </span>
    <p>
    </p>
    <Login history={history} />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
    authUser: auth.currentUser,
    //If the user has already signed in, the page will redirect him to dashboard.
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount(){
        auth.onAuthStateChanged((authUser) => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })
    }

    componentWillMount() {
        auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        var canProceed = this.validateEmail(this.state.email)
            && this.refs.password.isValid();

        if(canProceed) {
            const {
                email,
                password,

            } = this.state;


            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    this.setState(() => ({...INITIAL_STATE}));
                    this.props.history.push(routes.HOME);
                })
                .catch(error => {
                    this.setState(byPropKey('error', error));
                });
        }else {
            this.refs.email.isValid();
            this.refs.password.isValid();
        }
      }

    validateEmail = (event) =>{
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(event);
    };

    isEmpty = (value) => {
        return !_.isEmpty(value);
    };

    render () {


        const {
            email,
            password,
            error,
          } = this.state;

        const isInvalid =
            password === '' ||
            email === '';

        return (
            this.state.authUser
                ? (<Redirect to={routes.HOME}/>)
                    :(
                    <div className="create_account_screen">
                     <div className="create_account_form">
                        <form onSubmit={this.onSubmit}>

                        <Input
                            text="Email Address"
                            ref="email"
                            type="text"
                            defaultValue={this.state.email}
                            validate={this.validateEmail}
                            value={email}
                            onChange={event => this.setState(byPropKey('email', event.target.value))}
                            errorMessage="Email is invalid"
                            emptyMessage="Email can't be empty"
                        />

                        <Input
                            text="Password"
                            ref="password"
                            type="password"
                            defaultValue={this.state.password}
                            validate={this.isEmpty}
                            value={password}
                            onChange={event => this.setState(byPropKey('password', event.target.value))}
                            errorMessage="Error"
                            emptyMessage="Password can't be empty"
                        />

                            <button className="button button_wide"
                                    type="submit">
                                LOGIN
                            </button>
                        { error && <p>{error.message}</p> }
                    </form>
                </div>
                <a className="forgotPass"><Link to={routes.PASSWORD_FORGET}><p style={{textAlign: 'center'}}>Forgot your password?</p></Link></a>
            </div>)
        )
    }
}
export default withRouter(LogInPage);

export {
    Login,
  };