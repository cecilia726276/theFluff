import React, { Component } from 'react';
import { Icon, Button, Input, Dropdown,Menu, Select } from 'antd';
import {auth, database} from "../../firebase/firebase";
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';


const Search = Input.Search;
const Option = Select.Option;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        currentGroup: this.props.currentGroup,
        posts: '',
    };
  }


  componentDidMount(){
      database.ref('/groups/'+ this.state.currentGroup+'/posts').on('value', (snapshot) => {
          this.setState({
              posts: snapshot.val()
          })
      })
    }
  render() {
      let posts = this.state.posts;
      let children = [];
      let key;
      for (key in posts){
          let content = posts[key].post;
          let title = posts[key].title;

          children.push(
              <Option key={content + ' '+ title}>
                  <Link style = {{width:'100%'}} to={{
                      pathname : '/Dashboard/'+this.props.currentGroup+'/newPostDetail' ,
                      state : {
                          key: key,
                          group : this.props.currentGroup,
                      }
                  }}><div style = {{width : '100%'}}>{title}</div></Link></Option>
          )

      }
    return (
          <div>
              <Select
                  showSearch
                  style={{ width: '200px'}}
                  placeholder="Search for post"
                  showArrow = {false}
              >
                  {children}
              </Select>


          </div>
    );
  }
}

export default SearchBox;
/*
<Dropdown overlay={menu} trigger={['click']} >
               <Search
                 placeholder="input search text"
                 onSearch={value => console.log(value)}
                 enterButton="Search"
                 size="large"
                 style={{ width: 400 }}
               />
              </Dropdown>
 */