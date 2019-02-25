/**
 * 
 * File that collect login or auto-login related functions
 * 
 */

import * as api from './api';
import Store from './store';
import { action } from './modules';
import Socket from './socket';

export async function login(username, password, store=true){

    const { user, access_token } = await api.user.login(username, password);

    Store.dispatch(action.base.setUser(user, access_token));

    if (store){
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("userId", user._id);
        Socket.whatIsMe();
    }

}

export async function setUserIntoReducerFromCache(){

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("access_token");

    // console.log(userId, accessToken)

    if ( accessToken ){

        const user = await api.user.getMe( userId, accessToken );
        if ( user ){
            Store.dispatch(action.base.setUser(user, accessToken));
            Socket.whatIsMe();
            Socket.renewLocation();
            return true;
        } else {
            localStorage.removeItem("userId");
            localStorage.removeItem("access_token");
            return false;
        }
    }

    return false;
}

export function clearInfo(){
    localStorage.removeItem("userId");
    localStorage.removeItem("access_token");
    Store.dispatch(action.base.setUser(null, null));
}