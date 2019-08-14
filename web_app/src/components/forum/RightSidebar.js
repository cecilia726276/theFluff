import React, { Component } from 'react';
import { Icon, Affix, Button } from 'antd';
import Post from "./AddPost";

const rightDivStyle = { float:'left', width:'20%', paddingLeft:12, minHeight: 380};
const listButtonStyle = { textAlign:'left', width:'100%', height:'50px', fontSize:20, borderStyle: 'none'};

class RightSidebar extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        currentGroup:this.props.currentGroup,
    };

    render() {
        return (
            <div style={ rightDivStyle }>
                {/* Right div: new post & side options */}
                <Affix>
                    <div style={{background: '#fff'}}>
                        <Post currentGroup={this.props.currentGroup}/>
                    </div>

                {/*    <div style={{background: '#fff', marginTop:15}}>

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
                    </div>    */}
                </Affix>
            </div>

        );
    }
}

export default RightSidebar;
