import React, { Component } from 'react';
import '../../styles/Header&Footer.css';


class footer extends Component {
  render() {
    return (

        <div>
        <footer className="Footer">
        <a className="menu" href="features.js">Features</a>
        <a className="menu" href="about.js">About</a>
        <a className="menu" href="contactUs.js">Contact Us</a>
        <a className="menu" href="support.js">Support</a>
        <a className="menu" href="legal.js">Legal</a>
        </footer>
        </div>

    );
  }
}

export default footer;
