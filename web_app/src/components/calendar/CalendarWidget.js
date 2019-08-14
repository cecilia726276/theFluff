import React, { Component } from 'react';
import {Input, Radio ,Modal, Button, Card, Avatar, DatePicker, Form, message } from 'antd';
import '../../styles/UpcomingList.css';
import {auth, database} from "../../firebase/firebase";
import _ from "underscore";
import List, { ListItem } from 'material-ui/List';
import moment from "moment/moment";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
moment.locale("en");
const titleStyle = { fontSize:"15px", fontWeight:"bold"};
const contentStyle = { fontSize:"15px", fontWeight:"400"};
const gridStyle = {
    borderLeft:'1px solid #ccc',
    float: 'left',
    align: 'middle',
    paddingLeft:'5%',
    width: '70%',
    fontSize: '20px',
    fontWeight:"bold",

}
const dateStyle ={
    float:'left',
    verticalAlign:'middle',
    width: '25%',
    fontSize: '20px',
    fontWeight:"bold",

}
function chooseColor (num) {
    var no = num;
    var backgroundColor;
    if(no==1) backgroundColor =  '#fffbe6';
    if(no==2) backgroundColor =  '#ffd6e7';
    if(no==3) backgroundColor =  '#b5f5ec';
    if(no==4) backgroundColor =  '#d9f7be';
    if(no==5) backgroundColor =  '#efdbff';
    return {
        backgroundColor: backgroundColor,
        display: "inline"

    };
}
class CalendarWidget extends Component {
    constructor(props){
        super(props);
        this.state = {
            width: '100%',
            authUser: auth.currentUser,
            //events: events pull from back end
            events:[],
            visible: false,
            second_visible:false,
            third_visible:false,
            title:'',
            start:'',
            end:'',
            description:'',
            place:'',
            first_event:{
                title: '',
                start: '',
                end: '',
                description:'',
                place: '',
                newPostKey: '',
                color: '',
            },
            second_event:{
                title: '',
                start: '',
                end: '',
                description:'',
                place: '',
                newPostKey: '',
                color: '',
            },
        };
        this.userRef = database.ref('/users').child('Anonymous');

    }

    handlesubmit = (event) => {
        event.preventDefault();
        const {
            start,
            end,
            description,
            place,
            color,
            authUser,
        } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let newPostKey = this.userRef.child('events').push().key;
                database.ref('/users/' + authUser.uid + '/events/'+ newPostKey).set({
                    title: values.title,
                    start: JSON.stringify(start),
                    //transfer object to json string
                    end: JSON.stringify(end),
                    place,
                    description,
                    color,
                    newPostKey,
                });

                this.setState({
                    visible: false,
                });
                //console.log('Received values of form: ', values);
                message.success("Add successfully!");
                this.props.form.resetFields();
            }
        })
    };

    oncolourChange = (e) => {
        //console.log('color checked', e.target.value);
        this.setState({
            color: e.target.value,
        });
    };

    onDescriptionChange = (e) => {
        this.setState({
            description: e.target.value,
        });
    };

    onPlaceChange = (e) => {
        this.setState({
            place: e.target.value,
        });
    };

    onTimeChange =(value, dateString) => {
        this.setState({start: value[0].toDate()});
        this.setState({end: value[1].toDate()});
    };

    onOk = (value) => {
        this.setState({start: value[0].toDate()});
        this.setState({end: value[1].toDate()});
    };


    componentDidMount(){
        auth.onAuthStateChanged((authUser) => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
            if (authUser) {
                this.userRef = database.ref('users').child(authUser.uid);
                this.userRef.child('events').on('value', (snapshot) => {
                    const events = snapshot.val();
                    if (events) {
                        let download = _.values(events);
                        let will_events = [];
                        //console.log(will_events.length);
                        let now = new Date();
                        for (let i = 0; i < download.length; i++) {
                            //console.log("comparing!");
                            let start_time = new Date(Date.parse(JSON.parse(download[i].start)));
                            if (start_time - now > 0 ){
                                let transformed = {
                                    'title': download[i].title,
                                    'start': start_time,
                                    'end': new Date(Date.parse(JSON.parse(download[i].end))),
                                    'description': download[i].description,
                                    'place': download[i].place,
                                    'newPostKey': download[i].newPostKey,
                                    'color': download[i].color,
                                };
                                will_events.push(transformed);
                                //console.log("push!");
                                //console.log(transformed);
                            }
                        }
                        if (will_events.length === 1) {
                            //console.log("length=1");
                            //console.log(will_events);
                            this.setState({first_event: will_events[0]})
                        }
                        if (will_events.length === 2) {
                            //console.log("length=2");
                            //console.log(will_events);
                            if (will_events[0].start > will_events[1].start){
                                this.setState({first_event : will_events[1]});
                                this.setState({second_event : will_events [0]});
                            } else {
                                this.setState({first_event : will_events[0]});
                                this.setState({second_event : will_events [1]});
                            }
                        }
                        if (will_events.length > 2){
                            //console.log("length=3");
                            //console.log(will_events);
                            //initialization
                            let first_events;
                            let second_events;
                            if (will_events[0].start > will_events[1].start){
                                first_events = will_events[1];
                                second_events = will_events [0];
                            } else {
                                first_events = will_events[0];
                                second_events = will_events [1];
                            }

                            for (let i = 2; i < will_events.length; i++){
                                let this_event = will_events[i];
                                if (this_event.start < first_events.start){
                                    second_events = first_events;
                                    first_events = this_event;
                                }else if (this_event.start <second_events.start){
                                    second_events = this_event;
                                }
                            }
                            this.setState({first_event: first_events, second_event: second_events})
                        }
                        //console.log("first event is");
                        //console.log(this.state.first_event);

                    }
                });
            }
        })
    }
    handleCancel = () => {
        //console.log('Clicked cancel button');
        this.setState({
            visible: false,
            second_visible: false,
            third_visible:false,

        });
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    render () {
        const { getFieldDecorator } = this.props.form;
        const { visible, second_visible, third_visible} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 18 },
            },
        };
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: 'Please select time!' }],
        };

        const {
            first_event,
            second_event,
        } = this.state;
        const first_event_start = (new Date(first_event.start)).toString();
        const second_event_start =  (new Date(second_event.start)).toString();
        const first_event_end = (new Date(first_event.end)).toString();
        const second_event_end = (new Date(second_event.end)).toString();
        if(first_event.title === ''){
            return (
                <div>
                    <Modal title="Add More Events"
                           visible={visible}
                           onCancel={this.handleCancel}
                           footer= {null}
                    >
                        <Form id="form1" onSubmit={this.handlesubmit}>
                            <FormItem {...formItemLayout} label="Title">
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: 'Please input your title!' }],
                                })(
                                    <Input/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="Time"
                            >
                                {getFieldDecorator('range-time-picker', rangeConfig)(
                                    <RangePicker
                                        disabledSeconds
                                        hideDisabledOptions = {true}
                                        allowClear = {false}
                                        showTime={{ format: 'HH:mm' }}
                                        format="DD-MM-YYYY HH:mm"
                                        placeholder={['Start Time', 'End Time']}
                                        onChange={this.onTimeChange}
                                        onOk={this.onOk}
                                    />
                                )}

                            </FormItem>

                            <FormItem {...formItemLayout} label="Place">
                                {getFieldDecorator('place')(
                                    <Input placeholder = "Optional" onChange={this.onPlaceChange}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="Description">
                                {getFieldDecorator('description')(
                                    <Input placeholder = "Optional" onChange={this.onDescriptionChange}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="Color">
                                {getFieldDecorator('color')(
                                    <RadioGroup defaultValue="1" onChange={this.oncolourChange}>
                                        <RadioButton value="1" style={{background: '#fffbe6'}}>  </RadioButton>
                                        <RadioButton value="2" style={{background: '#ffd6e7'}}>  </RadioButton>
                                        <RadioButton value="3" style={{background: '#b5f5ec'}}>  </RadioButton>
                                        <RadioButton value="4" style={{background: '#d9f7be'}}>  </RadioButton>
                                        <RadioButton value="5" style={{background: '#efdbff'}}>  </RadioButton>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <Button type="primary" htmlType="submit" style={{margin: '0 0 0 50%'}}>Add</Button>
                        </Form>
                    </Modal>
                            <Card title="Upcoming Events">
                        There are no upcoming events.<a onClick={this.showModal}> Add one.</a>
                    </Card>
                </div>
            )
        }if (second_event.title ===''){
            return (
                <div>
                    <Modal title="Event Detail"
                           visible={second_visible}
                           onCancel={this.handleCancel}
                           footer= {null}
                           style={{minWidth:700}}
                    >
                        <ul>
                            <li><span style={titleStyle}>Title: </span>
                                <div style={contentStyle}>
                                    &emsp;&emsp;{first_event.title}
                                </div>
                            </li>

                            <li><span style={titleStyle}>Start Time: </span>
                                <div style={contentStyle}>
                                    &emsp;&emsp;{first_event.start.toString()}
                                </div>
                            </li>

                            <li><span style={titleStyle}>End Time: </span>
                                <div style={contentStyle}>
                                    &emsp;&emsp;{first_event.end.toString()}
                                </div>
                            </li>

                            <li><span style={titleStyle}>Place: </span>
                                <div style={contentStyle}>
                                    &emsp;&emsp;{first_event.place.toString()}
                                </div>
                            </li>

                            <li><span style={titleStyle}>Filter: </span>
                                <div style={chooseColor(first_event.color)}>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</div>
                            </li>

                            <li><span style={titleStyle}>Description: </span>
                                <div style={contentStyle}>
                                    &emsp;&emsp;{first_event.description}
                                </div>
                            </li>
                        </ul>
                        <Button style = {{marginLeft:'40%'}}onClick={this.handleCancel}>Close</Button>
                    </Modal>

                    <Modal title="Add More Events"
                           visible={visible}
                           onCancel={this.handleCancel}
                           footer= {null}
                    >
                        <Form id="form1" onSubmit={this.handlesubmit}>
                            <FormItem {...formItemLayout} label="Title">
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: 'Please input your title!' }],
                                })(
                                    <Input/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="Time"
                            >
                                {getFieldDecorator('range-time-picker', rangeConfig)(
                                    <RangePicker
                                        disabledSeconds
                                        hideDisabledOptions = {true}
                                        allowClear = {false}
                                        showTime={{ format: 'HH:mm' }}
                                        format="DD-MM-YYYY HH:mm"
                                        placeholder={['Start Time', 'End Time']}
                                        onChange={this.onTimeChange}
                                        onOk={this.onOk}
                                    />
                                )}

                            </FormItem>

                            <FormItem {...formItemLayout} label="Place">
                                {getFieldDecorator('place')(
                                    <Input placeholder = "Optional" onChange={this.onPlaceChange}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="Description">
                                {getFieldDecorator('description')(
                                    <Input placeholder = "Optional" onChange={this.onDescriptionChange}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="Color">
                                {getFieldDecorator('color')(
                                    <RadioGroup defaultValue="1" onChange={this.oncolourChange}>
                                        <RadioButton value="1" style={{background: '#fffbe6'}}>  </RadioButton>
                                        <RadioButton value="2" style={{background: '#ffd6e7'}}>  </RadioButton>
                                        <RadioButton value="3" style={{background: '#b5f5ec'}}>  </RadioButton>
                                        <RadioButton value="4" style={{background: '#d9f7be'}}>  </RadioButton>
                                        <RadioButton value="5" style={{background: '#efdbff'}}>  </RadioButton>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <Button type="primary" htmlType="submit" style={{margin: '0 0 0 50%'}}>Add</Button>
                        </Form>
                    </Modal>
                    <Card title="Upcoming Events">
                        <Card.Grid style={{width:'100%'}}>
                            <ListItem>
                                <div className="carddate" style={dateStyle}> <div>{(new Date(first_event.start)).toDateString()}</div></div>
                                <div className="cardcontent" style={gridStyle}>
                                    <li><span style={titleStyle}>Title: </span>
                                        <div style={contentStyle}>
                                            &emsp;&emsp;{first_event.title}
                                        </div>
                                    </li>

                                    <li><span style={titleStyle}>Time: </span>
                                        <div style={contentStyle}>
                                            &emsp;&emsp;{first_event_start.substring(0,first_event_start.indexOf(" GMT")-3)} - {first_event_end.substring(0,first_event_end.indexOf(" GMT")-3)}
                                        </div>
                                    </li>

                                    <li><span style={titleStyle}>Location: </span>
                                        <div style={contentStyle}>
                                            &emsp;&emsp;{first_event.place}
                                        </div>
                                    </li>
                                    <div style={{textAlign:'right',fontWeight:'normal',fontSize:'15px'}}>
                                        <a onClick={event => this.setState({second_visible:true})}> More </a>
                                    </div>
                                </div>
                            </ListItem>
                        </Card.Grid>
                        <br/>
                        <Card.Grid style={{width:'100%', textAlign: 'center'}}>
                        There is no more upcoming events.<a onClick={this.showModal}> Add one.</a>
                        </Card.Grid>
                    </Card>
                </div>
            )
        }else{
        return (
            <div>
                <Modal title="Event Detail"
                       visible={second_visible}
                       onCancel={this.handleCancel}
                       footer= {null}
                       style={{minWidth:700}}
                >
                    <ul>
                        <li><span style={titleStyle}>Title: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{first_event.title}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Start Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{first_event.start.toString()}
                            </div>
                        </li>

                        <li><span style={titleStyle}>End Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{first_event.end.toString()}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Place: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{first_event.place.toString()}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Filter: </span>
                            <div style={chooseColor(first_event.color)}>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</div>
                        </li>

                        <li><span style={titleStyle}>Description: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{first_event.description}
                            </div>
                        </li>
                    </ul>
                    <Button style = {{marginLeft:'40%'}} onClick={this.handleCancel}>Close</Button>
                </Modal>

                <Modal title="Event Detail"
                       visible={third_visible}
                       onCancel={this.handleCancel}
                       footer= {null}
                       style={{minWidth:700}}
                >
                    <ul>
                        <li><span style={titleStyle}>Title: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.title}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Start Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.start.toString()}
                            </div>
                        </li>

                        <li><span style={titleStyle}>End Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.end.toString()}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Place: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.place.toString()}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Filter: </span>
                            <div style={chooseColor(second_event.color)}>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</div>
                        </li>

                        <li><span style={titleStyle}>Description: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.description}
                            </div>
                        </li>
                    </ul>
                    <Button style = {{marginLeft:'40%'}}onClick={this.handleCancel}>Close</Button>
                </Modal>


                <Card title="Upcoming Events">
                    <Card.Grid style={{width:'100%'}}>
                    <ListItem>
                        <div className="carddate" style={dateStyle}> <div>{(new Date(first_event.start)).toDateString()}</div></div>
                    <div className="cardcontent" style={gridStyle}>
                        <li><span style={titleStyle}>Title: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{first_event.title}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{first_event_start.substring(0,first_event_start.indexOf(" GMT")-3)} - {first_event_end.substring(0,first_event_end.indexOf(" GMT")-3)}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Location: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{first_event.place}
                            </div>
                        </li>
                        <div style={{textAlign:'right',fontWeight:'normal',fontSize:'15px'}}>
                        <a onClick={event => this.setState({second_visible:true})}> More </a>
                        </div>
                    </div>
                    </ListItem>
                    </Card.Grid>
                    <br/>
                    <Card.Grid style={{width:'100%'}}>
                    <ListItem>
                    <div className="carddate" style={dateStyle}> {(new Date(second_event.start)).toDateString()}</div>
                    <div className="cardcontent" style={gridStyle}>
                        <li><span style={titleStyle}>Title: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.title}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event_start.substring(0,second_event_start.indexOf(" GMT")-3)} - {second_event_end.substring(0,second_event_end.indexOf(" GMT")-3)}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Location: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.place}
                            </div>
                        </li>
                        <div style={{textAlign:'right',fontWeight:'normal',fontSize:'15px'}}>
                            <a onClick={event => this.setState({third_visible:true})}> More </a>
                        </div>
                    </div>
                    </ListItem>
                    </Card.Grid>


                </Card>



            </div>
        )};
    }
}

/*
                <List>
                    <p>
                        Upcoming Events
                    </p >

                    <Divider />

                    <ListItem button>
                        <ListItemText primary={this.state.first_event.title} secondary={(new Date(this.state.first_event.start)).toDateString()}/>
                    </ListItem>

                    <ListItem button>
                        <ListItemText primary={this.state.second_event.title} secondary={(new Date(this.state.second_event.start)).toDateString()}/>
                    </ListItem>
                </List>

 <Card.Grid style={dateStyle}> {(new Date(second_event.start)).toDateString()}</Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <li><span style={titleStyle}>Title: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.title}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event_start.substring(0,second_event_start.indexOf(" GMT")-3)}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Location: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{second_event.place}
                            </div>
                        </li>
                    </Card.Grid>



<Card.Grid style={gridStyle}> {(new Date(second_event.start)).toDateString()}</Card.Grid>
            <div>
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Card title={item.title}>Card content</Card>
                        </List.Item>
                    )}
                />
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<a href="https://ant.design">{item.title}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />




            </div>

   <p>
                    Upcoming Events
                </p >
                <table border="2" bordercolor="black" width="300px" cellspacing="0" cellpadding="5">
                    <tr>
                        <td  id='date1' value='1.1'rowspan="3"></td>
                        <td>Title</td>
                        <td id='title1'></td>
                    </tr>
                    <tr>
                        <td>Place</td>
                        <td id='place1'></td>
                    </tr>
                    <tr>
                        <td>Start Time</td>
                        <td id='time1'></td>
                    </tr>
                </table>
                <br/>
                <table border="2" bordercolor="black" width="300px" cellspacing="0" cellpadding="5">
                    <tr>
                        <td id='date2' value='1.1'rowspan="3"></td>
                        <td>Title</td>
                        <td id='title2'>{this.state.second_event.title}</td>
                    </tr>
                    <tr>
                        <td>Place</td>
                        <td id='place2'></td>
                    </tr>
                    <tr>
                        <td>Start Time</td>
                        <td id='time2'></td>
                    </tr>
                </table>

 */
export default Form.create()(CalendarWidget);