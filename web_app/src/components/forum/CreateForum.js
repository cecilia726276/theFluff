import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {auth,database} from '../../firebase/firebase';
import { Button, Modal, Form, Input, message, Tooltip, Icon } from 'antd';

message.config({
    top: 300,
    duration: 2,
});

const FormItem = Form.Item;
const newForumStyle = {width:'100%', height:'50px', fontSize:25, color:'#ffffff', background:'#00112d'};


class CreateForum extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: auth.currentUser,
            visible: false,
            inputVisible: false,
            inputValue: '',
            content: "",
            edit:"",
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
    }

    showModal = () => {
        if (this.state.theRole == 1){
            this.setState({ visible: true });
        } else {
            return alert('Sorry, you do not have the permission to create the forum.');
        }
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };

    onSubmit = (event) => {
        event.preventDefault();
        var myDate = new Date();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let newPostKey = database.ref('groups').push().key;
                database.ref('groups/'+ newPostKey).set({
                    title: values.title,
                    discription: values.discription,
                    time: JSON.stringify(myDate),
                    Admin: this.state.theUser,
                    AdminID: this.state.authUser.uid,
                    courseKey: newPostKey,
                });
                database.ref('groups/'+ newPostKey +'/members/' + this.state.authUser.uid).transaction(function (current_value) {
                    return 1;
                });
                //let enrollment_key = database.ref('users/' + this.state.authUser.uid + '/enrollment').push().key;
                database.ref('users/' + this.state.authUser.uid + '/enrollment/' + newPostKey).set({
                    title: values.title,
                    coursekey: newPostKey,
                    //enrollmentKey: enrollment_key,
                });
                database.ref('users/' + this.state.authUser.uid + '/courseAdmin/' + newPostKey).set({
                    title: values.title,
                    coursekey: newPostKey,
                    //enrollmentKey: enrollment_key,
                });
                this.setState({ visible: false });
                message.success("Create successfully!");
                this.props.form.resetFields();

            }
        })
    };



    componentDidMount(){
        this.userRef.child('username').on('value',(snapshot) =>{
            let theUser = snapshot.val();
            this.setState({theUser});
        })

        let theRole='';
        this.userRef.child('role').on('value',(snapshot) => {
            this.setState({
                theRole : snapshot.val(),
            });
        })

    }


    render() {
        const { visible} = this.state;
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
            <div>
                <Tooltip placement="left" title={<span>Create new Forum</span>}>
                    <Icon type="plus-circle"
                          theme="outlined"
                          style={{color:'#1890ff',fontSize: '50px', position:'fixed', bottom:'40px', right:'20px', zIndex:'99'}}
                          onClick={this.showModal}/>
                </Tooltip>

                <Modal
                    width={'40%'}
                    visible={visible}
                    title="CREATE FORUM"
                    onCancel={this.handleCancel}
                    footer= {null}
                >

                    <Form onSubmit={this.onSubmit}>

                        <FormItem {...formItemLayout} label="Forum Name">
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'Please input the Forum Name!' }],
                            })(
                                <Input/>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="Forum Discription">
                            {getFieldDecorator('discription', {
                                rules: [{ required: true, message: 'Please input the Forum Description!' }],
                                initialValue: ''
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <Button type="primary" htmlType="submit" style={{margin: '0 0 0 45%'}}>CREATE</Button>
                    </Form>

                </Modal>

            </div>
        );
    }
}
const NewForum = Form.create()(CreateForum);
export default NewForum;
