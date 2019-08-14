import React, { Component } from 'react';
import Sidebar from '../components/layout/Sidebar.js';
import UpcomingList from '../components/UpcomingList.js';
import '../styles/Dashboard.css';
import { Layout, Menu, Icon, Button } from 'antd';
import {Link, Redirect, Route, Switch, Router} from 'react-router-dom';
import 'antd/dist/antd.css';
import * as routes from "../router/routes";
import {auth,database,storage} from '../firebase/firebase';
import NewForum from "../components/forum/NewForum";
import Editor from "../components/forum/Editor";
import Member from "../components/forum/Member";
import CalendarB from "../components/calendar/CalendarB";
import CoursePage from "../components/forum/coursesPage";
import EditForums from "../components/forum/EditForums";
import Messages from "../components/messages/Messages";


//import PostDetail from "./components/dashboardcomponents/forumComponents/PostDetail";
import NewPostDetail from "../components/forum/NewPostDetail";
//import FeaturedView from "./components/dashboardcomponents/forumComponents/featuredView";

const { Sider, Content, Header} = Layout;
class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            thekey : this.props.key,
            //authUser : auth.currentUser,
            authUser: this.props.authUser,
            selectedKey: '',
            collapsed: false,
            grouplist: [],
            authUserDir: auth.currentUser,
        };
        if(this.state.authUserDir){
            this.userDir = database.ref('/users').child(this.state.authUserDir.uid);
        }
        this.enrolRef = database.ref('/users/'+ this.state.userDir + '/enrollment');
        this.userRef = database.ref('/users').child('Anonymous');
    }

    componentDidMount(){
        auth.onAuthStateChanged((authUser) => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
            if (authUser) {
                this.userRef = database.ref('users').child(authUser.uid);
                this.enrolRef.on('value',(snapshot) => {
                    var judgeEnrollment = snapshot.numChildren();
                    this.setState({judgeEnrollment});

                });
            }
        })

        if (this.state.authUserDir === null){

        }else if (this.state.judgeEnrollment != 0){
            database.ref('/users/' + this.state.authUserDir.uid).child('enrollment').on('value', (snapshot) => {
                this.setState({grouplist: snapshot.val()})
            });
        }

    }

    componentWillMount() {
        auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })
    }

    render(){
        let grouplist = this.state.grouplist;
        if (grouplist) {
            var groupList = Object.keys(grouplist).map(function (key, index) {
                return <Route exact path={'/Dashboard/' + grouplist[key].coursekey} render={(props) => (
                    <NewForum {...props} currentGroup={grouplist[key].coursekey}/>
                )}/>
            });
            var groupList_detail = Object.keys(grouplist).map(function (key, index) {
                return <Route exact path={'/Dashboard/' + grouplist[key].coursekey + '/newPostDetail'}
                              component={NewPostDetail}/>
            });
        }
        else {
            var groupList = [];
            var groupList_detail = [];
        }
        return(
            this.state.authUser
                ?(
                    <Layout>
                        <Route  render={(props) => (
                            <Sidebar {...props} grouplist={grouplist}/> )}/>

                        <Layout>

                            <Content
                                style={{ background: '#fff', padding: '24px 24px 24px 35px', margin: 0, minHeight: 280 }}>
                                <div>
                                    <Switch>
                                        <Route exact path={'/Dashboard'} component={UpcomingList} />
                                        <Route exact path={'/Dashboard/calendars'} component={CalendarB}/>
                                        <Route exact path={'/Dashboard/courses'} render={(props) => (
                                            <CoursePage {...props} authUser = {this.props.authUser} />
                                        )}/>
                                        <Route path={'/Dashboard/messages'} component={Messages}/>

                                        <Route exact path={'/Dashboard/EditForums'} component={EditForums}/>
                                        <Route exact path={'/Dashboard/forum/members'} component={Member}/>
                                        <Route exact path={'/Dashboard/allposts'} render={(props) => (
                                            <NewForum {...props} currentGroup='allposts'/>
                                        )}/>

                                        {groupList}
                                        {groupList_detail}
                                        <Route exact path={'/Dashboard/allposts/newPostDetail'} component={NewPostDetail}/>
                                        <Route exact path={'/Dashboard/forum/test'} component={Editor}/>
                                    </Switch>
                                </div>
                            </Content>
                        </Layout>
                    </Layout>)
                : (<Redirect to={routes.SIGN_IN}/>)

        )
    }
}

export default Dashboard;
//   <Sidebar grouplist={grouplist}/>
// <Route exact path={'/Dashboard/forum/newPostDetail'} component={NewPostDetail}/>
// <Route exact path={'/Dashboard/forum'} component={forum}/>
// <Route exact path={'/Dashboard/forum/postDetail'} component={PostDetail}/>
