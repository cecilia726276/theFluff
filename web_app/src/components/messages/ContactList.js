import React, { Component } from 'react';
import {auth,database,storage} from '../../firebase/firebase';
import { Icon,Menu,Card, Avatar } from 'antd';
import {Link} from 'react-router-dom';
import {Select} from "antd/lib/index";

const listButtonStyle = { background: '#f5f5f5',borderStyle:'hide'};
const contactListStyle = { height:'calc(100vh - 108px)',overflowY:'auto'};
//const contactListStyle = {padding:'20px 0 1px 20px', height:'calc(100vh - 108px)', overflowY:'scroll'};
const contactListTitleStyle = {borderWidth:'0.5px', borderStyle:'solid', borderColor:'#d9d9d9', height:'60px', fontSize:'1.15em', padding:'17px 0 0 25px', fontWeight:500, color:'#000000'};
const Option = Select.Option;
const { Meta } = Card;

class ContactList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: auth.currentUser,
        };
        this.userList = database.ref('users');
        this.messageList = database.ref('users/'+this.state.authUser.uid+'/messages');
    }
    state = {
        theList : [],
        allMessages:[],
        currentReceiver: '',
    };

    componentDidMount(){
        this.userList.on('value',(snapshot) => {
            this.setState({
                theList : snapshot.val()
            });
        });
        this.messageList.on('value',(snapshot) => {
            this.setState({
                allMessages : snapshot.val()
            });
        })
    }

    handleUsers = (e) =>{
        let newList = e.substr(0,28);
        console.log(newList)
        this.setState({
            currentReceiver: newList
        })
    };

    changeSelected = (e) =>{
        console.log(e);
        this.setState({
            currentReceiver: e
        })
    }

    render() {
        let theList = this.state.theList;
        let allMessages = this.state.allMessages;
        let currentReceiver = this.state.currentReceiver;
        let selfID = this.state.authUser.uid;
        let children = [];
        let key;
        let _this = this;
        for (key in theList){
            if (key === selfID) continue;
            let username = theList[key].username;
            children.push(

                    <Option key={key+';'+username}><Link style = {{width:'100%'}} to={{
                        pathname: '/Dashboard/messages/ChatWindow',
                        state: {
                            theKey: key
                        }
                    }}><div style = {{width : '100%'}}>{username}</div></Link></Option>
                )

        }

        return (

            <div>
                <div style={contactListTitleStyle}>
                    <Select
                        showSearch
                        style={{ width: '80%'}}
                        placeholder="Search for users"
                        showArrow = {false}
                        onChange={this.handleUsers}
                    >
                        {children}
                    </Select>

                </div>
                <div style ={{borderWidth:'0.5px', borderStyle:'none solid solid solid', borderColor:'#d9d9d9'}}>
                    <div class="ScrollingStyle" style={contactListStyle}>
                        {allMessages && theList
                            ? <div>
                                {Object.keys(allMessages).map(function (key) {
                                    let lastMessage = allMessages[key][Object.keys(allMessages[key])[Object.keys(allMessages[key]).length-1]].content.substring(0,20);
                                    //console.log('allM:' + allMessages[Object.keys(allMessages[key])[Object.keys(allMessages[key]).length-1]].content )
                                    return (
                                        <div key={key} style={{color : '#000000'}}>

                                            {theList[key].username ?
                                                <div>
                                                    {key === selfID ?
                                                        null :
                                                        <Link onClick={_this.changeSelected.bind(_this, key)} style={{ textDecoration: 'none' }} to={{
                                                            pathname : '/Dashboard/messages/ChatWindow' ,
                                                            state : {
                                                                theKey: key
                                                            }
                                                        }}>
                                                        <Card hoverable={true} style={key === currentReceiver ? listButtonStyle: null}>
                                                            <Meta
                                                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                                title={theList[key].username}
                                                                description = {lastMessage}
                                                            >
                                                            </Meta>

                                                        </Card>
                                                        </Link>

                                                    }
                                                </div>
                                                : null
                                            }

                                        </div>
                                    );
                                })}
                            </div>
                            : null}


                    </div>
                </div>
            </div>

        );
    }
}

/*
 {Object.keys(theList).map(function (key) {
                            return (
                                <div key={key} style={{color : '#000000'}}>
                                    {theList[key].username ?
                                        <div>
                                            {key === selfID ?
                                                null :
                                                <p style={listButtonStyle}>
                                                    <Link to={{
                                                        pathname : '/Dashboard/messages/ChatWindow' ,
                                                        state : {
                                                            theKey: key
                                                        }
                                                    }}>{theList[key].username}</Link>
                                                </p>
                                            }
                                        </div>
                                        : null
                                    }

                                </div>
                            );
                        })}

                  <Card>
                            <Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title="Card title"
                                description="This is the description"
                            />
                            <Link to={{
                                pathname : '/Dashboard/messages/ChatWindow' ,
                                state : {
                                    theKey: key
                                }
                            }}>{theList[key].username}</Link>
                        </Card>
                        <Card>
                            <Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title="Card title"
                                description="This is the description"
                            />
                        </Card>
 */
export default ContactList;
