import React, { Component } from 'react';
import {auth,database} from '../../firebase/firebase';
import '../../styles/forum.css';
import ContactList from './ContactList.js';
import {Route, Switch} from 'react-router-dom';
import unreadMessages from './unreadMessages.js';
import ChatWindow from "./ChatWindow.js";


const rightDivStyle = { float:'left', width:'80%', background: '#fff', height: 'calc(100vh - 48px)'};
const leftDivStyle = { float:'left', width:'20%', height: 'calc(100vh - 48px)'};
const contactListStyle = {padding:'20px 0 1px 20px', height:'calc(100vh - 108px)', overflowY:'scroll'};
const contactListTitleStyle = {borderWidth:'0.5px', borderStyle:'solid', borderColor:'#d9d9d9', height:'60px', fontSize:'1.15em', padding:'17px 0 0 25px', fontWeight:500, color:'#000000'};

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: auth.currentUser,
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
    }
    state = {
        unreadList: [],
    };

    componentDidMount(){
        this.userRef.on('value',(snapshot) => {
            var judgeUnread = snapshot.child("unread").exists();
            this.setState({judgeUnread});

            if(judgeUnread){
                var unreadNum = snapshot.child("unread").numChildren();
                this.setState({
                    unreadList : snapshot.child("unread").val(),
                    unreadNum,
                });
            }
        })
    }

    render () {
        var _this = this;
        let theList = this.state.unreadList;
        if (!theList) {
            theList=[];
        }
        return (
            <div>
                <div style = {leftDivStyle}>
                    <ContactList/>
                </div>
                <div style = {rightDivStyle}>
                    <Switch>
                        <Route exact path={'/Dashboard/messages'} component={unreadMessages}/>
                        <Route exact path={'/Dashboard/messages/ChatWindow'} component={ChatWindow}/>


                    </Switch>
                </div>

            </div>
        );
    }
}

export default Messages;
