import React, { Component } from 'react';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { Divider, Modal, Button, Card, Row, Col } from 'antd';
//import Divider from 'material-ui/Divider';
import '../styles/UpcomingList.css';
import CalendarWidget from "./calendar/CalendarWidget";
import ForumWidget from "./forum/ForumWidget";

const data = [
    {
        title: 'Title 1',
    },
    {
        title: 'Title 2',
    }
];
class UpcomingList extends Component {
    constructor (props) {
        super(props);
    }


    render () {
        return (
            <div class="scrollHidden" style={{padding: '30px', height: 'calc(100vh - 50px)', overflowY:'scroll'}} >
                <Row gutter={16}>
                    <Col span={8} style={{width:'50%'}}>
                        <CalendarWidget>
                        </CalendarWidget>
                    </Col>
                    <Col span={8}  style={{width:'50%'}}>
                        <ForumWidget>
                        </ForumWidget>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UpcomingList;
/*
<List>
                <p>
                  Upcoming Events
                </p >

                <Divider />

                <ListItem button>
                  <ListItemText primary="COMP 3500 Tutorial" secondary="March 30, 2018"/>
                </ListItem>

                <ListItem button>
                  <ListItemText primary="COMP 3310 Assignment Due" secondary="April 23, 2018"/>
                </ListItem>
              </List>
 */
