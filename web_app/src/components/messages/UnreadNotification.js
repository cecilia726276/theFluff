import React, { Component } from 'react';
import {auth,database,storage} from '../../firebase/firebase';

const unreadStyle = {position:'relative', left:'25px', padding:'5px', textAlign:'center', fontSize:'1em', color:'#fff', background:'red', height:'10px', width:'10px', borderRadius:'5px'};

class UnreadNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: auth.currentUser,
        };
        //this.userRef = database.ref('users').child(this.state.authUser.uid);
    }

    componentDidMount(){
        if (this.state.authUser === null){

        }else {
            database.ref('users').child(this.state.authUser.uid).on('value', (snapshot) => {
                    var judgeUnread = snapshot.child("unread").exists();
                    this.setState({judgeUnread});
                    if(judgeUnread){
                        var unreadNum = snapshot.child("unread").numChildren();
                        this.setState({unreadNum});
                    }
                });
        }

}

    render() {
        return (
            <span>
                {this.state.judgeUnread == true ?
                    <span style={unreadStyle} >{this.state.unreadNum}</span> : null
                }
            </span>
        );
    }
}

export default UnreadNotification;
