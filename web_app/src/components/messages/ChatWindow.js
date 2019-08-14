import React, { Component } from 'react';
import {auth,database,storage} from '../../firebase/firebase';
import { Divider, Modal, Form, Button, Card, Row, Col, Input, Menu, Avatar, Spin, message, icon} from 'antd';
import {Link} from 'react-router-dom';
import '../../styles/Message.css'

const leftDivStyle = { float:'left', width:'30%', height: 'calc(100vh - 48px)'};
const rightDivStyle = { float:'left', width:'70%', background: '#fff', height: 'calc(100vh - 48px)'};
const leftDialogStyle = {backgroundColor:'#f5f5f5', color : '#000000', fontSize:'1.5em', marginTop:'5px', marginLeft:'10px', maxWidth:'40%', borderStyle:'solid', borderWidth:'0px', borderRadius:'15px', padding:'2px 10px 5px 10px'};
const rightDialogStyle = {backgroundColor:'#f5f5f5', color : '#000000', fontSize:'1.5em', marginTop:'5px', marginRight:'10px', maxWidth:'40%', borderStyle:'solid', borderWidth:'0px', borderRadius:'15px', padding:'2px 20px 5px 10px', float:'right'};
const contactListStyle = {padding:'20px 0 1px 20px', height:'calc(100vh - 108px)', overflowY:'scroll'};
const contactListTitleStyle = {borderWidth:'0.5px', borderStyle:'solid', borderColor:'#d9d9d9', height:'60px', fontSize:'1.15em', padding:'17px 0 0 25px', fontWeight:500, color:'#000000'};
const FormItem = Form.Item;
const unreadStyle = {position:'relative', left:'25px', padding:'5px', textAlign:'center', fontSize:'1em', color:'#fff', background:'red', height:'10px', width:'10px', borderRadius:'5px'};
const listButtonStyle = { textAlign:'left', width:'100%', marginBottom:'5px', height:'40px', fontSize:20, borderStyle: 'none', backgroundColor:'#f5f5f5'};
const listButtonStyle2 = { textAlign:'left', width:'100%', marginBottom:'5px', height:'40px', fontSize:20, borderStyle: 'none'};

function timeStyle(time){
    const Time = (new Date(new Date(Date.parse(JSON.parse(time))))).toString();
    let PostTime = Time.substring(0, Time.indexOf(" GMT")-3);
    return PostTime
}


class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thekey : this.props.location.state.theKey,
            authUser: auth.currentUser,
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
        this.obj = database.ref('users').child(this.state.thekey);
        this.chatRef = database.ref('/users/'+ this.state.authUser.uid + '/messages').child(this.state.thekey);
        this.unreadRef = database.ref('/users/'+ this.state.authUser.uid + '/unread').child(this.state.thekey);
        this.userList = database.ref('users');
    }

    state = {
        messagesList: [],
        unreadID:[],
    };


    componentDidUpdate() {
        this.scrollToBottom();
    }
    componentDidMount(){
        this.scrollToBottom();
            this.userList.on('value',(snapshot) => {
                this.setState({
                    theList : snapshot.val()
                });
            })
    }

    componentWillMount(){
        this.chatRef.on('value',(snapshot) => {
            var judgeMessages = snapshot.exists();
            this.setState({judgeMessages});
            if(judgeMessages){
                this.chatRef.on('value',(snapshot) => {
                    this.setState({
                        messagesList : snapshot.val()
                    });
                })
            }
        })

        this.unreadRef.on('value',(snapshot) => {
            var judgeUnread = snapshot.exists();
            this.setState({judgeUnread});
            if (judgeUnread) {
                this.unreadRef.child('senderE').on('value', (snapshot) => {
                    this.setState({
                        unreadID: snapshot.val()
                    });
                })
            }
        })

        this.obj.child('username').on('value',(snapshot) => {
            const objName = snapshot.val();
            this.setState({objName});
        })
        this.obj.child('email').on('value',(snapshot) => {
            const objEmail = snapshot.val();
            this.setState({objEmail});
        })

        this.userRef.child('username').on('value',(snapshot) => {
            const selfName = snapshot.val();
            this.setState({selfName});
        })

        this.userRef.child('email').on('value',(snapshot) => {
            const selfEmail = snapshot.val();
            this.setState({selfEmail});
        })


}


onSubmit = (event) => {
    event.preventDefault();
    var myKey = this.state.authUser.uid;
    const{MineKey} = this.state;
    var myDate = new Date();
    var objKey = this.state.thekey;

    this.props.form.validateFields((err, values) => {
        if (!err) {
            let newMessageKey = this.chatRef.push().key;
            database.ref('users/' + this.state.authUser.uid + '/messages/' + this.state.thekey + '//' + newMessageKey).set({
                content: values.content,
                time: JSON.stringify(myDate),
                newMessageKey,
                sender: this.state.authUser.uid,
                senderN: this.state.selfName,
            });

            database.ref('users/' + this.state.thekey + '/messages/' + this.state.authUser.uid + '//' + newMessageKey).set({
                content: values.content,
                time: JSON.stringify(myDate),
                newMessageKey,
                sender: this.state.authUser.uid,
                senderN: this.state.selfName,
            });

            database.ref('users/' + this.state.thekey + '/unread/' + this.state.authUser.uid).set({
                content: values.content,
                senderN: this.state.selfName,
                time: JSON.stringify(myDate),
                senderE: this.state.selfEmail,
            });

            this.props.form.resetFields();
        }
    })
};
    scrollToBottom = () => {
        this.ScrollingStyle.scrollIntoView({ behavior: "smooth" });
    }

    autoRead= (key) =>{
        database.ref('/users/' + this.state.authUser.uid + '/unread').child(key).remove();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let selfID = this.state.authUser.uid;
        let theList = this.state.messagesList;
        if (!theList) {
            theList=[];
        }


        let theList2 = this.state.theList;
        if (!theList2) {
            theList2=[]
        }
        let currentKey = this.state.thekey;
        return (
                <div>
                    <div style={contactListTitleStyle}>{this.state.objName}</div>
                    <Card style={{height:'calc(100vh - 110px', borderStyle:'none solid solid solid'}}>
                        <div style={{border:'0.5px solid #d9d9d9', padding:'10px'}}>
                            <div style={{height:'calc(100vh - 240px)', overflowY:'scroll'}}>
                                {Object.keys(theList).map(function (key) {
                                    return (
                                        <div key={key}>
                                            <div>
                                            {
                                                theList[key].sender === selfID ?
                                                <div style={{marginTop:'5px'}}>
                                                    <div style={{fontSize:'0.5em', float:'right'}}>{timeStyle(theList[key].time)}</div>
                                                    <div style={{clear:'both'}}/>
                                                    <div style={rightDialogStyle}>{theList[key].content}</div>
                                                    <div style={{clear:'both'}}/>
                                                </div>
                                                :
                                                <div style={{marginTop:'5px'}}>
                                                    <div style={{fontSize:'0.5em', float:'left'}}>{timeStyle(theList[key].time)}</div>
                                                    <div style={{clear:'both'}}/>
                                                    <div style={leftDialogStyle}>{theList[key].content}</div>
                                                    <div style={{clear:'both'}}/>
                                                </div>
                                            }
                                            </div>
                                        </div>
                                    );
                                })}
                                <div id="ScrollingStyle" ref={input => this.ScrollingStyle = input}>
                                </div>
                            </div>
                        </div>


                        <div style={{height:'50px', marginTop:'10px'}}>
                            <Form onSubmit={this.onSubmit}>
                                <FormItem style={{width:'80%', padding:'0'}} >
                                    {getFieldDecorator('content', {
                                        rules: [{ required: true, message: 'Cannot send blank content!' }],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <Button type="primary" htmlType="submit" style={{position:'relative', left:'83%', top:'-57px'}}>Send</Button>

                            </Form>
                            {this.state.unreadID === this.state.objEmail ?
                                this.autoRead(this.state.thekey) : null}
                        </div>

                    </Card>
                </div>


        );
    }
}
const ChatWindow = Form.create()(Chat);
export default (props)=><ChatWindow {...props} key={props.location.state.theKey} />
//export default ChatWindow;
