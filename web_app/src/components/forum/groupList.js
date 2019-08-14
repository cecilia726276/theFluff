import React, { Component } from 'react';
import {Card, Form} from 'antd';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { Link } from 'react-router-dom';
import {database} from "../../firebase/firebase";

const courseNameStyle = {
    height:'50%',
    marginBottom:'-20px',
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

class GroupList extends Component {
    constructor (props) {
        super(props);
    }
    state = {
        groups:["COMP3310"/*,"COMP3120","COMP3310","COMP2420"*/],
        firstpost:[],
        appendPost:"",
        /*secondpost:"",
        thirdpost:"",
        fourthpost:"",*/
    };

   componentWillMount(){
        let _this = this;
        let postsRef1 = database.ref("groups/COMP3310/posts/");

        postsRef1.on('value', function(snapshot) {
            var newArray = [];    
            var fruitObject = snapshot.val();
            var fruitObjectie = snapshot.val();

            for (var i = 1; i < Object.keys(fruitObject).length; i++) {
                newArray.push(fruitObjectie[Object.keys(fruitObjectie)[Object.keys(fruitObjectie).length - i]]);   
            }
            //_this.setState({firstpost:newArray})
            var allGroups = [];
            for(let i = 0; i < newArray.length; i++) {
                allGroups.push(newArray[i].title)
            }
            _this.setState({firstpost:allGroups})
        });
    }

    /*componentWillMount() {
        let _this = this;
        let postsRef1 = database.ref("groups/COMP3310/posts/");
        /*let postsRef2 = database.ref("groups/COMP3310/posts/");
        let postsRef3 = database.ref("groups/COMP3120/posts/");
        let postsRef4 = database.ref("groups/COMP2420/posts/");*/
        /*let lemgth = 0;
        //let i = 1;

        postsRef1.on('value', function(snapshot) {
            var fruitObject = snapshot.val();
            var fruitObjectie = snapshot.val();

            const gg = fruitObjectie[Object.keys(fruitObjectie)[Object.keys(fruitObjectie).length - 1]];

            //Object.keys(fruitObject);
            for (var i = 1; i < Object.keys(fruitObject).length; i++) {
            _this.setState({
                firstpost: [fruitObjectie[Object.keys(fruitObjectie)[Object.keys(fruitObjectie).length - 1]],],
                //lemgth:Object.keys(fruitObject).length,
                //appendPost: this.firstpost,
            });
            firstpost.push(fruitObjectie[Object.keys(fruitObjectie)[Object.keys(fruitObjectie).length - 1+i]])
        }
        });

        /*postsRef2.on('value', function(snapshot) {
            var fruitObject = snapshot.val();

            //Object.keys(fruitObject);
            _this.setState({
                secondpost:fruitObject[Object.keys(fruitObject)[Object.keys(fruitObject).length - 1]],
            });
        });
        postsRef3.on('value', function(snapshot) {
            var fruitObject = snapshot.val();
            //Object.keys(fruitObject);
            _this.setState({
                thirdpost:fruitObject[Object.keys(fruitObject)[Object.keys(fruitObject).length - 1]],
            });
        });
        postsRef4.on('value', function(snapshot) {
            var fruitObject = snapshot.val();
            //Object.keys(fruitObject);
            _this.setState({
                fourthpost:fruitObject[Object.keys(fruitObject)[Object.keys(fruitObject).length - 1]],
            });
        });*/
        createTable = () => {
            const allGroups = [];
            for(let i = 0; i < this.state.firstpost; i++) {
                allGroups.push(this.state.firstpost[i].title)
            }
            return allGroups
          }



    render () {
        let {firstpost/*, secondpost, thirdpost, fourthpost*/} = this.state;
        
        return (
        <div>
            <ul>
            {firstpost}
            </ul>
        </div>
        )};

}


export default GroupList;