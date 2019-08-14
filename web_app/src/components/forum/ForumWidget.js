import React, { Component } from 'react';
import {Card, Form} from 'antd';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { Link } from 'react-router-dom';
import {auth, database,storage} from "../../firebase/firebase";

const courseNameStyle = {
    height:'50%',
    marginBottom:'-20px',
};

const gridStyle = {
    borderLeft:'1px solid #ccc',
    float: 'left',
    align: 'middle',
    paddingLeft:'5%',
    width: '70%',
    fontSize: '15px',

};

const titleStyle = {
    fontSize:"20px",
    verticalAlign:'middle',
    float: 'left',
    paddingRight:'10px',
    wordWrap:'break-word',
    width:'125px',
    fontWeight:"bold"
};

function searchPost(key){
    let enrolList = database.ref('/groups/' + key + '/posts');
    var List=[];
    var thePost;
    enrolList.on('value',(snapshot) => {
        var judge = snapshot.exists();
        if(judge){
            List = snapshot.val();
            thePost = List[Object.keys(List)[Object.keys(List).length - 1]];
        }
    })
    return thePost;
}

class ForumWidget extends Component {
    constructor (props) {
        super(props);
        this.state = {
            authUser: this.props.authUser,
            authUserDir: auth.currentUser,
        };
        if(this.state.authUserDir){
            this.userDir = database.ref('/users').child(this.state.authUserDir.uid);
            this.forumRef = database.ref('/groups');
        }

    }
    state = {
        currentEnrol: [],
    };

    componentWillMount() {
        if (this.state.authUserDir){
            let enrolList = this.userDir.child('/enrollment');
            enrolList.on('value',(snapshot) => {
                this.setState({
                    currentEnrol : snapshot.val(),
                });
            })

            let groupList = this.forumRef;
            groupList.on('value',(snapshot) => {
                this.setState({
                    groups : snapshot.val(),
                });
            })
        }
    }

    render () {
        var currentEnrol = this.state.currentEnrol;
        if(currentEnrol){
            var latestList = Object.keys(currentEnrol).map(function(key) {
                var thePost = searchPost(key);
                return  [
                        thePost ?
                            <Card.Grid style={{width:'100%'}}>
                                <ListItem>
                                    <div className="courseName" style={courseNameStyle}>
                                        <p style={titleStyle}>
                                            {currentEnrol[key].title}
                                        </p>
                                    </div>
                                    <div style={gridStyle}>
                                        <li>
                                            <Link to={{
                                                pathname : '/Dashboard/'+ key ,
                                                state : {
                                                    group : key,
                                                }
                                            }}>
                                                <span style={{fontWeight:"bold", color:'#000000'}}>
                                                    {thePost ? thePost['title']:null}
                                                </span>
                                            </Link>
                                        </li>
                                        <li style={{overflow:'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                            <span>{thePost ? thePost['post']:null}</span>
                                        </li>
                                    </div>
                                </ListItem>
                            </Card.Grid>
                            :
                            null
                ]
            });
        } else var latestList = [];

        return (
            <Card title="Latest Forum Updates" >
                {latestList}
            </Card>
        )};
}


export default Form.create()(ForumWidget);
