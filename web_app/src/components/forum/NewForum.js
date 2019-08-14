import React, { Component } from 'react';
import { Tabs, Layout } from 'antd';
import SearchBox from './ForumSearchBox.js'
import FeaturedList from "./featuredList";
import TopRatedList from "./topRatedList";
import InstructorList from "./instructorList";
import RightSidebar from "./RightSidebar.js"
import {auth} from "../../firebase/firebase";
import Post from "./AddPost";
const TabPane = Tabs.TabPane;

const leftDivStyle = { float:'left', width:'100%', padding: '24px', background: '#fff', height: '100vh', overflowY:'scroll'};

class NewForum extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: props.location,
            currentGroup: props.currentGroup,
        };
    }

    componentWillMount() {
        auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })
        console.log("currentGroup: "+this.state.currentGroup);
        console.log("location: "+ this.state.location.pathname);

    }


    render(){
        //let currentGroup = this.state.currentGroup;
        return(
            <Layout style={{ margin: '-24px'}}>{/* 3rd level layout*/}
                <div>
                    <div style={ leftDivStyle }>
                        {/* Left div: show forum content */}
                        <Tabs  defaultActiveKey="1" tabBarExtraContent={<SearchBox currentGroup={this.state.currentGroup}/>}>
                            <TabPane tab="Pinned" key="1"><FeaturedList currentGroup={this.state.currentGroup}/></TabPane>
                            <TabPane tab="Default" key="2"><TopRatedList currentGroup={this.state.currentGroup}/></TabPane>
                        </Tabs>
                    </div>

                    {/*<RightSidebar currentGroup={this.state.currentGroup}/>*/}
                    <Post currentGroup={this.state.currentGroup}/>


                </div>
            </Layout>


        )
    }
}

export default (props)=><NewForum {...props} key={props.location.pathname} />
