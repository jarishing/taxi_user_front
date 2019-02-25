/**
 * 
 * Enable react app run normally on IE
 * 
 */
import 'babel-polyfill';
import 'babel-core/register';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


const startApp = () => {
    /**
     * 
     * Replace the promise into something async function that
     * need to perform before render the application
     * 
     */
    ReactDOM.render(     
        <App />, 
        document.getElementById('root'));
    // registerServiceWorker();
};


if(window.cordova){
    document.addEventListener('deviceready', startApp, false);
} else {
    startApp();
}
    
    