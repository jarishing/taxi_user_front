'use strict';

function PlaceRecord(place){
    this.place = place;
}

PlaceRecord.instance = null;

PlaceRecord.getInstance = function(){

    if ( this.instance )
        return this.instance;

    const place = localStorage.getItem('recent_place');

    if ( place )
        return new this(JSON.parse(place));
    else
        return new this([]);
}

PlaceRecord.prototype.save = function(){
    const stringify = JSON.stringify(this.place);
    localStorage.setItem('recent_place', stringify);
}

PlaceRecord.prototype.push = function( place ){

    if ( this.place.find( item => item.address == place.address ))
        return;

    if ( this.place.length > 2)
        this.place.pop();
    this.place.unshift(place);
    this.save();
}

module.exports = exports = PlaceRecord;
