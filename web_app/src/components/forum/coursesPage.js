import React, { Component } from 'react';
import * as routes from "../../router/routes";
import Sidebar from '../layout/Sidebar.js';
import {auth, database} from "../../firebase/firebase";
import { Layout, Divider, Menu, Icon, Button, Form, Input, Radio, Tag, message, Tooltip, Modal, } from 'antd';
import {Link, Redirect, Route, Switch, Router} from 'react-router-dom';
import Courses from "../forum/SearchEnroll";
//import Course from "../forum/AddGroup"

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

class coursesPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            thekey : this.props.key,
            authUser: this.props.authUser,
            selectedKey: '',
            collapsed: false,
            currentGroup:this.props.currentGroup,
            //groupList
            groups:["COMP3310"/*,"COMP3120","COMP3310","COMP2420"*/],
            firstpost:[],
            selectedGroup: '',

        };
        this.userRef = database.ref('/users').child('Anonymous');
        //this.event = database.ref('')
    }

    componentDidMount(){
        auth.onAuthStateChanged((authUser) => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
            if (authUser) {
                this.userRef = database.ref('users').child(authUser.uid);
            }
            /*
            //personal draft, please ignore
            if (authUser) {
                this.userRef = database.ref('/users').child(authUser.uid);
                this.guidesRef.on('value', (snapshot) => {
                    const guides = snapshot.val();
                    this.setState({guides});
                })
                this.userRef.child('images').on('value', (snapshot) => {
                    const userImages = snapshot.val();
                    if (userImages) {
                        this.setState({userImages});
                    }
                });
                // register function messaging alert for this user
                registerMessaging(authUser);
                // Add user to users database if not exist
                this.userRef.once('value', (snapshot) => {
                    const userData = snapshot.val();
                    if (!userData) {
                        this.userRef.set({ name: authUser.displayName });
                    }
                });
            }else {
                this.setState({ guides: null, userImages: null });
            }*/
        })
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
        auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })

    }


    render() {

        return (
            this.state.authUser
                ?(
                <div style={{margin:'-24px -24px -24px 0', padding:'24px 24px 24px 0', height:'100vh', background: '#fff', overflowY:'scroll'}}>
                    <div>
                        <Courses/>
                    </div>
                </div>
            )
            : (<Redirect to={routes.SIGN_IN}/>)
        )
    }
}
//const Courses = Form.create()(coursesPage);
export default coursesPage;
