import React, { Component } from 'react';
import {Link} from 'react-router-dom';
//import 'antd/dist/antd.css';
import {Tabs, Input, Button, Layout, Icon, message, Form, Affix, List, Pagination, Radio, Modal, Breadcrumb, Card, Row, Col} from 'antd';
import {auth,database,storage} from '../../firebase/firebase';
import Post from "./AddPost";
import _ from 'underscore';
import BraftEditor from 'braft-editor';
import SearchBox from './ForumSearchBox.js';
import RightSidebar from './RightSidebar.js';
import sortBy from 'lodash/sortBy';
const { TextArea } = Input;
const FormItem = Form.Item;
const leftDivStyle = { float:'left', width:'100%', padding: '24px', background: '#fff', minHeight: '100vh'};
const rightDivStyle = { float:'left', width:'20%', paddingLeft:12, minHeight: 380};
const listButtonStyle = { textAlign:'left', width:'100%', height:'50px', fontSize:20, borderStyle: 'none'};

const { Sider, Content, Header } = Layout;
//const PostDetailStyle = { borderBottom:"solid", borderWidth:"0.3px", width:"100%", backgroundColor:"#fff", padding:'20px 30px 0 30px'};
const PostDetailStyle = {width:"100%", backgroundColor:"#fff", padding:'20px 30px 0 30px'};
const TitleStyle = {fontSize:"30px", borderBottom:"solid", borderWidth:"0.3px", backgroundColor:"#fff"};
const PostContentStyle = {minHeight:'250px', fontSize:"30px", padding:40, backgroundColor:'#fff', wordWrap:'break-word' };
const AnswersStyle = {borderTop:"solid", borderWidth:"0.3px", padding:'10px 70px 70px 10px'};
const ReplyStyle = {minHeight: "auto", borderTop:"solid", borderWidth:"0.3px", paddingTop:10, marginLeft:'30px'};
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const { Meta } = Card;

const leftgridStyle = {
    width: '5%',
    textAlign: 'center',
}
const rightgridStyle = {
    width: '95%',
    textAlign: 'center',
}

function onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
}

function checkAnonymous(anonymous, name) {
    if (anonymous == true){
        return 'Anonymous';
    } else {
        return name;
    }
}

function timeStyle(time){
    const Time = (new Date(new Date(Date.parse(JSON.parse(time))))).toString();
    let PostTime = Time.substring(0, Time.indexOf(" GMT")-3);
    return PostTime
}

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thekey : this.props.location.state.key,
            authUser: auth.currentUser,
            currentGroup : this.props.location.state.group,
            visible: false,
            second_visible: false,
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
        this.postRef = database.ref('/groups/'+ this.state.currentGroup + '/posts').child(this.state.thekey);
        this.membersRef = database.ref('/groups/'+ this.state.currentGroup+'/members');
    }
    state = {
        theReplies: [],
        membersId:[],
        loading: true,
    };
    componentWillMount(){
        database.ref('/groups/'+ this.state.currentGroup).child('title').on('value',(snapshot) => {
            const currentGroupTitle = snapshot.val();
            this.setState({currentGroupTitle});
        })
        this.postRef.child('braft').on('value',(snapshot) => {
            const PostContent = snapshot.val();
            this.setState({PostContent});
        })
        this.postRef.child('title').on('value',(snapshot) => {
            const PostTitle = snapshot.val();
            this.setState({PostTitle});
        })
        this.postRef.child('newPostKey').on('value',(snapshot) => {
            const PostID = snapshot.val();
            this.setState({PostID});
        })
        this.postRef.child('userID').on('value',(snapshot) => {
            const PostUserID = snapshot.val();
            this.setState({PostUserID});
        })

        this.postRef.child('upvotes').on('value',(snapshot) => {
            const PostUpvotes = snapshot.val();
            this.setState({PostUpvotes});
        })
        this.postRef.child('userName').on('value',(snapshot) => {
            var PostUserName = snapshot.val();
            this.postRef.child('anonymous').on('value',(snapshot) => {
                var anonymous = snapshot.val();
                if(anonymous == true){
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
            let PostTime = timeStyle(snapshot.val());
            this.setState({PostTime});
        })
        this.postRef.child('replies').on('value', (snapshot) => {
            this.setState({
                theReplies : snapshot.val(),
                loading: false,
            });
        })

        this.postRef.child('likedby').on('value',(snapshot) => {
            this.setState({
                PostLikedby : snapshot.val(),
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

        this.membersRef.on('value',(snapshot) => {
            this.setState({
                membersId: snapshot.val()
            });
        })

    }

    handlesubmit = (event) => {
        event.preventDefault();
        var myDate = new Date();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let html = values.reply;
                let re1 = new RegExp("<.+?>","g");//Regular expression that convert html into pure text.
                let con = html.replace(re1,' ');//replaced by space

                let newPostKey = this.postRef.child('replies').push().key;
                database.ref('/groups/'+ this.state.currentGroup + '/posts/' + this.state.thekey + '/replies/'+ newPostKey).set({
                    reply: html,
                    content: con,
                    newPostKey,
                    time: JSON.stringify(myDate),
                    upvotes: 0,
                    userName: this.state.theUser,
                    userID: this.state.authUser.uid,
                    anonymous: values.anonymous,
                });
                console.log('Received values of form: ', values);
                message.success("Reply successfully!");
                this.props.form.resetFields();
                this.editorInstance.clear();
            }
        })
    };

    handlePostLiked = () => {
        var likedby = this.state.PostLikedby;
        const userID = auth.currentUser.uid;
        if (likedby){
            let likelist = _.values(likedby);
            if (likelist.indexOf(userID) === -1){
                return "default";
            }else{
                return "primary"
            }
        }else{
            return "default";
        }
    }


    handleReplyLiked = (likedby) => {
        const userID = auth.currentUser.uid;
        if (likedby){
            let likelist = _.values(likedby);
            if (likelist.indexOf(userID) === -1){
                return "default";
            }else{
                return "primary"
            }
        }else{
            return "default";
        }
    }

    handlePostUpvote=()=>{
        var likedby = this.state.PostLikedby;
        var votes = this.state.PostUpvotes;
        const userID = auth.currentUser.uid;
        console.log(likedby);
        if (likedby) {
            let likelist =_.values(likedby);
            if(likelist.indexOf(userID) === -1){
                console.log(userID + "can be added to upvote");
                likelist.push(userID);

                database.ref('groups/' + this.state.currentGroup + '/posts/' + this.state.thekey).update({
                    upvotes: votes + 1,
                    likedby: likelist,
                });
            }else {
                console.log(userID + "will be removed from upvote");
                likelist.splice([likelist.indexOf(userID)],1);
                database.ref('groups/' + this.state.currentGroup + '/posts/' + this.state.thekey).update({
                    upvotes: votes - 1,
                    likedby: likelist,
                });
            }
        }else{
            database.ref('groups/' + this.state.currentGroup + '/posts/' + this.state.thekey).update({
                upvotes: votes + 1,
                likedby: [userID],
            });
        }
    }

    handleReplyUpvote=(theReplies, key)=>{
        const userID = auth.currentUser.uid;
        if (theReplies.likedby) {
            let likelist =_.values(theReplies.likedby);
            if(likelist.indexOf(userID) === -1){
                likelist.push(userID);
                database.ref('groups/' + this.state.currentGroup + '/posts/' + this.state.thekey + '/replies/' + key).update({
                    upvotes: theReplies.upvotes + 1,
                    likedby: likelist,
                });
            }else {
                likelist.splice([likelist.indexOf(userID)],1);
                database.ref('groups/' + this.state.currentGroup + '/posts/' + this.state.thekey + '/replies/' + key).update({
                    upvotes: theReplies.upvotes - 1,
                    likedby: likelist,
                });
            }
        }else{
            database.ref('groups/' + this.state.currentGroup + '/posts/' + this.state.thekey + '/replies/' + key).update({
                upvotes: theReplies.upvotes + 1,
                likedby: [userID],
            });
        }
    }
/**/
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = () => {
        //console.log('Clicked cancel button');
        this.setState({
            visible: false,
            /*second_visible: false,*/

        });
    };
    second_handleCancel = () => {
        //console.log('Clicked cancel button');
        this.setState({
            second_visible: false,
            /*second_visible: false,*/

        });
    };

    removepost = (event) =>{
        const {
            thekey,
            currentGroup
        } = this.state;
        database.ref('/groups/' + 'allposts/' + 'posts').child(thekey).remove();
        database.ref('groups/' + this.state.currentGroup + '/posts').child(thekey).remove();
        this.setState({visible: false})
        message.success("Deleted!")
    }

    /*showDeleteConfirm = (theReplies, key) => {

        confirm({
            title: 'Are you sure delete this Reply?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                database.ref('groups/' + this.state.currentGroup + '/posts/' + this.state.thekey + '/replies/' + key).remove();

                message.success("Deleted!");

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }*/
    removereply = (theReplies, key) =>{
        const {
            thekey,
            currentGroup
        } = this.state;

        database.ref('/groups/' + 'allposts/' + 'posts/' + this.state.thekey + '/replies/' + key).remove();
        database.ref('groups/' + this.state.currentGroup + '/posts/' + this.state.thekey + '/replies/' + key).remove();
        this.setState({second_visible: false})
        message.success("Deleted!")
    }

    validateFn = (file) => {
        return file.size < 1024 * 10240
        // The maximum size of file must be no larger than 2MB.
    }

    uploadFn = (param) => {
        // Create a root reference
        let storageRef = storage.ref('/groups/'+ this.state.currentGroup + '/posts/' + this.state.authUser.uid);
        // Create a reference to 'the file'
        let mountainsRef = storageRef.child(param.file.name);
        let file = param.file; // use the Blob or File API
        let uploadtask = mountainsRef.put(file);
        uploadtask.on('state_changed',
            function progress(snapshot){
                param.progress(snapshot.bytesTransferred / snapshot.totalBytes * 100);
            },function error(err){
                param.error({
                    msg: 'unable to upload.'
                })
            },function abort(err){
                param.error({
                    msg: 'The maximum size of the uploading file must be no more than 10MB.'
                })
            }, function (){
                uploadtask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    param.success({
                        url: downloadURL,
                        meta: {
                            id: 'xxx',
                            title: 'xxx',
                            alt: 'xxx',
                            loop: true, //video loop available
                            autoPlay: false, // video autoplay
                            controls: true, // video control bars available
                            poster: 'http://xxx/xx.png', // cover of the media player
                        }
                    })
                });
            });
    }

    contentExists = (rule, value, callback) => {
        if (this.editorInstance.isEmpty()) {
            callback([new Error('Please input your content!')]);
        } else {
            callback();
        }
    }


    render(){
        var _this = this;
        const { getFieldDecorator } = this.props.form;
        const editorProps = {
            height: 200,
            contentFormat: 'html',
            initialContent: '',
            language: "en",
            media: {
                validateFn: this.validateFn,
                uploadFn: this.uploadFn,
            },
        }
        const {visible, second_visible} = this.state;
        let theReplies = sortBy(this.state.theReplies, ['upvotes']).reverse();
        if (!theReplies) {
            theReplies=[]
        }
        if (this.state.loading) {
            return (
                <div>
                    Loading... <Icon type="loading" />
                </div>
            );
        }
        let membersId = this.state.membersId;
        let PostUserID = this.state.PostUserID;
        return(
            <Layout style={{ margin: '-24px -24px -24px -36px', height:'100vh', overflowY:'scroll'}}>
                <div>
                    <div style={ leftDivStyle }>
                        <Breadcrumb>
                            <Breadcrumb.Item>Forum</Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={{pathname : '/Dashboard/'+this.state.currentGroup}}>{this.state.currentGroupTitle}</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>{this.state.PostTitle}</Breadcrumb.Item>
                        </Breadcrumb>

                        <div style={PostDetailStyle}>
                            <h1 style={{fontSize: '25px', textAlign:'center', fontWeight: 'bold'}}>{this.state.PostTitle}</h1>

                            <Card>
                                <Meta
                                    avatar={<Button type={_this.handlePostLiked()} onClick={this.handlePostUpvote}><Icon type="like-o"/>{this.state.PostUpvotes}</Button>}
                                    title={<div style={{float: 'left', color : 'grey', fontSize : '12px'}}>Posted by {this.state.PostUserName} { (membersId[PostUserID] === 3)
                                            ? <span style={{alignSelf: 'flex-end'}}>(Student)</span>
                                            : [
                                                ((membersId[PostUserID] === 2)
                                                        ? <span style={{alignSelf: 'flex-end'}}>(Tutor)</span>
                                                        : <span style={{alignSelf: 'flex-end'}}>(Lecturer)</span>
                                                )
                                            ]
                                        } on {this.state.PostTime}</div>}
                                        description={<div style={{color: 'black'}} dangerouslySetInnerHTML={{ __html: this.state.PostContent }} />}
                                />
                                <br/>
                                {this.state.PostUserID === this.state.authUser.uid ?
                                    <Button
                                        style={{float:'right'}}
                                        onClick={this.showModal} icon="delete"/> : null
                                }
                            </Card>
                            <br/>

                            <Card style={{fontSize:'16px'}}> {Object.keys(theReplies).length + " comment(s):"}</Card>
                            {Object.keys(theReplies).map(function(key){
                                return (
                                    <Card>
                                        <Meta
                                            avatar={ <Button
                                                type={_this.handleReplyLiked(theReplies[key].likedby)}
                                                onClick={_this.handleReplyUpvote.bind(this, theReplies[key], theReplies[key].newPostKey)}
                                                style={{float:'left'}}
                                            >
                                                <Icon type="like-o" />{theReplies[key].upvotes}
                                            </Button>}
                                            title={<div style={{float: 'left', color : 'grey', fontSize : '12px'}}>Posted by {checkAnonymous(theReplies[key].anonymous, theReplies[key].userName)} {
                                                (membersId[theReplies[key].userID] === 3)
                                                    ? <span style={{alignSelf: 'flex-end'}}>(Student)</span>
                                                    : [
                                                        ((membersId[theReplies[key].userID] === 2)
                                                                ? <span style={{alignSelf: 'flex-end'}}>(Tutor)</span>
                                                                : <span style={{alignSelf: 'flex-end'}}>(Lecturer)</span>
                                                        )
                                                    ]
                                            } on {timeStyle(theReplies[key].time)} </div>}
                                                   description={<div style={{color: 'black'}} dangerouslySetInnerHTML={{ __html: theReplies[key].reply }} />}
                                        />
                                        <br/>
                                        {theReplies[key].userID == _this.state.authUser.uid ?
                                            <Button
                                                style={{float:'right', margin:'10px 0 10px 0'}}
                                                onClick={_this.removereply.bind(this, theReplies[key], key)}
                                                icon="delete"
                                            /> : null
                                        }
                                        <Modal title="Are you sure you want to delete this reply?"
                                               visible={second_visible}
                                               onCancel={_this.second_handleCancel}
                                               footer= {null}>
                                            <div>
                                                <Button
                                                    style={{float:'right'}}
                                                    type="primary" htmlType="submit"
                                                    onClick={_this.removereply.bind(this, theReplies[key], key)}
                                                >Delete
                                                </Button>
                                                <Button onClick={event => _this.setState({second_visible:false})}>Cancel
                                                </Button>
                                            </div>
                                        </Modal>

                                    </Card>
                                )
                            })}
                            <br/>

                            <Form onSubmit={this.handlesubmit}>

                                <FormItem>
                                    {getFieldDecorator('reply', {
                                        rules: [{ required: true, message: 'Please input your reply content!' },{ validator: this.contentExists}],
                                    })(
                                        <BraftEditor ref={instance => this.editorInstance = instance} {...editorProps}/>
                                    )}

                                </FormItem>

                                <FormItem style = {{margin:'0 10px 0 0'}}label="Anonymous" >
                                    {getFieldDecorator('anonymous', {
                                        initialValue: false,
                                    })(
                                        <Radio.Group>
                                            <Radio value={true}>Yes</Radio>
                                            <Radio value={false}>No</Radio>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                                <Button type="primary" htmlType="submit" style={{fontSize:20}}>Reply</Button>
                            </Form>
                        </div>



                    </div>

                </div>
            </Layout>


        )
    }
}
const PostDetail = Form.create()(Detail);
export default PostDetail;

/*
                        <br/>
                        <div style = {PostDetailStyle}>
                            <div style={TitleStyle}>
                                <h1 style={{fontSize:'20px'}}>{this.state.PostTitle}</h1>
                            </div>
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: this.state.PostContent }} />
                                <div style={{marginTop:20}}>
                                    <div>
                                        <div style={{fontSize:15, display:'inline'}}>
                                            Author:&emsp;{this.state.PostUserName}
                                            { (membersId[PostUserID] === 3)
                                            ? <span style={{alignSelf: 'flex-end'}}>(Student)</span>
                                            : [
                                                ((membersId[PostUserID] === 2)
                                                  ? <span style={{alignSelf: 'flex-end'}}>(Tutor)</span>
                                                  : <span style={{alignSelf: 'flex-end'}}>(Lecturer)</span>
                                                )
                                              ]
                                            }
                                        </div>
                                        <div style={{float:'right'}}>Post time:&emsp;{this.state.PostTime}</div>
                                    </div>
                                    <div>
                                        <Button
                                            type={_this.handlePostLiked()}
                                            onClick={this.handlePostUpvote}

                                            style={{margin:'10px 0 10px 0'}}
                                        >
                                            <Icon type="like-o" style={{fontSize:30}}/>{this.state.PostUpvotes}
                                        </Button>
                                        {this.state.PostUserID == this.state.authUser.uid ?
                                            <Button
                                                style={{float:'right', margin:'10px 0 10px 0'}}
                                                onClick={this.showModal}>Delete</Button> : null
                                        }
                                        <Modal title="Are you sure you want to delete this post?"
                                            visible={visible}
                                            onCancel={this.handleCancel}
                                            footer= {null}>
                                            <p>
                                                Please note that if you select "Delete", the post and all replies will be deleted, or select "Cancel".
                                            </p>
                                            <div>
                                            <Button
                                                 style={{float:'right'}}
                                                 type="primary" htmlType="submit"
                                                 onClick={this.removepost}
                                                ><Link to={'/Dashboard/'+this.state.currentGroup}>Delete</Link>
                                                </Button>
                                                <Button onClick={event => this.setState({visible:false})}>Cancel
                                                </Button>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={AnswersStyle}>
                            <div>
                                {Object.keys(theReplies).map(function (key) {
                                    return (
                                        <div key={key} style={{padding:20, borderBottom:"solid", borderWidth:"0.2px"}}>
                                            <div style={{fontSize:25}}>
                                                {checkAnonymous(theReplies[key].anonymous, theReplies[key].userName)}
                                                {
                                                    (membersId[theReplies[key].userID] === 3)
                                                    ? <span style={{alignSelf: 'flex-end'}}>(Student)</span>
                                                    : [
                                                        ((membersId[theReplies[key].userID] === 2)
                                                          ? <span style={{alignSelf: 'flex-end'}}>(Tutor)</span>
                                                          : <span style={{alignSelf: 'flex-end'}}>(Lecturer)</span>
                                                        )
                                                      ]
                                                }
                                                <div style={{float:'right', fontSize:15, marginTop:'10px'}}>
                                                    Post time:&emsp;
                                                    {timeStyle(theReplies[key].time)}
                                                </div>
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: theReplies[key].reply }} />
                                            <div>
                                                <Button
                                                    type={_this.handleReplyLiked(theReplies[key].likedby)}
                                                    onClick={_this.handleReplyUpvote.bind(this, theReplies[key], theReplies[key].newPostKey)}
                                                    style={{margin:'10px 0 10px 0'}}
                                                >
                                                    <Icon type="like-o" />{theReplies[key].upvotes}
                                                </Button>

                                                {theReplies[key].userID == _this.state.authUser.uid ?
                                                    <Button
                                                        style={{float:'right', margin:'10px 0 10px 0'}}
                                                        onClick={_this.removereply.bind(this, theReplies[key], key)}
                                                        >Delete</Button> : null
                                                }
                                                <Modal title="Are you sure you want to delete this reply?"
                                                        visible={second_visible}
                                                        onCancel={_this.second_handleCancel}
                                                        footer= {null}>
                                                    <div>
                                                        <Button
                                                                style={{float:'right'}}
                                                                type="primary" htmlType="submit"
                                                                onClick={_this.removereply.bind(this, theReplies[key], key)}
                                                        >Delete
                                                        </Button>
                                                        <Button onClick={event => _this.setState({second_visible:false})}>Cancel
                                                        </Button>
                                                    </div>
                                                </Modal>

                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                        </div>
 */