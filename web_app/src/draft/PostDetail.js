/*import React, { Component } from 'react';
import {Link, Redirect, Route, Switch, Router} from 'react-router-dom';
import 'antd/dist/antd.css';
import { Input, Button, Layout, Icon, message, Form, Affix, List, Pagination } from 'antd';
import {auth,database} from '../firebase/firebase';
import Post from "../components/forum/AddPost";

const { TextArea } = Input;
const FormItem = Form.Item;
const leftDivStyle = { float:'left', width:'80%', padding: '24px', background: '#fff', minHeight: 1000};
const rightDivStyle = { float:'left', width:'20%', paddingLeft:12, minHeight: 380};
const listButtonStyle = { textAlign:'left', width:'100%', height:'50px', fontSize:20, borderStyle: 'none'};

const { Sider, Content, Header } = Layout;
const PostDetailStyle = { borderBottom:"solid", borderWidth:"0.3px", width:"100%", backgroundColor:"#fff", padding:'20px 30px 0 30px'};
const TitleStyle = {fontSize:"30px", borderBottom:"solid", borderWidth:"0.3px", backgroundColor:"#fff"};
const PostContentStyle = {minHeight:'250px', fontSize:"30px", padding:40, backgroundColor:'#f5f5f5', wordWrap:'break-word' };
const AnswersStyle = {borderTop:"solid", borderWidth:"0.3px", padding:'10px 70px 70px 50px'};
const ReplyStyle = {minHeight: "300px", borderTop:"solid", borderWidth:"0.3px", paddingTop:10};

function onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
}

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thekey : this.props.location.state.key,
            authUser: auth.currentUser,
        };
        this.postRef = database.ref('/posts').child(this.state.thekey);
        this.userRef = database.ref('users').child(this.state.authUser.uid);
    }
    state = {
        theReplies: [],
        loading: true,
    };
    componentDidMount(){
        this.postRef.child('post').on('value',(snapshot) => {
            const PostContent = snapshot.val();
            this.setState({PostContent});
        })
        this.postRef.child('title').on('value',(snapshot) => {
            const PostTitle = snapshot.val();
            this.setState({PostTitle});
        })
        this.postRef.child('upvotes').on('value',(snapshot) => {
            const PostUpvotes = snapshot.val();
            this.setState({PostUpvotes});
        })
        this.postRef.child('userName').on('value',(snapshot) => {
            var PostUserName = snapshot.val();
            this.postRef.child('anonymous').on('value',(snapshot) => {
                var anonymous = snapshot.val();
                if(anonymous == 'yes'){
                    PostUserName = 'Anonymous'
                }
                this.setState({PostUserName});
            })
        })
        this.postRef.child('anonymous').on('value',(snapshot) => {
            const anonymous = snapshot.val();
            this.setState({anonymous});
        })
        this.postRef.child('time').on('value',(snapshot) => {
            const PostTime = snapshot.val();
            this.setState({PostTime});
        })
        this.postRef.child('replies').on('value',(snapshot) => {
            this.setState({
                theReplies : snapshot.val(),
                loading: false,
            });
        })



        let theEmail='';
        this.userRef.child('email').on('value',(snapshot) =>{
            theEmail = snapshot.val();
        });
        this.userRef.child('username').on('value',(snapshot) =>{
            let theUser = snapshot.val();
            if (theUser) {
                this.setState({theUser});
            } else {
                theUser = theEmail;
                this.setState({theUser});
            }

        })

    }

    handlesubmit = (event) => {
        event.preventDefault();
        var myDate = new Date();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let newPostKey = this.postRef.child('replies').push().key;
                database.ref('/posts/' + this.state.thekey + '/replies/'+ newPostKey).set({
                    reply: values.reply,
                    newPostKey,
                    time: myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString(),
                    upvotes: 0,
                    userName: this.state.theUser,
                    userID: this.state.authUser.uid,
                });
                console.log('Received values of form: ', values);
                message.success("Reply successfully!");
                this.props.form.resetFields();
            }
        })
    };

    handlePostUpvote=()=>{
        database.ref('/posts/' + this.state.thekey).update({
            upvotes: this.state.PostUpvotes + 1,
        });
    }
    handleReplyUpvote=(theReplies, key)=>{
        database.ref('/posts/' + this.state.thekey + '/replies/' + key).update({
            upvotes: theReplies.upvotes + 1,
        });
    }


    render(){
        var _this = this;
        const { getFieldDecorator } = this.props.form;
        let theReplies = this.state.theReplies;
        if (!theReplies) {
            theReplies={}
        }
        if (this.state.loading) {
            return (
                <div>
                    Loading... <Icon type="loading" />
                </div>
            );
        }
        return(
            <Layout style={{ margin: '-24px'}}>
                <div>
                    <div style={ leftDivStyle }>

                        <div style={PostDetailStyle}>
                            <div style={TitleStyle}>
                                <h1>{this.state.PostTitle}</h1>
                            </div>
                            <div>
                                <div style={PostContentStyle}>{this.state.PostContent}</div>
                                <div style={{marginTop:20}}>
                                    <div>
                                        <div style={{fontSize:15, display:'inline'}}>Auther:&emsp;{this.state.PostUserName}</div>
                                        <div style={{float:'right'}}>Post time:&emsp;{this.state.PostTime}</div>
                                    </div>
                                    <Button
                                        onClick={this.handlePostUpvote}
                                        type="button"
                                        style={{margin:'10px 0 10px 0'}}
                                    >
                                        <Icon type="like-o" style={{fontSize:30}}/>{this.state.PostUpvotes}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div style={AnswersStyle}>
                            <div>
                                {Object.keys(theReplies).map(function (key) {

                                    return (
                                        <div key={key} style={{padding:20, borderBottom:"solid", borderWidth:"0.2px"}}>
                                            <div style={{fontSize:25}}>{theReplies[key].userName}</div>
                                            <div style={{minHeight:50, fontSize:20, backgroundColor:'#f5f5f5', padding:20}}>
                                                {theReplies[key].reply}
                                            </div>

                                            <div>
                                                <Button
                                                    onClick={_this.handleReplyUpvote.bind(this, theReplies[key], key)}
                                                    type="button"
                                                    style={{marginTop:10}}
                                                >
                                                    <Icon type="like-o" />{theReplies[key].upvotes}
                                                </Button>
                                                <div style={{float:'right'}}>Post time:&emsp;{theReplies[key].time}</div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        <div style={ReplyStyle}>
                            <h1 style={{fontSize:30}}>Your Reply:</h1>
                            <Form onSubmit={this.handlesubmit}>

                                <FormItem>
                                    {getFieldDecorator('reply', {
                                        rules: [{ required: true, message: 'Please input your reply content!' }],
                                    })(
                                        <TextArea rows={5}/>
                                    )}

                                </FormItem>
                                <Button type="primary" htmlType="submit" style={{fontSize:20}}>Post</Button>
                            </Form>


                        </div>
                    </div>

                    <div style={ rightDivStyle }>
                        <Affix>
                            <div style={{background: '#fff'}}>
                                <Post/>
                            </div>

                            <div style={{background: '#fff', marginTop:15}}>

                                <ul style={{listStyleType:'none'}}>
                                    <li style={{marginTop:5}}>
                                        <Button style={ listButtonStyle }>
                                            <Icon type="question" />My Post
                                        </Button>
                                    </li>
                                    <li style={{marginTop:5}}>
                                        <Button style={ listButtonStyle }>
                                            <Icon type="solution" />My Answers
                                        </Button>
                                    </li>
                                    <li style={{marginTop:5}}>
                                        <Button style={ listButtonStyle }>
                                            <Icon type="eye" />My Watching
                                        </Button>
                                    </li>
                                    <li style={{marginTop:5}}>
                                        <Button style={ listButtonStyle }>
                                            <Icon type="message" />Replies
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </Affix>
                    </div>
                </div>
            </Layout>


        )
    }
}
const PostDetail = Form.create()(Detail);
export default PostDetail;*/
