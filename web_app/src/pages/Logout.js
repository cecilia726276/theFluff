import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { auth } from '../firebase/index'
import * as routes from "../router/routes";

class Logout extends Component{
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }
    componentWillMount() {
        auth.doSignOut().then((user) => {
            this.setState({redirect: true})
        })
    }

    render(){
        return(
            this.state.redirect
               ? (<Redirect to={routes.LANDING}/>):
                (<div style={{textAlign: "center", position: "absolute", top: "25%", left: "50%"}}>
                    <h3> Logging Out </h3>
                    </div>)
        )
    }
}
export default Logout;