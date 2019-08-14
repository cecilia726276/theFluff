import React, { Component } from 'react';
import * as routes from "../../router/routes";
import _ from 'underscore';
import '../../styles/forum.css'
import sortBy from 'lodash/sortBy';
import {message, Menu, Button, Icon, List, Avatar,Spin } from 'antd';
import {auth,database} from '../../firebase/firebase';
import {Link, Redirect, Route, Switch, Router} from 'react-router-dom';

const IconText = ({ type, text }) => (
    <span>
    <Icon type={type}  style={{ marginRight: 8 }} />
        {text}
  </span>
);

function checkAnonymous(anonymous, name) {
    if (anonymous == true){
        return 'Anonymous';
    } else {
        return name;
    }
}


class FeaturedList extends Component {
    constructor(props) {
        super(props);
        this.userRef = database.ref('/users').child('Anonymous');
        if(this.state.authUserDir){
            this.userDir = database.ref('/users').child(this.state.authUserDir.uid);
            this.membersRef = database.ref('/groups/'+ this.state.currentGroup+'/members');
        }
    }

    state = {
        currentGroup:this.props.currentGroup,
        posts: [],
        loading: false,
        hasMore: true,
        test:true,
        membersId:[],
        grouplist: [],
        authUserDir: auth.currentUser,
    };
    componentWillReceiveProps(nextProps) {
        this.forceUpdate();
    }


    componentWillMount() {
        const{currentGroup,} = this.state;
        let postsRef = database.ref("groups/" + currentGroup + '/posts/');

        let _this = this;

        postsRef.on('value', function(snapshot) {
            _this.setState({
                posts: snapshot.val(),
                //loading: false
            });
        });

        if(this.state.authUserDir) {

            let postsRef1 = database.ref('groups/' + this.state.currentGroup + '/posts/').orderByChild("pinned").equalTo(true);

            postsRef1.on('value', (snapshot) => {
                this.setState({grouplist: snapshot.val()})
            });

            this.membersRef.on('value',(snapshot) => {
                this.setState({
                    membersId: snapshot.val()
                });
            })

        }
    }

    handlePinned = (post) => {
        const userID = auth.currentUser.uid;
        if (post.pinnedby){
            let pinnedlist = _.values(post.pinnedby);
            if (pinnedlist.indexOf(userID) === false){
                return "default";
            }else{
               return "primary";
            }
        }else{
            return "default";
        }
    }

    handleLiked = (post) => {
        const userID = auth.currentUser.uid;
        if (post.likedby){
            let likelist = _.values(post.likedby);
            if (likelist.indexOf(userID) === -1){
                return "default";
            }else{
               return "primary";
            }
        }else{
            return "default";
        }
    }

    getReplies = (post) => {
        if (post.replies){
            return Object.keys(post.replies).length;
        }else{
            return 0;
        }
    }

    handleUpvote = (post, key) => {
        const userID = auth.currentUser.uid;
        if (post.likedby) {
            let likelist =_.values(post.likedby);
            console.log("before");
            console.log(likelist);
            if(likelist.indexOf(userID) === -1){
                likelist.push(userID);
                database.ref('groups/' + this.state.currentGroup + '/posts/' + key).update({
                    upvotes: post.upvotes + 1,
                    likedby: likelist,
                });
            }else {
                console.log(userID);
                likelist.splice([likelist.indexOf(userID)],1);
                console.log("after");
                console.log(likelist);
                database.ref('groups/' + this.state.currentGroup + '/posts/' + key).update({
                    upvotes: post.upvotes - 1,
                    likedby: likelist,
                });
            }
        }else{
            database.ref('groups/' + this.state.currentGroup + '/posts/' + key).update({
                upvotes: post.upvotes + 1,
                likedby: [userID],
            });
        }
    }

    handlePin = (post, key) => {
        const userID = auth.currentUser.uid;
        if (post.pinnedby) {
            let pinnedlist =_.values(post.pinnedby);
            console.log("before");
            console.log(pinnedlist);
            if(pinnedlist.indexOf(userID) === -1){
                pinnedlist.push(userID);
                database.ref('groups/' + this.state.currentGroup + '/posts/' + key).update({
                    pinned: true,
                    pinnedby: pinnedlist,
                });
            }else {
                console.log(userID);
                pinnedlist.splice([pinnedlist.indexOf(userID)],1);
                console.log("after");
                console.log(pinnedlist);
                database.ref('groups/' + this.state.currentGroup + '/posts/' + key).update({
                    pinned: false,
                    pinnedby: pinnedlist,
                });
                database.ref('groups/' + this.state.currentGroup + '/posts/' + key).child('pinned').remove();
            }
        }else {
            database.ref('groups/' + this.state.currentGroup + '/posts/' + key).update({
                pinned: true,
                pinnedby: [userID],
            });
        }
    }

    /*handleDownvote = (post, key) => {
        console.log("pressed downvote")
        database.ref('groups/'+ this.state.currentGroup +'/posts/' + key + '/votes').set({
            upvotes: post.votes.upvotes,
            downvotes: post.votes.downvotes + 1,

        });
    }

    displayPost=()=>{
        var postsRef = database.ref("posts/")
        return (
            postsRef.on("child_added", function(data, prevChildKey) {
                var newPost = data.val();
                "Title: " + newPost.title;
                "Post: " +  newPost.title;
                "Previous Post: " + prevChildKey
                console.log("title: " + newPost.title);
            })
        )
    }

    handleInfiniteOnLoad = () => {
        let data = _.values(this.state.posts);
        this.setState({
            loading: true,
        });
        if (data.length > 3) {
            message.warning('on the bottom');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.getData((res) => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    }*/

    render() {
        let posts = this.state.posts;
        let grouplist = this.state.grouplist;
        let test = this.state.test;
        let _this = this;
        let currentGroup = this.state.currentGroup;
        let download = _.values(posts).reverse();

        let download2 = _.values(grouplist).reverse();
        let membersId = this.state.membersId;



        if (!posts) {
            return false;
        }

        if (this.state.loading) {
            return (
                <div>
                    Loading... <Icon type="loading" />
                </div>
            );
        }
        //var postsRef = database.ref("posts/")
        /*tried but didnt work <div><h1 style={{fontSize: '1.5em'}}>{(posts[key].post.toString().length() > 30)
                    ?(posts[key].post.toString().substr(0, 30) + "...")
                    :(posts[key].post)}</h1></div>*/

        return (
                <span>
                    {(download2.length !== 0)
                        ? (
                            <List
                            itemLayout="vertical"
                            dataSource={download2}
                            renderItem={item => (
                                <List.Item
                                    key={item.title}
                                    actions={[
                                        <span>
                                <Button type={this.handleLiked(item)} icon='like-o' size='small' style={{ marginRight: 8 }} onClick={ this.handleUpvote.bind(this, item, item.newPostKey) }/>
                                            {item.upvotes}
                                </span>,
                                        <IconText type="message" text={this.getReplies(item)} />,
                                        <Button type={this.handlePinned(item)} icon='pushpin' size='small' style={{ marginRight: 8 }} onClick={ this.handlePin.bind(this, item, item.newPostKey) }/>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<Link to={{
                                            pathname : '/Dashboard/'+currentGroup+'/newPostDetail' ,
                                            state : {
                                                key: item.newPostKey,
                                                group : currentGroup,
                                            }
                                        }}>{item.title  + " (pinned post)"}</Link>}
                                        description={"Posted by "+ checkAnonymous(item.anonymous, item.userName) }
                                    />
                                    {(item.post == null)
                                        ? <p>No post.</p>
                                        : (item.post.substring(0,200) + " ...")}
                                    <br/>
                                    { (membersId[item.userID] === 3)
                                        ? <span style={{alignSelf: 'flex-end'}}>(Student)</span>
                                        : [
                                            ((membersId[item.userID] === 2)
                                                    ? <span style={{alignSelf: 'flex-end'}}>(Tutor)</span>
                                                    : <span style={{alignSelf: 'flex-end'}}>(Lecturer)</span>
                                            )
                                        ]
                                    }

                                </List.Item>

                            )}
                        />)
                        : (<div/>)
                    }
                    {(download.length !== 0)
                        ? (
                            <List
                            itemLayout="vertical"
                            dataSource={download}
                            renderItem={item => (
                                <List.Item
                                    key={item.title}
                                    actions={[
                                        <span>
                                <Button type={this.handleLiked(item)} icon='like-o' size='small' style={{ marginRight: 8 }} onClick={ this.handleUpvote.bind(this, item, item.newPostKey) }/>
                                            {item.upvotes}
                                </span>,
                                        <IconText type="message" text={this.getReplies(item)} />,
                                        <Button type={this.handlePinned(item)} icon='pushpin' size='small' style={{ marginRight: 8 }} onClick={ this.handlePin.bind(this, item, item.newPostKey) }/>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<Link to={{
                                            pathname : '/Dashboard/'+currentGroup+'/newPostDetail' ,
                                            state : {
                                                key: item.newPostKey,
                                                group : currentGroup,
                                            }
                                        }}>{item.title}</Link>}
                                        description={"Posted by "+ checkAnonymous(item.anonymous, item.userName) }
                                    />
                                    {(item.post == null)
                                        ? <p>No post.</p>
                                        : (item.post.substring(0,200) + " ...")}
                                    <br/>
                                    { (membersId[item.userID] === 3)
                                        ? <span style={{alignSelf: 'flex-end'}}>(Student)</span>
                                        : [
                                            ((membersId[item.userID] === 2)
                                                    ? <span style={{alignSelf: 'flex-end'}}>(Tutor)</span>
                                                    : <span style={{alignSelf: 'flex-end'}}>(Lecturer)</span>
                                            )
                                        ]
                                    }

                                </List.Item>

                            )}
                        />)
                        :(<div/>)
                    }
                </span>
        )


}

}
export default FeaturedList;

/*
const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: 5,
            total: download.length,
            defaultPageSize: 5,
        };

                                <span>
                                <Button  icon='caret-down' style={{ marginRight: 8 }} onClick={ this.handleDownvote.bind(this, item, item.newPostKey) }/>
                                    {item.votes.downvotes}
                                </span>,
                                <IconText type="like-o" text={item.votes.upvotes} />,

            <div className="demo-infinite-container">
                                pagination={paginationProps}
<InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                 {this.state.loading && this.state.hasMore && (
                        <div className="demo-loading-container">
                            <Spin />
                        </div>
                    )}
                                </InfiniteScroll>

                            <List.Item.Meta
                                title={<a href={item.href}>{item.title}</a>}
                                description={item.description}
                            />
 */
