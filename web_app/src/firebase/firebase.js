import * as firebase from 'firebase';

/*
    ***************************************************************************************
    *    Reference
    *    Title: Get Started with Firebase Authentication on Websites
    *    Author: Firebase Documentation
    *    Access Date: 2018
    *    Availability: https://firebase.google.com/docs/auth/web/start
    ***************************************************************************************
*/

const config = {
    apiKey: "AIzaSyA12hdNmkibJ0aOpgkuerEDvhhwX5BdEDI",
    authDomain: "thefluffcore.firebaseapp.com",
    databaseURL: "https://thefluffcore.firebaseio.com",
    projectId: "thefluffcore",
    storageBucket: "thefluffcore.appspot.com",
    messagingSenderId: "732688834506"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();
let database = firebase.database();
let storage = firebase.storage();

export {
  auth,
    database,
    storage,
};