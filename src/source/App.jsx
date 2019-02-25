import React from 'react';
import Store from './store';
import Router from './router';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { HashRouter } from 'react-router-dom';

/**
 * 
 * Import the global css stylesheets
 * 
 */
import 'ken.yip/css/bootstrap.css';
import 'ken.yip/css/inline-class.css';
import './css';

export default props => (
    <Provider store={Store}>
        <CookiesProvider>
            <HashRouter>
                <Router />
            </HashRouter>
        </CookiesProvider>
    </Provider>

);