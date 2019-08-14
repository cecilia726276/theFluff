import React, { Component } from 'react';
import {auth, database} from "../../firebase/firebase";
import { List, Checkbox, Button,Card } from 'antd';
import {message} from "antd/lib/index";

const CheckboxGroup = Checkbox.Group;
class Pending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGroup: this.props.currentGroup,
            requestMember: '',
            authUser: auth.currentUser,
            checkAll: false,
            groupName: '',
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
        this.requestRef = database.ref('/groups/' + this.state.currentGroup + '/request');
        this.groupRef = database.ref('/groups/' + this.state.currentGroup + '/title');
    }
    componentWillMount(){
            let _this = this;
            this.requestRef.on('value',(snapshot) => {
                this.setState({
                    requestMember: snapshot.val()
                })
            });
            database.ref('/users').on('value', (snapshot) => {
                this.setState({
                    allUser: snapshot.val()
                })
            });
             this.groupRef.on('value', (snapshot) => {
                this.setState({
                    groupName: snapshot.val()
                })
            });
            /*
            database.ref('/users').on('value', (snapshot) => {
                this.setState({
                    allUser: snapshot.val()
                })
            });
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
            */
        }
    acceptRequest = (e) => {
        let userId = e
        //get requestId in /request/userId
        let requestId = this.state.requestMember[userId].requestId;
        //add enrollment detail to users
        database.ref('users/'+userId).child('/enrollment/'+ this.state.currentGroup).set({
            title: this.state.groupName,
            coursekey: this.state.currentGroup,
        });
        //change the status of user's requestedHistory from 2 (pending) to 1 (accepted)
        database.ref('users/' + userId+ '/requestedHistory/').child(requestId+'/status').transaction(function(current_value){
            return 1;
        });
        //database.ref('users/'+userId).child('requestedHistory')
        database.ref('groups/'+this.state.currentGroup+'/members/'+userId).transaction(function (current_value) {
            return 3;
        });

        this.requestRef.child(userId).remove();
        message.success("Joined Successfully!")
    }

    declineRequest = (e) => {
        let userId = e;
        //get requestId in /request/userId
        let requestId = this.state.requestMember[userId].requestId;
        //change the status of user's requestedHistory from 2 (pending) to 0 (declined)
        database.ref('users/' + userId+ '/requestedHistory/').child(requestId+'/status').transaction(function(current_value){
            return 0;
        });
        this.requestRef.child(userId).remove();
        message.success("Declined")
    }

    render(){


        return(
            <div>
            {this.state.requestMember
                ? <div>
                    <Card title='Users request to join the forum'>
                    <List
                        itemLayout="horizontal"
                        dataSource={Object.keys(this.state.requestMember)
                            ? Object.keys(this.state.requestMember)
                            : null}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={this.state.allUser[item].username}
                                    description={this.state.allUser[item].email}
                                />
                                <Button onClick={this.acceptRequest.bind(this, item)}>Accept</Button>
                                <Button type ='danger' onClick={this.declineRequest.bind(this, item)}>Decline</Button>
                            </List.Item>
                        )}
                    />
                    </Card>
                </div>
                :<div>No pending request.</div> }
                </div>

        )
    }
}
export default Pending;