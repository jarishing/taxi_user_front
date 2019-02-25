import io from "socket.io-client";
import Store from './store';
import { action } from './modules';
import url from './api/url';

function Socket(){
    this.io = null;
    this.socketId = null;
    this.interval;
    this.callback = _ => console.log(_);
}

Socket.prototype.connect = function(){
    const _this = this;
    this.io = io(url);

    this.io.on( 'connect', async function( socket ){
        _this.socketId = this.id;
        _this.renewLocation();
        _this.interval = setInterval( () => _this.renewLocation, 1000 * 10 );
        _this.whatIsMe();
    });

    this.io.on('action', data => {
        console.log('events:' + data)
        if ( this.callback )
            this.callback(data);
    });

    this.io.on('disconnect', _ => clearInterval(_this.interval));
};

Socket.prototype.renewLocation = function(){

    const _this = this;

    if ( navigator.geolocation )
        navigator.geolocation.getCurrentPosition((position)=>{
            const { latitude, longitude } = position.coords;
            console.log(_this)
            _this.io.emit('renew_location', { lat: latitude, lng: longitude });
            Store.dispatch(action.base.setLocation(latitude, longitude));
        })
    else
        console.log('no navigator')
};

Socket.prototype.whatIsMe = function( token ){
    const access_token = Store.getState().base.accessToken;
    if ( token || access_token )
        this.io.emit('what_is_me', token || access_token );
};

Socket.prototype.listen = function( callback ){
    this.callback = callback;
};

Socket.prototype.mute = function(){
    this.callback = null;
};

export default new Socket();
