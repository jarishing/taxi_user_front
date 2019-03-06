import axios from 'axios';
import url from './url';
import store from '../store';

function Order( orderId ){
    return ['get', 'confirm', 'comment', 'cancel' ].reduce((proxy, prop)=>{
        if ( typeof Order[prop] === 'function' )
            proxy[prop] = Order[prop].bind(Order, orderId);
        return proxy;
    }, {});
}

Order.get = async function( orderId ){

    const access_token = store.getState().base.accessToken;

    const response = await axios.get(
        url+'/api/order/' + orderId, 
        { headers: { Authorization: 'Bearer ' + access_token }}
    );

    return response.data.data;
};

Order.confirm = async function( orderId ){

    const access_token = store.getState().base.accessToken;

    const response = await axios.post(
        url+'/api/order/' + orderId, 
        {  type:'confirm' },
        { headers: { Authorization: 'Bearer ' + access_token }}
    );

    return response.data;
};

Order.comment = async function(orderId, star, comment){

    const access_token = store.getState().base.accessToken;

    const response = await axios.post(
        url+'/api/order/' + orderId + '/comment', 
        {  type:'comment', star: star, comment: comment },
        { headers: { Authorization: 'Bearer ' + access_token }}
    );

    return response.data;
};

Order.cancel = async function( orderId ){
    
    const access_token = store.getState().base.accessToken;

    const response = await axios.post(
        url+'/api/order/' + orderId, 
        {  type:'cancel' },
        { headers: { Authorization: 'Bearer ' + access_token }}
    );

    return response.data;
};

Order.create = async function( requestBody ){

    const access_token = store.getState().base.accessToken;

    const response = await axios.post(
        url+'/api/order', 
        requestBody, 
        { headers: { Authorization: 'Bearer ' + access_token }}
    );

    return new Order(response.data.data._id);
};

Order.accepted = async function(){

    const access_token = store.getState().base.accessToken;

    const response = await axios.get(url+'/api/order', { 
        params: { status: 'accepted' },
        headers: { Authorization: 'Bearer ' + access_token }
    });

    return response.data.data;
};

Order.getCommentOrder = async function(){

    const access_token = store.getState().base.accessToken;

    const response = await axios.get(url+'/api/order', { 
        params: { status: 'accepted' },
        headers: { Authorization: 'Bearer ' + access_token }
    });

    return response.data.data;
};

Order.getAllOrder = async function(){

    const access_token = store.getState().base.accessToken;

    const response = await axios.get(url+'/api/order', { 
        params: { status: 'all' },
        headers: { Authorization: 'Bearer ' + access_token }
    });

    return response.data.data;
};

export default Order;