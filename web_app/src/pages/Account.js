import React, { Component } from 'react';
import '../styles/application.css';
import { Layout, Divider, Avatar, Button} from 'antd';

import {auth, database, storage} from '../firebase/firebase';
import {Redirect, Link} from 'react-router-dom';
import * as routes from "../router/routes";

//import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from '../components/account/Change_Password';
import Sidebar from "../components/layout/Sidebar";

/*const AccountPage = (props, { authUser }) =>
  <div>
    <h1>Account: {authUser.email}</h1>
    <PasswordChangeForm />
  </div>

AccountPage.contextTypes = {
  authUser: PropTypes.object,
};*/

class AccountPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            authUser: this.props.authUser,
        }
        this.userRef = database.ref('/users').child('Anonymous');
    }
    componentDidMount(){
        auth.onAuthStateChanged((authUser) => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
            if (authUser) {
                this.userRef = database.ref('users').child(authUser.uid);

                let theEmail='';
                this.userRef.child('email').on('value',(snapshot) =>{
                    theEmail = snapshot.val();
                });
                this.userRef.child('username').on('value',(snapshot) =>{
                    let theUser = snapshot.val();
                    if (theUser){
                        this.setState({theUser});
                    }else{
                        theUser = theEmail;
                        this.setState({theUser});
                    }

                })
                this.userRef.child('role').on('value',(snapshot) =>{
                    const userRole = snapshot.val();
                    this.setState({userRole});
                })
            }
        })
    }


    render(){
        return(
            this.state.authUser
                ? (
                    <Layout>
                        <Sidebar/>
                        <Layout >
                            <div style={{height:'100vh', background: '#fff'}}>
                                <Divider orientation="left" style={{fontSize: '20px', color: '#163774', marginTop:'50px'}}><Avatar size='90' icon="idcard" />   Account Information</Divider>
                                <div style={{paddingLeft : '100px', fontSize:'16px'}}>

                                    <p><b style={{fontWeight:'bold'}}>User Email: </b> {this.state.authUser.email}</p>
                                    <p><b style={{fontWeight:'bold'}}>User Name: </b> {this.state.theUser}</p>
                                    {this.state.userRole == 1 ?
                                        <p><b style={{fontWeight:'bold'}}>User Role: </b>Student</p> : null
                                    }
                                    {this.state.userRole == 2 ?
                                        <p><b style={{fontWeight:'bold'}}>User Role: </b>Instructor</p> : null
                                    }
                                    {this.state.userRole == 3 ?
                                        <p><b style={{fontWeight:'bold'}}>User Role: </b>Lecturer</p> : null
                                    }
                                </div>
                                <Divider orientation="left"
                                style={{fontSize: '20px', color: '#163774'}}><Avatar size='90' icon="safety" />   Security Information</Divider>
                                <div style={{paddingLeft : '100px', fontSize:'16px', width: '400px'}}>
                                    <PasswordChangeForm/>
                                </div>
                            </div>
                        </Layout>
                    </Layout>)
                : (<Redirect to={routes.SIGN_IN}/>)
        )
    }

}

export default AccountPage;

/*<div className="account_row">
                                    <h1 className="account_Title"><b>Account:</b> {this.state.authUser.email}</h1>
                                </div>
                                <div className="account_section">
                                    <div className="App-signUpElements">
                                        <div className="SignUpPart">
                                            <p><b>Change My Password</b></p>
                                            <PasswordChangeForm/>
                                        </div>
                                    </div>
                                </div>*/
                                /*<Avatar style={{ backgroundColor: '#163774', verticalAlign: 'middle' }} size="large">
                                        {this.state.theUser.regexp(/^[A-Z]+$/)}
                                    </Avatar>*/
