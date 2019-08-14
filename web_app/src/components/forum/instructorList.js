
import React, { Component } from 'react';
import _ from 'underscore';
import '../../styles/forum.css'
import { Button, Icon, List, } from 'antd';
import {auth,database} from '../../firebase/firebase';
import {Link} from 'react-router-dom';
//import InfiniteScroll from 'react-infinite-scroller';

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


class InstructorList extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        currentGroup:'allposts',
        posts: [],
        loading: false,
        hasMore: true,
        test:true,
    };



    componentWillMount() {
        const{currentGroup,} = this.state;
        let postsRef = database.ref("groups/" + currentGroup + '/posts/').orderByChild('forumRole').equalTo("2");

        let _this = this;

        postsRef.on('value', function(snapshot) {
            _this.setState({
                posts: snapshot.val(),
                //loading: false
            });
        });
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
        let test = this.state.test;
        let _this = this;
        let download = _.values(posts).reverse();

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

                <List className="demo-infinite-container"
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
                                <IconText type="star-o" text="0" />]}
                        >
                            <List.Item.Meta
                                title={<Link to={{
                                    pathname : '/Dashboard/forum/newPostDetail' ,
                                    state : {
                                        key: item.newPostKey,
                                        group : this.state.currentGroup
                                    }
                                }}>{item.title}</Link>}
                                description={"Posted by "+ checkAnonymous(item.anonymous, item.userName) }
                            />
                            {item.post}
                            <br/>
                            { (database.ref('users/' + item.userID + '/role/') == 0)
                            ? <span style={{alignSelf: 'flex-end'}}>(Student)</span>
                            : [
                                ((database.ref('users/' + item.userID + '/role/') == 1)
                                  ? <span style={{alignSelf: 'flex-end'}}>(Tutor)</span>
                                  : <span style={{alignSelf: 'flex-end'}}>(Lecturer)</span>
                                )
                              ]
                            }

                        </List.Item>
                        
                    )}
                />

        )

}

}
export default InstructorList;

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