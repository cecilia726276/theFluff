import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {auth,database} from '../../firebase/firebase';
import { Button, Modal, Form, Input, Radio, Tag, message, Tooltip, Icon, Menu, Card } from 'antd';
import $ from 'jquery';
const listStyle={width:'60%'};
message.config({
    top: 300,
    duration: 2,
});

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});
const FormItem = Form.Item;
const { TextArea } = Input;
const newPostStyle = {width:'100%', height:'50px', fontSize:30, background:'#bfbfbf'};

class AddGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGroup:this.props.currentGroup,
            authUser: auth.currentUser,
            visible: false,
            inputVisible: false,
            inputValue: '',
            firstpost:[],
            idName: '',
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
        const{currentGroup,authUser} = this.state;
       // console.log(this.state.idName)
        let _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {

                let lol = this.userRef.child('/enrollment');
                let inRequest = database.ref('/groups/'+currentGroup).child('/request');

                lol.child(currentGroup).once("value",snapshot => {
                    if (snapshot.exists()){
                        message.error("You are already enrolled in this course")
                    }
                else {
                      inRequest.child(authUser.uid).once("value",requestSnapshot =>{
                          if (requestSnapshot.exists()){
                              message.error("You have already sent a pending request")
                          }
                          else{
                              let myDate = new Date();
                              let newPostKey = _this.userRef.child('/requestedHistory').push().key;
                              database.ref('groups/'+currentGroup).child('/request/'+authUser.uid).set({
                                  time: JSON.stringify(myDate),
                                  requestId: newPostKey,
                              });

                              //add a request history to the user
                              this.userRef.child('/requestedHistory/'+newPostKey).set({
                                  status:2,
                                  coursekey: currentGroup,
                                  title: this.state.idName,
                              })

                             /* this.userRef.child('/enrollment/'+ currentGroup).set({

                                  title: this.state.idName,
                                  coursekey: currentGroup,
                              });

                              database.ref('groups/'+currentGroup+'/members/'+authUser.uid).transaction(function (current_value) {
                                  return 3;
                              });*/


                              this.setState({ visible: false });
                              message.success("Sent Request Successfully!")
                              this.props.form.resetFields();
                          }
                      })
                //let newPostKey = database.ref('groups/'+ currentGroup).child('posts').push().key;
                }
            });

            }
        })
    };



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

    componentWillMount() {
        //groupList
        let _this = this;
        let postsRef1 = database.ref("groups");
        console.log("currentGroup" + this.state.currentGroup);

        postsRef1.on('value', (snapshot) => {
            this.setState({firstpost: snapshot.val()})
        });


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
        this.setState({
            inputVisible: false,
            inputValue: '',
        });
    }

    saveInputRef = input => this.input = input;

    render() {

        const { visible, selectedTags,inputVisible, inputValue} = this.state;
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

        let {firstpost, currentGroup} = this.state;
        let _this = this;

        //let {btnSubmit} = this.onTSubmit;
        let visibleModal = this.showModal;

        var groupList = Object.keys(firstpost).map(function(key, index) {
            return (
                <li key={key} style={{listStyleType:'none', marginBottom:'5px'}}>
                    <Card title={firstpost[key].title} bordered={true} style={{ width: '90%', padding:'-50px'}}>
                        <div style={{height:'60px', overflow:'auto', float:'left', width:'90%', padding:'-5px'}}>
                            {firstpost[key].discription ?
                                <div><p style={{fontWeight:'bold'}}>Description:</p><p style={{marginTop:'-15px'}}>&emsp;&emsp;&emsp;{firstpost[key].discription}</p></div>
                                    : <div>Description:<br/>&emsp;&emsp;&emsp;Null</div>
                            }
                        </div>
                        <div style={{float:'left', width:'10%'}}>
                            <Button style={{float:'right'}} id={'myButton'+[key]} onMouseDown={(e) => {
                                _this.setState({idName: firstpost[key].title});
                                _this.setState({currentGroup: key});
                            }} onClick={visibleModal}>
                                Enroll in
                            </Button>
                        </div>

                    </Card>

                </li>
            )
        });
        return (
            <div style={{height:'calc(100vh - 48px)', overflowY:'scroll'}}>
                <div>
                    {groupList}
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
            </div>
        )
    }
}
const Course = Form.create()(AddGroup);
export default Course;
