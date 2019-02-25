import axios from 'axios';
import url from './url';
import store from '../store';

function User (body) {
    if (this instanceof User === false) {
        return new User(body);
    }
    Object.keys(body).forEach( key => {
        this[key] = body[key]
    });
}

/**
 * @param  {string} email
 * @param  {string} password
 * 
 * @returns {object} info { access_token, user }
 */
User.login = async function(phone, password) {
    const response = await axios.post( url + '/api/user/login', 
        {telephone_no: phone, password, type: 'user'}
    );
    const info = response.data;
    info.user = new this(info.user);
    return info;
};

User.getMe = async function(userId, access_token) {
    try {
        const response = await axios.get(
            url + '/api/user/' + userId, 
            { headers: { Authorization: `Bearer ${access_token}` }}
        );
        return new this(response.data);
    } catch ( error ){
        console.warn('AccessToken stored is not valid ');
    }
};


User.getUser = async function(userId) {

    const access_token = store.getState().base.accessToken;
    
    try {
        const response = await axios.get(
            url + '/api/user/' + userId, 
            { headers: { Authorization: `Bearer ${access_token}` }}
        );
        return new this(response.data.data);
    } catch ( error ){
        console.warn('AccessToken stored is not valid ');
    }
};

export default User;

