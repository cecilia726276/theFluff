/*import React, { Component } from 'react';
import _ from 'underscore';
import '../styles/forum.css'
import 'antd/dist/antd.css';
import { Button, Icon } from 'antd';
import {auth,database} from '../../../firebase/firebase';
import {Link, Redirect, Route, Switch, Router} from 'react-router-dom';

class FeaturedView extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        posts: [],
        loading: true
    };


    componentWillMount() {
        let postsRef = database.ref("posts/")

        let _this = this;

        postsRef.on('value', function(snapshot) {
            _this.setState({
                posts: snapshot.val(),
                loading: false
            });
        });
    }

    handleUpvote = (post, key) => {
        database.ref('posts/' + key).update({
            upvotes: post.upvotes + 1,
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

    onclick()
    {
        document.getElementById("myBtn").disabled = true;
    }

    render() {
        let posts = this.state.posts;
        let _this = this;

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
        /*return (
            <div>
                { Object.keys(posts).map(function(key) {
                    return (
                        <div key={key}>
                            <div><Link to={{
                                pathname : '/Dashboard/forum/postDetail' ,
                                state : {key: key}
                            }}>
                                <h1 className="line5th">Title: { posts[key].title }</h1>
                            </Link></div>

                            <div><span class="ForumLimit"><h1 style={{fontSize: '1.5em'}}>{posts[key].post}</h1></span></div>
                            <div>Upvotes: { posts[key].upvotes }</div>
                            <div>
                                <Button
                                    id="myBtn"
                                    onClick={ (e) => {
                                        document.getElementById("myBtn").disabled = true;
                                        _this.handleUpvote.bind(this, posts[key], key);
                                    }}
                                    //onClick={ document.getElementById("myBtn").disabled = true, _this.handleUpvote.bind(this, posts[key], key)}
                                    type="button"
                                >
                                    <Icon type="like-o" />
                                </Button>

                                <hr/>
                            </div>
                        </div>
                    );
                })}
            </div>

        )
    }
}

export default FeaturedView;*/
