import React, { Component } from 'react';
import FluffHeader from '../components/layout/FluffHeader.js';
import Footer from '../components/layout/footer.js';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import * as routes from '../router/routes';
import {auth} from '../firebase/firebase';



class LandingPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            authUser: this.props.authUser,
        }
    }

    componentDidMount(){
        auth.onAuthStateChanged((authUser) => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })
    }
    componentWillMount() {
        auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        })
    }
    render(){
        return(
            this.state.authUser
                ? (<Redirect to={routes.HOME}/>)
            : (<div>
                <FluffHeader authUser={this.props.authUser}/>
                <div className="landing_banner">
                    <h1 className="Headline">
                        Sorting through the Fluff.
                    </h1>
                    <p className="line2nd">
                        A platform for nurturing a community of learners.
                    </p>
                    <p>
                    <div><Link to={routes.SIGN_UP}>
                    <Button variant="raised" color="primary"
                        id="getStarted"
                        label="Get-Started"
                        value="Get-Started"
                        marginTop="normal"
                    >
                        Get Started

                        </Button>
                    </Link></div>
                    </p>
                </div>

                <p className="Block2">
                    <p className="line3rd">
                        The Fluff for learners
                    </p>

                    <p className="line4th">
                        A better way to learn together
                    </p>

                    <h1>
                        The Fluff is a concept that will facilitate collaboration, coursework discussion and study groups amongst likeminded people doing the same course or degree as you. The platform aims to remove existing boundaries that serve to reduce collaboration, group study, and getting assistance. We aim for the platform to also serve as a pathway to meet new people, and determine people you already know doing your course.
                    </h1>
                    <br/>
                    <p className="line4th">
                        We are offering ...
                    </p>
                    <h1>
                        Our solution is to create curated communities surrounding each course online. We understand that communities don't exist because they are told to. This has been the mistake of the conventional online setups. Instead we provide an environment to grow a community.
                    </h1>
                    <br/>
                    <h1 className="line5th">
                        Step 1. Toolkit
                    </h1>
                    <h1>
                        We bring student's to our platform by providing quality of life tools which makes them want to participate.
                    </h1><br/>
                    <h2 className="line5th">
                        Step 2. Engaging community
                    </h2>
                    <h1>
                        We understand that different people want interact in different ways depending on who they are and how they feel. By providing multiple ways for people to communicate with each other, ask questions and seek answers. We leverage network effects that will allow important information to surface.
                    </h1><br/>
                    <h2 className="line5th">
                        Step 3. Sorting through the Fluff!
                    </h2>
                    <h1>
                        We provide means to efficiently sort through and identify important information on both an individual and communal level
                    </h1><br/>
                </p>
                <Footer/>
            </div>)
        )
    }
}

export default LandingPage;
