module.exports = exports = (... array) => 
    array.filter( item => item != null && item.toString ).map( item => item.toString()).join(' ');