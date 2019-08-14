import React, { Component } from 'react';
import FluffHeader from '../components/layout/FluffHeader.js';
import Footer from '../components/layout/footer.js';
import Input from '../components/account/Input.js';
import {Redirect} from 'react-router-dom';
import '../styles/application.css';
import { auth } from '../firebase/firebase';
import Button from 'material-ui/Button';
import * as routes from "../router/routes";


const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

export default class Forget_Password extends Component {
    constructor(props){
        super(props)
        this.state = {
            email:'',
            sent_success:false,
        }
    }

    validateEmail = (event) =>{
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(event);
    };

    onSubmit = (event) => {
        event.preventDefault();
        auth.sendPasswordResetEmail(this.state.email)
            .then(() => {
                this.setState(() => ({ email:'', sent_success: true }));
                //this.props.history.push(routes.RESET_SUCCESS);
                //error: this.props.history.push(routes.RESET_SUCCESS);

            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });
    }

    render() {
        const {
            email,
            error,
            sent_success
        } = this.state;
        return (
            sent_success
                ?(<Redirect to={routes.RESET_SUCCESS}/>)
            :(
                <div>
                <FluffHeader authUser={this.props.authUser}/>
                        <div style={{height: "900px", background: "lightsteelblue",}}>
                        <div style={{textAlign: "center", position: "absolute", width: "30%", top:"30%", left:"35%",}}>
                        <div className="create_account_screen">
                            <div className="create_account_form">
                                <h3 style={{fontSize: "30px"}}>Reset your password</h3>
                                <form onSubmit={this.onSubmit}>
                                    <p style={{fontSize: "23px"}}>Enter your email address and we will send you a link to reset your password.</p>
                                <Input
                                    text="Email Address"
                                    ref="email"
                                    type="text"
                                    defaultValue={this.state.email}
                                    validate={this.validateEmail}
                                    value={email}
                                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                                    errorMessage="Email is invalid"
                                    emptyMessage="Email can't be empty"
                                />
                        <Button variant="raised" color="primary"
                                disabled={email === ''}
                                type="submit">
                            SUBMIT
                        </Button>
                        { error && <p>{error.message}</p> }
                        </form>
                        </div>
                    </div>
                </div>
                        </div>
                <Footer style={{top: "300px",}}/>
            </div>)
        )
    }
}