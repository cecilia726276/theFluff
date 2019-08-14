import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router'
import './draft/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

