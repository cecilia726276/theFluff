import React, { Component } from 'react';
import {auth,database,storage} from '../../firebase/firebase';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { Divider, Card} from 'antd';
import {Link} from 'react-router-dom';

function timeStyle(time){
    const Time = (new Date(new Date(Date.parse(JSON.parse(time))))).toString();
    let PostTime = Time.substring(0, Time.indexOf(" GMT")-3);
    return PostTime
}

const contactListTitleStyle = {borderWidth:'0.5px', borderStyle:'solid', borderColor:'#d9d9d9', height:'60px', fontSize:'1.15em', padding:'17px 0 0 25px', fontWeight:500, color:'#000000'};
const unreadListStyle = {float:'left', width:'90%', minHeight:'30px', padding:'10px', borderStyle:'solid',borderWidth:'1px'};
class unreadMessages extends Component {
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
            let judgeUnread = snapshot.child("unread").exists();
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

    handleClick= (key) =>{
        database.ref('/users/' + this.state.authUser.uid + '/unread').child(key).remove();
    }

    timeStyle = (time) => {
        const Time = (new Date(new Date(Date.parse(JSON.parse(time))))).toString();
        let postTime = Time.substring(0, Time.indexOf(" GMT")-3);
        return postTime;
    }

    render () {
        let _this = this;
        let theList = this.state.unreadList;
        if (!theList) {
            theList=[];
        }
        return (
            <div>
                    <div style={contactListTitleStyle}>Unread Messages</div>
                    <Card style={{height:'calc(100vh - 110px'}}>
                        <p>You have {_this.state.judgeUnread === true ?
                            <span style={{fontWeight: 'bold'}}>{_this.state.unreadNum}</span> : 0}
                            &nbsp;unread messages. Please click on the messages below to open up the chat window.
                        </p>
                        {Object.keys(theList).map(function (key) {
                            return (
                                <div key={key}>
                                    <div>
                                        {
                                            <Link to={{
                                                pathname : '/Dashboard/messages/ChatWindow',
                                                state : { theKey: key }
                                            }}
                                                  onClick = {_this.handleClick.bind(this, key)}
                                            >
                                                <Card.Grid style={unreadListStyle}>
                                                    <div style={{color:'#000'}}>
                                                        <div style={{fontSize:'2.0em', display:'inline'}}>{theList[key].senderN}</div>
                                                        <div style={{fontSize:'0.7em', display:'inline',}}>, {timeStyle(theList[key].time)}</div>
                                                    </div>
                                                    <div style={{color:'#000'}}>
                                                        <div style={{fontSize:'1.3em', display:'inline'}}>
                                                            {theList[key].content}
                                                        </div>
                                                    </div>
                                                </Card.Grid>

                                            </Link>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </Card>
            </div>
            )
    }
}

export default unreadMessages;
