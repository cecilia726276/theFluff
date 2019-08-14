import React, { Component } from 'react';
import _ from 'underscore';
import Input from './Input.js';
import '../../styles/application.css';
import {Redirect} from 'react-router-dom';
import { Link, withRouter,} from 'react-router-dom';
import * as routes from '../../router/routes.js';
import { auth,database } from '../../firebase/firebase';
import { Radio } from 'antd';
const RadioGroup = Radio.Group;

/*
    ***************************************************************************************
    *    Reference
    *    Title: Get Started with Firebase Authentication on Websites
    *    Author: Firebase Documentation
    *    Access Date: 2018
    *    Availability: https://firebase.google.com/docs/auth/web/start
    ***************************************************************************************
*/

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
  });

const SignUpPage = ({ history }) =>
  <div>
    <h3>
    </h3>
    <span>
    </span>
    <p>
    </p>
    <SignUp history={history} />
  </div>

const INITIAL_STATE = {
    statesValue:null,
    userName: '',
    email: '',
    role:3,
    password: '',
    confirmPassword: '',
    forbiddenWords: ["password"],
    error: null,
    authUser: auth.currentUser,
  };

class SignUp extends Component {
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

    isConfirmedPassword = (event) =>{
        return (event == this.state.password)
    };

    validateEmail = (event) =>{
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(event);
    };
    validateUserName = (event) =>{
      if( event.length > 0 && event.length <= 20)
        return true;
      else return false;
    };
    isEmpty = (value) => {
        return !_.isEmpty(value);
    };

    /*
    ***************************************************************************************
    *    Reference
    *    Title: react-signup-form
    *    Author: Mikhail Proniushkin
    *    Access Date: 2018
    *    Availability: https://github.com/mikepro4/react-signup-form
    ***************************************************************************************
    */
   onSubmit = (event) => {
       event.preventDefault();

       var canProceed = this.validateEmail(this.state.email)
           && this.refs.password.isValid()
           && this.refs.passwordConfirm.isValid();

       if(canProceed) {
           const {
               userName,
               email,
               password,
               role,
           } = this.state;

           const {
               history,
           } = this.props;

           auth.createUserWithEmailAndPassword(email, password)
               .then(authUser => {
                   database.ref('users/' + authUser.uid).set({
                       username: userName,
                       email: email,
                       role: role,
                   });
                   this.setState(() => ({...INITIAL_STATE}));
                   history.push(routes.HOME);
               })
               .catch(error => {
                   this.setState(byPropKey('error', error));
               });
       }else {
           this.refs.email.isValid();
           this.refs.userName.isValid();
           this.refs.password.isValid();
           this.refs.passwordConfirm.isValid();
       }
    }

    render () {
        const {
            userName,
            email,
            password,
            confirmPassword,
            forbiddenWords,
            error,
            role,
        } = this.state;

        /*const isInvalid =
            password !== confirmPassword ||
            password === '' ||
            email === '' ||
            userName === '';*/

        //const Option = Select.Option;

        return (
            this.state.authUser
                ? (<Redirect to={routes.HOME}/>)
            : (<div className="create_account_screen" id="page_border">
                <div className="create_account_form">
                    <form onSubmit={this.onSubmit}>



                        <Input 
                            text="User Name"
                            ref="userName"
                            validate={this.validateUserName}
                            value={userName}
                            onChange={event => this.setState(byPropKey('userName', event.target.value))}
                            type="text"
                            errorMessage="User name max 20 characters"
                            emptyMessage="User name can't be empty"
                            style={{borderBottomColor: 'black',}}
                        />

                        <Input
                            text="Email Address"
                            ref="email"
                            type="text"
                            defaultValue={email}
                            validate={this.validateEmail}
                            value={email}
                            onChange={event => this.setState(byPropKey('email', event.target.value))}
                            errorMessage="Email is invalid"
                            emptyMessage="Email can't be empty"
                        />


                        <Input
                            text="Password"
                            type="password"
                            ref="password"
                            validator="true"
                            minCharacters="8"
                            requireCapitals="1"
                            requireNumbers="1"
                            forbiddenWords={forbiddenWords}
                            value={password}
                            emptyMessage="Password is invalid"
                            onChange={event => this.setState(byPropKey('password', event.target.value))}
                        />

                        <Input
                            text="Confirm password"
                            ref="passwordConfirm"
                            type="password"
                            validate={this.isConfirmedPassword}
                            value={confirmPassword}
                            onChange={event => this.setState(byPropKey('confirmPassword', event.target.value))}
                            emptyMessage="Please confirm your password"
                            errorMessage="Passwords don't match"
                        />


                        <button className="button button_wide"
                            type="submit">
                            CREATE ACCOUNT
                        </button>
                        { error && <p>{error.message}</p> }
                    </form>

                </div>

            </div>)

        );
    }
}
/*
                        <RadioGroup style={{fontWeight:'bold'}}
                                    defaultValue={1}
                                    onChange={event => this.setState(byPropKey('role', event.target.value))}
                                    value={role}>

                            <Radio style={{fontSize:'15px'}} value={3}>Join as Student</Radio>
                            <Radio style={{fontSize:'15px'}} value={2}>Join as Instructor</Radio>
                            <Radio style={{fontSize:'15px'}} value={1}>Join as Lecturer</Radio>
                        </RadioGroup>
 */
/* Henry:
                        <Select
                        defaultValue="Choose a role"
                        >
                            <Option value="disable" disabled>You sign up as a</Option>
                            <Option value="lectuer">Lecturer</Option>
                            <Option value="student">Student</Option>
                            <Option value="tutor">Tutor</Option>
                        </Select>
 */
const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
    SignUp,
    SignUpLink,
  };
