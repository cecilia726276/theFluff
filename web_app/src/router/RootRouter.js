import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import LandingPage from '../pages/LandingPage';
import SignupPage from '../pages/SignupPage';
import Account from '../pages/Account'
import Dashboard from '../pages/Dashboard';
import CoursesPage from '../components/forum/coursesPage';
import LoginPage from "../pages/LoginPage";
import Forget_password from "../pages/Forget_Password";
import Reset_Success from "../pages/Reset_Success";
import * as routes from './routes.js';
import Logout from "../pages/Logout";
import history from './history';

class RootRouter extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }
  render() {
    return (
        <BrowserRouter history = {history}>
            <Switch>
                <Route exact path={routes.LANDING}
                component={() => <LandingPage authUser={this.props.authUser}/>}/>
                <Route exact path={routes.SIGN_UP}
                component={() => <SignupPage authUser={this.props.authUser}/>}/>
                <Route exact path={routes.SIGN_IN}
                component={() => <LoginPage authUser={this.props.authUser}/>}/>
                <Route exact path={routes.LOG_OUT}
                       component={() => <Logout authUser={this.props.authUser}/>}/>
                <Route exact path={routes.PASSWORD_FORGET}
                component={() => <Forget_password authUser={this.props.authUser}/>}/>
                <Route exact path={routes.RESET_SUCCESS}
                       component={() => <Reset_Success/>}/>
                <Route path={'/Dashboard'}
                        component={() => <Dashboard authUser={this.props.authUser}/>}/>
                <Route exact path={routes.ACCOUNT}
                component={() => <Account authUser={this.props.authUser}/>}/>


            </Switch>
        </BrowserRouter>
    );
  }
}

export default RootRouter;
/*  <Route exact path={routes.FORUM}
                component={() => <Forum authUser={this.props.authUser}/>}/>*/