import React, { Component } from 'react';
import {auth,database} from '../../firebase/firebase';
import { Input,Form,Button,Tag, Select,message, Card,Modal } from 'antd';

message.config({
    top: 100,
    duration: 2,
});
const FormItem = Form.Item;
const Option = Select.Option;

class SearchEnroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGroup:this.props.currentGroup,
            authUser: auth.currentUser,
            visible: false,
            firstPost:'',
            forumSelected: '',
            idName: '',
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
    }

    onSubmit = (event) => {
        event.preventDefault();
        const{authUser,forumSelected} = this.state;
        // console.log(this.state.idName)
        let _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {

                let lol = this.userRef.child('/enrollment');
                let inRequest = database.ref('/groups/'+forumSelected).child('/request');

                lol.child(forumSelected).once("value",snapshot => {
                    if (snapshot.exists()){
                        this.setState({ visible: false });
                        message.error("You are already enrolled in this course")
                    }
                    else {
                        inRequest.child(authUser.uid).once("value",requestSnapshot =>{
                            if (requestSnapshot.exists()){
                                this.setState({ visible: false });
                                message.error("You have already sent a pending request")
                            }
                            else{
                                let myDate = new Date();
                                let newPostKey = _this.userRef.child('/requestedHistory').push().key;
                                database.ref('groups/'+forumSelected).child('/request/'+authUser.uid).set({
                                    time: JSON.stringify(myDate),
                                    requestId: newPostKey,
                                });

                                //add a request history to the user
                                this.userRef.child('/requestedHistory/'+newPostKey).set({
                                    status:2,
                                    coursekey: forumSelected,
                                    title: this.state.idName,
                                })


                                this.setState({ visible: false });
                                message.success("Sent Request Successfully!")
                                this.props.form.resetFields();
                            }
                        })
                    }
                });

            }
        })
    }

    componentWillMount(){
        database.ref("groups").on('value', (snapshot) => {
            this.setState({firstPost: snapshot.val()})
        });
    }

    handleEnroll = (e) =>{
        let newList = e.substr(0,20);
        let title = this.state.firstPost[newList].title;
        this.setState({
            forumSelected:newList,
            idName: title,
        })
    }

    onVisible = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({visible: true});
            }
        })
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let allGroups = this.state.firstPost;
        let forumSelected = this.state.forumSelected;
        let visible = this.state.visible;
        let children = [];
        let key;
        for (key in allGroups){
            let title = allGroups[key].title;
            let description = allGroups[key].discription;
            children.push(<Option key={key+';'+title}>{title}</Option>)

        }
        return(
            <div>
                <Card title="Join the forums">
                    <Form layout='vertical' onSubmit={this.onVisible}>

                        <FormItem label="Select the forum to join">
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'Please select the forum you want to join!' }],
                            })(

                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Search for forums"
                                    onChange={this.handleEnroll}
                                    showArrow = {false}
                                >
                                    {children}
                                </Select>
                            )}

                        </FormItem>

                        <Button type="primary" htmlType="submit" style={{margin: '0 0 0 45%'}}>Enroll</Button>
                    </Form>
                </Card>
                <br/>
                {forumSelected
                    ?
                    (<div>
                        <Card title={'Selected forum detail:'}>
                            <Card title={'Title: '+ allGroups[forumSelected].title}>
                                {'Description: ' + allGroups[forumSelected].discription}
                                </Card>
                        </Card>
                    </div>)
                : (<div/>)}
                <Modal
                    width={'40%'}
                    visible={visible}
                    title="Join in the Course Forum"
                    onCancel={this.handleCancel}
                    footer= {null}
                >

                    <Form onSubmit={this.onSubmit}>
                        <span>Are you sure you want to join this course?</span>
                        <Button type="primary" htmlType="submit" style={{margin: '0 0 0 80%'}}>Join Course</Button>
                    </Form>

                </Modal>

            </div>
        )
    }
}

const Course = Form.create()(SearchEnroll);
export default Course;