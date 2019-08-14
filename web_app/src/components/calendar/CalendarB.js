import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import { Popconfirm, message, Form, DatePicker, Modal, Button,Input, Icon, Alert } from 'antd';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {auth,database} from '../../firebase/firebase';
import _ from "underscore";
import { Radio } from 'antd';

const titleStyle = { fontSize:"20px", fontWeight:"bold"};
const contentStyle = { fontSize:"20px", fontWeight:"400"};

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
moment.locale("en");
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment);
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
const text = 'Are you sure delete this event?';
message.config({
    top: 300,
    duration: 2,
});
function eventStyleGetter (event, start, end, isSelected) {
    var no = event.color;
    var backgroundColor;
    if(no==1) backgroundColor =  '#fffbe6';
    if(no==2) backgroundColor =  '#ffd6e7';
    if(no==3) backgroundColor =  '#b5f5ec';
    if(no==4) backgroundColor =  '#d9f7be';
    if(no==5) backgroundColor =  '#efdbff';
    var style = {backgroundColor: backgroundColor, color: 'black'}
    return {
        style: style
    };
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

class CalendarB extends Component {
    constructor(props){
        super(props);
        this.state = {
            view: "month",
            date: new Date(),
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
            color:1,
            selected_title:'',
            selected_start:'',
            selected_end:'',
            selected_description:'',
            selected_place:'',
            selected_color:'',
            selected_key:'',
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

    handle_edit = (event) => {
        event.preventDefault();
        const {
            selected_title,
            selected_start,
            selected_end,
            selected_description,
            selected_place,
            selected_color,
            selected_key,
            authUser,
        } = this.state;
        if (selected_title != '') {
            database.ref('/users/' + authUser.uid + '/events/'+ selected_key).set({
                title:  selected_title,
                start: JSON.stringify(selected_start),
                //transfer object to json string
                end: JSON.stringify(selected_end),
                place: selected_place,
                description: selected_description,
                color: selected_color,
                newPostKey: selected_key,
            });

            this.setState({
                third_visible: false,
            });
            message.success("Save successfully!")

        }
    }

    removeevent = (event) =>{
        event.preventDefault();
        const {
            selected_key,
            authUser,
        } = this.state;
        database.ref('/users/' + authUser.uid + '/events').child(selected_key).remove();
        this.setState({second_visible: false})
        message.success("Deleted!")
    }


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
    onselectedTimeChange =(value, dateString) => {
        this.setState({selected_start: value[0].toDate()});
        this.setState({selected_end: value[1].toDate()});
    };
    onOk = (value) => {
        this.setState({start: value[0].toDate()});
        this.setState({end: value[1].toDate()});
    };


    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    onselectedPlaceChange = (e) => {
        this.setState({
            selected_place: e.target.value,
        })
    }
    onselectedTitleChange = (e) =>{
        this.setState({
            selected_title: e.target.value,
        })
    }

    onselectedDescriptionChange = (e) => {
        this.setState({
            selected_description: e.target.value,
        })
    }

    onselectedcolourChange = (e) => {
        this.setState({
            selected_color: e.target.value,
        })
    }

    handleCancel = () => {
        //console.log('Clicked cancel button');
        this.setState({
            visible: false,
            second_visible: false,

        });
    };

    handleCancel2 = () => {
        //console.log('Clicked cancel button when edit');
        this.setState({
            third_visible: false,

        });
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
                        let newObject = [];
                        for (let i = 0; i < download.length; i++) {
                            let transformed = {
                                'title': download[i].title,
                                'start': new Date(Date.parse(JSON.parse(download[i].start))),
                                'end': new Date(Date.parse(JSON.parse(download[i].end))),
                                'description': download[i].description,
                                'place': download[i].place,
                                'newPostKey': download[i].newPostKey,
                                'color': download[i].color,
                            };
                            newObject.push(transformed);
                        }
                        this.setState({events: newObject});
                        //console.log(newObject);
                    }
                });
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { visible,
            second_visible,
            third_visible,
            events,
            view,
            selected_title,
            selected_start,
            selected_end,
            selected_description,
            selected_place,
            selected_color,
            selected_key,} = this.state;
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
        return(
            <div style={{ height: 'calc(100vh - 50px)'}}>
                <div style={{height: 'auto', paddingBottom: '5px'}}>
                    <Button onClick={this.showModal}>Add Event</Button>
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
                </div>
                <BigCalendar
                    selectable
                    style={{ height: '95%', width: this.state.width }}
                    toolbar={true}
                    events={events}
                    eventPropGetter={eventStyleGetter}
                    step={30}
                    views={allViews}
                    view={view}
                    onView={view => this.setState({view})}

                    date={this.state.date}
                    onNavigate={date => this.setState({ date })}

                    onSelectEvent={event =>
                        this.setState({
                            second_visible: true,
                            selected_title:event.title,
                            selected_start: event.start,
                            selected_end: event.end,
                            selected_description: event.description,
                            selected_place: event.place,
                            selected_color: event.color,
                            selected_key: event.newPostKey,
                        })
                    }


                />
                <Modal title="Event Detail"
                       visible={second_visible}
                       onCancel={this.handleCancel}
                       footer= {null}
                       style={{minWidth:700}}
                >
                    <ul>
                        <li><span style={titleStyle}>Title: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{selected_title}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Start Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{(selected_start).toString()}
                            </div>
                        </li>

                        <li><span style={titleStyle}>End Time: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{(selected_end).toString()}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Place: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{selected_place}
                            </div>
                        </li>

                        <li><span style={titleStyle}>Filter: </span>
                            <div style={chooseColor(selected_color)}>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</div>
                        </li>

                        <li><span style={titleStyle}>Description: </span>
                            <div style={contentStyle}>
                                &emsp;&emsp;{selected_description}
                            </div>
                        </li>
                    </ul>
                    <Button type="primary" onClick={event => this.setState({second_visible:false, third_visible: true})} style={{margin: '0 0 0 70%'}}>Edit</Button>

                    <Popconfirm placement="leftTop" title={text}  onConfirm={this.removeevent} okText="Yes" cancelText="No">
                        <Button style={{margin: '0 0 0 5px'}}>Delete</Button>
                    </Popconfirm>
                </Modal>


                <Modal title="Edit Event"
                       visible={third_visible}
                       onCancel={this.handleCancel2}
                       footer= {null}
                >
                    <Form onSubmit={this.handle_edit}>
                        <FormItem {...formItemLayout} label="Title">
                            <Input value = {selected_title} onChange={this.onselectedTitleChange}/>
                        </FormItem>

                        <FormItem {...formItemLayout} label="Time"
                        >
                            <RangePicker
                                allowClear = {false}
                                value = {[moment(selected_start),moment(selected_end)]}
                                showTime={{ format: 'HH:mm' }}
                                format="DD-MM-YYYY HH:mm"
                                placeholder={['Start Time', 'End Time']}
                                onChange={this.onselectedTimeChange}
                                onOk={this.onOk}
                            />
                        </FormItem>

                        <FormItem {...formItemLayout} label="Place">
                            <Input value = {selected_place} placeholder = "Optional" onChange={this.onselectedPlaceChange}></Input>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Description">
                            <Input value = {selected_description} placeholder = "Optional" onChange={this.onselectedDescriptionChange}></Input>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Color">
                            <RadioGroup value={selected_color} onChange={this.onselectedcolourChange}>
                                <RadioButton value="1" style={{background: '#fffbe6'}}>  </RadioButton>
                                <RadioButton value="2" style={{background: '#ffd6e7'}}>  </RadioButton>
                                <RadioButton value="3" style={{background: '#b5f5ec'}}>  </RadioButton>
                                <RadioButton value="4" style={{background: '#d9f7be'}}>  </RadioButton>
                                <RadioButton value="5" style={{background: '#efdbff'}}>  </RadioButton>
                            </RadioGroup>
                        </FormItem>
                        <Button type="primary" htmlType="submit" disabled={selected_title === ''} style={{margin: '0 0 0 50%'}}>Save</Button>
                    </Form>
                </Modal>
            </div>

        )

    }
}
export default Form.create()(CalendarB);
