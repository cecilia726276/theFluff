import React, { Component } from 'react';
import {auth, database} from "../../firebase/firebase";
import AddMember from  './AddMember';
import { List, Avatar, Button, Layout, Select, Menu, Dropdown, Icon, SearchBox, Tabs, Card } from 'antd';
import {Link, Redirect} from 'react-router-dom';
import Pending from "./Pending";
import {message, Modal} from "antd/lib/index";
import * as routes from "../../router/routes";
const { Header, Footer, Content } = Layout;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

/*function getDetail(keys) {
    let tempMembers = [];
    let counter = 0;
    for (let eachMember in keys) {
        database.ref('users').child(eachMember).on('value', (s) => {
            tempMembers[counter] = s.val();
            counter++;
        })
    }
    return tempMembers;
}*/
/*function getUsername(keys){
    database.ref('users/'+ keys + '/username').once('value').then(function(snapshot) {
        let userName = snapshot.val();
        this.setState({userName});
    });
    console.log(this.state.userName);
    return this.state.userName;
}*/

class Member extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGroup : this.props.location.state.group,
            groupName: '',
            authUser: auth.currentUser,
            membersId:[],
            forumMembers:'',
            allUsers:'',
            deleted: false,
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
        this.groupRef = database.ref('/groups/'+ this.state.currentGroup+'/title');
        this.forumRef = database.ref('/groups/'+ this.state.currentGroup+'/members');
        this.createrRef = database.ref('/groups/'+ this.state.currentGroup+'/AdminID');
    }

    componentWillMount(){
        if (this.state.deleted){
            //do nothing
        }else {
            let _this = this;
            this.groupRef.on('value', (snapshot) => {
                this.setState({
                    groupName: snapshot.val()
                })
            })
            database.ref('/users').on('value', (snapshot) => {
                this.setState({
                    allUser: snapshot.val()
                })
            })
            this.forumRef.on('value', (snapshot) => {
                this.setState({
                    membersId: snapshot.val()
                });

            })
            this.createrRef.on('value', (snapshot) => {
                this.setState({
                    createrID: snapshot.val()
                });
            })
        }

    }
    /*getUsername = (keys) => {
        let _this = this;
        let userName;
        return database.ref('users/'+ keys + '/username').once('value').then(function(snapshot) {
            userName = snapshot.val();
            return userName;
        });
        //console.log(this.state.userName);
    }*/
    /*componentDidMount(){
        let _this = this;
        this.setState({
            forumMembers: getDetail(this.state.membersId)
        })
    }*/

    handleAssign(k, role, e){
        var theRole = role;
        if(role === 2){
            theRole = 3;
        }else{
            theRole = 2;
        }
        database.ref('/groups/'+ this.state.currentGroup+'/members/' + k).transaction(function (current_value) {
            return theRole;
        });
    }

    rolesCheck(k, e) {
        let _this = this;
        if (this.state.membersId[this.state.authUser.uid] === 1){
            var key = k;
            return confirm({
                title: 'Are you sure to delete this Forum?',
                content: '',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    console.log('OK');
                    database.ref('/groups/'+k+'/members').on('value', function(snapshot) {
                        let allMembers= snapshot.val();
                        console.log(allMembers);
                        for (let x in allMembers){
                            database.ref('/users/'+x+'/enrollment/').child(k).remove();
                            console.log(x);
                        }
                    });
                    database.ref("/groups").child(k).remove();
                    _this.setState({
                        deleted: true
                    })

                    message.success("Deleted!");

                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        } else {
            return alert('Sorry, you do not have the permission to delete the forum.');
        }
    }

    render(){
        let _this = this;
        //console.log(this.state.forumMembers);
        //let membersKeys = Object.keys(_this.state.membersId);
        let allUser = this.state.allUser;
        let membersId = this.state.membersId;
        let createrID = this.state.createrID;
        let userID = this.state.authUser.uid;
        let roleTutor = 3;
        return(
            this.state.deleted
                ? (<Redirect to={{pathname : '/Dashboard/EditForums'}}/>):
                (<div style={{height:'100vh', overflowY:'scroll', margin:'-24px -24px -24px 0', padding:'24px 4px 4px 0'}}>
                <Link to={{ pathname : '/Dashboard/EditForums'}}><Button icon="left-circle-o" style={{marginBottom:'10px'}}>Back</Button></Link>
                    <h1 style={{fontSize:'20px'}}> Forum members ({_this.state.groupName})</h1>
                    { (this.state.membersId[this.state.authUser.uid] === 1)
                        ? (
                            <div>
                            <div>You can add a new member or approve users to join {_this.state.groupName}.<Button onClick={this.rolesCheck.bind(this, _this.state.currentGroup)} type="dashed" style={{float:'right'}} icon="delete" /></div>
                            <br/>
                            <div className="card-container">
                                <Card>
                                <Tabs  defaultActiveKey="1" size='large' >
                                    <TabPane tab="Add member" key="1"><AddMember currentGroup={this.state.currentGroup}/></TabPane>
                                    <TabPane tab="Pending request" key="2"><Pending currentGroup={this.state.currentGroup}/></TabPane>
                                </Tabs>
                                </Card>
                                <br/>
                            </div>
                            </div>):
                            (<div><div>Members can be added by forum Creators or Lecturers</div>
                                <br/></div>)
                    }

                <List
                    header={'Members of '+ _this.state.groupName + ' (' + Object.keys(_this.state.membersId).length + ')'}
                    bordered
                    className="member-list"
                    itemLayout="horizontal"
                    dataSource={Object.keys(_this.state.membersId)}
                    renderItem={item => (
                        <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title=
                                        { allUser
                                            ? allUser[item].username
                                            : null
                                        }
                                    description =
                                        { allUser
                                            ? allUser[item].email
                                            : null
                                        }
                                />
                                <div>
                                    {
                                        (createrID === userID)
                                        ?[
                                            (createrID === item)
                                            ?[
                                                (membersId[item] === 3)
                                                ? <span style={{alignSelf: 'flex-end'}}>Student</span>
                                                : [
                                                    ((membersId[item] === 2)
                                                            ? <span style={{alignSelf: 'flex-end'}}>Tutor</span>
                                                            : <span style={{alignSelf: 'flex-end'}}>Lecturer</span>
                                                    )
                                                ]
                                            ]
                                            :[
                                                <Dropdown overlay={
                                                        <Menu>
                                                            <Menu.Item key="2" disabled={membersId[item] === 2}>
                                                                <a onClick={this.handleAssign.bind(this, item, membersId[item])} >Tutor</a>
                                                            </Menu.Item>
                                                            <Menu.Item key="3" disabled={membersId[item] === 3}>
                                                                <a onClick={this.handleAssign.bind(this, item, membersId[item])} >Student</a>
                                                            </Menu.Item>
                                                        </Menu>}>

                                                        <div>
                                                            {
                                                                (membersId[item] === 3)
                                                                ? <span style={{alignSelf: 'flex-end'}}>Student</span>
                                                                : [
                                                                    ((membersId[item] === 2)
                                                                            ? <span style={{alignSelf: 'flex-end'}}>Tutor</span>
                                                                            : <span style={{alignSelf: 'flex-end'}}>Lecturer</span>
                                                                    )
                                                                ]
                                                            }<Icon type="down" />
                                                        </div>
                                                </Dropdown>
                                            ]
                                        ]
                                        :[
                                            (membersId[item] === 3)
                                            ? <span style={{alignSelf: 'flex-end'}}>Student</span>
                                            : [
                                                ((membersId[item] === 2)
                                                        ? <span style={{alignSelf: 'flex-end'}}>Tutor</span>
                                                        : <span style={{alignSelf: 'flex-end'}}>Lecturer</span>
                                                )
                                            ]
                                        ]
                                    }
                                </div>
                        </List.Item>
                    )}
                />
            </div>)
        )
    }
}

export default Member;
