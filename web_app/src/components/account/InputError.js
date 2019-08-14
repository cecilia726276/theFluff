import React, { Component } from 'react';
import cx from './classSet.js';


class InputError extends Component{
    constructor(props) {
        super(props);
        this.state = {
            message: 'Input is invalid'
        }
    };
    /*
    ***************************************************************************************
    *    Reference
    *    Title: react-signup-form
    *    Author: Mikhail Proniushkin
    *    Access Date: 2018
    *    Availability: https://github.com/mikepro4/react-signup-form
    ***************************************************************************************
    */

  render(){
    let errorClass = cx({
      'error_container':   true,
      'visible':           this.props.visible,
      'invisible':         !this.props.visible
    });

    return (
      <div className={errorClass}>
        <span>{this.props.errorMessage}</span>
      </div>
    )
  }

}
export default InputError;