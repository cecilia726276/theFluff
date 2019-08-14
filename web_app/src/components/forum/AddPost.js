import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {auth,database,storage} from '../../firebase/firebase';
import { Button, Modal, Form, Input, Radio, Tag, message, Tooltip, Icon } from 'antd';
import BraftEditor from 'braft-editor'

message.config({
    top: 300,
    duration: 2,
});

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});
const FormItem = Form.Item;
const { TextArea } = Input;
const newPostStyle = {width:'100%', height:'50px', fontSize:30, color:'#ffffff', background:'#00112d'};
const CheckableTag = Tag.CheckableTag;

const tagsFromServer = ['Question', 'Announcement', 'Article', 'Chat'];


class AddPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGroup:this.props.currentGroup,
            authUser: auth.currentUser,
            selectedTags: [],
            addTags: [],
            tags: " ",
            visible: false,
            inputVisible: false,
            inputValue: '',
            forumRole: '',
            content: "",
            edit:"",
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
    }

    showModal = () => {
        this.setState({ visible: true });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }

    onSubmit = (event) => {
        event.preventDefault();
        const{currentGroup} = this.state;
        var myDate = new Date();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let html = values.braft;
                let re1 = new RegExp("<.+?>","g");//Regular expression that convert html into pure text.
                let con = html.replace(re1,' ');//replaced by space
                this.state.tags = this.state.selectedTags.concat(this.state.addTags);
                let newPostKey = database.ref('groups/'+ currentGroup).child('posts').push().key;
                database.ref('groups/'+ currentGroup +'/posts/'+ newPostKey).set({
                    title: values.title,
                    post: con,
                    braft: html,
                    time: JSON.stringify(myDate),
                    upvotes:0,
                    /*votes: {
                        upvotes: 0,
                        //downvotes: 0,
                    },*/
                    userName: this.state.theUser,
                    userID: this.state.authUser.uid,
                    anonymous: values.anonymous,
                    tag: this.state.tags,
                    newPostKey,
                    forumRole: this.state.theForumRole,

                });

                this.setState({ visible: false });
                message.success("Post successfully!")
                this.props.form.resetFields();
                //this.editorInstance.setContent('', 'html')
                this.state.selectedTags = [];
                this.state.addTags = [];
                this.editorInstance.clear();
            }
        })
    };

    handleChange=(tag, checked)=>{
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ?
            [...selectedTags, tag] :
            selectedTags.filter(t => t !== tag);
        console.log('Set tags for your post: ', nextSelectedTags);
        this.setState({ selectedTags: nextSelectedTags });
    }

    handlebraftChange = (content) => {
        console.log("content");
        this.setState({edit: content})
        console.log(content)
    }

    componentDidMount(){
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
            let theForumRole = snapshot.val();
            this.setState({theForumRole});
        });

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
            },function (){
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

    handleClose = (removedTag) => {
        const addTags = this.state.addTags.filter(tag => tag !== removedTag);
        console.log(addTags);
        this.setState({ addTags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let addTags = state.addTags;
        if (inputValue && addTags.indexOf(inputValue) === -1) {
            addTags = [...addTags, inputValue];
        }
        console.log(addTags);
        this.setState({
            addTags,
            inputVisible: false,
            inputValue: '',
        });
    }

    contentExists = (rule, value, callback) => {
        if (this.editorInstance.isEmpty()) {
            callback([new Error('Please input your content!')]);
        } else {
           callback();
        }
    }
    saveInputRef = input => this.input = input;


    render() {
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

        const { visible, selectedTags,inputVisible, inputValue, addTags } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 18 },
            },
        };

        return (
            <div >
                {/*
                <Button onClick={this.showModal} style={ newPostStyle }>
                    NEW POST
                </Button>
                */}

                <Tooltip placement="left" title={<span>Create new post</span>} >
                    <Icon type="plus-circle" theme="outlined"
                          style={{color:'#1890ff', fontSize: '50px', position:'fixed', bottom:'40px', right:'20px', zIndex:'99'}}
                          onClick={this.showModal}
                    />
                </Tooltip>


                <Modal
                    width={'90%'}
                    visible={visible}
                    title="NEW POST"
                    onCancel={this.handleCancel}
                    footer= {null}
                >

                    <Form onSubmit={this.onSubmit}>

                        <FormItem {...formItemLayout} label="Tags">
                            {getFieldDecorator('tag')(
                                <div>
                                    {tagsFromServer.map(tag => (
                                        <CheckableTag
                                            key={tag}
                                            checked={selectedTags.indexOf(tag) > -1}
                                            onChange={checked => this.handleChange(tag, checked)}
                                        >
                                            {tag}
                                        </CheckableTag>
                                    ))}
                                    <div>
                                        {addTags.map((tag, index) => {
                                            const isLongTag = tag.length > 20;
                                            const tagElem = (
                                                <Tag key={tag} closable={index !== -1} afterClose={() => this.handleClose(tag)}>
                                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                </Tag>
                                            );
                                            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                                        })}
                                        {inputVisible && (
                                            <Input
                                                ref={this.saveInputRef}
                                                type="text"
                                                size="small"
                                                style={{ width: 78 }}
                                                value={inputValue}
                                                onChange={this.handleInputChange}
                                                onBlur={this.handleInputConfirm}
                                                onPressEnter={this.handleInputConfirm}
                                            />
                                        )}
                                        {!inputVisible && (
                                            <Tag
                                                onClick={this.showInput}
                                                style={{ background: '#fff', borderStyle: 'dashed' }}
                                            >
                                                <Icon type="plus" /> New Tag
                                            </Tag>
                                        )}
                                    </div>
                                </div>


                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="Title">
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'Please input your title!' }],
                            })(
                                <Input/>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="Content">
                            {getFieldDecorator('braft', {
                                rules: [{ required: true, message: 'Please input your braft content!' },{ validator: this.contentExists}],
                                initialValue: ''
                            })(
                                <BraftEditor ref={instance => this.editorInstance = instance} {...editorProps}/>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="Anonymous" >
                            {getFieldDecorator('anonymous', {
                                initialValue: false,
                            })(
                                <Radio.Group>
                                    <Radio value={true}>Yes</Radio>
                                    <Radio value={false}>No</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                        <Button type="primary" htmlType="submit" style={{margin: '0 0 0 50%'}}>Post</Button>
                    </Form>

                </Modal>

            </div>
        );
    }
}
const Post = Form.create()(AddPost);
export default Post;
