import React, { Component } from 'react';
import {auth, database} from "../../firebase/firebase";
import { Input,Form,Button,Tag, Select,message, Card } from 'antd';


message.config({
    top: 300,
    duration: 2,
});
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

class AddMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGroup: this.props.currentGroup,
            authUser: auth.currentUser,
            groupName:'',
            membersId: [],
            allUsers: '',
            roleSelected: 3,
            memberSelected:[],
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
        this.groupRef = database.ref('/groups/' + this.state.currentGroup + '/title');
        this.forumRef = database.ref('/groups/' + this.state.currentGroup + '/members');
    }

    componentWillMount(){
        this.forumRef.on('value',(snapshot) => {
            this.setState({
                membersId: snapshot.val()
            });
        })
        database.ref('/users').on('value',(snapshot)=>{
            this.setState({
                allUser: snapshot.val()
            })
        })
        this.groupRef.on('value',(snapshot) => {
            this.setState({
                groupName: snapshot.val()
            });
        })

    }


    onSubmit = (event) => {
        event.preventDefault();
        let _this = this;
        let memberSelected = this.state.memberSelected;
        this.props.form.validateFields((err, values) => {
            if (!err) {
               for (let x in memberSelected){
                   this.forumRef.child(memberSelected[x]).transaction(function(){
                       return _this.state.roleSelected
                   })
                   database.ref('users/'+memberSelected[x]+'/enrollment').child(_this.state.currentGroup).set({
                       coursekey: _this.state.currentGroup,
                       title: _this.state.groupName
                   })
               }
                message.success("Create successfully!");
                this.props.form.resetFields();

            }
        })
    }
    handleChange = (e) =>{
        this.setState({
            roleSelected: e
        })
    }

    handleMembers = (e) =>{
        let newList = e.map(x => x.substr(0,28));
        this.setState({
            memberSelected:newList
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        let allUser = this.state.allUser;
        let children = [];
        let key;
        for (key in allUser){
            let username = allUser[key].username;
            let email = allUser[key].email;
            children.push(<Option key={key+';'+username+ ' '+email}>{username +'  |  '+ email}</Option>)
        }
        return(
            <div>
                <Card title="Add members to the forum">
                <Form layout='vertical' onSubmit={this.onSubmit}>

                <FormItem label="Select members to invite">
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: 'Please select the user you want to invite!' }],
                    })(
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Search for members to update or invite"
                            onChange={this.handleMembers}
                        >
                            {children}
                        </Select>
                    )}

                </FormItem>

                <FormItem label="Choose a role permission">
                    <Select defaultValue={3} onChange={this.handleChange}>
                        <Option value={3}>Student</Option>
                        <Option value={2}>Tutor</Option>
                        <Option value={1}>Lecturer</Option>
                    </Select>
                </FormItem>
                <Button type="primary" htmlType="submit" style={{margin: '0 0 0 45%'}}>Add to forum</Button>
                </Form>
                </Card>
            </div>
        )
    }
}
const NewMember = Form.create()(AddMember);
export default NewMember;