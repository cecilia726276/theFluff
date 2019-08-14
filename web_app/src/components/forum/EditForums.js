import React, { Component } from 'react';
import { List, Affix, Button, Layout, Icon, message, Modal, Alert, Tooltip } from 'antd';
import { auth, database } from '../../firebase/firebase';

import _ from 'underscore';
import NewForum from "./CreateForum";
import {Link} from 'react-router-dom';
const leftDivStyle = { float:'left', width:'100%', padding: '40px', background: '#fff', height: '100vh', overflowY:'scroll'};
const container = {border: '1px solid #e8e8e8', borderRadius: '4px', overflow: 'auto', padding: '8px 24px', height: 'auto', fontSize:'40px'};
const listButtonStyle = { textAlign:'left', width:'100%', height:'50px', fontSize:20, borderStyle: 'none'};

const confirm = Modal.confirm;



class EditForums extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: auth.currentUser,
        };
        this.userRef = database.ref('users').child(this.state.authUser.uid);
    }
    state = {
        visible: false,
        groups: [],
        enrollmentGroups: [],
        adminGroups: [],
        selectedGroup: '',
        selectedGroup2: '',
    };
    componentWillMount() {

        let groups = database.ref("/groups");
        let enrollmentGroups = this.userRef.child("/enrollment");
        let adminGroups = this.userRef.child('/courseAdmin')
        let _this = this;

        groups.on('value', function(snapshot) {
            _this.setState({
                groups: snapshot.val(),
            });
        });

        enrollmentGroups.on('value', function(snapshot) {
            _this.setState({
                enrollmentGroups: snapshot.val(),
            });
        });

        adminGroups.on('value', function(snapshot) {
            _this.setState({
                adminGroups: snapshot.val(),
            });
        });

        let theRole='';
        this.userRef.child('role').on('value',(snapshot) => {
            this.setState({
                theRole : snapshot.val(),
            });
        })

    }

    rolesCheck(k, e) {
        if (this.state.theRole === 1){
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

   /* showDeleteConfirm(k,e) {
        confirm({
            title: 'Are you sure delete this Forum?',
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
                message.success("Deleted!");

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }*/

    showUnEnrollConfirm(k,e) {
        let _this = this;
        var key_to_delete = k;
        var query = this.userRef.child('/enrollment').child(k);
        var query2 = this.userRef.child('/courseAdmin').child(k);

        query.child('/coursekey').on('value', function(snapshot) {
            _this.setState({
                selectedGroup: snapshot.val(),
            });
        });
        query2.child('/coursekey').on('value', function(snapshot) {
            _this.setState({
                selectedGroup2: snapshot.val(),
            });
        });
        confirm({
            title: 'Are you sure you want to unenroll from this Forum?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                //console.log(k);
                if (_this.state.selectedGroup2){
                    console.log('Cancel');
                    message.error("You cannot unenroll from a course you created");
                }
                else {
                    query.on('child_added', function(snapshot)
                {
                    //console.log(snapshot.ref)
                    snapshot.ref.remove();
                });
                let query_group = database.ref('groups/'+ _this.state.selectedGroup+'/members').child(_this.state.authUser.uid);
                query_group.on('value', function(snapshot)
                {
                    snapshot.ref.remove();
                });

                //this.userRef.child("/enrollment").child(k).remove();
                message.success("Deleted!");
                }

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    render(){
        let groups = this.state.groups;
        let download = _.values(groups).reverse();

        let enrollmentGroups = this.state.enrollmentGroups;
        let enrollmentDownload = _.values(enrollmentGroups).reverse();

        let adminGroups = this.state.adminGroups;
        let adminDownload = _.values(adminGroups).reverse();


        return(
            <Layout style={{ margin: '-24px'}}>
                <div>
                    <div style={ leftDivStyle }>
                        <div>

                            <h1 style={{fontSize:'20px'}}>Current Forums Enrolled In</h1>
                            <List style={container}
                                  dataSource={enrollmentDownload}
                                  renderItem={item => (
                                      <List.Item key={item.enrollmentKey} >
                                          <Button> <Link to={{
                                              pathname : '/Dashboard/forum/members' ,
                                              state : {
                                                  group: item.coursekey,
                                              }
                                          }}> Members</Link></Button>
                                          <Button onClick={this.showUnEnrollConfirm.bind(this, item.coursekey)} type="danger"> Unenroll </Button>

                                          <List.Item.Meta title={item.title} />
                                      </List.Item>

                                  )}
                            />
                            <p></p>
                            <h1 style={{fontSize:'20px'}}>Current Forums Admin In</h1>
                            <List style={container}
                                  dataSource={adminDownload}
                                  renderItem={item => (
                                      <List.Item key={item.enrollmentKey} >
                                          <Button> <Link to={{
                                              pathname : '/Dashboard/forum/members' ,
                                              state : {
                                                  group: item.coursekey,
                                              }
                                          }}> Members</Link></Button>

                                          <List.Item.Meta title={item.title} />
                                      </List.Item>

                                  )}
                            />
                        </div>

                    </div>

                    <NewForum/>

                    {/*<div style={rightDivStyle}>

                        <Affix>
                            <div style={{background: '#fff'}}>
                                <NewForum/>
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
                    </div>*/}

                </div>

            </Layout>


        )
    }
}
/*
                            <h1 style={{fontSize:'20px'}}>All Forums</h1>
                            <List style={container}
                                  dataSource={download}
                                  renderItem={item => (
                                      <List.Item key={item.courseKey} >
                                          {this.state.theRole == 1 ?
                                              <Button onClick={this.rolesCheck.bind(this, item.courseKey)}
                                                      type="dashed"> Delete </Button> : null
                                          }
                                          <List.Item.Meta title={item.title} />
                                      </List.Item>

                                  )}
                            />
                            <p></p>
 */
export default EditForums;
