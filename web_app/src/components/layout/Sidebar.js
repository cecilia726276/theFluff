import React, { Component } from 'react';
import * as routes from "../../router/routes";
import {auth, database,storage} from "../../firebase/firebase";
import { Layout, Menu, Icon, Button, Tooltip} from 'antd';
import {Link, Redirect, Route, Switch, Router} from 'react-router-dom';
//import Firstpost from "../forum/groupList"
import UnreadNotification from "../messages/UnreadNotification";
import "../../styles/Sidebar.css"
const { SubMenu } = Menu;
const { Sider} = Layout;
const theFluffStyle ={paddingTop : '25px', paddingLeft : '100px', fontSize : '20px', fontWeight : 'bold', whiteSpace:'nowrap',
    userSelect: 'none', webkitUserSelect: 'none', mozUserSelect: 'none', khtmlUserSelect: 'none', msUserSelect: 'none',webkitTouchCallout: 'none' };


class Sidebar extends Component {
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
            authUserDir: auth.currentUser,
            grouplist: [],
            location: props.location,
        };
        if(this.state.authUserDir){
            this.userDir = database.ref('/users').child(this.state.authUserDir.uid);
            this.enrolRef = database.ref('/users/'+ this.state.authUserDir.uid + '/enrollment');
        }

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

                let theEmail='';
                let theGroups='';
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
            }
        })
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };


    componentWillMount() {
        auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })

        //groupList
        let _this = this;
        if(this.state.authUserDir && (this.state.judgeEnrollment != 0)) {
            let postsRef1 = this.userDir.child('/enrollment/').orderByChild("title");

            postsRef1.on('value', (snapshot) => {
                this.setState({grouplist: snapshot.val()})
            });
        }
    }

    render() {
        let grouplist = this.state.grouplist;
        let location = this.state.location;
        if (grouplist){
            var groupList = Object.keys(grouplist).map(function(key, index) {
                return  <Menu.Item key={'/Dashboard/' + grouplist[key].coursekey}><Link to={{
                    pathname : '/Dashboard/'+grouplist[key].coursekey ,
                    state : {
                        group : grouplist[key].coursekey,
                    }
                }}>{grouplist[key].title}</Link></Menu.Item>
            });
        }
        else var groupList = [];

        return (
                <div>
                    {this.state.collapsed ?
                        <Tooltip>
                            <Icon
                                className="trigger"
                                theme="outlined"
                                //style={{width:'3px', position:'fixed', top:'106px', color:'#1890ff', zIndex:'99'}}
                                style={{width:'3px', position:'fixed', top:'5px', color:'#1890ff', zIndex:'99'}}
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        </Tooltip>
                    :
                        <div style={{height:'calc(100vh - 24px)'}}>
                                <Sider class="scrollHidden" collapsed={this.state.collapsed} style={{background: '#001529', height: '100%', overflowY:'scroll'}}>

                                    <Menu
                                        mode="inline"
                                        defaultSelectedKeys={['/Dashboard/']}
                                        defaultOpenKeys={['sub1']}
                                        theme="dark"
                                        //aria={{}}
                                        style={{height: '100%', borderRight: 0}}
                                        location={location}
                                    >
                                        <div className="logo">
                                            <img src="http://gdurl.com/IE4m"/*"http://gdurl.com/nG0G"*/ className="Header-logo"
                                                 alt="logo" style={{width: 80, height: "auto"}}/>
                                            <p style={theFluffStyle}>
                                                The Fluff
                                            </p>
                                        </div>

                                        <div style={{margin: "50px 0 20px 15px"}}>
                                            <Icon
                                                className="trigger"
                                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                                onClick={this.toggle}
                                            />
                                        </div>

                                        <Menu.Item>
                                            <Link to={routes.ACCOUNT}>
                                                <Icon type="user"/>
                                                <span>{this.state.theUser}</span>
                                            </Link>
                                        </Menu.Item>

                                        <SubMenu key="sub1" title={<span><Icon type="home"/><span>Toolkit</span></span>}>
                                            <Menu.Item key="/Dashboard/"><Link to={'/Dashboard/'}>Dashboard</Link></Menu.Item>
                                            <Menu.Item key="/Dashboard/calendars"><Link to={'/Dashboard/calendars'}>Calendar</Link></Menu.Item>
                                            <Menu.Item key="/Dashboard/messages"><Link
                                                to={'/Dashboard/messages'}>Messages<UnreadNotification/></Link></Menu.Item>
                                        </SubMenu>
                                        <SubMenu key="sub2" title={
                                            <span>
                                          <Icon type="laptop"/><span>Forum</span>
                                          <Button style={{float: 'right', border: '0'}} type="normal" shape="circle" ghost><Link
                                              to={'/Dashboard/EditForums'}><Icon type="edit"/></Link></Button>
                                        </span>
                                        }>
                                            <Menu.Item><Link to={'/Dashboard/courses'}>
                                                <span>Join Courses</span>
                                            </Link>
                                            </Menu.Item>
                                            <Menu.Item key="/Dashboard/allposts"><Link to={'/Dashboard/allposts'}>All
                                                posts</Link></Menu.Item>
                                            {groupList}
                                        </SubMenu>


                                    </Menu>
                                </Sider>
                                <div style={{background:'#001529', height:'24px', padding:'2px 0 0 22px'}}>
                                    <Link to={routes.LOG_OUT}>
                                        <Icon type="poweroff"/>
                                        <span> Log Out</span>
                                    </Link>
                                </div>
                        </div>
                    }
            </div>

        );
    }
}

export default Sidebar;
/*  <Menu.Item key="/Dashboard/forum"><Link to={'/Dashboard/forum'}>All posts</Link></Menu.Item> */
