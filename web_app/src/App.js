import React, { Component } from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import RootRouter from './router/RootRouter';
import {auth} from './firebase/firebase';


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            authUser: auth.currentUser,
        }
    }



    componentDidMount(){
        auth.onAuthStateChanged(authUser => {
            authUser
            ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        });
    }

    componentWillMount() {
        auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })
    }

  render() {
      return (
          <Router>
              <div>
                  <RootRouter authUser={this.state.authUser} />
              </div>
          </Router>
      )

  }
}

export default App;
